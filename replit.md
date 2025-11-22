# ATS Analyzer - SaaS MVP

## Project Overview
ATS Analyzer is a production-ready SaaS platform that uses Google Gemini AI to analyze resumes against job descriptions, providing real-time ATS scoring (0-100) with actionable improvement recommendations.

## Current Features (MVP - Complete ✅)
- **Resume Upload**: PDF, DOCX, DOC, TXT file support
- **Text Extraction**: Powered by unpdf library with Uint8Array conversion
- **AI Analysis**: Google Gemini-powered ATS scoring
- **Score Breakdown**: 
  - Hard skills match (45%)
  - Experience alignment (20%)
  - Keyword density (15%)
  - Education/certs (10%)
  - Title relevance (10%)
- **Recommendations**:
  - Missing keywords by category
  - New bullet points to add
  - Existing bullet points to rephrase
  - One-sentence candidate summary

## Tech Stack
- **Frontend**: React 18, Vite, Wouter routing, TailwindCSS, Shadcn UI
- **Backend**: Express.js, TypeScript
- **AI**: Google Gemini API (gemini-2.5-pro)
- **File Processing**: unpdf (PDF extraction), mammoth (DOCX/DOC extraction)
- **Build**: esbuild, Vite
- **Database**: PostgreSQL (via Supabase) - Ready for future features

## Environment Variables (All Set ✅)
```
GEMINI_API_KEY=AIzaSyBhMDBuT9dr6sCxU3y1dnw9hrNJn2oOJuM
DATABASE_URL=postgresql://postgres:12345@db.yieqegqehnxvicfkbpmb.supabase.co:5432/postgres
SUPABASE_URL=https://yieqegqehnxvicfkbpmb.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SESSION_SECRET=LRvaA0Ik8eylP/H/s6WcPQQobik/40SKfalX11rXIek77zb0m6cgjWWHdnXPsBRFG5f25gRlXWRgUqE7Jp3EOA==
```

## Project Structure
```
├── client/                 # React frontend
│   └── src/
│       ├── pages/         # Page components (home.tsx, results.tsx)
│       ├── components/    # Reusable UI components
│       └── lib/           # Utilities, API client, hooks
├── server/               # Express backend
│   ├── routes.ts        # API endpoints (/api/extract-text, /api/analyze)
│   ├── gemini.ts        # Gemini AI integration
│   ├── storage.ts       # MemStorage for current MVP
│   └── index.ts         # Server entry point
├── shared/              # Shared types & schemas
│   └── schema.ts        # Zod schemas for type safety
└── package.json         # Dependencies & scripts
```

## API Endpoints

### POST /api/extract-text
Extracts text from uploaded resume file
- Accepts: PDF, DOCX, DOC, TXT
- Returns: `{ text, fileName, fileSize }`

### POST /api/analyze
Analyzes resume against job description
- Body: `{ resume_text, job_description, file_name? }`
- Returns: Complete ATS analysis with match_score, recommendations

### GET /api/analysis/:id
Retrieves previously analyzed resume
- Returns: Full analysis result

## Deployment
- **Port**: 5000 (webview)
- **Build**: `npm run build`
- **Start**: `npm run start`
- **Dev**: `npm run dev` (starts on port 5000)

## Roadmap - Planned Features

### Phase 2: Admin Panel
- User authentication (SESSION_SECRET ready)
- Dashboard with analytics
- Analysis history tracking
- User management

### Phase 3: Blog & SEO
- Blog post management
- SEO-optimized content pages
- Dynamic sitemap generation
- Meta tag management

### Phase 4: Premium Features
- Saved analyses per user
- Resume comparison tool
- Job matching algorithm
- Career recommendations

## Development Guidelines
- Frontend: React with Wouter routing, TailwindCSS styling
- Backend: Express with TypeScript, Zod validation
- Database: Will use Supabase PostgreSQL when activated
- Auth: Session-based with SESSION_SECRET
- Always use environment variables for secrets

## Getting Started
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Access at: http://localhost:5000
4. For production: `npm run build && npm run start`

## Notes
- Current MVP uses in-memory storage (MemStorage)
- Production deployment ready with esbuild configuration
- All environment variables configured for future database & auth features
- PDF extraction fixed with Uint8Array conversion for unpdf compatibility