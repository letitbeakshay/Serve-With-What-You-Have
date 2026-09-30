-- CreateEnum
CREATE TYPE "DonationGender" AS ENUM ('MALE', 'FEMALE', 'GENERAL');

-- CreateEnum
CREATE TYPE "DonationAgeCategory" AS ENUM ('ADULT', 'TEEN', 'CHILD');

-- CreateTable
CREATE TABLE "DonationItem" (
    "id" TEXT NOT NULL,
    "donationId" TEXT NOT NULL,
    "volunteerName" TEXT NOT NULL,
    "gender" "DonationGender" NOT NULL,
    "ageCategory" "DonationAgeCategory",
    "garmentType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DonationItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DonationItem_donationId_idx" ON "DonationItem"("donationId");

-- CreateIndex
CREATE INDEX "DonationItem_createdAt_idx" ON "DonationItem"("createdAt");

-- AddForeignKey
ALTER TABLE "DonationItem" ADD CONSTRAINT "DonationItem_donationId_fkey" FOREIGN KEY ("donationId") REFERENCES "ClothDonation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
