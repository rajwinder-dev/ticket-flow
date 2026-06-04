import nodemailer, { Transporter } from "nodemailer";
import {SmtpSchema} from "@repo/schemas"
export class NodeMailerService {
  private transporter: Transporter;
  constructor(private config: SmtpSchema) {
    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
    });
  }
  async sendMail({
    from,
    to,
    subject,
    html,
  }: {
    to: string;
    from: string;
    subject: string;
    html: string;
  }) {
    return await this.transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  }
  async verify() {
    try {
      return await this.transporter.verify();
    } catch (error) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      throw new Error(message);
    }
  }
}
