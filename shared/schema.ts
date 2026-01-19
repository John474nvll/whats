
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

export const wabaAccounts = sqliteTable("waba_accounts", {
    id: integer("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id).unique(),
    wabaAccountId: text("waba_account_id").notNull(),
    phoneNumberId: text("phone_number_id").notNull(),
    accessToken: text("access_token").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const retellAgents = sqliteTable("retell_agents", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  llm_websocket_url: text("llm_websocket_url").notNull(),
  voice_id: text("voice_id").notNull(),
  agent_prompt: text("agent_prompt"),
  status: text("status").default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
  userId: text("user_id").notNull().references(() => users.id),
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
  leadStatus: text("lead_status").default("new"), // new, contacting, qualified, lost, won
  source: text("source"), // facebook, instagram, whatsapp, organic, referral
  estimatedValue: real("estimated_value").default(0),
  conversionProbability: integer("conversion_probability").default(0), // 0-100
  notes: text("notes"),
  retellAgentId: text("retell_agent_id"),
  tags: text("tags"), // Stored as a comma-separated string
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
  userId: text("user_id").notNull().references(() => users.id),
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
  lastMessageAt: integer("last_message_at", { mode: "timestamp" }),
  status: text("status"),
  botStatus: integer("bot_status", { mode: "boolean" }).default(true),
});

export const messages = sqliteTable("messages", {
  id: integer("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const channelConfigs = sqliteTable("channel_configs", {
  platform: text("platform").primaryKey(),
  config: text("config", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const socialAccounts = sqliteTable("social_accounts", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: integer("expires_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const widgets = sqliteTable("widgets", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  config: text("config", { mode: "json" }),
  position: integer("position").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const salesFunnels = sqliteTable("sales_funnels", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  steps: text("steps", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const campaigns = sqliteTable("campaigns", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  target: text("target", { mode: "json" }),
  content: text("content"),
  scheduledAt: integer("scheduled_at", { mode: "timestamp" }),
  status: text("status"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const customerGroups = sqliteTable("customer_groups", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  rules: text("rules", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const productCatalogs = sqliteTable("product_catalogs", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey(),
  catalogId: integer("catalog_id").notNull().references(() => productCatalogs.id),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
  userId: text("user_id").notNull().references(() => users.id),
});

export const customLinks = sqliteTable("custom_links", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  shortCode: text("short_code").notNull(),
  originalUrl: text("original_url").notNull(),
  clicks: integer("clicks").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const artistProfiles = sqliteTable("artist_profiles", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  bio: text("bio"),
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const musicContent = sqliteTable("music_content", {
  id: integer("id").primaryKey(),
  artistId: integer("artist_id").notNull().references(() => artistProfiles.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  releaseDate: integer("release_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const inventory = sqliteTable("inventory", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  totalAmount: real("total_amount").notNull(),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const phoneConnections = sqliteTable("phone_connections", {
  id: integer("id").primaryKey(),
  phoneNumber: text("phone_number").notNull(),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  verifiedAt: integer("verified_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});


// === RELATIONS ===

export const userRelations = relations(users, ({ many, one }) => ({
  customers: many(customers),
  socialAccounts: many(socialAccounts),
  widgets: many(widgets),
  salesFunnels: many(salesFunnels),
  campaigns: many(campaigns),
  customerGroups: many(customerGroups),
  productCatalogs: many(productCatalogs),
  products: many(products),
  customLinks: many(customLinks),
  artistProfiles: many(artistProfiles),
  inventory: many(inventory),
  transactions: many(transactions),
  interactions: many(interactions),
  retellAgents: many(retellAgents),
  wabaAccount: one(wabaAccounts),
}));

export const wabaAccountRelations = relations(wabaAccounts, ({ one }) => ({
    user: one(users, {
        fields: [wabaAccounts.userId],
        references: [users.id],
    }),
}));

export const retellAgentRelations = relations(retellAgents, ({ one }) => ({
  user: one(users, {
    fields: [retellAgents.userId],
    references: [users.id],
  }),
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
  inboxes: many(inboxes),
  conversations: many(conversations),
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

export const customerRelations = relations(customers, ({ one, many }) => ({
  operations: many(operations),
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
}));

export const operationRelations = relations(operations, ({ one }) => ({
  customer: one(customers, {
    fields: [operations.customerId],
    references: [customers.id],
  }),
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

export const socialAccountRelations = relations(socialAccounts, ({ one }) => ({
  user: one(users, {
    fields: [socialAccounts.userId],
    references: [users.id],
  }),
}));

export const widgetRelations = relations(widgets, ({ one }) => ({
  user: one(users, {
    fields: [widgets.userId],
    references: [users.id],
  }),
}));

export const salesFunnelRelations = relations(salesFunnels, ({ one }) => ({
  user: one(users, {
    fields: [salesFunnels.userId],
    references: [users.id],
  }),
}));

export const campaignRelations = relations(campaigns, ({ one }) => ({
  user: one(users, {
    fields: [campaigns.userId],
    references: [users.id],
  }),
}));

export const customerGroupRelations = relations(customerGroups, ({ one }) => ({
  user: one(users, {
    fields: [customerGroups.userId],
    references: [users.id],
  }),
}));

export const productCatalogRelations = relations(productCatalogs, ({ one, many }) => ({
  user: one(users, {
    fields: [productCatalogs.userId],
    references: [users.id],
  }),
  products: many(products),
}));

export const productRelations = relations(products, ({ one, many }) => ({
  catalog: one(productCatalogs, {
    fields: [products.catalogId],
    references: [productCatalogs.id],
  }),
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
  inventory: many(inventory),
  transactions: many(transactions),
}));

export const customLinkRelations = relations(customLinks, ({ one }) => ({
  user: one(users, {
    fields: [customLinks.userId],
    references: [users.id],
  }),
}));

export const artistProfileRelations = relations(artistProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [artistProfiles.userId],
    references: [users.id],
  }),
  musicContent: many(musicContent),
}));

export const musicContentRelations = relations(musicContent, ({ one }) => ({
  artist: one(artistProfiles, {
    fields: [musicContent.artistId],
    references: [artistProfiles.id],
  }),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  user: one(users, {
    fields: [inventory.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
}));

export const transactionRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [transactions.productId],
    references: [products.id],
  }),
}));


// === ZOD SCHEMAS ===

export const insertUserSchema = createInsertSchema(users);
export const insertWabaAccountSchema = createInsertSchema(wabaAccounts);
export const insertRetellAgentSchema = createInsertSchema(retellAgents);
export const insertCompanySchema = createInsertSchema(companies);
export const insertContactSchema = createInsertSchema(contacts);
export const insertDealSchema = createInsertSchema(deals);
export const insertInteractionSchema = createInsertSchema(interactions);
export const insertCustomerSchema = createInsertSchema(customers, {
    animalCount: z.number().optional(),
    tags: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    farmName: z.string().optional(),
    address: z.string().optional(),
});
export const insertOperationSchema = createInsertSchema(operations);
export const insertInboxSchema = createInsertSchema(inboxes);
export const insertConversationSchema = createInsertSchema(conversations);
export const insertMessageSchema = createInsertSchema(messages);
export const insertChannelConfigSchema = createInsertSchema(channelConfigs);
export const insertSocialAccountSchema = createInsertSchema(socialAccounts);
export const insertWidgetSchema = createInsertSchema(widgets);
export const insertSalesFunnelSchema = createInsertSchema(salesFunnels);
export const insertCampaignSchema = createInsertSchema(campaigns);
export const insertCustomerGroupSchema = createInsertSchema(customerGroups);
export const insertProductCatalogSchema = createInsertSchema(productCatalogs);
export const insertProductSchema = createInsertSchema(products);
export const insertCustomLinkSchema = createInsertSchema(customLinks);
export const insertArtistProfileSchema = createInsertSchema(artistProfiles);
export const insertMusicContentSchema = createInsertSchema(musicContent);
export const insertInventorySchema = createInsertSchema(inventory);
export const insertTransactionSchema = createInsertSchema(transactions);
export const insertPhoneConnectionSchema = createInsertSchema(phoneConnections);


// === TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type WabaAccount = typeof wabaAccounts.$inferSelect;
export type InsertWabaAccount = z.infer<typeof insertWabaAccountSchema>;

export type RetellAgent = typeof retellAgents.$inferSelect;
export type InsertRetellAgent = z.infer<typeof insertRetellAgentSchema>;

export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;

export type Interaction = typeof interactions.$inferSelect;
export type InsertInteraction = z.infer<typeof insertInteractionSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;

export type Operation = typeof operations.$inferSelect;
export type InsertOperation = z.infer<typeof insertOperationSchema>;

export type Inbox = typeof inboxes.$inferSelect;
export type InsertInbox = z.infer<typeof insertInboxSchema>;

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
export type InsertSalesFunnel = z.infer<typeof insertSalesFunnelSchema>;

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;

export type CustomerGroup = typeof customerGroups.$inferSelect;
export type InsertCustomerGroup = z.infer<typeof insertCustomerGroupSchema>;

export type ProductCatalog = typeof productCatalogs.$inferSelect;
export type InsertProductCatalog = z.infer<typeof insertProductCatalogSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type CustomLink = typeof customLinks.$inferSelect;
export type InsertCustomLink = z.infer<typeof insertCustomLinkSchema>;

export type ArtistProfile = typeof artistProfiles.$inferSelect;

export type InsertArtistProfile = z.infer<typeof insertArtistProfileSchema>;

export type MusicContent = typeof musicContent.$inferSelect;
export type InsertMusicContent = z.infer<typeof insertMusicContentSchema>;

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type PhoneConnection = typeof phoneConnections.$inferSelect;
export type InsertPhoneConnection = z.infer<typeof insertPhoneConnectionSchema>;
