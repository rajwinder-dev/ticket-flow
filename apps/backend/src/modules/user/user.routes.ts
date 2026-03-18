import { Router } from "express";
import { UserController } from "./user.controller";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { onboardUserInput } from "@repo/schemas";
import { authMiddleware } from "../auth/auth.middleware";

const userRouter = Router();
userRouter.use(authMiddleware.protectedRoute)
userRouter.post("/onboard", validationMiddleware(onboardUserInput), UserController.onboardUser)
//  todo: user routes
// employeeRouter.route("/me").get(EmployeeController.getMyDetails);
// employeeRouter
//   .route("/updateMe")
//   .patch(
//     upload.single("image"),
//     processImagesMiddleware,
//     validationMiddleware(updateMyDetails),
//     EmployeeController.updateMyDetails,
//   );

// employeeRouter.use(authMiddleware.restrictRote("admin"));

// employeeRouter
//   .route("/")
//   .get(EmployeeController.getAllEmployees)
//   .post(
//     upload.single("image"),
//     processImagesMiddleware,
//     validationMiddleware(employeeSchema),
//     EmployeeController.createEmployee,
//   );

// employeeRouter.route("/summary").get(EmployeeController.employeeSummary);
// employeeRouter
//   .route("/:id")
//   .get(EmployeeController.getEmployeeDetails)
//   .patch(EmployeeController.updateEmployee)
//   .delete(validationMiddleware(params), EmployeeController.deleteEmployee);
export default userRouter
