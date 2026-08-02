import { log } from '@org/utils';
import { env } from '../../config/env';
import { GeminiRequest } from './ai.types';
import { GoogleGenAI } from '@google/genai';
class AiServiceClass {
  ai: GoogleGenAI;
  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }
  async generateGeminiResponse<T>({
    query,
    data,
    options,
    buffer,
    mimeType,
    responseSchema,
  }: GeminiRequest): Promise<T | undefined> {
    let contents: object[] | string = [];

    const prompt = `
        You are an AI assistant.

        ## DATA
        ${JSON.stringify(data, null, 2)}

        ## OPTIONS
        ${JSON.stringify(options, null, 2)}

        ## TASK
        ${query}
`;
    if (buffer) {
      const base64 = buffer.toString('base64');
      contents.push({
        role: 'user',
        parts: [
          {
            inlineData: {
              data: base64,
              mimeType,
            },
          },
          { text: prompt },
        ],
      });
    } else {
      contents = [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ];
    }
    const response = await this.ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents,
      config: {
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.5,
      },
    });
    if (response.text) return this.parseGeminiJSON(response?.text);
    log.warn('No response from AI');
    return;
  }

  parseGeminiJSON(text: string) {
    let cleaned = text.replace(/```json|```/g, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) {
      log.data('response', text);
      throw new Error('No valid JSON found in model output');
    }
    cleaned = match[0];
    return JSON.parse(cleaned);
  }
}
export const AiService = new AiServiceClass(env.geminiApiKey!);
