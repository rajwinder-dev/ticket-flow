import { Type } from '@google/genai';
import { priority, Sentiment } from '@org/database';

export interface TicketanalyzeResponse {
  category: string;
  language: string;
  sentiment: Sentiment;
  keywords: string[];
  confidence: number;
  summary: string;
  priority: priority;
  groupId: string;
}
export interface TicketsummaryResponse {
  summary: string;
}
export const ticketsummaryTemplateSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
    },
  },
  required: ['summary'],
}
export const ticketAnalyzeTemplateSchema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
    },
    language: {
      type: Type.STRING,
    },
    sentiment: {
      type: Type.STRING,
      enum: Object.values(Sentiment),
    },
    keywords: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING,
      },
    },
    priority: {
      type: Type.STRING,
      enum: Object.values(priority),
    },
    confidence: {
      type: Type.NUMBER,
    },
    summary: {
      type: Type.STRING,
    },
    groupId: {
      type: Type.STRING,
    },
  },
  required: [
    'category',
    'language',
    'sentiment',
    'keywords',
    'confidence',
    'priority',
    'summary',
    'groupId',
  ],
};
