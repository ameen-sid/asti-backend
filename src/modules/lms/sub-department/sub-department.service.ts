import { SubDepartment } from '@prisma/client';
import { ISubDepartmentRepository } from './sub-department.repository';
import { BadRequestError } from '../../../shared/utils/errors/app.error';

export interface ISubDepartmentService {
  addSubDepartment(name: string, departmentId: number): Promise<SubDepartment>;
  getSubDepartments(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<SubDepartment[]>;
  updateSubDepartment(id: number, name?: string, departmentId?: number): Promise<SubDepartment | null>;
  deleteSubDepartment(id: number): Promise<Boolean>;
}

export class SubDepartmentService implements ISubDepartmentService {

  private subDepartmentRepository: ISubDepartmentRepository;
  constructor(subDepartmentRepository: ISubDepartmentRepository) {
    this.subDepartmentRepository = subDepartmentRepository;
  }

  async addSubDepartment(name: string, departmentId: number): Promise<SubDepartment> {
    if (!name) throw new BadRequestError('Sub department name is required');
    return await this.subDepartmentRepository.addSubDepartment(name, departmentId);
  }

  async getSubDepartments(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<SubDepartment[]> {
    return await this.subDepartmentRepository.getSubDepartments(where, sortBy, sortOrder, skip, limit);
  }

  async updateSubDepartment(id: number, name?: string, departmentId?: number): Promise<SubDepartment | null> {
    if (name !== undefined && !name.trim()) throw new BadRequestError('Sub department name is required');
    return await this.subDepartmentRepository.updateSubDepartment(id, name, departmentId);
  }

  async deleteSubDepartment(id: number): Promise<Boolean> {
    return await this.subDepartmentRepository.deleteSubDepartment(id);
  }
}