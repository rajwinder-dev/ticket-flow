import { catchAsync } from '../../../core/utils/catchAsync';
import { TicketCommentsService } from './comments.service';

import response from '../../../core/utils/response.js';
import { commentSchemaResponse, CreateTicketCommentInput } from '@org/zod';
import z from 'zod';
export class TicketCommentsController {
  static addComment = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    const { comment, id: uuid } = req.body as CreateTicketCommentInput;
    const data = await TicketCommentsService.createTicketComment({
      organizationId: req.organization.id,
      ticketId: id,
      userId: req.user.id,
      comment,
      id: uuid,
      isInternal: true,
    });
    response(res, data, 200);
  });
  static getTicketComments = catchAsync(async (req, res, _next) => {
    const id = req.params.id as string;
    const { comments, pagination } =
      await TicketCommentsService.getTicketComments({
        organizationId: req.organization.id,
        ticketId: id,
        queryString: req.query,
      });
    response(res, comments, 200, {
      otherFields: { ...pagination },
      schema: z.array(commentSchemaResponse),
    });
  });
}
