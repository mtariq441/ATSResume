# Vercel Deployment Guide - ATS Resume Analyzer

This guide will help you deploy the ATS Resume Analyzer to Vercel's serverless platform.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Deployment](#quick-deployment)
- [Environment Variables](#environment-variables)
- [Local Development vs Production](#local-development-vs-production)
- [Storage Limitations](#storage-limitations)
- [Database Setup (Optional)](#database-setup-optional)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier works)
2. A [Google AI Studio API key](https://aistudio.google.com/apikey) for Gemini AI
3. [Vercel CLI](https://vercel.com/cli) installed (optional, for command-line deployment)
   ```bash
   npm i -g vercel
   ```

---

## Quick Deployment

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Environment Variables** (see [Environment Variables](#environment-variables) section below)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (~2-3 minutes)
   - Your app will be live at `https://your-project.vercel.app`

### Method 2: Deploy via Vercel CLI

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Set environment variable**
   ```bash
   vercel env add GEMINI_API_KEY
   # Paste your Gemini API key when prompted
   # Select "Production", "Preview", and "Development" environments
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

---

## Environment Variables

### Required Environment Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `GEMINI_API_KEY` | Google Gemini AI API key | [Google AI Studio](https://aistudio.google.com/apikey) |

### Setting Environment Variables in Vercel Dashboard

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add `GEMINI_API_KEY`:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Your Gemini API key (starts with `AIza...`)
   - **Environment**: Select all three (Production, Preview, Development)
4. Click "Save"
5. **Important**: Redeploy your application for changes to take effect
   - Go to "Deployments" tab
   - Click the three dots (⋯) on the latest deployment
   - Click "Redeploy"

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (it starts with `AIza...`)
5. **Important**: Keep this key secure and never commit it to your repository

---

## Local Development vs Production

### Local Development (Express Server)

When running locally with `npm run dev`:
- ✅ Full Express server with in-memory storage
- ✅ All endpoints work (`/api/analyze`, `/api/analysis/:id`, `/api/analyses`)
- ✅ Results are stored in memory for the session
- ✅ Hot reload with Vite

**Start local development:**
```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5000`

### Production (Vercel Serverless)

When deployed to Vercel:
- ✅ `/api/analyze` - **Fully functional** - analyzes resume and returns results directly
- ⚠️ `/api/analysis/:id` - **Requires database** - cannot retrieve past results without database
- ⚠️ `/api/analyses` - **Requires database** - cannot list past results without database
- ✅ Static frontend served from CDN
- ✅ Automatic scaling and global distribution
- ✅ HTTPS by default

---

## Storage Limitations

### How It Works in Production

**The Main Endpoint (`/api/analyze`) Works Perfectly:**
- When a user uploads a resume and job description
- The serverless function analyzes it using Gemini AI
- Results are returned directly to the user
- **No database needed** for this core functionality

**Retrieval Endpoints Need a Database:**
- Vercel serverless functions are **stateless**
- In-memory storage does NOT persist across function invocations
- To retrieve past analyses, you need a persistent database

### Current Behavior

| Endpoint | Local Development | Vercel Production |
|----------|------------------|-------------------|
| `POST /api/analyze` | ✅ Works, stores in memory | ✅ Works, returns directly |
| `GET /api/analysis/:id` | ✅ Works, retrieves from memory | ❌ Returns 501 (not implemented) |
| `GET /api/analyses` | ✅ Works, retrieves from memory | ❌ Returns 501 (not implemented) |

### Workaround for Now

If you want to keep results without a database:
1. Have users download their analysis results as JSON/PDF
2. Store results in browser localStorage on the frontend
3. Use the analysis immediately and don't rely on retrieval

---

## Database Setup (Optional)

If you want to enable the retrieval endpoints (`/api/analysis/:id` and `/api/analyses`), you need to set up a database.

### Recommended Database Options

#### Option 1: Vercel Postgres (Easiest)

1. **Create a Postgres database:**
   - In your Vercel project dashboard
   - Go to "Storage" tab
   - Click "Create Database"
   - Select "Postgres"
   - Follow the setup wizard

2. **Environment variables are automatically added**
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`

3. **Update your API functions:**
   - Install `@vercel/postgres`: `npm install @vercel/postgres`
   - Modify `api/analyze.ts` to store results:
     ```typescript
     import { sql } from '@vercel/postgres';
     
     // After analysis:
     await sql`
       INSERT INTO analyses (id, match_score, score_breakdown, missing_keywords, 
                            new_bullet_points_to_add, bullets_to_rephrase, 
                            one_sentence_summary, created_at)
       VALUES (${result.id}, ${result.match_score}, ${JSON.stringify(result.score_breakdown)},
               ${JSON.stringify(result.missing_keywords)}, ${JSON.stringify(result.new_bullet_points_to_add)},
               ${JSON.stringify(result.bullets_to_rephrase)}, ${result.one_sentence_summary}, 
               ${result.created_at})
     `;
     ```

4. **Create the table schema:**
   ```sql
   CREATE TABLE analyses (
     id TEXT PRIMARY KEY,
     match_score INTEGER NOT NULL,
     score_breakdown JSONB NOT NULL,
     missing_keywords JSONB NOT NULL,
     new_bullet_points_to_add JSONB NOT NULL,
     bullets_to_rephrase JSONB NOT NULL,
     one_sentence_summary TEXT NOT NULL,
     created_at TIMESTAMP NOT NULL
   );
   ```

#### Option 2: Neon (Serverless Postgres)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to Vercel environment variables as `DATABASE_URL`
5. Use `@neondatabase/serverless` (already in package.json)

#### Option 3: Supabase

1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Get the database URL from Settings → Database
4. Add to Vercel environment variables as `DATABASE_URL`

#### Option 4: MongoDB Atlas

1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get the connection string
4. Add to Vercel environment variables as `MONGODB_URI`

---

## Build Configuration

The project is configured via `vercel.json`:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs20.x"
    }
  }
}
```

### Build Script Breakdown

The `npm run build` command does:
1. `vite build` - Builds the React frontend to `dist/public`
2. `esbuild server/index.ts ...` - Bundles the Express server (for local use only)

**Note**: The `esbuild` part is not used by Vercel. Vercel only uses the Vite build output and the serverless functions in `api/`.

---

## Troubleshooting

### Issue: "GEMINI_API_KEY is not defined"

**Solution:**
1. Make sure you added the environment variable in Vercel dashboard
2. Redeploy the application after adding environment variables
3. Check the Environment Variables section matches "Production"

### Issue: "Analysis failed" or 500 error

**Possible causes:**
1. Invalid Gemini API key
2. Gemini API quota exceeded (free tier has limits)
3. Resume text or job description too short

**Solution:**
- Check Vercel function logs: Project → Deployments → Click deployment → Functions tab
- Verify API key is correct
- Check [Google AI Studio](https://aistudio.google.com/app/apikey) for quota

### Issue: "/api/analysis/:id returns 501"

**This is expected behavior** - see [Storage Limitations](#storage-limitations)

**Solution:** Set up a database (see [Database Setup](#database-setup-optional))

### Issue: Build fails

**Common causes:**
1. TypeScript errors
2. Missing dependencies

**Solution:**
```bash
# Locally test the build
npm run build

# Fix TypeScript errors
npm run check
```

### Issue: Function timeout (10s limit on free tier)

**Cause:** Gemini AI analysis taking too long

**Solutions:**
1. Upgrade to Vercel Pro (60s timeout)
2. Optimize the Gemini prompt to be shorter
3. Add timeout handling in the code

---

## Performance Considerations

### Cold Starts
- First request after inactivity may take 2-5 seconds
- Subsequent requests are faster (~500ms-1s)
- Vercel Pro reduces cold starts

### API Rate Limits
- **Gemini API (Free Tier)**: 15 requests/minute, 1,500 requests/day
- **Gemini API (Paid)**: Much higher limits
- Monitor usage at [Google AI Studio](https://aistudio.google.com/)

### Vercel Limits (Free Tier)
- 100 GB bandwidth/month
- 100,000 function invocations/month
- 10-second function timeout
- More info: [vercel.com/docs/limits](https://vercel.com/docs/limits)

---

## Custom Domain

1. **Add domain in Vercel:**
   - Project Settings → Domains
   - Enter your domain (e.g., `ats-analyzer.com`)
   - Follow DNS configuration instructions

2. **Update DNS:**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Wait for DNS propagation (5-30 minutes)

3. **Automatic HTTPS:**
   - Vercel automatically provisions SSL certificates
   - No additional configuration needed

---

## Next Steps

After successful deployment:

1. ✅ Test the `/api/analyze` endpoint with a real resume
2. ✅ Monitor function logs for any errors
3. ⚠️ (Optional) Set up a database to enable retrieval endpoints
4. ✅ Set up a custom domain
5. ✅ Configure analytics (Vercel Analytics)
6. ✅ Set up monitoring (Vercel Monitoring)

---

## Support

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Gemini AI Documentation**: [ai.google.dev](https://ai.google.dev)

---

## Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Frontend | ✅ Ready | Served from CDN |
| `/api/analyze` | ✅ Ready | Core functionality works |
| `/api/analysis/:id` | ⚠️ Needs DB | Optional feature |
| `/api/analyses` | ⚠️ Needs DB | Optional feature |
| Environment Variables | ✅ Ready | Set GEMINI_API_KEY |
| HTTPS | ✅ Auto | Vercel provides SSL |
| Custom Domain | ✅ Ready | Configure in dashboard |

**The core ATS analysis feature works perfectly on Vercel without a database!**
