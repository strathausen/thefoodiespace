-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "publichedAt" TIMESTAMP(3);
