
import { pgTable, serial, text, jsonb } from 'drizzle-orm/pg-core';

// This table will store configurations for various platforms like WhatsApp, Instagram, etc.
export const platform_configs = pgTable('platform_configs', {
  id: serial('id').primaryKey(),
  platform: text('platform').unique().notNull(), // e.g., 'whatsapp', 'instagram'
  // Store multiple settings like tokens, IDs, and other metadata in a single JSONB column.
  config: jsonb('config').$type<{
    accessToken?: string;
    phoneNumberId?: string;
    webhookVerifyToken?: string;
    [key: string]: any; // Allow for other platform-specific keys
  }>().notNull(),
});
