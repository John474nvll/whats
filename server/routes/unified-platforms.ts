import { Elysia } from 'elysia';
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

export const unifiedPlatformRoutes = new Elysia({ prefix: '/api/platforms' })
  .get("/accounts", async ({ headers }) => {
    try {
      const userId = 1;
      const accounts = await storage.getSocialAccounts(userId);
      return accounts;
    } catch (error) {
      console.error("Error fetching accounts:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch accounts" }), { status: 500 });
    }
  })
  .post("/send-message", async ({ body }: { body: any }) => {
    try {
      const userId = 1;
      const payload = sendMessageSchema.parse(body);
      const account = await storage.getSocialAccount(userId, payload.platform);

      if (!account) {
        return new Response(JSON.stringify({ error: `No ${payload.platform} account connected` }), { status: 400 });
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

      if (result.success && payload.customerId) {
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

      return {
        success: result.success,
        messageId: result.messageId,
        platform: payload.platform,
      };
    } catch (error) {
      console.error("Error sending message:", error);
      return new Response(JSON.stringify({ error: "Failed to send message" }), { status: 500 });
    }
  })
  .post("/publish", async ({ body }: { body: any }) => {
    try {
      const userId = 1;
      const payload = publishContentSchema.parse(body);
      const account = await storage.getSocialAccount(userId, payload.platform);

      if (!account) {
        return new Response(JSON.stringify({ error: `No ${payload.platform} account connected` }), { status: 400 });
      }

      const service = await createUnifiedService(account.accessToken);

      const result = await service.publishContent(
        payload.platform,
        payload.accountId,
        payload.content,
        payload.mediaUrl
      );

      return {
        success: result.success,
        postId: result.postId,
        platform: payload.platform,
      };
    } catch (error) {
      console.error("Error publishing content:", error);
      return new Response(JSON.stringify({ error: "Failed to publish content" }), { status: 500 });
    }
  })
  .post("/campaigns", async ({ body }: { body: any }) => {
    try {
      const userId = 1;
      const payload = createCampaignSchema.parse(body);

      const accounts = await Promise.all(
        payload.platforms.map((platform) =>
          storage.getSocialAccount(userId, platform)
        )
      );

      const missingPlatforms = payload.platforms.filter(
        (_, idx) => !accounts[idx]
      );
      if (missingPlatforms.length > 0) {
        return new Response(JSON.stringify({
          error: `Missing accounts for: ${missingPlatforms.join(", ")}`,
        }), { status: 400 });
      }

      const campaign = await storage.createCampaign({
        userId,
        name: `Sales Campaign ${Date.now()}`,
        platform: payload.platforms.length === 3 ? "all" : payload.platforms.join(","),
        content: payload.content,
        targetAccountIds: payload.targetCustomerIds,
        status: "active",
        aiGenerated: false,
      });

      return {
        success: true,
        campaignId: campaign.id,
        platforms: payload.platforms,
        targetCount: payload.targetCustomerIds.length,
      };
    } catch (error) {
      console.error("Error creating campaign:", error);
      return new Response(JSON.stringify({ error: "Failed to create campaign" }), { status: 500 });
    }
  })
  .get("/sales-messages/:customerId", async ({ params }) => {
    try {
      const customerId = parseInt(params.customerId);
      const conversation = await storage.getConversationByContactId(customerId);

      if (!conversation) {
        return { messages: [] };
      }

      const messages = await storage.getMessages(conversation.id);
      return { messages, conversationId: conversation.id };
    } catch (error) {
      console.error("Error fetching sales messages:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch messages" }), { status: 500 });
    }
  })
  .post("/link-customer", async ({ body }: { body: any }) => {
    try {
      const { customerId, platform, platformId, platformName } = z
        .object({
          customerId: z.number(),
          platform: z.enum(["whatsapp", "instagram", "facebook"]),
          platformId: z.string(),
          platformName: z.string(),
        })
        .parse(body);

      const success = await storage.updateCustomer(customerId, {
        platform,
        platformId,
        metadata: { linkedAt: new Date().toISOString() },
      });

      return { success: !!success };
    } catch (error) {
      console.error("Error linking customer:", error);
      return new Response(JSON.stringify({ error: "Failed to link customer" }), { status: 500 });
    }
  });

export function registerUnifiedPlatformRoutes(app: any) {
  app.use(unifiedPlatformRoutes);
}
