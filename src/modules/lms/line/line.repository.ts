import { prisma } from '../../../config/prisma.config';
import { Line } from '@prisma/client';

export interface ILineRepository {
  addLine(name: string, departmentId: number, subDepartmentId: number, sectionId: number): Promise<Line>;
  getLines(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Line[]>;
  updateLine(id: number, name?: string, departmentId?: number, subDepartmentId?: number, sectionId?: number): Promise<Line | null>;
  deleteLine(id: number): Promise<boolean>;
}

export class LineRepository implements ILineRepository {
  async addLine(name: string, departmentId: number, subDepartmentId: number, sectionId: number): Promise<Line> {
    return await prisma.line.create({ data: { name, departmentId, subDepartmentId, sectionId } });
  }

  async getLines(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Line[]> {
    return await prisma.line.findMany({
      include: { department: true, subDepartment: true, section: true },
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    });
  }

  async updateLine(id: number, name?: string, departmentId?: number, subDepartmentId?: number, sectionId?: number): Promise<Line | null> {
    return await prisma.line.update({
      where: { id },
      data: { name, departmentId, subDepartmentId, sectionId }
    });
  }

  async deleteLine(id: number): Promise<boolean> {
    return await prisma.line.delete({ where: { id } }) ? true : false;
  }
}