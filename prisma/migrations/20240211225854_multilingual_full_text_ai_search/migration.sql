/*
  Warnings:

  - You are about to drop the column `ai_index` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `text_index` on the `recipes` table. All the data in the column will be lost.
  - Added the required column `title` to the `recipes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropIndex
DROP INDEX "recipes_name_idx";

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "ai_index",
DROP COLUMN "name",
DROP COLUMN "text_index",
ADD COLUMN     "ai_index_de" TEXT,
ADD COLUMN     "ai_index_en" TEXT,
ADD COLUMN     "ai_index_es" TEXT,
ADD COLUMN     "ai_index_fr" TEXT,
ADD COLUMN     "ai_index_id" TEXT,
ADD COLUMN     "ai_index_it" TEXT,
ADD COLUMN     "ai_index_ro" TEXT,
ADD COLUMN     "moderation" "ModerationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "text_index_de" tsvector,
ADD COLUMN     "text_index_en" tsvector,
ADD COLUMN     "text_index_es" tsvector,
ADD COLUMN     "text_index_fr" tsvector,
ADD COLUMN     "text_index_id" tsvector,
ADD COLUMN     "text_index_it" tsvector,
ADD COLUMN     "text_index_ro" tsvector,
ADD COLUMN     "title" TEXT NOT NULL;

-- DropEnum
DROP TYPE "PostType";

-- DropEnum
DROP TYPE "ReviewStatus";

-- CreateIndex
CREATE INDEX "recipes_title_idx" ON "recipes"("title");
