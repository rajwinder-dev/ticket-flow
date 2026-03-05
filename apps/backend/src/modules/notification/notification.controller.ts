import { prisma } from "../../core/utils/prismaClient";
import { catchAsync } from "../../core/utils/catchAsync";
import response from "../../core/utils/response";

export class notifyController {
  static getNotification = catchAsync(async (req, res, _next) => {
    const data = await prisma.notification.findMany({
      where: {
        isRead: false,
        to: req.user.employeeId,
      },
      include: {
        NotificationFrom: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    response(res, data, 200);
  });
}
