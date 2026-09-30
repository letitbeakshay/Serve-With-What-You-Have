-- CreateTable
CREATE TABLE "ClothDonation" (
    "id" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "donatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClothDonation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClothDonation_donatedAt_idx" ON "ClothDonation"("donatedAt");
