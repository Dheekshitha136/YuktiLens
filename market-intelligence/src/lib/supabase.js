import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://axblnmszzdqgkiubeetr.supabase.co'
const supabaseAnonKey = 'sb_publishable_AS-1zlqLkwZnD6NrUN636A_kNUzwgyZ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)