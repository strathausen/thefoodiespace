/*
  Warnings:

  - You are about to drop the column `post_id` on the `reactions` table. All the data in the column will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[recipe_id,user_id]` on the table `reactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recipe_id` to the `reactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_created_by_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "reactions" DROP CONSTRAINT "reactions_post_id_fkey";

-- DropIndex
DROP INDEX "reactions_post_id_user_id_key";

-- AlterTable
ALTER TABLE "reactions" DROP COLUMN "post_id",
ADD COLUMN     "recipe_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "comment_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "share_count" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "posts";

-- CreateIndex
CREATE UNIQUE INDEX "reactions_recipe_id_user_id_key" ON "reactions"("recipe_id", "user_id");

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
