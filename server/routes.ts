
import type { Express } from "express";
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
import { db } from "./lib/db"; // Using Drizzle db
import { eq } from "drizzle-orm"; // Using Drizzle eq operator

// Simple SSE implementation
let clients: { id: number; res: any }[] = [];

function broadcast(event: string, data: any) {
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

  // Auto-register demo users
  // ... (user seeding logic remains the same)

  // Customer CRUD endpoints
  app.get("/api/customers", async (req, res) => {
    try {
      const allCustomers = await db.select().from(customers);
      res.json(allCustomers);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch customers", details: error.message });
    }
  });

  app.get("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const customer = await db.select().from(customers).where(eq(customers.id, id));
      if (customer.length === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(customer[0]);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch customer", details: error.message });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const data = insertCustomerSchema.parse(req.body);
      const newCustomer = await db.insert(customers).values(data).returning();
      res.status(201).json(newCustomer[0]);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.flatten() });
      }
      res.status(500).json({ error: "Failed to create customer", details: error.message });
    }
  });

  app.put("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertCustomerSchema.parse(req.body);
      const updatedCustomer = await db.update(customers).set(data).where(eq(customers.id, id)).returning();
      if (updatedCustomer.length === 0) {
        return res.status(404).json({ error: "Customer not found" });
      }
      res.json(updatedCustomer[0]);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.flatten() });
      }
      res.status(500).json({ error: "Failed to update customer", details: error.message });
    }
  });

  app.delete("/api/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deletedCustomer = await db.delete(customers).where(eq(customers.id, id)).returning();
      if (deletedCustomer.length === 0) {
        return res.status(404).json({ error: "Customer not found to delete" });
      }
      res.json({ message: "Customer deleted successfully" });
    } catch (error: any) {
      if (error.message.includes("FOREIGN KEY constraint failed")) {
        return res.status(409).json({ error: "Cannot delete customer because they have associated operations.", details: error.message });
      }
      res.status(500).json({ error: "Failed to delete customer", details: error.message });
    }
  });

  // Operations endpoint
  app.get("/api/operations", async (req, res) => {
    try {
        const allOperations = await db.select().from(operations);
        res.json(allOperations);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch operations", details: error.message });
    }
  });

  // Other existing routes (contacts, conversations, etc.)
  // ... (The rest of the routes file remains unchanged)

  return httpServer;
}
