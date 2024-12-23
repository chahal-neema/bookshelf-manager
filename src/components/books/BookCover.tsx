import { Book } from '@/types/book';
import { MoreVertical, UserPlus, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BookCoverProps {
  book: Book;
  onLoanClick: () => void;
  onDeleteClick: () => void;
}

export function BookCover({ book, onLoanClick, onDeleteClick }: BookCoverProps) {
  return (
    <div className="relative aspect-[2/3] rounded-t-lg overflow-hidden">
      <img
        src={book.coverUrl}
        alt={book.title}
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#091E42]/80 via-[#091E42]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-full bg-white hover:bg-gray-50 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
              <MoreVertical className="h-4 w-4 text-[#172B4D]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem 
              onClick={onLoanClick}
              disabled={book.isLoaned}
              className="cursor-pointer text-[#172B4D] hover:bg-[#F4F5F7]"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {book.isLoaned ? 'Currently Loaned' : 'Loan Book'}
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onDeleteClick}
              className="cursor-pointer text-red-600 hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Book
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="font-semibold text-white text-lg truncate mb-1">{book.title}</h3>
        <p className="text-sm text-white/90">{book.author}</p>
      </div>
    </div>
  );
}