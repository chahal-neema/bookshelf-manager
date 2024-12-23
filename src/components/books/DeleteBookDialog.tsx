import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteBook } from "@/services/books";
import { useToast } from "@/hooks/use-toast";

interface DeleteBookDialogProps {
  bookId: string;
  bookTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
}

export function DeleteBookDialog({
  bookId,
  bookTitle,
  open,
  onOpenChange,
  onDeleted,
}: DeleteBookDialogProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await deleteBook(bookId);
      
      // Close dialog before showing toast and updating
      onOpenChange(false);
      
      // Update UI
      onDeleted();
      
      // Show success message
      toast({
        title: "Book deleted",
        description: `"${bookTitle}" has been removed from your library`,
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error deleting book",
        description: "Failed to delete the book. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Book</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{bookTitle}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}