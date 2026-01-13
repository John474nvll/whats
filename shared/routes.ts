import { z } from "zod";
import { insertChannelConfigSchema, channelConfigs } from "../server/db";

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
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params: Record<string, string>) {
  let url = path;
  for (const key in params) {
    url = url.replace(`:${key}`, params[key]);
  }
  return url;
}
