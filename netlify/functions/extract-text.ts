import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import multipart from "parse-multipart-data";

// Polyfill for DOMMatrix in Node.js environment
if (typeof global !== 'undefined' && !global.DOMMatrix) {
  (global as any).DOMMatrix = class DOMMatrix {
    constructor(public a = 1, public b = 0, public c = 0, public d = 1, public e = 0, public f = 0) {}
    multiply() { return this; }
    inverse() { return this; }
    translate() { return this; }
    scale() { return this; }
    rotate() { return this; }
    skewX() { return this; }
    skewY() { return this; }
  };
}

/**
 * POST /api/extract-text
 * Extract text from uploaded document (PDF, DOCX, DOC, TXT)
 * 
 * Note: Netlify Functions have a 6MB payload limit
 */
export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
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

    // Only allow POST requests
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: "Method not allowed" }),
        };
    }

    try {
        const contentType = event.headers["content-type"] || "";

        if (!contentType.includes("multipart/form-data")) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Content-Type must be multipart/form-data" }),
            };
        }

        // Parse multipart form data
        const boundary = contentType.split("boundary=")[1];
        if (!boundary) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "No boundary found in Content-Type" }),
            };
        }

        const bodyBuffer = Buffer.from(event.body || "", event.isBase64Encoded ? "base64" : "utf8");
        const parts = multipart.parse(bodyBuffer, boundary);

        const filePart = parts.find((part: any) => part.name === "file");
        if (!filePart) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "No file uploaded" }),
            };
        }

        const file = {
            buffer: Buffer.from(filePart.data),
            originalname: filePart.filename || "unknown",
            mimetype: filePart.type || "application/octet-stream",
            size: filePart.data.length,
        };

        console.log(`Processing file: ${file.originalname}, mimetype: ${file.mimetype}, size: ${file.size}`);

        // Check file size (Netlify has 6MB limit)
        if (file.size > 6 * 1024 * 1024) {
            return {
                statusCode: 413,
                headers,
                body: JSON.stringify({
                    error: "File too large. Netlify Functions have a 6MB payload limit. Please use a smaller file."
                }),
            };
        }

        let extractedText = "";

        // Handle PDF files
        if (file.mimetype === "application/pdf") {
            try {
                console.log("Extracting text from PDF...");

                // Use pdfjs-dist for better serverless compatibility
                const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
                
                // Configure worker for serverless environment
                // Use CDN URL for worker to avoid local file loading
                (pdfjsLib.GlobalWorkerOptions as any).workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

                // Load PDF from buffer
                const loadingTask = pdfjsLib.getDocument({
                    data: new Uint8Array(file.buffer),
                    useSystemFonts: true,
                    disableAutoFetch: true,
                    disableStream: true,
                    cMapPacked: true,
                });

                const pdfDocument = await loadingTask.promise;
                const numPages = pdfDocument.numPages;
                console.log(`PDF has ${numPages} pages`);

                // Extract text from all pages
                const textPromises = [];
                for (let i = 1; i <= numPages; i++) {
                    textPromises.push(
                        pdfDocument.getPage(i).then(async (page) => {
                            try {
                                const textContent = await page.getTextContent();
                                return textContent.items.map((item: any) => item.str || "").join(" ");
                            } catch (pageError) {
                                console.warn(`Could not extract text from page ${i}:`, pageError);
                                return "";
                            }
                        })
                    );
                }

                const pageTexts = await Promise.all(textPromises);
                extractedText = pageTexts.filter(text => text.length > 0).join("\n");

                if (!extractedText.trim()) {
                    throw new Error("No text content found in PDF");
                }

                console.log(`Successfully extracted ${extractedText.length} characters from PDF`);
            } catch (error) {
                console.error("PDF extraction error:", error);
                console.error("Error details:", {
                    name: error instanceof Error ? error.name : 'Unknown',
                    message: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined
                });
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: `Could not extract text from PDF file: ${error instanceof Error ? error.message : 'Unknown error'}. Please try a DOCX file instead.`
                    }),
                };
            }
        }
        // Handle DOCX files
        else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const mammoth = await import("mammoth");
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            extractedText = String(result.value || "");
        }
        // Handle DOC files (older format)
        else if (file.mimetype === "application/msword") {
            try {
                const mammoth = await import("mammoth");
                const result = await mammoth.extractRawText({ buffer: file.buffer });
                extractedText = String(result.value || "");
            } catch (error) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: "Could not extract text from DOC file. Please save as DOCX or PDF format."
                    }),
                };
            }
        }
        // Handle plain text files
        else if (file.mimetype === "text/plain") {
            extractedText = file.buffer.toString("utf-8");
        }
        else {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: "Unsupported file type. Please upload PDF, DOCX, DOC, or TXT files."
                }),
            };
        }

        const trimmedText = String(extractedText).trim();
        console.log(`Successfully extracted ${trimmedText.length} characters`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                text: trimmedText,
                fileName: file.originalname,
                fileSize: file.size
            }),
        };
    } catch (error) {
        console.error("Text extraction error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error instanceof Error ? error.message : "Failed to extract text from file"
            }),
        };
    }
};
