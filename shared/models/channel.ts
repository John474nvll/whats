
import { z } from 'zod';

// Defines the structure for a platform integration channel
export const ChannelSchema = z.object({
  id: z.number().int().positive(),
  platform: z.string(), // e.g., 'whatsapp', 'instagram', 'facebook'
  isActive: z.boolean().default(true),
  accessToken: z.string().optional().nullable(),
  verifyToken: z.string().optional().nullable(),
  phoneNumberId: z.string().optional().nullable(),
  userId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Channel = z.infer<typeof ChannelSchema>;
