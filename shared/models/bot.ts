
import { z } from 'zod';

// Defines the structure for a Neural Agent (Bot)
export const BotSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
  description: z.string().optional(),
  systemPrompt: z.string(),
  model: z.string().default('gpt-3.5-turbo'),
  userId: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Bot = z.infer<typeof BotSchema>;
