import express from "express";

import { employeeSchema, updateMyDetails } from "./employee.zod";

import { params } from "@repo/schemas/src/global.zod";
import {
    processImagesMiddleware,
    upload,
} from "../../core/middleware/processImageUpload.middleware";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authMiddleware } from "../auth/auth.middleware";
import EmployeeController from "./employee.controller";

const employeeRouter = express.Router();
employeeRouter.use(authMiddleware.protectedRoute);

employeeRouter.route("/me").get(EmployeeController.getMyDetails);
employeeRouter
  .route("/updateMe")
  .patch(
    upload.single("image"),
    processImagesMiddleware,
    validationMiddleware(updateMyDetails),
    EmployeeController.updateMyDetails,
  );

employeeRouter.use(authMiddleware.restrictRote("admin"));

employeeRouter
  .route("/")
  .get(EmployeeController.getAllEmployees)
  .post(
    upload.single("image"),
    processImagesMiddleware,
    validationMiddleware(employeeSchema),
    EmployeeController.createEmployee,
  );

employeeRouter.route("/summary").get(EmployeeController.employeeSummary);
employeeRouter
  .route("/:id")
  .get(EmployeeController.getEmployeeDetails)
  .patch(EmployeeController.updateEmployee)
  .delete(validationMiddleware(params), EmployeeController.deleteEmployee);

export default employeeRouter;
