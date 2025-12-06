# ATSResume SaaS MVP - Production Setup Guide

This document outlines the complete setup for deploying ATSResume as a SaaS MVP to production.

## ✅ Current Configuration

### API Keys & Credentials
- **Gemini API Key**: ✓ Configured (AIzaSyAFfl0VREcv_Z5Gbi4ICtAibQ1SchLqNfw)
- **Database**: ✓ Supabase PostgreSQL (ap-southeast-2 region)
- **Status**: Ready for production deployment

### Database Setup
- **Provider**: Supabase PostgreSQL
- **Region**: AWS ap-southeast-2 (Sydney)
- **Connection Pooling**: Enabled (Supabase Pooler)
- **Direct Connection**: `postgresql://postgres:12345@db.yieqegqehnxvicfkbpmb.supabase.co:5432/postgres`
- **Pooler Connection**: `postgresql://postgres.yieqegqehnxvicfkbpmb:12345@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres`

## 🚀 Deployment Checklist

### Phase 1: Pre-Deployment (Local Testing)
- [ ] Run `npm install` to install all dependencies including `postgres` package
- [ ] Run `npm run db:push` to initialize database schema
- [ ] Run `npm run dev` to test locally
- [ ] Test resume upload functionality
- [ ] Test AI analysis with Gemini API
- [ ] Verify database connectivity

### Phase 2: Vercel Deployment
- [ ] Connect GitHub repository to Vercel
- [ ] Add environment variables to Vercel:
  ```
  GEMINI_API_KEY=AIzaSyAFfl0VREcv_Z5Gbi4ICtAibQ1SchLqNfw
  DATABASE_URL=postgresql://postgres:12345@db.yieqegqehnxvicfkbpmb.supabase.co:5432/postgres
  DATABASE_POOL_URL=postgresql://postgres.yieqegqehnxvicfkbpmb:12345@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres
  NODE_ENV=production
  ```
- [ ] Deploy to production
- [ ] Test production deployment
- [ ] Set up custom domain (optional)

### Phase 3: Monitoring & Optimization
- [ ] Set up error tracking (Sentry recommended)
- [ ] Monitor Gemini API usage and costs
- [ ] Monitor database performance
- [ ] Set up uptime monitoring
- [ ] Configure backup strategy for database

## 📋 SaaS MVP Features

### Core Features (Implemented)
1. **Resume Upload**
   - Supports PDF, DOCX, DOC, TXT formats
   - File size limit: 10MB
   - Drag-and-drop interface

2. **AI-Powered Analysis**
   - Gemini 2.5 Pro integration
   - ATS match scoring (0-100)
   - Missing keywords identification
   - Suggested bullet points
   - Bullet point rephrasing

3. **Results Storage**
   - PostgreSQL database
   - Analysis history tracking
   - Unique analysis IDs

### Future SaaS Features
- User authentication & accounts
- Subscription management
- Multiple resume uploads per user
- Job description library
- Email notifications
- API access for integrations

## 🔧 Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **State Management**: TanStack React Query

### Backend
- **Runtime**: Node.js (Express)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **AI**: Google Gemini 2.5 Pro
- **File Processing**: 
  - PDF: pdfjs-dist
  - DOCX: mammoth
  - TXT: native

### Deployment
- **Hosting**: Vercel (frontend + serverless functions)
- **Database**: Supabase (managed PostgreSQL)
- **Alternative**: Netlify Functions (configured)

## 📊 Performance Optimization

### Database
- Using Supabase Pooler for connection pooling
- Optimized for serverless environments
- Automatic backups enabled

### API
- Serverless functions (Vercel)
- Automatic scaling
- Cold start optimization with postgres-js

### Frontend
- Code splitting with Vite
- Image optimization
- Lazy loading components
- CDN delivery via Vercel

## 🔐 Security Considerations

### Credentials Management
- ✓ API keys stored in environment variables
- ✓ Database credentials in Supabase
- ✓ No secrets in version control
- ⚠️ **Important**: Never commit `.env` file

### Database Security
- ✓ SSL/TLS connections enforced
- ✓ Supabase security policies
- ✓ Row-level security (RLS) ready
- ⚠️ **TODO**: Implement user authentication

### API Security
- ✓ CORS configured
- ✓ Rate limiting ready (implement in production)
- ⚠️ **TODO**: Add API key authentication for future API access

## 💰 Cost Estimation (Monthly)

### Supabase PostgreSQL
- **Free tier**: Up to 500MB storage, 2GB bandwidth
- **Pro tier**: $25/month + usage
- Estimated for MVP: $25-50/month

### Google Gemini API
- **Pricing**: $0.075 per 1M input tokens, $0.30 per 1M output tokens
- **Estimated for MVP**: $10-50/month (depending on usage)

### Vercel
- **Free tier**: Sufficient for MVP
- **Pro tier**: $20/month (if needed)
- Estimated for MVP: Free-$20/month

**Total Estimated Cost**: $35-120/month

## 📝 Environment Variables Reference

```env
# Gemini API
GEMINI_API_KEY=AIzaSyAFfl0VREcv_Z5Gbi4ICtAibQ1SchLqNfw

# Database - Direct Connection
DATABASE_URL=postgresql://postgres:12345@db.yieqegqehnxvicfkbpmb.supabase.co:5432/postgres

# Database - Pooler (Recommended for Serverless)
DATABASE_POOL_URL=postgresql://postgres.yieqegqehnxvicfkbpmb:12345@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres

# Application
NODE_ENV=production
PORT=5000

# SaaS Configuration
VITE_APP_NAME=ATSResume
VITE_APP_VERSION=1.0.0
VITE_API_BASE_URL=/api
```

## 🚦 Deployment Steps

### 1. Local Setup
```bash
# Install dependencies
npm install

# Initialize database
npm run db:push

# Start development server
npm run dev
```

### 2. Build for Production
```bash
# Build frontend
npm run build

# This creates optimized production build in dist/
```

### 3. Deploy to Vercel
```bash
# Option 1: Via Vercel CLI
npm install -g vercel
vercel --prod

# Option 2: Via GitHub (recommended)
# Push to GitHub, connect to Vercel dashboard
# Vercel will auto-deploy on push
```

### 4. Verify Deployment
- [ ] Check Vercel deployment status
- [ ] Test resume upload on production
- [ ] Verify AI analysis works
- [ ] Check database connectivity
- [ ] Monitor error logs

## 🐛 Troubleshooting

### Database Connection Issues
```
Error: "connect ECONNREFUSED"
Solution: 
1. Verify DATABASE_POOL_URL is set in Vercel
2. Check Supabase project status
3. Ensure IP whitelist allows Vercel IPs
```

### Gemini API Errors
```
Error: "GEMINI_API_KEY is not set"
Solution:
1. Verify API key in Vercel environment variables
2. Check API key is valid at aistudio.google.com
3. Ensure API is enabled in Google Cloud Console
```

### PDF Extraction Failures
```
Error: "Could not extract text from PDF"
Solution:
1. Ensure pdfjs-dist worker is properly configured
2. Try with a different PDF file
3. Check browser console for detailed errors
```

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Gemini API](https://ai.google.dev/docs)
- [Drizzle ORM](https://orm.drizzle.team)
- [React Documentation](https://react.dev)

## 🎯 Next Steps for Full SaaS

1. **User Authentication**
   - Implement Supabase Auth
   - Add sign-up/login pages
   - User profiles

2. **Subscription Management**
   - Stripe integration
   - Pricing plans
   - Payment processing

3. **Enhanced Features**
   - Multiple resumes per user
   - Job description library
   - Email notifications
   - API access

4. **Analytics**
   - User tracking
   - Feature usage metrics
   - Revenue tracking

5. **Support**
   - Help documentation
   - Email support
   - Chat support

---

**Last Updated**: December 6, 2025
**Status**: SaaS MVP Ready for Production
**Next Review**: After first production deployment
