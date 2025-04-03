import { pgTable, serial, primaryKey, text, timestamp, boolean, integer, unique } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text("id")
  .primaryKey()
  .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  image: text('image'),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<string>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  group: text('group'),
  status: text('status').default('Subscribed'),
  deliveryRate: integer('delivery_rate'),
  lastDelivered: timestamp('last_delivered'),
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
},
(table) => ({
  uniqueEmailUserId: unique("unique_email_user_id").on(table.email, table.userId), // ✅ Correct way to define a unique constraint
}));

export const campaigns = pgTable('campaigns', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  templateId: integer('template_id').references(() => templates.id),
  isHtml: boolean('is_html').default(false),
  subject: text('subject').notNull(),
  content: text('content').notNull(),
  status: text('status').default('Draft'),
  recipientGroup: text('recipient_group'),
  recipientCount: integer('recipient_count'),
  openRate: integer('open_rate').default(0),
  openCount: integer('open_count').default(0),
  clickCount: integer('click_count').default(0),
  totalSent: integer('total_sent').default(0),
  clickRate: integer('click_rate').default(0),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const templates = pgTable('templates', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  content: text('content').notNull(),
  category: text('category'),
  createdAt: timestamp('created_at').defaultNow(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  userId: text("userId").notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  senderName: text('sender_name').notNull(),
  senderEmail: text('sender_email').notNull(),
  senderEmailVerified: boolean('sender_email_verified').default(false),
  dailyLimit: integer('daily_limit').default(50),
  monthlyLimit: integer('monthly_limit').notNull().default(1500),
  contactLimit: integer('contact_limit').notNull().default(3000),
  contactLimitUsed: integer('contact_limit_used').notNull().default(0),
  dailyLimitUsed: integer('daily_limit_used').notNull().default(0),
  monthlyLimitUsed: integer('monthly_limit_used').notNull().default(0),
  trackOpens: boolean('track_opens').default(true),
  trackClicks: boolean('track_clicks').default(true),
  awsRegion: text('aws_region'),
  sesFromDomain: text('ses_from_domain'),
  sesSendingQuota: integer('ses_sending_quota'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  apiToken: text('api_token'),
});

export const workflows = pgTable('workflows', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  templateId: integer('template_id').references(() => templates.id),
  subject: text('subject').notNull(),
  status: text('status').default('Started'),
  trigger: text('trigger').notNull(),
  filter: text('filter'),
  createdAt: timestamp('created_at').defaultNow(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});