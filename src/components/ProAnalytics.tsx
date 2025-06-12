import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMonthlyAnalytics } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Calendar, Target, HelpCircle } from 'lucide-react';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Выносим карточку статистики в отдельный компонент
const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  tooltipText,
  gradientFrom,
  gradientTo,
  borderColor
}: { 
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  tooltipText: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
}) => (
  <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} p-4 rounded-lg border ${borderColor}`}>
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2 min-w-0">
        <Icon className="w-4 h-4 text-fitness-purple flex-shrink-0" />
        <span className="text-sm text-gray-400 truncate">{title}</span>
      </div>
      <TooltipProvider>
        <UITooltip>
          <TooltipTrigger asChild>
            <button className="text-gray-500 hover:text-gray-400 transition-colors flex-shrink-0 ml-2">
              <HelpCircle className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="bg-gray-800 border-gray-700 text-gray-200 max-w-[250px] p-3">
            <p className="text-sm">{tooltipText}</p>
          </TooltipContent>
        </UITooltip>
      </TooltipProvider>
    </div>
    <div className="text-xl sm:text-2xl font-bold text-[#1e3a1a] truncate">{value}</div>
    <div className="text-xs text-gray-400 mt-1 truncate">{subtitle}</div>
  </div>
);

const ProAnalytics = () => {
  const { data, isLoading, error } = useMonthlyAnalytics();

  if (isLoading) {
    return (
      <Card className="glass-card animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-fitness-purple" />
            <span>Аналитика питания</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <Skeleton className="h-[300px]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-card animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-500">
            <TrendingUp className="w-5 h-5" />
            <span>Ошибка загрузки данных</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Не удалось загрузить данные аналитики. Пожалуйста, попробуйте позже.</p>
        </CardContent>
      </Card>
    );
  }

  const { monthlyData, stats } = data;

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-fitness-purple" />
          <span>Аналитика питания</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Статистика */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Дней с данными"
              value={stats.totalDays}
              subtitle={`за ${stats.monthsWithData} ${stats.monthsWithData === 1 ? 'месяц' : 'месяцев'}`}
              icon={Calendar}
              tooltipText="Количество дней, за которые у вас есть записи о питании. Чем больше дней, тем точнее анализ."
              gradientFrom="from-fitness-purple/20"
              gradientTo="to-fitness-blue/20"
              borderColor="border-fitness-purple/30"
            />

            <StatCard
              title="Средние калории"
              value={`${stats.avgCalories.toLocaleString()} ккал`}
              subtitle="в день"
              icon={TrendingUp}
              tooltipText="Среднее количество калорий, потребляемых за день. Рассчитывается на основе всех дней с данными."
              gradientFrom="from-fitness-blue/20"
              gradientTo="to-fitness-green/20"
              borderColor="border-fitness-blue/30"
            />

            <StatCard
              title="Выполнение целей"
              value={`${stats.goalCompletion}%`}
              subtitle="месяцев с данными"
              icon={Target}
              tooltipText="Процент месяцев, в которых вы достигли своих целей по питанию. Учитываются все месяцы с данными."
              gradientFrom="from-fitness-green/20"
              gradientTo="to-fitness-purple/20"
              borderColor="border-fitness-green/30"
            />
          </div>

          {/* График */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
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
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                  formatter={(value: number) => [`${value.toLocaleString()} ккал`, 'Калории']}
                />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#8B5CF6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Дополнительная информация */}
          <div className="text-sm text-gray-400 text-center">
            Данные обновляются каждые 5 минут. График показывает среднее потребление калорий по месяцам.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProAnalytics;
