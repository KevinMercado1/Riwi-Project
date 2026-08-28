import { z } from 'zod';

export const createCodeSchema = z.object({
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

  identificationType: z.enum(['national_ID', 'foreigner_id', 'passport']),

  identificationNumber: z.string().min(1),

  address: z.string().min(5),

  cityName: z.string().min(2),

  role: z.literal('coder'),

  clan: z.string().min(2),

  routeRiwi: z.string().min(1, 'routeRiwi is required'),

  roomName: z.string().min(2),
});
