import { CreateOrganizationInput, UpdateOrganizationInput } from "@repo/schemas";
import { Organization } from "../../../generated/prisma";
import { catchAsync } from "../../core/utils/catchAsync";
import HandleFactory from "../../core/utils/handlerFactory";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";
import { readableId } from "../../core/utils/utils";

export class OrganizationController {
  private static handler = new HandleFactory<Organization>(prisma.organization);
  static createOrganization = catchAsync(async (req, res) => {
    const input = req.body as CreateOrganizationInput;
    const data = await this.handler.create({
      ...input,
      code: readableId("ORG"),
      createdBy: req.user.id,
    });
    response(res, data);
  });
  static getAllOrganization = catchAsync(async (req, res) => {
    const { data, pagination } = await this.handler.getAll(req.query);
    response(res, data, 200, { otherFields: { ...pagination } });
  });
  static getOrganizationDetails = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const data = await this.handler.getOne(id);
    response(res, data, 200);
  });
  static updateOrganization = catchAsync(async (req, res) => {
    const input = req.body as UpdateOrganizationInput;
    const id = req.params.id as string;
    const data = await this.handler.update(id, input);
    response(res, data);
  });
  static deleteOrganization = catchAsync(async (req, res) => {
    const id = req.params.id as string;
    const data = await this.handler.softDelete(id);
    response(res, data);
  });
}
