import { useState, useEffect, useCallback, useContext } from 'react';
import { Book } from '@/types/book';
import { getBooks } from '@/services/books';
import { AuthContext } from '@/lib/auth';

export function useBooks() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadBooks = useCallback(async () => {
    if (!user) {
      setBooks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      console.error('Failed to load books:', err);
      setError(err instanceof Error ? err : new Error('Failed to load books'));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  return {
    books,
    loading,
    error,
    refetch: loadBooks
  };
}