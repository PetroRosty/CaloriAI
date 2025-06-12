
import { useTodayWater } from '@/hooks/useSupabaseData';
import { Loader2, Droplets } from 'lucide-react';

const WaterIntake = () => {
  const { data: waterData, isLoading, error } = useTodayWater();
  
  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4">Потребление воды</h3>
        <div className="flex items-center justify-center h-20">
          <Loader2 className="w-6 h-6 text-fitness-blue animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4">Потребление воды</h3>
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
      <h3 className="text-lg font-semibold text-white mb-4">Потребление воды</h3>
      <div className="flex items-center space-x-4">
        <div className="text-4xl">💧</div>
        <div className="flex-1">
          <div className="flex items-end space-x-2 mb-2">
            <span className="text-2xl font-bold text-fitness-blue">
              {current > 0 ? current.toFixed(1) : '0.0'}
            </span>
            <span className="text-sm text-gray-400">/ {target} л</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="h-3 rounded-full bg-gradient-to-r from-fitness-blue to-fitness-green transition-all duration-500"
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
            <div className="text-xs text-fitness-green mt-1">
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
