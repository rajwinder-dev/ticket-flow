/*
  Warnings:

  - The values [PENDING] on the enum `TicketStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `action` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `entityName` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `logStatus` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `metaData` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `performedById` on the `ActivityLog` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ActivityLog` table. All the data in the column will be lost.
  - The `entityId` column on the `ActivityLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ipAddress` column on the `ActivityLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `avatar` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `externalId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `levelId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `attachments` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `levelId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `recommendedSolution` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `resolution` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `rootCause` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Ticket` table. All the data in the column will be lost.
  - The `assignedTo` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `assignedBy` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `active` on the `TicketTransition` table. All the data in the column will be lost.
  - You are about to drop the column `changedBy` on the `TicketTransition` table. All the data in the column will be lost.
  - You are about to drop the column `fromEmployeeId` on the `TicketTransition` table. All the data in the column will be lost.
  - You are about to drop the column `fromLevelId` on the `TicketTransition` table. All the data in the column will be lost.
  - You are about to drop the column `toEmployeeId` on the `TicketTransition` table. All the data in the column will be lost.
  - You are about to drop the column `toLevelId` on the `TicketTransition` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `endDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `managerId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userType` on the `User` table. All the data in the column will be lost.
  - The `createdBy` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `AssignedProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeatureRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeedBack` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Level` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Participant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[organizationId,identityId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `entityType` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identityId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Made the column `permissions` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `createdBy` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `userId` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `organizationId` to the `TicketComment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `authorId` on the `TicketComment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `action` to the `TicketTransition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `TicketTransition` table without a default value. This is not possible if the table is not empty.
  - Made the column `ticketId` on table `TicketTransition` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('INVITE_USER', 'RESET_PASSWORD', 'CHANGE_EMAIL', 'CHANGE_USERNAME', 'VERIFY_EMAIL');

-- CreateEnum
CREATE TYPE "TokeStatus" AS ENUM ('PENDING', 'USED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('SMTP', 'RESEND', 'MAILTRAP');

-- CreateEnum
CREATE TYPE "MessageDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TicketAction" AS ENUM ('ASSIGNED', 'ESCALATED', 'STATUS_CHANGED', 'PRIORITY_CHANGED', 'NOTE_ADDED');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('USER', 'SYSTEM', 'API_KEY', 'SUPPORT_AGENT');

-- CreateEnum
CREATE TYPE "LogSeverity" AS ENUM ('INFO', 'WARN', 'ERROR', 'DEBUG');

-- CreateEnum
CREATE TYPE "EntryType" AS ENUM ('TICKET', 'ORGANIZATION', 'USER', 'AUTH', 'ROLE');

-- AlterEnum
BEGIN;
CREATE TYPE "TicketStatus_new" AS ENUM ('OPEN', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'REOPENED', 'CLOSED', 'ESCALATED');
ALTER TABLE "public"."Ticket" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Ticket" ALTER COLUMN "status" TYPE "TicketStatus_new" USING ("status"::text::"TicketStatus_new");
ALTER TABLE "TicketTransition" ALTER COLUMN "fromStatus" TYPE "TicketStatus_new" USING ("fromStatus"::text::"TicketStatus_new");
ALTER TABLE "TicketTransition" ALTER COLUMN "toStatus" TYPE "TicketStatus_new" USING ("toStatus"::text::"TicketStatus_new");
ALTER TYPE "TicketStatus" RENAME TO "TicketStatus_old";
ALTER TYPE "TicketStatus_new" RENAME TO "TicketStatus";
DROP TYPE "public"."TicketStatus_old";
ALTER TABLE "Ticket" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;

-- DropForeignKey
ALTER TABLE "ActivityLog" DROP CONSTRAINT "ActivityLog_performedById_fkey";

-- DropForeignKey
ALTER TABLE "AssignedProject" DROP CONSTRAINT "AssignedProject_projectId_fkey";

-- DropForeignKey
ALTER TABLE "AssignedProject" DROP CONSTRAINT "AssignedProject_roleId_fkey";

-- DropForeignKey
ALTER TABLE "AssignedProject" DROP CONSTRAINT "AssignedProject_userId_fkey";

-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_projectId_fkey";

-- DropForeignKey
ALTER TABLE "FeatureRequest" DROP CONSTRAINT "FeatureRequest_customerId_fkey";

-- DropForeignKey
ALTER TABLE "FeedBack" DROP CONSTRAINT "FeedBack_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_fromId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_toId_fkey";

-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_userId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_managerId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_levelId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_assignedBy_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_assignedTo_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_levelId_fkey";

-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_projectId_fkey";

-- DropForeignKey
ALTER TABLE "TicketComment" DROP CONSTRAINT "TicketComment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "TicketTransition" DROP CONSTRAINT "TicketTransition_fromEmployeeId_fkey";

-- DropForeignKey
ALTER TABLE "TicketTransition" DROP CONSTRAINT "TicketTransition_fromLevelId_fkey";

-- DropForeignKey
ALTER TABLE "TicketTransition" DROP CONSTRAINT "TicketTransition_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "TicketTransition" DROP CONSTRAINT "TicketTransition_toEmployeeId_fkey";

-- DropForeignKey
ALTER TABLE "TicketTransition" DROP CONSTRAINT "TicketTransition_toLevelId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_managerId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropIndex
DROP INDEX "Customer_externalId_idx";

-- DropIndex
DROP INDEX "Customer_externalId_key";

-- DropIndex
DROP INDEX "Customer_id_key";

-- DropIndex
DROP INDEX "Ticket_assignedTo_assignedBy_customerId_departmentId_levelI_idx";

-- DropIndex
DROP INDEX "User_email_phoneNo_code_idx";

-- DropIndex
DROP INDEX "User_id_key";

-- DropIndex
DROP INDEX "User_passwordHash_key";

-- AlterTable
ALTER TABLE "ActivityLog" DROP COLUMN "action",
DROP COLUMN "description",
DROP COLUMN "entityName",
DROP COLUMN "logStatus",
DROP COLUMN "metaData",
DROP COLUMN "performedById",
DROP COLUMN "updatedAt",
ADD COLUMN     "actorId" UUID,
ADD COLUMN     "actorType" "ActorType" NOT NULL DEFAULT 'USER',
ADD COLUMN     "changes" JSONB,
ADD COLUMN     "entityType" "EntryType" NOT NULL,
ADD COLUMN     "event" TEXT NOT NULL,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "organizationId" UUID,
ADD COLUMN     "severity" "LogSeverity" NOT NULL DEFAULT 'INFO',
ALTER COLUMN "id" DROP DEFAULT,
DROP COLUMN "entityId",
ADD COLUMN     "entityId" UUID,
DROP COLUMN "ipAddress",
ADD COLUMN     "ipAddress" INET;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "avatar",
DROP COLUMN "createdBy",
DROP COLUMN "email",
DROP COLUMN "externalId",
DROP COLUMN "phoneNumber",
DROP COLUMN "projectId",
ADD COLUMN     "avatarUrl" VARCHAR(500),
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "identityId" UUID NOT NULL,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "organizationId" UUID NOT NULL,
ADD COLUMN     "phone" VARCHAR(50),
ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "levelId",
DROP COLUMN "type",
ADD COLUMN     "isSystem" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "organizationId" UUID NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "permissions" SET NOT NULL,
DROP COLUMN "createdBy",
ADD COLUMN     "createdBy" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "attachments",
DROP COLUMN "departmentId",
DROP COLUMN "levelId",
DROP COLUMN "note",
DROP COLUMN "projectId",
DROP COLUMN "recommendedSolution",
DROP COLUMN "resolution",
DROP COLUMN "rootCause",
DROP COLUMN "tags",
ADD COLUMN     "organizationId" UUID,
ADD COLUMN     "queueId" UUID,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "priority" DROP NOT NULL,
ALTER COLUMN "priority" DROP DEFAULT,
DROP COLUMN "assignedTo",
ADD COLUMN     "assignedTo" UUID,
DROP COLUMN "assignedBy",
ADD COLUMN     "assignedBy" UUID;

-- AlterTable
ALTER TABLE "TicketComment" ADD COLUMN     "organizationId" UUID NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
DROP COLUMN "authorId",
ADD COLUMN     "authorId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "TicketTransition" DROP COLUMN "active",
DROP COLUMN "changedBy",
DROP COLUMN "fromEmployeeId",
DROP COLUMN "fromLevelId",
DROP COLUMN "toEmployeeId",
DROP COLUMN "toLevelId",
ADD COLUMN     "action" "TicketAction" NOT NULL,
ADD COLUMN     "changedById" UUID,
ADD COLUMN     "escalationReason" TEXT,
ADD COLUMN     "fromAgentId" UUID,
ADD COLUMN     "fromGroupId" UUID,
ADD COLUMN     "fromQueueId" UUID,
ADD COLUMN     "organizationId" UUID NOT NULL,
ADD COLUMN     "toAgentId" UUID,
ADD COLUMN     "toGroupId" UUID,
ADD COLUMN     "toQueueId" UUID,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "ticketId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "endDate",
DROP COLUMN "managerId",
DROP COLUMN "name",
DROP COLUMN "roleId",
DROP COLUMN "startDate",
DROP COLUMN "userType",
ADD COLUMN     "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordChangeAt" TIMESTAMP(3),
ADD COLUMN     "username" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "createdBy",
ADD COLUMN     "createdBy" UUID,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "AssignedProject";

-- DropTable
DROP TABLE "ChatRoom";

-- DropTable
DROP TABLE "Department";

-- DropTable
DROP TABLE "FeatureRequest";

-- DropTable
DROP TABLE "FeedBack";

-- DropTable
DROP TABLE "Level";

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Participant";

-- DropTable
DROP TABLE "Project";

-- DropEnum
DROP TYPE "RoleType";

-- DropEnum
DROP TYPE "UserType";

-- CreateTable
CREATE TABLE "Organization" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "teamSize" INTEGER,
    "slug" TEXT,
    "code" TEXT NOT NULL,
    "type" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "organizationId" UUID,
    "roleId" UUID,
    "status" "TokeStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" UUID,
    "createdBy" UUID NOT NULL,
    "meteData" JSONB,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailProvider" (
    "id" TEXT NOT NULL,
    "organizationId" UUID NOT NULL,
    "providerType" "ProviderType" NOT NULL,
    "priority" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "credentials" JSONB NOT NULL,
    "webhookSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "domain" TEXT NOT NULL,
    "fromEmail" TEXT NOT NULL,

    CONSTRAINT "EmailProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailMessage" (
    "id" UUID NOT NULL,
    "ticketId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "direction" "MessageDirection" NOT NULL,
    "fromEmail" VARCHAR(255) NOT NULL,
    "toEmail" VARCHAR(255) NOT NULL,
    "subject" VARCHAR(500) NOT NULL,
    "bodyHtml" TEXT,
    "bodyText" TEXT,
    "messageId" VARCHAR(255) NOT NULL,
    "inReplyTo" VARCHAR(255),
    "references" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerIdentity" (
    "id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueGroup" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" UUID NOT NULL,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID,

    CONSTRAINT "QueueGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Queue" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "organizationId" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "queueGroupId" UUID,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueAgent" (
    "id" UUID NOT NULL,
    "agentId" UUID NOT NULL,
    "queueId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "ticketCount" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "QueueAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "ticketId" UUID,
    "messageId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_code_key" ON "Organization"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_organizationId_userId_key" ON "Membership"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "EmailProvider_organizationId_domain_key" ON "EmailProvider"("organizationId", "domain");

-- CreateIndex
CREATE UNIQUE INDEX "EmailProvider_organizationId_priority_key" ON "EmailProvider"("organizationId", "priority");

-- CreateIndex
CREATE UNIQUE INDEX "EmailMessage_messageId_key" ON "EmailMessage"("messageId");

-- CreateIndex
CREATE INDEX "EmailMessage_ticketId_idx" ON "EmailMessage"("ticketId");

-- CreateIndex
CREATE INDEX "EmailMessage_organizationId_idx" ON "EmailMessage"("organizationId");

-- CreateIndex
CREATE INDEX "EmailMessage_messageId_idx" ON "EmailMessage"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerIdentity_email_key" ON "CustomerIdentity"("email");

-- CreateIndex
CREATE UNIQUE INDEX "QueueGroup_organizationId_name_default_key" ON "QueueGroup"("organizationId", "name", "default");

-- CreateIndex
CREATE UNIQUE INDEX "Queue_organizationId_name_order_key" ON "Queue"("organizationId", "name", "order");

-- CreateIndex
CREATE UNIQUE INDEX "QueueAgent_queueId_agentId_organizationId_key" ON "QueueAgent"("queueId", "agentId", "organizationId");

-- CreateIndex
CREATE INDEX "Attachment_organizationId_idx" ON "Attachment"("organizationId");

-- CreateIndex
CREATE INDEX "Attachment_ticketId_idx" ON "Attachment"("ticketId");

-- CreateIndex
CREATE INDEX "Attachment_messageId_idx" ON "Attachment"("messageId");

-- CreateIndex
CREATE INDEX "ActivityLog_organizationId_createdAt_idx" ON "ActivityLog"("organizationId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "ActivityLog_entityType_entityId_idx" ON "ActivityLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ActivityLog_actorId_idx" ON "ActivityLog"("actorId");

-- CreateIndex
CREATE INDEX "Customer_identityId_idx" ON "Customer"("identityId");

-- CreateIndex
CREATE INDEX "Customer_organizationId_idx" ON "Customer"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_organizationId_identityId_key" ON "Customer"("organizationId", "identityId");

-- CreateIndex
CREATE INDEX "Ticket_assignedTo_assignedBy_customerId_organizationId_idx" ON "Ticket"("assignedTo", "assignedBy", "customerId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailProvider" ADD CONSTRAINT "EmailProvider_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailMessage" ADD CONSTRAINT "EmailMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailMessage" ADD CONSTRAINT "EmailMessage_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_identityId_fkey" FOREIGN KEY ("identityId") REFERENCES "CustomerIdentity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueGroup" ADD CONSTRAINT "QueueGroup_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueGroup" ADD CONSTRAINT "QueueGroup_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_queueGroupId_fkey" FOREIGN KEY ("queueGroupId") REFERENCES "QueueGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueAgent" ADD CONSTRAINT "QueueAgent_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueAgent" ADD CONSTRAINT "QueueAgent_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueueAgent" ADD CONSTRAINT "QueueAgent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketComment" ADD CONSTRAINT "TicketComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketComment" ADD CONSTRAINT "TicketComment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransition" ADD CONSTRAINT "TicketTransition_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransition" ADD CONSTRAINT "TicketTransition_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransition" ADD CONSTRAINT "TicketTransition_fromQueueId_fkey" FOREIGN KEY ("fromQueueId") REFERENCES "Queue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransition" ADD CONSTRAINT "TicketTransition_toQueueId_fkey" FOREIGN KEY ("toQueueId") REFERENCES "Queue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransition" ADD CONSTRAINT "TicketTransition_fromAgentId_fkey" FOREIGN KEY ("fromAgentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransition" ADD CONSTRAINT "TicketTransition_toAgentId_fkey" FOREIGN KEY ("toAgentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransition" ADD CONSTRAINT "TicketTransition_fromGroupId_fkey" FOREIGN KEY ("fromGroupId") REFERENCES "QueueGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransition" ADD CONSTRAINT "TicketTransition_toGroupId_fkey" FOREIGN KEY ("toGroupId") REFERENCES "QueueGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketTransition" ADD CONSTRAINT "TicketTransition_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
