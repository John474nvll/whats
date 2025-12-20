import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import adminRoutes from "./src/routes/adminRoutes";
import { MetaProvider } from "./src/providers/metaProvider";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Register Admin Routes
  app.use("/api/admin", adminRoutes);

  // Register Meta Webhook Routes
  app.get("/webhook", MetaProvider.verifyWebhook);
  app.post("/webhook", MetaProvider.handleWebhook);

  // Existing API routes (example stub)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  return httpServer;
}
