import {
  AssignTicketInput,
  CreateTicketCommentInput,
  CreateTicketInput,
  UpdateTicketPriorityInput,
  UpdateTicketStatusInput,
} from "@repo/schemas";
import { APIFeatures } from "../../core/utils/apiFeatures";
import { appError } from "../../core/utils/appError";
import { catchAsync } from "../../core/utils/catchAsync";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";
import { CustomerService } from "../customer/customer.service";
import { TicketService } from "./ticket.service";

export class TicketController {
  static createTicket = catchAsync(async (req, res, _next) => {
    let agentId: string | undefined;
    const organizationId = req.organization.id;
    const { subject, description, email } = req.body as CreateTicketInput;
    const customerData = await CustomerService.createCustomerIdentity(email, organizationId);
    const { groupId, queueId } = await TicketService.resolveQueueAssignment({ organizationId });
    if (groupId && queueId) {
      const agentData = await TicketService.resolveAgentAssignment({ queueId, organizationId });
      agentId = agentData?.id;
    }
    await TicketService.createTicket({
      subject,
      description,
      assignedTo: agentId,
      organizationId,
      customerId: customerData.id,
      queueId,
      userId: req.user.id,
    });

    response(res, { groupId, queueId, agentId }, 201);
  });
  static getAllTickets = catchAsync(async (req, res, _next) => {
    const { filterOptions, limit, offset } = new APIFeatures(req.query)
      .filter()
      .sort()
      .pagination();
    const total = await prisma.ticket.count({
      where: {
        organizationId: req.organization.id,
        ...filterOptions.where,
      },
    });
    const data = await prisma.ticket.findMany({
      where: {
        organizationId: req.organization.id,
        ...filterOptions.where,
      },
      take: limit,
      skip: offset,
    });
    response(res, data, 200, { otherFields: { total, offset, limit } });
  });
  static getTicketDetails = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    const data = await TicketService.getTicketDetails({ticketId: id, organizationId: req.organization.id});
    response(res, data);
  });
  static getAssignedTickets = catchAsync(async (req, res, _next) => {
    const { filterOptions, limit, offset } = new APIFeatures(req.query)
      .filter()
      .sort()
      .pagination();
    const total = await prisma.ticket.count({
      where: {
        organizationId: req.organization.id,
        ...filterOptions.where,
      },
    });
    const data = await prisma.ticket.findMany({
      where: {
        organizationId: req.organization.id,
        assignedTo: req.user.id,
        ...filterOptions.where,
      },
      take: limit,
      skip: offset,
    });
    response(res, data, 200, { otherFields: { total, offset, limit } });
  });
  static updateStatus = catchAsync(async (req, res, _next) => {
    const ticketId = req.params.id as string;
    const { status } = req.body as UpdateTicketStatusInput;
    const ticketData = await prisma.ticket.findUnique({
      where: { id: ticketId },
      select: { status: true },
    });
    if (!ticketData) throw new appError("Ticket not found ", 404);
    const data = await TicketService.updateStatus({
      ticketId,
      userId: req.user.id,
      organizationId: req.organization.id,
      nextStatus: status,
      currentStatus: ticketData.status,
    });
    response(res, data, 200);
  });
  static updatePriority = catchAsync(async (req, res, _next) => {
    const ticketId = req.params.id as string;
    const { priority } = req.body as UpdateTicketPriorityInput;
    const data = await TicketService.updatePriority({
      userId: req.user.id,
      ticketId,
      organizationId: req.organization.id,
      priority,
    });
    response(res, data, 200);
  });
  static assignTicket = catchAsync(async (req, res, _next) => {
    const ticketId = req.params.id as string;
    const { assignId, targetType } = req.body as AssignTicketInput;
    const data = await TicketService.assignTicket({
      userId: req.user.id,
      ticketId,
      organizationId: req.organization.id,
      assignId,
      targetType,
    });
    response(res, data);
  });
  static addComment = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    const { comment, isInternal } = req.body as CreateTicketCommentInput;
    const data = await TicketService.createTicketComment({
      organizationId: req.organization.id,
      ticketId: id,
      userId: req.user.id,
      comment,
      isInternal,
    });
    response(res, data, 200);
  });
  static escalate = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    const data = await TicketService.escalateTicket({
      ticketId: id,
      organizationId: req.organization.id,
    });
    response(res, data);
  });
}
