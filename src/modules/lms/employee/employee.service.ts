import { Employee, Prisma } from '@prisma/client';
import * as xlsx from 'xlsx';
import { IEmployeeRepository } from './employee.repository';
import { BadRequestError, ConflictError, NotFoundError } from '../../../shared/utils/errors/app.error';

export interface IEmployeeService {
  addEmployee(data: Prisma.EmployeeUncheckedCreateInput): Promise<Employee>;
  getEmployees(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Employee[]>;
  getEmployeeById(id: number): Promise<Employee>;
  updateEmployee(id: number, data: Prisma.EmployeeUncheckedUpdateInput): Promise<Employee | null>;
  deleteEmployee(id: number): Promise<boolean>;
  uploadMultipleEmployeesExcel(buffer: Buffer): Promise<{ uploadedCount: number; message: string }>;
}

export class EmployeeService implements IEmployeeService {

  private employeeRepository: IEmployeeRepository;
  constructor(employeeRepository: IEmployeeRepository) {
    this.employeeRepository = employeeRepository;
  }

  private async validateReferences(departmentId: number, subDepartmentId?: number | null, sectionId?: number | null, lineId?: number | null, machineId?: number | null) {
    const department = await this.employeeRepository.findDepartment(departmentId);
    if (!department) throw new BadRequestError(`Department with ID ${departmentId} does not exist`);

    if (subDepartmentId) {
      const subDepartment = await this.employeeRepository.findSubDepartment(subDepartmentId, departmentId);
      if (!subDepartment) throw new BadRequestError(`SubDepartment with ID ${subDepartmentId} does not exist or does not belong to Department ${departmentId}`);
    }
    if (sectionId) {
      if (!subDepartmentId) throw new BadRequestError('SubDepartment is required when Section is provided');
      const section = await this.employeeRepository.findSection(sectionId, subDepartmentId);
      if (!section) throw new BadRequestError(`Section with ID ${sectionId} does not exist or does not belong to SubDepartment ${subDepartmentId}`);
    }
    if (lineId) {
      if (!sectionId) throw new BadRequestError('Section is required when Line is provided');
      const line = await this.employeeRepository.findLine(lineId, sectionId);
      if (!line) throw new BadRequestError(`Line with ID ${lineId} does not exist or does not belong to Section ${sectionId}`);
    }
    if (machineId) {
      if (!lineId) throw new BadRequestError('Line is required when Machine is provided');
      const machine = await this.employeeRepository.findMachine(machineId, lineId);
      if (!machine) throw new BadRequestError(`Machine with ID ${machineId} does not exist or does not belong to Line ${lineId}`);
    }
  }

  async addEmployee(data: Prisma.EmployeeUncheckedCreateInput): Promise<Employee> {
    if (!data.employeeId) throw new BadRequestError('Employee ID is required');
    if (!data.fullName) throw new BadRequestError('Employee full name is required');
    if (!data.departmentId) throw new BadRequestError('Department ID is required');

    const existing = await this.employeeRepository.getEmployeeByEmployeeId(data.employeeId);
    if (existing) throw new ConflictError(`Employee with ID '${data.employeeId}' already exists`);

    await this.validateReferences(data.departmentId, data.subDepartmentId, data.sectionId, data.lineId, data.machineId);
    return await this.employeeRepository.addEmployee(data);
  }

  async getEmployees(where: any, sortBy: string, sortOrder: string, skip: number, limit: number): Promise<Employee[]> {
    return await this.employeeRepository.getEmployees(where, sortBy, sortOrder, skip, limit);
  }

  async getEmployeeById(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.getEmployeeById(id);
    if (!employee) throw new NotFoundError(`Employee with ID ${id} not found`);
    return employee;
  }

  async updateEmployee(id: number, data: Prisma.EmployeeUncheckedUpdateInput): Promise<Employee | null> {
    const existing = await this.employeeRepository.getEmployeeById(id);
    if (!existing) throw new NotFoundError(`Employee with ID ${id} not found`);

    if (data.employeeId && data.employeeId !== existing.employeeId) {
      const duplicate = await this.employeeRepository.getEmployeeByEmployeeId(String(data.employeeId));
      if (duplicate) throw new ConflictError(`Employee with ID '${data.employeeId}' already exists`);
    }

    const deptId = (data.departmentId !== undefined ? Number(data.departmentId) : existing.departmentId);
    const subDeptId = (data.subDepartmentId !== undefined ? (data.subDepartmentId ? Number(data.subDepartmentId) : null) : existing.subDepartmentId);
    const secId = (data.sectionId !== undefined ? (data.sectionId ? Number(data.sectionId) : null) : existing.sectionId);
    const lId = (data.lineId !== undefined ? (data.lineId ? Number(data.lineId) : null) : existing.lineId);
    const mId = (data.machineId !== undefined ? (data.machineId ? Number(data.machineId) : null) : existing.machineId);

    if (data.departmentId !== undefined || data.subDepartmentId !== undefined || data.sectionId !== undefined || data.lineId !== undefined || data.machineId !== undefined) {
      await this.validateReferences(deptId, subDeptId, secId, lId, mId);
    }

    const updated = await this.employeeRepository.updateEmployee(id, data);
    if (!updated) throw new NotFoundError(`Employee with ID ${id} not found`);
    return updated;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    const existing = await this.employeeRepository.getEmployeeById(id);
    if (!existing) throw new NotFoundError(`Employee with ID ${id} not found`);
    return await this.employeeRepository.deleteEmployee(id);
  }

  private parseExcelDate(val: any, fieldName: string, rowNum: number): Date {
    if (!val) throw new Error(`Row ${rowNum}: ${fieldName} is required`);
    if (val instanceof Date && !isNaN(val.getTime())) return val;

    if (typeof val === 'number') {
      const date = xlsx.SSF.parse_date_code(val);
      if (date) return new Date(Date.UTC(date.y, date.m - 1, date.d, date.H || 0, date.M || 0, date.S || 0));
    }
    const parsed = new Date(val);
    if (isNaN(parsed.getTime())) throw new Error(`Row ${rowNum}: Invalid date format for ${fieldName} ('${val}')`);
    return parsed;
  }

  private parseOptionalExcelDate(val: any, fieldName: string, rowNum: number): Date | null {
    if (val === undefined || val === null || String(val).trim() === '') return null;
    return this.parseExcelDate(val, fieldName, rowNum);
  }

  private parseBoolean(val: any, defaultVal: boolean = false): boolean {
    if (val === undefined || val === null || String(val).trim() === '') return defaultVal;
    if (typeof val === 'boolean') return val;
    const s = String(val).trim().toLowerCase();
    return s === 'true' || s === 'yes' || s === '1';
  }

  async uploadMultipleEmployeesExcel(buffer: Buffer): Promise<{ uploadedCount: number; message: string }> {
    if (!buffer || buffer.length === 0) throw new BadRequestError('Excel file is empty or missing');

    let workbook: xlsx.WorkBook;
    try {
      workbook = xlsx.read(buffer, { type: 'buffer', cellDates: true });
    } catch {
      throw new BadRequestError('Failed to parse Excel file. Please provide a valid .xlsx or .xls file');
    }

    const firstSheetName = workbook.SheetNames[0];
    if (!firstSheetName) throw new BadRequestError('Excel file does not contain any sheets');

    const worksheet = workbook.Sheets[firstSheetName];
    const rawRows: Record<string, any>[] = xlsx.utils.sheet_to_json(worksheet, { defval: '' });

    if (!rawRows || rawRows.length === 0) throw new BadRequestError('Excel sheet has no data rows');

    const normalizeKey = (key: string) => key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const errors: string[] = [];
    const validEmployees: Prisma.EmployeeUncheckedCreateInput[] = [];
    const seenEmployeeIds = new Set<string>();

    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      const rowNum = i + 2;

      const normalizedRow: Record<string, any> = {};
      for (const [k, v] of Object.entries(row)) {
        normalizedRow[normalizeKey(k)] = v;
      }

      const getVal = (...keys: string[]) => {
        for (const k of keys) {
          const norm = normalizeKey(k);
          if (normalizedRow[norm] !== undefined && normalizedRow[norm] !== '') {
            return normalizedRow[norm];
          }
        }
        return '';
      };

      try {
        const empId = String(getVal('employeeid', 'empid', 'id', 'employee id')).trim();
        if (!empId) throw new Error(`Row ${rowNum}: Employee ID is required`);
        if (seenEmployeeIds.has(empId.toLowerCase())) throw new Error(`Row ${rowNum}: Duplicate Employee ID '${empId}' found within Excel file`);
        seenEmployeeIds.add(empId.toLowerCase());

        const existingEmp = await this.employeeRepository.getEmployeeByEmployeeId(empId);
        if (existingEmp) throw new Error(`Row ${rowNum}: Employee ID '${empId}' already exists in the database`);

        const fullName = String(getVal('fullname', 'name', 'full name')).trim();
        if (!fullName) throw new Error(`Row ${rowNum}: Full Name is required`);

        const fatherNameRaw = String(getVal('fathername', 'father name')).trim();
        const fatherName = fatherNameRaw || null;

        const rawDob = getVal('dob', 'dateofbirth', 'date of birth');
        const dob = this.parseExcelDate(rawDob, 'Date of Birth', rowNum);

        const rawGender = String(getVal('gender', 'sex')).trim();
        if (!['Male', 'Female'].includes(rawGender)) throw new Error(`Row ${rowNum}: Gender must be 'Male' or 'Female' (found: '${rawGender}')`);
        const gender = rawGender as 'Male' | 'Female';

        const designation = String(getVal('designation', 'role', 'title')).trim();
        if (!designation) throw new Error(`Row ${rowNum}: Designation is required`);

        const rawCategory = String(getVal('category')).trim();
        let category: string | null = null;
        if (rawCategory) {
          if (!['Staff', 'Worker'].includes(rawCategory)) throw new Error(`Row ${rowNum}: Category must be 'Staff' or 'Worker' (found: '${rawCategory}')`);
          category = rawCategory;
        }

        const deptRef = getVal('department', 'departmentid', 'dept');
        if (!deptRef) throw new Error(`Row ${rowNum}: Department is required`);
        const dept = await this.employeeRepository.findDepartment(deptRef);
        if (!dept) throw new Error(`Row ${rowNum}: Department '${deptRef}' not found in database`);

        const subDeptRef = getVal('subdepartment', 'subdepartmentid', 'subdept', 'sub department');
        let subDeptId: number | null = null;
        if (subDeptRef) {
          const subDept = await this.employeeRepository.findSubDepartment(subDeptRef, dept.id);
          if (!subDept) throw new Error(`Row ${rowNum}: Sub-Department '${subDeptRef}' not found under Department '${dept.name}'`);
          subDeptId = subDept.id;
        }

        const secRef = getVal('section', 'sectionid');
        let sectionId: number | null = null;
        if (secRef) {
          if (!subDeptId) throw new Error(`Row ${rowNum}: Sub-Department must be provided when Section is specified`);
          const sec = await this.employeeRepository.findSection(secRef, subDeptId);
          if (!sec) throw new Error(`Row ${rowNum}: Section '${secRef}' not found under specified Sub-Department`);
          sectionId = sec.id;
        }

        const lineRef = getVal('line', 'lineid');
        let lineId: number | null = null;
        if (lineRef) {
          if (!sectionId) throw new Error(`Row ${rowNum}: Section must be provided when Line is specified`);
          const line = await this.employeeRepository.findLine(lineRef, sectionId);
          if (!line) throw new Error(`Row ${rowNum}: Line '${lineRef}' not found under specified Section`);
          lineId = line.id;
        }

        const machineRef = getVal('machine', 'machineid');
        let machineId: number | null = null;
        if (machineRef) {
          if (!lineId) throw new Error(`Row ${rowNum}: Line must be provided when Machine is specified`);
          const machine = await this.employeeRepository.findMachine(machineRef, lineId);
          if (!machine) throw new Error(`Row ${rowNum}: Machine '${machineRef}' not found under specified Line`);
          machineId = machine.id;
        }

        const rawGrade = String(getVal('grade')).trim();
        if (!['Manufacturing Indirect', 'Direct', 'Indirect'].includes(rawGrade)) throw new Error(`Row ${rowNum}: Grade must be 'Manufacturing Indirect', 'Direct', or 'Indirect' (found: '${rawGrade}')`);

        const division = String(getVal('division')).trim();
        if (!division) throw new Error(`Row ${rowNum}: Division is required`);

        const address = String(getVal('address')).trim() || null;
        const state = String(getVal('state')).trim() || null;

        const rawPincode = getVal('pincode', 'pin');
        let pincode: number | null = null;
        if (rawPincode) {
          pincode = Number(rawPincode);
          if (isNaN(pincode)) throw new Error(`Row ${rowNum}: Pincode must be a valid number (found: '${rawPincode}')`);
        }

        const email = String(getVal('email', 'emailaddress', 'mail')).trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error(`Row ${rowNum}: Valid email address is required (found: '${email}')`);

        const mobile = String(getVal('mobile', 'phone', 'phonenumber', 'contact')).trim();
        if (!mobile || mobile.length < 7) throw new Error(`Row ${rowNum}: Mobile number is required and must be at least 7 digits (found: '${mobile}')`);

        const rawDoj = getVal('doj', 'dateofjoining', 'date of joining');
        const doj = this.parseExcelDate(rawDoj, 'Date of Joining', rowNum);

        const rawDol = getVal('dol', 'dateofleaving', 'date of leaving');
        const dol = this.parseOptionalExcelDate(rawDol, 'Date of Leaving', rowNum);

        const isActive = this.parseBoolean(getVal('isactive', 'active'), true);

        const rawFirstOfDay = getVal('firstofday', 'first of day');
        const firstOfDay = this.parseOptionalExcelDate(rawFirstOfDay, 'First of Day', rowNum);

        const unit = String(getVal('unit')).trim() || null;

        const rawShift = String(getVal('shift')).trim();
        if (!['A', 'B', 'C', 'General'].includes(rawShift)) throw new Error(`Row ${rowNum}: Shift must be 'A', 'B', 'C', or 'General' (found: '${rawShift}')`);

        const isDojo = this.parseBoolean(getVal('isdojo', 'dojo'), false);

        const rawSkill = String(getVal('skill', 'skilllevel')).trim().toUpperCase();
        if (!['L0', 'L1', 'L2', 'L3', 'L4', 'L5'].includes(rawSkill)) throw new Error(`Row ${rowNum}: Skill must be 'L0', 'L1', 'L2', 'L3', 'L4', or 'L5' (found: '${rawSkill}')`);

        validEmployees.push({
          employeeId: empId,
          fullName,
          fatherName,
          dob,
          gender,
          designation,
          category,
          departmentId: dept.id,
          subDepartmentId: subDeptId,
          sectionId: sectionId,
          lineId: lineId,
          machineId: machineId,
          grade: rawGrade,
          division,
          address,
          state,
          pincode,
          email,
          mobile,
          doj,
          dol,
          isActive,
          firstOfDay,
          unit,
          shift: rawShift,
          isDojo,
          skill: rawSkill
        });
      } catch (err: any) {
        errors.push(err.message || `Row ${rowNum}: Unknown validation error`);
      }
    }

    if (errors.length > 0) throw new BadRequestError(`Excel validation failed (${errors.length} error(s)). No records were uploaded:\n${errors.join('\n')}`);

    const uploadedCount = await this.employeeRepository.bulkAddEmployees(validEmployees);
    return { uploadedCount, message: `Successfully uploaded ${uploadedCount} employees` };
  }
}