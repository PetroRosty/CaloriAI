import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useUserMeals, getWeeklyCalorieData } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';

const WeeklyChart = () => {
  const { data: weekMeals, isLoading, error } = useUserMeals(7);

  if (isLoading) {
    return (
      <Skeleton className="glass-card p-6 min-h-[220px] flex flex-col animate-fade-in">
        <div className="h-6 w-1/3 mb-4 rounded bg-muted animate-pulse" />
        <div className="h-48 w-full rounded bg-muted animate-pulse" />
      </Skeleton>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-[#222] mb-6">Рацион за неделю</h3>
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
          <h3 className="text-lg font-semibold text-[#222]">Рацион за неделю</h3>
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
        <h3 className="text-lg font-semibold text-[#222]">Рацион за неделю</h3>
        <div className="text-right">
          <div className="text-sm text-[#4b5563]">Среднее за день</div>
          <div className="text-lg font-semibold text-[#38B000]">{avgCalories.toLocaleString()} ккал</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="day" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => `${value.toLocaleString()} ккал`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', 
              border: '1px solid rgba(0, 0, 0, 0.1)', 
              borderRadius: '8px',
              backdropFilter: 'blur(12px)'
            }}
            labelStyle={{ color: '#222', fontSize: 14 }}
            formatter={(value: number) => [`${value.toLocaleString()} ккал`, 'Калории']}
            labelFormatter={(label) => `День: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="calories" 
            stroke="#38B000" 
            strokeWidth={3}
            dot={{ fill: '#38B000', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#38B000', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 flex justify-between items-center text-sm">
        <div className="text-gray-400">
          Общее потребление за неделю: <span className="text-[#222] font-semibold">{totalCalories.toLocaleString()} ккал</span>
        </div>
        <div className="text-gray-400">
          Дней с данными: <span className="text-[#222] font-semibold">{data.filter(day => day.calories > 0).length}</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChart;
