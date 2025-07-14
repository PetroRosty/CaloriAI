import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile, isSupabaseConfigured } from '@/hooks/useSupabaseData';
import CalorieChart from '@/components/CalorieChart';
import MacroCards from '@/components/MacroCards';
import LastMealCard from '@/components/LastMealCard';
import WaterIntake from '@/components/WaterIntake';
import WeeklyChart from '@/components/WeeklyChart';
import AIRecommendation from '@/components/AIRecommendation';
import MealHistory from '@/components/MealHistory';
import ActionCards from '@/components/ActionCards';
import ProAnalytics from '@/components/ProAnalytics';
import ProReports from '@/components/ProReports';
import DatabaseStatus from '@/components/DatabaseStatus';
import { MessageSquare, RefreshCw, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { testSupabaseConnection } from '@/lib/supabase';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTodayMeals, useUserProfile, calculateTodayTotals } from '@/hooks/useSupabaseData';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useUserMeals, getWeeklyCalorieData } from '@/hooks/useSupabaseData';
import { Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import React from 'react';
import html2canvas from 'html2canvas';

const HeroProgress = () => {
  const isMobile = useIsMobile();
  const { data: todayMeals, isLoading: mealsLoading } = useTodayMeals();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  if (!isMobile) return null;
  if (mealsLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-40 h-40 animate-pulse rounded-full bg-gray-200" />
      </div>
    );
  }
  const meals = todayMeals || [];
  const userProfile = profile?.[0];
  const dailyGoal = userProfile?.daily_calories_goal || 2200;
  const totals = calculateTodayTotals(meals);
  const consumed = totals.calories;
  const percentage = Math.min(100, Math.round((consumed / dailyGoal) * 100));
  const radius = 90;
  const stroke = 14;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const progress = (percentage / 100) * circumference;
  return (
    <div className="flex flex-col items-center justify-center py-8 w-full">
      <div className="relative w-full flex justify-center">
        <svg height={radius * 2} width={radius * 2} className="block" style={{ maxWidth: '90vw' }}>
          <circle
            stroke="#E5E7EB"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="#38B000"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.4,2,.3,1)' }}
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="2.8rem"
            fontWeight="bold"
            fill="#222"
          >
            {percentage}%
          </text>
          <text
            x="50%"
            y="62%"
            textAnchor="middle"
            fontSize="0.95rem"
            fill="#9ca3af"
          >
            цель
          </text>
        </svg>
      </div>
      <div className="mt-4 text-base font-medium text-[#38B000] text-center px-2 opacity-80">
        На пути к цели
      </div>
    </div>
  );
};

const MobileMealsCarousel = () => {
  const isMobile = useIsMobile();
  const { data: meals, isLoading } = useUserMeals(3);

  if (!isMobile) return null;
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="w-24 h-24 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }
  const mealsData = meals || [];
  if (mealsData.length === 0) {
    return (
      <div className="text-center text-gray-300 py-4 text-sm">Нет приёмов пищи</div>
    );
  }
  const getMealTypeIcon = (type) => {
    switch (type) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      default: return '🍽️';
    }
  };
  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };
  return (
    <div className="w-full px-1 pb-2">
      <Carousel opts={{ align: 'start' }} className="w-full max-w-full">
        <CarouselContent className="-ml-2">
          {mealsData.slice(0, 10).map((meal, idx) => (
            <CarouselItem key={meal.id || idx} className="pl-2 max-w-[220px] min-w-[180px]">
              <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-4 flex flex-col items-center min-h-[160px]">
                <div className="w-12 h-12 mb-2 bg-gradient-to-br from-[#38B000] to-[#3B82F6] rounded-xl flex items-center justify-center text-2xl">
                  {getMealTypeIcon(meal.meal_type)}
                </div>
                <div className="font-semibold text-[#222] text-base truncate w-full text-center mb-1">{meal.dish}</div>
                <div className="flex items-center text-xs text-gray-400 mb-1">
                  <Clock className="w-3 h-3 text-[#3B82F6] mr-1" />
                  {formatTime(meal.eaten_at)}
                </div>
                <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-400 mt-1">
                  <span className="text-[#38B000] font-medium">{meal.kcal} ккал</span>
                  <span>Б: {Math.round(meal.prot || 0)}г</span>
                  <span>Ж: {Math.round(meal.fat || 0)}г</span>
                  <span>У: {Math.round(meal.carb || 0)}г</span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

const MobileMacros = () => {
  const isMobile = useIsMobile();
  const { data: todayMeals, isLoading: mealsLoading } = useTodayMeals();
  const { data: profile, isLoading: profileLoading } = useUserProfile();

  if (!isMobile) return null;
  if (mealsLoading || profileLoading) {
    return (
      <div className="flex flex-col gap-4 py-2">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 rounded-2xl w-full" />
        ))}
      </div>
    );
  }
  const meals = todayMeals || [];
  const userProfile = profile?.[0];
  const proteinGoal = userProfile?.daily_protein_goal || 150;
  const fatGoal = userProfile?.daily_fat_goal || 80;
  const carbsGoal = userProfile?.daily_carbs_goal || 220;
  const totals = calculateTodayTotals(meals);
  const macros = [
    {
      name: 'Белки',
      value: Math.round(totals.protein),
      goal: proteinGoal,
      color: '#38B000',
      bg: 'bg-[#38B000]/10',
      bar: 'bg-[#38B000]'
    },
    {
      name: 'Жиры',
      value: Math.round(totals.fat),
      goal: fatGoal,
      color: '#D7263D',
      bg: 'bg-[#D7263D]/10',
      bar: 'bg-[#D7263D]'
    },
    {
      name: 'Углеводы',
      value: Math.round(totals.carbs),
      goal: carbsGoal,
      color: '#3B82F6',
      bg: 'bg-[#3B82F6]/10',
      bar: 'bg-[#3B82F6]'
    }
  ];
  return (
    <div className="flex flex-col gap-4 py-2 w-full">
      {macros.map((macro, idx) => {
        const percent = Math.min(100, Math.round((macro.value / macro.goal) * 100));
        return (
          <div key={macro.name} className={`rounded-2xl px-6 py-5 flex flex-col items-center ${macro.bg} shadow-md`}>
            <div className="flex items-end gap-2 mb-1">
              <span className="text-3xl font-bold" style={{ color: macro.color }}>{macro.value}</span>
              <span className="text-sm text-gray-400 font-medium">/ {macro.goal} г</span>
            </div>
            <div className="text-base font-semibold mb-2" style={{ color: macro.color }}>{macro.name}</div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all duration-500 ${macro.bar}`} style={{ width: `${percent}%` }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MobileWeeklyChart = () => {
  const isMobile = useIsMobile();
  const { data: weekMeals, isLoading, error } = useUserMeals(7);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!isMobile) return null;
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div className="w-full h-40 animate-pulse rounded-2xl bg-gray-200" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-gray-400 py-6">Ошибка загрузки графика</div>
    );
  }
  const meals = weekMeals || [];
  const data = getWeeklyCalorieData(meals);
  if (meals.length === 0) {
    return (
      <div className="text-center text-gray-400 py-6">Недостаточно данных для графика</div>
    );
  }
  // Примеры советов (можно расширить или сделать динамическими)
  const tips = [
    'Отличный день! Продолжай в том же духе.',
    'Попробуй добавить больше овощей.',
    'Хороший баланс калорий!',
    'Не забывай про воду 💧',
    'Молодец! Почти достиг цели.',
    'Старайся не пропускать приёмы пищи.',
    'Великолепно! Ты на верном пути.'
  ];
  return (
    <div className="w-full py-2">
      <div className="text-base font-bold text-[#222] mb-2 text-center opacity-80">Калории за неделю</div>
      <div className="relative w-full h-48 bg-white rounded-2xl shadow-md flex items-center justify-center">
        <ResponsiveContainer width="98%" height="90%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="day" stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis stroke="#6b7280" tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={v => `${v}`} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const idx = data.findIndex(d => d.day === label);
                  return (
                    <div className="bg-white rounded-xl shadow-lg p-3 border border-[#38B000]/30 text-[#222] text-sm max-w-[180px]">
                      <div className="font-semibold mb-1">{label}</div>
                      <div>Калории: <span className="font-bold text-[#38B000]">{payload[0].value}</span></div>
                      <div className="mt-2 text-gray-500">{tips[idx % tips.length]}</div>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: '#38B000', strokeWidth: 2, opacity: 0.2 }}
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#38B000"
              strokeWidth={3}
              dot={{
                fill: '#38B000',
                strokeWidth: 2,
                r: 7,
                onClick: (e, idx) => {
                  setActiveIndex(idx);
                  setShowTooltip(true);
                },
                style: { cursor: 'pointer' }
              }}
              activeDot={{ r: 11, fill: '#38B000', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const MobileBottomBar = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  if (!isMobile) return null;
  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-[0_-2px_16px_0_rgba(56,176,0,0.07)] md:hidden">
      <button className="flex flex-col items-center flex-1 text-2xl focus:outline-none">
        <span>🏠</span>
        <span className="text-xs mt-1">Домой</span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="flex flex-col items-center flex-1 text-2xl focus:outline-none" onClick={() => setOpen(true)}>
            <span>✈️</span>
            <span className="text-xs mt-1">Telegram</span>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавление приёмов пищи</DialogTitle>
            <DialogDescription>
              Добавление приёмов пищи доступно только через Telegram-бота.
            </DialogDescription>
          </DialogHeader>
          <a
            href="https://t.me/MyCalorAIBot"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full inline-flex justify-center items-center px-6 py-3 rounded-lg bg-[#38B000] text-white font-bold text-base shadow hover:bg-[#2c8c00] transition"
          >
            Открыть бота
          </a>
        </DialogContent>
      </Dialog>
      <button className="flex flex-col items-center flex-1 text-2xl focus:outline-none">
        <span>👤</span>
        <span className="text-xs mt-1">Профиль</span>
      </button>
    </div>
  );
};

const MobileShareButton = () => {
  const isMobile = useIsMobile();
  const { data: todayMeals } = useTodayMeals();
  const { data: profile } = useUserProfile();
  const userProfile = profile?.[0];
  const meals = todayMeals || [];
  const totals = calculateTodayTotals(meals);
  const proteinGoal = userProfile?.daily_protein_goal || 150;
  const fatGoal = userProfile?.daily_fat_goal || 80;
  const carbsGoal = userProfile?.daily_carbs_goal || 220;
  const dailyGoal = userProfile?.daily_calories_goal || 2200;
  const percent = Math.min(100, Math.round((totals.calories / dailyGoal) * 100));
  const ref = React.useRef(null);

  if (!isMobile) return null;

  const handleShare = async () => {
    if (!ref.current) return;
    const canvas = await html2canvas(ref.current, { backgroundColor: '#f0fdf4', scale: 2 });
    const dataUrl = canvas.toDataURL('image/png');
    if (navigator.share) {
      const blob = await (await fetch(dataUrl)).blob();
      try {
        await navigator.share({
          files: [new File([blob], 'result.png', { type: 'image/png' })],
          title: 'Мой результат дня',
          text: 'Мой прогресс в Diet Dashboard!'
        });
      } catch (e) {
        // пользователь отменил
      }
    } else {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'result.png';
      link.click();
    }
  };

  return (
    <>
      <div className="flex justify-center w-full mb-2 mt-2 md:hidden">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#38B000] text-white font-bold text-base shadow hover:bg-[#2c8c00] transition"
        >
          <Share2 className="w-5 h-5" />
          Поделиться результатом
        </button>
      </div>
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={ref} className="w-[320px] rounded-2xl bg-[#f0fdf4] p-6 flex flex-col items-center border border-[#38B000]/20 shadow-xl">
          <div className="text-xl font-bold mb-2 text-[#38B000]">Мой день</div>
          <div className="text-base mb-2 text-[#222]">{percent}% от цели</div>
          <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between w-full text-sm">
              <span className="font-semibold text-[#38B000]">Белки</span>
              <span>{Math.round(totals.protein)}/{proteinGoal} г</span>
            </div>
            <div className="flex justify-between w-full text-sm">
              <span className="font-semibold text-[#D7263D]">Жиры</span>
              <span>{Math.round(totals.fat)}/{fatGoal} г</span>
            </div>
            <div className="flex justify-between w-full text-sm">
              <span className="font-semibold text-[#3B82F6]">Углеводы</span>
              <span>{Math.round(totals.carbs)}/{carbsGoal} г</span>
            </div>
            <div className="flex justify-between w-full text-sm mt-2">
              <span className="font-semibold text-[#222]">Калории</span>
              <span>{Math.round(totals.calories)}/{dailyGoal} ккал</span>
            </div>
          </div>
          <div className="mt-4 text-xs text-[#b6c2b7]">diet-dashboard.ru</div>
        </div>
      </div>
    </>
  );
};

const MobileMainScreen = () => (
  <>
    <div className="bg-white rounded-3xl shadow-md px-3 py-6 mb-5">
      <HeroProgress />
    </div>
    <div className="bg-white rounded-3xl shadow-md px-3 py-5 mb-5">
      <MobileMealsCarousel />
    </div>
    <div className="bg-white rounded-3xl shadow-md px-3 py-5 mb-5">
      <MobileMacros />
    </div>
    <div className="bg-white rounded-3xl shadow-md px-3 py-5 mb-5">
      <MobileWeeklyChart />
    </div>
    <div className="bg-white rounded-3xl shadow-md px-3 py-4 mb-6 flex justify-center">
      <MobileShareButton />
    </div>
  </>
);

const MobileAnalyticsScreen = () => (
  <div className="bg-white rounded-3xl shadow-md px-3 py-6 mb-5">
    <ProAnalytics />
  </div>
);

const MobileHistoryScreen = () => (
  <div className="bg-white rounded-3xl shadow-md px-3 py-6 mb-5">
    <MealHistory />
  </div>
);

const MobileProfileScreen = () => {
  const { data: profile, isLoading } = useUserProfile();
  const userProfile = profile?.[0];
  if (isLoading) return <div className="p-8 text-center text-gray-400">Загрузка...</div>;
  if (!userProfile) return <div className="p-8 text-center text-gray-400">Нет данных профиля</div>;
  return (
    <div className="bg-white rounded-3xl shadow-md px-3 py-6 mb-5 flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-[#F6FBF4] flex items-center justify-center text-4xl font-bold text-[#38B000] mb-4">
        {userProfile.first_name?.[0] || 'U'}
      </div>
      <div className="text-xl font-bold text-[#222] mb-1">{userProfile.first_name} {userProfile.last_name}</div>
      <div className="text-sm text-gray-400 mb-2">@{userProfile.username}</div>
      <div className="text-base text-[#4b5563] mb-2">{userProfile.email}</div>
      <div className="text-base text-[#4b5563]">{userProfile.language_code}</div>
    </div>
  );
};

const MOBILE_TABS = [
  { key: 'main', icon: '🏠', label: 'Главная' },
  { key: 'analytics', icon: '📊', label: 'Аналитика' },
  { key: 'history', icon: '📅', label: 'История' },
  { key: 'profile', icon: '👤', label: 'Профиль' },
];

const MobileBottomTabBar = ({ activeTab, setActiveTab }) => (
  <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-gray-200 flex justify-around items-center h-16 shadow-[0_-2px_16px_0_rgba(56,176,0,0.07)] md:hidden">
    {MOBILE_TABS.map(tab => (
      <button
        key={tab.key}
        className={`flex flex-col items-center flex-1 text-2xl focus:outline-none ${activeTab === tab.key ? 'text-[#38B000]' : 'text-[#222]'}`}
        onClick={() => setActiveTab(tab.key)}
      >
        <span>{tab.icon}</span>
        <span className="text-xs mt-1">{tab.label}</span>
      </button>
    ))}
  </div>
);

const Index = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { data: profileData, isLoading: profileLoading, error: profileError } = useUserProfile();
  const [isTesting, setIsTesting] = useState(false);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('main');
  
  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const result = await testSupabaseConnection();
      console.log('Connection test result:', result);
    } catch (error) {
      console.error('Connection test error:', error);
    } finally {
      setIsTesting(false);
    }
  };
  
  // Показываем состояние загрузки
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-fitness-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован, показываем сообщение
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">Требуется авторизация</h1>
          <p className="text-gray-400">Пожалуйста, войдите в систему через Telegram</p>
        </div>
      </div>
    );
  }

  // Если есть ошибка загрузки профиля, показываем сообщение
  if (profileError) {
    console.error('Error loading profile:', profileError);
  }
  
  const getUserName = () => {
    if (profileData && profileData.length > 0) {
      const profile = profileData[0];
      return profile.first_name || user?.name || 'Пользователь';
    }
    return user?.name || 'Пользователь';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] to-[#f7faf7] pb-20">
      <Header />
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-8">
        {/* Мобильные табы */}
        {isMobile && (
          <>
            {activeTab === 'main' && <MobileMainScreen />}
            {activeTab === 'analytics' && <MobileAnalyticsScreen />}
            {activeTab === 'history' && <MobileHistoryScreen />}
            {activeTab === 'profile' && <MobileProfileScreen />}
          </>
        )}
        {/* Desktop и остальной layout */}
        {!isMobile && (
          <>
            <div className="mb-6 sm:mb-8">
              <DatabaseStatus />
            </div>
            <div className="glass-card mb-6 sm:mb-10 fade-in w-full max-w-full p-2 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold card-title mb-2 text-[#222]">Добро пожаловать, {profileLoading ? 'Загрузка...' : getUserName()}!</h1>
                  <p className="card-subtitle text-[#4b5563]">Отслеживайте свой прогресс и достигайте целей</p>
                </div>
                {/* Кнопка обновления БД для мобильных устройств */}
                {isSupabaseConfigured() && (
                  <div className="md:hidden ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleTestConnection}
                      disabled={isTesting}
                      className="w-10 h-10 p-0 bg-white/80 backdrop-blur-sm border border-green-400/30 rounded-full shadow-lg hover:bg-white/90"
                    >
                      <RefreshCw className={`w-4 h-4 text-green-600 ${isTesting ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-8">
              {/* Левая колонка */}
              <div className="lg:col-span-8 space-y-2 sm:space-y-8">
                {/* Обзор дня */}
                <section id="overview" className="glass-card fade-in w-full max-w-full p-2 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold card-title mb-4 text-[#222]">Обзор дня</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <CalorieChart />
                    <LastMealCard />
                    <WaterIntake />
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <MacroCards />
                  </div>
                </section>
                {/* График за неделю */}
                <section id="weekly" className="glass-card fade-in w-full max-w-full p-2 sm:p-6">
                  <WeeklyChart />
                </section>
                {/* PRO Аналитика */}
                <section className="glass-card fade-in w-full max-w-full p-2 sm:p-6">
                  <ProAnalytics />
                </section>
                {/* AI рекомендации */}
                <section className="glass-card fade-in w-full max-w-full p-2 sm:p-6">
                  <AIRecommendation />
                </section>
                {/* История приёмов пищи */}
                <section id="history" className="glass-card fade-in w-full max-w-full p-2 sm:p-6">
                  <MealHistory />
                </section>
              </div>
              {/* Правая колонка */}
              <div className="lg:col-span-4 space-y-2 sm:space-y-8">
                <section className="glass-card fade-in w-full max-w-full p-2 sm:p-6">
                  <ActionCards />
                </section>
                {/* PRO блоки */}
                <section className="glass-card fade-in w-full max-w-full p-2 sm:p-6">
                  <div className="text-center py-6 sm:py-8">
                    <div className="text-4xl mb-3">👨‍⚕️</div>
                    <p className="text-base sm:text-lg font-semibold mb-2 text-[#1e3a1a]">Чат с нутрициологом</p>
                    <p className="text-sm text-[#4b5563]">Скоро вы сможете общаться с профессиональным нутрициологом и получать персональные рекомендации!</p>
                  </div>
                </section>
                <section className="glass-card fade-in w-full max-w-full p-2 sm:p-6">
                  <ProReports />
                </section>
              </div>
            </div>
          </>
        )}
      </main>
      {isMobile && <MobileBottomTabBar activeTab={activeTab} setActiveTab={setActiveTab} />}
    </div>
  );
};

export default Index;
