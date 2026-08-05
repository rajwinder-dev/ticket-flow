// Level 2 — DEPENDENCY INJECTION, NO vi.mock() NEEDED
// Goal: learn vi.fn(), .mockResolvedValue/.mockRejectedValue, and
// asserting on .mock.calls — WITHOUT the added complexity of module
// mocking. The dependencies are passed into the constructor, so in your
// test you just build a plain object like:
//   { send: vi.fn() }
// and pass it straight in. No vi.mock() call belongs in this test file.

export interface Mailer {
  send(to: string, subject: string, body: string): Promise<{ id: string }>;
}

export interface Logger {
  info(message: string): void;
  error(message: string, err: unknown): void;
}

export class NotifierService {
  constructor(
    private readonly mailer: Mailer,
    private readonly logger: Logger,
  ) {}

  async notifyUser(email: string, message: string): Promise<boolean> {
    try {
      const result = await this.mailer.send(email, 'Notification', message);
      this.logger.info(`Sent notification ${result.id} to ${email}`);
      return true;
    } catch (err) {
      this.logger.error(`Failed to notify ${email}`, err);
      return false;
    }
  }

  async notifyMany(emails: string[], message: string): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;
    for (const email of emails) {
      const ok = await this.notifyUser(email, message);
      if (ok) sent++;
      else failed++;
    }
    return { sent, failed };
  }
}
