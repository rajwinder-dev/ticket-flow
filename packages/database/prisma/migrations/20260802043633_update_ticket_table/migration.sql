-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "Summary" TEXT,
ADD COLUMN     "confidence" DOUBLE PRECISION,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "sentiment" "Sentiment" NOT NULL DEFAULT 'NEUTRAL';
