import { Request, Response, NextFunction } from 'express';
import logger from '../../../config/logger.config';
import { IMachineService } from './machine.service';

export class MachineController {

  private machineService: IMachineService;
  constructor(machineService: IMachineService) {
    this.machineService = machineService;
  }

  addMachine = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Creating Machine', { body: req.body });
    const newMachine = await this.machineService.addMachine(req.body.name, req.body.departmentId, req.body.subDepartmentId, req.body.sectionId, req.body.lineId);
    logger.info('Machine Created Successfully', { newMachine });
    res.status(201).json({
      success: true,
      message: 'Machine Created Successfully',
      data: newMachine,
    });
  }

  getMachines = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Fetching Machines', { query: req.query });
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

    const machines = await this.machineService.getMachines(where, sortBy, sortOrder, skip, limit);
    logger.info('Fetched Machines Successfully', { machines });
    res.status(200).json({
      success: true,
      message: 'Fetched Machines Successfully',
      data: machines,
    });
  }

  updateMachine = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Updating Machine', { body: req.body, id: req.params.id });
    const updatedMachine = await this.machineService.updateMachine(Number(req.params.id), req.body.name, req.body.departmentId, req.body.subDepartmentId, req.body.sectionId, req.body.lineId);
    logger.info('Updated Machine Successfully', { updatedMachine });
    res.status(200).json({
      success: true,
      message: 'Updated Machine Successfully',
      data: updatedMachine,
    });
  }

  deleteMachine = async (req: Request, res: Response, next: NextFunction) => {
    logger.info('Deleting Machine', { id: req.params.id });
    const deletedMachine = await this.machineService.deleteMachine(Number(req.params.id));
    logger.info('Deleted Machine Successfully', { deletedMachine });
    res.status(200).json({
      success: true,
      message: 'Deleted Machine Successfully',
      data: deletedMachine,
    });
  }
}