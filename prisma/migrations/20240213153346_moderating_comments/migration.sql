/*
  Warnings:

  - You are about to drop the column `banned` on the `comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "banned",
ADD COLUMN     "moderation" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "moderation_reason" TEXT;
