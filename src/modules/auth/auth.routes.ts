import express from 'express';
import { AuthFactory } from './auth.factory';
import { loginSchema } from './auth.validator';
import { validateRequestBody } from '../../shared/validators';
import { asyncHandler } from '../../shared/utils/helpers/async.handler';
import { authenticateToken } from '../../middleware/auth.middleware';

const authRouter = express.Router();
const authController = AuthFactory.getAuthController();

authRouter.post(
  '/login',
  validateRequestBody(loginSchema),
  asyncHandler(authController.login)
);

authRouter.post(
  '/logout',
  authenticateToken,
  asyncHandler(authController.logout)
);

export default authRouter;