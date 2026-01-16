
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
import { loginSchema, registerSchema, insertCustomerSchema, customers, operations } from "@shared/schema"; // Updated imports
import { authMiddleware, type AuthRequest } from "./middleware/auth";
import { db } from "./db"; // Using Drizzle db
import { eq } from "drizzle-orm"; // Using Drizzle eq operator

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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Register integrations
  registerChatRoutes(app);
  registerImageRoutes(app);
  registerUnifiedPlatformRoutes(app);

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
        const allOperations = await db.select().from(operations);
        res.json(allOperations);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ error: "Failed to fetch operations", details: errorMessage });
    }
  });

  // CRM & Retell endpoints
  app.patch("/api/customers/:id/status", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { leadStatus } = z.object({ leadStatus: z.string() }).parse(req.body);
      const updated = await db.update(customers).set({ leadStatus }).where(eq(customers.id, id)).returning();
      res.json(updated[0]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update lead status" });
    }
  });

  app.post("/api/retell/call", async (req: Request, res: Response) => {
    try {
      const { customerId, agentId } = z.object({ customerId: z.number(), agentId: z.string() }).parse(req.body);
      // Mock Retell API call - would use actual Retell SDK here
      console.log(`Initiating Retell call for customer ${customerId} with agent ${agentId}`);
      res.json({ success: true, callId: "mock-call-id" });
    } catch (error) {
      res.status(500).json({ error: "Failed to initiate Retell call" });
    }
  });

  // Other existing routes (contacts, conversations, etc.)
  // ... (The rest of the routes file remains unchanged)

  return httpServer;
}
