import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'رابط_مشروعك_من_supabase'
const supabaseAnonKey = 'مفتاح_API_الخاص_بمشروعك'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)