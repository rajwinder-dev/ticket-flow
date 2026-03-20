import { APIFeatures } from "../../core/utils/apiFeatures";
import { catchAsync } from "../../core/utils/catchAsync";
import { prisma } from "../../core/utils/prismaClient";
import response from "../../core/utils/response";

export default class MemberController {
  static getMembers = catchAsync(async (req, res, _next) => {
    const { filterOptions, limit, offset } = new APIFeatures(req.query).filter().pagination();
    const membership = await prisma.membership.findMany({
      where: {
        organizationId: req.organization.id,
        ...filterOptions.where,
      },
      include: {
        user: true,
      },
      skip: offset,
      take: limit,
    });
    const data = membership.map(item => ({...item.user, organizationId: item.organizationId}))
    const total = await prisma.membership.count({
      where: {
        organizationId: req.organization.id,
        ...filterOptions.where,
      },
    });
    response(res, data, 200, { otherFields: { limit, offset, total } });
  });
}
