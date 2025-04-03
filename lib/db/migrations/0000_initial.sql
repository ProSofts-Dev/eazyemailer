CREATE TABLE IF NOT EXISTS "users" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL UNIQUE,
  "image" text,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "contacts" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "email" text NOT NULL,
  "group" text,
  "status" text DEFAULT 'subscribed',
  "delivery_rate" integer,
  "last_delivered" timestamp,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "campaigns" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "subject" text NOT NULL,
  "content" text NOT NULL,
  "status" text DEFAULT 'draft',
  "recipient_group" text,
  "recipient_count" integer,
  "open_rate" integer,
  "click_rate" integer,
  "sent_at" timestamp,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "templates" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "description" text,
  "content" text NOT NULL,
  "category" text,
  "created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "settings" (
  "id" serial PRIMARY KEY,
  "user_id" integer NOT NULL,
  "sender_name" text,
  "sender_email" text,
  "daily_limit" integer,
  "track_opens" boolean DEFAULT true,
  "track_clicks" boolean DEFAULT true,
  "aws_region" text,
  "ses_from_domain" text,
  "ses_sending_quota" integer,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp
);