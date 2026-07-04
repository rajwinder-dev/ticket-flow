import { JSX } from "react";
import WelcomeEmail from "./emailTemplates/welcome.js";
import InviteEmail from "./emailTemplates/InviteEmail.js";
import ForgotPasswordEmail from "./emailTemplates/ForgotPasswordEmail.js";

// update types too in emsil.zod.ts
const templates = {
  welcome: WelcomeEmail,
  invite: InviteEmail,
  forgetPassword: ForgotPasswordEmail,
} as const;

type TemplateName = keyof typeof templates;

type TemplateProps = {
  [K in TemplateName]: React.ComponentProps<(typeof templates)[K]>;
};


export function selectTemplate<K extends TemplateName>(
  templateName: K,
  props: TemplateProps[K],
): JSX.Element {
  const Component = templates[templateName];

  if (!Component) {
    throw new Error("Template not found");
  }

  return Component({ ...props });
}
