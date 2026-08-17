import { z } from 'zod';

export const readingStatusSchema = z.enum([
  'WANT_TO_READ',
  'READING',
  'COMPLETED',
]);

export const createBookSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Book title is required')
    .max(200, 'Book title must be at most 200 characters'),

  authorName: z
    .string()
    .trim()
    .min(2, 'Author name must be at least 2 characters')
    .max(120, 'Author name must be at most 120 characters'),

  status: readingStatusSchema.default('WANT_TO_READ'),

  publishedYear: z
    .number()
    .int('Published year must be a whole number')
    .min(1000, 'Published year must be after 1000')
    .max(new Date().getFullYear(), 'Published year cannot be in the future')
    .optional(),

  description: z
    .string()
    .trim()
    .max(2_000, 'Description must be at most 2000 characters')
    .optional(),

  coverImageUrl: z
    .string()
    .trim()
    .url('Cover image must be a valid URL')
    .optional(),
});

export type CreateBookInput = z.infer<typeof createBookSchema>;
