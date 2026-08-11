import { Router } from 'express';
import { authController } from './auth.controller';
import { authMiddleware } from './auth.middleware';
// only for custom auth routes
const authRouter: Router = Router();
authRouter.use(authMiddleware.protectedRoute, authMiddleware.tenant);
authRouter.get('/permissions', authController.getPermissions);
export default authRouter;
