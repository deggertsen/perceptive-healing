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
