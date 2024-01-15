/*
  Warnings:

  - You are about to drop the column `publichedAt` on the `recipes` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "PostStatus" ADD VALUE 'ARCHIVED';

-- AlterTable
ALTER TABLE "recipes" DROP COLUMN "publichedAt",
ADD COLUMN     "publishedAt" TIMESTAMP(3);
