-- Migration Script: Convert from OAuth to Local Authentication
-- Run this script on your MySQL database to update the users table schema

-- WARNING: This will drop the openId column and all OAuth-related data
-- Make sure to backup your database before running this migration!

-- Step 1: Add new columns for local authentication
ALTER TABLE `users`
  ADD COLUMN `password` VARCHAR(255) AFTER `email`,
  ADD COLUMN `isVerified` BOOLEAN NOT NULL DEFAULT FALSE AFTER `role`,
  ADD COLUMN `verificationToken` VARCHAR(255) AFTER `isVerified`,
  ADD COLUMN `resetToken` VARCHAR(255) AFTER `verificationToken`,
  ADD COLUMN `resetTokenExpiry` TIMESTAMP NULL AFTER `resetToken`;

-- Step 2: Make email unique and not null (if not already)
ALTER TABLE `users`
  MODIFY COLUMN `email` VARCHAR(320) NOT NULL UNIQUE;

-- Step 3: Update loginMethod default value
ALTER TABLE `users`
  MODIFY COLUMN `loginMethod` VARCHAR(64) DEFAULT 'local';

-- Step 4: Drop the openId column (OAuth identifier)
-- WARNING: This will delete all OAuth user data!
ALTER TABLE `users`
  DROP COLUMN `openId`;

-- Step 5: Create an admin user (optional)
-- Replace 'admin@lestouilles.ca' and the password hash with your own
-- Password hash below is for 'Admin123!' - CHANGE THIS!
-- To generate a new hash, use: bcrypt.hash('your_password', 10)
INSERT INTO `users` (
  `email`,
  `password`,
  `name`,
  `loginMethod`,
  `role`,
  `isVerified`,
  `createdAt`,
  `updatedAt`,
  `lastSignedIn`
) VALUES (
  'admin@lestouilles.ca',
  '$2a$10$rKZE8qQxL5vYxH9vZ5Y5Gu5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5',  -- CHANGE THIS HASH!
  'Administrator',
  'local',
  'admin',
  TRUE,
  NOW(),
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  `role` = 'admin';

-- Verification: Check the new schema
DESCRIBE `users`;

-- Expected columns:
-- id, email, password, name, loginMethod, role, isVerified, 
-- verificationToken, resetToken, resetTokenExpiry, 
-- createdAt, updatedAt, lastSignedIn
