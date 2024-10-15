export interface TemplateField {
  id: string
  name: string
  type: 'text' | 'multiline' | 'number' | 'checkbox' | 'date'
  order: number
}

export interface Template {
  id: string
  user_id: string
  name: string
  fields: TemplateField[]
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  user_id: string
  name: string
  edited_at: string
  created_at: string
}

export interface Note {
  id: string
  user_id: string
  client_id: string
  template_id: string
  content: Record<string, string>
  created_at: string
  updated_at: string
}
