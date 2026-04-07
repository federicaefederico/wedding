import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'INSERISCI_URL_SUPABASE'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'INSERISCI_CHIAVE_ANONIMA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
