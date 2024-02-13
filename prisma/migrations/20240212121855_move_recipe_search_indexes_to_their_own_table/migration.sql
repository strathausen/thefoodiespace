/*
  Warnings:

  - You are about to drop the column `ai_image_texts` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `ai_index_de` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `ai_index_en` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `ai_index_es` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `ai_index_fr` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `ai_index_id` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `ai_index_it` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `ai_index_ro` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `ai_processed_at` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `ai_ratings` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `ai_summary` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `ai_tags` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `text_index_de` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `text_index_en` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `text_index_es` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `text_index_fr` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `text_index_id` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `text_index_it` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the column `text_index_ro` on the `recipes` table. All the data in the column will be lost.

*/

DROP TRIGGER IF EXISTS recipes_ai_index ON recipes;

-- DropIndex
DROP INDEX "recipes_text_index_de_idx";

-- DropIndex
DROP INDEX "recipes_text_index_en_idx";

-- DropIndex
DROP INDEX "recipes_text_index_es_idx";

-- DropIndex
DROP INDEX "recipes_text_index_fr_idx";

-- DropIndex
DROP INDEX "recipes_text_index_id_idx";

-- DropIndex
DROP INDEX "recipes_text_index_it_idx";

-- DropIndex
DROP INDEX "recipes_text_index_ro_idx";

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "ai_image_texts",
DROP COLUMN "ai_index_de",
DROP COLUMN "ai_index_en",
DROP COLUMN "ai_index_es",
DROP COLUMN "ai_index_fr",
DROP COLUMN "ai_index_id",
DROP COLUMN "ai_index_it",
DROP COLUMN "ai_index_ro",
DROP COLUMN "ai_processed_at",
DROP COLUMN "ai_ratings",
DROP COLUMN "ai_summary",
DROP COLUMN "ai_tags",
DROP COLUMN "text_index_de",
DROP COLUMN "text_index_en",
DROP COLUMN "text_index_es",
DROP COLUMN "text_index_fr",
DROP COLUMN "text_index_id",
DROP COLUMN "text_index_it",
DROP COLUMN "text_index_ro";

-- CreateTable
CREATE TABLE "recipe_search_index" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "ai_summary" TEXT,
    "ai_tags" TEXT[],
    "ai_ratings" TEXT[],
    "ai_image_texts" TEXT[],
    "ai_processed_at" TIMESTAMP(3),
    "ai_index" TEXT,
    "text_index_en" tsvector,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "recipe_search_index_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recipe_search_index_text_index_en_idx" ON "recipe_search_index" USING GIN ("text_index_en");

-- CreateIndex
CREATE UNIQUE INDEX "recipe_search_index_recipeId_language_key" ON "recipe_search_index"("recipeId", "language");

-- AddForeignKey
ALTER TABLE "recipe_search_index" ADD CONSTRAINT "recipe_search_index_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
