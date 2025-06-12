import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUserMeals, getWeeklyCalorieData } from '@/hooks/useSupabaseData';
import { Loader2 } from 'lucide-react';

const WeeklyChart = () => {
  const { data: weekMeals, isLoading, error } = useUserMeals(7);

  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-6">Рацион за неделю</h3>
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 text-fitness-blue animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-6">Рацион за неделю</h3>
        <div className="text-center text-gray-400 py-8">
          <p>Ошибка загрузки данных за неделю</p>
        </div>
      </div>
    );
  }

  const meals = weekMeals || [];
  const data = getWeeklyCalorieData(meals);

  if (meals.length === 0) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Рацион за неделю</h3>
        </div>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-300 mb-2">Недостаточно данных для графика</p>
          <p className="text-sm text-gray-400">Ведите дневник питания несколько дней, чтобы увидеть тренды</p>
        </div>
      </div>
    );
  }

  const totalCalories = data.reduce((sum, day) => sum + day.calories, 0);
  const avgCalories = Math.round(totalCalories / 7);

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Рацион за неделю</h3>
        <div className="text-right">
          <div className="text-sm text-gray-400">Среднее за день</div>
          <div className="text-lg font-semibold text-fitness-blue">{avgCalories.toLocaleString()} ккал</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="day" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            tickFormatter={(value) => `${value.toLocaleString()} ккал`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(17, 24, 39, 0.9)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '8px',
              backdropFilter: 'blur(12px)'
            }}
            labelStyle={{ color: '#F3F4F6' }}
            formatter={(value: number) => [`${value.toLocaleString()} ккал`, 'Калории']}
            labelFormatter={(label) => `День: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="calories" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 flex justify-between items-center text-sm">
        <div className="text-gray-400">
          Общее потребление за неделю: <span className="text-white font-semibold">{totalCalories.toLocaleString()} ккал</span>
        </div>
        <div className="text-gray-400">
          Дней с данными: <span className="text-white font-semibold">{data.filter(day => day.calories > 0).length}</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChart;
