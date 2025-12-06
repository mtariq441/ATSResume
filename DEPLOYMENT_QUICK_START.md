# Quick Start: Deploy ATSResume SaaS MVP

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js 18+ installed
- Git installed
- Vercel account (free)
- GitHub account (for auto-deployment)

### Step 1: Install Dependencies (2 min)
```bash
npm install
```

### Step 2: Test Locally (2 min)
```bash
npm run dev
```
- Open http://localhost:5000
- Test resume upload
- Test AI analysis

### Step 3: Deploy to Vercel (1 min)

#### Option A: Via GitHub (Recommended)
```bash
# 1. Push to GitHub
git add .
git commit -m "SaaS MVP ready for production"
git push origin main

# 2. Go to https://vercel.com/dashboard
# 3. Click "Add New" → "Project"
# 4. Select your GitHub repository
# 5. Add environment variables (see below)
# 6. Click "Deploy"
```

#### Option B: Via Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

### Step 4: Configure Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables:
```
GEMINI_API_KEY = AIzaSyAFfl0VREcv_Z5Gbi4ICtAibQ1SchLqNfw
DATABASE_URL = postgresql://postgres:12345@db.yieqegqehnxvicfkbpmb.supabase.co:5432/postgres
DATABASE_POOL_URL = postgresql://postgres.yieqegqehnxvicfkbpmb:12345@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres
NODE_ENV = production
```

### Step 5: Verify Deployment
- [ ] Check Vercel deployment status (should say "Ready")
- [ ] Visit your production URL
- [ ] Test resume upload
- [ ] Test AI analysis

## 🎉 Done!

Your SaaS MVP is now live! 

**Production URL**: https://your-project.vercel.app

## 📊 What's Included

✅ Resume upload (PDF, DOCX, DOC, TXT)
✅ AI-powered ATS analysis with Gemini
✅ Match scoring (0-100)
✅ Missing keywords detection
✅ Suggested bullet points
✅ Bullet point rephrasing
✅ PostgreSQL database for results
✅ Serverless deployment ready
✅ Automatic scaling
✅ SSL/TLS encryption

## 🔧 Troubleshooting

### "Deployment failed"
- Check Vercel logs: Dashboard → Deployments → View Logs
- Ensure all environment variables are set
- Verify Node.js version compatibility

### "Resume upload not working"
- Check browser console for errors
- Verify Gemini API key is valid
- Check Vercel function logs

### "Database connection error"
- Verify DATABASE_POOL_URL is set
- Check Supabase project status
- Ensure IP whitelist allows Vercel

## 📈 Next Steps

1. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor Gemini API usage
   - Track database performance

2. **Add Custom Domain**
   - In Vercel: Settings → Domains
   - Add your custom domain
   - Update DNS records

3. **Set Up Analytics**
   - Add Google Analytics
   - Track user behavior
   - Monitor conversion rates

4. **Implement Authentication** (Future)
   - Add user accounts
   - Implement subscription plans
   - Add payment processing

## 💬 Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Gemini API Docs**: https://ai.google.dev/docs

---

**Status**: ✅ Production Ready
**Last Updated**: December 6, 2025
