import { z } from 'zod';

export const createAddressSchema = z.object({
  address: z.string().min(5, 'Address is required'),
  cityId: z.string().uuid('Invalid city ID'),
});
