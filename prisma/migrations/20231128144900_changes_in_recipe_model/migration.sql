/*
  Warnings:

  - The primary key for the `recipes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `recipes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recipes" DROP CONSTRAINT "recipes_pkey",
DROP COLUMN "description",
ADD COLUMN     "text" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "recipes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "recipes_id_seq";
