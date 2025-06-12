import { useTodayMeals, useUserProfile, calculateTodayTotals } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';

const MacroCards = () => {
  const { data: todayMeals, isLoading: mealsLoading } = useTodayMeals();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  if (mealsLoading || profileLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="glass-card p-4 min-h-[120px] flex flex-col justify-center"
          >
            <div className="h-6 w-1/3 mb-4 rounded bg-muted animate-pulse" />
            <div className="h-4 w-2/3 mb-2 rounded bg-muted animate-pulse" />
            <div className="h-3 w-full rounded bg-muted animate-pulse" />
          </Skeleton>
        ))}
      </div>
    );
  }

  const meals = todayMeals || [];
  const userProfile = profile?.[0];
  
  const totals = calculateTodayTotals(meals);
  
  // Цели из профиля или дефолтные значения
  const proteinGoal = userProfile?.daily_protein_goal || 150;
  const fatGoal = userProfile?.daily_fat_goal || 80;
  const carbsGoal = userProfile?.daily_carbs_goal || 220;

  const macros = [
    { 
      name: 'Белки', 
      current: Math.round(totals.protein), 
      target: proteinGoal, 
      unit: 'г', 
      color: '#38B000', 
      percentage: Math.round((totals.protein / proteinGoal) * 100) 
    },
    { 
      name: 'Жиры', 
      current: Math.round(totals.fat), 
      target: fatGoal, 
      unit: 'г', 
      color: '#38B000', 
      percentage: Math.round((totals.fat / fatGoal) * 100) 
    },
    { 
      name: 'Углеводы', 
      current: Math.round(totals.carbs), 
      target: carbsGoal, 
      unit: 'г', 
      color: '#38B000', 
      percentage: Math.round((totals.carbs / carbsGoal) * 100) 
    }
  ];

  if (meals.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {macros.map((macro, index) => (
          <div key={macro.name} className="glass-card p-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-[#222]">{macro.name}</h4>
              <span className="text-xs text-gray-500">0%</span>
            </div>
            <div className="flex items-end space-x-2 mb-3">
              <span className="text-xl font-bold text-[#222]">0</span>
              <span className="text-sm text-gray-500">/ {macro.target} {macro.unit}</span>
            </div>
            <div className="w-full bg-[#F6FBF4] rounded-full h-2">
              <div className="h-2 rounded-full bg-[#38B000] w-0"></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">Начните вести дневник питания</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {macros.map((macro, index) => (
        <div key={macro.name} className="glass-card p-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-[#222]">{macro.name}</h4>
            <span className="text-xs text-gray-500">{Math.min(macro.percentage, 100)}%</span>
          </div>
          <div className="flex items-end space-x-2 mb-3">
            <span className="text-xl font-bold text-[#222]">{macro.current}</span>
            <span className="text-sm text-gray-500">/ {macro.target} {macro.unit}</span>
          </div>
          <div className="w-full bg-[#F6FBF4] rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-[#38B000] transition-all duration-500"
              style={{ width: `${Math.min(macro.percentage, 100)}%` }}
            ></div>
          </div>
          {macro.percentage > 100 && (
            <div className="text-xs text-[#FF2E63] mt-1">Превышена норма на {macro.percentage - 100}%</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MacroCards;
