import { Machine } from '@prisma/client';
import { IMachineRepository } from './machine.repository';
import { BadRequestError } from '../../../shared/utils/errors/app.error';

export interface IMachineService {
  addMachine(name: string, departmentId: number, subDepartmentId: number, sectionId: number, lineId: number): Promise<Machine>;
  getMachines(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Machine[]>;
  updateMachine(id: number, name?: string, departmentId?: number, subDepartmentId?: number, sectionId?: number, lineId?: number): Promise<Machine | null>;
  deleteMachine(id: number): Promise<boolean>;
}

export class MachineService implements IMachineService {

  private machineRepository: IMachineRepository;
  constructor(machineRepository: IMachineRepository) {
    this.machineRepository = machineRepository;
  }

  async addMachine(name: string, departmentId: number, subDepartmentId: number, sectionId: number, lineId: number): Promise<Machine> {
    if (!name) throw new BadRequestError('Machine name is required');
    return await this.machineRepository.addMachine(name, departmentId, subDepartmentId, sectionId, lineId);
  }

  async getMachines(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Machine[]> {
    return await this.machineRepository.getMachines(where, sortBy, sortOrder, skip, limit);
  }

  async updateMachine(id: number, name?: string, departmentId?: number, subDepartmentId?: number, sectionId?: number, lineId?: number): Promise<Machine | null> {
    if (name !== undefined && !name.trim()) throw new BadRequestError('Machine name is required');
    return await this.machineRepository.updateMachine(id, name, departmentId, subDepartmentId, sectionId, lineId);
  }

  async deleteMachine(id: number): Promise<boolean> {
    return await this.machineRepository.deleteMachine(id);
  }
}