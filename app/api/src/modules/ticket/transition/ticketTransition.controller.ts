import z from 'zod';
import { catchAsync } from '../../../core/utils/catchAsync';

import response from '../../../core/utils/response.js';
import { AssignTicketInput, EscalateTicketInput, ticketTranslationSchema, UpdateTicketPriorityInput, UpdateTicketStatusInput } from '@org/zod';
import { TicketTransitionService } from './ticketTransition.service';
export class TicketTransitionController {
  static getTransitionHistory = catchAsync(async (req, res, _next) => {
    const ticketId = req.params.id as string;
    const { data, pagination } =
      await TicketTransitionService.getTicketTransitionHistory({
        ticketId,
        organizationId: req.organization.id,
        queryString: req.query,
      });
    response(res, data, 200, {
      otherFields: { ...pagination },
      schema: z.array(ticketTranslationSchema),
    });
  });
  static updateStatus = catchAsync(async (req, res, _next) => {
    const ticketId = req.params.id as string;
    const { status, version } = req.body as UpdateTicketStatusInput;
    const data = await TicketTransitionService.updateStatus({
      ticketId,
      userId: req.user.id,
      organizationId: req.organization.id,
      nextStatus: status,
      version,
    });
    response(res, data, 200);
  });
  static updatePriority = catchAsync(async (req, res, _next) => {
    const ticketId = req.params.id as string;
    const { priority, version } = req.body as UpdateTicketPriorityInput;
    const data = await TicketTransitionService.updatePriority({
      userId: req.user.id,
      ticketId,
      organizationId: req.organization.id,
      priority,
      version,
    });
    response(res, data, 200);
  });
  static assignTicket = catchAsync(async (req, res, _next) => {
    const ticketId = req.params.id as string;
    const { assignId, targetType } = req.body as AssignTicketInput;
    const data = await TicketTransitionService.assignTicket({
      userId: req.user.id,
      ticketId,
      organizationId: req.organization.id,
      assignId,
      targetType,
    });
    response(res, data);
  });
  static escalate = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    const input = req.body as EscalateTicketInput;
    const data = await TicketTransitionService.escalateTicket({
      ticketId: id,
      organizationId: req.organization.id,
      userId: req.user.id,
      input,
    });
    response(res, data);
  });
  static getEscalateOptions = catchAsync(async (req, res, _next) => {
    const ticketId = req.params.id as string;
    const data = await TicketTransitionService.escalationOptions({
      ticketId,
      organizationId: req.organization.id,
    });
    response(res, data);
  });
}
