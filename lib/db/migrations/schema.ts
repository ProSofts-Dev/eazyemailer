import { pgTable, foreignKey, serial, text, timestamp, unique, integer, boolean, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const templates = pgTable("templates", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	content: text().notNull(),
	category: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	userId: text().notNull(),
}, (table) => {
	return {
		templatesUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "templates_userId_users_id_fk"
		}).onDelete("cascade"),
	}
});

export const users = pgTable("users", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	image: text(),
	emailVerified: timestamp({ mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => {
	return {
		usersEmailUnique: unique("users_email_unique").on(table.email),
	}
});

export const contacts = pgTable("contacts", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	group: text(),
	status: text().default('Subscribed'),
	deliveryRate: integer("delivery_rate"),
	lastDelivered: timestamp("last_delivered", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	userId: text("user_id").notNull(),
}, (table) => {
	return {
		contactsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "contacts_user_id_users_id_fk"
		}).onDelete("cascade"),
	}
});

export const settings = pgTable("settings", {
	id: serial().primaryKey().notNull(),
	userId: text().notNull(),
	senderName: text("sender_name").notNull(),
	senderEmail: text("sender_email").notNull(),
	senderEmailVerified: boolean("sender_email_verified").default(false),
	dailyLimit: integer("daily_limit").default(50),
	trackOpens: boolean("track_opens").default(true),
	trackClicks: boolean("track_clicks").default(true),
	awsRegion: text("aws_region"),
	sesFromDomain: text("ses_from_domain"),
	sesSendingQuota: integer("ses_sending_quota"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
	monthlyLimit: integer("monthly_limit").default(1500).notNull(),
	contactLimit: integer("contact_limit").default(3000).notNull(),
	contactLimitUsed: integer("contact_limit_used").default(0).notNull(),
	dailyLimitUsed: integer("daily_limit_used").default(0).notNull(),
	monthlyLimitUsed: integer("monthly_limit_used").default(0).notNull(),
	apiToken: text("api_token"),
}, (table) => {
	return {
		settingsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "settings_userId_users_id_fk"
		}).onDelete("cascade"),
	}
});

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => {
	return {
		sessionUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "session_userId_users_id_fk"
		}).onDelete("cascade"),
	}
});

export const campaigns = pgTable("campaigns", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	templateId: integer("template_id"),
	isHtml: boolean("is_html").default(false),
	subject: text().notNull(),
	content: text().notNull(),
	status: text().default('Draft'),
	recipientGroup: text("recipient_group"),
	recipientCount: integer("recipient_count"),
	openRate: integer("open_rate").default(0),
	clickRate: integer("click_rate").default(0),
	sentAt: timestamp("sent_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	userId: text().notNull(),
	openCount: integer("open_count").default(0),
	clickCount: integer("click_count").default(0),
	totalSent: integer("total_sent").default(0),
}, (table) => {
	return {
		campaignsTemplateIdTemplatesIdFk: foreignKey({
			columns: [table.templateId],
			foreignColumns: [templates.id],
			name: "campaigns_template_id_templates_id_fk"
		}),
		campaignsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "campaigns_userId_users_id_fk"
		}).onDelete("cascade"),
	}
});

export const workflows = pgTable("workflows", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	templateId: integer("template_id"),
	subject: text().notNull(),
	status: text().default('Started'),
	trigger: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	userId: text().notNull(),
	filter: text(),
}, (table) => {
	return {
		workflowsTemplateIdTemplatesIdFk: foreignKey({
			columns: [table.templateId],
			foreignColumns: [templates.id],
			name: "workflows_template_id_templates_id_fk"
		}),
		workflowsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "workflows_userId_users_id_fk"
		}).onDelete("cascade"),
	}
});

export const verificationToken = pgTable("verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => {
	return {
		verificationTokenIdentifierTokenPk: primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"}),
	}
});

export const account = pgTable("account", {
	userId: text().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => {
	return {
		accountUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "account_userId_users_id_fk"
		}).onDelete("cascade"),
		accountProviderProviderAccountIdPk: primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
	}
});
