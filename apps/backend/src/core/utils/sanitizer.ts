// utils/sanitize.ts
import sanitizeHtml from 'sanitize-html';

export function sanitizeInput(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
}
// todo: simplify this 
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeInput(obj) as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitizedObj: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitizedObj[key] = sanitizeObject((obj as Record<string, unknown>)[key]);
      }
    }
    return sanitizedObj as T;
  }

  return obj;
}
