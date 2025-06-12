import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

const TestAuth = () => {
  const { setAuthenticatedUser, user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // Проверяем, есть ли chat_id в URL
    const params = new URLSearchParams(location.search);
    const chatId = params.get('chat_id');

    // Если есть chat_id в URL, не выполняем тестовую авторизацию
    if (chatId) {
      return;
    }

    // Если пользователь уже авторизован, не выполняем тестовую авторизацию
    if (user) {
      return;
    }

    // Создаем тестового пользователя
    const testUser = {
      id: '5841281611',
      name: 'Test User',
      email: '5841281611@telegram.user',
      avatar: null,
      isPro: true,
      loginMethod: 'telegram' as const
    };

    // Устанавливаем пользователя
    setAuthenticatedUser(testUser);

    // Показываем уведомление
    toast({
      title: 'Тестовый режим',
      description: 'Вы вошли в тестовый режим с ID: 5841281611',
    });
  }, [setAuthenticatedUser, toast, location.search, user]);

  return null;
};

export default TestAuth; 