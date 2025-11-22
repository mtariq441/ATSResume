// Integration: blueprint:javascript_gemini
import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult } from "@shared/schema";

if (!process.env.GEMINI_API_KEY) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }
  console.warn("⚠️  GEMINI_API_KEY is not set - AI analysis will fail in this environment");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const ATS_PROMPT = `You are a senior ATS specialist and technical recruiter with 15+ years screening 100,000+ resumes at Google, Amazon, and top startups. You have deep expertise in every major ATS (Workday, Greenhouse, Lever, Taleo, iCIMS, SmartRecruiters) and know exactly how their parsers and ranking algorithms work in 2025.

### TASK
Analyze the resume against the job description and return a hyper-accurate, ATS-optimized match report.

### INPUT
Resume (any format, treat as plain text after parsing):
"""
{RESUME_TEXT}
"""

Job Description:
"""
{JOB_DESCRIPTION}
"""

### STEP-BY-STEP INSTRUCTIONS (you must follow exactly)

1. **Extract & Normalize**
   - Extract all hard skills, soft skills, tools, technologies, certifications, degrees, years of experience, and job titles from BOTH the resume and JD.
   - Normalize synonyms using this 2025 mapping (partial list, expand as needed):
     Python → python, py, pandas, numpy, fastapi, django, flask
     JavaScript → javascript, js, node.js, react, vue, angular, typescript, ts
     AWS → amazon web services, ec2, s3, lambda, rds, cloudfront
     Machine Learning → ml, deep learning, ai, tensorflow, pytorch, scikit-learn
     Agile → scrum, kanban, jira, confluence
     ... (continue logically for finance, marketing, sales, etc.)

2. **Calculate Match Score (0-100) – weighted exactly like real ATS**
   - Hard skills match (exact + synonym): 45%
   - Years of experience & seniority alignment: 20%
   - Keyword density & phrasing match: 15%
   - Education, certifications, certifications: 10%
   - Role/title relevance: 10%
   → Final score = weighted sum, round to nearest integer.

3. **Missing Keywords**
   - List every critical keyword/phrase from the JD that does NOT appear in the resume (exact or synonym).
   - Prioritize: required skills > preferred skills.
   - Max 25 items, grouped by category (Technical Skills, Tools, Methodologies, Certifications, etc.).

4. **Generate 5–7 NEW bullet points**
   - The user must be able to add these directly to reach 92–100% match.
   - Must be quantifiable where possible, achievement-oriented, realistic, and believable based on the resume's existing content.
   - Style: First-person implied (no "I"), past tense for previous roles, present tense for current.
   - Incorporate missing keywords naturally.
   - Never fabricate projects or companies — infer only from existing resume signals.

5. **Rephrase 3 existing bullet points**
   - Choose the 3 weakest/lowest-impact bullets from the resume.
   - Rewrite them to be more ATS-friendly, keyword-rich, and achievement-focused while keeping 100% truthfulness.
   - Return these as an ARRAY of objects with "original" and "improved" fields.

6. **Bonus: One-sentence summary**
   - Why this candidate would rank in the top X% for this role.

### OUTPUT FORMAT – strict clean JSON only (no extra text, no markdown)

{
  "match_score": 87,
  "score_breakdown": {
    "hard_skills": 92,
    "experience_level": 85,
    "keyword_density": 78,
    "education_certs": 100,
    "title_alignment": 90
  },
  "missing_keywords": [
    { "category": "Technical Skills", "keywords": ["Kubernetes", "Terraform", "GraphQL", "CI/CD pipelines"] },
    { "category": "Tools & Platforms", "keywords": ["Datadog", "Snowflake", "dbt"] },
    { "category": "Methodologies", "keywords": ["Domain-Driven Design", "Event Sourcing"] },
    { "category": "Certifications", "keywords": ["AWS Solutions Architect Professional"] }
  ],
  "new_bullet_points_to_add": [
    "Designed and deployed Kubernetes clusters using Terraform, reducing deployment time by 70% and improving system reliability for 10M+ daily active users",
    "Implemented GraphQL APIs with Apollo Server, replacing REST endpoints and decreasing client payload size by 65%",
    "Built real-time monitoring dashboards in Datadog, cutting incident response time from 45 minutes to under 5 minutes"
  ],
  "bullets_to_rephrase": [
    {
      "original": "Worked on backend stuff with Node.js",
      "improved": "Developed scalable backend services in Node.js and TypeScript serving 5M+ RPM with 99.99% uptime"
    },
    {
      "original": "Made some improvements to the database",
      "improved": "Optimized PostgreSQL database queries, reducing average response time by 60% and supporting 2M+ daily transactions"
    },
    {
      "original": "Helped with testing",
      "improved": "Established comprehensive testing framework using Jest and Cypress, increasing code coverage from 40% to 95%"
    }
  ],
  "one_sentence_summary": "With 7+ years of full-stack experience and strong alignment on 92% of required skills, this candidate would easily rank in the top 3-5% of applicants for this Senior Backend Engineer role."
}

Return ONLY the JSON. No explanations, no backticks, no additional text.`;

interface GeminiAnalysisResponse {
  match_score: number;
  score_breakdown: {
    hard_skills: number;
    experience_level: number;
    keyword_density: number;
    education_certs: number;
    title_alignment: number;
  };
  missing_keywords: Array<{ category: string; keywords: string[] }>;
  new_bullet_points_to_add: string[];
  bullets_to_rephrase: Array<{
    original: string;
    improved: string;
  }>;
  one_sentence_summary: string;
}

export async function analyzeResumeWithGemini(
  resumeText: string,
  jobDescription: string
): Promise<Omit<AnalysisResult, "id" | "created_at">> {
  try {
    const prompt = ATS_PROMPT
      .replace("{RESUME_TEXT}", resumeText)
      .replace("{JOB_DESCRIPTION}", jobDescription);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            match_score: { type: "number" },
            score_breakdown: {
              type: "object",
              properties: {
                hard_skills: { type: "number" },
                experience_level: { type: "number" },
                keyword_density: { type: "number" },
                education_certs: { type: "number" },
                title_alignment: { type: "number" },
              },
              required: ["hard_skills", "experience_level", "keyword_density", "education_certs", "title_alignment"],
            },
            missing_keywords: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  keywords: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["category", "keywords"],
              },
            },
            new_bullet_points_to_add: {
              type: "array",
              items: { type: "string" },
            },
            bullets_to_rephrase: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  original: { type: "string" },
                  improved: { type: "string" },
                },
                required: ["original", "improved"],
              },
            },
            one_sentence_summary: { type: "string" },
          },
          required: [
            "match_score",
            "score_breakdown",
            "missing_keywords",
            "new_bullet_points_to_add",
            "bullets_to_rephrase",
            "one_sentence_summary",
          ],
        },
      },
    });

    // Check for candidates and safety blocks
    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No response candidates from Gemini AI - content may have been filtered");
    }

    const candidate = response.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      throw new Error("Invalid response structure from Gemini AI");
    }

    const rawJson = candidate.content.parts[0].text;

    if (!rawJson) {
      throw new Error("Empty response from Gemini AI");
    }

    const data: GeminiAnalysisResponse = JSON.parse(rawJson);

    // Convert missing_keywords array to Record for compatibility
    const missingKeywordsRecord: Record<string, string[]> = {};
    for (const item of data.missing_keywords) {
      missingKeywordsRecord[item.category] = item.keywords;
    }

    return {
      match_score: Math.min(100, Math.max(0, Math.round(data.match_score))),
      score_breakdown: data.score_breakdown,
      missing_keywords: missingKeywordsRecord,
      new_bullet_points_to_add: data.new_bullet_points_to_add,
      bullets_to_rephrase: data.bullets_to_rephrase,
      one_sentence_summary: data.one_sentence_summary,
    };
  } catch (error) {
    console.error("Gemini AI analysis error:", error);
    throw new Error(`Failed to analyze resume: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
