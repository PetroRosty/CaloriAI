import { useTodayMeals, useUserProfile, calculateTodayTotals } from '@/hooks/useSupabaseData';
import { Skeleton } from '@/components/ui/skeleton';

const macroColors = [
  '#38B000', // Белки — зелёный
  '#D7263D', // Жиры — бордовый
  '#3B82F6', // Углеводы — синий
];

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
      color: macroColors[0],
      percentage: Math.round((totals.protein / proteinGoal) * 100),
      shortName: 'Б'
    },
    { 
      name: 'Жиры', 
      current: Math.round(totals.fat), 
      target: fatGoal, 
      unit: 'г', 
      color: macroColors[1],
      percentage: Math.round((totals.fat / fatGoal) * 100),
      shortName: 'Ж'
    },
    { 
      name: 'Углеводы', 
      current: Math.round(totals.carbs), 
      target: carbsGoal, 
      unit: 'г', 
      color: macroColors[2],
      percentage: Math.round((totals.carbs / carbsGoal) * 100),
      shortName: 'У'
    }
  ];

  if (meals.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {macros.map((macro, index) => (
          <div key={macro.name} className="relative bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-5 flex flex-col items-start min-h-[120px] overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
            {/* Цветная полоска */}
            <div className="absolute left-0 top-4 bottom-4 w-1.5 rounded-full" style={{ background: macro.color, opacity: 0.7 }} />
            <div className="flex items-center justify-between w-full mb-2">
              <h4 className="text-sm font-medium text-[#222]">{macro.name}</h4>
              <span className="text-xs text-gray-500">0%</span>
            </div>
            <div className="flex items-end gap-2 mb-2 w-full">
              <span className="inline-block w-2 h-2 rounded-full" style={{ background: macro.color, opacity: 0.8 }} />
              <span className="text-3xl font-extrabold text-[#222] leading-none">0</span>
              <span className="text-sm text-gray-500">/ {macro.target} {macro.unit}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div className="h-2 rounded-full" style={{ background: macro.color, width: '0%' }}></div>
            </div>
            <div className="text-xs text-gray-500">Начните вести дневник питания</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {macros.map((macro, index) => (
        <div key={macro.name} className="relative bg-white/70 backdrop-blur-lg shadow-2xl rounded-2xl p-5 flex flex-col items-start min-h-[120px] overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          {/* Цветная полоска */}
          <div className="absolute left-0 top-4 bottom-4 w-1.5 rounded-full" style={{ background: macro.color, opacity: 0.7 }} />
          <div className="flex items-center justify-between w-full mb-2">
            <h4 className="text-sm font-medium text-[#222]">{macro.name}</h4>
            <span className="text-xs text-gray-500">{Math.min(macro.percentage, 100)}%</span>
          </div>
          <div className="flex items-end gap-2 mb-2 w-full">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: macro.color, opacity: 0.8 }} />
            <span className="text-3xl font-extrabold text-[#222] leading-none">{macro.current}</span>
            <span className="text-sm text-gray-500">/ {macro.target} {macro.unit}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ background: macro.color, width: `${Math.min(macro.percentage, 100)}%` }}
            ></div>
          </div>
          {macro.percentage > 100 && (
            <div className="text-xs text-[#FF2E63] mb-2">Превышена норма на {macro.percentage - 100}%</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MacroCards;
