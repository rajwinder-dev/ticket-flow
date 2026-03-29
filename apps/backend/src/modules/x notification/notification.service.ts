import { prisma } from "../../core/utils/prismaClient";
import { clients } from "../../core/utils/websocket";

export class notificationServer {
  static async sendNotification(
    from: number,
    to: number,
    notify: string = "you have new Notification",
    broadCast: ["all" | "admin" | "employee" | "manager" | "team"] | undefined
  ) {
    if (notify) {
      if (!broadCast) {
        return this.sendNotificationOne(from, to, notify);
      }
    }
    const validRoles = ["all", "admin", "employee", "manger"];
    broadCast?.forEach((role) => {
      if (validRoles.includes(role)) {
        this.buildAndSendNotification(role, from, notify);
      }
    });
  }
  static async buildAndSendNotification(
    role: string,
    from: number,
    message: string
  ) {
    let recipients;
    if (role === "team") recipients = await this.getTeamMembers(from);
    else recipients = await this.getTargetEmployee(role);
    const data = recipients
      .map((to) => {
        return { from, to, message };
      })
      .filter((item) => item.from !== item.to);
    await this.createNotification(data);
    this.broadCastMessage(data);
  }
  static async sendNotificationOne(from: number, to: number, message: string) {
    await this.createNotification([{ from, to, message }]);
    const client = clients.get(to);
    if (client)
      client.send(
        JSON.stringify({ type: "notification", notification: message })
      );
  }

  static async broadCastMessage(data: { to: number; message: string }[]) {
    data.forEach((item) => {
      const ws = clients.get(item.to);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({ type: "notification", notification: item.message })
        );
      }
    });
  }
  // * DATABASE INTERACTIONS ------------
  static async getTeamMembers(id: number) {
    const users = await prisma.teamMembers.findMany({
      where: {
        assignedTo: id,
      },
      select: {
        employeeId: true,
      },
    });
    return users.map((u) => u.employeeId);
  }
  static async getTargetEmployee(role: string) {
    const nameFilter = role === "all" ? undefined : role;
    const users = await prisma.authorization.findMany({
      where: {
        Roles: {
          name: nameFilter,
        },
      },
      select: {
        employeeId: true,
      },
    });
    if (users.length === 0)
      console.warn(`No recipients fond for role: ${role}`);

    return users.map((u) => u.employeeId);
  }
  static async createNotification(
    data: {
      from: number;
      to: number;
      message: string;
    }[]
  ) {
    try {
        return await prisma.notification.createMany({
          data,

        });
    } catch (error) {
      console.error(error);
    }
  }
}
