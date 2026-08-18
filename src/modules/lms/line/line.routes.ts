import express from 'express';
import { LineFactory } from './line.factory';
import { createLineSchema, updateLineSchema, lineQuerySchema, lineIdParamSchema } from './line.validator';
import { validateRequestBody, validateQueryParams, validateRequestParams } from '../../../shared/validators';
import { asyncHandler } from '../../../shared/utils/helpers/async.handler';

const lineRouter = express.Router();
const lineController = LineFactory.getLineController();

lineRouter.post(
  '/',
  validateRequestBody(createLineSchema),
  asyncHandler(lineController.addLine)
);

lineRouter.get(
  '/',
  validateQueryParams(lineQuerySchema),
  asyncHandler(lineController.getLines)
);

lineRouter.patch(
  '/:id',
  validateRequestParams(lineIdParamSchema),
  validateRequestBody(updateLineSchema),
  asyncHandler(lineController.updateLine)
);

lineRouter.delete(
  '/:id',
  validateRequestParams(lineIdParamSchema),
  asyncHandler(lineController.deleteLine)
);

export default lineRouter;