import { UpdateMyDetailsInput } from '@org/zod';
import { prisma } from '@org/database';

export class UserService {
  static getDetails = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  };
  static updateDetails = async (
    userId: string,
    input: UpdateMyDetailsInput,
  ) => {
    const updatedUser = await prisma.user.update({
      data: input,
      where: {
        id: userId,
      },
    });
    return updatedUser;
  };
}
