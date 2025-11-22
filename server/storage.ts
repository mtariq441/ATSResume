import { type AnalysisResult, type InsertAnalysisDb, insertAnalysisDbSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { analyses } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  createAnalysis(analysis: Omit<AnalysisResult, "id" | "created_at">): Promise<AnalysisResult>;
  getAnalysis(id: string): Promise<AnalysisResult | undefined>;
  listAnalyses(limit?: number): Promise<AnalysisResult[]>;
}

export class DbStorage implements IStorage {
  async createAnalysis(analysis: Omit<AnalysisResult, "id" | "created_at">): Promise<AnalysisResult> {
    const uuid = randomUUID();

    // Validate the analysis data before inserting
    const dbData: InsertAnalysisDb = {
      uuid,
      match_score: analysis.match_score,
      score_breakdown: analysis.score_breakdown,
      missing_keywords: analysis.missing_keywords,
      new_bullet_points_to_add: analysis.new_bullet_points_to_add,
      bullets_to_rephrase: analysis.bullets_to_rephrase,
      one_sentence_summary: analysis.one_sentence_summary,
    };

    // Validate before insert
    const validatedData = insertAnalysisDbSchema.parse(dbData);

    if (!db) throw new Error("Database not initialized");
    const [result] = await db.insert(analyses).values(validatedData).returning();

    if (!result) {
      throw new Error("Failed to create analysis - no result returned from database");
    }

    return {
      id: result.uuid,
      match_score: result.match_score,
      score_breakdown: result.score_breakdown as any,
      missing_keywords: result.missing_keywords as any,
      new_bullet_points_to_add: result.new_bullet_points_to_add as any,
      bullets_to_rephrase: result.bullets_to_rephrase as any,
      one_sentence_summary: result.one_sentence_summary,
      created_at: result.created_at?.toISOString() || new Date().toISOString(),
    };
  }

  async getAnalysis(id: string): Promise<AnalysisResult | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [result] = await db.select().from(analyses).where(eq(analyses.uuid, id)).limit(1);

    if (!result) {
      return undefined;
    }

    return {
      id: result.uuid,
      match_score: result.match_score,
      score_breakdown: result.score_breakdown as any,
      missing_keywords: result.missing_keywords as any,
      new_bullet_points_to_add: result.new_bullet_points_to_add as any,
      bullets_to_rephrase: result.bullets_to_rephrase as any,
      one_sentence_summary: result.one_sentence_summary,
      created_at: result.created_at?.toISOString() || new Date().toISOString(),
    };
  }

  async listAnalyses(limit: number = 50): Promise<AnalysisResult[]> {
    if (!db) throw new Error("Database not initialized");
    const results = await db.select()
      .from(analyses)
      .orderBy(desc(analyses.created_at))
      .limit(limit);

    return results.map(result => ({
      id: result.uuid,
      match_score: result.match_score,
      score_breakdown: result.score_breakdown as any,
      missing_keywords: result.missing_keywords as any,
      new_bullet_points_to_add: result.new_bullet_points_to_add as any,
      bullets_to_rephrase: result.bullets_to_rephrase as any,
      one_sentence_summary: result.one_sentence_summary,
      created_at: result.created_at?.toISOString() || new Date().toISOString(),
    }));
  }
}

export class MemStorage implements IStorage {
  private analyses: Map<string, AnalysisResult>;

  constructor() {
    this.analyses = new Map();
  }

  async createAnalysis(analysis: Omit<AnalysisResult, "id" | "created_at">): Promise<AnalysisResult> {
    const id = randomUUID();
    const created_at = new Date().toISOString();
    const newAnalysis: AnalysisResult = { ...analysis, id, created_at };
    this.analyses.set(id, newAnalysis);
    return newAnalysis;
  }

  async getAnalysis(id: string): Promise<AnalysisResult | undefined> {
    return this.analyses.get(id);
  }

  async listAnalyses(limit: number = 50): Promise<AnalysisResult[]> {
    return Array.from(this.analyses.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  }
}

export const storage = process.env.DATABASE_URL ? new DbStorage() : new MemStorage();
