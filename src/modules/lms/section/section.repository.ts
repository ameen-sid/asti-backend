import { prisma } from '../../../config/prisma.config';
import { Section } from '@prisma/client';

export interface ISectionRepository {
  addSection(name: string, departmentId: number, subDepartmentId: number): Promise<Section>;
  getSections(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Section[]>;
  updateSection(id: number, name?: string, departmentId?: number, subDepartmentId?: number): Promise<Section | null>;
  deleteSection(id: number): Promise<Boolean>;
}

export class SectionRepository implements ISectionRepository {
  async addSection(name: string, departmentId: number, subDepartmentId: number): Promise<Section> {
    return await prisma.section.create({ data: { name, departmentId, subDepartmentId } });
  }

  async getSections(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Section[]> {
    return await prisma.section.findMany({
      include: { department: true, subDepartment: true },
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    });
  }

  async updateSection(id: number, name?: string, departmentId?: number, subDepartmentId?: number): Promise<Section | null> {
    return await prisma.section.update({
      where: { id },
      data: { name, departmentId, subDepartmentId }
    });
  }

  async deleteSection(id: number): Promise<Boolean> {
    return await prisma.section.delete({ where: { id } }) ? true : false;
  }
}