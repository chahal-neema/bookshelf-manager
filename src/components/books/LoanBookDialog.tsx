import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createLoan } from '@/services/loans';
import { loanSchema } from '@/lib/validations/loan';
import { useToast } from '@/hooks/use-toast';
import { Book } from '@/types/book';

interface LoanBookDialogProps {
  book: Book;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoanCreated: () => void;
}

export function LoanBookDialog({ book, open, onOpenChange, onLoanCreated }: LoanBookDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(loanSchema),
    defaultValues: {
      loanedTo: '',
      dueDate: '',
      notes: ''
    }
  });

  async function onSubmit(data: any) {
    try {
      setIsSubmitting(true);
      await createLoan(book.id, data);
      toast({
        title: 'Book loaned successfully',
        description: `${book.title} has been loaned to ${data.loanedTo}`
      });
      onOpenChange(false);
      form.reset();
      onLoanCreated();
    } catch (error) {
      toast({
        title: 'Error creating loan',
        description: 'There was a problem loaning the book. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Loan Book: {book.title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="loanedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Borrower Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter borrower's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input placeholder="Add any notes about the loan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating loan...' : 'Loan Book'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}