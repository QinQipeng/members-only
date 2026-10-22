export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  hashed_pwd: string
  is_active: boolean
  is_admin: boolean
  created_at: Date
  updated_at: Date
}

export interface Message {
  id: string
  owner_id: string
  title: string
  content: string
  created_at: Date
}