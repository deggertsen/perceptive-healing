import { createClient } from '@supabase/supabase-js'
import getConfigWithTypes from '../env'

const config = getConfigWithTypes()

export const supabase = createClient(
  config.publicRuntimeConfig.supabaseConfig.url,
  config.publicRuntimeConfig.supabaseConfig.anonKey,
)
