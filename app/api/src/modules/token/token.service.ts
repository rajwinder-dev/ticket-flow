import { TokenDataInput } from './token.types.js';
import { getTenantClient, prisma, TokeStatus } from '@org/database';
import { createTokenHash } from '@org/utils';
import { appError } from '../../core/utils/appError.js';
export class TokenService {
  static getTokenDetails = async (token: string) => {
    const data = await TokenService.verifyToken(token);
    if (!data) {
      throw new appError('Link expired or invalid', 404, 'EXPIRED_TOKEN');
    }
    let role;
    if (data.organizationId && data.roleId) {
      const tenantdb = getTenantClient(data.organizationId);
      const userRole = await tenantdb.role.findUnique({
        where: { id: data.roleId },
      });
      role = userRole?.name;
    }
    const finalResponse = {
      ...data,
      role,
    };
    return finalResponse;
  };
  static createToken = async ({
    input,
    expiresAt,
  }: {
    input: TokenDataInput;
    expiresAt: Date;
  }) => {
    const token = createTokenHash(); // revoke pending token
    const [_tokenData, newToken] = await prisma.$transaction([
      prisma.token.updateMany({
        where: {
          type: input.type,
          status: 'PENDING',
          email: input.email,
        },
        data: {
          status: 'REVOKED',
        },
      }),
      prisma.token.create({
        data: { ...input, token, expiresAt },
      }),
    ]);

    return newToken;
  };
  static verifyToken = async (token: string) => {
    const currentDate = new Date();

    const tokenData = await prisma.token.findFirst({
      where: {
        token,
        status: 'PENDING',
        expiresAt: {
          gt: currentDate,
        },
      },
      orderBy: {
        createdAt: 'desc',
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
