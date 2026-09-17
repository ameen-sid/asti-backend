import { Request, Response, NextFunction } from 'express';
import logger from '../../../config/logger.config';
import { IEmployeeService } from './employee.service';
import { BadRequestError } from '../../../shared/utils/errors/app.error';

export class EmployeeController {

  private employeeService: IEmployeeService;
  constructor(employeeService: IEmployeeService) {
    this.employeeService = employeeService;
  }

  addEmployee = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Creating Employee', { body: req.body });
    const newEmployee = await this.employeeService.addEmployee(req.body);
    logger.info('Employee Created Successfully', { employee: newEmployee });
    res.status(201).json({
      success: true,
      message: 'Employee Created Successfully',
      data: newEmployee,
    });
  }

  getEmployees = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Fetching Employees', { query: req.query });
    const page = Math.max(1, parseInt(req.query.page as string || '1'));
    const limit = Math.max(1, parseInt(req.query.limit as string || '1000'));
    const search = (req.query.search as string || '').trim();
    const sortBy = (req.query.sortBy as string || 'createdAt');
    const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';

    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { employeeId: { contains: search } },
        { fullName: { contains: search } },
        { email: { contains: search } },
        { mobile: { contains: search } },
        { designation: { contains: search } }
      ];
    }

    if (req.query.departmentId) where.departmentId = Number(req.query.departmentId);
    if (req.query.subDepartmentId) where.subDepartmentId = Number(req.query.subDepartmentId);
    if (req.query.sectionId) where.sectionId = Number(req.query.sectionId);
    if (req.query.lineId) where.lineId = Number(req.query.lineId);
    if (req.query.machineId) where.machineId = Number(req.query.machineId);
    if (req.query.shift) where.shift = req.query.shift as string;
    if (req.query.unit) where.unit = req.query.unit as string;
    if (req.query.gender) where.gender = req.query.gender as string;
    if (req.query.grade) where.grade = req.query.grade as string;
    if (req.query.skill) where.skill = req.query.skill as string;
    if (req.query.isActive !== undefined) where.isActive = req.query.isActive === 'true' || req.query.isActive === '1';

    const employees = await this.employeeService.getEmployees(where, sortBy, sortOrder, skip, limit);
    logger.info('Fetched Employees Successfully', { employees });
    res.status(200).json({
      success: true,
      message: 'Fetched Employees Successfully',
      data: employees,
    });
  }

  getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Fetching Employee by ID', { id: req.params.id });
    const employee = await this.employeeService.getEmployeeById(Number(req.params.id));
    logger.info('Fetched Employee Successfully', { employee });
    res.status(200).json({
      success: true,
      message: 'Fetched Employee Successfully',
      data: employee,
    });
  }

  updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Updating Employee', { body: req.body, id: req.params.id });
    const updatedEmployee = await this.employeeService.updateEmployee(Number(req.params.id), req.body);
    logger.info('Updated Employee Successfully', { employee: updatedEmployee });
    res.status(200).json({
      success: true,
      message: 'Updated Employee Successfully',
      data: updatedEmployee,
    });
  }

  deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Deleting Employee', { id: req.params.id });
    const deletedEmployee = await this.employeeService.deleteEmployee(Number(req.params.id));
    logger.info('Deleted Employee Successfully', { data: deletedEmployee });
    res.status(200).json({
      success: true,
      message: 'Deleted Employee Successfully',
      data: deletedEmployee,
    });
  }

  uploadMultipleEmployeesExcel = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Uploading Employees via Excel');
    if (!req.file) throw new BadRequestError('Excel file is required. Key name must be "file"');
    const result = await this.employeeService.uploadMultipleEmployeesExcel(req.file.buffer);
    logger.info('Excel Upload Completed', result);
    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        uploadedCount: result.uploadedCount
      }
    });
  }
}