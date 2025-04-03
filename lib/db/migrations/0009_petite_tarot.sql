ALTER TABLE "contacts" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_userId_users_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contacts" ADD CONSTRAINT "contacts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
