import { TestFactory } from '../../test/testFactory';
import app from '../../app';
import { UpdateMyDetailsInput, UserSchema } from '@org/zod';
describe('User routes', () => {
  const agent = new TestFactory(app);
  beforeAll(async () => {
    await agent.authenticate();
  });
  afterAll(async () => {
    await agent.cleanup();
  });

  it('should return user data for authenticated request', async () => {
    const userData = agent.getUserData();
    const { data } = await agent.get<UserSchema>({ path: '/user/me' });

    expect(data).toEqual(
      expect.objectContaining({
        id: userData.id,
        email: userData.email,
        name: userData.name,
      }),
    );
  });
  it('should update user data for authenticated request', async () => {
    const data = await agent.patch<UpdateMyDetailsInput>({
      path: '/user/me',
      body: { phoneNo: '+11234567890', location: 'test' },
    });
    expect(data).toBeDefined();
  });
  it('should show updated user data', async () => {
    const { data } = await agent.get<UserSchema>({ path: '/user/me' });
    expect(data).toEqual(
      expect.objectContaining({ phoneNo: '+11234567890', location: 'test' }),
    );
  });
});
