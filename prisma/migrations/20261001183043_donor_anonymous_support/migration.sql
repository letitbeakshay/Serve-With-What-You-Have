-- AlterTable
ALTER TABLE "Donor" ADD COLUMN     "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "donorNumber" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Donor_isAnonymous_idx" ON "Donor"("isAnonymous");
