import { z } from "zod";
import { insertChannelConfigSchema, channelConfigs, conversations, messages, contacts } from "./schema";

export const errorSchemas = {
  400: z.object({
    error: z.string(),
    issues: z.array(z.object({
      code: z.string(),
      expected: z.string(),
      received: z.string(),
      path: z.array(z.string()),
      message: z.string(),
    })),
  }),
  401: z.object({
    error: z.string(),
    message: z.string(),
  }),
  404: z.object({
    error: z.string(),
    message: z.string(),
  }),
  500: z.object({
    error: z.string(),
    message: z.string(),
  }),
};

export type InsertChannelConfig = z.infer<typeof insertChannelConfigSchema>

export const api = {
  channels: {
    list: {
      method: 'GET' as const,
      path: '/api/channels',
      responses: {
        200: z.array(z.custom<typeof channelConfigs.$inferSelect>()),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/channels/:platform',
      input: insertChannelConfigSchema.omit({ platform: true }).partial(),
      responses: {
        200: z.custom<typeof channelConfigs.$inferSelect>(),
      },
    },
  },
  conversations: {
    list: {
      method: 'GET' as const,
      path: '/api/conversations',
      responses: {
        200: z.array(z.custom<typeof conversations.$inferSelect & { contact: typeof contacts.$inferSelect }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/conversations/:id',
      responses: {
        200: z.custom<typeof conversations.$inferSelect & { messages: (typeof messages.$inferSelect)[] }>(),
      },
    },
    toggleBot: {
      method: 'POST' as const,
      path: '/api/conversations/:id/toggle-bot',
      responses: {
        200: z.custom<typeof conversations.$inferSelect>(),
      },
    },
  },
  messages: {
    list: {
      method: 'GET' as const,
      path: '/api/conversations/:id/messages',
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/conversations/:id/messages',
      responses: {
        201: z.custom<typeof messages.$inferSelect>(),
      },
    },
  }
};

export function buildUrl(path: string, params: Record<string, string | number>) {
  let url = path;
  for (const key in params) {
    url = url.replace(`:${key}`, String(params[key]));
  }
  return url;
}
