
import { z } from 'zod';

// Defines the structure for a connected social media account
export const SocialAccountSchema = z.object({
  id: z.number().int().positive(),
  platform: z.string(),
  username: z.string().optional(),
  accessToken: z.string(),
  userId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SocialAccount = z.infer<typeof SocialAccountSchema>;
