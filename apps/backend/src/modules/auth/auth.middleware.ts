import bcrypt from "bcrypt";
import { verify } from "jsonwebtoken";
import { env } from "../../config/env";
import { appError } from "../../core/utils/appError";
import { catchAsync } from "../../core/utils/catchAsync";
import { prisma } from "../../core/utils/prismaClient";

export class authMiddleware {
  static assignRolePreProcessor = catchAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return next(new appError("Confirm Password don't match, try again!", 400, "MATCH_ERROR"));
    req.body.password = await bcrypt.hash(password, 12);
    delete req.body.confirmPassword;
    next();
  });
  static protectedRoute = catchAsync(async (req, res, next) => {
    let token;
    let decoded;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token?.trim())
      return next(new appError("No token found, please Login to get access", 401, "INVALID_TOKEN"));
    try {
      decoded = verify(token, env.accessSecret as string) as {
        id: string;
        sessionId: string;
        iat: number;
      };
    } catch {
      return next(new appError("Invalid Token, Please Login again ", 401, "INVALID_TOKEN"));
    }
    const currentUser = await prisma.authorization.findUnique({
      where: { userId: decoded.id },
      // select: { employeeId: true, updatedAt: true, },
      include: {
        Role: true,
      },
    });

    if (!currentUser) return next(new appError("Employee not found", 401));
    req.user = {
      userId: currentUser?.userId,
      role: currentUser?.Role?.name,
      sessionId: decoded.sessionId,
    };

    next();
  });
  static restrictRote = (...roles: string[]) =>
    catchAsync(async (req, res, next) => {
      if (req.user.role && !roles.includes(req.user.role)) {
        return next(new appError("You do not have permission to perform this action.", 403));
      }
      next();
    });
}
