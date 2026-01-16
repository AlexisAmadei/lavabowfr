import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export const fetchDataFromTable = async (table_name: string) => {
  const { data, error } = await supabase
    .from(table_name)
    .select('*')

  if (error) {
    console.error('Error fetching data:', error)
    return null
  }

  console.info(`Data fetched from ${table_name}:`, data)
  return data
}