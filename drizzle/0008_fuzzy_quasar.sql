CREATE TABLE `faqs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`questionFr` text NOT NULL,
	`questionEn` text NOT NULL,
	`answerFr` text NOT NULL,
	`answerEn` text NOT NULL,
	`keywordsFr` text NOT NULL,
	`keywordsEn` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`displayOrder` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`)
);
