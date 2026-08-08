import { appError } from "../../core/utils/appError";

export class WebhookService {
  static parseRawData<T>(rawData: string): T  {
    try {
      return JSON.parse(rawData);
    } catch (error) {
      throw new appError('Invalid JSON payload', 400, 'INVALID_JSON');
    }
  }
}
