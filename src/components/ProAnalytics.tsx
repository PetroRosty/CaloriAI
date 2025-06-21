import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMonthlyAnalytics } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Calendar, Target, HelpCircle } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Новый glassmorphism StatCard
const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  tooltipText
}: { 
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  tooltipText: string;
}) => (
  <div className="relative bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-5 flex flex-col items-start min-h-[120px] overflow-hidden">
    {/* Зелёная акцентная полоска */}
    <div className="absolute left-0 top-4 bottom-4 w-1 bg-[#38B000]/70 rounded-full" />
    <div className="flex items-center mb-2 w-full">
      <div className="flex items-center space-x-2 min-w-0">
        <Icon className="w-5 h-5 text-[#38B000] flex-shrink-0" />
        <span className="text-sm text-gray-500 font-medium truncate">{title}</span>
      </div>
      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <button className="ml-auto text-gray-400 hover:text-[#38B000] transition-colors flex-shrink-0">
              <HelpCircle className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-white/90 border border-[#38B000]/20 text-[#222] max-w-[250px] p-3 shadow-xl">
            <p className="text-sm">{tooltipText}</p>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    </div>
    <div className="flex items-end gap-2 w-full">
      {/* Зелёная точка-акцент */}
      <span className="inline-block w-2 h-2 rounded-full bg-[#38B000] mb-1" />
      <span className="text-3xl font-extrabold text-[#222] leading-none">{value}</span>
    </div>
    <div className="text-xs text-gray-500 mt-2 font-medium">{subtitle}</div>
  </div>
);

const ProAnalytics = () => {
  const { data, isLoading, error } = useMonthlyAnalytics();

  if (isLoading) {
    return (
      <div className="glass-card animate-fade-in">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-6 h-6 text-[#38B000]" />
          <span className="text-2xl font-bold text-[#222]">Аналитика питания</span>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card animate-fade-in">
        <div className="flex items-center space-x-2 mb-4 text-red-500">
          <TrendingUp className="w-6 h-6" />
          <span className="text-2xl font-bold">Ошибка загрузки данных</span>
        </div>
        <p className="text-gray-400">Не удалось загрузить данные аналитики. Пожалуйста, попробуйте позже.</p>
      </div>
    );
  }

  const { monthlyData, stats } = data;

  return (
    <section className="glass-card animate-fade-in p-6 md:p-8 rounded-2xl shadow-2xl bg-white/70 backdrop-blur-lg">
      <div className="flex items-center space-x-3 mb-6">
        <TrendingUp className="w-7 h-7 text-[#38B000]" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#222] tracking-tight">Аналитика питания</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Дней с данными"
          value={stats.totalDays}
          subtitle={`за ${stats.monthsWithData} ${stats.monthsWithData === 1 ? 'месяц' : 'месяцев'}`}
          icon={Calendar}
          tooltipText="Количество дней, за которые у вас есть записи о питании. Чем больше дней, тем точнее анализ."
        />
        <StatCard
          title="Средние калории"
          value={`${stats.avgCalories.toLocaleString()} ккал`}
          subtitle="в день"
          icon={TrendingUp}
          tooltipText="Среднее количество калорий, потребляемых за день. Рассчитывается на основе всех дней с данными."
        />
        <StatCard
          title="Выполнение целей"
          value={`${stats.goalCompletion}%`}
          subtitle="месяцев с данными"
          icon={Target}
          tooltipText="Процент месяцев, в которых вы достигли своих целей по питанию. Учитываются все месяцы с данными."
        />
      </div>
      <div className="h-[300px] rounded-2xl bg-white/60 backdrop-blur-md shadow-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#D1FAE5" />
            <XAxis 
              dataKey="month" 
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
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid #38B00033',
                borderRadius: '0.75rem',
                color: '#222',
                boxShadow: '0 8px 32px 0 rgba(56,176,0,0.10)'
              }}
              labelStyle={{ color: '#38B000', fontWeight: 600 }}
              formatter={(value: number) => [`${value.toLocaleString()} ккал`, 'Калории']}
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#38B000"
              strokeWidth={3}
              dot={{ fill: '#38B000', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 8, fill: '#38B000', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="text-sm text-gray-500 text-center mt-4">
        Данные обновляются каждые 5 минут. График показывает среднее потребление калорий по месяцам.
      </div>
    </section>
  );
};

export default ProAnalytics;
