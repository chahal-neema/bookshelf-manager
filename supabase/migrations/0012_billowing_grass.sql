/*
  # Create Demo User
  
  1. Changes
    - Creates demo user with known credentials
    - Sets up auth identity
*/

-- Create demo user
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  role, confirmation_token, email_change, email_change_token_new,
  recovery_token, aud, is_super_admin, is_sso_user
) VALUES (
  'b96a8e5c-98e8-4974-9e59-63b85c5c4f5d',
  '00000000-0000-0000-0000-000000000000',
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
  '',
  'authenticated',
  false,
  false
) ON CONFLICT (id) DO NOTHING;

-- Create auth identity
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
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
) ON CONFLICT (id) DO NOTHING;