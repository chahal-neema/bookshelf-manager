export type BookLoan = {
  id: string;
  book_id: string;
  loaned_to: string;
  loaned_at: string;
  due_date?: string;
  returned_at?: string;
  notes?: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  genre: string[];
  status: 'unread' | 'in-progress' | 'completed';
  rating: number;
  progress: number;
  isLoaned: boolean;
  loanedTo?: string;
  currentLoanId?: string;
  loanDate?: string;
  dueDate?: string;
};

export type BookFilter = {
  search: string;
  genres: string[];
  status: string[];
  rating: number | null;
  loanStatus: 'all' | 'loaned' | 'available';
};