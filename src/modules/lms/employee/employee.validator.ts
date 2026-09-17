import { z } from 'zod';

const dateStringSchema = z.union([
  z.date(),
  z.string().datetime({ message: 'Invalid ISO date string' }),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD').transform((val) => new Date(val))
]).transform((val) => new Date(val));

const optionalDateStringSchema = z.union([
  z.date(),
  z.string().datetime(),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/).transform((val) => new Date(val)),
  z.null(),
  z.undefined()
]).optional().nullable().transform((val) => (val ? new Date(val) : null));

export const createEmployeeSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required').trim(),
  fullName: z.string().min(1, 'Full name is required').trim(),
  fatherName: z.string().trim().optional().nullable(),
  dob: dateStringSchema,
  gender: z.enum(['Male', 'Female'], { message: "Gender must be 'Male' or 'Female'" }),
  designation: z.string().min(1, 'Designation is required').trim(),
  category: z.enum(['Staff', 'Worker']).optional().nullable(),
  departmentId: z.union([
    z.number().int().positive(),
    z.string().regex(/^\d+$/).transform(Number)
  ]),
  subDepartmentId: z.union([
    z.number().int().positive(),
    z.string().regex(/^\d+$/).transform(Number)
  ]).optional().nullable(),
  sectionId: z.union([
    z.number().int().positive(),
    z.string().regex(/^\d+$/).transform(Number)
  ]).optional().nullable(),
  lineId: z.union([
    z.number().int().positive(),
    z.string().regex(/^\d+$/).transform(Number)
  ]).optional().nullable(),
  machineId: z.union([
    z.number().int().positive(),
    z.string().regex(/^\d+$/).transform(Number)
  ]).optional().nullable(),
  grade: z.enum(['Manufacturing Indirect', 'Direct', 'Indirect'], {
    message: "Grade must be 'Manufacturing Indirect', 'Direct', or 'Indirect'"
  }),
  division: z.string().min(1, 'Division is required').trim(),
  address: z.string().trim().optional().nullable(),
  state: z.string().trim().optional().nullable(),
  pincode: z.union([
    z.number().int().positive(),
    z.string().regex(/^\d{5,8}$/).transform(Number)
  ]).optional().nullable(),
  email: z.string().email('Invalid email address').trim(),
  mobile: z.string().min(7, 'Mobile must be at least 7 characters').max(20).trim(),
  doj: dateStringSchema,
  dol: optionalDateStringSchema,
  isActive: z.union([
    z.boolean(),
    z.string().transform((val) => val.toLowerCase() === 'true' || val === '1')
  ]).default(true),
  firstOfDay: optionalDateStringSchema,
  unit: z.string().trim().optional().nullable(),
  shift: z.enum(['A', 'B', 'C', 'General'], {
    message: "Shift must be 'A', 'B', 'C', or 'General'"
  }),
  isDojo: z.union([
    z.boolean(),
    z.string().transform((val) => val.toLowerCase() === 'true' || val === '1')
  ]).default(false),
  skill: z.enum(['L0', 'L1', 'L2', 'L3', 'L4', 'L5'], {
    message: "Skill must be 'L0', 'L1', 'L2', 'L3', 'L4', or 'L5'"
  })
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const employeeQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  departmentId: z.string().optional(),
  subDepartmentId: z.string().optional(),
  sectionId: z.string().optional(),
  lineId: z.string().optional(),
  machineId: z.string().optional(),
  shift: z.string().optional(),
  unit: z.string().optional(),
  gender: z.string().optional(),
  grade: z.string().optional(),
  skill: z.string().optional(),
  isActive: z.string().optional(),
  sortBy: z.enum(['id', 'employeeId', 'fullName', 'dob', 'doj', 'departmentId', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export const employeeIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Employee ID must be a numeric string')
});