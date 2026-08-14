import { auth } from '@org/auth';
import type { TestHelpers } from 'better-auth/plugins';

export type CreateUserInput = Parameters<TestHelpers['createUser']>[0];

export class TestAuthContext {
  user!: Awaited<ReturnType<TestHelpers['createUser']>>;
  headers!: Record<string, string>;
  test!: TestHelpers;
  private async createAuthUser(data?: Partial<CreateUserInput>) {
    const email = data?.email
      ? data.email
      : `test-${crypto.randomUUID()}@example.com`;

    this.test = (await auth.$context).test;
    this.user = this.test.createUser({
      email,
      password: email,
      ...data,
    });
    const user = await this.test.saveUser(this.user);
    return user;
  }
  private async setAuthHeaders(userId: string) {
    const headers = await this.test.getAuthHeaders({
      userId,
    });
    if (!headers) {
      throw new Error('Failed to get authenticated headers');
    }
    this.headers = Object.fromEntries(headers.entries());
    return this.headers;
  }
  async onlyCreateUser(data?: Partial<CreateUserInput>) {
    const email = data?.email
      ? data.email
      : `test-${crypto.randomUUID()}@example.com`;

    const context = (await auth.$context).test;
    const newUser = context.createUser({
      email,
      password: email,
      ...data,
    });
    const user = await context.saveUser(newUser);
    return user;
  }
  async authenticateUser({
    data,
    userId,
  }: {
    data?: Partial<CreateUserInput>;
    userId?: string;
  }) {
    if (userId) {
      console.log('Switching authenticated user');
      return await this.setAuthHeaders(userId);
    }
    await this.createAuthUser(data);
    await this.setAuthHeaders(userId || this.user.id);
    return this.user;
  }
  getUserData() {
    return this.user;
  }

  async cleanup() {
    if (this.user) {
      await this.test.deleteUser(this.user.id);
    }
  }
}
