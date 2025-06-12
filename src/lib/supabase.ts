import { createClient } from '@supabase/supabase-js'

// Отладочный код
console.log('Environment variables:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'exists' : 'missing'
});

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables:', {
    supabaseUrl: !!supabaseUrl,
    supabaseAnonKey: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Тестовая функция для проверки подключения
export const testSupabaseConnection = async () => {
  try {
    // Проверяем подключение, запрашивая список профилей
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Supabase connection test failed:', error)
      return { success: false, error }
    }

    console.log('Supabase connection test successful:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Supabase connection test error:', error)
    return { success: false, error }
  }
}

// Типы для таблиц (можно расширить по мере необходимости)
export type Tables = {
  // Здесь будут типы ваших таблиц
  // Например:
  // meals: {
  //   id: number
  //   name: string
  //   calories: number
  //   created_at: string
  // }
}

// Хелпер для проверки ошибок
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  throw new Error(error.message || 'An error occurred while accessing the database')
} 