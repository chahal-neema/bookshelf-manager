import { useState } from 'react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useBooks } from '@/hooks/useBooks';
import { returnBook } from '@/services/loans';
import { useToast } from '@/hooks/use-toast';
import { Book } from '@/types/book';

interface LoansDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoanUpdated: () => void;
}

export function LoansDialog({ open, onOpenChange, onLoanUpdated }: LoansDialogProps) {
  const { books } = useBooks();
  const { toast } = useToast();
  const [isReturning, setIsReturning] = useState<string | null>(null);

  const loanedBooks = books.filter(book => book.isLoaned);

  const handleReturn = async (book: Book) => {
    if (!book.currentLoanId) return;

    try {
      setIsReturning(book.id);
      await returnBook(book.currentLoanId);
      toast({
        title: 'Book returned',
        description: `${book.title} has been marked as returned`
      });
      onLoanUpdated();
    } catch (error) {
      toast({
        title: 'Error returning book',
        description: 'Failed to return the book',
        variant: 'destructive'
      });
    } finally {
      setIsReturning(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Loaned Books</DialogTitle>
        </DialogHeader>

        {loanedBooks.length === 0 ? (
          <div className="text-center py-6 text-[#42526E]">
            No books are currently on loan
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book</TableHead>
                <TableHead>Borrowed By</TableHead>
                <TableHead>Loan Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loanedBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.loanedTo}</TableCell>
                  <TableCell>
                    {book.loanDate ? format(new Date(book.loanDate), 'MMM d, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    {book.dueDate ? format(new Date(book.dueDate), 'MMM d, yyyy') : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReturn(book)}
                      disabled={isReturning === book.id}
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                      {isReturning === book.id ? 'Returning...' : 'Return'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}