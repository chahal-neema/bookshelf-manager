import { BookOpen, BookX, CheckCircle, Star, Users } from 'lucide-react';
import { Book, BookFilter } from '@/types/book';

interface SidebarProps {
  onStatusChange: (status: string[]) => void;
  onGenreChange: (genres: string[]) => void;
  onRatingChange: (rating: number | null) => void;
  onLoanStatusChange: (status: BookFilter['loanStatus']) => void;
  selectedFilters: BookFilter;
  books: Book[];
}

export function Sidebar({
  onStatusChange,
  onGenreChange,
  onRatingChange,
  onLoanStatusChange,
  selectedFilters,
  books
}: SidebarProps) {
  const isStatusSelected = (status: string) => selectedFilters.status.includes(status);
  const isGenreSelected = (genre: string) => selectedFilters.genres.includes(genre);
  const isRatingSelected = (rating: number) => selectedFilters.rating === rating;
  const isLoanStatusSelected = (status: BookFilter['loanStatus']) => selectedFilters.loanStatus === status;

  // Calculate counts
  const statusCounts = {
    unread: books.filter(b => b.status === 'unread').length,
    'in-progress': books.filter(b => b.status === 'in-progress').length,
    completed: books.filter(b => b.status === 'completed').length
  };

  const genreCounts = books.reduce((acc: Record<string, number>, book) => {
    book.genre.forEach(g => {
      acc[g.toLowerCase()] = (acc[g.toLowerCase()] || 0) + 1;
    });
    return acc;
  }, {});

  const loanedCount = books.filter(b => b.isLoaned).length;

  const statuses = [
    { label: 'Unread', value: 'unread', icon: BookX, count: statusCounts.unread },
    { label: 'In Progress', value: 'in-progress', icon: BookOpen, count: statusCounts['in-progress'] },
    { label: 'Completed', value: 'completed', icon: CheckCircle, count: statusCounts.completed },
  ];

  const genres = [
    { label: 'Fiction', value: 'fiction', count: genreCounts.fiction || 0 },
    { label: 'Non-fiction', value: 'non-fiction', count: genreCounts['non-fiction'] || 0 },
    { label: 'Mystery', value: 'mystery', count: genreCounts.mystery || 0 },
    { label: 'Science Fiction', value: 'sci-fi', count: genreCounts['sci-fi'] || 0 },
    { label: 'Fantasy', value: 'fantasy', count: genreCounts.fantasy || 0 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
      <div className="space-y-8">
        {/* Reading Status */}
        <div>
          <h3 className="text-sm font-medium text-[#172B4D] mb-4">Reading Status</h3>
          <ul className="space-y-1">
            {statuses.map((status) => (
              <li key={status.label}>
                <button
                  onClick={() => {
                    const newStatus = isStatusSelected(status.value)
                      ? selectedFilters.status.filter(s => s !== status.value)
                      : [...selectedFilters.status, status.value];
                    onStatusChange(newStatus);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors duration-200
                    ${isStatusSelected(status.value)
                      ? 'bg-[#F4F5F7] text-[#172B4D]'
                      : 'text-[#42526E] hover:bg-[#F4F5F7] hover:text-[#172B4D]'
                    }`}
                >
                  <status.icon className="h-4 w-4 mr-3 shrink-0" />
                  <span>{status.label}</span>
                  <span className="ml-auto text-xs text-[#7A869A]">{status.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Genres */}
        <div>
          <h3 className="text-sm font-medium text-[#172B4D] mb-4">Genres</h3>
          <ul className="space-y-1">
            {genres.map((genre) => (
              <li key={genre.label}>
                <button
                  onClick={() => {
                    const newGenres = isGenreSelected(genre.value)
                      ? selectedFilters.genres.filter(g => g !== genre.value)
                      : [...selectedFilters.genres, genre.value];
                    onGenreChange(newGenres);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors duration-200
                    ${isGenreSelected(genre.value)
                      ? 'bg-[#F4F5F7] text-[#172B4D]'
                      : 'text-[#42526E] hover:bg-[#F4F5F7] hover:text-[#172B4D]'
                    }`}
                >
                  <span>{genre.label}</span>
                  <span className="ml-auto text-xs text-[#7A869A]">{genre.count}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Rating */}
        <div>
          <h3 className="text-sm font-medium text-[#172B4D] mb-4">Rating</h3>
          <ul className="space-y-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <li key={rating}>
                <button
                  onClick={() => onRatingChange(isRatingSelected(rating) ? null : rating)}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors duration-200
                    ${isRatingSelected(rating)
                      ? 'bg-[#F4F5F7] text-[#172B4D]'
                      : 'text-[#42526E] hover:bg-[#F4F5F7] hover:text-[#172B4D]'
                    }`}
                >
                  <div className="flex">
                    {[...Array(rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <span className="text-xs text-[#7A869A]">
                      {rating === 5 ? 'only' : '& up'}
                    </span>
                    <span className="text-xs text-[#7A869A]">
                      {rating === 5 
                        ? books.filter(b => b.rating === 5).length
                        : books.filter(b => b.rating >= rating).length}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Loan Status */}
        <div>
          <h3 className="text-sm font-medium text-[#172B4D] mb-4">Loan Status</h3>
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => onLoanStatusChange(isLoanStatusSelected('loaned') ? 'all' : 'loaned')}
                className={`flex items-center w-full px-3 py-2 rounded-md text-sm transition-colors duration-200
                  ${isLoanStatusSelected('loaned')
                    ? 'bg-[#F4F5F7] text-[#172B4D]'
                    : 'text-[#42526E] hover:bg-[#F4F5F7] hover:text-[#172B4D]'
                  }`}
              >
                <Users className="h-4 w-4 mr-3 shrink-0" />
                <span>Loaned</span>
                <span className="ml-auto text-xs text-[#7A869A]">{loanedCount}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}