import type { Express, Request, Response } from "express";
import { authMiddleware, type AuthRequest } from "../middleware/auth";
import { storage } from "../storage";
import { createUnifiedService } from "../services/unified-platform";
import { z } from "zod";

const sendMessageSchema = z.object({
  platform: z.enum(["whatsapp", "instagram", "facebook"]),
  to: z.string(),
  content: z.string(),
  customerId: z.number().optional(),
});

const publishContentSchema = z.object({
  platform: z.enum(["instagram", "facebook"]),
  accountId: z.string(),
  content: z.string(),
  mediaUrl: z.string().optional(),
});

const createCampaignSchema = z.object({
  platforms: z.array(z.enum(["whatsapp", "instagram", "facebook"])),
  content: z.string(),
  targetCustomerIds: z.array(z.number()),
});

export function registerUnifiedPlatformRoutes(app: Express) {
  // Get all connected accounts
  app.get(
    "/api/platforms/accounts",
    authMiddleware,
    async (req: AuthRequest, res: Response) => {
      try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const accounts = await storage.getSocialAccounts(userId);
        res.json(accounts);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        res.status(500).json({ error: "Failed to fetch accounts" });
      }
    }
  );

  // Send unified message across platforms
  app.post(
    "/api/platforms/send-message",
    authMiddleware,
    async (req: AuthRequest, res: Response) => {
      try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const payload = sendMessageSchema.parse(req.body);
        const account = await storage.getSocialAccount(userId, payload.platform);

        if (!account) {
          return res
            .status(400)
            .json({ error: `No ${payload.platform} account connected` });
        }

        const service = await createUnifiedService(
          account.accessToken,
          account.metadata?.phoneNumberId
        );

        const result = await service.sendMessage(
          payload.platform,
          payload.to,
          payload.content,
          {
            customerId: payload.customerId,
          }
        );

        // Save message to database if successful
        if (result.success && payload.customerId) {
          // Create conversation/message record
          const conversation = await storage.getConversationByContactId(
            payload.customerId
          );
          if (conversation) {
            await storage.createMessage({
              conversationId: conversation.id,
              content: payload.content,
              role: "agent",
              platformMessageId: result.messageId,
              metadata: { platform: payload.platform },
            });
          }
        }

        res.json({
          success: result.success,
          messageId: result.messageId,
          platform: payload.platform,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Failed to send message" });
      }
    }
  );

  // Publish content to Instagram/Facebook
  app.post(
    "/api/platforms/publish",
    authMiddleware,
    async (req: AuthRequest, res: Response) => {
      try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const payload = publishContentSchema.parse(req.body);
        const account = await storage.getSocialAccount(userId, payload.platform);

        if (!account) {
          return res
            .status(400)
            .json({ error: `No ${payload.platform} account connected` });
        }

        const service = await createUnifiedService(account.accessToken);

        const result = await service.publishContent(
          payload.platform,
          payload.accountId,
          payload.content,
          payload.mediaUrl
        );

        res.json({
          success: result.success,
          postId: result.postId,
          platform: payload.platform,
        });
      } catch (error) {
        console.error("Error publishing content:", error);
        res.status(500).json({ error: "Failed to publish content" });
      }
    }
  );

  // Create sales campaign across platforms
  app.post(
    "/api/platforms/campaigns",
    authMiddleware,
    async (req: AuthRequest, res: Response) => {
      try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const payload = createCampaignSchema.parse(req.body);

        // Get all required accounts
        const accounts = await Promise.all(
          payload.platforms.map((platform) =>
            storage.getSocialAccount(userId, platform)
          )
        );

        const missingPlatforms = payload.platforms.filter(
          (_, idx) => !accounts[idx]
        );
        if (missingPlatforms.length > 0) {
          return res.status(400).json({
            error: `Missing accounts for: ${missingPlatforms.join(", ")}`,
          });
        }

        // Create campaign
        const campaign = await storage.createCampaign({
          userId,
          name: `Sales Campaign ${Date.now()}`,
          platform: payload.platforms.length === 3 ? "all" : payload.platforms.join(","),
          content: payload.content,
          targetAccountIds: payload.targetCustomerIds,
          status: "active",
          aiGenerated: false,
        });

        res.json({
          success: true,
          campaignId: campaign.id,
          platforms: payload.platforms,
          targetCount: payload.targetCustomerIds.length,
        });
      } catch (error) {
        console.error("Error creating campaign:", error);
        res.status(500).json({ error: "Failed to create campaign" });
      }
    }
  );

  // Get sales messages for customer
  app.get(
    "/api/platforms/sales-messages/:customerId",
    authMiddleware,
    async (req: AuthRequest, res: Response) => {
      try {
        const customerId = parseInt(req.params.customerId);
        const conversation = await storage.getConversationByContactId(customerId);

        if (!conversation) {
          return res.json({ messages: [] });
        }

        const messages = await storage.getMessages(conversation.id);
        res.json({ messages, conversationId: conversation.id });
      } catch (error) {
        console.error("Error fetching sales messages:", error);
        res.status(500).json({ error: "Failed to fetch messages" });
      }
    }
  );

  // Link customer to platform
  app.post(
    "/api/platforms/link-customer",
    authMiddleware,
    async (req: AuthRequest, res: Response) => {
      try {
        const { customerId, platform, platformId, platformName } = z
          .object({
            customerId: z.number(),
            platform: z.enum(["whatsapp", "instagram", "facebook"]),
            platformId: z.string(),
            platformName: z.string(),
          })
          .parse(req.body);

        const success = await storage.updateCustomer(customerId, {
          platform,
          platformId,
          metadata: { linkedAt: new Date().toISOString() },
        });

        res.json({ success: !!success });
      } catch (error) {
        console.error("Error linking customer:", error);
        res.status(500).json({ error: "Failed to link customer" });
      }
    }
  );
}
