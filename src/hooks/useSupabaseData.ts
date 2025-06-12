import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/integrations/supabase/types';

// Типы для данных из Supabase
export type Meal = Database['public']['Tables']['meals']['Row'];
export type Digest = Database['public']['Tables']['digests']['Row'];
export type Profile = Database['public']['Tables']['profiles']['Row'];

// Проверяем конфигурацию Supabase
export const isSupabaseConfigured = () => {
  return !!supabase;
};

// Хуки для получения данных
export const useUserProfile = () => {
  const { user } = useAuth();
  const chatId = user?.id;

  return useQuery({
    queryKey: ['profile', chatId],
    queryFn: async () => {
      if (!chatId) throw new Error('User not authenticated');
      
      console.log('Fetching profile for chatId:', chatId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('telegram_id', chatId);

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      console.log('Profile data received:', data);
      return data;
    },
    enabled: !!chatId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

export const useUserMeals = (days: number = 7) => {
  const { user } = useAuth();
  const chatId = user?.id;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const dateStr = startDate.toISOString().split('T')[0];

  return useQuery({
    queryKey: ['meals', chatId, days],
    queryFn: async () => {
      if (!chatId) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('chat_id', chatId)
        .gte('eaten_at', dateStr)
        .order('eaten_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!chatId,
    staleTime: 2 * 60 * 1000, // 2 минуты
  });
};

export const useTodayMeals = () => {
  const { user } = useAuth();
  const chatId = user?.id;
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['todayMeals', chatId, today],
    queryFn: async () => {
      if (!chatId) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('chat_id', chatId)
        .eq('eaten_day', today)
        .order('eaten_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!chatId,
    staleTime: 1 * 60 * 1000, // 1 минута
  });
};

export const useLatestDigest = () => {
  const { user } = useAuth();
  const chatId = user?.id;

  return useQuery({
    queryKey: ['latestDigest', chatId],
    queryFn: async () => {
      if (!chatId) throw new Error('User not authenticated');
      
      try {
      const { data, error } = await supabase
        .from('digests')
        .select('*')
        .eq('chat_id', chatId)
        .order('for_date', { ascending: false })
        .limit(1)
        .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Если данных нет, возвращаем null вместо ошибки
            return null;
          }
          console.error('Error fetching digest:', error);
          throw error;
        }

      return data;
      } catch (error) {
        console.error('Unexpected error in useLatestDigest:', error);
        throw error;
      }
    },
    enabled: !!chatId,
    staleTime: 5 * 60 * 1000, // Уменьшаем время до 5 минут
    cacheTime: 10 * 60 * 1000, // Кэшируем на 10 минут
    retry: 2, // Ограничиваем количество попыток повторного запроса
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Экспоненциальная задержка
  });
};

export const useTodayWater = () => {
  const { user } = useAuth();
  const chatId = user?.id || '';
  const today = new Date().toISOString().split('T')[0];

  return useQuery({
    queryKey: ['todayWater', chatId, today],
    queryFn: () => {
      if (!isSupabaseConfigured()) {
        throw new Error('Supabase не настроен');
      }
      console.log(`Запрос воды для chat_id: ${chatId}, дата: ${today}`);
      return supabaseRequest(`water_intake?chat_id=eq.${chatId}&date=eq.${today}`);
    },
    enabled: !!chatId && isSupabaseConfigured(),
    staleTime: 2 * 60 * 1000, // 2 минуты
    retry: false,
  });
};

// Вспомогательные функции для обработки данных
export const calculateTodayTotals = (meals: Meal[]) => {
  return meals.reduce((totals, meal) => ({
    calories: totals.calories + (meal.kcal || 0),
    protein: totals.protein + (meal.prot || 0),
    fat: totals.fat + (meal.fat || 0),
    carbs: totals.carbs + (meal.carb || 0),
  }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
};

export const getWeeklyCalorieData = (meals: Meal[]) => {
  const weekData = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayMeals = meals.filter(meal => 
      meal.eaten_at.startsWith(dateStr)
    );
    
    const totalCalories = dayMeals.reduce((sum, meal) => sum + (meal.kcal || 0), 0);
    
    weekData.push({
      day: date.toLocaleDateString('ru-RU', { weekday: 'short' }),
      calories: totalCalories,
      date: dateStr
    });
  }
  
  return weekData;
};

export const useMonthlyAnalytics = () => {
  const { user } = useAuth();
  const chatId = user?.id;

  // Получаем дату 5 месяцев назад
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);
  const dateStr = startDate.toISOString().split('T')[0];

  return useQuery({
    queryKey: ['monthlyAnalytics', chatId],
    queryFn: async () => {
      if (!chatId) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('chat_id', chatId)
        .gte('eaten_at', dateStr)
        .order('eaten_at', { ascending: true });

      if (error) throw error;

      // Группируем данные по месяцам
      const monthlyData = data.reduce((acc: { [key: string]: any[] }, meal) => {
        const date = new Date(meal.eaten_at);
        const monthKey = date.toLocaleString('ru-RU', { month: 'short' });
        
        if (!acc[monthKey]) {
          acc[monthKey] = [];
        }
        acc[monthKey].push(meal);
        return acc;
      }, {});

      // Вычисляем средние значения для каждого месяца
      const result = Object.entries(monthlyData).map(([month, meals]) => {
        const totals = meals.reduce((sum, meal) => ({
          calories: sum.calories + (meal.kcal || 0),
          protein: sum.protein + (meal.prot || 0),
          fat: sum.fat + (meal.fat || 0),
          carbs: sum.carbs + (meal.carb || 0),
        }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

        const daysInMonth = new Set(meals.map(meal => meal.eaten_at.split('T')[0])).size;
        
        return {
          month,
          calories: Math.round(totals.calories / daysInMonth),
          protein: Math.round(totals.protein / daysInMonth),
          fat: Math.round(totals.fat / daysInMonth),
          carbs: Math.round(totals.carbs / daysInMonth),
          daysWithData: daysInMonth
        };
      });

      // Сортируем по месяцам
      const monthOrder = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
      result.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

      // Вычисляем общую статистику
      const totalDays = result.reduce((sum, month) => sum + month.daysWithData, 0);
      const avgCalories = Math.round(result.reduce((sum, month) => sum + month.calories, 0) / result.length);
      const goalCompletion = result.length > 0 ? 
        Math.round((result.filter(month => month.calories > 0).length / result.length) * 100) : 0;

      return {
        monthlyData: result,
        stats: {
          totalDays,
          avgCalories,
          goalCompletion,
          monthsWithData: result.length
        }
      };
    },
    enabled: !!chatId,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
