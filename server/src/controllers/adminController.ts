import { Request, Response } from "express";
import { db } from "../../db";
import { conversations } from "@shared/schema";
import { desc } from "drizzle-orm";

export class AdminController {
  static async getConversations(req: Request, res: Response) {
    try {
      const allConversations = await db.select()
        .from(conversations)
        .orderBy(desc(conversations.updatedAt)); // Ordenados por fecha de actualización

      res.json(allConversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async replyToConversation(req: Request, res: Response) {
    const { conversationId } = req.params;
    const { message } = req.body;

    if (!conversationId || !message) {
        return res.status(400).json({ error: "Missing conversationId or message" });
    }

    try {
        // 1. Disable AI for this conversation
        // 2. Send manual message
        // 3. Update DB
        // Placeholder implementation
        res.json({ success: true, message: "Manual reply sent, AI disabled." });
    } catch (error) {
        res.status(500).json({ error: "Failed to send reply" });
    }
  }
}
