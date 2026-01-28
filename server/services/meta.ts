import axios, { AxiosInstance } from 'axios';

const META_API_VERSION = 'v18.0';
const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export class MetaAPIError extends Error {
  constructor(
    message: string,
    public response?: any,
  ) {
    super(message);
    this.name = 'MetaAPIError';
  }
}

export class MetaService {
  private apiClient: AxiosInstance;

  constructor(private accessToken: string) {
    this.apiClient = axios.create({
      baseURL: META_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.apiClient.interceptors.request.use((config) => {
      config.params = { ...config.params, access_token: this.accessToken };
      return config;
    });

    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        return Promise.reject(
          new MetaAPIError(error.message, error.response?.data),
        );
      },
    );
  }

  async validateToken(): Promise<boolean> {
    try {
      await this.apiClient.get('/me');
      return true;
    } catch (error) {
      return false;
    }
  }

  async publishToInstagram(
    instagramAccountId: string,
    caption: string,
    imageUrl: string,
  ) {
    const mediaRes = await this.apiClient.post(`/${instagramAccountId}/media`, {
      image_url: imageUrl,
      caption: caption,
    });
    const creationId = mediaRes.data.id;
    const publishRes = await this.apiClient.post(
      `/${instagramAccountId}/media_publish`,
      {
        creation_id: creationId,
      },
    );
    return publishRes.data;
  }

  async publishToFacebook(pageId: string, message: string, link?: string) {
    const res = await this.apiClient.post(`/${pageId}/feed`, {
      message,
      link,
    });
    return res.data;
  }

  async sendWhatsAppMessage(phoneNumberId: string, to: string, text: string) {
    const res = await this.apiClient.post(`/${phoneNumberId}/messages`, {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text },
    });
    return res.data;
  }

  async fetchMessages(pageId: string, platform: 'instagram' | 'facebook') {
    const endpoint =
      platform === 'instagram'
        ? `/${pageId}/conversations`
        : `/${pageId}/conversations`;
    const params =
      platform === 'instagram'
        ? { fields: 'id,senders,former_participants,info' }
        : { fields: 'id,senders' };
    const response = await this.apiClient.get(endpoint, { params });
    return response.data.data || [];
  }

  async sendMessage(conversationId: string, message: string) {
    const response = await this.apiClient.post(`/${conversationId}/messages`, {
      message,
    });
    return response.data;
  }
}
