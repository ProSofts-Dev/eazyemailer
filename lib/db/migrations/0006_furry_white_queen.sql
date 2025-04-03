ALTER TABLE "settings" ALTER COLUMN "monthly_limit" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "contact_limit" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "contact_limit_used" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "settings" ALTER COLUMN "daily_limit_used" SET NOT NULL;