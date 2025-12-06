# Netlify Deployment Guide

This guide will help you deploy the ATS Resume application to Netlify.

## Prerequisites

- A [Netlify account](https://app.netlify.com/signup) (free tier works)
- A [Google AI API key](https://aistudio.google.com/app/apikey) for Gemini AI
- Git repository (GitHub, GitLab, or Bitbucket)

## Important Limitations

> [!WARNING]
> **Function Timeout**: Netlify Functions have a **10-second execution timeout** on the free tier (26 seconds on paid plans). The Gemini AI analysis might timeout for complex resumes. If you experience timeouts:
> - Upgrade to a paid Netlify plan for 26-second timeout
> - Consider Netlify Background Functions (requires paid plan)
> - Use an alternative backend deployment platform

> [!WARNING]
> **File Upload Size**: Netlify Functions have a **6MB payload limit**. Resume files larger than 6MB will fail to upload. The application will return an error message for oversized files.

> [!NOTE]
> **In-Memory Storage**: By default, analysis results are stored in memory and will be lost between deployments. For persistent storage, configure a PostgreSQL database (see Database Setup section).

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install the new Netlify-specific dependencies:
- `@netlify/functions` - Netlify Functions runtime
- `parse-multipart-data` - For handling file uploads

### 2. Build the Project

Test that the build works locally:

```bash
npm run build
```

This will create a `dist` directory with your production-ready frontend.

### 3. Deploy to Netlify

#### Option A: Deploy via Netlify UI (Recommended)

1. **Push to Git**: Commit and push all changes to your Git repository

2. **Connect to Netlify**:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository

3. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
   
   (These are automatically configured via `netlify.toml`)

4. **Set Environment Variables**:
   - Go to Site settings → Environment variables
   - Add the following variable:
     - `GEMINI_API_KEY`: Your Google AI API key
   - Optional (for database):
     - `DATABASE_URL`: Your PostgreSQL connection string

5. **Deploy**: Click "Deploy site"

#### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize Site**:
   ```bash
   netlify init
   ```

4. **Set Environment Variables**:
   ```bash
   netlify env:set GEMINI_API_KEY "your-api-key-here"
   ```

5. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

## Environment Variables

The following environment variables are required:

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Google AI API key for resume analysis |
| `DATABASE_URL` | ❌ Optional | PostgreSQL connection string for persistent storage |
| `NODE_VERSION` | ❌ Optional | Node.js version (default: 20, configured in netlify.toml) |

## Database Setup (Optional)

By default, analysis results are stored in memory and will be lost between deployments. For persistent storage:

### Using Neon (Recommended)

1. Create a free account at [Neon](https://neon.tech/)
2. Create a new project
3. Copy the connection string
4. Add to Netlify environment variables as `DATABASE_URL`

### Using Vercel Postgres

1. Create a Vercel account and Postgres database
2. Copy the connection string
3. Add to Netlify environment variables as `DATABASE_URL`

### Run Migrations

After setting up the database:

```bash
npm run db:push
```

## Testing Locally with Netlify Dev

You can test Netlify Functions locally:

1. **Install Netlify CLI** (if not already installed):
   ```bash
   npm install -g netlify-cli
   ```

2. **Run Netlify Dev**:
   ```bash
   netlify dev
   ```

This will start a local development server that simulates the Netlify environment.

## API Endpoints

After deployment, your API will be available at:

- `POST /api/extract-text` - Extract text from uploaded resume file
- `POST /api/analyze` - Analyze resume against job description
- `GET /api/analysis/:id` - Get specific analysis result
- `GET /api/analyses` - List all analysis results

## Troubleshooting

### Build Fails

**Error**: `Module not found: @netlify/functions`

**Solution**: Run `npm install` to install all dependencies

### Function Timeout

**Error**: `Task timed out after 10.00 seconds`

**Solution**: 
- Upgrade to Netlify Pro for 26-second timeout
- Optimize resume text length
- Consider using Netlify Background Functions

### File Upload Fails

**Error**: `File too large`

**Solution**: 
- Ensure resume files are under 6MB
- Compress PDF files before uploading
- Use DOCX format which is typically smaller

### CORS Errors

**Error**: `Access-Control-Allow-Origin` errors

**Solution**: CORS headers are already configured in the functions. If issues persist, check browser console for specific errors.

### Database Connection Issues

**Error**: `Database not initialized`

**Solution**:
- Verify `DATABASE_URL` is set correctly in environment variables
- Ensure database is accessible from Netlify (check firewall rules)
- Run `npm run db:push` to create tables

## Performance Optimization

### Reduce Function Cold Starts

- Keep functions small and focused
- Minimize dependencies in function files
- Consider upgrading to Netlify Pro for reduced cold starts

### Optimize Build Time

- The build is already optimized with Vite
- Build time should be under 2 minutes

## Monitoring

### View Function Logs

1. Go to your Netlify site dashboard
2. Click "Functions" tab
3. Click on a function to view logs
4. Check for errors or timeout issues

### Analytics

Netlify provides basic analytics on the free tier:
- Page views
- Bandwidth usage
- Function invocations

## Next Steps

After successful deployment:

1. ✅ Test file upload with a sample resume
2. ✅ Test resume analysis with a job description
3. ✅ Monitor function logs for any errors
4. ✅ Set up custom domain (optional)
5. ✅ Configure database for persistent storage (optional)

## Support

For issues specific to:
- **Netlify deployment**: [Netlify Support](https://www.netlify.com/support/)
- **Gemini AI**: [Google AI Studio](https://aistudio.google.com/)
- **Application bugs**: Check the GitHub repository issues

## Differences from Vercel

| Feature | Vercel | Netlify |
|---------|--------|---------|
| Function timeout (free) | 10s | 10s |
| Function timeout (paid) | 60s | 26s |
| Payload limit | 4.5MB | 6MB |
| Build minutes (free) | 6000/month | 300/month |
| Bandwidth (free) | 100GB | 100GB |

The application has been adapted to work within Netlify's constraints while maintaining full functionality.
