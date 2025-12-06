import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { storage } from "../../server/storage";

/**
 * GET /api/analyses
 * List recent analysis results
 * 
 * Note: Uses in-memory storage by default (not persistent across deployments)
 * For persistent storage, configure DATABASE_URL environment variable
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    // Only allow GET requests
    if (event.httpMethod !== "GET") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    // Enable CORS
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Content-Type": "application/json",
    };

    // Handle preflight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    try {
        const limit = parseInt(event.queryStringParameters?.limit || "20");
        const results = await storage.listAnalyses(limit);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(results),
        };
    } catch (error) {
        console.error("List error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to list analyses"
            }),
        };
    }
};
