import { z } from "zod";
import { pgTable, text, integer, jsonb, timestamp, serial, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

// Drizzle Database Schema
export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  uuid: text("uuid").notNull().unique(),
  match_score: integer("match_score").notNull(),
  score_breakdown: jsonb("score_breakdown").notNull(),
  missing_keywords: jsonb("missing_keywords").notNull(),
  new_bullet_points_to_add: jsonb("new_bullet_points_to_add").notNull(),
  bullets_to_rephrase: jsonb("bullets_to_rephrase").notNull(),
  one_sentence_summary: text("one_sentence_summary").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  createdAtIdx: index("created_at_idx").on(table.created_at),
}));

// Zod Schemas for validation
export const scoreBreakdownSchema = z.object({
  hard_skills: z.number().min(0).max(100),
  experience_level: z.number().min(0).max(100),
  keyword_density: z.number().min(0).max(100),
  education_certs: z.number().min(0).max(100),
  title_alignment: z.number().min(0).max(100),
});

export const missingKeywordsSchema = z.record(z.string(), z.array(z.string()));

export const bulletRephraseSchema = z.object({
  original: z.string(),
  improved: z.string(),
});

export const analysisResultSchema = z.object({
  id: z.string(),
  match_score: z.number().min(0).max(100),
  score_breakdown: scoreBreakdownSchema,
  missing_keywords: missingKeywordsSchema,
  new_bullet_points_to_add: z.array(z.string()),
  bullets_to_rephrase: z.array(bulletRephraseSchema),
  one_sentence_summary: z.string(),
  created_at: z.string(),
});

export const analyzeRequestSchema = z.object({
  resume_text: z.string().min(10, "Resume text is required"),
  job_description: z.string().min(10, "Job description is required"),
  file_name: z.string().optional(),
});

// Drizzle-generated schemas with validation
export const insertAnalysisDbSchema = createInsertSchema(analyses, {
  score_breakdown: scoreBreakdownSchema,
  missing_keywords: missingKeywordsSchema,
  bullets_to_rephrase: z.array(bulletRephraseSchema),
  new_bullet_points_to_add: z.array(z.string()),
}).omit({
  id: true,
  created_at: true,
});

export const selectAnalysisDbSchema = createSelectSchema(analyses);

// Types
export type ScoreBreakdown = z.infer<typeof scoreBreakdownSchema>;
export type MissingKeywords = z.infer<typeof missingKeywordsSchema>;
export type BulletRephrase = z.infer<typeof bulletRephraseSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type InsertAnalysisDb = z.infer<typeof insertAnalysisDbSchema>;

// Insert schemas
export const insertAnalysisSchema = analyzeRequestSchema;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
