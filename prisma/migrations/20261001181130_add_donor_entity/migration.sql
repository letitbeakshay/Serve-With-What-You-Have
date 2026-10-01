-- AlterTable
ALTER TABLE "ClothDonation" ADD COLUMN     "donorId" TEXT;

-- CreateTable
CREATE TABLE "Donor" (
    "id" TEXT NOT NULL,
    "donorNumber" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Donor_donorNumber_key" ON "Donor"("donorNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Donor_phone_key" ON "Donor"("phone");

-- CreateIndex
CREATE INDEX "ClothDonation_donorId_idx" ON "ClothDonation"("donorId");

-- AddForeignKey
ALTER TABLE "ClothDonation" ADD CONSTRAINT "ClothDonation_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "Donor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
