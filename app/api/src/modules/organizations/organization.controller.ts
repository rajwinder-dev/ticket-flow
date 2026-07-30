import {
  CreateOrganizationInput,
  createOrganizationResponse,
  InviteUserOrganizationInput,
  memberSchemaResponse,
  organizationSchemaResponse,
  UpdateOrganizationInput,
} from '@org/zod';
import { APIFeatures } from '../../core/utils/apiFeatures.js';
import { appError } from '../../core/utils/appError.js';
import { catchAsync } from '../../core/utils/catchAsync.js';
import HandleFactory from '../../core/utils/handlerFactory.js';
import response from '../../core/utils/response.js';
import { TokenService } from '../token/token.service.js';
import { OrganizationService } from './organization.service.js';
import { getTenantClient, prisma, Prisma } from '@org/database';
import { EmailService } from '../email/email.service.js';
import { GetMyOrganizationsRow } from './organization.types.js';

export class OrganizationController {
  private static handler =
    new HandleFactory<Prisma.OrganizationUncheckedCreateInput>(
      prisma.organization,
    );
  static createOrganization = catchAsync(async (req, res) => {
    const input = req.body as CreateOrganizationInput;
    const { organization } = await OrganizationService.create(
      req.user.id,
      input,
    );
    response(res, organization, 201, { schema: createOrganizationResponse });
  });
  static getMyOrganizations = catchAsync(async (req, res) => {
    const { limit, offset } = new APIFeatures(req.query).pagination();

    const rows = await prisma.$queryRaw<GetMyOrganizationsRow[]>`
    SELECT * FROM get_my_organizations(${req.user.id}::uuid, ${limit}, ${offset});
  `;

    const total = rows.length > 0 ? Number(rows[0].total_count) : 0;

    const output = rows.map((r) => ({
      id: r.id,
      name: r.name,
      logo: r.logo,
      createdBy: r.createdBy,
      role: r.roleName,
      isOwner: r.isOwner,
    }));

    response(res, output, 200, { otherFields: { limit, offset, total } });
  });
  static getCurrentOrganization = catchAsync(async (req, res, _next) => {
    const data = await prisma.organization.findUnique({
      where: {
        id: req.organization.id,
      },
    });
    if (!data) throw new appError('Organization not found ', 404);
    response(res, data, 200, { schema: organizationSchemaResponse });
  });
  static updateOrganization = catchAsync(async (req, res) => {
    const input = req.body as UpdateOrganizationInput;
    const data = await this.handler.update(req.organization.id, input);
    response(res, data);
  });
  static deleteOrganization = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const data = await this.handler.softDelete(id);
    response(res, data);
  });
  static sendInvite = catchAsync(async (req, res, _next) => {
    const { email, roleId } = req.body as InviteUserOrganizationInput;
    if (email === req.user.email)
      throw new appError('self invite is not applicable', 403, 'FORBIDDEN');
    const { url } = await OrganizationService.inviteMember(req.user.id, {
      organizationId: req.organization.id,
      email,
      roleId,
    });
    await EmailService.queueEmail({
      organizationId: req.organization.id,
      to: email,
      subject: 'Invite Email to our organizations',
      template: 'invite',
      data: {
        invitedByUsername: req.user.username,
        organization: req.organization.name,
        inviteLink: url,
      },
      isSystemEmail: false,
    });
    response(res, { message: 'Invite Sent successfully' });
  });
  static acceptInvite = catchAsync(async (req, res, _next) => {
    const token = req.params.token as string;
    const verifyToken = await OrganizationService.acceptInvite(
      req.user.id,
      req.user.email,
      token,
    );
    response(res, verifyToken, 200, {
      otherFields: { message: 'Joined Organization successfully' },
    });
  });
  static InviteDetails = catchAsync(async (req, res, _next) => {
    const token = req.params.token as string;
    const verifyToken = await TokenService.verifyToken(token);
    if (!verifyToken?.organizationId || !verifyToken?.roleId)
      throw new appError(
        'Invite Link is Invalid or Expire',
        400,
        'INVALID_TOKEN',
      );
    const inviteData = await prisma.token.findFirst({
      where: {
        token,
      },
      include: {
        organization: {
          select: {
            name: true,
          },
        },
        TokenCreatedBy: {
          select: {
            email: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    const data = {
      organization: inviteData?.organization?.name,
      role: inviteData?.role?.name,
      invitedTo: inviteData?.email,
      invitedBy: inviteData?.TokenCreatedBy?.email,
      expiresAt: inviteData?.expiresAt,
    };
    response(res, data, 200);
  });
  static getMembers = catchAsync(async (req, res, _next) => {
    const { filterOptions, limit, offset } = new APIFeatures(req.query)
      .filter()
      .pagination();
    const tenantdb = getTenantClient(req.organization.id);
    const membership = await tenantdb.membership.findMany({
      where: {
        organizationId: req.organization.id,
        isSystem: false,
        ...filterOptions.where,
      },
      select: {
        organizationId: true,
        id: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            email: true,
            name: true,
            avatar: true,

            queueAgents: {
              where: { organizationId: req.organization.id },
              select: {
                ticketCount: true,
                queue: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      skip: offset,
      take: limit,
    });
    const data = membership.map((item) => {
      const user = item.user;

      const totalTickets = user?.queueAgents.reduce(
        (sum, qa) => sum + qa.ticketCount,
        0,
      );

      return {
        id: item.id,
        email: user?.email,
        username: user?.name,
        avatar: user?.avatar,
        role: item.role?.name,
        roleId: item.role?.id,
        createdAt: item.createdAt,
        organizationId: item.organizationId,
        totalTickets,
        queues: user?.queueAgents.map((qa) => ({
          queueId: qa.queue?.id,
          name: qa.queue?.name,
          ticketCount: qa.ticketCount,
        })),
      };
    });
    const total = await prisma.membership.count({
      where: {
        organizationId: req.organization.id,
        ...filterOptions.where,
      },
    });
    response(res, data, 200, {
      otherFields: { limit, offset, total },
      schema: memberSchemaResponse,
    });
  });
  static getOnBoardingStatus = catchAsync(async (req, res, _next) => {
    const data = await OrganizationService.onboardingStatus(
      req.organization.id,
    );
    response(res, data, 200, { schema: organizationSchemaResponse });
  });
}
