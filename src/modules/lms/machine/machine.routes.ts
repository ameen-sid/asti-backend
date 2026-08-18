import express from 'express';
import { MachineFactory } from './machine.factory';
import { createMachineSchema, updateMachineSchema, machineQuerySchema, machineIdParamSchema } from './machine.validator';
import { validateRequestBody, validateQueryParams, validateRequestParams } from '../../../shared/validators';
import { asyncHandler } from '../../../shared/utils/helpers/async.handler';

const machineRouter = express.Router();
const machineController = MachineFactory.getMachineController();

machineRouter.post(
  '/',
  validateRequestBody(createMachineSchema),
  asyncHandler(machineController.addMachine)
);

machineRouter.get(
  '/',
  validateQueryParams(machineQuerySchema),
  asyncHandler(machineController.getMachines)
);

machineRouter.patch(
  '/:id',
  validateRequestParams(machineIdParamSchema),
  validateRequestBody(updateMachineSchema),
  asyncHandler(machineController.updateMachine)
);

machineRouter.delete(
  '/:id',
  validateRequestParams(machineIdParamSchema),
  asyncHandler(machineController.deleteMachine)
);

export default machineRouter;