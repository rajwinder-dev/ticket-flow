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
    buffer,
    mimeType,
    jsonTemplate,
  }: GeminiRequest): Promise<T | string> {
    let contents: object[] | string = [];

    const prompt = `
		${query}
    -----------------------------
		generate a JSON object with the following structure:
		${JSON.stringify(jsonTemplate) || `{output: "put your response here }`}
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
      contents = query;
    }
    const response = await this.ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents,
    });
    if (response.text) return this.parseGeminiJSON(response?.text);
    return 'Nothing returned By AI';
  }

  parseGeminiJSON(text: string) {
    let cleaned = text.replace(/```json|```/g, '').trim();
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No valid JSON found in model output');
    cleaned = match[0];
    return JSON.parse(cleaned);
  }
}
export const AiService = new AiServiceClass(env.geminiApiKey!);
