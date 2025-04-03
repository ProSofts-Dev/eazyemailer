ALTER TABLE "settings" ALTER COLUMN "contact_limit" SET DEFAULT 3000;--> statement-breakpoint
ALTER TABLE "settings" ADD COLUMN "api_token" text;