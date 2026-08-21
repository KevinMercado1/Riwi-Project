import { z } from 'zod';

export const createTeamLeaderSchema = z.object({
  name: z.string().min(3, 'name must have more than 3 characters'),

  surname: z.string().min(3, 'surname must have more than 3 characters'),

  numer_telefonu: z
    .string()
    .min(3, 'numer_telefonu must have more than 3 characters'),

  email: z.string().email('invalid email format'),

  password: z.string().min(8, 'password must have at least 8 characters'),

  role: z.enum(['coder', 'team_leader', 'admin']),

  clan: z.string().min(2, 'clan is required'),

  routeRiwi: z.enum(['basic', 'advanced']),
});
