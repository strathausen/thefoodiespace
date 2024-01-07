/*
  Warnings:

  - The primary key for the `cookbooks` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_cook_book_id_fkey";

-- AlterTable
ALTER TABLE "bookmarks" ALTER COLUMN "cook_book_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "cookbooks" DROP CONSTRAINT "cookbooks_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "cookbooks_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "cookbooks_id_seq";

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_cook_book_id_fkey" FOREIGN KEY ("cook_book_id") REFERENCES "cookbooks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
