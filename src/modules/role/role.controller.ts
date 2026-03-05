import { Roles } from "../../../generated/prisma";
import HandleFactory from "../../core/utils/handlerFactory";
import { prisma } from "../../core/utils/prismaClient";

export class roleController {
  private static handler = new HandleFactory<Roles>(prisma.roles, {enableDelete: true});

  static createRole = this.handler.createOne();
  static getAllRoles = this.handler.getMany();
  static deleteRole = this.handler.deleteOne();
  static updateRole = this.handler.updateOne();
}
