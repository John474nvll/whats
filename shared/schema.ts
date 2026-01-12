
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user"), // 'admin', 'user'
  avatar: text("avatar"),
  settings: text("settings", { mode: 'json' }).default({}),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const widgets = sqliteTable("widgets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'stats', 'activity', 'social_feed', 'quick_actions'
  title: text("title").notNull(),
  config: text("config", { mode: 'json' }).default({}),
  position: integer("position").default(0),
  isVisible: integer("is_visible", { mode: 'boolean' }).default(true),
});

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name"),
  phone: text("phone").notNull(), // or handle identifier
  platform: text("platform").notNull(), // 'whatsapp', 'instagram', 'facebook'
  metadata: text("metadata", { mode: 'json' }), // Store extra profile info
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const conversations = sqliteTable("conversations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contactId: integer("contact_id").references(() => contacts.id).notNull(),
  status: text("status").default("active"), // 'active', 'agent_paused', 'closed'
  channel: text("channel").notNull(), // 'whatsapp', 'instagram'
  botStatus: integer("bot_status", { mode: 'boolean' }).default(true), // True if AI is active
  lastMessageAt: integer("last_message_at", { mode: 'timestamp' }).defaultNow(),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user', 'assistant', 'agent', 'system'
  platformMessageId: text("platform_message_id"),
  metadata: text("metadata", { mode: 'json' }), // Tokens, usage, etc.
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const channelConfigs = sqliteTable("channel_configs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  platform: text("platform").notNull().unique(), // 'whatsapp', 'instagram'
  accessToken: text("access_token").notNull(),
  verifyToken: text("verify_token").notNull(),
  phoneNumberId: text("phone_number_id"),
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).defaultNow(),
});

export const socialAccounts = sqliteTable("social_accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  platform: text("platform").notNull(), // 'instagram', 'facebook', 'whatsapp', 'spotify', 'youtube'
  accountId: text("account_id").notNull(),
  accountName: text("account_name").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  profilePicture: text("profile_picture"),
  bio: text("bio"),
  followersCount: integer("followers_count").default(0),
  followingCount: integer("following_count").default(0),
  postsCount: integer("posts_count").default(0),
  metadata: text("metadata", { mode: 'json' }), // Store profile data, permissions, etc
  isConnected: integer("is_connected", { mode: 'boolean' }).default(true),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).defaultNow(),
});

export const artistProfiles = sqliteTable("artist_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  artistName: text("artist_name").notNull(),
  genre: text("genre"),
  bio: text("bio"),
  spotifyArtistId: text("spotify_artist_id"),
  youtubeChannelId: text("youtube_channel_id"),
  metadata: text("metadata", { mode: 'json' }).default({}),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const musicContent = sqliteTable("music_content", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  artistId: integer("artist_id").notNull().references(() => artistProfiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type").notNull(), // 'track', 'album', 'video'
  status: text("status").notNull().default("draft"), // 'draft', 'uploading', 'published'
  platformLinks: text("platform_links", { mode: 'json' }).default({}),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const salesFunnels = sqliteTable("sales_funnels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  steps: text("steps", { mode: 'json' }).notNull().default([]), // Array of steps with conditions and actions
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const inventory = sqliteTable("inventory", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  quantity: integer("quantity").default(0),
  price: integer("price").notNull(),
  category: text("category"),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  customerId: integer("customer_id").references(() => customers.id),
  productId: integer("product_id").references(() => products.id),
  amount: integer("amount").notNull(),
  status: text("status").default("pending"), // 'pending', 'completed', 'cancelled'
  paymentMethod: text("payment_method"),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const customerGroups = sqliteTable("customer_groups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  criteria: text("criteria", { mode: 'json' }).default({}),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const productCatalogs = sqliteTable("product_catalogs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  productIds: text("product_ids").default("[]"),
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
  metadata: text("metadata", { mode: 'json' }).default({}),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const campaigns = sqliteTable("campaigns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  platform: text("platform").notNull(), // 'all', 'whatsapp', 'instagram', 'facebook'
  targetAccountIds: text("target_account_ids").default("[]"), // Selected social accounts
  status: text("status").notNull().default("draft"), // 'draft', 'active', 'completed'
  content: text("content"),
  aiGenerated: integer("ai_generated", { mode: 'boolean' }).default(false),
  metrics: text("metrics", { mode: 'json' }).default({}),
  scheduledAt: integer("scheduled_at", { mode: 'timestamp' }),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const customers = sqliteTable("customers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  platform: text("platform"), // 'whatsapp', 'instagram', 'facebook'
  platformId: text("platform_id"),
  status: text("status").default("active"), // 'active', 'inactive', 'blocked'
  tags: text("tags").default("[]"),
  metadata: text("metadata", { mode: 'json' }).default({}),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).defaultNow(),
});

export const agents = sqliteTable("agents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phoneNumber: text("phone_number").unique(),
  status: text("status").default("offline"), // 'online', 'offline'
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).defaultNow(),
});

export const calls = sqliteTable("calls", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    agentId: integer("agent_id").references(() => agents.id, { onDelete: 'set null' }),
    customerPhone: text("customer_phone"),
    status: text("status").default("initiated"), // 'initiated', 'ringing', 'answered', 'completed', 'failed'
    direction: text("direction"), // 'inbound', 'outbound'
    duration: integer("duration").default(0), // in seconds
    recordingUrl: text("recording_url"),
    createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const whatsAppMessages = sqliteTable("whatsapp_messages", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    agentId: integer("agent_id").references(() => agents.id, { onDelete: 'set null' }),
    from: text("from").notNull(),
    to: text("to").notNull(),
    body: text("body").notNull(),
    status: text("status").default("sent"), // 'sent', 'delivered', 'read'
    createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

// === RELATIONS ===

export const campaignsRelations = relations(campaigns, ({ one }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
}));

export const customersRelations = relations(customers, ({ one }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
}));

export const funnelsRelations = relations(salesFunnels, ({ one }) => ({
  user: one(users, {
    fields: [salesFunnels.userId],
    references: [users.id],
  }),
}));

export const artistRelations = relations(artistProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [artistProfiles.userId],
    references: [users.id],
  }),
  content: many(musicContent),
}));

export const musicContentRelations = relations(musicContent, ({ one }) => ({
  artist: one(artistProfiles, {
    fields: [musicContent.artistId],
    references: [artistProfiles.id],
  }),
}));

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

export const agentsRelations = relations(agents, ({ many }) => ({
  calls: many(calls),
  whatsAppMessages: many(whatsAppMessages),
}));

export const callsRelations = relations(calls, ({ one }) => ({
  agent: one(agents, {
    fields: [calls.agentId],
    references: [agents.id],
  }),
}));

export const whatsAppMessagesRelations = relations(whatsAppMessages, ({ one }) => ({
  agent: one(agents, {
    fields: [whatsAppMessages.agentId],
    references: [agents.id],
  }),
}));


// === BASE SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ createdAt: true });
export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // stored in cents
  imageUrl: text("image_url"),
  stock: integer("stock").default(0),
  category: text("category"),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const customLinks = sqliteTable("custom_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: integer("product_id").references(() => products.id),
  campaignId: integer("campaign_id").references(() => campaigns.id),
  originalUrl: text("original_url").notNull(),
  shortCode: text("short_code").unique().notNull(),
  platform: text("platform"), 
  clicks: integer("clicks").default(0),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
});

export const phoneConnections = sqliteTable("phone_connections", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  phoneNumber: text("phone_number").notNull().unique(), // +573001234567
  verificationCode: text("verification_code"),
  isVerified: integer("is_verified", { mode: 'boolean' }).default(false),
  platform: text("platform").default("whatsapp"), // 'whatsapp'
  metadata: text("metadata", { mode: 'json' }).default({}),
  createdAt: integer("created_at", { mode: 'timestamp' }).defaultNow(),
  verifiedAt: integer("verified_at", { mode: 'timestamp' }),
});

export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });
export const insertConversationSchema = createInsertSchema(conversations).omit({ id: true, lastMessageAt: true, createdAt: true });
export const insertMessageSchema = createInsertSchema(messages).omit({ id: true, createdAt: true });
export const insertChannelConfigSchema = createInsertSchema(channelConfigs).omit({ id: true, updatedAt: true });
export const insertSocialAccountSchema = createInsertSchema(socialAccounts).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWidgetSchema = createInsertSchema(widgets).omit({ id: true });
export const insertFunnelSchema = createInsertSchema(salesFunnels).omit({ id: true, createdAt: true });
export const insertCampaignSchema = createInsertSchema(campaigns).omit({ id: true, createdAt: true });
export const insertArtistProfileSchema = createInsertSchema(artistProfiles).omit({ id: true, createdAt: true });
export const insertMusicContentSchema = createInsertSchema(musicContent).omit({ id: true, createdAt: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCustomerGroupSchema = createInsertSchema(customerGroups).omit({ id: true, createdAt: true });
export const insertProductCatalogSchema = createInsertSchema(productCatalogs).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertCustomLinkSchema = createInsertSchema(customLinks).omit({ id: true, createdAt: true, clicks: true });
export const insertInventorySchema = createInsertSchema(inventory).omit({ id: true, createdAt: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true, createdAt: true });
export const insertPhoneConnectionSchema = createInsertSchema(phoneConnections).omit({ id: true, createdAt: true, verifiedAt: true });

export const insertAgentSchema = createInsertSchema(agents).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCallSchema = createInsertSchema(calls).omit({ id: true, createdAt: true });
export const insertWhatsAppMessageSchema = createInsertSchema(whatsAppMessages).omit({ id: true, createdAt: true });

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type PhoneConnection = typeof phoneConnections.$inferSelect;
export type InsertPhoneConnection = z.infer<typeof insertPhoneConnectionSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type CustomLink = typeof customLinks.$inferSelect;
export type InsertCustomLink = z.infer<typeof insertCustomLinkSchema>;

// === EXPLICIT API CONTRACT TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type ChannelConfig = typeof channelConfigs.$inferSelect;
export type InsertChannelConfig = z.infer<typeof insertChannelConfigSchema>;

export type SocialAccount = typeof socialAccounts.$inferSelect;
export type InsertSocialAccount = z.infer<typeof insertSocialAccountSchema>;

export type Widget = typeof widgets.$inferSelect;
export type InsertWidget = z.infer<typeof insertWidgetSchema>;

export type SalesFunnel = typeof salesFunnels.$inferSelect;
export type InsertSalesFunnel = z.infer<typeof insertFunnelSchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type ArtistProfile = typeof artistProfiles.$inferSelect;
export type InsertArtistProfile = z.infer<typeof insertArtistProfileSchema>;

export type MusicContent = typeof musicContent.$inferSelect;
export type InsertMusicContent = z.infer<typeof insertMusicContentSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type CustomerGroup = typeof customerGroups.$inferSelect;
export type InsertCustomerGroup = z.infer<typeof insertCustomerGroupSchema>;

export type ProductCatalog = typeof productCatalogs.$inferSelect;
export type InsertProductCatalog = z.infer<typeof insertProductCatalogSchema>;

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;

export type Call = typeof calls.$inferSelect;
export type InsertCall = z.infer<typeof insertCallSchema>;

export type WhatsAppMessage = typeof whatsAppMessages.$inferSelect;
export type InsertWhatsAppMessage = z.infer<typeof insertWhatsAppMessageSchema>;

export type MessageWithDetails = Message & { conversation?: Conversation };

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
