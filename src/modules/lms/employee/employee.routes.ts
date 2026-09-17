import express from 'express';
import multer from 'multer';
import { EmployeeFactory } from './employee.factory';
import { createEmployeeSchema, updateEmployeeSchema, employeeQuerySchema, employeeIdParamSchema } from './employee.validator';
import { validateRequestBody, validateQueryParams, validateRequestParams } from '../../../shared/validators';
import { asyncHandler } from '../../../shared/utils/helpers/async.handler';

const employeeRouter = express.Router();
const employeeController = EmployeeFactory.getEmployeeController();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (allowedMimeTypes.includes(file.mimetype) || file.originalname.endsWith('.xlsx') || file.originalname.endsWith('.xls')) cb(null, true);
    else cb(new Error('Invalid file type. Only Excel files (.xlsx, .xls) are allowed'));
  }
});

employeeRouter.post(
  '/',
  validateRequestBody(createEmployeeSchema),
  asyncHandler(employeeController.addEmployee)
);

employeeRouter.get(
  '/',
  validateQueryParams(employeeQuerySchema),
  asyncHandler(employeeController.getEmployees)
);

employeeRouter.post(
  '/upload-excel',
  upload.single('file'),
  asyncHandler(employeeController.uploadMultipleEmployeesExcel)
);

employeeRouter.get(
  '/:id',
  validateRequestParams(employeeIdParamSchema),
  asyncHandler(employeeController.getEmployeeById)
);

employeeRouter.patch(
  '/:id',
  validateRequestParams(employeeIdParamSchema),
  validateRequestBody(updateEmployeeSchema),
  asyncHandler(employeeController.updateEmployee)
);

employeeRouter.delete(
  '/:id',
  validateRequestParams(employeeIdParamSchema),
  asyncHandler(employeeController.deleteEmployee)
);

export default employeeRouter;