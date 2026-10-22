export interface User {
  id: string
  first_name?: string | null
  last_name?: string | null
  email?: string | null
  hashed_pwd?: string | null
  is_active?: boolean | null
  is_admin?: boolean | null
  created_at: Date
  updated_at: Date
}

export interface Message {
  id: string
  owner_id?: string | null
  title?: string | null
  content?: string | null
  created_at?: Date | null
}