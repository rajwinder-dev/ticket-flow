import { TokenType } from "../../generated/client.js";

export interface TokenDataInput {
  email: string;
  createdBy: string
  type: TokenType;
  userId?: string;
  roleId?: string;
  organizationId?: string;
}
