-- CreateSequence
CREATE SEQUENCE "ClothDonation_donorNumber_seq";

-- AlterTable
-- Existing rows are backfilled with sequential values from the sequence as
-- part of this ADD COLUMN, so no duplicate/NULL values are possible before
-- the unique index below is created.
ALTER TABLE "ClothDonation" ADD COLUMN "donorNumber" INTEGER NOT NULL DEFAULT nextval('"ClothDonation_donorNumber_seq"');

-- AlterSequence
ALTER SEQUENCE "ClothDonation_donorNumber_seq" OWNED BY "ClothDonation"."donorNumber";

-- CreateIndex
CREATE UNIQUE INDEX "ClothDonation_donorNumber_key" ON "ClothDonation"("donorNumber");
