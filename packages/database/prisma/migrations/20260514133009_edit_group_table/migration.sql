/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,name]` on the table `QueueGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "QueueGroup_organizationId_name_default_key";

-- CreateIndex
CREATE UNIQUE INDEX "QueueGroup_organizationId_name_key" ON "QueueGroup"("organizationId", "name");
