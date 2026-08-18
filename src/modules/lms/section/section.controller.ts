import { Request, Response, NextFunction } from 'express';
import logger from '../../../config/logger.config';
import { ISectionService } from './section.service';

export class SectionController {

  private sectionService: ISectionService;
  constructor(sectionService: ISectionService) {
    this.sectionService = sectionService;
  }

  addSection = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Creating Section', { body: req.body });
    const newSection = await this.sectionService.addSection(req.body.name, req.body.departmentId, req.body.subDepartmentId);
    logger.info('Section Created Successfully', { newSection });
    res.status(201).json({
      success: true,
      message: 'Section Created Successfully',
      data: newSection,
    });
  }

  getSections = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Fetching Sections', { query: req.query });
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

    const sections = await this.sectionService.getSections(where, sortBy, sortOrder, skip, limit);
    logger.info('Fetched Sections Successfully', { sections });
    res.status(200).json({
      success: true,
      message: 'Fetched Sections Successfully',
      data: sections,
    });
  }

  updateSection = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Updating Section', { body: req.body, id: req.params.id });
    const updatedSection = await this.sectionService.updateSection(Number(req.params.id), req.body.name, req.body.departmentId, req.body.subDepartmentId);
    logger.info('Updated Section Successfully', { updatedSection });
    res.status(200).json({
      success: true,
      message: 'Updated Section Successfully',
      data: updatedSection,
    });
  }

  deleteSection = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Deleting Section', { id: req.params.id });
    const deletedSection = await this.sectionService.deleteSection(Number(req.params.id));
    logger.info('Deleted Section Successfully', { deletedSection });
    res.status(200).json({
      success: true,
      message: 'Deleted Section Successfully',
      data: deletedSection,
    });
  }
}