import { useState, useCallback, useMemo } from 'react';
import { Book, BookFilter } from '@/types/book';

const initialFilters: BookFilter = {
  search: '',
  genres: [],
  status: [],
  rating: null,
  loanStatus: 'all'
};

export function useBookFilters(books: Book[]) {
  const [filters, setFilters] = useState<BookFilter>(initialFilters);

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // Search filter
      if (filters.search && !book.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !book.author.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Genre filter
      if (filters.genres.length > 0 && !book.genre.some(g => filters.genres.includes(g.toLowerCase()))) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(book.status)) {
        return false;
      }

      // Rating filter
      if (filters.rating !== null && book.rating < filters.rating) {
        return false;
      }

      // Loan status filter
      if (filters.loanStatus === 'loaned' && !book.isLoaned) {
        return false;
      }
      if (filters.loanStatus === 'available' && book.isLoaned) {
        return false;
      }

      return true;
    });
  }, [books, filters]);

  const updateSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const updateGenres = useCallback((genres: string[]) => {
    setFilters(prev => ({ ...prev, genres: genres.map(g => g.toLowerCase()) }));
  }, []);

  const updateStatus = useCallback((status: string[]) => {
    setFilters(prev => ({ ...prev, status }));
  }, []);

  const updateRating = useCallback((rating: number | null) => {
    setFilters(prev => ({ ...prev, rating }));
  }, []);

  const updateLoanStatus = useCallback((loanStatus: BookFilter['loanStatus']) => {
    setFilters(prev => ({ ...prev, loanStatus }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return {
    filters,
    filteredBooks,
    updateSearch,
    updateGenres,
    updateStatus,
    updateRating,
    updateLoanStatus,
    resetFilters
  };
}