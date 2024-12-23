/*
  # Auth Setup Migration
  
  1. Updates
    - Ensures demo user exists with proper credentials
    - Sets up auth identities for the demo user
  
  2. Security
    - Sets proper authentication data
    - Ensures user can sign in with email/password
*/

-- Create or update demo user
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
) ON CONFLICT (id) DO UPDATE SET
  encrypted_password = EXCLUDED.encrypted_password,
  email_confirmed_at = EXCLUDED.email_confirmed_at,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  updated_at = now();

-- Create or update auth identity
INSERT INTO auth.identities (
  id,
  user_id,
  identity_data,
  provider,
  provider_id,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'b96a8e5c-98e8-4974-9e59-63b85c5c4f5d',
  'b96a8e5c-98e8-4974-9e59-63b85c5c4f5d',
  jsonb_build_object('sub', 'b96a8e5c-98e8-4974-9e59-63b85c5c4f5d', 'email', 'demo@example.com'),
  'email',
  'demo@example.com',
  now(),
  now(),
  now()
) ON CONFLICT (provider, provider_id) DO UPDATE SET
  last_sign_in_at = EXCLUDED.last_sign_in_at,
  updated_at = now();