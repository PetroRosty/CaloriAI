import { useTodayWater } from '@/hooks/useSupabaseData';
import { Droplets } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const WaterIntake = () => {
  const { data: waterData, isLoading, error } = useTodayWater();
  
  if (isLoading) {
    return (
      <Skeleton className="glass-card p-6 min-h-[120px] flex flex-col animate-fade-in">
        <div className="h-6 w-1/3 mb-4 rounded bg-muted animate-pulse" />
        <div className="h-10 w-full rounded bg-muted animate-pulse" />
      </Skeleton>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-bold text-[#222] mb-4">Потребление воды</h3>
        <div className="text-center text-gray-400 py-4">
          <Droplets className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Ошибка загрузки данных о воде</p>
        </div>
      </div>
    );
  }

  const waters = waterData || [];
  const current = waters.reduce((sum, water) => sum + (water.amount || 0), 0);
  const target = 3.0; // Дневная цель в литрах
  const percentage = (current / target) * 100;

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-lg font-bold text-[#222] mb-4">Потребление воды</h3>
      <div className="flex items-center space-x-4">
        <div className="text-4xl">💧</div>
        <div className="flex-1">
          <div className="flex items-end space-x-2 mb-2">
            <span className="text-2xl font-bold text-[#38B000]">
              {current > 0 ? current.toFixed(1) : '0.0'}
            </span>
            <span className="text-sm text-gray-500">/ {target} л</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-[#38B000] transition-all duration-500"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {current > 0 ? (
              `${Math.round(percentage)}% от дневной нормы`
            ) : (
              'Начните отслеживать потребление воды'
            )}
          </div>
          {percentage >= 100 && (
            <div className="text-xs text-[#38B000] mt-1 font-medium">
              🎉 Дневная норма выполнена!
            </div>
          )}
        </div>
      </div>
      {current === 0 && (
        <div className="mt-3 text-xs text-gray-400 text-center">
          Добавляйте потребление воды через Telegram-бот
        </div>
      )}
    </div>
  );
};

export default WaterIntake;
