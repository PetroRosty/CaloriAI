import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useSupabaseData';
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
import { MessageSquare } from 'lucide-react';

const Index = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { data: profileData, isLoading: profileLoading, error: profileError } = useUserProfile();
  
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
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] to-[#f7faf7]">
      <Header />
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <DatabaseStatus />
        </div>
        <div className="glass-card mb-6 sm:mb-10 fade-in w-full max-w-full p-2 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold card-title mb-2 text-[#222]">Добро пожаловать, {profileLoading ? 'Загрузка...' : getUserName()}!</h1>
          <p className="card-subtitle text-[#4b5563]">Отслеживайте свой прогресс и достигайте целей</p>
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
      </main>
    </div>
  );
};

export default Index;
