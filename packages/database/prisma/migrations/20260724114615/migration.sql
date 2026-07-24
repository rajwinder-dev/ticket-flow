/*
  Warnings:

  - You are about to drop the column `assignedBy` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `assignedTo` on the `Ticket` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_assignedBy_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_assignedTo_fkey";

-- DropIndex
DROP INDEX "Ticket_assignedTo_assignedBy_customerId_organizationId_idx";

-- DropIndex
DROP INDEX "Ticket_queueId_idx";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "assignedBy",
DROP COLUMN "assignedTo",
ADD COLUMN     "userId" UUID;
