import axios from 'axios';

export class MetaService {
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(private accessToken: string) {}

  async publishToInstagram(instagramAccountId: string, caption: string, imageUrl?: string) {
    try {
      if (imageUrl) {
        const mediaRes = await axios.post(`${this.baseUrl}/${instagramAccountId}/media`, {
          image_url: imageUrl,
          caption: caption,
          access_token: this.accessToken
        });
        const creationId = mediaRes.data.id;
        const publishRes = await axios.post(`${this.baseUrl}/${instagramAccountId}/media_publish`, {
          creation_id: creationId,
          access_token: this.accessToken
        });
        return publishRes.data;
      } else {
        return { id: `ig_mock_${Date.now()}` };
      }
    } catch (error: any) {
      console.error('Meta API Error (Instagram):', error.response?.data || error.message);
      throw error;
    }
  }

  async publishToFacebook(pageId: string, message: string, link?: string) {
    try {
      const res = await axios.post(`${this.baseUrl}/${pageId}/feed`, {
        message,
        link,
        access_token: this.accessToken
      });
      return res.data;
    } catch (error: any) {
      console.error('Meta API Error (Facebook):', error.response?.data || error.message);
      throw error;
    }
  }
}

export class WhatsAppService {
  private baseUrl = 'https://graph.facebook.com/v18.0';

  constructor(private accessToken: string, private phoneNumberId: string) {}

  async sendMessage(to: string, text: string) {
    try {
      const res = await axios.post(`${this.baseUrl}/${this.phoneNumberId}/messages`, {
        messaging_product: 'whatsapp',
        to,
        type: 'text',
        text: { body: text },
        access_token: this.accessToken
      });
      return res.data;
    } catch (error: any) {
      console.error('WhatsApp API Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

export interface PlatformConfig {
  platform: "instagram" | "facebook" | "whatsapp";
  accessToken: string;
  verifyToken: string;
  phoneNumberId?: string;
  isActive: boolean;
  connectedAt: Date;
}

export async function validateInstagramToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://graph.instagram.com/me?access_token=${token}`
    );
    return response.ok;
  } catch {
    return false;
  }
}

export async function validateFacebookToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/me?access_token=${token}`
    );
    return response.ok;
  } catch {
    return false;
  }
}

export async function validateWhatsAppToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://graph.whatsapp.com/v18.0/me?access_token=${token}`
    );
    return response.ok;
  } catch {
    return false;
  }
}

export async function initializePlatform(
  storage: IStorage,
  platform: "instagram" | "facebook" | "whatsapp",
  config: Omit<PlatformConfig, "platform" | "connectedAt">
): Promise<boolean> {
  const isValid =
    platform === "instagram"
      ? await validateInstagramToken(config.accessToken)
      : platform === "facebook"
        ? await validateFacebookToken(config.accessToken)
        : await validateWhatsAppToken(config.accessToken);

  if (!isValid) {
    return false;
  }

  const channelConfig: PlatformConfig = {
    ...config,
    platform,
    connectedAt: new Date(),
  };

  storage.updateChannel(platform, channelConfig);
  return true;
}

export async function fetchInstagramMessages(
  token: string,
  pageId: string
): Promise<any[]> {
  try {
    const response = await fetch(
      `https://graph.instagram.com/${pageId}/conversations?fields=id,senders,former_participants,info&access_token=${token}`
    );
    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function fetchFacebookMessages(
  token: string,
  pageId: string
): Promise<any[]> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/${pageId}/conversations?fields=id,senders&access_token=${token}`
    );
    const data = await response.json();
    return data.data || [];
  } catch {
    return [];
  }
}

export async function sendInstagramMessage(
  token: string,
  conversationId: string,
  message: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://graph.instagram.com/${conversationId}/messages?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

export async function sendFacebookMessage(
  token: string,
  conversationId: string,
  message: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://graph.facebook.com/${conversationId}/messages?access_token=${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}
