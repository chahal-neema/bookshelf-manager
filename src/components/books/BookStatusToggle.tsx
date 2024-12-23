import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, BookX, CheckCircle } from 'lucide-react';
import { updateBookStatus } from '@/services/books';
import { useToast } from '@/hooks/use-toast';

type Status = 'unread' | 'in-progress' | 'completed';

interface BookStatusToggleProps {
  bookId: string;
  currentStatus: Status;
  onStatusChange: () => void;
}

export function BookStatusToggle({ bookId, currentStatus, onStatusChange }: BookStatusToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const statusConfig = {
    unread: { icon: BookX, label: 'Want to Read', next: 'in-progress' },
    'in-progress': { icon: BookOpen, label: 'Currently Reading', next: 'completed' },
    completed: { icon: CheckCircle, label: 'Read', next: 'unread' }
  };

  const handleStatusChange = async () => {
    try {
      setIsUpdating(true);
      const nextStatus = statusConfig[currentStatus].next as Status;
      await updateBookStatus(bookId, nextStatus);
      onStatusChange();
      toast({
        title: 'Status updated',
        description: `Book marked as "${statusConfig[nextStatus].label}"`
      });
    } catch (error) {
      toast({
        title: 'Error updating status',
        description: 'Failed to update reading status',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const CurrentIcon = statusConfig[currentStatus].icon;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleStatusChange}
      disabled={isUpdating}
      className={`w-full justify-start ${isUpdating ? 'opacity-50' : ''}`}
    >
      <CurrentIcon className="mr-2 h-4 w-4" />
      {statusConfig[currentStatus].label}
    </Button>
  );
}