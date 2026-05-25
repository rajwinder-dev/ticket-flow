-- CreateIndex
CREATE INDEX "Membership_roleId_idx" ON "Membership"("roleId");

-- CreateIndex
CREATE INDEX "Organization_createdBy_idx" ON "Organization"("createdBy");

-- CreateIndex
CREATE INDEX "Organization_active_idx" ON "Organization"("active");

-- CreateIndex
CREATE INDEX "Role_organizationId_idx" ON "Role"("organizationId");

-- CreateIndex
CREATE INDEX "Role_active_idx" ON "Role"("active");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Ticket_status_idx" ON "Ticket"("status");

-- CreateIndex
CREATE INDEX "Ticket_priority_idx" ON "Ticket"("priority");

-- CreateIndex
CREATE INDEX "Ticket_queueId_idx" ON "Ticket"("queueId");

-- CreateIndex
CREATE INDEX "TicketTransition_ticketId_idx" ON "TicketTransition"("ticketId");

-- CreateIndex
CREATE INDEX "TicketTransition_fromAgentId_idx" ON "TicketTransition"("fromAgentId");

-- CreateIndex
CREATE INDEX "TicketTransition_toAgentId_idx" ON "TicketTransition"("toAgentId");

-- CreateIndex
CREATE INDEX "TicketTransition_fromQueueId_idx" ON "TicketTransition"("fromQueueId");

-- CreateIndex
CREATE INDEX "TicketTransition_toQueueId_idx" ON "TicketTransition"("toQueueId");

-- CreateIndex
CREATE INDEX "TicketTransition_fromGroupId_idx" ON "TicketTransition"("fromGroupId");

-- CreateIndex
CREATE INDEX "TicketTransition_toGroupId_idx" ON "TicketTransition"("toGroupId");

-- CreateIndex
CREATE INDEX "TicketTransition_organizationId_idx" ON "TicketTransition"("organizationId");

-- CreateIndex
CREATE INDEX "Token_userId_idx" ON "Token"("userId");

-- CreateIndex
CREATE INDEX "Token_organizationId_idx" ON "Token"("organizationId");

-- CreateIndex
CREATE INDEX "Token_status_idx" ON "Token"("status");

-- CreateIndex
CREATE INDEX "User_createdBy_idx" ON "User"("createdBy");

-- CreateIndex
CREATE INDEX "User_active_idx" ON "User"("active");

-- CreateIndex
CREATE INDEX "User_isOnboarded_idx" ON "User"("isOnboarded");
