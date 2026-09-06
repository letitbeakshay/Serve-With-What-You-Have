-- CreateTable
CREATE TABLE "SimpleResponse" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "phoneCountryCode" TEXT NOT NULL DEFAULT '+91',
    "phone" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "referralSource" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SimpleResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SimpleResponse_formId_idx" ON "SimpleResponse"("formId");

-- CreateIndex
CREATE INDEX "SimpleResponse_createdAt_idx" ON "SimpleResponse"("createdAt");

-- AddForeignKey
ALTER TABLE "SimpleResponse" ADD CONSTRAINT "SimpleResponse_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
