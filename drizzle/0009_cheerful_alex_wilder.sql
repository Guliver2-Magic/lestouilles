CREATE TABLE `mealPlanItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mealPlanId` int NOT NULL,
	`productId` int NOT NULL,
	`dayOfWeek` int NOT NULL,
	`mealType` enum('breakfast','lunch','dinner','snack') NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mealPlanItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mealPlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`weekStartDate` timestamp NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `mealPlans_id` PRIMARY KEY(`id`)
);
