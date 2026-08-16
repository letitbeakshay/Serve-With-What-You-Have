-- CreateEnum
CREATE TYPE "FormStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('YES', 'NO', 'IN_PROCESS');

-- CreateEnum
CREATE TYPE "ResponseStatus" AS ENUM ('NEW', 'CONTACTED', 'ACTIVE', 'PAUSED', 'DECLINED');

-- CreateTable
CREATE TABLE "Form" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "FormStatus" NOT NULL DEFAULT 'OPEN',
    "closedMessage" TEXT,
    "fieldSetVersion" TEXT NOT NULL DEFAULT 'v1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,
    "orgType" TEXT NOT NULL,
    "orgTypeOther" TEXT,
    "isRegistered" "RegistrationStatus" NOT NULL,
    "registrationNumber" TEXT,
    "yearStarted" INTEGER,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "state" TEXT NOT NULL,
    "pinCode" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "mapsLink" TEXT,
    "contactName" TEXT NOT NULL,
    "contactRole" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "altPhone" TEXT,
    "email" TEXT,
    "headcounts" JSONB NOT NULL,
    "whoServe" TEXT[],
    "whoServeOther" TEXT,
    "supportOffered" TEXT[],
    "supportOfferedOther" TEXT,
    "mostNeeded" TEXT NOT NULL,
    "volunteerHelp" TEXT[],
    "volunteerHelpOther" TEXT,
    "website" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "additionalNotes" TEXT,
    "declarationsVersion" TEXT NOT NULL,
    "declarationsAcceptedAt" TIMESTAMP(3) NOT NULL,
    "status" "ResponseStatus" NOT NULL DEFAULT 'NEW',
    "internalNotes" TEXT,
    "contactedBy" TEXT,
    "lastContactedAt" TIMESTAMP(3),
    "rawAnswers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAuthState" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminAuthState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Form_slug_key" ON "Form"("slug");

-- CreateIndex
CREATE INDEX "Form_status_idx" ON "Form"("status");

-- CreateIndex
CREATE INDEX "Response_formId_idx" ON "Response"("formId");

-- CreateIndex
CREATE INDEX "Response_status_idx" ON "Response"("status");

-- CreateIndex
CREATE INDEX "Response_city_idx" ON "Response"("city");

-- CreateIndex
CREATE INDEX "Response_state_idx" ON "Response"("state");

-- CreateIndex
CREATE INDEX "Response_orgType_idx" ON "Response"("orgType");

-- CreateIndex
CREATE INDEX "Response_createdAt_idx" ON "Response"("createdAt");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;
