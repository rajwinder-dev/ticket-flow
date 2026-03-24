import { prisma } from "../../core/utils/prismaClient";
import { readableId } from "../../core/utils/utils";

export class TicketService {
  static createTicket = async ({
    subject,
    description,
    organizationId,
    customerId
  }: {
    subject: string;
    description: string;
    organizationId: string;
    customerId: string;
  }) => {
    const ticket = await prisma.ticket.create({
      data: {
        code: readableId("TKT"),
        subject,
        description,
        organizationId,
        customerId,
      },
    });
    return ticket;
  };
}
