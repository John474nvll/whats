import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name"),
  phone: text("phone").notNull(), // or handle identifier
  platform: text("platform").notNull(), // 'whatsapp', 'instagram', 'facebook'
  metadata: jsonb("metadata"), // Store extra profile info
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  status: text("status").default("active"), // 'active', 'agent_paused', 'closed'
  channel: text("channel").notNull(), // 'whatsapp', 'instagram'
  botStatus: boolean("bot_status").default(true), // True if AI is active
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user', 'assistant', 'agent', 'system'
  platformMessageId: text("platform_message_id"),
  metadata: jsonb("metadata"), // Tokens, usage, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const channelConfigs = pgTable("channel_configs", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull().unique(), // 'whatsapp', 'instagram'
  accessToken: text("access_token").notNull(),
  verifyToken: text("verify_token").notNull(),
  phoneNumberId: text("phone_number_id"),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === RELATIONS ===

export const contactsRelations = relations(contacts, ({ many }) => ({
  conversations: many(conversations),
}));

export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  contact: one(contacts, {
    fields: [conversations.contactId],
    references: [contacts.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, lastMessageAt: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertChannelConfigSchema = createInsertSchema(channelConfigs).omit({ id: true, updatedAt: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type ChannelConfig = typeof channelConfigs.$inferSelect;
export type InsertChannelConfig = z.infer<typeof insertChannelConfigSchema>;

export type MessageWithDetails = Message & { conversation?: Conversation };
