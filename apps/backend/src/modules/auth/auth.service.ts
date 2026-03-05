import { prisma } from "../../core/utils/prismaClient";

export class authService {
  static async storeUserSession({
    sessionId,
    userId,
    clientIp,
  }: {
    sessionId: string;
    userId: string;
    clientIp: string | null;
  }) {
    await prisma.loginActivity.create({
      data: {
        sessionId,
        userId,
        clientIp,
      },
    });
  }
  static async updateUserSession(sessionId: string) {
    await prisma.loginActivity.update({
      where: {
        sessionId,
      },
      data: {
        logoutAt: new Date(),
      },
    });
  }
  static async verifyUserSessionAlive(sessionId: string) {
    if (!sessionId) console.log("sessionId is undefined");
    const data = await prisma.loginActivity.findUnique({
      where: { sessionId },
    });
    if (data?.logoutAt === null) return data.sessionId;
    return false;
  }
}
