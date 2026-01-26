import { Router, Request, Response } from "express";
import {
  getWhatsAppStatus,
  sendTextMessage,
  sendTemplateMessage,
  sendMediaMessage,
  sendInteractiveMessage,
  verifyWebhook,
  parseWebhookPayload,
  initWhatsApp
} from "../services/whatsapp";
import { storage } from "../storage";

const router = Router();

initWhatsApp();

router.get("/whatsapp/status", (req: Request, res: Response) => {
  res.json(getWhatsAppStatus());
});

router.post("/whatsapp/send/text", async (req: Request, res: Response) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: "Missing 'to' or 'message'" });
    }

    const response = await sendTextMessage(to, message);
    res.json({ success: true, response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/whatsapp/send/template", async (req: Request, res: Response) => {
  try {
    const { to, templateName, languageCode, components } = req.body;

    if (!to || !templateName) {
      return res.status(400).json({ error: "Missing 'to' or 'templateName'" });
    }

    const response = await sendTemplateMessage(to, templateName, languageCode, components);
    res.json({ success: true, response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/whatsapp/send/media", async (req: Request, res: Response) => {
  try {
    const { to, mediaType, mediaUrl, caption } = req.body;

    if (!to || !mediaType || !mediaUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await sendMediaMessage(to, mediaType, mediaUrl, caption);
    res.json({ success: true, response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/whatsapp/send/interactive", async (req: Request, res: Response) => {
  try {
    const { to, type, body, options } = req.body;

    if (!to || !type || !body || !options) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const response = await sendInteractiveMessage(to, type, body, options);
    res.json({ success: true, response });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/whatsapp/webhook", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"] as string;
  const token = req.query["hub.verify_token"] as string;
  const challenge = req.query["hub.challenge"] as string;

  const result = verifyWebhook(mode, token, challenge);
  if (result) {
    console.log("WhatsApp webhook verified");
    res.status(200).send(result);
  } else {
    res.status(403).send("Forbidden");
  }
});

router.post("/whatsapp/webhook", async (req: Request, res: Response) => {
  try {
    const messages = parseWebhookPayload(req.body);

    for (const msg of messages) {
      if (msg.type === "status") {
        console.log(`WhatsApp status update: ${msg.status} for ${msg.messageId}`);
        continue;
      }

      console.log(`WhatsApp message from ${msg.from}: ${msg.text || msg.type}`);

      let contact = await storage.getContactByPlatformId("whatsapp", msg.from);
      if (!contact) {
        contact = await storage.createContact({
          platform: "whatsapp",
          platformId: msg.from,
          name: `WhatsApp ${msg.from}`,
          profilePic: `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.from}`
        });
      }

      let conversation = await storage.getConversationByContactId(contact.id);
      if (!conversation) {
        conversation = await storage.createConversation({
          contactId: contact.id,
          channel: "whatsapp",
          status: "active"
        });
      }

      await storage.createMessage({
        conversationId: conversation.id,
        content: msg.text || `[${msg.type}]`,
        role: "user",
        sentiment: "neutral"
      });
    }

    res.status(200).send("EVENT_RECEIVED");
  } catch (error: any) {
    console.error("WhatsApp webhook error:", error);
    res.status(500).send("Error");
  }
});

export default router;
