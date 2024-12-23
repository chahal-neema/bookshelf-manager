/*
  # Fix Authentication Setup

  1. Updates
    - Update demo user metadata and flags
    - Ensure proper identity linking
    - Add profile for demo user
*/

-- Update demo user with correct metadata
UPDATE auth.users
SET 
  raw_app_meta_data = jsonb_build_object(
    'provider', 'email',
    'providers', ARRAY['email']
  ),
  raw_user_meta_data = jsonb_build_object(
    'name', 'Demo User'
  ),
  is_sso_user = false,
  email_confirmed_at = now(),
  last_sign_in_at = now(),
  updated_at = now()
WHERE id = 'b96a8e5c-98e8-4974-9e59-63b85c5c4f5d';

-- Ensure demo user has correct identity
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
  jsonb_build_object(
    'sub', 'b96a8e5c-98e8-4974-9e59-63b85c5c4f5d',
    'email', 'demo@example.com'
  ),
  'email',
  'b96a8e5c-98e8-4974-9e59-63b85c5c4f5d',
  now(),
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  last_sign_in_at = EXCLUDED.last_sign_in_at,
  updated_at = EXCLUDED.updated_at;

-- Ensure demo user has a profile
INSERT INTO public.profiles (
  id,
  username,
  display_name,
  created_at,
  updated_at
) VALUES (
  'b96a8e5c-98e8-4974-9e59-63b85c5c4f5d',
  'demo@example.com',
  'Demo User',
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  updated_at = now();