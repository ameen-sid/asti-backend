import { Line } from '@prisma/client';
import { ILineRepository } from './line.repository';
import { BadRequestError } from '../../../shared/utils/errors/app.error';

export interface ILineService {
  addLine(name: string, departmentId: number, subDepartmentId: number, sectionId: number): Promise<Line>;
  getLines(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Line[]>;
  updateLine(id: number, name?: string, departmentId?: number, subDepartmentId?: number, sectionId?: number): Promise<Line | null>;
  deleteLine(id: number): Promise<boolean>;
}

export class LineService implements ILineService {

  private lineRepository: ILineRepository;
  constructor(lineRepository: ILineRepository) {
    this.lineRepository = lineRepository;
  }

  async addLine(name: string, departmentId: number, subDepartmentId: number, sectionId: number): Promise<Line> {
    if (!name) throw new BadRequestError('Line name is required');
    return await this.lineRepository.addLine(name, departmentId, subDepartmentId, sectionId);
  }

  async getLines(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Line[]> {
    return await this.lineRepository.getLines(where, sortBy, sortOrder, skip, limit);
  }

  async updateLine(id: number, name?: string, departmentId?: number, subDepartmentId?: number, sectionId?: number): Promise<Line | null> {
    if (name !== undefined && !name.trim()) throw new BadRequestError('Line name is required');
    return await this.lineRepository.updateLine(id, name, departmentId, subDepartmentId, sectionId);
  }

  async deleteLine(id: number): Promise<boolean> {
    return await this.lineRepository.deleteLine(id);
  }
}