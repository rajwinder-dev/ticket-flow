import { Resend } from "resend";
import { Webhook } from 'svix';
import { appError } from "../../../core/utils/appError";
import { EmailService } from "../email.service";
export type ResendConfig = {
  apiKey: string;
};
export class ResendService implements EmailService {
  private resend;
  constructor(private config: ResendConfig) {
    this.resend = new Resend(this.config.apiKey);
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
    const mailOptions = {
      from,
      to,
      subject,
      html,
    };
    const { data, error } = await this.resend.emails.send(mailOptions);

    if (error) {
      return console.error({ error });
    }
    return data;
  }
  async verify(email: string) {
    const { data, error } = await this.resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Health Check",
      html: "OK",
    });
    if (error) {
      console.log(error);
      throw new appError(error.message, 400, "VERIFICATION_FAILED");
    }
    return data;
  }
  static async verifyWebhook(
    payload: string,
    secret: string,
    headers: { "svix-id": string; "svix-timestamp": string; "svix-signature": string },
  ) {
    const wh = new Webhook(secret);
    return wh.verify(payload, headers);
  }
}
