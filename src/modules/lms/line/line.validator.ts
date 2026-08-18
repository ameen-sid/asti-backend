import { z } from 'zod';

export const createLineSchema = z.object({
  name: z.string().min(1, 'Line name cannot be empty').trim(),
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
  ])
});

export const updateLineSchema = createLineSchema.partial();

export const lineQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['id', 'name', 'departmentId', 'subDepartmentId', 'sectionId', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export const lineIdParamSchema = z.object({
	id: z.string().regex(/^\d+$/, 'Line ID must be a numeric string')
});