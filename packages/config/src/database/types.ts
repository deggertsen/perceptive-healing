export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      // Add your tables here
      example: {
        Row: {
          id: number
          created_at: string
          // Add other fields
        }
        Insert: {
          id?: number
          created_at?: string
          // Add other fields
        }
        Update: {
          id?: number
          created_at?: string
          // Add other fields
        }
      }
    }
    Views: {
      // Add views here if you have any
    }
    Functions: {
      // Add functions here if you have any
    }
    Enums: {
      // Add enums here if you have any
    }
  }
}
