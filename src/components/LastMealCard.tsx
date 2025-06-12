import { Clock, Loader2 } from 'lucide-react';
import { useTodayMeals } from '@/hooks/useSupabaseData';

const LastMealCard = () => {
  const { data: todayMeals, isLoading, error } = useTodayMeals();

  if (isLoading) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4">Последний приём пищи</h3>
        <div className="flex items-center justify-center h-20">
          <Loader2 className="w-6 h-6 text-fitness-blue animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4">Последний приём пищи</h3>
        <div className="text-center text-gray-400 py-4">
          <p className="text-sm">Ошибка загрузки данных</p>
        </div>
      </div>
    );
  }

  const meals = todayMeals || [];
  
  if (meals.length === 0) {
    return (
      <div className="glass-card p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-white mb-4">Последний приём пищи</h3>
        <div className="text-center py-4">
          <div className="text-4xl mb-3">🍽️</div>
          <p className="text-gray-300 text-sm mb-1">Пока нет записей о питании</p>
          <p className="text-xs text-gray-400">Добавьте первый приём пищи через Telegram-бот</p>
        </div>
      </div>
    );
  }

  // Сортируем по времени и берём последний
  const lastMeal = meals.sort((a, b) => 
    new Date(b.eaten_at).getTime() - new Date(a.eaten_at).getTime()
  )[0];

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🥗';
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

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getTimeAgo = (dateStr: string) => {
    const now = new Date();
    const mealTime = new Date(dateStr);
    const diffMs = now.getTime() - mealTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}ч ${diffMinutes}м назад`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}м назад`;
    } else {
      return 'только что';
    }
  };

  return (
    <div className="glass-card p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-white mb-4">Последний приём пищи</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-fitness-green to-fitness-blue rounded-lg flex items-center justify-center text-xl">
            {getMealTypeIcon(lastMeal.meal_type)}
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium">{lastMeal.dish}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{formatTime(lastMeal.eaten_at)}</span>
              <span>•</span>
              <span>{getMealTypeName(lastMeal.meal_type)}</span>
              <span>•</span>
              <span className="text-fitness-green">{lastMeal.kcal} ккал</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getTimeAgo(lastMeal.eaten_at)}
            </div>
          </div>
        </div>
        {(lastMeal.prot || lastMeal.fat || lastMeal.carb) && (
          <div className="text-xs text-gray-500">
            Белки: {Math.round(lastMeal.prot || 0)}г • Жиры: {Math.round(lastMeal.fat || 0)}г • Углеводы: {Math.round(lastMeal.carb || 0)}г
          </div>
        )}
      </div>
    </div>
  );
};

export default LastMealCard;
