/*
  Warnings:

  - You are about to drop the column `internal_score` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "internal_score",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image_alt" TEXT,
ADD COLUMN     "last_seen" TIMESTAMP(3),
ADD COLUMN     "locale" TEXT,
ADD COLUMN     "locales" TEXT[],
ADD COLUMN     "location" TEXT,
ADD COLUMN     "moderation_reason" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
