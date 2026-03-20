import { z } from "zod";
import { appError } from "../../core/utils/appError";
import { catchAsync } from "../../core/utils/catchAsync";
import { clearCookie } from "../../core/utils/cookies";
import { prisma } from "../../core/utils/prismaClient";
import { JwtService } from "./jwt.service";

export class authMiddleware {
  static protectedRoute = catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token?.trim())
      return next(new appError("No token found, please Login to get access", 401, "INVALID_TOKEN"));
    const decoded = JwtService.verify(token, "access");
    if (!decoded) return next(new appError("Invalid or Expire token", 401, "INVALID_TOKEN"));

    const userdata = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });
    if (!userdata) return next(new appError("User not found", 401, "NOT_FOUND"));

    if (userdata?.passwordChangeAt) {
      const passwordChange = Math.floor(new Date(userdata?.passwordChangeAt).getTime() / 1000);
      const issueDate = decoded.iat;

      if (passwordChange > issueDate) {
        clearCookie(res, "refreshToken");
        return next(new appError("Password Changed , login again", 403, "EXPIRED_TOKEN"));
      }
    }
    req.user = {
      ...req.user,
      id: userdata?.id,
      email: userdata.email,
    };

    next();
  });
  static tenant = catchAsync(async (req, res, next) => {
    if (!req.user.id)
      return next(new appError("auth Middleware missing ", 400, "VALIDATION_ERROR"));
    const organizationId = req.header("x-organization-id");

    if (!organizationId)
      return next(new appError("x-organization-id required", 400, "VALIDATION_ERROR"));

    const organizationIdParse = z.uuid().safeParse(organizationId);
    if (!organizationIdParse.success)
      return next(new appError("x-organization-id must be a valid UUID", 400, "VALIDATION_ERROR"));

    const userId = req.user.id as string;

    const member = await prisma.membership.findUnique({
      where: {
        organizationId_userId: {
          userId,
          organizationId,
        },
      },
      select: {
        organization: {
          select: {
            createdBy: true,
          },
        },
        role: {
          select: {
            name: true,
            permissions: true,
          },
        },
      },
    });
    if (!member?.role)
      return next(new appError("User is not a member of this organization", 403, "FORBIDDEN"));
    req.organization = {
      ...req.organization,
      isOwner: member?.role?.name === "OWNER",
      id: organizationId,
    };
    req.user = {
      ...req.user,
      role: member.role.name,
      permissions: member.role.permissions as Record<string, string[]>,
    };
    next();
  });
  static verifyPermissions = (module: string, action: string) =>
    catchAsync(async (req, res, next) => {
      const permissions = req.user.permissions;
      if (req.organization.isOwner) return next();
      if (!permissions) {
        return next(new appError("Permissions not found on user", 500, "INTERNAL_ERROR"));
      }
      const resourcePermissions = permissions[module];
      if (!resourcePermissions || !resourcePermissions.includes(action)) {
        return next(new appError("Permission denied", 403, "FORBIDDEN"));
      }
      next();
    });
}
