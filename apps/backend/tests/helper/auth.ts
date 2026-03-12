import { Agent } from "supertest";
import { createRandomUser } from "./testHelper";

export async function authenticateUser(api: Agent) {
  const { user, password } = await createRandomUser();
  const res = await api.post("/api/v1/auth/login").send({
    email: user?.email,
    password: password,
  });
  const accessToken = res.body.data.accessToken;
  return { user, password, accessToken };
}
