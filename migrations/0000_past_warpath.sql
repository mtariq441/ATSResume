CREATE TABLE "analyses" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" text NOT NULL,
	"match_score" integer NOT NULL,
	"score_breakdown" jsonb NOT NULL,
	"missing_keywords" jsonb NOT NULL,
	"new_bullet_points_to_add" jsonb NOT NULL,
	"bullets_to_rephrase" jsonb NOT NULL,
	"one_sentence_summary" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "analyses_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE INDEX "created_at_idx" ON "analyses" USING btree ("created_at");