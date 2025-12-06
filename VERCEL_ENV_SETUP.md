# Vercel Environment Variables Setup Guide

This guide explains how to configure environment variables for deploying ATSResume to Vercel.

## Required Environment Variables

### 1. **GEMINI_API_KEY** (Required)
- **Purpose**: Google Gemini API key for AI-powered resume analysis
- **How to get it**:
  1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
  2. Click "Create API Key"
  3. Copy the generated key
- **Example**: `AIzaSyD...` (long alphanumeric string)

### 2. **DATABASE_URL** (Required)
- **Purpose**: PostgreSQL database connection string for storing analysis results
- **Recommended**: Use [Neon](https://neon.tech) for serverless PostgreSQL
- **How to get it**:
  1. Create a Neon account at [neon.tech](https://neon.tech)
  2. Create a new project
  3. Copy the connection string (includes username, password, host, database)
  4. Ensure it includes `?sslmode=require` at the end
- **Example**: `postgresql://user:password@ep-xyz.us-east-1.neon.tech/dbname?sslmode=require`

### 3. **NODE_ENV** (Optional but recommended)
- **Purpose**: Specifies the environment (production/development)
- **Value for Vercel**: `production`
- **Default**: `production` (Vercel sets this automatically)

### 4. **PORT** (Optional)
- **Purpose**: Server port for local development
- **Value**: `5000` (default)
- **Note**: Vercel will override this automatically, only needed for local development

## Setting Up Environment Variables in Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your ATSResume project
3. Click **Settings** → **Environment Variables**
4. Add each variable:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your actual API key
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**
6. Repeat for `DATABASE_URL`
7. Redeploy your project for changes to take effect

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm install -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add GEMINI_API_KEY
vercel env add DATABASE_URL
vercel env add NODE_ENV

# Deploy
vercel --prod
```

### Method 3: Via `.env.local` (Local Development Only)

Create a `.env.local` file in the project root:

```env
GEMINI_API_KEY=your_actual_key_here
DATABASE_URL=your_actual_connection_string_here
NODE_ENV=development
PORT=5000
```

⚠️ **IMPORTANT**: Never commit `.env.local` to version control. It's already in `.gitignore`.

## Deployment Checklist

- [ ] Created Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
- [ ] Set up Neon PostgreSQL database at [neon.tech](https://neon.tech)
- [ ] Added `GEMINI_API_KEY` to Vercel environment variables
- [ ] Added `DATABASE_URL` to Vercel environment variables
- [ ] Verified variables are set for Production environment
- [ ] Redeployed project after adding variables
- [ ] Tested resume upload and analysis functionality

## Troubleshooting

### "GEMINI_API_KEY is not set" Error
- **Cause**: API key not configured in Vercel
- **Solution**: 
  1. Go to Vercel Dashboard → Settings → Environment Variables
  2. Verify `GEMINI_API_KEY` is added and set to Production
  3. Redeploy the project

### "DATABASE_URL environment variable is not set" Warning
- **Cause**: Database not configured (optional for development)
- **Solution**:
  1. Set up Neon PostgreSQL
  2. Add `DATABASE_URL` to Vercel environment variables
  3. Run migrations: `npm run db:push`

### "Failed to analyze resume" Error
- **Cause**: Usually API key or database issues
- **Solution**:
  1. Check browser console for detailed error
  2. Verify both `GEMINI_API_KEY` and `DATABASE_URL` are set
  3. Test API key at [aistudio.google.com](https://aistudio.google.com)
  4. Check Vercel logs: Dashboard → Deployments → View Logs

## Security Best Practices

1. **Never commit secrets**: Always use Vercel's environment variable system
2. **Use strong API keys**: Google Gemini API keys are sensitive
3. **Rotate keys periodically**: Regenerate API keys if compromised
4. **Limit database access**: Use Neon's IP whitelist if available
5. **Monitor usage**: Check Gemini API quota and database connections regularly

## Local Development

For local development, create a `.env.local` file:

```bash
cp .env.example .env.local
# Edit .env.local with your actual credentials
```

Then run:
```bash
npm run dev
```

## Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/projects/environment-variables)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Neon PostgreSQL Documentation](https://neon.tech/docs)
- [ATSResume Deployment Guide](./DEPLOYMENT.md)
