-- AlterTable
ALTER TABLE "DonationItem" ADD COLUMN     "volunteerId" TEXT;

-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "volunteerNumber" SERIAL NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_volunteerNumber_key" ON "Volunteer"("volunteerNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_phone_key" ON "Volunteer"("phone");

-- CreateIndex
CREATE INDEX "DonationItem_volunteerId_idx" ON "DonationItem"("volunteerId");

-- AddForeignKey
ALTER TABLE "DonationItem" ADD CONSTRAINT "DonationItem_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "Volunteer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
