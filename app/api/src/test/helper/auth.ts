import { auth } from '@org/auth';
import type { TestHelpers } from 'better-auth/plugins';

export type CreateUserInput = Parameters<TestHelpers['createUser']>[0];

export class TestContext {
  user!: Awaited<ReturnType<TestHelpers['createUser']>>;
  headers!: Record<string, string>;
  test!: TestHelpers;
  orgHeader: Record<'x-organization-id', string> | undefined;
  async createAuthUser(data?: Partial<CreateUserInput>) {
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
  async authenticate({
    data,
    userId,
  }: { data?: Partial<CreateUserInput>; userId?: string } = {}) {
    if (userId) {
      console.log('Switching authenticated user');
      return await this.setAuthHeaders(userId);
    }
    await this.createAuthUser(data);
    return await this.setAuthHeaders(userId || this.user.id);
  }
  getUserData() {
    return this.user;
  }
  getActiveOrg() {
    return this.orgHeader?.['x-organization-id'];
  }
  async cleanup() {
    if (this.user) {
      await this.test.deleteUser(this.user.id);
    }
  }
  async setOrg(orgId: string) {
    this.orgHeader = {
      'x-organization-id': orgId,
    };
  }
}
