import { MetaService, WhatsAppService } from "./platforms";
import { db } from "../db";
import { socialAccounts, campaigns, customers, messages } from "@shared/schema";
import { eq } from "drizzle-orm";

export type SupportedPlatform = "whatsapp" | "instagram" | "facebook";

export interface UnifiedPlatformMessage {
  id: string;
  conversationId: string;
  platform: SupportedPlatform;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface UnifiedPlatformAccount {
  id: number;
  userId: string;
  platform: SupportedPlatform;
  accountId: string;
  accountName: string;
  accessToken: string;
  phoneNumberId?: string;
  isConnected: boolean;
}

export interface SalesMessage {
  platform: SupportedPlatform;
  customerId: number;
  content: string;
  sender: "agent" | "customer";
  timestamp: Date;
}

export class UnifiedPlatformService {
  private metaService: MetaService;
  private whatsappService: WhatsAppService;

  constructor(private accessToken: string, private phoneNumberId?: string) {
    this.metaService = new MetaService(accessToken);
    this.whatsappService = new WhatsAppService(accessToken, phoneNumberId || "");
  }

  async sendMessage(
    platform: SupportedPlatform,
    to: string,
    content: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean; messageId: string }> {
    try {
      if (platform === "whatsapp") {
        const result = await this.whatsappService.sendMessage(to, content);
        return {
          success: !!result.messages?.[0]?.id,
          messageId: result.messages?.[0]?.id || `wa_${Date.now()}`,
        };
      } else if (platform === "instagram") {
        // Send via Instagram DM
        const response = await fetch(
          `https://graph.instagram.com/me/messages?access_token=${this.accessToken}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to, message: content }),
          }
        );
        const result = await response.json();
        return {
          success: !!result.message_id,
          messageId: result.message_id || `ig_${Date.now()}`,
        };
      } else if (platform === "facebook") {
        // Send via Facebook Messenger
        const response = await fetch(
          `https://graph.facebook.com/me/messages?access_token=${this.accessToken}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipient: { id: to },
              message: { text: content },
            }),
          }
        );
        const result = await response.json();
        return {
          success: !!result.message_id,
          messageId: result.message_id || `fb_${Date.now()}`,
        };
      }
      return { success: false, messageId: "" };
    } catch (error) {
      console.error(
        `Error sending ${platform} message:`,
        error instanceof Error ? error.message : error
      );
      return { success: false, messageId: "" };
    }
  }

  async publishContent(
    platform: SupportedPlatform,
    accountId: string,
    content: string,
    mediaUrl?: string
  ): Promise<{ success: boolean; postId: string }> {
    try {
      if (platform === "instagram") {
        const result = await this.metaService.publishToInstagram(
          accountId,
          content,
          mediaUrl
        );
        return {
          success: !!result.id,
          postId: result.id || `ig_${Date.now()}`,
        };
      } else if (platform === "facebook") {
        const result = await this.metaService.publishToFacebook(
          accountId,
          content,
          mediaUrl
        );
        return {
          success: !!result.id,
          postId: result.id || `fb_${Date.now()}`,
        };
      }
      return { success: false, postId: "" };
    } catch (error) {
      console.error(
        `Error publishing to ${platform}:`,
        error instanceof Error ? error.message : error
      );
      return { success: false, postId: "" };
    }
  }

  async getSalesMessages(
    customerId: number,
    platform?: SupportedPlatform
  ): Promise<SalesMessage[]> {
    try {
      const messagesData = await db.query.messages.findMany({
        where: platform
          ? (msg) => eq(msg.conversationId, customerId)
          : undefined,
      });

      return messagesData.map((msg) => ({
        platform: (msg.metadata?.platform || "whatsapp") as SupportedPlatform,
        customerId,
        content: msg.content,
        sender: (msg.role as "agent" | "customer") || "agent",
        timestamp: msg.createdAt || new Date(),
      }));
    } catch (error) {
      console.error("Error fetching sales messages:", error);
      return [];
    }
  }

  async linkCustomerToPlatform(
    customerId: number,
    platform: SupportedPlatform,
    platformId: string,
    platformName: string
  ): Promise<boolean> {
    try {
      await db
        .update(customers)
        .set({
          platform,
          platformId,
          metadata: {
            platforms: [
              { type: platform, id: platformId, name: platformName },
            ],
          },
        })
        .where(eq(customers.id, customerId));
      return true;
    } catch (error) {
      console.error("Error linking customer:", error);
      return false;
    }
  }

  async getAccountsByPlatform(
    userId: string,
    platform: SupportedPlatform
  ): Promise<UnifiedPlatformAccount[]> {
    try {
      const accounts = await db.query.socialAccounts.findMany({
        where: (acc) =>
          eq(acc.userId, userId) && eq(acc.platform, platform),
      });

      return accounts.map((acc) => ({
        id: acc.id,
        userId: acc.userId,
        platform: acc.platform as SupportedPlatform,
        accountId: acc.accountId,
        accountName: acc.accountName,
        accessToken: acc.accessToken,
        phoneNumberId: acc.metadata?.phoneNumberId,
        isConnected: acc.isConnected,
      }));
    } catch (error) {
      console.error("Error fetching accounts:", error);
      return [];
    }
  }

  async createSalesCampaign(
    userId: string,
    platforms: SupportedPlatform[],
    content: string,
    targetCustomerIds: number[]
  ): Promise<{ success: boolean; campaignId: number }> {
    try {
      const result = await db.insert(campaigns).values({
        userId,
        name: `Campaign ${Date.now()}`,
        platform: platforms.length === 3 ? "all" : platforms.join(","),
        content,
        targetAccountIds: targetCustomerIds,
        status: "active",
        aiGenerated: false,
      });

      return {
        success: !!result,
        campaignId: 0, // Will be generated by DB
      };
    } catch (error) {
      console.error("Error creating campaign:", error);
      return { success: false, campaignId: 0 };
    }
  }
}

export async function createUnifiedService(
  accessToken: string,
  phoneNumberId?: string
): Promise<UnifiedPlatformService> {
  return new UnifiedPlatformService(accessToken, phoneNumberId);
}
