-- CreateTable
CREATE TABLE "ReferralResponse" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "referrerName" TEXT,
    "orgName" TEXT NOT NULL,
    "orgPhone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReferralResponse_formId_idx" ON "ReferralResponse"("formId");

-- CreateIndex
CREATE INDEX "ReferralResponse_createdAt_idx" ON "ReferralResponse"("createdAt");

-- AddForeignKey
ALTER TABLE "ReferralResponse" ADD CONSTRAINT "ReferralResponse_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
