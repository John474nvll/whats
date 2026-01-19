PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_artist_profiles` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`bio` text,
	`image_url` text,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_artist_profiles`("id", "user_id", "name", "bio", "image_url", "created_at", "updated_at") SELECT "id", "user_id", "name", "bio", "image_url", "created_at", "updated_at" FROM `artist_profiles`;--> statement-breakpoint
DROP TABLE `artist_profiles`;--> statement-breakpoint
ALTER TABLE `__new_artist_profiles` RENAME TO `artist_profiles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_campaigns` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`target` text,
	`content` text,
	`scheduled_at` integer,
	`status` text,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_campaigns`("id", "user_id", "name", "type", "target", "content", "scheduled_at", "status", "created_at", "updated_at") SELECT "id", "user_id", "name", "type", "target", "content", "scheduled_at", "status", "created_at", "updated_at" FROM `campaigns`;--> statement-breakpoint
DROP TABLE `campaigns`;--> statement-breakpoint
ALTER TABLE `__new_campaigns` RENAME TO `campaigns`;--> statement-breakpoint
CREATE TABLE `__new_channel_configs` (
	`platform` text PRIMARY KEY NOT NULL,
	`config` text,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"'
);
--> statement-breakpoint
INSERT INTO `__new_channel_configs`("platform", "config", "created_at", "updated_at") SELECT "platform", "config", "created_at", "updated_at" FROM `channel_configs`;--> statement-breakpoint
DROP TABLE `channel_configs`;--> statement-breakpoint
ALTER TABLE `__new_channel_configs` RENAME TO `channel_configs`;--> statement-breakpoint
CREATE TABLE `__new_companies` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`website` text,
	`phone` text,
	`address` text,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.608Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.608Z"'
);
--> statement-breakpoint
INSERT INTO `__new_companies`("id", "name", "website", "phone", "address", "created_at", "updated_at") SELECT "id", "name", "website", "phone", "address", "created_at", "updated_at" FROM `companies`;--> statement-breakpoint
DROP TABLE `companies`;--> statement-breakpoint
ALTER TABLE `__new_companies` RENAME TO `companies`;--> statement-breakpoint
CREATE TABLE `__new_contacts` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`platform` text,
	`company_id` integer,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.608Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.608Z"',
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_contacts`("id", "name", "email", "phone", "platform", "company_id", "created_at", "updated_at") SELECT "id", "name", "email", "phone", "platform", "company_id", "created_at", "updated_at" FROM `contacts`;--> statement-breakpoint
DROP TABLE `contacts`;--> statement-breakpoint
ALTER TABLE `__new_contacts` RENAME TO `contacts`;--> statement-breakpoint
CREATE TABLE `__new_conversations` (
	`id` integer PRIMARY KEY NOT NULL,
	`contact_id` integer,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.609Z"',
	`last_message_at` integer,
	`status` text,
	`bot_status` integer DEFAULT true,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_conversations`("id", "contact_id", "created_at", "last_message_at", "status", "bot_status") SELECT "id", "contact_id", "created_at", "last_message_at", "status", "bot_status" FROM `conversations`;--> statement-breakpoint
DROP TABLE `conversations`;--> statement-breakpoint
ALTER TABLE `__new_conversations` RENAME TO `conversations`;--> statement-breakpoint
CREATE TABLE `__new_custom_links` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`short_code` text NOT NULL,
	`original_url` text NOT NULL,
	`clicks` integer DEFAULT 0,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_custom_links`("id", "user_id", "short_code", "original_url", "clicks", "created_at") SELECT "id", "user_id", "short_code", "original_url", "clicks", "created_at" FROM `custom_links`;--> statement-breakpoint
DROP TABLE `custom_links`;--> statement-breakpoint
ALTER TABLE `__new_custom_links` RENAME TO `custom_links`;--> statement-breakpoint
CREATE TABLE `__new_customer_groups` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`rules` text,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_customer_groups`("id", "user_id", "name", "rules", "created_at") SELECT "id", "user_id", "name", "rules", "created_at" FROM `customer_groups`;--> statement-breakpoint
DROP TABLE `customer_groups`;--> statement-breakpoint
ALTER TABLE `__new_customer_groups` RENAME TO `customer_groups`;--> statement-breakpoint
CREATE TABLE `__new_customers` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`farm_name` text,
	`address` text,
	`animal_count` integer,
	`platform` text DEFAULT 'whatsapp',
	`status` text DEFAULT 'active',
	`lead_status` text DEFAULT 'new',
	`source` text,
	`estimated_value` real DEFAULT 0,
	`conversion_probability` integer DEFAULT 0,
	`notes` text,
	`retell_agent_id` text,
	`tags` text,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.609Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.609Z"',
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_customers`("id", "name", "email", "phone", "farm_name", "address", "animal_count", "platform", "status", "lead_status", "source", "estimated_value", "conversion_probability", "notes", "retell_agent_id", "tags", "created_at", "updated_at", "user_id") SELECT "id", "name", "email", "phone", "farm_name", "address", "animal_count", "platform", "status", "lead_status", "source", "estimated_value", "conversion_probability", "notes", "retell_agent_id", "tags", "created_at", "updated_at", "user_id" FROM `customers`;--> statement-breakpoint
DROP TABLE `customers`;--> statement-breakpoint
ALTER TABLE `__new_customers` RENAME TO `customers`;--> statement-breakpoint
CREATE TABLE `__new_deals` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`value` real NOT NULL,
	`stage` text NOT NULL,
	`company_id` integer,
	`contact_id` integer,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.608Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.608Z"',
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_deals`("id", "title", "value", "stage", "company_id", "contact_id", "created_at", "updated_at") SELECT "id", "title", "value", "stage", "company_id", "contact_id", "created_at", "updated_at" FROM `deals`;--> statement-breakpoint
DROP TABLE `deals`;--> statement-breakpoint
ALTER TABLE `__new_deals` RENAME TO `deals`;--> statement-breakpoint
CREATE TABLE `__new_inboxes` (
	`id` integer PRIMARY KEY NOT NULL,
	`contact_id` integer NOT NULL,
	`last_message` text,
	`status` text,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.609Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.609Z"',
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_inboxes`("id", "contact_id", "last_message", "status", "created_at", "updated_at") SELECT "id", "contact_id", "last_message", "status", "created_at", "updated_at" FROM `inboxes`;--> statement-breakpoint
DROP TABLE `inboxes`;--> statement-breakpoint
ALTER TABLE `__new_inboxes` RENAME TO `inboxes`;--> statement-breakpoint
CREATE TABLE `__new_interactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`user_id` text,
	`contact_id` integer,
	`deal_id` integer,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.609Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`deal_id`) REFERENCES `deals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_interactions`("id", "type", "content", "user_id", "contact_id", "deal_id", "created_at") SELECT "id", "type", "content", "user_id", "contact_id", "deal_id", "created_at" FROM `interactions`;--> statement-breakpoint
DROP TABLE `interactions`;--> statement-breakpoint
ALTER TABLE `__new_interactions` RENAME TO `interactions`;--> statement-breakpoint
CREATE TABLE `__new_inventory` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.611Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.611Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_inventory`("id", "user_id", "product_id", "quantity", "created_at", "updated_at") SELECT "id", "user_id", "product_id", "quantity", "created_at", "updated_at" FROM `inventory`;--> statement-breakpoint
DROP TABLE `inventory`;--> statement-breakpoint
ALTER TABLE `__new_inventory` RENAME TO `inventory`;--> statement-breakpoint
CREATE TABLE `__new_messages` (
	`id` integer PRIMARY KEY NOT NULL,
	`conversation_id` integer NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.609Z"',
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_messages`("id", "conversation_id", "role", "content", "created_at") SELECT "id", "conversation_id", "role", "content", "created_at" FROM `messages`;--> statement-breakpoint
DROP TABLE `messages`;--> statement-breakpoint
ALTER TABLE `__new_messages` RENAME TO `messages`;--> statement-breakpoint
CREATE TABLE `__new_music_content` (
	`id` integer PRIMARY KEY NOT NULL,
	`artist_id` integer NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`release_date` integer,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.611Z"',
	FOREIGN KEY (`artist_id`) REFERENCES `artist_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_music_content`("id", "artist_id", "type", "title", "url", "release_date", "created_at") SELECT "id", "artist_id", "type", "title", "url", "release_date", "created_at" FROM `music_content`;--> statement-breakpoint
DROP TABLE `music_content`;--> statement-breakpoint
ALTER TABLE `__new_music_content` RENAME TO `music_content`;--> statement-breakpoint
CREATE TABLE `__new_operations` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`date` integer NOT NULL,
	`amount` real NOT NULL,
	`customer_id` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.609Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.609Z"',
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_operations`("id", "type", "description", "date", "amount", "customer_id", "created_at", "updated_at") SELECT "id", "type", "description", "date", "amount", "customer_id", "created_at", "updated_at" FROM `operations`;--> statement-breakpoint
DROP TABLE `operations`;--> statement-breakpoint
ALTER TABLE `__new_operations` RENAME TO `operations`;--> statement-breakpoint
CREATE TABLE `__new_phone_connections` (
	`id` integer PRIMARY KEY NOT NULL,
	`phone_number` text NOT NULL,
	`is_verified` integer DEFAULT false,
	`verified_at` integer,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.611Z"'
);
--> statement-breakpoint
INSERT INTO `__new_phone_connections`("id", "phone_number", "is_verified", "verified_at", "created_at") SELECT "id", "phone_number", "is_verified", "verified_at", "created_at" FROM `phone_connections`;--> statement-breakpoint
DROP TABLE `phone_connections`;--> statement-breakpoint
ALTER TABLE `__new_phone_connections` RENAME TO `phone_connections`;--> statement-breakpoint
CREATE TABLE `__new_product_catalogs` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_product_catalogs`("id", "user_id", "name", "created_at", "updated_at") SELECT "id", "user_id", "name", "created_at", "updated_at" FROM `product_catalogs`;--> statement-breakpoint
DROP TABLE `product_catalogs`;--> statement-breakpoint
ALTER TABLE `__new_product_catalogs` RENAME TO `product_catalogs`;--> statement-breakpoint
CREATE TABLE `__new_products` (
	`id` integer PRIMARY KEY NOT NULL,
	`catalog_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`image_url` text,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	`user_id` text NOT NULL,
	FOREIGN KEY (`catalog_id`) REFERENCES `product_catalogs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_products`("id", "catalog_id", "name", "description", "price", "image_url", "created_at", "updated_at", "user_id") SELECT "id", "catalog_id", "name", "description", "price", "image_url", "created_at", "updated_at", "user_id" FROM `products`;--> statement-breakpoint
DROP TABLE `products`;--> statement-breakpoint
ALTER TABLE `__new_products` RENAME TO `products`;--> statement-breakpoint
CREATE TABLE `__new_retell_agents` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`llm_websocket_url` text NOT NULL,
	`voice_id` text NOT NULL,
	`agent_prompt` text,
	`status` text DEFAULT 'active',
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.608Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.608Z"',
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_retell_agents`("id", "name", "llm_websocket_url", "voice_id", "agent_prompt", "status", "created_at", "updated_at", "user_id") SELECT "id", "name", "llm_websocket_url", "voice_id", "agent_prompt", "status", "created_at", "updated_at", "user_id" FROM `retell_agents`;--> statement-breakpoint
DROP TABLE `retell_agents`;--> statement-breakpoint
ALTER TABLE `__new_retell_agents` RENAME TO `retell_agents`;--> statement-breakpoint
CREATE TABLE `__new_sales_funnels` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`steps` text,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_sales_funnels`("id", "user_id", "name", "steps", "created_at", "updated_at") SELECT "id", "user_id", "name", "steps", "created_at", "updated_at" FROM `sales_funnels`;--> statement-breakpoint
DROP TABLE `sales_funnels`;--> statement-breakpoint
ALTER TABLE `__new_sales_funnels` RENAME TO `sales_funnels`;--> statement-breakpoint
CREATE TABLE `__new_social_accounts` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`platform` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`expires_at` integer,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_social_accounts`("id", "user_id", "platform", "access_token", "refresh_token", "expires_at", "created_at", "updated_at") SELECT "id", "user_id", "platform", "access_token", "refresh_token", "expires_at", "created_at", "updated_at" FROM `social_accounts`;--> statement-breakpoint
DROP TABLE `social_accounts`;--> statement-breakpoint
ALTER TABLE `__new_social_accounts` RENAME TO `social_accounts`;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`total_amount` real NOT NULL,
	`status` text NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.611Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "user_id", "product_id", "quantity", "total_amount", "status", "created_at") SELECT "id", "user_id", "product_id", "quantity", "total_amount", "status", "created_at" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.607Z"'
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password", "created_at") SELECT "id", "name", "email", "password", "created_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `__new_waba_accounts` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`waba_account_id` text NOT NULL,
	`phone_number_id` text NOT NULL,
	`access_token` text NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.607Z"',
	`updated_at` integer DEFAULT '"2026-01-19T04:13:51.607Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_waba_accounts`("id", "user_id", "waba_account_id", "phone_number_id", "access_token", "created_at", "updated_at") SELECT "id", "user_id", "waba_account_id", "phone_number_id", "access_token", "created_at", "updated_at" FROM `waba_accounts`;--> statement-breakpoint
DROP TABLE `waba_accounts`;--> statement-breakpoint
ALTER TABLE `__new_waba_accounts` RENAME TO `waba_accounts`;--> statement-breakpoint
CREATE UNIQUE INDEX `waba_accounts_user_id_unique` ON `waba_accounts` (`user_id`);--> statement-breakpoint
CREATE TABLE `__new_widgets` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`config` text,
	`position` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T04:13:51.610Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_widgets`("id", "user_id", "type", "config", "position", "created_at") SELECT "id", "user_id", "type", "config", "position", "created_at" FROM `widgets`;--> statement-breakpoint
DROP TABLE `widgets`;--> statement-breakpoint
ALTER TABLE `__new_widgets` RENAME TO `widgets`;