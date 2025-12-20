import { Request, Response } from "express";
import { AIService } from "../services/aiService";
import { db } from "../../db"; // Assuming db is at server/db.ts
import { conversations } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export class MetaProvider {
  // Verificación del Webhook (hub.challenge)
  static async verifyWebhook(req: Request, res: Response) {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || "my-secret-token";

    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(400);
    }
  }

  // Recepción de mensajes
  static async handleWebhook(req: Request, res: Response) {
    const body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === "page" || body.object === "whatsapp_business_account" || body.object === "instagram") {
      // Iterates over each entry - there may be multiple if batched
      for (const entry of body.entry) {
        // Gets the body of the webhook event
        const webhookEvent = entry.messaging ? entry.messaging[0] : (entry.changes ? entry.changes[0].value : null);
        
        // This is a simplified extraction. Structure varies by platform (WA, IG, FB).
        // Assuming a generic structure for demonstration.
        const senderId = webhookEvent?.sender?.id || webhookEvent?.from || "unknown";
        const messageText = webhookEvent?.message?.text || (webhookEvent?.messages && webhookEvent.messages[0]?.text?.body);
        const platform = body.object === "whatsapp_business_account" ? "WA" : body.object === "instagram" ? "IG" : "FB";

        if (messageText && senderId) {
          console.log(`Received message from ${senderId} on ${platform}: ${messageText}`);

          // 1. Find or create conversation
          let conversation = await db.query.conversations.findFirst({
            where: and(
              eq(conversations.externalId, senderId),
              eq(conversations.platform, platform)
            ),
          });

          if (!conversation) {
            [conversation] = await db.insert(conversations).values({
              platform,
              externalId: senderId,
              title: `Chat with ${senderId}`,
              lastMessage: messageText,
              aiEnabled: true,
            }).returning();
          } else {
            // Update last message
            await db.update(conversations)
              .set({ lastMessage: messageText, updatedAt: new Date() })
              .where(eq(conversations.id, conversation.id));
          }

          // 2. Check if AI is enabled
          if (conversation.aiEnabled) {
            const aiReply = await AIService.processMessage(senderId, messageText);
            console.log(`AI Reply to ${senderId}: ${aiReply}`);
            
            // Here you would call the Meta Send API to send the reply back to the user
            // await sendToMeta(senderId, aiReply, platform);
            
            // Update DB with last message from AI? Optional.
          }
        }
      }

      // Returns a '200 OK' response to all requests
      res.status(200).send("EVENT_RECEIVED");
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  }
}
