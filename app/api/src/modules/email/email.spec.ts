import { EmailService } from './email.service';

const {
  mockGetTenantClient,
  mockEmailProviderCount,
  mockEmailProviderFindMany,
  mockEmailProviderCreate,
  mockEmailProviderUpdate,
  mockEmailProviderDelete,
  mockEmailQueuePush,
  mockEncrypt,
} = vi.hoisted(() => ({
  mockGetTenantClient: vi.fn(),
  mockEmailProviderCount: vi.fn(),
  mockEmailProviderFindMany: vi.fn(),
  mockEmailProviderCreate: vi.fn(),
  mockEmailProviderUpdate: vi.fn(),
  mockEmailProviderDelete: vi.fn(),
  mockEmailQueuePush: vi.fn(),
  mockEncrypt: vi.fn(),
}));

vi.mock('@org/database', () => ({
  getTenantClient: mockGetTenantClient,
}));

vi.mock('../../core/utils/emailQueue.js', () => ({
  emailQueuePush: mockEmailQueuePush,
}));

vi.mock('../../core/utils/crypto.js', () => ({
  crypto: {
    encrypt: mockEncrypt,
  },
}));

describe('EmailService', () => {
  const organizationId = 'org-1';

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenantClient.mockReturnValue({
      emailProvider: {
        count: mockEmailProviderCount,
        findMany: mockEmailProviderFindMany,
        create: mockEmailProviderCreate,
        update: mockEmailProviderUpdate,
        delete: mockEmailProviderDelete,
      },
    });
  });

  describe('queueEmail', () => {
    it('throws when organizationId is missing for a non-system email', async () => {
      await expect(
        EmailService.queueEmail({
          organizationId: undefined,
          to: 'a@example.com',
          subject: 'Hi',
          template: 'invite',
          data: {},
          isSystemEmail: false,
        } as any),
      ).rejects.toMatchObject({
        message: 'organizationId undefined',
        statusCode: 404,
      });

      expect(mockEmailQueuePush).not.toHaveBeenCalled();
    });

    it('throws when the organization has no email provider configured', async () => {
      mockEmailProviderCount.mockResolvedValue(0);

      await expect(
        EmailService.queueEmail({
          organizationId,
          to: 'a@example.com',
          subject: 'Hi',
          template: 'invite',
          data: {},
          isSystemEmail: false,
        } as any),
      ).rejects.toMatchObject({
        message: 'You need to setup emailProvider',
        statusCode: 404,
        code: 'NOT_FOUND',
      });

      expect(mockEmailQueuePush).not.toHaveBeenCalled();
    });

    it('queues the email when a provider exists', async () => {
      mockEmailProviderCount.mockResolvedValue(1);
      mockEmailQueuePush.mockResolvedValue({ id: 'job-1' });

      const result = await EmailService.queueEmail({
        organizationId,
        to: 'a@example.com',
        subject: 'Hi',
        template: 'invite',
        data: { name: 'Alice' },
        isSystemEmail: false,
      } as any);

      expect(mockEmailQueuePush).toHaveBeenCalledWith({
        organizationId,
        to: 'a@example.com',
        subject: 'Hi',
        template: 'invite',
        data: { name: 'Alice' },
        jobType: 'email',
        isSystemEmail: false,
      });
      expect(result).toEqual({ id: 'job-1' });
    });

    it('skips the provider check for system emails', async () => {
      mockEmailQueuePush.mockResolvedValue({ id: 'job-2' });

      await EmailService.queueEmail({
        organizationId: undefined,
        to: 'a@example.com',
        subject: 'Password reset',
        template: 'reset',
        data: {},
        isSystemEmail: true,
      } as any);

      expect(mockGetTenantClient).not.toHaveBeenCalled();
      expect(mockEmailProviderCount).not.toHaveBeenCalled();
      expect(mockEmailQueuePush).toHaveBeenCalledWith(
        expect.objectContaining({ isSystemEmail: true }),
      );
    });
  });

  describe('getEmailProviders', () => {
    it('returns the organization email providers', async () => {
      mockEmailProviderFindMany.mockResolvedValue([
        {
          id: 'ep-1',
          providerType: 'SMTP',
          fromEmail: 'a@acme.com',
          domain: 'acme.com',
          priority: 1,
        },
      ]);

      const result = await EmailService.getEmailProviders(organizationId);

      expect(mockEmailProviderFindMany).toHaveBeenCalledWith({
        where: { organizationId },
        select: {
          id: true,
          providerType: true,
          fromEmail: true,
          domain: true,
          priority: true,
        },
      });
      expect(result).toEqual([
        {
          id: 'ep-1',
          providerType: 'SMTP',
          fromEmail: 'a@acme.com',
          domain: 'acme.com',
          priority: 1,
        },
      ]);
    });
  });

  describe('createEmailProvider', () => {
    it('throws a conflict when the organization already has 2 providers', async () => {
      mockEmailProviderCount.mockResolvedValue(2);

      await expect(
        EmailService.createEmailProvider(organizationId, {
          credentials: { apiKey: 'secret' },
          providerType: 'SMTP' as any,
          fromEmail: 'a@acme.com',
          priority: 1,
        }),
      ).rejects.toMatchObject({
        message: 'Max 2 provider per organization is allowed',
        statusCode: 400,
        code: 'CONFLICT_ERROR',
      });

      expect(mockEmailProviderCreate).not.toHaveBeenCalled();
    });

    it('encrypts credentials, derives the domain, and creates the provider', async () => {
      mockEmailProviderCount.mockResolvedValue(1);
      mockEncrypt.mockReturnValue('encrypted-blob');
      mockEmailProviderCreate.mockResolvedValue({ id: 'ep-1' });

      const result = await EmailService.createEmailProvider(organizationId, {
        credentials: { apiKey: 'secret' },
        providerType: 'SMTP' as any,
        fromEmail: 'billing@acme.com',
        webhookSecret: 'whsec_123',
        priority: 2,
      });

      expect(mockEncrypt).toHaveBeenCalledWith(
        JSON.stringify({ apiKey: 'secret' }),
      );
      expect(mockEmailProviderCreate).toHaveBeenCalledWith({
        data: {
          organizationId,
          credentials: 'encrypted-blob',
          priority: 2,
          providerType: 'SMTP',
          fromEmail: 'billing@acme.com',
          domain: 'acme.com',
          webhookSecret: 'whsec_123',
        },
      });
      expect(result).toEqual({ id: 'ep-1' });
    });
  });

  describe('updateEmailProvider', () => {
    it('re-encrypts credentials and updates the provider', async () => {
      mockEncrypt.mockReturnValue('new-encrypted-blob');
      mockEmailProviderUpdate.mockResolvedValue({
        id: 'ep-1',
        fromEmail: 'new@acme.com',
      });

      const result = await EmailService.updateEmailProvider(
        'ep-1',
        organizationId,
        {
          credentials: { apiKey: 'new-secret' },
          providerType: 'SMTP' as any,
          fromEmail: 'new@acme.com',
        } as any,
      );

      expect(mockEncrypt).toHaveBeenCalledWith(
        JSON.stringify({ apiKey: 'new-secret' }),
      );
      expect(mockEmailProviderUpdate).toHaveBeenCalledWith({
        where: { id: 'ep-1', organizationId },
        data: {
          domain: 'acme.com',
          fromEmail: 'new@acme.com',
          providerType: 'SMTP',
          credentials: 'new-encrypted-blob',
        },
      });
      expect(result).toEqual({ id: 'ep-1', fromEmail: 'new@acme.com' });
    });
  });

  describe('deleteEmailProvider', () => {
    it('deletes the provider scoped to the organization', async () => {
      mockEmailProviderDelete.mockResolvedValue({ id: 'ep-1' });

      const result = await EmailService.deleteEmailProvider(
        'ep-1',
        organizationId,
      );

      expect(mockEmailProviderDelete).toHaveBeenCalledWith({
        where: { id: 'ep-1', organizationId },
      });
      expect(result).toEqual({ id: 'ep-1' });
    });
  });
});
