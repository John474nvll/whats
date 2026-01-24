
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { aiOrchestrator } from "./services/ai_orchestrator";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { registerUnifiedPlatformRoutes } from "./routes/unified-platforms";
import { loginUser, registerUser, generateToken, verifyToken } from "./services/auth";
import { publishToInstagram, publishToFacebook, sendWhatsAppMessage } from "./services/social-publisher";
import { loginSchema, registerSchema, insertCustomerSchema, customers, operations, campaigns, insertProductSchema, insertCustomLinkSchema, insertInventorySchema, insertSalesFunnelSchema, insertProductCatalogSchema, insertCustomerGroupSchema, insertPhoneConnectionSchema, insertTaskSchema, insertFinanceSchema, insertTeamSchema, insertEmailSchema, insertTicketSchema, insertOpportunitySchema, insertProjectSchema, socialAccounts, retellAgents, callLogs } from "@shared/schema";
import { authMiddleware, type AuthRequest } from "./middleware/auth";
import { db } from "./db"; // Using Drizzle db
import { eq, desc, sql } from "drizzle-orm"; // Using Drizzle eq operator

// Simple SSE implementation
interface SseClient {
  id: number;
  res: Response;
}
let clients: SseClient[] = [];

function broadcast(event: string, data: unknown) {
  clients.forEach(client => {
    client.res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  });
}

import { integratedOrchestrator } from "./services/integrated-orchestrator";

import { insertInvoiceSchema, insertSalesMetricSchema, insertSalesGroupSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ... existing registrations ...

  // Invoices
  app.get("/api/crm/invoices", async (req, res) => {
    try {
      const allInvoices = await storage.getInvoices("demo-user");
      res.json(allInvoices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  app.post("/api/crm/invoices", async (req, res) => {
    try {
      const data = insertInvoiceSchema.parse(req.body);
      const newInvoice = await storage.createInvoice({ ...data, userId: "demo-user" });
      res.status(201).json(newInvoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to create invoice" });
    }
  });

  // Sales Metrics & Analytics
  app.get("/api/crm/metrics", async (req, res) => {
    try {
      const metrics = await storage.getSalesMetrics("demo-user");
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales metrics" });
    }
  });

  // Sales Groups
  app.get("/api/crm/sales-groups", async (req, res) => {
    try {
      const groups = await storage.getSalesGroups();
      res.json(groups);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales groups" });
    }
  });

  app.post("/api/crm/sales-groups", async (req, res) => {
    try {
      const data = insertSalesGroupSchema.parse(req.body);
      const newGroup = await storage.createSalesGroup(data);
      res.status(201).json(newGroup);
    } catch (error) {
      res.status(500).json({ error: "Failed to create sales group" });
    }
  });

  // Projects
  app.get("/api/crm/projects", async (req, res) => {
    try {
      const allProjects = await storage.getProjects("demo-user");
      res.json(allProjects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/crm/projects", async (req, res) => {
    try {
      const data = insertProjectSchema.parse(req.body);
      const newProject = await storage.createProject({ ...data, userId: "demo-user" });
      res.status(201).json(newProject);
    } catch (error) {
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  // Tickets
  app.get("/api/crm/tickets", async (req, res) => {
    try {
      const allTickets = await storage.getTickets("demo-user");
      res.json(allTickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  app.post("/api/crm/tickets", async (req, res) => {
    try {
      const data = insertTicketSchema.parse(req.body);
      const newTicket = await storage.createTicket({ ...data, userId: "demo-user" });
      res.status(201).json(newTicket);
    } catch (error) {
      res.status(500).json({ error: "Failed to create ticket" });
    }
  });

  // Opportunities
  app.get("/api/crm/opportunities", async (req, res) => {
    try {
      const allOpportunities = await storage.getOpportunities("demo-user");
      res.json(allOpportunities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch opportunities" });
    }
  });

  app.post("/api/crm/opportunities", async (req, res) => {
    try {
      const data = insertOpportunitySchema.parse(req.body);
      const newOpportunity = await storage.createOpportunity({ ...data, userId: "demo-user" });
      res.status(201).json(newOpportunity);
    } catch (error) {
      res.status(500).json({ error: "Failed to create opportunity" });
    }
  });

  app.post("/api/ai/generate-smart-content", async (req: Request, res: Response) => {
    try {
      const { type, topic, includeInventory } = req.body;
      
      let context = "";
      if (includeInventory) {
        const inventory = await storage.getInventory("demo-user");
        context = `Inventario disponible: ${JSON.stringify(inventory)}`;
      }

      const prompt = `Genera un contenido de tipo ${type} sobre el tema: ${topic}. ${context}`;
      const generated = await aiOrchestrator.generateResponse(prompt, "AI Content Generator");
      
      res.json({ generated });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  registerImageRoutes(app);
  registerUnifiedPlatformRoutes(app);

  app.post("/api/integrated/sync-lead", async (req, res) => {
    try {
      const { customerId, campaignId } = req.body;
      const result = await integratedOrchestrator.syncLeadToMarketing(customerId, campaignId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/integrated/auto-post", async (req, res) => {
    try {
      const { customerId, platform } = req.body;
      const result = await integratedOrchestrator.createAutomatedPostFromLead(customerId, platform);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // User registration endpoint
  app.post("/api/register", async (req: Request, res: Response) => {
    try {
      const { username, password, botId } = registerSchema.parse(req.body);
      const user = await registerUser(username, password, botId);
      const token = generateToken({ userId: user.id, username: user.username });
      res.status(201).json({ user, token });
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.flatten() });
      }
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: "Failed to register user", details: errorMessage });
    }
  });

  // Customer CRUD endpoints
  app.get("/api/customers", async (req: Request, res: Response) => {
    try {
      const allCustomers = await db.select().from(customers);
      res.json(allCustomers);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: "Failed to fetch customers", details: errorMessage });
    }
  });

  app.get("/api/customers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const customer = await db.select().from(customers).where(eq(customers.id, id));
      if (customer.length === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer[0]);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: "Failed to fetch customer", details: errorMessage });
    }
  });

  app.post("/api/customers", async (req: Request, res: Response) => {
    try {
      const data = insertCustomerSchema.parse(req.body);
      const newCustomer = await db.insert(customers).values(data).returning();
      res.status(201).json(newCustomer[0]);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.flatten() });
      }
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: "Failed to create customer", details: errorMessage });
    }
  });

  app.put("/api/customers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertCustomerSchema.parse(req.body);
      const updatedCustomer = await db.update(customers).set(data).where(eq(customers.id, id)).returning();
      if (updatedCustomer.length === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(updatedCustomer[0]);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.flatten() });
      }
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: "Failed to update customer", details: errorMessage });
    }
  });

  app.delete("/api/customers/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deletedCustomer = await db.delete(customers).where(eq(customers.id, id)).returning();
      if (deletedCustomer.length === 0) {
        return res.status(404).json({ error: "Customer not found to delete" });
      }
      res.json({ message: "Customer deleted successfully" });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes("FOREIGN KEY constraint failed")) {
        return res.status(409).json({ error: "Cannot delete customer because they have associated operations.", details: error.message });
      }
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      res.status(500).json({ error: "Failed to delete customer", details: errorMessage });
    }
  });

  // Operations endpoint
  app.get("/api/operations", async (req: Request, res: Response) => {
    try {
        const allOperations = await storage.getOperations(); 
        res.json(allOperations);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ error: "Failed to fetch operations", details: errorMessage });
    }
  });

  app.get("/api/conversations", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/conversations/:id", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await storage.getConversation(id);
      if (!conversation) return res.status(404).json({ error: "Not found" });
      res.json(conversation);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/conversations/:id/toggle-bot", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { botStatus } = req.body;
      const updated = await storage.updateBotStatus(id, botStatus);
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/conversations/:id/messages", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const messages = await storage.getMessages(id);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/conversations/:id/messages", authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { content, role } = req.body;
      const message = await storage.createMessage({
        conversationId: id,
        content,
        role: role || "agent",
      });
      res.status(201).json(message);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // CRM & Lead Status Management
  app.get("/api/crm/stats", async (req: Request, res: Response) => {
    try {
      const allCustomers = await storage.getCustomers("demo-user");
      const stats = {
        new: allCustomers.filter(c => c.leadStatus === 'new').length,
        contacting: allCustomers.filter(c => c.leadStatus === 'contacting').length,
        qualified: allCustomers.filter(c => c.leadStatus === 'qualified').length,
        won: allCustomers.filter(c => c.leadStatus === 'won').length,
        lost: allCustomers.filter(c => c.leadStatus === 'lost').length,
        total: allCustomers.length
      };
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch CRM stats" });
    }
  });

  app.get("/api/crm/metrics", async (req: Request, res: Response) => {
    try {
      const metrics = await storage.getSalesMetrics("demo-user");
      res.json(metrics[0] || { revenue: 0, newLeads: 0, conversions: 0 });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch metrics" });
    }
  });

  app.get("/api/conversations", async (req: Request, res: Response) => {
    try {
      const convs = await storage.getConversations();
      res.json(convs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Marketing & Campaign Management
  app.get("/api/campaigns", async (req: Request, res: Response) => {
    try {
      const allCampaigns = await db.select().from(campaigns).orderBy(desc(campaigns.createdAt));
      res.json(allCampaigns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch campaigns" });
    }
  });

  app.post("/api/campaigns", async (req: Request, res: Response) => {
    try {
      const data = z.object({
        name: z.string(),
        type: z.string(),
        content: z.string(),
        platform: z.string().optional(),
        status: z.string().default("active"),
        aiGenerated: z.boolean().default(false),
        targetAccountIds: z.array(z.number()).optional()
      }).parse(req.body);

      const userId = "demo-user"; // Simplified for demo
      const newCampaign = await db.insert(campaigns).values({
        ...data,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      res.status(201).json(newCampaign[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to create campaign" });
    }
  });

  app.delete("/api/campaigns/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await db.delete(campaigns).where(eq(campaigns.id, id));
      res.json({ message: "Campaign deleted" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete campaign" });
    }
  });

  app.post("/api/whatsapp/connect", async (req: Request, res: Response) => {
    try {
      const { apiKey, apiSecret, phoneNumber } = req.body;
      console.log(`Connecting WhatsApp via Twilio: ${phoneNumber}`);
      
      // Simulate sync
      await storage.syncPlatformData("demo-user", "whatsapp");
      
      res.json({ success: true, message: "WhatsApp connection initiated and data synced" });
    } catch (error) {
      res.status(500).json({ error: "Failed to connect WhatsApp" });
    }
  });

  app.post("/api/social-accounts/connect", async (req: Request, res: Response) => {
    try {
      const { platform } = req.body;
      const userId = "demo-user";
      
      const newAccount = await db.insert(socialAccounts).values({
        userId,
        platform,
        accessToken: "mock_token_" + Math.random().toString(36).substring(7),
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();

      // Simulate sync
      await storage.syncPlatformData(userId, platform);
      
      res.status(201).json(newAccount[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to connect social account" });
    }
  });

  app.get("/api/crm/pipeline", async (req: Request, res: Response) => {
    try {
      const pipeline = await storage.getCustomers("demo-user");
      res.json(pipeline);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pipeline" });
    }
  });

  // Retell AI Enhanced Integration
  app.get("/api/retell/agents", async (req: Request, res: Response) => {
    try {
      const agents = await storage.getRetellAgents("demo-user");
      if (agents.length === 0) {
        // Mock data if empty
        return res.json([
          { id: "agent_sales_1", name: "Asistente de Ventas (ES)", status: "ready" },
          { id: "agent_support_1", name: "Soporte Técnico (ES)", status: "ready" }
        ]);
      }
      res.json(agents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch agents" });
    }
  });

  app.get("/api/retell/calls", async (req: Request, res: Response) => {
    try {
      const logs = await storage.getCallLogs("demo-user");
      if (logs.length === 0) {
        return res.json([
          { id: 1, duration: 45, status: "completed", createdAt: new Date() },
          { id: 2, duration: 120, status: "completed", createdAt: new Date(Date.now() - 3600000) }
        ]);
      }
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch call logs" });
    }
  });

  app.post("/api/retell/call/schedule", async (req: Request, res: Response) => {
    try {
      const { customerId, agentId, scheduledAt } = z.object({ 
        customerId: z.number(), 
        agentId: z.string(),
        scheduledAt: z.string()
      }).parse(req.body);
      
      console.log(`Scheduling Retell call for ${customerId} at ${scheduledAt}`);
      res.json({ success: true, message: "Call scheduled successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to schedule call" });
    }
  });

  // Social Account Token Refresh
  app.post("/api/social-accounts/:id/refresh", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const account = await storage.getSocialAccountById(id);
      if (!account) return res.status(404).json({ error: "Account not found" });

      const updated = await storage.updateSocialAccount(id, {
        accessToken: `refreshed_${Math.random().toString(36).substring(7)}`,
        updatedAt: new Date()
      });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to refresh token" });
    }
  });

  // Products & Inventory
  app.get("/api/products", async (req: Request, res: Response) => {
    try {
      const allProducts = await storage.getProducts("demo-user");
      res.json(allProducts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.post("/api/products", async (req: Request, res: Response) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct({ ...data, userId: "demo-user" });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  });

  app.get("/api/inventory", async (req: Request, res: Response) => {
    try {
      const allInventory = await storage.getInventory("demo-user");
      res.json(allInventory);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch inventory" });
    }
  });

  app.post("/api/inventory", async (req: Request, res: Response) => {
    try {
      const data = insertInventorySchema.parse(req.body);
      const newItem = await storage.createInventory({ ...data, userId: "demo-user" });
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to create inventory item" });
    }
  });

  // Custom Links
  app.get("/api/links", async (req: Request, res: Response) => {
    try {
      const allLinks = await storage.getCustomLinks("demo-user");
      res.json(allLinks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch custom links" });
    }
  });

  app.post("/api/links", async (req: Request, res: Response) => {
    try {
      const data = insertCustomLinkSchema.parse(req.body);
      const newLink = await storage.createCustomLink({ ...data, userId: "demo-user" });
      res.status(201).json(newLink);
    } catch (error) {
      res.status(500).json({ error: "Failed to create custom link" });
    }
  });

  // Social Account by User
  app.get("/api/social-accounts/:userId", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const accounts = await storage.getSocialAccounts(userId);
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch social accounts" });
    }
  });

  // DELETE Social Account (Disconnect)
  app.delete("/api/social-accounts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSocialAccount(id);
      res.json({ success: true, message: "Account disconnected successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to disconnect account" });
    }
  });

  // Funnels
  app.get("/api/funnels", async (req: Request, res: Response) => {
    try {
      const allFunnels = await storage.getFunnels("demo-user");
      res.json(allFunnels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch funnels" });
    }
  });

  app.post("/api/funnels", async (req: Request, res: Response) => {
    try {
      const data = insertSalesFunnelSchema.parse(req.body);
      const newFunnel = await storage.createFunnel({ ...data, userId: "demo-user" });
      res.status(201).json(newFunnel);
    } catch (error) {
      res.status(500).json({ error: "Failed to create funnel" });
    }
  });

  // Product Catalogs
  app.get("/api/catalogs", async (req: Request, res: Response) => {
    try {
      const allCatalogs = await storage.getCatalogs("demo-user");
      res.json(allCatalogs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch catalogs" });
    }
  });

  app.post("/api/catalogs", async (req: Request, res: Response) => {
    try {
      const data = insertProductCatalogSchema.parse(req.body);
      const newCatalog = await storage.createCatalog({ ...data, userId: "demo-user" });
      res.status(201).json(newCatalog);
    } catch (error) {
      res.status(500).json({ error: "Failed to create catalog" });
    }
  });

  // Customer Groups
  app.get("/api/customer-groups", async (req: Request, res: Response) => {
    try {
      const allGroups = await storage.getCustomerGroups("demo-user");
      res.json(allGroups);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch customer groups" });
    }
  });

  app.post("/api/customer-groups", async (req: Request, res: Response) => {
    try {
      const data = insertCustomerGroupSchema.parse(req.body);
      const newGroup = await storage.createCustomerGroup({ ...data, userId: "demo-user" });
      res.status(201).json(newGroup);
    } catch (error) {
      res.status(500).json({ error: "Failed to create customer group" });
    }
  });

  // Finances
  app.get("/api/finances", async (req: Request, res: Response) => {
    try {
      const allFinances = await storage.getFinances();
      res.json(allFinances);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch finances" });
    }
  });

  app.post("/api/finances", async (req: Request, res: Response) => {
    try {
      const data = insertFinanceSchema.parse(req.body);
      const newFinance = await storage.createFinance({ ...data, userId: "demo-user" });
      res.status(201).json(newFinance);
    } catch (error) {
      res.status(500).json({ error: "Failed to create finance record" });
    }
  });

  // Teams
  app.get("/api/teams", async (req: Request, res: Response) => {
    try {
      const allTeams = await storage.getTeams();
      res.json(allTeams);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch teams" });
    }
  });

  // Tasks
  app.get("/api/tasks", async (req: Request, res: Response) => {
    try {
      const allTasks = await storage.getTasks();
      res.json(allTasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      const data = insertTaskSchema.parse(req.body);
      const newTask = await storage.createTask({ ...data, userId: "demo-user" });
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: "Failed to create task" });
    }
  });

  // Emails
  app.post("/api/emails/send", async (req: Request, res: Response) => {
    try {
      const data = insertEmailSchema.parse(req.body);
      const newEmail = await storage.createEmail({ ...data, userId: "demo-user" });
      res.status(201).json(newEmail);
    } catch (error) {
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // CRM Advanced API
  app.patch("/api/customers/:id/crm", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const data = z.object({
        leadStatus: z.string().optional(),
        source: z.string().optional(),
        estimatedValue: z.number().optional(),
        conversionProbability: z.number().optional(),
        notes: z.string().optional(),
      }).parse(req.body);

      const updated = await db.update(customers)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(customers.id, id))
        .returning();

      if (updated.length === 0) return res.status(404).json({ error: "Customer not found" });
      res.json(updated[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update CRM data" });
    }
  });

  app.get("/api/crm/leads/high-value", async (req: Request, res: Response) => {
    try {
      const highValueLeads = await db.select()
        .from(customers)
        .where(sql`${customers.estimatedValue} > 0`)
        .orderBy(desc(customers.estimatedValue))
        .limit(10);
      res.json(highValueLeads);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch high value leads" });
    }
  });

  // Other existing routes (contacts, conversations, etc.)
  // ... (The rest of the routes file remains unchanged)

  return httpServer;
}
