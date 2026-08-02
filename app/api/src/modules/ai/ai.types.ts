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
  data: Record<string, string | number | Record<string, any>>;
  query: string;
  options?: any;
  buffer?: Buffer;
  mimeType?: MimeType;
  responseSchema?:  Record<string, any >;
}
