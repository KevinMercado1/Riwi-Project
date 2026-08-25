import { z } from 'zod';

export const createRoomSchema = z.object({
  name: z
    .string({ message: 'name must be a string' })
    .min(1, 'name is required'),

  capacity: z
    .number({ message: 'capacity must be a number' })
    .int('capacity must be an integer')
    .positive('capacity must be greater than 0'),
});
