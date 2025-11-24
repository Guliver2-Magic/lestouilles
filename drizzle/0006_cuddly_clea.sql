ALTER TABLE `products` ADD `isVisible` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `isCateringOnly` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `showDietaryTags` boolean DEFAULT true NOT NULL;