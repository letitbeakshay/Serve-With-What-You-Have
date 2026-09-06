-- CreateTable
CREATE TABLE "InterestResponse" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterestResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterestResponse_category_idx" ON "InterestResponse"("category");

-- CreateIndex
CREATE INDEX "InterestResponse_createdAt_idx" ON "InterestResponse"("createdAt");
