/*
  # Add delete_book function
  
  Creates a stored procedure to safely delete a book and its related records
  in a single transaction.

  1. Changes
    - Creates a new function `delete_book` for safely deleting books
    - Function verifies book ownership before deletion
    - Handles cascading deletes in correct order
  
  2. Security
    - Function is SECURITY DEFINER to ensure proper permissions
    - Checks user ownership before allowing deletion
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS delete_book(uuid, uuid);

CREATE OR REPLACE FUNCTION delete_book(p_book_id uuid, p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verify book ownership
  IF NOT EXISTS (
    SELECT 1 FROM books 
    WHERE id = p_book_id 
    AND user_id = p_user_id
  ) THEN
    RAISE EXCEPTION 'Book not found or unauthorized';
  END IF;

  -- Delete in correct order to respect foreign keys
  DELETE FROM book_loans WHERE book_id = p_book_id;
  DELETE FROM book_genres WHERE book_id = p_book_id;
  DELETE FROM books WHERE id = p_book_id AND user_id = p_user_id;
END;
$$;