import {
  ticketDetailsSchema,
  ticketSchemaResponse,
  ticketSummary,
} from '@org/zod';
import z from 'zod';
import { APIFeatures } from '../../../core/utils/apiFeatures.js';
import { catchAsync } from '../../../core/utils/catchAsync.js';
import { getTenantClient } from '@org/database';
import response from '../../../core/utils/response.js';
import { TicketService } from './ticket.service.js';

export class TicketController {
  static createTicket = catchAsync(async (req, res, _next) => {
    const output = await TicketService.createAndAssign({
      ownerId: req.organization.ownerId,
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
    const assignedTo = req.query.assignedTo as string;
    const { filterOptions, limit, offset } = new APIFeatures(req.query, {
      ignore: ['assignedTo'],
    })
      .filter()
      .sort()
      .pagination()
      .search();
    // implement custom filter
    let assignedToFilter;
    if (assignedTo === 'mine') {
      assignedToFilter = {
        assignedToUser: {
          id: req.user.id,
        },
      };
    } else if (assignedTo === 'none') {
      assignedToFilter = {
        assignedToUser: null,
      };
    }
    const tenantDB = getTenantClient(req.organization.id);
    const total = await tenantDB.ticket.count({
      where: {
        ...(assignedTo ? assignedToFilter : {}),
        ...filterOptions.where,
      },
    });
    const data = await tenantDB.ticket.findMany({
      where: {
        ...(assignedTo ? assignedToFilter : {}),
        ...filterOptions.where,
      },
      include: {
        assignedToUser: { select: { id: true, name: true } },
        queue: { select: { name: true } },
      },
      orderBy: filterOptions.orderBy,

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
    const assignedTo = req.query.assignedTo as string;
    let assignedToFilter;
    if (assignedTo === 'mine') {
      assignedToFilter = {
        assignedToUser: {
          id: req.user.id,
        },
      };
    } else if (assignedTo === 'none') {
      assignedToFilter = {
        assignedToUser: null,
      };
    }
    // fetch status counts
    const tenantDB = getTenantClient(organizationId);
    const [total, open, inProgress, resolved] = await Promise.all([
      tenantDB.ticket.count({ where: { ...(assignedToFilter || {}) } }),
      tenantDB.ticket.count({
        where: { status: 'OPEN', ...(assignedToFilter || {}) },
      }),
      tenantDB.ticket.count({
        where: { status: 'IN_PROGRESS', ...(assignedToFilter || {}) },
      }),
      tenantDB.ticket.count({
        where: { status: 'RESOLVED', ...(assignedToFilter || {}) },
      }),
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
    const tanentDb = getTenantClient(req.organization.id);
    const total = await tanentDb.ticket.count({
      where: {
        organizationId: req.organization.id,
        ...filterOptions.where,
      },
    });
    const data = await tanentDb.ticket.findMany({
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
}
