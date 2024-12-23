/*
  # Book Management System Schema

  1. New Tables
    - `books`
      - Core book information and metadata
      - Includes title, author, status, rating, etc.
    - `book_genres`
      - Junction table for book-genre relationships
    - `genres`
      - List of available genres
    - `book_loans`
      - Track book lending history
    
  2. Storage
    - Create a bucket for book covers and related images
    
  3. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create genres table
CREATE TABLE IF NOT EXISTS genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view genres"
  ON genres
  FOR SELECT
  TO authenticated
  USING (true);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  description text,
  isbn text,
  cover_url text,
  status text NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'in-progress', 'completed')),
  rating smallint CHECK (rating >= 0 AND rating <= 5),
  progress smallint DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  publication_date date,
  publisher text,
  page_count integer,
  language text DEFAULT 'en',
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own books"
  ON books
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own books"
  ON books
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books"
  ON books
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create book_genres junction table
CREATE TABLE IF NOT EXISTS book_genres (
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  genre_id uuid REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (book_id, genre_id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE book_genres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage genres for their own books"
  ON book_genres
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM books
      WHERE books.id = book_id
      AND books.user_id = auth.uid()
    )
  );

-- Create book_loans table
CREATE TABLE IF NOT EXISTS book_loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  loaned_to text NOT NULL,
  loaned_at timestamptz DEFAULT now(),
  due_date timestamptz,
  returned_at timestamptz,
  notes text,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE book_loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage loans for their own books"
  ON book_loans
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_loans_updated_at
  BEFORE UPDATE ON book_loans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default genres
INSERT INTO genres (name) VALUES
  ('Fiction'),
  ('Non-fiction'),
  ('Mystery'),
  ('Science Fiction'),
  ('Fantasy'),
  ('Biography'),
  ('History'),
  ('Self-help'),
  ('Business'),
  ('Romance'),
  ('Thriller'),
  ('Horror'),
  ('Poetry'),
  ('Drama'),
  ('Adventure')
ON CONFLICT (name) DO NOTHING;

-- Create storage bucket for book covers
INSERT INTO storage.buckets (id, name, public) VALUES ('book-covers', 'book-covers', true);

-- Storage policies for book covers
CREATE POLICY "Anyone can view book covers"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'book-covers');

CREATE POLICY "Authenticated users can upload book covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'book-covers' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own book covers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'book-covers' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );