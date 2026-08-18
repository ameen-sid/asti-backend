import { Section } from '@prisma/client';
import { ISectionRepository } from './section.repository';
import { BadRequestError } from '../../../shared/utils/errors/app.error';

export interface ISectionService {
  addSection(name: string, departmentId: number, subDepartmentId: number): Promise<Section>;
  getSections(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Section[]>;
  updateSection(id: number, name?: string, departmentId?: number, subDepartmentId?: number): Promise<Section | null>;
  deleteSection(id: number): Promise<boolean>;
}

export class SectionService implements ISectionService {

  private sectionRepository: ISectionRepository;
  constructor(sectionRepository: ISectionRepository) {
    this.sectionRepository = sectionRepository;
  }

  async addSection(name: string, departmentId: number, subDepartmentId: number): Promise<Section> {
    if (!name) throw new BadRequestError('Section name is required');
    return await this.sectionRepository.addSection(name, departmentId, subDepartmentId);
  }

  async getSections(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Section[]> {
    return await this.sectionRepository.getSections(where, sortBy, sortOrder, skip, limit);
  }

  async updateSection(id: number, name?: string, departmentId?: number, subDepartmentId?: number): Promise<Section | null> {
    if (name !== undefined && !name.trim()) throw new BadRequestError('Section name is required');
    return await this.sectionRepository.updateSection(id, name, departmentId, subDepartmentId);
  }

  async deleteSection(id: number): Promise<boolean> {
    return await this.sectionRepository.deleteSection(id);
  }
}