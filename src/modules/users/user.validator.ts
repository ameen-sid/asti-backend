import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Portal name is required').trim(),
  email: z.string().email('Invalid email address').trim().toLowerCase(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['Admin', 'Super Admin', 'admin', 'super admin'], {
    message: "Role must be 'Admin' or 'Super Admin'"
  })
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Portal name cannot be empty').trim().optional(),
  email: z.string().email('Invalid email address').trim().toLowerCase().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
  role: z.enum(['Admin', 'Super Admin', 'admin', 'super admin'], {
    message: "Role must be 'Admin' or 'Super Admin'"
  }).optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided to update'
});

export const userQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  role: z.string().optional(),
  sortBy: z.enum(['id', 'name', 'email', 'role', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

export const userIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'User ID must be a numeric string')
});