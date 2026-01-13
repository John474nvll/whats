
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

export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  farmName: text("farm_name"),
  address: text("address"),
  animalCount: integer("animal_count"),
  platform: text("platform").default("whatsapp"),
  status: text("status").default("active"),
  tags: text("tags"), // Stored as a comma-separated string
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const operations = sqliteTable("operations", {
  id: integer("id").primaryKey(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  amount: real("amount").notNull(),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey(),
  name: text("name"),
  phone: text("phone").notNull().unique(),
  platform: text("platform").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const inboxes = sqliteTable("inboxes", {
  id: integer("id").primaryKey(),
  contactId: integer("contact_id").notNull().references(() => contacts.id),
  lastMessage: text("last_message"),
  status: text("status"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const conversations = sqliteTable("conversations", {
  id: integer("id").primaryKey(),
  contactId: integer("contact_id").references(() => contacts.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});


// === RELATIONS ===

export const customerRelations = relations(customers, ({ many }) => ({
  operations: many(operations),
}));

export const operationRelations = relations(operations, ({ one }) => ({
  customer: one(customers, {
    fields: [operations.customerId],
    references: [customers.id],
  }),
}));

export const contactRelations = relations(contacts, ({ many }) => ({
  inboxes: many(inboxes),
  conversations: many(conversations),
}));

export const inboxRelations = relations(inboxes, ({ one }) => ({
  contact: one(contacts, {
    fields: [inboxes.contactId],
    references: [contacts.id],
  }),
}));

export const conversationRelations = relations(conversations, ({ one, many }) => ({
  contact: one(contacts, {
    fields: [conversations.contactId],
    references: [contacts.id],
  }),
  messages: many(messages),
}));

export const messageRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));


// === ZOD SCHEMAS ===

export const insertCustomerSchema = createInsertSchema(customers, {
    animalCount: z.number().optional(),
    tags: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    farmName: z.string().optional(),
    address: z.string().optional(),
});

export const insertOperationSchema = createInsertSchema(operations);
export const insertContactSchema = createInsertSchema(contacts);
export const insertInboxSchema = createInsertSchema(inboxes);
export const insertConversationSchema = createInsertSchema(conversations);
export const insertMessageSchema = createInsertSchema(messages);

// === TYPES ===

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Operation = typeof operations.$inferSelect;
export type InsertOperation = z.infer<typeof insertOperationSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Inbox = typeof inboxes.$inferSelect;
export type InsertInbox = z.infer<typeof insertInboxSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
