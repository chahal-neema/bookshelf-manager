import { Book } from '@/types/book';
import { Badge } from '@/components/ui/badge';
import { StarRating } from './StarRating';

interface BookDetailsProps {
  book: Book;
  onUpdate: () => void;
}

export function BookDetails({ book, onUpdate }: BookDetailsProps) {
  const statusColors = {
    unread: 'bg-white border border-[#091E42] text-[#172B4D]',
    'in-progress': 'bg-[#0052CC] text-white',
    completed: 'bg-[#36B37E] text-white',
  };

  return (
    <div className="p-4">
      <h3 className="font-semibold text-[#172B4D] text-lg truncate mb-1 group-hover:text-[#0052CC] transition-colors duration-200">
        {book.title}
      </h3>
      <p className="text-sm text-[#172B4D] mb-4">{book.author}</p>
      
      <div className="space-y-4">
        <div className="flex justify-center">
          <Badge 
            variant="secondary" 
            className={`${statusColors[book.status]} transition-colors duration-200`}
          >
            {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
          </Badge>
        </div>

        <div className="flex justify-center">
          <StarRating
            bookId={book.id}
            currentRating={book.rating}
            onRatingChange={onUpdate}
          />
        </div>
      </div>
    </div>
  );
}