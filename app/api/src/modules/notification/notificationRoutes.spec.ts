import { TestFactory } from '../../test/testFactory';
import app from '../../app';
import { getOrgantionMock } from '../../test/helper/mock.helper';
import { getTenantClient } from '@org/database';
import { faker } from '@faker-js/faker';
import { NotificationSchema } from '@org/zod'; // adjust import path if different

describe('Notification routes', () => {
  const agent = new TestFactory(app);
  let notificationId: string;

  beforeAll(async () => {
    const orgData = getOrgantionMock();
    await agent.authenticate();
    const data = await agent.post({
      path: '/org',
      body: orgData,
    });
    await agent.setOrgId(data.data.id);
  });

  it('should get all notifications', async () => {
    // seed a notification manually since there's no create route
    const tenantDb = getTenantClient(agent.orgId);
    const notification = await tenantDb.notification.create({
      data: {
        title: faker.lorem.words(3),
        message: faker.lorem.sentence(),
        type: 'SYSTEM',
        channel: 'IN_APP',
        recipientId: agent.getUserData().id,
        organizationId: agent.orgId,
      },
    });
    notificationId = notification.id;

    const { data } = await agent.get<NotificationSchema[]>({
      path: '/notification',
    });

    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);

    const found = data.find((n) => n.id === notificationId);
    expect(found).toBeDefined();
    expect(found?.isRead).toBe(false);
    expect(found?.organization?.id).toBe(agent.orgId);
  });

  it('should mark a notification as read', async () => {
    const { data } = await agent.patch<{ updateed: number }>({
      path: `/notification/mark-as-read/${notificationId}`,
    });

    expect(data.updated).toBe(true);

    const tenantDb = getTenantClient(agent.orgId);
    const updated = await tenantDb.notification.findUnique({
      where: { id: notificationId },
    });
    expect(updated?.isRead).toBe(true);
    expect(updated?.readAt).not.toBeNull();
  });

  it('should return 404 when marking a non-existent notification as read', async () => {
    await agent.patch({
      path: `/notification/mark-as-read/${faker.string.uuid()}`,
      statusCode: 404,
    });
  });

  it('should mark all notifications as read', async () => {
    // seed a second unread notification
    const tenantDb = getTenantClient(agent.orgId);
    await tenantDb.notification.create({
      data: {
        title: faker.lorem.words(3),
        message: faker.lorem.sentence(),
        type: 'SYSTEM',
        channel: 'IN_APP',
        recipientId: agent.getUserData().id,
        organizationId: agent.orgId,
      },
    });

    await agent.patch({
      path: '/notification/mark-all-as-read',
    });

    const remainingUnread = await tenantDb.notification.count({
      where: {
        recipientId: agent.getUserData().id,
        isRead: false,
        deleted: false,
      },
    });
    expect(remainingUnread).toBe(0);
  });

  it('should soft delete a single notification', async () => {
    await agent.delete({
      path: `/notification/delete/${notificationId}`,
    });

    const tenantDb = getTenantClient(agent.orgId);
    const deleted = await tenantDb.notification.findUnique({
      where: { id: notificationId },
    });
    expect(deleted?.deleted).toBe(true);
    expect(deleted?.deletedAt).not.toBeNull();

    const { data } = await agent.get<NotificationSchema[]>({
      path: '/notification',
    });
    const found = data.find((n) => n.id === notificationId);
    expect(found).toBeUndefined();
  });

  it('should return 404 when deleting a non-existent notification', async () => {
    await agent.delete({
      path: `/notification/delete/${faker.string.uuid()}`,
      statusCode: 404,
    });
  });

  it('should soft delete all notifications', async () => {
    await agent.delete({
      path: '/notification/delete-all',
    });

    const tenantDb = getTenantClient(agent.orgId);
    const remaining = await tenantDb.notification.count({
      where: {
        recipientId: agent.getUserData().id,
        deleted: false,
      },
    });
    expect(remaining).toBe(0);

    const { data } = await agent.get<NotificationSchema[]>({
      path: '/notification',
    });
    expect(data.length).toBe(0);
  });
});
