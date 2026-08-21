import { z } from 'zod';

export const createClanSchema = z.object({
  name: z.string().min(2, 'Clan name is required'),
});
