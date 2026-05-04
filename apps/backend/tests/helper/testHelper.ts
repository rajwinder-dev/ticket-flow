import { faker } from "@faker-js/faker";
import { prisma } from "../../src/core/utils/prismaClient";
import { readableId } from "../../src/core/utils/utils";
import { BcryptService } from "../../src/modules/auth/bcrypt.service";

export async function createRandomUser() {
  const password = faker.string.alpha({ length: { max: 20, min: 18 } });
  const passwordHash = await BcryptService.hashPassword(password);
  const data = await prisma.user.create({
    data: {
      username: faker.person.firstName().toLowerCase(),
      email: faker.internet.email().toLowerCase(),
      passwordHash,
      code: readableId("USER"),
    },
  });
  return { user: data, password };
}
