import { z } from 'zod';

export const loanSchema = z.object({
  loanedTo: z.string().min(1, 'Borrower name is required'),
  dueDate: z.string().optional(),
  notes: z.string().optional()
});

export type LoanFormData = z.infer<typeof loanSchema>;