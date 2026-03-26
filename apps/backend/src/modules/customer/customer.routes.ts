import { Router } from "express";
import { CustomerController } from "./customer.controller";
import { authMiddleware } from "../auth/auth.middleware";
import { validationMiddleware } from "../../core/middleware/validationMiddleware";
import { crateCustomerInput, updateCustomerInput } from "@repo/schemas";

const customerRoutes = Router();
customerRoutes.use(authMiddleware.protectedRoute, authMiddleware.tenant);
customerRoutes.get("/", CustomerController.getAllCustomers);
customerRoutes.post("/",validationMiddleware(crateCustomerInput), CustomerController.createCustomer);
customerRoutes.patch("/:id",validationMiddleware(updateCustomerInput), CustomerController.updateCustomer);
export default customerRoutes;
