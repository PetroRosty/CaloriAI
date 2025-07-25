import { AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useUserProfile, isSupabaseConfigured } from '@/hooks/useSupabaseData';
import { testSupabaseConnection } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const DatabaseStatus = () => {
  const { error, isLoading } = useUserProfile();
  const [isTesting, setIsTesting] = useState(false);

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

  if (isLoading) {
    return (
      <Skeleton className="glass-card p-4 min-h-[80px] flex flex-col animate-fade-in">
        <div className="h-6 w-1/3 mb-4 rounded bg-muted animate-pulse" />
        <div className="h-6 w-full rounded bg-muted animate-pulse" />
      </Skeleton>
    );
  }

  // Проверяем конфигурацию Supabase
  if (!isSupabaseConfigured()) {
    return (
      <div className="glass-card p-4 mb-6 border-yellow-500/30 bg-yellow-500/10">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <div>
            <h4 className="text-yellow-400 font-medium">Supabase не настроен</h4>
            <p className="text-gray-300 text-sm">
              Для работы с данными необходимо настроить подключение к Supabase. 
              Нажмите на зеленую кнопку Supabase в правом верхнем углу.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        {/* Десктопная версия */}
        <div className="hidden md:block glass-card p-4 mb-6 border-red-500/30 bg-red-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <WifiOff className="w-5 h-5 text-red-400" />
              <div>
                <h4 className="text-red-400 font-medium">Проблема с подключением к базе данных</h4>
                <p className="text-gray-300 text-sm">
                  Не удается загрузить данные из Supabase. Проверьте настройки подключения.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="border-red-400/30 text-red-400 hover:bg-red-400/10"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isTesting ? 'animate-spin' : ''}`} />
              Проверить подключение
            </Button>
          </div>
        </div>
        
        {/* Мобильная версия - unobtrusive сообщение внизу */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
          <div className="bg-red-500/90 backdrop-blur-sm border border-red-400/30 rounded-lg p-3 shadow-lg">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">Ошибка подключения к базе данных</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Десктопная версия */}
      <div className="hidden md:block glass-card p-3 mb-6 border-green-500/30 bg-green-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Подключено к базе данных</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            disabled={isTesting}
            className="border-green-400/30 text-green-400 hover:bg-green-400/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isTesting ? 'animate-spin' : ''}`} />
            Проверить подключение
          </Button>
        </div>
      </div>
      
      {/* Мобильная версия - скрыта, кнопка будет в блоке приветствия */}
    </>
  );
};

export default DatabaseStatus;
