import {
  CreateOrganizationInput,
  createOrganizationResponse,
  InviteUserOrganizationInput,
  memberSchemaResponse,
  organizationSchemaResponse,
  UpdateOrganizationInput,
} from '@org/zod';
import { APIFeatures } from '../../../core/utils/apiFeatures.js';
import { appError } from '../../../core/utils/appError.js';
import { catchAsync } from '../../../core/utils/catchAsync.js';
import HandleFactory from '../../../core/utils/handlerFactory.js';
import response from '../../../core/utils/response.js';
import { OrganizationService } from './organization.service.js';
import { getTenantClient, prisma, Prisma } from '@org/database';
import { InviteService } from '../invite/invite.service.js';

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
    const { output, total } = await OrganizationService.getMyOrganizations({
      userId: req.user.id as string,
      queryString: req.query,
    });
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
    const id = req.organization.id;
    const tenantDb = getTenantClient(id);
    await tenantDb.organization.update({
      where: { id },
      data: { active: false },
    });
    response(res, null, 204);
  });
  static getMembers = catchAsync(async (req, res, _next) => {
    const { data, propagation } = await OrganizationService.getMembers({
      organizationId: req.organization.id,
      queryString: req.query,
    });
    response(res, data, 200, {
      otherFields: propagation,
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
