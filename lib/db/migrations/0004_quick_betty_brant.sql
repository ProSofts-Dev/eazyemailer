ALTER TABLE "settings" ALTER COLUMN "daily_limit" SET DEFAULT 50;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "monthly_limit" integer DEFAULT 1500;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "contact_limit" integer DEFAULT 800;