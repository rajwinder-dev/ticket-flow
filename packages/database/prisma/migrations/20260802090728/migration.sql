/*
  Warnings:

  - You are about to drop the column `Summary` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "Summary",
ADD COLUMN     "summary" TEXT;
