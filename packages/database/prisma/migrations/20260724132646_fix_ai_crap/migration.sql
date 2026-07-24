/*
  Warnings:

  - You are about to drop the column `userId` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "userId",
ADD COLUMN     "assignedBy" UUID,
ADD COLUMN     "assignedTo" UUID;

-- CreateIndex
CREATE INDEX "Ticket_assignedTo_assignedBy_customerId_organizationId_idx" ON "Ticket"("assignedTo", "assignedBy", "customerId", "organizationId");

-- CreateIndex
CREATE INDEX "Ticket_queueId_idx" ON "Ticket"("queueId");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
