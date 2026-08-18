import { z } from 'zod';

export const createSubDepartmentSchema = z.object({
  name: z.string().min(1, 'Sub department name cannot be empty').trim(),
  departmentId: z.union([
    z.number().int().positive(),
    z.string().regex(/^\d+$/).transform(Number)
  ])
});

export const updateSubDepartmentSchema = createSubDepartmentSchema.partial();

export const subDepartmentQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['id', 'name', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export const subDepartmentIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Sub department ID must be a numeric string')
});