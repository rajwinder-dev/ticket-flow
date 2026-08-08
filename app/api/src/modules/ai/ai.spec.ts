import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// --- Mocks -------------------------------------------------------------

const { mockGenerateContent } = vi.hoisted(() => {
  return { mockGenerateContent: vi.fn() };
});

vi.mock('@google/genai', () => {
  class MockGoogleGenAI {
    models = { generateContent: mockGenerateContent };
  }
  return { GoogleGenAI: MockGoogleGenAI };
});

vi.mock('@org/utils', () => ({
  log: {
    warn: vi.fn(),
    data: vi.fn(),
  },
}));

vi.mock('../../config/env', () => ({
  env: {
    geminiApiKey: 'test-api-key',
  },
}));

import { AiService } from './ai.service.js';
import { log } from '@org/utils';

describe('AiServiceClass', () => {
  beforeEach(() => {
    mockGenerateContent.mockReset();
    (log.warn as any).mockClear();
    (log.data as any).mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- constructor -------------------------------------------------------

  it('wires the AiService instance up to the mocked GoogleGenAI client', () => {
    expect(AiService.ai.models.generateContent).toBe(mockGenerateContent);
  });

  // --- generateGeminiResponse --------------------------------------------

  describe('generateGeminiResponse', () => {
    it('sends a text-only prompt when no buffer is provided', async () => {
      mockGenerateContent.mockResolvedValue({
        text: '{"result": "ok"}',
      });

      const result = await AiService.generateGeminiResponse({
        query: 'Summarize this',
        data: { foo: 'bar' },
        options: { verbose: true },
      } as any);

      expect(result).toEqual({ result: 'ok' });
      expect(mockGenerateContent).toHaveBeenCalledTimes(1);

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.model).toBe('gemini-3.1-flash-lite');
      expect(callArgs.config).toEqual({
        responseMimeType: 'application/json',
        temperature: 0.5,
      });
      expect(callArgs.contents).toEqual([
        {
          role: 'user',
          parts: [{ text: expect.stringContaining('Summarize this') }],
        },
      ]);
      const promptText = callArgs.contents[0].parts[0].text;
      expect(promptText).toContain(JSON.stringify({ foo: 'bar' }, null, 2));
      expect(promptText).toContain(JSON.stringify({ verbose: true }, null, 2));
    });

    it('sends inline data alongside the prompt when a buffer is provided', async () => {
      mockGenerateContent.mockResolvedValue({
        text: '{"result": "with-image"}',
      });

      const buffer = Buffer.from('fake-image-bytes');

      const result = await AiService.generateGeminiResponse({
        query: 'Describe this image',
        data: {},
        options: {},
        buffer,
        mimeType: 'image/png',
      } as any);

      expect(result).toEqual({ result: 'with-image' });

      const callArgs = mockGenerateContent.mock.calls[0][0];
      const parts = callArgs.contents[0].parts;
      expect(parts[0]).toEqual({
        inlineData: {
          data: buffer.toString('base64'),
          mimeType: 'image/png',
        },
      });
      expect(parts[1].text).toContain('Describe this image');
    });

    it('passes responseSchema through to the config when provided', async () => {
      mockGenerateContent.mockResolvedValue({ text: '{"a":1}' });
      const schema = { type: 'object', properties: { a: { type: 'number' } } };

      await AiService.generateGeminiResponse({
        query: 'q',
        data: {},
        options: {},
        responseSchema: schema,
      } as any);

      const callArgs = mockGenerateContent.mock.calls[0][0];
      expect(callArgs.config.responseSchema).toEqual(schema);
    });

    it('logs a warning and returns undefined when the model returns no text', async () => {
      mockGenerateContent.mockResolvedValue({ text: '' });

      const result = await AiService.generateGeminiResponse({
        query: 'q',
        data: {},
        options: {},
      } as any);

      expect(result).toBeUndefined();
      expect(log.warn).toHaveBeenCalledWith('No response from AI');
    });

    it('propagates errors thrown by the underlying API call', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API unavailable'));

      await expect(
        AiService.generateGeminiResponse({
          query: 'q',
          data: {},
          options: {},
        } as any),
      ).rejects.toThrow('API unavailable');
    });

    it('propagates a JSON parse error when the model output is malformed', async () => {
      mockGenerateContent.mockResolvedValue({ text: 'not json at all' });

      await expect(
        AiService.generateGeminiResponse({
          query: 'q',
          data: {},
          options: {},
        } as any),
      ).rejects.toThrow('No valid JSON found in model output');
    });
  });

  // --- parseGeminiJSON -----------------------------------------------------

  describe('parseGeminiJSON', () => {
    it('parses plain JSON text', () => {
      const result = AiService.parseGeminiJSON('{"a": 1, "b": "two"}');
      expect(result).toEqual({ a: 1, b: 'two' });
    });

    it('strips markdown code fences before parsing', () => {
      const text = '```json\n{"a": 1}\n```';
      const result = AiService.parseGeminiJSON(text);
      expect(result).toEqual({ a: 1 });
    });

    it('strips bare triple-backtick fences without a language tag', () => {
      const text = '```\n{"a": 2}\n```';
      const result = AiService.parseGeminiJSON(text);
      expect(result).toEqual({ a: 2 });
    });

    it('extracts JSON embedded within surrounding prose', () => {
      const text =
        'Sure, here you go:\n{"a": 3}\nLet me know if you need more.';
      const result = AiService.parseGeminiJSON(text);
      expect(result).toEqual({ a: 3 });
    });

    it('throws and logs the raw response when no JSON object is present', () => {
      expect(() => AiService.parseGeminiJSON('no json here')).toThrow(
        'No valid JSON found in model output',
      );
      expect(log.data).toHaveBeenCalledWith('response', 'no json here');
    });

    it('throws when the extracted content is not valid JSON', () => {
      // Matches the {...} regex but is not parseable JSON.
      const text = '{not valid json}';
      expect(() => AiService.parseGeminiJSON(text)).toThrow();
    });
  });
});
