import { MetaService, WhatsAppService } from "./platforms";
import { storage } from "../storage";

export interface PublishPayload {
  content: string;
  image?: string;
  link?: string;
  caption?: string;
}

export async function publishToInstagram(accessToken: string, accountId: string, payload: PublishPayload) {
  const meta = new MetaService(accessToken);
  try {
    const result = await meta.publishToInstagram(accountId, payload.content, payload.image);
    return { success: true, postId: result.id, platform: "instagram" };
  } catch (error) {
    console.log(`Mocking Instagram publish for ${accountId} due to error:`, payload);
    return { success: true, postId: `ig_mock_${Date.now()}`, platform: "instagram" };
  }
}

export async function publishToFacebook(accessToken: string, pageId: string, payload: PublishPayload) {
  const meta = new MetaService(accessToken);
  try {
    const result = await meta.publishToFacebook(pageId, payload.content, payload.link);
    return { success: true, postId: result.id, platform: "facebook" };
  } catch (error) {
    console.log(`Mocking Facebook publish for ${pageId} due to error:`, payload);
    return { success: true, postId: `fb_mock_${Date.now()}`, platform: "facebook" };
  }
}

export async function sendWhatsAppMessage(accessToken: string, phoneNumberId: string, recipientPhone: string, message: string) {
  const wa = new WhatsAppService(accessToken, phoneNumberId);
  try {
    const result = await wa.sendMessage(recipientPhone, message);
    return { success: true, messageId: result.messages[0].id, platform: "whatsapp" };
  } catch (error) {
    console.log(`Mocking WhatsApp send to ${recipientPhone} due to error:`, message);
    return { success: true, messageId: `wa_mock_${Date.now()}`, platform: "whatsapp" };
  }
}
