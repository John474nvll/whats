
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
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user"), // admin, manager, salesperson, customer
  avatar: text("avatar"),
  teamId: integer("team_id"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  leaderId: text("leader_id").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  assignedTo: text("assigned_to").references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("pending"), // pending, in_progress, completed, cancelled
  priority: text("priority").default("medium"), // low, medium, high
  dueDate: integer("due_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const finances = sqliteTable("finances", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // income, expense
  category: text("category").notNull(),
  amount: real("amount").notNull(),
  description: text("description"),
  date: integer("date", { mode: "timestamp" }).notNull(),
  status: text("status").default("completed"), // pending, completed, void
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const emails = sqliteTable("emails", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  to: text("to").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  status: text("status").default("sent"), // sent, failed, draft
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
  aiGenerated: integer("ai_generated", { mode: "boolean" }).default(false),
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
  shortCode: text("short_code").notNull().unique(),
  originalUrl: text("original_url").notNull(),
  clicks: integer("clicks").default(0),
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
  userId: text("user_id").notNull().references(() => users.id),
  platform: text("platform").notNull(), // twilio, whatsapp_business, manual
  phoneNumber: text("phone_number").notNull(),
  sid: text("sid"), // For Twilio
  authToken: text("auth_token"), // For Twilio/WA
  status: text("status").default("active"),
  region: text("region").default("Colombia"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});


export const invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  invoiceNumber: text("invoice_number").notNull().unique(),
  amount: real("amount").notNull(),
  tax: real("tax").default(0),
  total: real("total").notNull(),
  status: text("status").default("pending"), // pending, paid, overdue, cancelled
  dueDate: integer("due_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const salesMetrics = sqliteTable("sales_metrics", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  period: text("period").notNull(), // daily, weekly, monthly
  revenue: real("revenue").default(0),
  newLeads: integer("new_leads").default(0),
  conversions: integer("conversions").default(0),
  date: integer("date", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const salesGroups = sqliteTable("sales_groups", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  managerId: text("manager_id").references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("active"), // active, on_hold, completed, cancelled
  priority: text("priority").default("medium"),
  dueDate: integer("due_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const tickets = sqliteTable("tickets", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  customerId: integer("customer_id").references(() => customers.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").default("open"), // open, in_progress, resolved, closed
  priority: text("priority").default("medium"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const opportunities = sqliteTable("opportunities", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  customerId: integer("customer_id").notNull().references(() => customers.id),
  title: text("title").notNull(),
  value: real("value").notNull(),
  stage: text("stage").notNull(), // lead, qualification, proposal, negotiation, closed_won, closed_lost
  probability: integer("probability"),
  expectedCloseDate: integer("expected_close_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(new Date()),
});

export const retellAgents = sqliteTable("retell_agents", {
  id: text("id").primaryKey(), // agent_id from Retell
  userId: text("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  voiceId: text("voice_id"),
  llmId: text("llm_id"),
  status: text("status").default("ready"), // ready, calling, maintenance
  lastCallAt: integer("last_call_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

export const callLogs = sqliteTable("call_logs", {
  id: integer("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  customerId: integer("customer_id").references(() => customers.id),
  agentId: text("agent_id").references(() => retellAgents.id),
  callSid: text("call_sid"), // Twilio Call SID
  duration: integer("duration"),
  status: text("status"), // completed, failed, busy
  recordingUrl: text("recording_url"),
  summary: text("summary"),
  sentiment: text("sentiment"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(new Date()),
});

// ... inside userRelations ...
  retellAgents: many(retellAgents),
  callLogs: many(callLogs),
}));

export const retellAgentRelations = relations(retellAgents, ({ one, many }) => ({
  user: one(users, {
    fields: [retellAgents.userId],
    references: [users.id],
  }),
  calls: many(callLogs),
}));

export const callLogRelations = relations(callLogs, ({ one }) => ({
  user: one(users, {
    fields: [callLogs.userId],
    references: [users.id],
  }),
  customer: one(customers, {
    fields: [callLogs.customerId],
    references: [customers.id],
  }),
  agent: one(retellAgents, {
    fields: [callLogs.agentId],
    references: [retellAgents.id],
  }),
}));

export const insertRetellAgentSchema = createInsertSchema(retellAgents);
export const insertCallLogSchema = createInsertSchema(callLogs);

export type RetellAgent = typeof retellAgents.$inferSelect;
export type InsertRetellAgent = z.infer<typeof insertRetellAgentSchema>;
export type CallLog = typeof callLogs.$inferSelect;
export type InsertCallLog = z.infer<typeof insertCallLogSchema>;

export const projectRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
  tasks: many(tasks),
}));

export const teamRelations = relations(teams, ({ one, many }) => ({
  leader: one(users, {
    fields: [teams.leaderId],
    references: [users.id],
  }),
  members: many(users),
}));

export const taskRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
    relationName: "userTasks",
  }),
  assignee: one(users, {
    fields: [tasks.assignedTo],
    references: [users.id],
    relationName: "assignedTasks",
  }),
}));

export const financeRelations = relations(finances, ({ one }) => ({
  user: one(users, {
    fields: [finances.userId],
    references: [users.id],
  }),
}));

export const emailRelations = relations(emails, ({ one }) => ({
  user: one(users, {
    fields: [emails.userId],
    references: [users.id],
  }),
}));

// === ZOD SCHEMAS ===

export const insertUserSchema = createInsertSchema(users);
export const insertTeamSchema = createInsertSchema(teams);
export const insertTaskSchema = createInsertSchema(tasks);
export const insertFinanceSchema = createInsertSchema(finances);
export const insertEmailSchema = createInsertSchema(emails);
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
export const insertChannelConfigSchema = createInsertSchema(channelConfigs);
export const insertSocialAccountSchema = createInsertSchema(socialAccounts);
export const insertWidgetSchema = createInsertSchema(widgets);
export const insertSalesFunnelSchema = createInsertSchema(salesFunnels);
export const insertCampaignSchema = createInsertSchema(campaigns);
export const insertCustomerGroupSchema = createInsertSchema(customerGroups);
export const insertProductCatalogSchema = createInsertSchema(productCatalogs);
export const insertProductSchema = createInsertSchema(products);
export const insertCustomLinkSchema = createInsertSchema(customLinks);
export const insertInventorySchema = createInsertSchema(inventory);
export const insertTransactionSchema = createInsertSchema(transactions);
export const insertPhoneConnectionSchema = createInsertSchema(phoneConnections);

export const insertInvoiceSchema = createInsertSchema(invoices);
export const insertSalesMetricSchema = createInsertSchema(salesMetrics);
export const insertSalesGroupSchema = createInsertSchema(salesGroups);

export const insertProjectSchema = createInsertSchema(projects);
export const insertTicketSchema = createInsertSchema(tickets);
export const insertOpportunitySchema = createInsertSchema(opportunities);

// === TYPES ===

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;

export type Opportunity = typeof opportunities.$inferSelect;
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type SalesMetric = typeof salesMetrics.$inferSelect;
export type InsertSalesMetric = z.infer<typeof insertSalesMetricSchema>;

export type SalesGroup = typeof salesGroups.$inferSelect;
export type InsertSalesGroup = z.infer<typeof insertSalesGroupSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

export type Finance = typeof finances.$inferSelect;
export type InsertFinance = z.infer<typeof insertFinanceSchema>;

export type Email = typeof emails.$inferSelect;
export type InsertEmail = z.infer<typeof insertEmailSchema>;

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

export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type PhoneConnection = typeof phoneConnections.$inferSelect;
export type InsertPhoneConnection = z.infer<typeof insertPhoneConnectionSchema>;

