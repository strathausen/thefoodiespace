/*
  Warnings:

  - A unique constraint covering the columns `[cursor]` on the table `posts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cursor]` on the table `recipes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "cursor" TEXT;

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "cursor" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "posts_cursor_key" ON "posts"("cursor");

-- CreateIndex
CREATE UNIQUE INDEX "recipes_cursor_key" ON "recipes"("cursor");
