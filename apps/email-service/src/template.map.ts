import { JSX } from "react";
import WelcomeEmail from "./emailTemplates/welcome";
import InviteEmail from "./emailTemplates/InviteEmail";
import ForgotPasswordEmail from "./emailTemplates/ForgotPasswordEmail";

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
