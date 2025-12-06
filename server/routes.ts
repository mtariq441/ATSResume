import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeResumeWithGemini } from "./gemini";
import { analyzeRequestSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import mammoth from "mammoth";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {

  // POST /api/extract-text - Extract text from uploaded document
  app.post("/api/extract-text", upload.single("file"), async (req, res) => {
    try {
      console.log("File upload request received");
      if (!req.file) {
        console.log("No file in request");
        return res.status(400).json({ error: "No file uploaded" });
      }

      const file = req.file;
      console.log(`Processing file: ${file.originalname}, mimetype: ${file.mimetype}, size: ${file.size}`);
      let extractedText = "";

      // Handle PDF files
      if (file.mimetype === "application/pdf") {
        try {
          console.log("Extracting text from PDF...");

          // Use pdfjs-dist for better serverless compatibility
          const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
          
          // Disable worker for Node.js environment (works without worker in server-side)
          (pdfjsLib.GlobalWorkerOptions as any).disableWorker = true;

          // Load PDF from buffer
          const loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(file.buffer),
            useSystemFonts: true,
          });

          const pdfDocument = await loadingTask.promise;
          const numPages = pdfDocument.numPages;
          console.log(`PDF has ${numPages} pages`);

          // Extract text from all pages
          const textPromises = [];
          for (let i = 1; i <= numPages; i++) {
            textPromises.push(
              pdfDocument.getPage(i).then(async (page) => {
                const textContent = await page.getTextContent();
                return textContent.items.map((item: any) => item.str).join(" ");
              })
            );
          }

          const pageTexts = await Promise.all(textPromises);
          extractedText = pageTexts.join("\n");

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
          return res.status(400).json({
            error: `Could not extract text from PDF file: ${error instanceof Error ? error.message : 'Unknown error'}. Please try a DOCX file instead.`
          });
        }
      }
      // Handle DOCX files
      else if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        extractedText = String(result.value || "");
      }
      // Handle DOC files (older format) - mammoth can handle some DOC files too
      else if (file.mimetype === "application/msword") {
        try {
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          extractedText = String(result.value || "");
        } catch (error) {
          return res.status(400).json({
            error: "Could not extract text from DOC file. Please save as DOCX or PDF format."
          });
        }
      }
      // Handle plain text files
      else if (file.mimetype === "text/plain") {
        extractedText = file.buffer.toString("utf-8");
      }
      else {
        return res.status(400).json({
          error: "Unsupported file type. Please upload PDF, DOCX, DOC, or TXT files."
        });
      }

      const trimmedText = String(extractedText).trim();
      console.log(`Successfully extracted ${trimmedText.length} characters`);
      return res.status(200).json({
        text: trimmedText,
        fileName: file.originalname,
        fileSize: file.size
      });
    } catch (error) {
      console.error("Text extraction error:", error);
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to extract text from file"
      });
    }
  });

  // POST /api/analyze - Analyze resume against job description
  app.post("/api/analyze", async (req, res) => {
    try {
      const validation = analyzeRequestSchema.safeParse(req.body);

      if (!validation.success) {
        const validationError = fromZodError(validation.error);
        return res.status(400).json({
          error: validationError.message
        });
      }

      const { resume_text, job_description } = validation.data;

      console.log("Starting Gemini analysis...");
      // Call Gemini AI to analyze the resume
      const analysisData = await analyzeResumeWithGemini(resume_text, job_description);
      console.log("Gemini analysis complete. Storing result...");

      // Store the analysis result
      const result = await storage.createAnalysis(analysisData);
      console.log("Result stored successfully.");

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Analysis error details:", {
        message: error.message,
        stack: error.stack,
        cause: error.cause,
        code: error.code
      });
      return res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to analyze resume"
      });
    }
  });

  // GET /api/analysis/:id - Retrieve a specific analysis result
  app.get("/api/analysis/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "Analysis ID is required" });
      }

      const result = await storage.getAnalysis(id);

      if (!result) {
        return res.status(404).json({ error: "Analysis not found" });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("Retrieval error:", error);
      return res.status(500).json({
        error: "Failed to retrieve analysis"
      });
    }
  });

  // GET /api/analyses - List recent analyses (optional, for future features)
  app.get("/api/analyses", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const results = await storage.listAnalyses(limit);
      return res.status(200).json(results);
    } catch (error) {
      console.error("List error:", error);
      return res.status(500).json({
        error: "Failed to list analyses"
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
