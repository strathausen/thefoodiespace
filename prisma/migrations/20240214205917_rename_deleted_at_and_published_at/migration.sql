/*

  - rename `deletedAt` on the `recipes` table to `deleted_at`
  - rename `publishedAt` on the `recipes` table to `published_at`

*/
-- AlterTable
ALTER TABLE "recipes" RENAME COLUMN "deletedAt" TO "deleted_at";
ALTER TABLE "recipes" RENAME COLUMN "publishedAt" TO "published_at";
