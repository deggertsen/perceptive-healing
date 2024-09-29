export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          client_info: Json
          created_at: string
          updated_at: string
          edited_at: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          client_info: Json
          created_at?: string
          updated_at?: string
          edited_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          client_info?: Json
          created_at?: string
          updated_at?: string
          edited_at?: string | null
          deleted_at?: string | null
        }
      }
      // ... other existing tables
    }
    Views: {
      // ... existing views
    }
    Functions: {
      // ... existing functions
    }
    Enums: {
      // ... existing enums
    }
  }
}
