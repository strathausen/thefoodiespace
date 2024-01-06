/*
  Warnings:

  - You are about to drop the column `payload` on the `reactions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recipe_id,user_id,type]` on the table `reactions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "reactions_recipe_id_user_id_key";

-- AlterTable
ALTER TABLE "reactions" DROP COLUMN "payload";

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "text" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "recipe_id" TEXT NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reactions_recipe_id_user_id_type_key" ON "reactions"("recipe_id", "user_id", "type");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "recipes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
