-- DropForeignKey
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_cook_book_id_fkey";

-- AlterTable
ALTER TABLE "bookmarks" ALTER COLUMN "cook_book_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_cook_book_id_fkey" FOREIGN KEY ("cook_book_id") REFERENCES "cookbooks"("id") ON DELETE SET NULL ON UPDATE CASCADE;
