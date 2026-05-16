import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '';

export const supabase = createClient(supabaseUrl, supabaseKey)

export const fetchDataFromTable = async (table_name: string) => {
  const { data, error } = await supabase
    .from(table_name)
    .select('*')

  if (error) {
    console.error('Error fetching data:', error)
    return null
  }

  return data
}