import { z } from "zod";
import { appError } from "../../core/utils/appError.js";
import { catchAsync } from "../../core/utils/catchAsync.js";
import { clearCookie } from "../../core/utils/cookies.js";
import { prisma } from "../../core/utils/prismaClient.js";
import { JwtService } from "./jwt.service.js";
import { PermissionAction, PermissionModule } from "@repo/schemas";

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
            name: true,
          },
        },
        user: {
          select: {
            username: true,
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
      return next(new appError("user not member of any organization", 403, "FORBIDDEN"));

    req.organization = {
      ...req.organization,
      isOwner: member?.role?.name === "OWNER",
      id: organizationId,
      name: member.organization?.name as string,
    };
    req.user = {
      ...req.user,
      role: member.role.name,
      username: member.user?.username as string,
      permissions: member.role.permissions as Record<string, string[]>,
    };
    next();
  });
  static verifyPermission = <T extends PermissionModule>(module: T, action: PermissionAction<T>) =>
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
  static restrictToOwner = catchAsync(async (req, res, next) => {
    if (!req.organization.isOwner) return next(new appError("Permission denied", 403, "FORBIDDEN"));
    next();
  });
}
