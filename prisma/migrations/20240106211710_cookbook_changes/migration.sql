/*
  Warnings:

  - A unique constraint covering the columns `[user_id,recipe_id,cook_book_id]` on the table `bookmarks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "bookmarks_user_id_recipe_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_user_id_recipe_id_cook_book_id_key" ON "bookmarks"("user_id", "recipe_id", "cook_book_id");
