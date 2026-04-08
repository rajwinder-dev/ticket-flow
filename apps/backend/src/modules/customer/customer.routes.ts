import { createCustomerInput, updateCustomerInput } from "@repo/schemas";
import { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { authMiddleware } from "../auth/auth.middleware";
import { CustomerController } from "./customer.controller";

const customerRoutes = Router();
customerRoutes.use(authMiddleware.protectedRoute, authMiddleware.tenant);
customerRoutes.get("/", CustomerController.getAllCustomers);
customerRoutes.post(
  "/",
  validationMiddleware(createCustomerInput),
  CustomerController.createCustomer,
);
customerRoutes.patch(
  "/:id",
  validationMiddleware(updateCustomerInput),
  CustomerController.updateCustomer,
);
export default customerRoutes;
