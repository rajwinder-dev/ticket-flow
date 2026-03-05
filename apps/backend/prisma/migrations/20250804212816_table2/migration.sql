/*
  Warnings:

  - Made the column `assignedTo` on table `TeamMembers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Holidays" ADD COLUMN     "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TeamMembers" ALTER COLUMN "assignedTo" SET NOT NULL;
