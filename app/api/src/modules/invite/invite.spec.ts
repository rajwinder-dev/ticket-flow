import { InviteService } from './invite.service';

const {
  mockGetTenantClient,
  mockFindUnique,
  mockMembershipCreate,
  mockFindFirst,
  mockCreateToken,
  mockVerifyToken,
  mockUpdateTokenStatus,
  mockLagActivity,
  mockQueueEmail,
  mockSendNotification,
  mockTokenFindFirst,
} = vi.hoisted(() => ({
  mockGetTenantClient: vi.fn(),
  mockFindUnique: vi.fn(),
  mockMembershipCreate: vi.fn(),
  mockFindFirst: vi.fn(),
  mockCreateToken: vi.fn(),
  mockVerifyToken: vi.fn(),
  mockUpdateTokenStatus: vi.fn(),
  mockLagActivity: vi.fn(),
  mockQueueEmail: vi.fn(),
  mockSendNotification: vi.fn(),
  mockTokenFindFirst: vi.fn(),
}));

vi.mock('@org/database', () => ({
  getTenantClient: mockGetTenantClient,
}));

vi.mock('../token/token.service', () => ({
  TokenService: {
    createToken: mockCreateToken,
    verifyToken: mockVerifyToken,
    updateTokenStatus: mockUpdateTokenStatus,
  },
}));

vi.mock('../activity/activity.service', () => ({
  ActivityService: {
    lagActivity: mockLagActivity,
  },
}));

vi.mock('../email/email.service', () => ({
  EmailService: {
    queueEmail: mockQueueEmail,
  },
}));

vi.mock('../notification/notification.service', () => ({
  NotificationService: {
    sendNotification: mockSendNotification,
  },
}));

vi.mock('../../config/env', () => ({
  env: { betterAuthUrl: 'https://app.example.com' },
}));

describe('InviteService', () => {
  const organizationId = 'org-1';

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTenantClient.mockReturnValue({
      membership: {
        findUnique: mockFindUnique,
        create: mockMembershipCreate,
        findFirst: mockFindFirst,
      },
      token: {
        findFirst: mockTokenFindFirst,
      },
    });
  });

  describe('inviteMember', () => {
    const actor = {
      userId: 'user-1',
      email: 'owner@example.com',
      username: 'Owner',
      organizationName: 'Acme',
    };
    const input = {
      organizationId,
      roleId: 'role-1',
      email: 'newperson@example.com',
    };

    it('rejects a self-invite', async () => {
      await expect(
        InviteService.inviteMember({
          actor,
          input: { ...input, email: actor.email },
        }),
      ).rejects.toMatchObject({
        message: 'self invite is not applicable',
        statusCode: 403,
        code: 'FORBIDDEN',
      });

      expect(mockCreateToken).not.toHaveBeenCalled();
    });

    it('throws 404 when the actor has no membership in the organization', async () => {
      mockFindUnique.mockResolvedValue(null);

      await expect(
        InviteService.inviteMember({ actor, input }),
      ).rejects.toMatchObject({
        message: 'Owner Details not found',
        statusCode: 404,
        code: 'NOT_FOUND',
      });
    });

    it('creates a token, logs activity, queues the invite email, and returns the url', async () => {
      mockFindUnique.mockResolvedValue({
        organization: { name: 'Acme' },
        user: { name: 'Owner' },
      });
      mockCreateToken.mockResolvedValue({ token: 'tok-123', id: 'token-id-1' });

      const result = await InviteService.inviteMember({ actor, input });

      expect(mockCreateToken).toHaveBeenCalledWith({
        input: {
          email: input.email,
          type: 'INVITE_USER',
          organizationId,
          roleId: input.roleId,
          createdBy: actor.userId,
        },
        expiresAt: expect.any(Date),
      });
      expect(mockLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId,
          actorId: actor.userId,
          event: 'organization.invite',
          entityId: 'token-id-1',
        }),
      );
      expect(mockQueueEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId,
          to: input.email,
          template: 'invite',
          data: expect.objectContaining({
            invitedByUsername: actor.username,
            organization: actor.organizationName,
            inviteLink: 'https://app.example.com/invite-user/tok-123',
          }),
        }),
      );
      expect(result).toEqual({
        url: 'https://app.example.com/invite-user/tok-123',
      });
    });
  });

  describe('acceptInvite', () => {
    it('throws when the token is invalid or missing required fields', async () => {
      mockVerifyToken.mockResolvedValue(null);

      await expect(
        InviteService.acceptInvite('user-1', 'a@example.com', 'bad-token'),
      ).rejects.toMatchObject({
        message: 'Invite Link is Invalid or Expire',
        statusCode: 400,
        code: 'INVALID_TOKEN',
      });
      expect(mockGetTenantClient).not.toHaveBeenCalled();
    });

    it('throws when the token email does not match the accepting user', async () => {
      mockVerifyToken.mockResolvedValue({
        organizationId,
        roleId: 'role-1',
        email: 'someone-else@example.com',
      });

      await expect(
        InviteService.acceptInvite('user-1', 'a@example.com', 'tok-123'),
      ).rejects.toMatchObject({
        message: 'Invite not applicable for your Email',
        statusCode: 403,
        code: 'FORBIDDEN',
      });
    });

    it('creates the membership, marks the token used, logs activity, and notifies the owner', async () => {
      mockVerifyToken.mockResolvedValue({
        organizationId,
        roleId: 'role-1',
        email: 'newperson@example.com',
      });
      mockMembershipCreate.mockResolvedValue({
        id: 'member-1',
        organizationId,
        roleId: 'role-1',
      });
      mockFindFirst.mockResolvedValue({ userId: 'owner-1' });

      const result = await InviteService.acceptInvite(
        'user-2',
        'newperson@example.com',
        'tok-123',
      );

      expect(mockMembershipCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            userId: 'user-2',
            organizationId,
            roleId: 'role-1',
          },
        }),
      );
      expect(mockUpdateTokenStatus).toHaveBeenCalledWith('tok-123', 'USED');
      expect(mockLagActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId,
          actorId: 'user-2',
          event: 'organization.join',
          entityId: 'member-1',
        }),
      );
      expect(mockSendNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: 'owner-1',
          userId: null,
          data: expect.objectContaining({
            title: 'User acept the Invite',
            type: 'MEMBER',
            actorId: 'user-2',
          }),
        }),
      );
      expect(result).toEqual({ organizationId });
    });

    it('does not notify when no organization owner is found', async () => {
      mockVerifyToken.mockResolvedValue({
        organizationId,
        roleId: 'role-1',
        email: 'newperson@example.com',
      });
      mockMembershipCreate.mockResolvedValue({
        id: 'member-1',
        organizationId,
        roleId: 'role-1',
      });
      mockFindFirst.mockResolvedValue(null);

      await InviteService.acceptInvite(
        'user-2',
        'newperson@example.com',
        'tok-123',
      );

      expect(mockSendNotification).not.toHaveBeenCalled();
    });
  });

  describe('getInviteDetails', () => {
    it('throws when the token is invalid or missing required fields', async () => {
      mockVerifyToken.mockResolvedValue({ organizationId: null });

      await expect(
        InviteService.getInviteDetails('bad-token'),
      ).rejects.toMatchObject({
        message: 'Invite Link is Invalid or Expire',
        statusCode: 400,
        code: 'INVALID_TOKEN',
      });
    });

    it('returns the flattened invite details', async () => {
      mockVerifyToken.mockResolvedValue({
        organizationId,
        roleId: 'role-1',
      });
      mockTokenFindFirst.mockResolvedValue({
        organization: { name: 'Acme' },
        role: { name: 'ADMIN' },
        email: 'newperson@example.com',
        TokenCreatedBy: { email: 'owner@example.com' },
        expiresAt: new Date('2024-01-08'),
      });

      const result = await InviteService.getInviteDetails('tok-123');

      expect(mockGetTenantClient).toHaveBeenCalledWith(organizationId);
      expect(result).toEqual({
        organization: 'Acme',
        role: 'ADMIN',
        invitedTo: 'newperson@example.com',
        invitedBy: 'owner@example.com',
        expiresAt: new Date('2024-01-08'),
      });
    });

    it('returns undefined fields when no matching token record is found', async () => {
      mockVerifyToken.mockResolvedValue({
        organizationId,
        roleId: 'role-1',
      });
      mockTokenFindFirst.mockResolvedValue(null);

      await expect(
        InviteService.getInviteDetails('tok-123'),
      ).rejects.toMatchObject({
        message: 'Invite not found',
        statusCode: 404,
        code: 'NOT_FOUND', // whatever code you actually used
      });
    });
  });
});
