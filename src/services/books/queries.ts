import { supabase } from '@/lib/supabase';
import type { Book } from '@/types/book';

export async function getBooks(): Promise<Book[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  console.log('Fetching books for user:', user.id);

  const { data: books, error } = await supabase
    .from('books')
    .select(`
      *,
      book_genres!inner (
        genres (
          name
        )
      ),
      book_loans (
        id,
        loaned_to,
        loaned_at,
        due_date,
        returned_at
      )
    `)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching books:', error);
    throw error;
  }

  console.log('Books fetched:', books?.length);

  return books.map((book): Book => {
    const currentLoan = book.book_loans?.find(loan => !loan.returned_at);
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.cover_url || '',
      genre: book.book_genres.map(bg => bg.genres.name),
      status: book.status as 'unread' | 'in-progress' | 'completed',
      rating: book.rating || 0,
      progress: book.progress || 0,
      isLoaned: !!currentLoan,
      loanedTo: currentLoan?.loaned_to,
      currentLoanId: currentLoan?.id,
      loanDate: currentLoan?.loaned_at,
      dueDate: currentLoan?.due_date
    };
  });
}