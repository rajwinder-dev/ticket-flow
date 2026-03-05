import { prisma } from "../../src/core/utils/prismaClient";
import { testFactory } from "../helper/testFactory";
import { describe, it } from "vitest";

const tf = new testFactory();

describe("Dashboard Access", () => {
  const roles = [
    { role: "admin", path: "/dashboard/admin" },
    { role: "manager", path: "/dashboard/manager" },
    { role: "employee", path: "/dashboard/employee" },
  ];

  describe.each(roles)("$role dashboard", ({ role, path }) => {
    it(`should return ${role} dashboard`, async () => {
      let username: string | undefined;

      // Fetch a middle user for manager/employee roles
      if (role !== "admin") {
        const users = await prisma.authorization.findMany({
          where: {
            Roles: {
              name: role,
            },
          },
        });

        if (!users.length) {
          throw new Error(`No users found for role: ${role}`);
        }

        username = users[Math.floor(users.length / 2)].username;
      }
      await tf.setup(username);
      await tf.get({ path });
    });
  });
});
