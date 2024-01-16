-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "read_at" DROP NOT NULL,
ALTER COLUMN "read_at" DROP DEFAULT;
