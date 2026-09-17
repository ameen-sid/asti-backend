import { prisma } from '../../../config/prisma.config';
import { Employee, Prisma } from '@prisma/client';

export interface IEmployeeRepository {
  addEmployee(data: Prisma.EmployeeUncheckedCreateInput): Promise<Employee>;
  getEmployees(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Employee[]>;
  getEmployeeById(id: number): Promise<Employee | null>;
  getEmployeeByEmployeeId(employeeId: string): Promise<Employee | null>;
  updateEmployee(id: number, data: Prisma.EmployeeUncheckedUpdateInput): Promise<Employee | null>;
  deleteEmployee(id: number): Promise<boolean>;
  bulkAddEmployees(dataList: Prisma.EmployeeUncheckedCreateInput[]): Promise<number>;
  findDepartment(idOrName: number | string): Promise<{ id: number; name: string } | null>;
  findSubDepartment(idOrName: number | string, departmentId?: number): Promise<{ id: number; name: string; departmentId: number | null } | null>;
  findSection(idOrName: number | string, subDepartmentId?: number): Promise<{ id: number; name: string; departmentId: number | null; subDepartmentId: number | null } | null>;
  findLine(idOrName: number | string, sectionId?: number): Promise<{ id: number; name: string; sectionId: number | null } | null>;
  findMachine(idOrName: number | string, lineId?: number): Promise<{ id: number; name: string; lineId: number | null } | null>;
}

export class EmployeeRepository implements IEmployeeRepository {
  async addEmployee(data: Prisma.EmployeeUncheckedCreateInput): Promise<Employee> {
    return await prisma.employee.create({ data, include: { department: true, subDepartment: true, section: true, line: true, machine: true } });
  }

  async getEmployees(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Employee[]> {
    return await prisma.employee.findMany({
      include: { department: true, subDepartment: true, section: true, line: true, machine: true },
      where,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit
    });
  }

  async getEmployeeById(id: number): Promise<Employee | null> {
    return await prisma.employee.findUnique({ where: { id }, include: { department: true, subDepartment: true, section: true, line: true, machine: true } });
  }

  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | null> {
    return await prisma.employee.findUnique({ where: { employeeId }, include: { department: true, subDepartment: true, section: true, line: true, machine: true } });
  }

  async updateEmployee(id: number, data: Prisma.EmployeeUncheckedUpdateInput): Promise<Employee | null> {
    return await prisma.employee.update({ where: { id }, data, include: { department: true, subDepartment: true, section: true, line: true, machine: true } });
  }

  async deleteEmployee(id: number): Promise<boolean> {
    return await prisma.employee.delete({ where: { id } }) ? true : false;
  }

  async bulkAddEmployees(dataList: Prisma.EmployeeUncheckedCreateInput[]): Promise<number> {
    return await prisma.$transaction(async (tx) => {
      let createdCount = 0;
      for (const item of dataList) {
        await tx.employee.create({ data: item });
        createdCount++;
      }
      return createdCount;
    });
  }

  async findDepartment(idOrName: number | string): Promise<{ id: number; name: string } | null> {
    if (typeof idOrName === 'number' || /^\d+$/.test(String(idOrName))) {
      return await prisma.department.findUnique({ where: { id: Number(idOrName) }, select: { id: true, name: true } });
    }
    return await prisma.department.findFirst({ where: { name: String(idOrName).trim() }, select: { id: true, name: true } });
  }

  async findSubDepartment(idOrName: number | string, departmentId?: number): Promise<{ id: number; name: string; departmentId: number | null } | null> {
    if (typeof idOrName === 'number' || /^\d+$/.test(String(idOrName))) {
      const where: Prisma.SubDepartmentWhereInput = { id: Number(idOrName) };
      if (departmentId !== undefined) where.departmentId = departmentId;
      return await prisma.subDepartment.findFirst({ where, select: { id: true, name: true, departmentId: true } });
    }
    const where: Prisma.SubDepartmentWhereInput = { name: String(idOrName).trim() };
    if (departmentId !== undefined) where.departmentId = departmentId;
    return await prisma.subDepartment.findFirst({ where, select: { id: true, name: true, departmentId: true } });
  }

  async findSection(idOrName: number | string, subDepartmentId?: number): Promise<{ id: number; name: string; departmentId: number | null; subDepartmentId: number | null } | null> {
    if (typeof idOrName === 'number' || /^\d+$/.test(String(idOrName))) {
      const where: Prisma.SectionWhereInput = { id: Number(idOrName) };
      if (subDepartmentId !== undefined) where.subDepartmentId = subDepartmentId;
      return await prisma.section.findFirst({ where, select: { id: true, name: true, departmentId: true, subDepartmentId: true } });
    }
    const where: Prisma.SectionWhereInput = { name: String(idOrName).trim() };
    if (subDepartmentId !== undefined) where.subDepartmentId = subDepartmentId;
    return await prisma.section.findFirst({ where, select: { id: true, name: true, departmentId: true, subDepartmentId: true } });
  }

  async findLine(idOrName: number | string, sectionId?: number): Promise<{ id: number; name: string; sectionId: number | null } | null> {
    if (typeof idOrName === 'number' || /^\d+$/.test(String(idOrName))) {
      const where: Prisma.LineWhereInput = { id: Number(idOrName) };
      if (sectionId !== undefined) where.sectionId = sectionId;
      return await prisma.line.findFirst({ where, select: { id: true, name: true, sectionId: true } });
    }
    const where: Prisma.LineWhereInput = { name: String(idOrName).trim() };
    if (sectionId !== undefined) where.sectionId = sectionId;
    return await prisma.line.findFirst({ where, select: { id: true, name: true, sectionId: true } });
  }

  async findMachine(idOrName: number | string, lineId?: number): Promise<{ id: number; name: string; lineId: number | null } | null> {
    if (typeof idOrName === 'number' || /^\d+$/.test(String(idOrName))) {
      const where: Prisma.MachineWhereInput = { id: Number(idOrName) };
      if (lineId !== undefined) where.lineId = lineId;
      return await prisma.machine.findFirst({ where, select: { id: true, name: true, lineId: true } });
    }
    const where: Prisma.MachineWhereInput = { name: String(idOrName).trim() };
    if (lineId !== undefined) where.lineId = lineId;
    return await prisma.machine.findFirst({ where, select: { id: true, name: true, lineId: true } });
  }
}