import { createClient } from '@supabase/supabase-js'
import getConfigWithTypes from '../env'
import { Database } from './types'

const config = getConfigWithTypes()

export const supabase = createClient(
  config.publicRuntimeConfig.supabaseConfig.url,
  config.publicRuntimeConfig.supabaseConfig.anonKey
)

// Add this type for better type inference
export type { Database }
