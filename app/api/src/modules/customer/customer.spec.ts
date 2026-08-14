import { CustomerService } from './customer.service';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---- Hoisted mocks (must exist before vi.mock factories run) ----
const {
  mockGetTenantClient,
  mockPrismaIdentityUpsert,
  mockPrismaIdentityFindUnique,
  mockTenantCustomerUpsert,
  mockTenantCustomerCreate,
  mockTenantIdentityFindUnique,
  mockTenantIdentityCreate,
  mockLagActivity,
} = vi.hoisted(() => ({
  mockGetTenantClient: vi.fn(),
  mockPrismaIdentityUpsert: vi.fn(),
  mockPrismaIdentityFindUnique: vi.fn(),
  mockTenantCustomerUpsert: vi.fn(),
  mockTenantCustomerCreate: vi.fn(),
  mockTenantIdentityFindUnique: vi.fn(),
  mockTenantIdentityCreate: vi.fn(),
  mockLagActivity: vi.fn(),
}));

vi.mock('@org/database', () => ({
  getTenantClient: mockGetTenantClient,
  prisma: {
    customerIdentity: {
      upsert: mockPrismaIdentityUpsert,
      findUnique: mockPrismaIdentityFindUnique,
    },
  },
}));

vi.mock('../activity/activity.service.js', () => ({
  ActivityService: {
    lagActivity: mockLagActivity,
  },
}));

describe('CustomerService', () => {
  const organizationId = 'org-1';

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenantClient.mockReturnValue({
      customer: {
        upsert: mockTenantCustomerUpsert,
        create: mockTenantCustomerCreate,
      },
      customerIdentity: {
        findUnique: mockTenantIdentityFindUnique,
        create: mockTenantIdentityCreate,
      },
    });
  });

  // ---------------------------------------------------------------------
  describe('createCustomerIdentity', () => {
    beforeEach(() => {
      // Both prisma calls are evaluated eagerly while building the upsert
      // args object, regardless of which branch (create/update) is taken.
      mockPrismaIdentityUpsert.mockResolvedValue({ id: 'identity-1' });
      mockPrismaIdentityFindUnique.mockResolvedValue({ id: 'identity-1' });
    });

    it('uses the part of the email before "@" as the name when no displayName is given', async () => {
      mockTenantCustomerUpsert.mockResolvedValue({
        id: 'customer-1',
        name: 'alice',
        createdAt: 1,
        updatedAt: 1,
      });

      await CustomerService.createCustomerIdentity(
        'alice@example.com',
        organizationId,
      );

      expect(mockTenantCustomerUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({
            name: 'alice',
            organizationId,
            identityId: 'identity-1',
          }),
        }),
      );
    });

    it('uses the provided displayName when given', async () => {
      mockTenantCustomerUpsert.mockResolvedValue({
        id: 'customer-1',
        name: 'Alice Smith',
        createdAt: 1,
        updatedAt: 1,
      });

      await CustomerService.createCustomerIdentity(
        'alice@example.com',
        organizationId,
        'Alice Smith',
      );

      expect(mockTenantCustomerUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ name: 'Alice Smith' }),
        }),
      );
    });

    it('logs a "customer.create" activity when the record was newly created', async () => {
      mockTenantCustomerUpsert.mockResolvedValue({
        id: 'customer-1',
        createdAt: 100,
        updatedAt: 100, // createdAt === updatedAt => newly inserted
      });

      const result = await CustomerService.createCustomerIdentity(
        'alice@example.com',
        organizationId,
      );

      expect(mockLagActivity).toHaveBeenCalledWith({
        organizationId,
        actorType: 'SYSTEM',
        message: 'new customer is created ',
        event: 'customer.create',
        entityId: 'customer-1',
        entityType: 'ORGANIZATION',
      });
      expect(result).toEqual({
        id: 'customer-1',
        createdAt: 100,
        updatedAt: 100,
      });
    });

    it('does not log an activity when the record already existed', async () => {
      mockTenantCustomerUpsert.mockResolvedValue({
        id: 'customer-1',
        createdAt: 100,
        updatedAt: 200, // updated, not created
      });

      await CustomerService.createCustomerIdentity(
        'alice@example.com',
        organizationId,
      );

      expect(mockLagActivity).not.toHaveBeenCalled();
    });

    it('scopes the upsert to the correct organization and identity', async () => {
      mockTenantCustomerUpsert.mockResolvedValue({
        id: 'customer-1',
        createdAt: 1,
        updatedAt: 2,
      });

      await CustomerService.createCustomerIdentity(
        'alice@example.com',
        organizationId,
      );

      expect(mockGetTenantClient).toHaveBeenCalledWith(organizationId);
      expect(mockPrismaIdentityUpsert).toHaveBeenCalledWith({
        where: { email: 'alice@example.com' },
        update: {},
        create: { email: 'alice@example.com' },
      });
      expect(mockTenantCustomerUpsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            organizationId_identityId: {
              organizationId,
              identityId: 'identity-1',
            },
          },
          update: {},
        }),
      );
    });
  });

  // ---------------------------------------------------------------------
  describe('createCustomer', () => {
    const data = {
      email: 'bob@example.com',
      name: 'Bob',
      phone: '555-1234',
      avatarUrl: 'https://example.com/avatar.png',
    } as any;

    it('creates a customer linked to an existing identity when the email is already known', async () => {
      mockTenantIdentityFindUnique.mockResolvedValue({
        id: 'identity-1',
        customer: null,
      });
      mockTenantCustomerCreate.mockResolvedValue({
        id: 'customer-2',
        ...data,
        identityId: 'identity-1',
      });

      const result = await CustomerService.createCustomer({
        data,
        organizationId,
      });

      expect(mockTenantIdentityFindUnique).toHaveBeenCalledWith({
        where: { email: data.email },
        include: { customer: true },
      });
      expect(mockTenantCustomerCreate).toHaveBeenCalledWith({
        data: {
          name: data.name,
          phone: data.phone,
          avatarUrl: data.avatarUrl,
          organizationId,
          identityId: 'identity-1',
        },
      });
      expect(mockTenantIdentityCreate).not.toHaveBeenCalled();
      expect(result).toEqual({
        id: 'customer-2',
        ...data,
        identityId: 'identity-1',
      });
    });
  });

  // ---------------------------------------------------------------------
  describe('getCustomerByEmail', () => {
    it('returns the customer when the identity/customer is found', async () => {
      const customer = { id: 'customer-1', name: 'Alice' };
      mockTenantIdentityFindUnique.mockResolvedValue({
        id: 'identity-1',
        email: 'alice@example.com',
        customer,
      });

      const result = await CustomerService.getCustomerByEmail({
        email: 'alice@example.com',
        organizationId,
      });

      expect(mockGetTenantClient).toHaveBeenCalledWith(organizationId);
      expect(mockTenantIdentityFindUnique).toHaveBeenCalledWith({
        where: { email: 'alice@example.com' },
        include: { customer: true },
      });
      expect(result).toEqual(customer);
    });

    it('returns undefined when no identity is found', async () => {
      mockTenantIdentityFindUnique.mockResolvedValue(null);

      const result = await CustomerService.getCustomerByEmail({
        email: 'ghost@example.com',
        organizationId,
      });

      expect(result).toBeUndefined();
    });
  });
});
