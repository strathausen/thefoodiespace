-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "ai_ratings" TEXT[],
ADD COLUMN     "banned" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "recipes" ADD COLUMN     "ai_image_texts" TEXT[],
ADD COLUMN     "ai_index" TEXT,
ADD COLUMN     "ai_processed_at" TIMESTAMP(3),
ADD COLUMN     "ai_ratings" TEXT[],
ADD COLUMN     "ai_summary" TEXT,
ADD COLUMN     "ai_tags" TEXT[],
ADD COLUMN     "text_index" TEXT;
