import { JSX } from "react";
import WelcomeEmail from "./templates/welcome";
import InviteEmail from "./templates/InviteEmail";
import ForgotPasswordEmail from "./templates/ForgotPasswordEmail";

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
