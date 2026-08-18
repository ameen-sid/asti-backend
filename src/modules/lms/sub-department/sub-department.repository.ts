import { prisma } from '../../../config/prisma.config';
import { SubDepartment } from '@prisma/client';

export interface ISubDepartmentRepository {
  addSubDepartment(name: string, departmentId: number): Promise<SubDepartment>;
  getSubDepartments(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<SubDepartment[]>;
  updateSubDepartment(id: number, name?: string, departmentId?: number): Promise<SubDepartment | null>;
  deleteSubDepartment(id: number): Promise<Boolean>;
}

export class SubDepartmentRepository implements ISubDepartmentRepository {
  async addSubDepartment(name: string, departmentId: number): Promise<SubDepartment> {
    return await prisma.subDepartment.create({ data: { name, departmentId } });
  }

  async getSubDepartments(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<SubDepartment[]> {
    return await prisma.subDepartment.findMany({
      include: { department: true },
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    });
  }

  async updateSubDepartment(id: number, name?: string, departmentId?: number): Promise<SubDepartment | null> {
    return await prisma.subDepartment.update({
      where: { id },
      data: { name, departmentId }
    });
  }

  async deleteSubDepartment(id: number): Promise<Boolean> {
    return await prisma.subDepartment.delete({ where: { id } }) ? true : false;
  }
}