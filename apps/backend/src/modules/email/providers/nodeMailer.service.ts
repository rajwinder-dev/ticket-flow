import nodemailer from "nodemailer";
import { EmailService } from "../email.service";
export type NodemailerConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
};
export class NodeMailerService implements EmailService {
  constructor(private config: NodemailerConfig) {}
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
    const transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
    });
    const mailOptions = {
      from,
      to,
      subject,
      html,
    };
    return await transporter.sendMail(mailOptions);
  }
}
