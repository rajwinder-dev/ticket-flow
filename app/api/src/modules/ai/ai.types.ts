export type MimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'application/pdf'
  | 'text/plain'
  | 'audio/mpeg'
  | 'audio/wav'
  | 'video/mp4';
export interface GeminiRequest {
  query: string;
  buffer?: Buffer;
  mimeType?: MimeType;
  jsonTemplate?: Record<string, 'string' | 'number'>;
}
