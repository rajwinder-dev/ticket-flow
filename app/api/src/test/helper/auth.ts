import { auth } from '@org/auth';
import type { TestHelpers } from 'better-auth/plugins';

type CreateUserInput = Parameters<TestHelpers['createUser']>[0];

export class TestContext {
  user!: Awaited<ReturnType<TestHelpers['createUser']>>;
  headers!: Record<string, string>;
  test!: TestHelpers;
  orgHeader: Record<'x-organization-id', string> | undefined;
  private async createUser(data?: Partial<CreateUserInput>) {
    this.orgHeader = undefined;
    this.test = (await auth.$context).test;
    this.user = this.test.createUser({
      email: `test-${crypto.randomUUID()}@example.com`,
      password: 'test',
      ...data,
    });
    await this.test.saveUser(this.user);
    return this.user;
  }

  async authenticate() {
    if (!this.user) {
      await this.createUser();
    }
    const headers = await this.test.getAuthHeaders({
      userId: this.user.id,
    });
    if (!headers) {
      throw new Error('Failed to get authenticated headers');
    }
    this.headers = Object.fromEntries(headers.entries());
    return this.headers;
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
