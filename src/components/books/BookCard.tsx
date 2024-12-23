import { useState } from 'react';
import { Book } from '@/types/book';
import { Card } from '@/components/ui/card';
import { BookCover } from './BookCover';
import { BookDetails } from './BookDetails';
import { LoanBookDialog } from './LoanBookDialog';
import { DeleteBookDialog } from './DeleteBookDialog';

interface BookCardProps {
  book: Book;
  onUpdate: () => void;
}

export function BookCard({ book, onUpdate }: BookCardProps) {
  const [showLoanDialog, setShowLoanDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-[#DFE1E6]">
        <BookCover 
          book={book} 
          onLoanClick={() => setShowLoanDialog(true)}
          onDeleteClick={() => setShowDeleteDialog(true)}
        />
        <BookDetails 
          book={book} 
          onUpdate={onUpdate} 
        />
      </Card>

      <LoanBookDialog
        book={book}
        open={showLoanDialog}
        onOpenChange={setShowLoanDialog}
        onLoanCreated={onUpdate}
      />

      <DeleteBookDialog
        bookId={book.id}
        bookTitle={book.title}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onDeleted={onUpdate}
      />
    </>
  );
}