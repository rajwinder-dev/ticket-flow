import { appError } from "../../core/utils/appError";
import { catchAsync } from "../../core/utils/catchAsync";
import { prisma } from "../../core/utils/prismaClient";
import { JwtService } from "./jwt.service";

export class authMiddleware {
  static protectedRoute = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
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
    req.user = {
      id: userdata?.id,
      role: userdata.userType === "ADMIN" ? "ADMIN" : userdata?.role?.name,
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
