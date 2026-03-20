import { TokenType } from "../../../generated/prisma";

export interface TokenDataInput {
  email: string;
  createdBy: string
  type: TokenType;
  userId?: string;
  roleId?: string;
  organizationId?: string;
}
