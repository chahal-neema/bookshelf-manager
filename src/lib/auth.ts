import { createContext } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function signIn(email: string, password: string) {
  if (!email || !password) {
    throw new AuthError('Email and password are required');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('Sign in error:', error);
    throw new AuthError('Invalid email or password');
  }

  return data;
}

export async function signUp(email: string, password: string) {
  if (!email || !password) {
    throw new AuthError('Email and password are required');
  }

  if (password.length < 6) {
    throw new AuthError('Password must be at least 6 characters');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    console.error('Sign up error:', error);
    if (error.message.includes('User already registered')) {
      throw new AuthError('This email is already registered');
    }
    throw new AuthError('Failed to create account');
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
    throw new AuthError('Failed to sign out');
  }
}

export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Session error:', error);
    return null;
  }
  return session;
}

export async function refreshSession() {
  const { data: { session }, error } = await supabase.auth.refreshSession();
  if (error) {
    console.error('Session refresh error:', error);
    return null;
  }
  return session;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true
});