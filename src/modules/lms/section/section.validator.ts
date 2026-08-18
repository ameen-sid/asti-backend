import { z } from 'zod';

export const createSectionSchema = z.object({
  name: z.string().min(1, 'Section name cannot be empty').trim(),
  departmentId: z.union([
    z.number().int().positive(),
    z.string().regex(/^\d+$/).transform(Number)
  ]),
  subDepartmentId: z.union([
    z.number().int().positive(),
    z.string().regex(/^\d+$/).transform(Number)
  ])
});

export const updateSectionSchema = createSectionSchema.partial();

export const sectionQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['id', 'name', 'departmentId', 'subDepartmentId', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export const sectionIdParamSchema = z.object({
	id: z.string().regex(/^\d+$/, 'Section ID must be a numeric string')
});