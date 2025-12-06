import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { analyzeResumeWithGemini } from "../../server/gemini";
import { analyzeRequestSchema } from "../../shared/schema";
import { fromZodError } from "zod-validation-error";

/**
 * POST /api/analyze
 * Analyzes a resume against a job description using Gemini AI
 * 
 * Note: Netlify Functions have a 10-second timeout on free tier (26s on paid)
 * The Gemini AI analysis might timeout for complex resumes
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    // Enable CORS
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Content-Type": "application/json",
    };

    // Handle preflight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    try {
        // Parse request body
        const body = JSON.parse(event.body || "{}");

        // Validate request body
        const validation = analyzeRequestSchema.safeParse(body);

        if (!validation.success) {
            const validationError = fromZodError(validation.error);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: validationError.message }),
            };
        }

        const { resume_text, job_description } = validation.data;

        console.log("Starting Gemini analysis...");

        // Call Gemini AI to analyze the resume
        const analysisData = await analyzeResumeWithGemini(resume_text, job_description);

        console.log("Gemini analysis complete.");

        // Return the analysis result directly
        // Note: In serverless environment, we don't store results in memory
        // as they won't persist across function invocations
        const result = {
            id: `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            created_at: new Date().toISOString(),
            ...analysisData
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.error("Analysis error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error instanceof Error ? error.message : "Failed to analyze resume"
            }),
        };
    }
};
