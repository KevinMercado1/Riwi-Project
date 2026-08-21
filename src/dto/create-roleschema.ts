import { z } from 'zod';

export const createRoleSchema = z.object({
  name: z.enum(['coder', 'team_leader', 'admin']),
});
