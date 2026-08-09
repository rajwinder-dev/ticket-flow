import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTenantClient, priority, Sentiment } from '@org/database';
import { AiService } from '../../ai/ai.service';
import { TicketAiService } from './ticketAi.service';

const { mockFindMany, mockFindUnique } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockFindUnique: vi.fn(),
}));

vi.mock('@org/database', () => ({
  getTenantClient: vi.fn(() => ({
    queueGroup: { findMany: mockFindMany },
    ticket: { findUnique: mockFindUnique },
  })),
  priority: ['LOW', 'MEDIUM', 'HIGH'],
  Sentiment: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'],
}));

vi.mock('../../ai/ai.service', () => ({
  AiService: {
    generateGeminiResponse: vi.fn(),
  },
}));

const mockedGetTenantClient = vi.mocked(getTenantClient);
const mockedGenerateGeminiResponse = vi.mocked(
  AiService.generateGeminiResponse,
);

describe('TicketAiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('analyzeTicket', () => {
    it('fetches queue groups and calls generateGeminiResponse with correct params', async () => {
      const mockGroups = [{ id: '1', name: 'Support' }];
      mockFindMany.mockResolvedValue(mockGroups);

      const mockAiResponse = { priority: 'HIGH', sentiment: 'NEGATIVE' };
      mockedGenerateGeminiResponse.mockResolvedValue(mockAiResponse);

      const result = await TicketAiService.analyzeTicket({
        organizationId: 'org_1',
        data: { subject: 'Login issue', description: 'Cannot log in' },
      });

      expect(mockedGetTenantClient).toHaveBeenCalledWith('org_1');
      expect(mockFindMany).toHaveBeenCalledWith({
        select: { id: true, name: true },
      });
      expect(mockedGenerateGeminiResponse).toHaveBeenCalledWith(
        expect.objectContaining({
          query: 'Identify the data and return response',
          options: expect.objectContaining({
            groups: mockGroups,
            priority: Object.values(priority),
            Sentiment: Object.values(Sentiment),
          }),
          data: { subject: 'Login issue', description: 'Cannot log in' },
        }),
      );
      expect(result).toEqual(mockAiResponse);
    });
  });

  describe('analyzeTicketSummary', () => {
    it('returns AI response when ticket exists', async () => {
      const mockTicket = { subject: 'Bug', description: 'App crashes' };
      mockFindUnique.mockResolvedValue(mockTicket);

      const mockAiResponse = { summary: 'App crashes on load' };
      mockedGenerateGeminiResponse.mockResolvedValue(mockAiResponse);

      const result = await TicketAiService.analyzeTicketSummary({
        organizationId: 'org_1',
        ticketId: 'ticket_1',
      });

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { id: 'ticket_1' },
        select: { subject: true, description: true },
      });
      expect(mockedGenerateGeminiResponse).toHaveBeenCalledWith({
        query: 'Identify the data and return response',
        responseSchema: expect.anything(),
        data: mockTicket,
      });
      expect(result).toEqual(mockAiResponse);
    });

    it('returns undefined when ticket does not exist', async () => {
      mockFindUnique.mockResolvedValue(null);

      const result = await TicketAiService.analyzeTicketSummary({
        organizationId: 'org_1',
        ticketId: 'missing_ticket',
      });

      expect(mockedGenerateGeminiResponse).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });
});
