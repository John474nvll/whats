
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === AUTH SCHEMAS ===

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const registerSchema = loginSchema.extend({
  botId: z.string().min(1, "Bot ID is required"),
});


// === TABLE DEFINITIONS ===

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const companies = sqliteTable("companies", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  website: text("website"),
  phone: text("phone"),
  address: text("address"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  platform: text("platform"),
  companyId: integer("company_id").references(() => companies.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const deals = sqliteTable("deals", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  value: real("value").notNull(),
  stage: text("stage").notNull(),
  companyId: integer("company_id").references(() => companies.id),
  contactId: integer("contact_id").references(() => contacts.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const interactions = sqliteTable("interactions", {
  id: integer("id").primaryKey(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  userId: text("user_id").references(() => users.id),
  contactId: integer("contact_id").references(() => contacts.id),
  dealId: integer("deal_id").references(() => deals.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});


// === RELATIONS ===

export const userRelations = relations(users, ({ many }) => ({
  interactions: many(interactions),
}));

export const companyRelations = relations(companies, ({ many }) => ({
  contacts: many(contacts),
  deals: many(deals),
}));

export const contactRelations = relations(contacts, ({ one, many }) => ({
  company: one(companies, {
    fields: [contacts.companyId],
    references: [companies.id],
  }),
  deals: many(deals),
  interactions: many(interactions),
}));

export const dealRelations = relations(deals, ({ one, many }) => ({
  company: one(companies, {
    fields: [deals.companyId],
    references: [companies.id],
  }),
  contact: one(contacts, {
    fields: [deals.contactId],
    references: [contacts.id],
  }),
  interactions: many(interactions),
}));

export const interactionRelations = relations(interactions, ({ one }) => ({
  user: one(users, {
    fields: [interactions.userId],
    references: [users.id],
  }),
  contact: one(contacts, {
    fields: [interactions.contactId],
    references: [contacts.id],
  }),
  deal: one(deals, {
    fields: [interactions.dealId],
    references: [deals.id],
  }),
}));

// === ZOD SCHEMAS ===

export const insertUserSchema = createInsertSchema(users);
export const insertCompanySchema = createInsertSchema(companies);
export const insertContactSchema = createInsertSchema(contacts);
export const insertDealSchema = createInsertSchema(deals);
export const insertInteractionSchema = createInsertSchema(interactions);

// === TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;

export type Interaction = typeof interactions.$inferSelect;
export type InsertInteraction = z.infer<typeof insertInteractionSchema>;
