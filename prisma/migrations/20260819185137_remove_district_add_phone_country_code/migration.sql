-- AlterTable
ALTER TABLE "Response" DROP COLUMN "district",
ADD COLUMN     "phoneCountryCode" TEXT NOT NULL DEFAULT '+91';
