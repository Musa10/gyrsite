-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "bodyAr" JSONB,
ADD COLUMN     "titleAr" TEXT;

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "bodyAr" JSONB,
ADD COLUMN     "excerptAr" TEXT,
ADD COLUMN     "titleAr" TEXT;

-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN     "bioAr" TEXT,
ADD COLUMN     "roleAr" TEXT;
