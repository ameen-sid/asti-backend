import express from 'express';
import { SectionFactory } from './section.factory';
import { createSectionSchema, updateSectionSchema, sectionQuerySchema, sectionIdParamSchema } from './section.validator';
import { validateRequestBody, validateQueryParams, validateRequestParams } from '../../../shared/validators';
import { asyncHandler } from '../../../shared/utils/helpers/async.handler';

const sectionRouter = express.Router();
const sectionController = SectionFactory.getSectionController();

sectionRouter.post(
  '/',
  validateRequestBody(createSectionSchema),
  asyncHandler(sectionController.addSection)
);

sectionRouter.get(
  '/',
  validateQueryParams(sectionQuerySchema),
  asyncHandler(sectionController.getSections)
);

sectionRouter.patch(
  '/:id',
  validateRequestParams(sectionIdParamSchema),
  validateRequestBody(updateSectionSchema),
  asyncHandler(sectionController.updateSection)
);

sectionRouter.delete(
  '/:id',
  validateRequestParams(sectionIdParamSchema),
  asyncHandler(sectionController.deleteSection)
);

export default sectionRouter;