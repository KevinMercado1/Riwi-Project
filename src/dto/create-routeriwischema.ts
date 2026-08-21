import { z } from 'zod';

export const createRouteRiwiSchema = z.object({
  name: z.enum(['basic', 'advanced']),
});
