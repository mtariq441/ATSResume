# ATSResume - Local Development Setup

## ✅ Server is Running!

Your development server is now running on **http://localhost:5000**

### Current Status
- ✅ Express server started
- ✅ Vite dev server ready
- ✅ Port: 5000
- ⚠️ Database: In-memory (no persistence)
- ⚠️ Gemini API: Not configured (AI analysis disabled)

## 🚀 Quick Start

### Step 1: Access the Application
Open your browser and go to:
```
http://localhost:5000
```

### Step 2: Test the Application
1. Upload a resume (PDF, DOCX, DOC, or TXT)
2. Enter a job description
3. Click "Analyze" to see the results

**Note**: Without Gemini API key and database, analysis will show mock results.

## 🔧 Enable Full Features (Optional)

### Add Gemini API Key
To enable AI-powered analysis:

1. Edit `.env` file
2. Add your Gemini API key:
   ```
   GEMINI_API_KEY=AIzaSyAFfl0VREcv_Z5Gbi4ICtAibQ1SchLqNfw
   ```
3. Restart the dev server (Ctrl+C, then `npm run dev`)

### Add Database Connection
To persist analysis results:

1. Edit `.env` file
2. Add your Supabase connection string:
   ```
   DATABASE_URL=postgresql://postgres:12345@db.yieqegqehnxvicfkbpmb.supabase.co:5432/postgres
   DATABASE_POOL_URL=postgresql://postgres.yieqegqehnxvicfkbpmb:12345@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres
   ```
3. Run migrations:
   ```
   npm run db:push
   ```
4. Restart the dev server

## 📁 Project Structure

```
ATSResume-main/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
│   └── index.html         # Entry point
│
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database setup
│   ├── gemini.ts          # Gemini AI integration
│   └── storage.ts         # Data storage
│
├── shared/                 # Shared types & schemas
│   └── schema.ts          # Zod schemas
│
├── migrations/            # Database migrations
├── netlify/               # Netlify functions
├── types/                 # TypeScript declarations
│
├── .env                   # Environment variables
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── tailwind.config.ts     # Tailwind CSS configuration
```

## 🛠️ Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database migrations
npm run db:push
```

## 📝 Development Tips

### Hot Reload
The dev server supports hot module replacement (HMR). Changes to React components will automatically reload in the browser.

### Console Logging
Open browser DevTools (F12) to see:
- Client-side logs
- Network requests
- Console errors

### Server Logs
The terminal shows:
- Server startup messages
- API request logs
- Error messages

### File Upload Testing
You can test with these file types:
- **PDF**: Any PDF file
- **DOCX**: Microsoft Word documents
- **DOC**: Older Word format
- **TXT**: Plain text files

## 🐛 Troubleshooting

### Port Already in Use
If port 5000 is already in use:
```bash
# Change port in .env
PORT=3000
npm run dev
```

### Module Not Found Errors
```bash
# Reinstall dependencies
rm -r node_modules
npm install
npm run dev
```

### TypeScript Errors
```bash
# Check TypeScript
npm run check

# Fix common issues
npm run build
```

### Database Connection Issues
```bash
# Test database connection
npm run db:push

# If it fails, ensure DATABASE_URL is set in .env
```

## 🔍 Debugging

### Enable Debug Logging
Add to `.env`:
```
DEBUG=express:*
```

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Upload a resume
4. Check request/response details

### View Server Logs
The terminal shows all server activity:
```
6:01:06 PM [express] serving on port 5000
POST /api/extract-text 200 in 234ms
POST /api/analyze 200 in 1234ms
```

## 📚 Next Steps

1. **Explore the Code**
   - Check `client/src/pages/home.tsx` for UI
   - Check `server/routes.ts` for API endpoints
   - Check `server/gemini.ts` for AI integration

2. **Make Changes**
   - Edit React components in `client/src/`
   - Edit API routes in `server/routes.ts`
   - Changes auto-reload in browser

3. **Test Features**
   - Upload different file types
   - Test with various job descriptions
   - Check browser console for errors

4. **Deploy to Production**
   - See `DEPLOYMENT_QUICK_START.md`
   - See `SAAS_MVP_SETUP.md`

## 🎯 What to Test Locally

### File Upload
- [ ] Upload PDF file
- [ ] Upload DOCX file
- [ ] Upload DOC file
- [ ] Upload TXT file
- [ ] Try file > 10MB (should fail)
- [ ] Try invalid file type (should fail)

### UI/UX
- [ ] Drag and drop file
- [ ] Click to browse files
- [ ] See loading indicator
- [ ] See results display
- [ ] Check responsive design (mobile view)

### Error Handling
- [ ] Upload corrupted PDF
- [ ] Network error (disable internet)
- [ ] API error (invalid input)

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review error messages in console
3. Check server logs in terminal
4. See troubleshooting section above

---

**Status**: ✅ Development Server Running
**URL**: http://localhost:5000
**Port**: 5000
**Last Updated**: December 6, 2025

**Happy coding! 🚀**
