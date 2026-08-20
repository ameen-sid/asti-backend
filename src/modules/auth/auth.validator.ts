import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format').trim(),
  password: z.string().min(1, 'Password cannot be empty')
});