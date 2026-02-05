import { z } from 'zod';

export const teamMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: z.string(),
  status: z.enum(['active', 'inactive']),
  avatar: z.string().optional(),
  labels: z.array(z.string()).default([]),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;

export const teamMemberListSchema = z.array(teamMemberSchema);
