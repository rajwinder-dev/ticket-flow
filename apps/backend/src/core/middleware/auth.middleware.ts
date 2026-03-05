import { verify } from "jsonwebtoken";
import { appError } from "../utils/appError";
import { catchAsync } from "../utils/catchAsync";
import bcrypt from "bcrypt";
import { prisma } from "../utils/prismaClient";
import { authService } from "../../modules/auth/auth.service";


export class authMiddleware {
  static assignRolePreProcessor = catchAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return next(
        new appError(
          "Confirm Password don't match, try again!",
          400,
          "MATCH_ERROR"
        )
      );
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
      return next(
        new appError(
          "No token found, please Login to get access",
          401,
          "INVALID_TOKEN"
        )
      );
    try {
      decoded = verify(token, process.env.ACCESS_SECRET as string) as {
        id: string;
        sessionId: string;
        iat: number;
      };
    } catch {
      return next(
        new appError("Invalid Token, Please Login again ", 401, "INVALID_TOKEN")
      );
    }
    const currentUser = await prisma.authorization.findUnique({
      where: { userId: decoded.id },
      // select: { employeeId: true, updatedAt: true, },
      include: {
        Role: true,
      },
    });

    const isUserAlive = await authService.verifyUserSessionAlive(
      decoded.sessionId
    );

    if (!isUserAlive) {
      return next(new appError(`login session expire`, 401, "SESSION_EXPIRE"));
    }

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
        return next(
          new appError(
            "You do not have permission to perform this action.",
            403
          )
        );
      }
      next();
    });
}
// state less logic (ignore)
// if (currentUser?.updatedAt && decoded?.iat) {
//   const passwordChange = new Date(currentUser.updatedAt).getTime() / 1000;
//   const issueDate = decoded.iat;
//   if (passwordChange > issueDate) {
//     res.clearCookie("refreshToken", {
//       httpOnly: true,
//       secure: true,
//       sameSite: "strict",
//       path: "/",
//     });
//     return next(
//       new appError("Password has been changed, please login again ", 401)
//     );
//   }
// }
