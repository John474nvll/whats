import { z } from 'zod';
import {
  insertUserSchema,
  insertMessageSchema,
  conversations,
  messages,
  contacts,
  insertChannelConfigSchema,
  channelConfigs,
} from './schema';

export type InsertChannelConfig = z.infer<typeof insertChannelConfigSchema>;

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  conversations: {
    list: {
      method: 'GET' as const,
      path: '/api/conversations',
      responses: {
        200: z.array(z.custom<any>()), // Todo: precise type
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/conversations/:id',
      responses: {
        200: z.custom<any>(),
        404: errorSchemas.notFound,
      },
    },
    messages: {
      list: {
        method: 'GET' as const,
        path: '/api/conversations/:id/messages',
        responses: {
          200: z.array(z.custom<typeof messages.$inferSelect>()),
          404: errorSchemas.notFound,
        },
      },
      create: {
        method: 'POST' as const,
        path: '/api/conversations/:id/messages',
        input: z.object({ content: z.string() }),
        responses: {
          201: z.custom<typeof messages.$inferSelect>(),
          404: errorSchemas.notFound,
        },
      },
    },
    analyze: {
      method: 'POST' as const,
      path: '/api/conversations/:id/analyze',
      responses: {
        200: z.object({
          sentiment: z.string(),
          suggestedResponse: z.string(),
        }),
      },
    },
  },
  webhooks: {
    meta: {
      method: 'POST' as const,
      path: '/webhooks/meta',
      input: z.any(),
      responses: {
        200: z.string(),
      },
    },
    metaVerify: {
      method: 'GET' as const,
      path: '/webhooks/meta',
      input: z.object({
        'hub.mode': z.string().optional(),
        'hub.verify_token': z.string().optional(),
        'hub.challenge': z.string().optional(),
      }),
      responses: {
        200: z.string(),
      },
    },
  },
  channels: {
    list: {
      method: 'GET' as const,
      path: '/api/channels',
      responses: {
        200: z.array(
          z.object({
            id: z.number(),
            platform: z.string(),
            accessToken: z.string().nullable(),
            verifyToken: z.string().nullable(),
            phoneNumberId: z.string().nullable(),
            isActive: z.boolean().nullable(),
            createdAt: z.string().nullable(),
            updatedAt: z.string().nullable(),
          }),
        ),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/channels/:platform',
      input: insertChannelConfigSchema.partial(),
      responses: {
        200: z.object({
          id: z.number(),
          platform: z.string(),
          accessToken: z.string().nullable(),
          verifyToken: z.string().nullable(),
          phoneNumberId: z.string().nullable(),
          isActive: z.boolean().nullable(),
          createdAt: z.string().nullable(),
          updatedAt: z.string().nullable(),
        }),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>,
): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
