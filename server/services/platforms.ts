import { IStorage } from "../storage";

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
