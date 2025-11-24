CREATE TABLE `dailySpecials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`productId` int,
	`name` varchar(255) NOT NULL,
	`nameEn` varchar(255),
	`description` text NOT NULL,
	`descriptionEn` text,
	`price` int NOT NULL,
	`originalPrice` int,
	`image` text NOT NULL,
	`imageAlt` varchar(255),
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`isActive` boolean NOT NULL DEFAULT true,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailySpecials_id` PRIMARY KEY(`id`)
);
