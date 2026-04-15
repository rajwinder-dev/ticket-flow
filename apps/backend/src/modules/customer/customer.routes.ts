import { createCustomerInput, updateCustomerInput } from "@repo/schemas";
import { Router } from "express";
import { validationMiddleware } from "../../core/middleware/validationMiddleware.js";
import { authMiddleware } from "../auth/auth.middleware.js";
import { CustomerController } from "./customer.controller.js";

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
