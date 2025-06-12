import { Calendar, Clock, Loader2 } from 'lucide-react';
import { useUserMeals } from '@/hooks/useSupabaseData';

const MealHistory = () => {
  const { data: meals, isLoading, error } = useUserMeals(3); // Последние 3 дня

  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>История приёмов пищи</span>
        </h3>
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-8 h-8 text-fitness-blue animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>История приёмов пищи</span>
        </h3>
        <div className="text-center text-gray-400 py-8">
          <p>Ошибка загрузки истории питания</p>
        </div>
      </div>
    );
  }

  const mealsData = meals || [];

  if (mealsData.length === 0) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>История приёмов пищи</span>
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-gray-300 mb-2">История питания пуста</p>
          <p className="text-sm text-gray-400">Добавьте приёмы пищи через Telegram-бот, чтобы они появились здесь</p>
        </div>
      </div>
    );
  }

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };

  const getMealTypeName = (type: string) => {
    switch (type) {
      case 'breakfast': return 'Завтрак';
      case 'lunch': return 'Обед';
      case 'dinner': return 'Ужин';
      case 'snack': return 'Перекус';
      default: return 'Приём пищи';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    }
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>История приёмов пищи</span>
        </h3>
        <span className="text-sm text-fitness-blue">{mealsData.length} записей</span>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {mealsData.slice(0, 10).map((meal, index) => (
          <div key={meal.id || index} className="flex items-center space-x-4 p-3 rounded-lg bg-glass-bg border border-glass-border hover:bg-gray-800/50 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-fitness-green to-fitness-blue rounded-lg flex items-center justify-center text-white text-lg">
                {getMealTypeIcon(meal.meal_type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-white font-medium truncate">{meal.dish}</h4>
                <span className="text-xs text-fitness-green font-medium">{meal.kcal} ккал</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400 mb-1">
                <Clock className="w-3 h-3" />
                <span>{formatTime(meal.eaten_at)}</span>
                <span>•</span>
                <span>{getMealTypeName(meal.meal_type)}</span>
                <span>•</span>
                <span>{formatDate(meal.eaten_at)}</span>
              </div>
              {(meal.prot || meal.fat || meal.carb) && (
                <div className="text-xs text-gray-500">
                  Б: {Math.round(meal.prot || 0)}г • Ж: {Math.round(meal.fat || 0)}г • У: {Math.round(meal.carb || 0)}г
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {mealsData.length > 10 && (
        <div className="text-center mt-4">
          <button className="text-fitness-blue hover:text-blue-400 text-sm font-medium transition-colors">
            Показать ещё {mealsData.length - 10} записей
          </button>
        </div>
      )}
    </div>
  );
};

export default MealHistory;
