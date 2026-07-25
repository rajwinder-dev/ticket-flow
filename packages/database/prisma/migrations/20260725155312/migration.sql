/*
  Warnings:

  - The values [TICKET_ASSIGNED,TICKET_STATUS_CHANGED,TICKET_PRIORITY_CHANGED,TICKET_COMMENT_ADDED,TICKET_ESCALATED,TICKET_REOPENED,SLA_WARNING,SLA_BREACHED] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('TICKET', 'RBAC', 'USER', 'MEMBER', 'GROUP', 'QUEUE', 'ORGANIZATION', 'CUSTOMER', 'EMAIL', 'SYSTEM');
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TABLE "NotificationPreference" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "public"."NotificationType_old";
COMMIT;
