import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useUserMeals } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';

const MealHistory = () => {
  const { data: meals, isLoading, error } = useUserMeals(3); // Последние 3 дня
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <Skeleton className="bg-white p-6 min-h-[180px] flex flex-col animate-fade-in rounded-2xl border border-[#E5E5E5] shadow-sm">
        <div className="h-6 w-1/3 mb-4 rounded bg-muted animate-pulse" />
        <div className="h-20 w-full rounded bg-muted animate-pulse" />
      </Skeleton>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-sm animate-fade-in">
        <h3 className="text-lg font-semibold text-[#222] mb-6 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-[#38B000]" />
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
      <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-sm animate-fade-in">
        <h3 className="text-lg font-semibold text-[#222] mb-6 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-[#38B000]" />
          <span>История приёмов пищи</span>
        </h3>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-gray-400 mb-2">История питания пуста</p>
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
    <div className="bg-white p-6 rounded-2xl border border-[#E5E5E5] shadow-sm animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#222] flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-[#38B000]" />
          <span>История приёмов пищи</span>
        </h3>
        <span className="text-sm text-[#38B000]">{mealsData.length} записей</span>
      </div>
      <div className="space-y-4">
        {mealsData.slice(0, 3).map((meal, index) => (
          <div key={meal.id || index} className="flex items-center space-x-4 p-3 rounded-xl bg-[#F6FBF4] border border-[#E5E5E5] hover:bg-[#E0F2FE] transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[#38B000] to-[#3B82F6] rounded-lg flex items-center justify-center text-white text-lg">
                {getMealTypeIcon(meal.meal_type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-[#222] font-medium truncate">{meal.dish}</h4>
                <span className="text-xs text-[#38B000] font-medium">{meal.kcal} ккал</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                <Clock className="w-3 h-3 text-[#3B82F6]" />
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
      {mealsData.length > 3 && (
        <div className="text-center mt-4">
          <button
            className="text-[#3B82F6] hover:text-[#38B000] text-sm font-medium transition-colors"
            onClick={() => setShowAll(true)}
          >
            Показать все {mealsData.length} записей
          </button>
        </div>
      )}
      {showAll && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black bg-opacity-40" onClick={() => setShowAll(false)}>
          <div
            className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-4 max-h-[80vh] overflow-y-auto animate-fade-in"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-[#222]">Вся история приёмов пищи</h4>
              <button className="text-[#3B82F6] text-base" onClick={() => setShowAll(false)}>Закрыть</button>
            </div>
            <div className="space-y-3">
              {mealsData.map((meal, index) => (
                <div key={meal.id || index} className="flex items-center space-x-4 p-3 rounded-xl bg-[#F6FBF4] border border-[#E5E5E5]">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#38B000] to-[#3B82F6] rounded-lg flex items-center justify-center text-white text-lg">
                      {getMealTypeIcon(meal.meal_type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-[#222] font-medium truncate">{meal.dish}</h4>
                      <span className="text-xs text-[#38B000] font-medium">{meal.kcal} ккал</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                      <Clock className="w-3 h-3 text-[#3B82F6]" />
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
          </div>
        </div>
      )}
    </div>
  );
};

export default MealHistory;
