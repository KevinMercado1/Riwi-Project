import { z } from 'zod';

export const createTeamLeaderSchema = z.object({
  name: z
    .string({ message: 'name must be a string' })
    .min(3, 'name must have more than 3 characters'),

  surname: z
    .string({ message: 'surname must be a string' })
    .min(3, 'surname must have more than 3 characters'),

  numer_telefonu: z
    .string({ message: 'numer_telefonu must be a string' })
    .min(3, 'numer_telefonu must have more than 3 characters'),

  email: z
    .string({ message: 'email must be a string' })
    .email('invalid email format'),

  password: z
    .string({ message: 'password must be a string' })
    .min(8, 'password must have at least 8 characters'),

  roleId: z
    .string({ message: 'roleId must be a string' })
    .uuid('roleId must be a valid UUID'),

  routeRiwiId: z
    .string({ message: 'routeRiwiId must be a string' })
    .uuid('routeRiwiId must be a valid UUID'),

  clanId: z
    .string({ message: 'clanId must be a string' })
    .uuid('clanId must be a valid UUID'),
});
