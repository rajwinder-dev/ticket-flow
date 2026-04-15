import { createCustomerInput, updateCustomerInput } from "@repo/schemas";
import { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { CustomerController } from "./customer.controller.js";

const customerRoutes = Router();
customerRoutes.use(authMiddleware.protectedRoute, authMiddleware.tenant);
customerRoutes.get(
  "/",
  authMiddleware.verifyPermission("customer", "view_all"),
  CustomerController.getAllCustomers,
);
customerRoutes.post(
  "/",
  authMiddleware.verifyPermission("customer", "create"),
  validationMiddleware(createCustomerInput),
  CustomerController.createCustomer,
);
customerRoutes.patch(
  "/:id",
  authMiddleware.verifyPermission("customer", "edit"),
  validationMiddleware(updateCustomerInput),
  CustomerController.updateCustomer,
);
export default customerRoutes;
