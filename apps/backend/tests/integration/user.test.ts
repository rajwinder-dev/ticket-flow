import { beforeAll, describe, it } from "vitest";
import { User } from "../../generated/prisma";
import { createRandomUser } from "../helper/testHelper";
import { agent } from "supertest";
import app from "../../src/app";
import { faker } from "@faker-js/faker";

describe("user route test ", async () => {
  let auth: { user: User; password: string };
  const request = agent(app)
  beforeAll(async () => {
    auth = await createRandomUser();
  });
  it("should Onboard user", async () => {
     const res = request.post("/api/v1/user/onBoard").send({
      user: {
        location: faker.location.streetAddress
      },
      organization: {
        name: "tiven-books",
        
      }
     })
  });
});
