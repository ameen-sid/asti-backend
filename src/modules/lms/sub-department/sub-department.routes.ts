import express from 'express';
import { SubDepartmentFactory } from './sub-department.factory';
import { createSubDepartmentSchema, updateSubDepartmentSchema, subDepartmentQuerySchema, subDepartmentIdParamSchema } from './sub-department.validator';
import { validateRequestBody, validateQueryParams, validateRequestParams } from '../../../shared/validators';
import { asyncHandler } from '../../../shared/utils/helpers/async.handler';

const subDepartmentRouter = express.Router();
const subDepartmentController = SubDepartmentFactory.getSubDepartmentController();

subDepartmentRouter.post(
  '/',
  validateRequestBody(createSubDepartmentSchema),
  asyncHandler(subDepartmentController.addSubDepartment)
);

subDepartmentRouter.get(
  '/',
  validateQueryParams(subDepartmentQuerySchema),
  asyncHandler(subDepartmentController.getSubDepartments)
);

subDepartmentRouter.patch(
  '/:id',
  validateRequestParams(subDepartmentIdParamSchema),
  validateRequestBody(updateSubDepartmentSchema),
  asyncHandler(subDepartmentController.updateSubDepartment)
);

subDepartmentRouter.delete(
  '/:id',
  validateRequestParams(subDepartmentIdParamSchema),
  asyncHandler(subDepartmentController.deleteSubDepartment)
);

export default subDepartmentRouter;