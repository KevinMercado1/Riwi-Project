import { z } from 'zod';

export const createIdentificationSchema = z.object({
  type: z.enum(['national_ID', 'foreigner_id', 'passport']),
  number: z.string().min(1, 'Identification number is required'),
});
