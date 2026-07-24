import { PermissionAction, PermissionModule } from '@org/zod';
import { z } from 'zod';
import { appError } from '../../core/utils/appError.js';
import { catchAsync } from '../../core/utils/catchAsync.js';
import { auth } from '../../lib/auth.js';
import { fromNodeHeaders } from 'better-auth/node';
import { prisma } from '@org/database';
import { Socket } from 'socket.io';

export class authMiddleware {
  static protectedRoute = catchAsync(async (req, _res, next) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
      return next(new appError('Unauthorized', 401, 'INVALID_SESSION'));
    }

    req.user = {
      id: session.user.id,
      username: session.user.name,
      email: session.user.email,
    };

    next();
  });
  static tenant = catchAsync(async (req, _res, next) => {
    if (!req.user.id)
      return next(
        new appError('auth Middleware missing ', 400, 'VALIDATION_ERROR'),
      );
    const organizationId = req.header('x-organization-id');

    if (!organizationId)
      return next(
        new appError('x-organization-id required', 400, 'VALIDATION_ERROR'),
      );

    const organizationIdParse = z.uuid().safeParse(organizationId);
    if (!organizationIdParse.success)
      return next(
        new appError(
          'x-organization-id must be a valid UUID',
          400,
          'VALIDATION_ERROR',
        ),
      );

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
            name: true,
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
      return next(
        new appError('user not member of any organization', 403, 'FORBIDDEN'),
      );

    req.organization = {
      ...req.organization,
      isOwner: member?.role?.name === 'OWNER',
      id: organizationId,
      name: member.organization?.name as string,
    };
    req.user = {
      ...req.user,
      role: member.role.name,
      username: member.user?.name as string,
      permissions: member.role.permissions as Record<string, string[]>,
    };
    next();
  });
  static verifyPermission = <T extends PermissionModule>(
    module: T,
    action: PermissionAction<T>,
  ) =>
    catchAsync(async (req, _res, next) => {
      const permissions = req.user.permissions;
      if (req.organization.isOwner) return next();
      if (!permissions) {
        return next(
          new appError('Permissions not found on user', 500, 'INTERNAL_ERROR'),
        );
      }
      const resourcePermissions = permissions[module];
      if (!resourcePermissions || !resourcePermissions.includes(action)) {
        return next(new appError('Permission denied', 403, 'FORBIDDEN'));
      }
      next();
    });
  static restrictToOwner = catchAsync(async (req, _res, next) => {
    if (!req.organization.isOwner)
      return next(
        new appError('Restricted to owner', 403, 'FORBIDDEN', {
          isOwner: req.organization.isOwner,
        }),
      );
    next();
  });

  static SocketAuth = async (socket: Socket, next: (err?: Error) => void) => {
      
    const cookieHeader = socket.request.headers.cookie;
    const session = await auth.api.getSession({
      headers: {
        cookie: cookieHeader,
      },
    })
    if (!session) {
      return next(new appError('Unauthorized', 401, 'INVALID_SESSION'));
    }
    socket.user = {
      id: session.user.id,
      username: session.user.name,
      email: session.user.email,
    };
    next()
  };
}
