import { Request, Response, NextFunction } from 'express';
import logger from '../../../config/logger.config';
import { ISubDepartmentService } from './sub-department.service';

export class SubDepartmentController {

  private subDepartmentService: ISubDepartmentService;
  constructor(subDepartmentService: ISubDepartmentService) {
    this.subDepartmentService = subDepartmentService;
  }

  addSubDepartment = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Creating Sub-Department', { body: req.body });
    const newSubDepartment = await this.subDepartmentService.addSubDepartment(req.body.name, req.body.departmentId);
    logger.info('Sub-Department Created Successfully', { subDepartment: newSubDepartment });
    res.status(201).json({
      success: true,
      message: 'Sub-Department Created Successfully',
      data: newSubDepartment,
    });
  }

  getSubDepartments = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Fetching Sub-Departments', { query: req.query });
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

    const subDepartments = await this.subDepartmentService.getSubDepartments(where, sortBy, sortOrder, skip, limit);
    logger.info('Fetched Sub-Departments Successfully', { subDepartments });
    res.status(200).json({
      success: true,
      message: 'Fetched Sub-Departments Successfully',
      data: subDepartments,
    });
  }

  updateSubDepartment = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Updating Sub-Department', { body: req.body, id: req.params.id });
    const updatedSubDepartment = await this.subDepartmentService.updateSubDepartment(Number(req.params.id), req.body.name, req.body.departmentId);
    logger.info('Updated Sub-Department Successfully', { updatedSubDepartment });
    res.status(200).json({
      success: true,
      message: 'Updated Sub-Department Successfully',
      data: updatedSubDepartment,
    });
  }

  deleteSubDepartment = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Deleting Sub-Department', { id: req.params.id });
    const deletedSubDepartment = await this.subDepartmentService.deleteSubDepartment(Number(req.params.id));
    logger.info('Deleted Sub-Department Successfully', { deletedSubDepartment });
    res.status(200).json({
      success: true,
      message: 'Deleted Sub-Department Successfully',
      data: deletedSubDepartment,
    });
  }
}