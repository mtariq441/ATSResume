import type { VercelRequest, VercelResponse } from '@vercel/node';
import { analyzeResumeWithGemini } from '../server/gemini';
import { analyzeRequestSchema } from '../shared/schema';
import { fromZodError } from 'zod-validation-error';

/**
 * POST /api/analyze
 * Analyzes a resume against a job description using Gemini AI
 * 
 * This endpoint works perfectly in Vercel's serverless environment
 * as it returns results directly without needing persistent storage.
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Enable CORS for frontend access
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  try {
    // Validate request body
    const validation = analyzeRequestSchema.safeParse(req.body);

    if (!validation.success) {
      const validationError = fromZodError(validation.error);
      return res.status(400).json({ 
        error: validationError.message 
      });
    }

    const { resume_text, job_description } = validation.data;

    // Call Gemini AI to analyze the resume
    const analysisData = await analyzeResumeWithGemini(resume_text, job_description);

    // Return the analysis result directly
    // Note: In serverless environment, we don't store results in memory
    // as they won't persist across function invocations
    const result = {
      id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      ...analysisData
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to analyze resume' 
    });
  }
}
