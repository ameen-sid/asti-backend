import { z } from 'zod';

export const createMachineSchema = z.object({
  name: z.string().min(1, 'Machine name cannot be empty').trim(),
  departmentId: z.union([
    z.number().int().positive(),
    z.string().regex(/^\d+$/).transform(Number)
  ]),
  subDepartmentId: z.union([
    z.number().int().positive(),
    z.string().regex(/^\d+$/).transform(Number)
  ]),
  sectionId: z.union([
    z.number().int().positive(),
    z.string().regex(/^\d+$/).transform(Number)
  ]),
  lineId: z.union([
    z.number().int().positive(),
    z.string().regex(/^\d+$/).transform(Number)
  ])
});

export const updateMachineSchema = createMachineSchema.partial();

export const machineQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['id', 'name', 'departmentId', 'subDepartmentId', 'sectionId', 'lineId', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export const machineIdParamSchema = z.object({
	id: z.string().regex(/^\d+$/, 'Machine ID must be a numeric string')
});