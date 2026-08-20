import { z } from 'zod';

export const loginCoderSchema = z.object({
  email: z
    .string({ message: 'email must be a string' })
    .email('invalid email format'),

  password: z
    .string({ message: 'password must be a string' })
    .min(1, 'password is required'),
});
