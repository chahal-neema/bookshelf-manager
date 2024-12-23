export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          id: string
          title: string
          author: string
          description: string | null
          isbn: string | null
          cover_url: string | null
          status: string
          rating: number | null
          progress: number
          publication_date: string | null
          publisher: string | null
          page_count: number | null
          language: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          description?: string | null
          isbn?: string | null
          cover_url?: string | null
          status?: string
          rating?: number | null
          progress?: number
          publication_date?: string | null
          publisher?: string | null
          page_count?: number | null
          language?: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          description?: string | null
          isbn?: string | null
          cover_url?: string | null
          status?: string
          rating?: number | null
          progress?: number
          publication_date?: string | null
          publisher?: string | null
          page_count?: number | null
          language?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      book_genres: {
        Row: {
          book_id: string
          genre_id: string
          created_at: string
        }
        Insert: {
          book_id: string
          genre_id: string
          created_at?: string
        }
        Update: {
          book_id?: string
          genre_id?: string
          created_at?: string
        }
      }
      book_loans: {
        Row: {
          id: string
          book_id: string
          loaned_to: string
          loaned_at: string
          due_date: string | null
          returned_at: string | null
          notes: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          loaned_to: string
          loaned_at?: string
          due_date?: string | null
          returned_at?: string | null
          notes?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          loaned_to?: string
          loaned_at?: string
          due_date?: string | null
          returned_at?: string | null
          notes?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      genres: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}