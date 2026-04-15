import crypto from "crypto";
import { prisma } from "../../core/utils/prismaClient.js";
import { TokenDataInput } from "./token.types.js";
import { TokeStatus } from "@prisma/client";
export class TokenService {
  static createToken = async ({ input, expiresAt }: { input: TokenDataInput; expiresAt: Date }) => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const token = crypto.createHash("sha256").update(resetToken).digest("hex");
    // revoke pending token
    await prisma.token.updateMany({
      where: {
        type: input.type,
        status: "PENDING",
        email: input.email,
      },
      data: {
        status: "REVOKED"
      }
    })
    return await prisma.token.create({
      data: { ...input, token, expiresAt },
    });
  };
  static verifyToken = async (token: string) => {
    const currentDate = new Date();

    const tokenData = await prisma.token.findFirst({
      where: {
        token,
        status: "PENDING",
        expiresAt: {
          gt: currentDate,
        },
      },
      include: {
        role: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return tokenData;
  };

  static updateTokenStatus = async (token: string, status: TokeStatus) => {
    return await prisma.token.update({
      where: {
        token,
      },
      data: {
        status,
      },
    });
  };
}
