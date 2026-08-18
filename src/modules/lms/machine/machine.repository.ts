import { prisma } from '../../../config/prisma.config';
import { Machine } from '@prisma/client';

export interface IMachineRepository {
  addMachine(name: string, departmentId: number, subDepartment: number, sectionId: number, lineId: number): Promise<Machine>;
  getMachines(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Machine[]>;
  updateMachine(id: number, name?: string, departmentId?: number, subDepartment?: number, sectionId?: number, lineId?: number): Promise<Machine | null>;
  deleteMachine(id: number): Promise<Boolean>;
}

export class MachineRepository implements IMachineRepository {
  async addMachine(name: string, departmentId: number, subDepartment: number, sectionId: number, lineId: number): Promise<Machine> {
    return await prisma.machine.create({ data: { name, departmentId, subDepartment, sectionId, lineId } });
  }

  async getMachines(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Machine[]> {
    return await prisma.machine.findMany({
      includes: { department: true, subDepartment: true, section: true, line: true },
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    });
  }

  async updateMachine(id: number, name?: string, departmentId?: number, subDepartment?: number, sectionId?: number, lineId?: number): Promise<Machine | null> {
    return await prisma.machine.update({
      where: { id },
      data: { name, departmentId, subDepartment, sectionId, lineId }
    });
  }

  async deleteMachine(id: number): Promise<Boolean> {
    return await prisma.machine.delete({ where: { id } }) ? true : false;
  }
}