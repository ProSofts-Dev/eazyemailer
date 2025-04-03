import { relations } from "drizzle-orm/relations";
import { users, templates, contacts, settings, session, campaigns, workflows, account } from "./schema";

export const templatesRelations = relations(templates, ({one, many}) => ({
	user: one(users, {
		fields: [templates.userId],
		references: [users.id]
	}),
	campaigns: many(campaigns),
	workflows: many(workflows),
}));

export const usersRelations = relations(users, ({many}) => ({
	templates: many(templates),
	contacts: many(contacts),
	settings: many(settings),
	sessions: many(session),
	campaigns: many(campaigns),
	workflows: many(workflows),
	accounts: many(account),
}));

export const contactsRelations = relations(contacts, ({one}) => ({
	user: one(users, {
		fields: [contacts.userId],
		references: [users.id]
	}),
}));

export const settingsRelations = relations(settings, ({one}) => ({
	user: one(users, {
		fields: [settings.userId],
		references: [users.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(users, {
		fields: [session.userId],
		references: [users.id]
	}),
}));

export const campaignsRelations = relations(campaigns, ({one}) => ({
	template: one(templates, {
		fields: [campaigns.templateId],
		references: [templates.id]
	}),
	user: one(users, {
		fields: [campaigns.userId],
		references: [users.id]
	}),
}));

export const workflowsRelations = relations(workflows, ({one}) => ({
	template: one(templates, {
		fields: [workflows.templateId],
		references: [templates.id]
	}),
	user: one(users, {
		fields: [workflows.userId],
		references: [users.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(users, {
		fields: [account.userId],
		references: [users.id]
	}),
}));