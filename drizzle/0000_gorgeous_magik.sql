CREATE TABLE `artist_profiles` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`bio` text,
	`image_url` text,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.058Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.058Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`target` text,
	`content` text,
	`scheduled_at` integer,
	`status` text,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.057Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.057Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `channel_configs` (
	`platform` text PRIMARY KEY NOT NULL,
	`config` text,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.057Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.057Z"'
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`website` text,
	`phone` text,
	`address` text,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.055Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.055Z"'
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`platform` text,
	`company_id` integer,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.056Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.056Z"',
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` integer PRIMARY KEY NOT NULL,
	`contact_id` integer,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.057Z"',
	`last_message_at` integer,
	`status` text,
	`bot_status` integer DEFAULT true,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `custom_links` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`short_code` text NOT NULL,
	`original_url` text NOT NULL,
	`clicks` integer DEFAULT 0,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.058Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `customer_groups` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`rules` text,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.058Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `customers` (
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
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.056Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.056Z"',
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `deals` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`value` real NOT NULL,
	`stage` text NOT NULL,
	`company_id` integer,
	`contact_id` integer,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.056Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.056Z"',
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `inboxes` (
	`id` integer PRIMARY KEY NOT NULL,
	`contact_id` integer NOT NULL,
	`last_message` text,
	`status` text,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.057Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.057Z"',
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `interactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`user_id` text,
	`contact_id` integer,
	`deal_id` integer,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.056Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`deal_id`) REFERENCES `deals`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `inventory` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.058Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.058Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY NOT NULL,
	`conversation_id` integer NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.057Z"',
	FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `music_content` (
	`id` integer PRIMARY KEY NOT NULL,
	`artist_id` integer NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`url` text NOT NULL,
	`release_date` integer,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.058Z"',
	FOREIGN KEY (`artist_id`) REFERENCES `artist_profiles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `operations` (
	`id` integer PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`date` integer NOT NULL,
	`amount` real NOT NULL,
	`customer_id` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.056Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.056Z"',
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `phone_connections` (
	`id` integer PRIMARY KEY NOT NULL,
	`phone_number` text NOT NULL,
	`is_verified` integer DEFAULT false,
	`verified_at` integer,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.058Z"'
);
--> statement-breakpoint
CREATE TABLE `product_catalogs` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.058Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.058Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY NOT NULL,
	`catalog_id` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`image_url` text,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.058Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.058Z"',
	`user_id` text NOT NULL,
	FOREIGN KEY (`catalog_id`) REFERENCES `product_catalogs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `retell_agents` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`llm_websocket_url` text NOT NULL,
	`voice_id` text NOT NULL,
	`agent_prompt` text,
	`status` text DEFAULT 'active',
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.055Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.055Z"',
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sales_funnels` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`steps` text,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.057Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.057Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `social_accounts` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`platform` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`expires_at` integer,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.057Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.057Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_id` integer NOT NULL,
	`quantity` integer NOT NULL,
	`total_amount` real NOT NULL,
	`status` text NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.058Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.054Z"'
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `waba_accounts` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`waba_account_id` text NOT NULL,
	`phone_number_id` text NOT NULL,
	`access_token` text NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.055Z"',
	`updated_at` integer DEFAULT '"2026-01-19T03:42:25.055Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `waba_accounts_user_id_unique` ON `waba_accounts` (`user_id`);--> statement-breakpoint
CREATE TABLE `widgets` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`config` text,
	`position` integer NOT NULL,
	`created_at` integer DEFAULT '"2026-01-19T03:42:25.057Z"',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
