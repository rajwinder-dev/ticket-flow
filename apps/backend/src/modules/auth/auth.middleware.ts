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
      include: {
        role: true,
      },
    });
    if (!userdata) return next(new appError("User not found", 401));

    if (userdata?.passwordChangeAt) {
      const passwordChange = Math.floor(new Date(userdata?.passwordChangeAt).getTime() / 1000);
      const issueDate = decoded.iat;
 
      if (passwordChange > issueDate) {
        clearCookie(res, "refreshToken");
        return next(new appError("Password Changed , login again", 403, "EXPIRED_TOKEN"));
      }
    }

    req.user = {
      id: userdata?.id,
      role: userdata.userType === "ADMIN" ? "ADMIN" : userdata?.role?.name,
      permissions: userdata.role?.permissions as Record<string, string[]>
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
