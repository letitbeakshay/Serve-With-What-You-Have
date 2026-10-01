-- AlterTable
ALTER TABLE "ClothDonation" ADD COLUMN     "collectionPoint" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "washed" BOOLEAN NOT NULL DEFAULT false;
