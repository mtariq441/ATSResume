import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { storage } from "../../server/storage";

/**
 * GET /api/analysis/:id
 * Retrieve a specific analysis result by ID
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
        // Extract ID from path
        const pathParts = event.path.split("/");
        const id = pathParts[pathParts.length - 1];

        if (!id) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Analysis ID is required" }),
            };
        }

        const result = await storage.getAnalysis(id);

        if (!result) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: "Analysis not found" }),
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(result),
        };
    } catch (error) {
        console.error("Retrieval error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Failed to retrieve analysis"
            }),
        };
    }
};
