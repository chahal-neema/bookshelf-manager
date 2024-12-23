import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().min(1, 'Genre is required'),
  coverUrl: z.string().url('Must be a valid URL').optional(),
  status: z.enum(['unread', 'in-progress', 'completed']).default('unread'),
});

export type BookFormData = z.infer<typeof bookSchema>;