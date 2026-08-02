import { getTenantClient, priority, Sentiment } from '@org/database';
import { AiService } from '../../ai/ai.service';
import {
  TicketanalyzeResponse,
  ticketAnalyzeTemplateSchema,
  TicketsummaryResponse,
  ticketsummaryTemplateSchema,
} from './ticketAi.templates';

class TicketAiServiceClass {
  async analyzeTicket({
    organizationId,
    data,
  }: {
    organizationId: string;
    data: {
      subject: string;
      description: string;
    };
  }) {
    const tenantDb = getTenantClient(organizationId);
    const groups = await tenantDb.queueGroup.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    const aiResponse = AiService.generateGeminiResponse<TicketanalyzeResponse>({
      query: 'Identify the data and return response',
      responseSchema: ticketAnalyzeTemplateSchema,
      options: {
        groups,
        priority: Object.values(priority),
        Sentiment: Object.values(Sentiment),
      },
      data,
    });
    return aiResponse;
  }
  async analyzeTicketSummary({
    organizationId,
    ticketId,
  }: {
    organizationId: string;
    ticketId: string;
  }) {
    const tenantDb = getTenantClient(organizationId);
    const ticketData = await tenantDb.ticket.findUnique({
      where: {
        id: ticketId,
      },
      select: {
        subject: true,
        description: true,
      },
    });
    if (ticketData) {
      const aiResponse =
        await AiService.generateGeminiResponse<TicketsummaryResponse>({
          query: 'Identify the data and return response',
          responseSchema: ticketsummaryTemplateSchema,
          data: ticketData,
        });
      return aiResponse;
    }
    return undefined;
  }
}

export const TicketAiService = new TicketAiServiceClass();
