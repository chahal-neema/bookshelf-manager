import { supabase } from '@/lib/supabase';
import type { BookFormData } from '@/types/book';
import { getOrCreateGenre } from '../genres';

export async function deleteBook(bookId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Start a transaction using RPC
  const { error: rpcError } = await supabase.rpc('delete_book', {
    p_book_id: bookId,
    p_user_id: user.id
  });

  if (rpcError) {
    console.error('Error deleting book:', rpcError);
    throw rpcError;
  }
}