import { Organization } from "../../../generated/prisma";
import { catchAsync } from "../../core/utils/catchAsync";
import HandleFactory from "../../core/utils/handlerFactory";
import { prisma } from "../../core/utils/prismaClient";

export class OrganizationController {
  private static handler = new HandleFactory<Organization>(prisma.organization);

  static createOrganization = catchAsync((req, res) => {
    
  })

}
