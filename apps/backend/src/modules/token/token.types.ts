import { TokenType } from "@prisma/client";

export interface TokenDataInput {
  email: string;
  createdBy: string
  type: TokenType;
  userId?: string;
  roleId?: string;
  organizationId?: string;
}
