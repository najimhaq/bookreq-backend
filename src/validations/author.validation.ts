import { z } from 'zod';

export const createAuthorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Author name must be at least 2 characters')
    .max(100, 'Author name must be at most 100 characters'),

  bio: z
    .string()
    .trim()
    .min(10, 'Bio must be at least 10 characters')
    .max(1_000, 'Bio must be at most 1000 characters')
    .optional(),
});

export type CreateAuthorInput = z.infer<typeof createAuthorSchema>;
