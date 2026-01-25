
import { z } from 'zod';

// Defines the structure for a Neural Agent (Bot)
export const BotSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(3, { message: 'Name must be at least 3 characters long' }),
  type: z.enum(['chat', 'voice']), // Type of bot
  provider: z.enum(['openai', 'retell', 'custom']), // The backend service powering the bot
  systemPrompt: z.string().optional(), // The bot's instructions or personality
  webhookUrl: z.string().url().optional(), // Webhook for more complex integrations like Retell AI
  createdAt: z.date(),
});

export type Bot = z.infer<typeof BotSchema>;
