-- Create demo user with known password
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  'b96a8e5c-98e8-4974-9e59-63b85c5c4f5d',
  'demo@example.com',
  crypt('demo123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  'authenticated',
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

-- Create genres table
CREATE TABLE IF NOT EXISTS genres (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Rest of the existing migration remains the same...