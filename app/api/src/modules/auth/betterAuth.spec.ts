import { describe, it, beforeAll, afterAll } from 'vitest';
import { app } from '../../app.js';
import { TestFactory } from '../../test/testFactory.js';
describe('protected route', () => {
  const agent = new TestFactory(app);

  beforeAll(async () => {
    await agent.authenticate();
  });

  afterAll(async () => {
    await agent.cleanup();
  });

  it('should return user data for authenticated request', async () => {
    const data = await agent.get({ path: '/org/me' });
    expect(data).toBeDefined();
  });
});
