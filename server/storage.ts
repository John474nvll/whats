import { db } from "./db";
import {
  users, contacts, conversations, messages, channelConfigs, socialAccounts, widgets, salesFunnels, campaigns, customers, phoneConnections,
  customerGroups, productCatalogs, products, customLinks, inventory, transactions,
  teams, tasks, finances, emails,
  invoices, salesMetrics, salesGroups, projects, tickets, opportunities,
  type User, type InsertUser,
  type Contact, type InsertContact,
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type ChannelConfig, type InsertChannelConfig,
  type SocialAccount, type InsertSocialAccount,
  type Widget, type InsertWidget,
  type SalesFunnel, type InsertSalesFunnel,
  type Campaign, type InsertCampaign,
  type Customer, type InsertCustomer,
  type CustomerGroup, type InsertCustomerGroup,
  type ProductCatalog, type InsertProductCatalog,
  type Inventory, type InsertInventory,
  type Transaction, type InsertTransaction,
  type Product, type InsertProduct,
  type CustomLink, type InsertCustomLink,
  type PhoneConnection, type InsertPhoneConnection,
  type Team, type InsertTeam,
  type Task, type InsertTask,
  type Finance, type InsertFinance,
  type Email, type InsertEmail,
  type Invoice, type InsertInvoice,
  type SalesMetric, type InsertSalesMetric,
  type SalesGroup, type InsertSalesGroup,
  type Project, type InsertProject,
  type Ticket, type InsertTicket,
  type Opportunity, type InsertOpportunity,
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;

  getTeams(): Promise<Team[]>;
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;

  getTasks(assignedTo?: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task>;

  getFinances(): Promise<Finance[]>;
  createFinance(finance: InsertFinance): Promise<Finance>;

  getEmails(userId: string): Promise<Email[]>;
  createEmail(email: InsertEmail): Promise<Email>;

  getInventory(userId: string): Promise<Inventory[]>;
  createInventory(item: InsertInventory): Promise<Inventory>;
  updateInventory(id: number, updates: Partial<InsertInventory>): Promise<Inventory>;
  deleteInventory(id: number): Promise<void>;

  getTransactions(userId: string): Promise<Transaction[]>;
  createTransaction(tx: InsertTransaction): Promise<Transaction>;

  getContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  getContactByPhone(phone: string): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;

  getConversations(): Promise<(Conversation & { contact: Contact })[]>;
  getConversation(id: number): Promise<(Conversation & { messages: Message[] }) | undefined>;
  getConversationByContactId(contactId: number): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversationStatus(id: number, status: string): Promise<Conversation>;
  updateBotStatus(id: number, isActive: boolean): Promise<Conversation>;

  getMessages(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;

  getChannels(): Promise<ChannelConfig[]>;
  getChannel(platform: string): Promise<ChannelConfig | undefined>;
  updateChannel(platform: string, config: Partial<InsertChannelConfig>): Promise<ChannelConfig>;
  createChannel(config: InsertChannelConfig): Promise<ChannelConfig>;

  getSocialAccounts(userId: string): Promise<SocialAccount[]>;
  getSocialAccount(userId: string, platform: string): Promise<SocialAccount | undefined>;
  createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount>;
  updateSocialAccount(id: number, updates: Partial<InsertSocialAccount>): Promise<SocialAccount>;
  deleteSocialAccount(id: number): Promise<void>;

  getWidgets(userId: string): Promise<Widget[]>;
  createWidget(widget: InsertWidget): Promise<Widget>;
  updateWidget(id: number, updates: Partial<InsertWidget>): Promise<Widget>;
  deleteWidget(id: number): Promise<void>;

  getFunnels(userId: string): Promise<SalesFunnel[]>;
  createFunnel(funnel: InsertSalesFunnel): Promise<SalesFunnel>;
  updateFunnel(id: number, updates: Partial<InsertSalesFunnel>): Promise<SalesFunnel>;
  deleteFunnel(id: number): Promise<void>;

  getCampaigns(userId: string): Promise<Campaign[]>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: number, updates: Partial<InsertCampaign>): Promise<Campaign>;
  deleteCampaign(id: number): Promise<void>;

  getCustomers(userId: string): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer>;
  deleteCustomer(id: number): Promise<void>;

  getCustomerGroups(userId: string): Promise<CustomerGroup[]>;
  createCustomerGroup(group: InsertCustomerGroup): Promise<CustomerGroup>;
  deleteCustomerGroup(id: number): Promise<void>;

  getCatalogs(userId: string): Promise<ProductCatalog[]>;
  createCatalog(catalog: InsertProductCatalog): Promise<ProductCatalog>;
  updateCatalog(id: number, updates: Partial<InsertProductCatalog>): Promise<ProductCatalog>;
  deleteCatalog(id: number): Promise<void>;

  getSocialAccountById(id: number): Promise<SocialAccount | undefined>;

  getProducts(userId: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  getCustomLinks(userId: string): Promise<CustomLink[]>;
  getCustomLink(shortCode: string): Promise<CustomLink | undefined>;
  createCustomLink(link: InsertCustomLink): Promise<CustomLink>;
  incrementLinkClicks(id: number): Promise<void>;

  getPhoneConnections(): Promise<PhoneConnection[]>;
  getPhoneConnection(phoneNumber: string): Promise<PhoneConnection | undefined>;
  createPhoneConnection(connection: InsertPhoneConnection): Promise<PhoneConnection>;
  updatePhoneConnection(id: number, updates: Partial<InsertPhoneConnection>): Promise<PhoneConnection>;
  deletePhoneConnection(id: number): Promise<void>;

  getInvoices(userId: string): Promise<Invoice[]>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getSalesMetrics(userId: string): Promise<SalesMetric[]>;
  getSalesGroups(): Promise<SalesGroup[]>;
  createSalesGroup(group: InsertSalesGroup): Promise<SalesGroup>;
  getProjects(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  getTickets(userId: string): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  getOpportunities(userId: string): Promise<Opportunity[]>;
  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  syncPlatformData(userId: string, platform: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const [updated] = await db.update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async getTeams(): Promise<Team[]> {
    return await db.select().from(teams);
  }
  async getTeam(id: number): Promise<Team | undefined> {
    const [team] = await db.select().from(teams).where(eq(teams.id, id));
    return team;
  }
  async createTeam(insertTeam: InsertTeam): Promise<Team> {
    const [team] = await db.insert(teams).values(insertTeam).returning();
    return team;
  }

  async getTasks(assignedTo?: string): Promise<Task[]> {
    if (assignedTo) {
      return await db.select().from(tasks).where(eq(tasks.assignedTo, assignedTo));
    }
    return await db.select().from(tasks);
  }
  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(insertTask).returning();
    return task;
  }
  async updateTask(id: number, update: Partial<InsertTask>): Promise<Task> {
    const [task] = await db.update(tasks).set(update).where(eq(tasks.id, id)).returning();
    return task;
  }

  async getFinances(): Promise<Finance[]> {
    return await db.select().from(finances);
  }
  async createFinance(insertFinance: InsertFinance): Promise<Finance> {
    const [finance] = await db.insert(finances).values(insertFinance).returning();
    return finance;
  }

  async getEmails(userId: string): Promise<Email[]> {
    return await db.select().from(emails).where(eq(emails.userId, userId));
  }
  async createEmail(insertEmail: InsertEmail): Promise<Email> {
    const [email] = await db.insert(emails).values(insertEmail).returning();
    return email;
  }

  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }

  async getContactByPhone(phone: string): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.phone, phone));
    return contact;
  }

  async createContact(contact: InsertContact): Promise<Contact> {
    const [newContact] = await db.insert(contacts).values(contact).returning();
    return newContact;
  }

  async getConversations(): Promise<(Conversation & { contact: Contact })[]> {
    const result = await db.query.conversations.findMany({
      with: {
        contact: true,
      },
      orderBy: [desc(conversations.lastMessageAt)],
    });
    return result as (Conversation & { contact: Contact })[];
  }

  async getConversation(id: number): Promise<(Conversation & { messages: Message[] }) | undefined> {
    const conversation = await db.query.conversations.findFirst({
      where: eq(conversations.id, id),
      with: {
        messages: {
          orderBy: [desc(messages.createdAt)],
          limit: 50,
        },
      },
    });
    if (!conversation) return undefined;
    return conversation as (Conversation & { messages: Message[] });
  }

  async getConversationByContactId(contactId: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.contactId, contactId));
    return conversation;
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const [newConversation] = await db.insert(conversations).values(conversation).returning();
    return newConversation;
  }

  async updateConversationStatus(id: number, status: string): Promise<Conversation> {
    const [updated] = await db.update(conversations)
      .set({ status })
      .where(eq(conversations.id, id))
      .returning();
    return updated;
  }

  async updateBotStatus(id: number, isActive: boolean): Promise<Conversation> {
    const [updated] = await db.update(conversations)
      .set({ botStatus: isActive })
      .where(eq(conversations.id, id))
      .returning();
    return updated;
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return await db.select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    await db.update(conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(conversations.id, message.conversationId));
    return newMessage;
  }

  async getChannels(): Promise<ChannelConfig[]> {
    return await db.select().from(channelConfigs);
  }

  async getChannel(platform: string): Promise<ChannelConfig | undefined> {
    const [config] = await db.select().from(channelConfigs).where(eq(channelConfigs.platform, platform));
    return config;
  }

  async updateChannel(platform: string, config: Partial<InsertChannelConfig>): Promise<ChannelConfig> {
    const [updated] = await db.update(channelConfigs)
      .set({ ...config, updatedAt: new Date() })
      .where(eq(channelConfigs.platform, platform))
      .returning();
    return updated;
  }

  async createChannel(config: InsertChannelConfig): Promise<ChannelConfig> {
    const [newConfig] = await db.insert(channelConfigs).values(config).returning();
    return newConfig;
  }

  async getSocialAccounts(userId: string): Promise<SocialAccount[]> {
    return await db.select().from(socialAccounts).where(eq(socialAccounts.userId, userId));
  }

  async getSocialAccount(userId: string, platform: string): Promise<SocialAccount | undefined> {
    const [account] = await db.select().from(socialAccounts)
      .where(and(eq(socialAccounts.userId, userId), eq(socialAccounts.platform, platform)));
    return account;
  }

  async createSocialAccount(account: InsertSocialAccount): Promise<SocialAccount> {
    const [newAccount] = await db.insert(socialAccounts).values(account).returning();
    return newAccount;
  }

  async updateSocialAccount(id: number, updates: Partial<InsertSocialAccount>): Promise<SocialAccount> {
    const [updated] = await db.update(socialAccounts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(socialAccounts.id, id))
      .returning();
    return updated;
  }

  async deleteSocialAccount(id: number): Promise<void> {
    await db.delete(socialAccounts).where(eq(socialAccounts.id, id));
  }

  async getWidgets(userId: string): Promise<Widget[]> {
    const existingWidgets = await db.select().from(widgets).where(eq(widgets.userId, userId)).orderBy(widgets.position);
    if (existingWidgets.length === 0) {
      // Create default widgets for demo
      const defaultWidgets: InsertWidget[] = [
        { userId, type: "quick_access", position: 0, config: { title: "Acceso Rápido" } },
        { userId, type: "crm_stats", position: 1, config: { title: "Resumen CRM" } },
        { userId, type: "sales_pipeline", position: 2, config: { title: "Pipeline de Ventas" } },
        { userId, type: "recent_leads", position: 3, config: { title: "Leads Recientes" } },
        { userId, type: "campaign_metrics", position: 4, config: { title: "Métricas de Campañas" } }
      ];
      const created = [];
      for (const w of defaultWidgets) {
        const [newW] = await db.insert(widgets).values(w).returning();
        created.push(newW);
      }
      return created;
    }
    return existingWidgets;
  }

  async createWidget(widget: InsertWidget): Promise<Widget> {
    const [newWidget] = await db.insert(widgets).values(widget).returning();
    return newWidget;
  }

  async updateWidget(id: number, updates: Partial<InsertWidget>): Promise<Widget> {
    const [updated] = await db.update(widgets)
      .set(updates)
      .where(eq(widgets.id, id))
      .returning();
    return updated;
  }

  async deleteWidget(id: number): Promise<void> {
    await db.delete(widgets).where(eq(widgets.id, id));
  }

  async getFunnels(userId: string): Promise<SalesFunnel[]> {
    return await db.select().from(salesFunnels).where(eq(salesFunnels.userId, userId)).orderBy(desc(salesFunnels.createdAt));
  }

  async createFunnel(funnel: InsertSalesFunnel): Promise<SalesFunnel> {
    const [newFunnel] = await db.insert(salesFunnels).values(funnel).returning();
    return newFunnel;
  }

  async updateFunnel(id: number, updates: Partial<InsertSalesFunnel>): Promise<SalesFunnel> {
    const [updated] = await db.update(salesFunnels)
      .set(updates)
      .where(eq(salesFunnels.id, id))
      .returning();
    return updated;
  }

  async deleteFunnel(id: number): Promise<void> {
    await db.delete(salesFunnels).where(eq(salesFunnels.id, id));
  }

  async getCampaigns(userId: string): Promise<Campaign[]> {
    return await db.select().from(campaigns).where(eq(campaigns.userId, userId)).orderBy(desc(campaigns.createdAt));
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  async updateCampaign(id: number, updates: Partial<InsertCampaign>): Promise<Campaign> {
    const [updated] = await db.update(campaigns)
      .set(updates)
      .where(eq(campaigns.id, id))
      .returning();
    return updated;
  }

  async deleteCampaign(id: number): Promise<void> {
    await db.delete(campaigns).where(eq(campaigns.id, id));
  }

  async getCustomers(userId: string): Promise<Customer[]> {
    return await db.select().from(customers).where(eq(customers.userId, userId)).orderBy(desc(customers.createdAt));
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    const [customer] = await db.select().from(customers).where(eq(customers.id, id));
    return customer;
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const [newCustomer] = await db.insert(customers).values(customer).returning();
    return newCustomer;
  }

  async updateCustomer(id: number, updates: Partial<InsertCustomer>): Promise<Customer> {
    const [updated] = await db.update(customers)
      .set(updates)
      .where(eq(customers.id, id))
      .returning();
    return updated;
  }

  async deleteCustomer(id: number): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }

  async getCustomerGroups(userId: string): Promise<CustomerGroup[]> {
    return await db.select().from(customerGroups).where(eq(customerGroups.userId, userId));
  }

  async createCustomerGroup(group: InsertCustomerGroup): Promise<CustomerGroup> {
    const [newGroup] = await db.insert(customerGroups).values(group).returning();
    return newGroup;
  }

  async deleteCustomerGroup(id: number): Promise<void> {
    await db.delete(customerGroups).where(eq(customerGroups.id, id));
  }

  async getCatalogs(userId: string): Promise<ProductCatalog[]> {
    return await db.select().from(productCatalogs).where(eq(productCatalogs.userId, userId));
  }

  async createCatalog(catalog: InsertProductCatalog): Promise<ProductCatalog> {
    const [newCatalog] = await db.insert(productCatalogs).values(catalog).returning();
    return newCatalog;
  }

  async updateCatalog(id: number, updates: Partial<InsertProductCatalog>): Promise<ProductCatalog> {
    const [updated] = await db.update(productCatalogs).set(updates).where(eq(productCatalogs.id, id)).returning();
    return updated;
  }

  async deleteCatalog(id: number): Promise<void> {
    await db.delete(productCatalogs).where(eq(productCatalogs.id, id));
  }

  async syncPlatformData(userId: string, platform: string): Promise<void> {
    // Mock synchronization logic
    const phone = await db.select().from(phoneConnections).where(eq(phoneConnections.userId, userId));
    if (phone.length > 0 || platform !== "whatsapp") {
      // Create a mock contact if none exists
      const [contact] = await db.insert(contacts).values({
        name: `Contact from ${platform}`,
        phone: `+57${Math.floor(Math.random() * 1000000000)}`,
        platform: platform,
      }).returning();

      const [conv] = await db.insert(conversations).values({
        contactId: contact.id,
        status: "active",
        lastMessageAt: new Date(),
      }).returning();

      await db.insert(messages).values({
        conversationId: conv.id,
        role: "user",
        content: `Hola, vengo de ${platform}. ¿Cómo estás?`,
        createdAt: new Date(),
      });
    }
  }

  async getSocialAccountById(id: number): Promise<SocialAccount | undefined> {
    const [account] = await db.select().from(socialAccounts).where(eq(socialAccounts.id, id));
    return account;
  }

  async getProducts(userId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.userId, userId));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [item] = await db.select().from(products).where(eq(products.id, id));
    return item;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newItem] = await db.insert(products).values(product).returning();
    return newItem;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product> {
    const [updated] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getCustomLinks(userId: string): Promise<CustomLink[]> {
    return await db.select().from(customLinks).where(eq(customLinks.userId, userId));
  }

  async getCustomLink(shortCode: string): Promise<CustomLink | undefined> {
    const [link] = await db.select().from(customLinks).where(eq(customLinks.shortCode, shortCode));
    return link;
  }

  async createCustomLink(link: InsertCustomLink): Promise<CustomLink> {
    const [newLink] = await db.insert(customLinks).values(link).returning();
    return newLink;
  }

  async incrementLinkClicks(id: number): Promise<void> {
    const [link] = await db.select().from(customLinks).where(eq(customLinks.id, id));
    if (link) {
      await db.update(customLinks).set({ clicks: (link.clicks || 0) + 1 }).where(eq(customLinks.id, id));
    }
  }

  async getInventory(userId: string): Promise<Inventory[]> {
    return await db.select().from(inventory).where(eq(inventory.userId, userId));
  }

  async createInventory(item: InsertInventory): Promise<Inventory> {
    const [newItem] = await db.insert(inventory).values(item).returning();
    return newItem;
  }

  async updateInventory(id: number, updates: Partial<InsertInventory>): Promise<Inventory> {
    const [updated] = await db.update(inventory).set(updates).where(eq(inventory.id, id)).returning();
    return updated;
  }

  async deleteInventory(id: number): Promise<void> {
    await db.delete(inventory).where(eq(inventory.id, id));
  }

  async getTransactions(userId: string): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt));
  }

  async createTransaction(tx: InsertTransaction): Promise<Transaction> {
    const [newTx] = await db.insert(transactions).values(tx).returning();
    return newTx;
  }

  async getPhoneConnections(): Promise<PhoneConnection[]> {
    return await db.select().from(phoneConnections).orderBy(desc(phoneConnections.createdAt));
  }

  async getPhoneConnection(phoneNumber: string): Promise<PhoneConnection | undefined> {
    const [connection] = await db.select().from(phoneConnections).where(eq(phoneConnections.phoneNumber, phoneNumber));
    return connection;
  }

  async createPhoneConnection(connection: InsertPhoneConnection): Promise<PhoneConnection> {
    const [newConnection] = await db.insert(phoneConnections).values(connection).returning();
    return newConnection;
  }

  async updatePhoneConnection(id: number, updates: Partial<InsertPhoneConnection>): Promise<PhoneConnection> {
    const [updated] = await db.update(phoneConnections)
      .set(updates)
      .where(eq(phoneConnections.id, id))
      .returning();
    return updated;
  }

  async deletePhoneConnection(id: number): Promise<void> {
    await db.delete(phoneConnections).where(eq(phoneConnections.id, id));
  }

  async getOperations(): Promise<any[]> {
    return await db.select().from(finances);
  }

  async getInvoices(userId: string): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.userId, userId)).orderBy(desc(invoices.createdAt));
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await db.insert(invoices).values(invoice).returning();
    return newInvoice;
  }

  async getSalesMetrics(userId: string): Promise<SalesMetric[]> {
    return await db.select().from(salesMetrics).where(eq(salesMetrics.userId, userId)).orderBy(desc(salesMetrics.date));
  }

  async getSalesGroups(): Promise<SalesGroup[]> {
    return await db.select().from(salesGroups);
  }

  async createSalesGroup(group: InsertSalesGroup): Promise<SalesGroup> {
    const [newGroup] = await db.insert(salesGroups).values(group).returning();
    return newGroup;
  }

  async getProjects(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async getTickets(userId: string): Promise<Ticket[]> {
    return await db.select().from(tickets).where(eq(tickets.userId, userId)).orderBy(desc(tickets.createdAt));
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const [newTicket] = await db.insert(tickets).values(ticket).returning();
    return newTicket;
  }

  async getOpportunities(userId: string): Promise<Opportunity[]> {
    return await db.select().from(opportunities).where(eq(opportunities.userId, userId)).orderBy(desc(opportunities.createdAt));
  }

  async createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity> {
    const [newOpportunity] = await db.insert(opportunities).values(opportunity).returning();
    return newOpportunity;
  }
}

export const storage = new DatabaseStorage();
