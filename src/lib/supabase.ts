import { createClient } from '@supabase/supabase-js'

export function createSupabaseServerClient() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SECRET

  if (!url || !key) {
    throw new Error('Missing Supabase env vars: SUPABASE_URL and SUPABASE_SECRET')
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}
