export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface ClientInfo {
  email: string
  phone: string
}

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          client_info: ClientInfo
          created_at: string
          updated_at: string
          edited_at: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          client_info: ClientInfo
          created_at?: string
          updated_at?: string
          edited_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          client_info?: ClientInfo
          created_at?: string
          updated_at?: string
          edited_at?: string | null
          deleted_at?: string | null
        }
      }
      // ... other existing tables
    }
  }
}
