
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("agent").notNull(), // 'admin' | 'agent'
  createdAt: timestamp("created_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(), // 'whatsapp', 'facebook', 'instagram'
  platformId: text("platform_id").notNull(), // Phone number or user ID
  name: text("name"),
  profilePic: text("profile_pic"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  status: text("status").default("active").notNull(), // 'active', 'closed'
  channel: text("channel").notNull(), // 'whatsapp', 'facebook', 'instagram'
  lastMessageAt: timestamp("last_message_at").defaultNow(),
  unreadCount: integer("unread_count").default(0),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' (customer), 'agent', 'system' (AI)
  sentiment: text("sentiment"), // 'positive', 'neutral', 'negative'
  timestamp: timestamp("timestamp").defaultNow(),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  farmName: text("farm_name"),
  address: text("address"),
  animalCount: integer("animal_count"),
  platform: text("platform").default("whatsapp"),
  status: text("status").default("active"),
  leadStatus: text("lead_status").default("new"),
  source: text("source"),
  estimatedValue: integer("estimated_value").default(0),
  conversionProbability: integer("conversion_probability").default(0),
  notes: text("notes"),
  tags: text("tags"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const campaigns = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  target: jsonb("target"),
  content: text("content"),
  aiGenerated: boolean("ai_generated").default(false),
  scheduledAt: timestamp("scheduled_at"),
  status: text("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const socialAccounts = pgTable("social_accounts", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").references(() => customers.id),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open").notNull(), // 'open', 'in_progress', 'resolved', 'closed'
  priority: text("priority").default("medium").notNull(), // 'low', 'medium', 'high', 'urgent'
  category: text("category"),
  assignedTo: integer("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // 'admin', 'manager', 'agent'
  permissions: jsonb("permissions").notNull(), // { "can_delete_leads": true, ... }
  createdAt: timestamp("created_at").defaultNow(),
});

export const channelConfigs = pgTable("channel_configs", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull().unique(), // 'whatsapp', 'instagram', 'facebook'
  accessToken: text("access_token"),
  verifyToken: text("verify_token"),
  phoneNumberId: text("phone_number_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === RELATIONS ===

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

export const contactsRelations = relations(contacts, ({ many }) => ({
  conversations: many(conversations),
}));

// === BASE SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, lastMessageAt: true, unreadCount: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, timestamp: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true, createdAt: true, updatedAt: true });
export const insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTicketSchema = createInsertSchema(tickets).omit({ id: true, createdAt: true, updatedAt: true });
export const insertRoleSchema = createInsertSchema(roles).omit({ id: true, createdAt: true });
export const insertChannelConfigSchema = createInsertSchema(channelConfigs).omit({ id: true, createdAt: true, updatedAt: true });

// === TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;

export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;

export type ChannelConfig = typeof channelConfigs.$inferSelect;
export type InsertChannelConfig = z.infer<typeof insertChannelConfigSchema>;

export type ConversationWithContact = Conversation & { contact: Contact; lastMessage?: Message };

// === API TYPES ===

export type SendMessageRequest = {
  content: string;
};

export type WebhookMessage = {
  object: string;
  entry: any[];
};

export type AiAnalysisResponse = {
  sentiment: 'positive' | 'negative' | 'neutral';
  suggestedResponse: string;
};
