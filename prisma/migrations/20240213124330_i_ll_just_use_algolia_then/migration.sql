/*
  Warnings:

  - You are about to drop the column `sourceUrl` on the `recipes` table. All the data in the column will be lost.
  - You are about to drop the `recipe_search_index` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "recipe_search_index" DROP CONSTRAINT "recipe_search_index_recipeId_fkey";

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "sourceUrl",
ADD COLUMN     "source_url" TEXT;

-- DropTable
DROP TABLE "recipe_search_index";
