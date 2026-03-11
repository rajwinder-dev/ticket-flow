import { beforeAll, describe, it } from "vitest";
import { User } from "../../generated/prisma";
import { createRandomUser } from "../helper/testHelper";

describe("user route test ", async () => {
  let auth: { user: User; password: string };
  beforeAll(async () => {
    auth = await createRandomUser();
  });
  it("should Onboard user", async () => {

  });
});
