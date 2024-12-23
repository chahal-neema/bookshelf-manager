import { useState } from 'react';
import { Star } from 'lucide-react';
import { updateBookRating } from '@/services/books';
import { useToast } from '@/hooks/use-toast';

interface StarRatingProps {
  bookId: string;
  currentRating: number;
  onRatingChange: () => void;
}

export function StarRating({ bookId, currentRating, onRatingChange }: StarRatingProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [localRating, setLocalRating] = useState(currentRating);
  const { toast } = useToast();

  const handleRatingChange = async (rating: number) => {
    if (isUpdating) return;

    try {
      setIsUpdating(true);
      // Optimistically update local state
      setLocalRating(rating);
      await updateBookRating(bookId, rating);
      onRatingChange();
      toast({
        title: 'Rating updated',
        description: `Book rating has been updated to ${rating} stars`
      });
    } catch (error) {
      // Revert on error
      setLocalRating(currentRating);
      toast({
        title: 'Error updating rating',
        description: 'Failed to update book rating',
        variant: 'destructive'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div 
      className="flex items-center space-x-1"
      onMouseLeave={() => setHoveredRating(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleRatingChange(star)}
          onMouseEnter={() => setHoveredRating(star)}
          disabled={isUpdating}
          className="p-0.5 rounded-sm transition-colors duration-200"
        >
          <Star
            className={`h-4 w-4 transition-colors duration-200 ${
              (hoveredRating !== null ? star <= hoveredRating : star <= localRating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}