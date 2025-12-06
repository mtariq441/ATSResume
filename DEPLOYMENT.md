# Deployment Options

This project can be deployed to either **Vercel** or **Netlify**.

## Netlify Deployment (Recommended for this setup)

See [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) for complete instructions.

**Quick Start:**
1. Install dependencies: `npm install`
2. Build: `npm run build`
3. Deploy to Netlify via UI or CLI
4. Set environment variable: `GEMINI_API_KEY`

## Vercel Deployment

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete instructions.

## Key Differences

| Feature | Netlify | Vercel |
|---------|---------|--------|
| Function timeout (free) | 10s | 10s |
| Function timeout (paid) | 26s | 60s |
| Payload limit | 6MB | 4.5MB |

Both platforms work well for this application. Choose based on your preference and requirements.
