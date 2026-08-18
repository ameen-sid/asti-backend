import express from 'express';
import { DepartmentFactory } from './department.factory';
import { createDepartmentSchema, updateDepartmentSchema, departmentQuerySchema, departmentIdParamSchema } from './department.validator';
import { validateRequestBody, validateQueryParams, validateRequestParams } from '../../../shared/validators';
import { asyncHandler } from '../../../shared/utils/helpers/async.handler';

const departmentRouter = express.Router();
const departmentController = DepartmentFactory.getDepartmentController();

departmentRouter.post(
  '/',
  validateRequestBody(createDepartmentSchema),
  asyncHandler(departmentController.addDepartment)
);

departmentRouter.get(
  '/',
  validateQueryParams(departmentQuerySchema),
  asyncHandler(departmentController.getDepartments)
);

departmentRouter.patch(
  '/:id',
  validateRequestParams(departmentIdParamSchema),
  validateRequestBody(updateDepartmentSchema),
  asyncHandler(departmentController.updateDepartment)
);

departmentRouter.delete(
  '/:id',
  validateRequestParams(departmentIdParamSchema),
  asyncHandler(departmentController.deleteDepartment)
);

export default departmentRouter;