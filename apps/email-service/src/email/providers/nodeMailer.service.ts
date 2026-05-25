import nodemailer, { Transporter } from "nodemailer";
import { EmailService } from "../email.service.js";
export type NodemailerConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
};
export class NodeMailerService implements EmailService {
  private transporter: Transporter;
  constructor(private config: NodemailerConfig) {
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
