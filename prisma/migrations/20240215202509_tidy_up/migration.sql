/*
  Warnings:

  - You are about to drop the column `ai_ratings` on the `comments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "ai_ratings";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "moderation" "ModerationStatus" NOT NULL DEFAULT 'PENDING';
