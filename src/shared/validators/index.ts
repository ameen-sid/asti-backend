import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import logger from '../../config/logger.config';

/**
 * @param schema - zod schema to validate the request body
 * @returns - middleware function to validate the request body
 */
export const validateRequestBody = (schema: z.Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Validating request body');
      req.body = await schema.parseAsync(req.body);
      logger.info('Request body is valid');
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        logger.error('Request body is invalid', { issues: error.issues, body: req.body });
      } else {
        logger.error('Request body is invalid', { error, body: req.body });
      }
      res.status(400).json({
        success: false,
        message: 'Invalid request body',
        error: error,
      });
    }
  }
};

/**
 * @param schema - zod schema to validate the query params
 * @returns - middleware function to validate the query params
 */
export const validateQueryParams = (schema: z.Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Validating query params');
      await schema.parseAsync(req.query);
      logger.info('Query params are valid');
      next();
    } catch (error) {
      logger.error('Query params are invalid');
      res.status(400).json({
        success: false,
        message: 'Invalid query params',
        error: error,
      });
    }
  }
};

/**
 * @param schema - zod schema to validate the request params
 * @returns - middleware function to validate the request param
 */
export const validateRequestParams = (schema: z.Schema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Validating request params');
      await schema.parseAsync(req.params);
      logger.info('Request params are valid');
      next();
    } catch (error) {
      logger.error('Request params are invalid');
      res.status(400).json({
        success: false,
        message: 'Invalid request params',
        error: error,
      });
    }
  }
};