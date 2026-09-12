import express from 'express';
import { UserFactory } from './user.factory';
import { createUserSchema, updateUserSchema, userQuerySchema, userIdParamSchema } from './user.validator';
import { validateRequestBody, validateQueryParams, validateRequestParams } from '../../shared/validators';
import { asyncHandler } from '../../shared/utils/helpers/async.handler';

const userRouter = express.Router();
const userController = UserFactory.getUserController();

userRouter.post(
  '/',
  validateRequestBody(createUserSchema),
  asyncHandler(userController.addUser)
);

userRouter.get(
  '/',
  validateQueryParams(userQuerySchema),
  asyncHandler(userController.getUsers)
);

userRouter.get(
  '/:id',
  validateRequestParams(userIdParamSchema),
  asyncHandler(userController.getUserById)
);

userRouter.patch(
  '/:id',
  validateRequestParams(userIdParamSchema),
  validateRequestBody(updateUserSchema),
  asyncHandler(userController.updateUser)
);

userRouter.delete(
  '/:id',
  validateRequestParams(userIdParamSchema),
  asyncHandler(userController.deleteUser)
);

export default userRouter;