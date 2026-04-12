import {
  AssignTicketInput,
  commentSchemaResponse,
  CreateTicketCommentInput,
  EscalateTicketInput,
  ticketDetailsSchema,
  ticketSchemaResponse,
  ticketSummary,
  UpdateTicketPriorityInput,
  UpdateTicketStatusInput,
} from "@repo/schemas";
import z from "zod";
import { APIFeatures } from "../../core/utils/apiFeatures";
import { appError } from "../../core/utils/appError";
import { catchAsync } from "../../core/utils/catchAsync";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";
import { TicketService } from "./ticket.service";

export class TicketController {
  static createTicket = catchAsync(async (req, res, _next) => {
    const output = await TicketService.createAndAssign({
      input: req.body,
      organizationId: req.organization.id,
      userId: req.user.id,
    });
    response(res, output, 201);
  });
  static updateTicket = catchAsync(async (req, res, _next) => {
    const ticketId = req.params.ticketId as string;
    const updatedTicket = await TicketService.updateTicket({
      input: req.body,
      organizationId: req.organization.id,
      userId: req.user.id,
      ticketId,
    });
    response(res, updatedTicket);
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
      include: {
        assignedToUser: { select: { id: true, username: true } },
        queue: { select: { name: true } },
      },
      take: limit,
      skip: offset,
    });
    response(res, data, 200, {
      otherFields: { total, offset, limit },
      schema: z.array(ticketSchemaResponse),
    });
  });
  static getSummary = catchAsync(async (req, res, _next) => {
    const organizationId = req.organization.id;

    // fetch status counts
    const [total, open, inProgress, resolved] = await Promise.all([
      prisma.ticket.count({ where: { organizationId } }),
      prisma.ticket.count({ where: { organizationId, status: "OPEN" } }),
      prisma.ticket.count({ where: { organizationId, status: "IN_PROGRESS" } }),
      prisma.ticket.count({ where: { organizationId, status: "RESOLVED" } }),
    ]);

    response(
      res,
      {
        total,
        open,
        inProgress,
        resolved,
      },
      200,
      { schema: ticketSummary },
    );
  });
  static getTicketDetails = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    const data = await TicketService.getTicketDetails({
      ticketId: id,
      organizationId: req.organization.id,
    });
    response(res, data, 200, { schema: ticketDetailsSchema });
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
  static getTicketComments = catchAsync(async (req, res, _next) => {
    const ticketId = req.params.id as string;
    const { comments, pagination } = await TicketService.getTicketComments({
      organizationId: req.organization.id,
      ticketId,
      queryString: req.query,
    });
    response(res, comments, 200, {
      otherFields: { ...pagination },
      schema: z.array(commentSchemaResponse),
    });
  });
  static escalate = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    const input = req.body as EscalateTicketInput;
    const data = await TicketService.escalateTicket({
      ticketId: id,
      organizationId: req.organization.id,
      userId: req.user.id,
      input,
    });
    response(res, data);
  });
  static getEscalateOptions = catchAsync(async (req, res, _next) => {
    const ticketId = req.params.id as string;
    const data = await TicketService.escalationOptions({
      ticketId,
      organizationId: req.organization.id,
    });
    response(res, data);
  });
}
