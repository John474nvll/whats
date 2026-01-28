import WhatsApp from "whatsapp";

const WA_PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID || "";
const WA_BUSINESS_ACCOUNT_ID = process.env.WA_BUSINESS_ACCOUNT_ID || "";
const WA_ACCESS_TOKEN = process.env.WA_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN || "";
const WA_WEBHOOK_VERIFY_TOKEN = process.env.WA_WEBHOOK_VERIFY_TOKEN || "socialhub_verify_token";

let whatsappClient: any = null;

export function initWhatsApp(): any {
  if (!WA_PHONE_NUMBER_ID || !WA_ACCESS_TOKEN) {
    console.log("WhatsApp SDK not configured - missing credentials");
    return null;
  }

  try {
    whatsappClient = new WhatsApp(parseInt(WA_PHONE_NUMBER_ID));
    console.log("WhatsApp SDK initialized successfully");
    return whatsappClient;
  } catch (error) {
    console.error("Failed to initialize WhatsApp SDK:", error);
    return null;
  }
}

export function getWhatsAppClient(): any {
  return whatsappClient;
}

export function getWhatsAppStatus() {
  return {
    configured: !!(WA_PHONE_NUMBER_ID && WA_ACCESS_TOKEN),
    phoneNumberId: WA_PHONE_NUMBER_ID ? "***" + WA_PHONE_NUMBER_ID.slice(-4) : null,
    businessAccountId: WA_BUSINESS_ACCOUNT_ID ? "***" + WA_BUSINESS_ACCOUNT_ID.slice(-4) : null,
    hasAccessToken: !!WA_ACCESS_TOKEN,
    sdkVersion: whatsappClient?.version() || null
  };
}

export async function sendTextMessage(to: string, message: string): Promise<any> {
  if (!whatsappClient) {
    throw new Error("WhatsApp SDK not initialized");
  }

  try {
    const recipient = parseInt(to.replace(/\D/g, ""), 10);
    const response = await whatsappClient.messages.text({ body: message }, recipient);
    return response;
  } catch (error: any) {
    console.error("Error sending WhatsApp message:", error);
    throw error;
  }
}

export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string = "es",
  components?: any[]
): Promise<any> {
  if (!whatsappClient) {
    throw new Error("WhatsApp SDK not initialized");
  }

  try {
    const recipient = parseInt(to.replace(/\D/g, ""), 10);
    const response = await whatsappClient.messages.template(
      {
        name: templateName,
        language: { code: languageCode as any },
        components: components
      },
      recipient
    );
    return response;
  } catch (error: any) {
    console.error("Error sending WhatsApp template:", error);
    throw error;
  }
}

export async function sendMediaMessage(
  to: string,
  mediaType: "image" | "video" | "audio" | "document",
  mediaUrl: string,
  caption?: string
): Promise<any> {
  if (!whatsappClient) {
    throw new Error("WhatsApp SDK not initialized");
  }

  try {
    const recipient = parseInt(to.replace(/\D/g, ""), 10);
    let response;
    switch (mediaType) {
      case "image":
        response = await whatsappClient.messages.image({ link: mediaUrl, caption }, recipient);
        break;
      case "video":
        response = await whatsappClient.messages.video({ link: mediaUrl, caption }, recipient);
        break;
      case "audio":
        response = await whatsappClient.messages.audio({ link: mediaUrl }, recipient);
        break;
      case "document":
        response = await whatsappClient.messages.document({ link: mediaUrl, caption }, recipient);
        break;
    }
    return response;
  } catch (error: any) {
    console.error("Error sending WhatsApp media:", error);
    throw error;
  }
}

export async function sendInteractiveMessage(
  to: string,
  type: "button" | "list",
  body: string,
  options: any
): Promise<any> {
  if (!whatsappClient) {
    throw new Error("WhatsApp SDK not initialized");
  }

  try {
    const recipient = parseInt(to.replace(/\D/g, ""), 10);
    const interactive: any = {
      type,
      body: { text: body }
    };

    if (type === "button") {
      interactive.action = {
        buttons: options.buttons.map((btn: any, idx: number) => ({
          type: "reply",
          reply: { id: `btn_${idx}`, title: btn.title }
        }))
      };
    } else if (type === "list") {
      interactive.action = {
        button: options.buttonText || "Ver opciones",
        sections: options.sections
      };
    }

    const response = await whatsappClient.messages.interactive(interactive, recipient);
    return response;
  } catch (error: any) {
    console.error("Error sending WhatsApp interactive:", error);
    throw error;
  }
}

export function verifyWebhook(mode: string, token: string, challenge: string): string | null {
  if (mode === "subscribe" && token === WA_WEBHOOK_VERIFY_TOKEN) {
    return challenge;
  }
  return null;
}

export function parseWebhookPayload(payload: any): any[] {
  const messages: any[] = [];

  if (payload?.object === "whatsapp_business_account") {
    for (const entry of payload.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === "messages") {
          const value = change.value;
          const metadata = value.metadata;

          for (const message of value.messages || []) {
            messages.push({
              id: message.id,
              from: message.from,
              timestamp: new Date(parseInt(message.timestamp) * 1000),
              type: message.type,
              text: message.text?.body,
              image: message.image,
              audio: message.audio,
              video: message.video,
              document: message.document,
              location: message.location,
              contacts: message.contacts,
              interactive: message.interactive,
              button: message.button,
              context: message.context,
              phoneNumberId: metadata.phone_number_id,
              displayPhoneNumber: metadata.display_phone_number
            });
          }

          for (const status of value.statuses || []) {
            messages.push({
              type: "status",
              messageId: status.id,
              status: status.status,
              timestamp: new Date(parseInt(status.timestamp) * 1000),
              recipientId: status.recipient_id,
              errors: status.errors
            });
          }
        }
      }
    }
  }

  return messages;
}
