-- CreateTable
CREATE TABLE "PickupInterestResponse" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PickupInterestResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PickupInterestResponse_createdAt_idx" ON "PickupInterestResponse"("createdAt");
