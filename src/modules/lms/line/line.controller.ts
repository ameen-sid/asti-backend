import { Request, Response, NextFunction } from 'express';
import logger from '../../../config/logger.config';
import { ILineService } from './line.service';

export class LineController {

  private lineService: ILineService;
  constructor(lineService: ILineService) {
    this.lineService = lineService;
  }

  addLine = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Creating Line', { body: req.body });
    const newLine = await this.lineService.addLine(req.body.name, req.body.departmentId, req.body.subDepartmentId, req.body.sectionId);
    logger.info('Line Created Successfully', { newLine });
    res.status(201).json({
      success: true,
      message: 'Line Created Successfully',
      data: newLine,
    });
  }

  getLines = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Fetching Lines', { query: req.query });
    const page = Math.max(1, parseInt(req.query.page as string || '1'));
    const limit = Math.max(1, parseInt(req.query.limit as string || '1000'));
    const search = (req.query.search as string || '').trim();
    const sortBy = (req.query.sortBy as string || 'createdAt');
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';

    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.name = { contains: search };
    }

    const lines = await this.lineService.getLines(where, sortBy, sortOrder, skip, limit);
    logger.info('Fetched Lines Successfully', { lines });
    res.status(200).json({
      success: true,
      message: 'Fetched Lines Successfully',
      data: lines,
    });
  }

  updateLine = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Updating Line', { body: req.body, id: req.params.id });
    const updatedLine = await this.lineService.updateLine(Number(req.params.id), req.body.name, req.body.departmentId, req.body.subDepartmentId, req.body.sectionId);
    logger.info('Updated Line Successfully', { updatedLine });
    res.status(200).json({
      success: true,
      message: 'Updated Line Successfully',
      data: updatedLine,
    });
  }

  deleteLine = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Deleting Line', { id: req.params.id });
    const deletedLine = await this.lineService.deleteLine(Number(req.params.id));
    logger.info('Deleted Line Successfully', { deletedLine });
    res.status(200).json({
      success: true,
      message: 'Deleted Line Successfully',
      data: deletedLine,
    });
  }
}