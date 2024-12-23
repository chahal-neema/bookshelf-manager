/*
  # Add Sample Book Data

  1. Sample Data
    - Add representative books with metadata
    - Add genre relationships
    - Add sample loan record
    
  2. Notes
    - Using public domain book covers from Unsplash
    - Varied statuses, ratings, and progress
*/

-- Insert sample books
WITH new_user AS (
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password
  ) VALUES (
    'b96a8e5c-98e8-4974-9e59-63b85c5c4f5d',
    'demo@example.com',
    '$2a$10$abcdefghijklmnopqrstuvwxyz'
  ) RETURNING id
), sample_books AS (
  INSERT INTO books (
    id,
    title,
    author,
    description,
    isbn,
    cover_url,
    status,
    rating,
    progress,
    publication_date,
    publisher,
    page_count,
    user_id
  ) VALUES
    (
      'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      'The Midnight Library',
      'Matt Haig',
      'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
      '9780525559474',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800&h=1200',
      'completed',
      5,
      100,
      '2020-09-29',
      'Viking',
      304,
      (SELECT id FROM new_user)
    ),
    (
      'a2b8e3f4-c567-4d89-b123-4a5b6c7d8e9f',
      'Atomic Habits',
      'James Clear',
      'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
      '9780735211292',
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800&h=1200',
      'in-progress',
      4,
      60,
      '2018-10-16',
      'Avery',
      320,
      (SELECT id FROM new_user)
    ),
    (
      '7c35dc0e-e50c-4f1a-b7b4-67f019118c9c',
      'Project Hail Mary',
      'Andy Weir',
      'A lone astronaut must save the earth from disaster',
      '9780593135204',
      'https://images.unsplash.com/photo-1465929639680-64ee080eb3ed?auto=format&fit=crop&q=80&w=800&h=1200',
      'unread',
      null,
      0,
      '2021-05-04',
      'Ballantine Books',
      496,
      (SELECT id FROM new_user)
    ),
    (
      'd4e5f6g7-1234-5678-9abc-def012345678',
      'Dune',
      'Frank Herbert',
      'A stunning blend of adventure and mysticism, environmentalism and politics',
      '9780441172719',
      'https://images.unsplash.com/photo-1506466010722-395aa2bef877?auto=format&fit=crop&q=80&w=800&h=1200',
      'completed',
      5,
      100,
      '1965-08-01',
      'Ace Books',
      412,
      (SELECT id FROM new_user)
    ),
    (
      'e5f6g7h8-2345-6789-bcde-f01234567890',
      'The Psychology of Money',
      'Morgan Housel',
      'Timeless lessons on wealth, greed, and happiness',
      '9780857197689',
      'https://images.unsplash.com/photo-1554774853-719586f82d77?auto=format&fit=crop&q=80&w=800&h=1200',
      'in-progress',
      4,
      75,
      '2020-09-08',
      'Harriman House',
      256,
      (SELECT id FROM new_user)
    )
  RETURNING id, (SELECT id FROM new_user) as user_id
)
-- Insert book-genre relationships
INSERT INTO book_genres (book_id, genre_id)
SELECT 
  sb.id,
  g.id
FROM sample_books sb
CROSS JOIN LATERAL (
  VALUES 
    ('The Midnight Library', ARRAY['Fiction', 'Fantasy']),
    ('Atomic Habits', ARRAY['Self-help', 'Non-fiction']),
    ('Project Hail Mary', ARRAY['Science Fiction', 'Adventure']),
    ('Dune', ARRAY['Science Fiction', 'Fantasy']),
    ('The Psychology of Money', ARRAY['Business', 'Non-fiction'])
) AS book_genres(title, genres)
JOIN genres g ON g.name = ANY(book_genres.genres)
WHERE book_genres.title = (
  SELECT title FROM books WHERE id = sb.id
);

-- Insert sample book loans
INSERT INTO book_loans (
  book_id,
  loaned_to,
  loaned_at,
  due_date,
  notes,
  user_id
) 
SELECT
  id,
  'Sarah Smith',
  NOW() - INTERVAL '2 weeks',
  NOW() + INTERVAL '2 weeks',
  'Borrowed for book club',
  user_id
FROM sample_books
WHERE title = 'Atomic Habits';