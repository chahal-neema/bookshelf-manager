import { supabase } from '@/lib/supabase';
import type { BookLoan } from '@/types/book';

export async function createLoan(bookId: string, loanData: { loanedTo: string, dueDate?: string, notes?: string }): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('book_loans')
    .insert({
      book_id: bookId,
      loaned_to: loanData.loanedTo,
      due_date: loanData.dueDate,
      notes: loanData.notes,
      user_id: user.id
    });

  if (error) throw error;
}

export async function returnBook(loanId: string): Promise<void> {
  const { error } = await supabase
    .from('book_loans')
    .update({ 
      returned_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', loanId);

  if (error) throw error;
}

export async function getBookLoans(bookId: string): Promise<BookLoan[]> {
  const { data, error } = await supabase
    .from('book_loans')
    .select('*')
    .eq('book_id', bookId)
    .is('returned_at', null)
    .order('loaned_at', { ascending: false });

  if (error) throw error;
  return data;
}