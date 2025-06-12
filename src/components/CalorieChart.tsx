import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTodayMeals, useUserProfile, calculateTodayTotals } from '@/hooks/useSupabaseData';
import { Loader2 } from 'lucide-react';

const CalorieChart = () => {
  const { data: todayMeals, isLoading: mealsLoading, error: mealsError } = useTodayMeals();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  if (mealsLoading || profileLoading) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4">Калории сегодня</h3>
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-fitness-blue animate-spin" />
        </div>
      </div>
    );
  }

  if (mealsError) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4">Калории сегодня</h3>
        <div className="text-center text-gray-400 py-8">
          <p>Ошибка загрузки данных</p>
          <p className="text-sm">Проверьте подключение к базе данных</p>
        </div>
      </div>
    );
  }

  const meals = todayMeals || [];
  const userProfile = profile?.[0];
  const dailyGoal = userProfile?.daily_calories_goal || 2200;
  
  const totals = calculateTodayTotals(meals);
  const consumed = totals.calories;
  const remaining = Math.max(0, dailyGoal - consumed);

  if (meals.length === 0) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4">Калории сегодня</h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-gray-300 mb-2">Пока нет записей о питании</p>
          <p className="text-sm text-gray-400">Добавьте первый приём пищи через Telegram-бот!</p>
          <div className="mt-4 text-sm text-fitness-blue">
            Дневная цель: {dailyGoal} ккал
          </div>
        </div>
      </div>
    );
  }

  const data = [
    { name: 'Потреблено', value: consumed, color: '#3B82F6' },
    { name: 'Осталось', value: remaining, color: '#374151' }
  ];

  const percentage = Math.round((consumed / dailyGoal) * 100);

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-4">Калории сегодня</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{percentage}%</div>
              <div className="text-sm text-gray-400">от цели</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Потреблено</div>
            <div className="text-xl font-bold text-white">{consumed}</div>
            <div className="text-xs text-gray-500">ккал</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-1">Осталось</div>
            <div className="text-xl font-bold text-white">{remaining}</div>
            <div className="text-xs text-gray-500">ккал</div>
          </div>
        </div>
        <div className="mt-4 text-sm text-fitness-blue">
          Дневная цель: {dailyGoal} ккал
        </div>
      </div>
    </div>
  );
};

export default CalorieChart;
