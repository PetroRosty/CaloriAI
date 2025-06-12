import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ChatIdAuthHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setAuthenticatedUser, user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatId = params.get('chat_id');

    // Если пользователь уже авторизован и chat_id совпадает с текущим пользователем,
    // просто очищаем URL без показа сообщения
    if (user && user.id === chatId) {
      const newUrl = new URL(window.location.href);
      newUrl.search = '';
      window.history.replaceState({}, '', newUrl.toString());
      return;
    }

    // Если есть chat_id в URL, проверяем его
    if (chatId) {
      const checkChatId = async () => {
        try {
          const response = await fetch(`/api/auth/check-chat-id?chat_id=${chatId}`);
          const data = await response.json();

          if (response.ok && data.success) {
            // Создаем объект пользователя
            const newUser = {
              id: chatId,
              name: data.user.first_name + (data.user.last_name ? ' ' + data.user.last_name : ''),
              email: `${chatId}@telegram.user`,
              avatar: data.user.photo_url || null,
              isPro: data.user.is_pro || false,
              loginMethod: 'telegram' as const
            };

            // Проверяем, изменились ли данные пользователя
            const isNewLogin = !user || user.id !== newUser.id;

            // Обновляем состояние через AuthProvider (он сам сохранит в localStorage)
            setAuthenticatedUser(newUser);

            // Показываем сообщение только при новой авторизации
            if (isNewLogin) {
              toast({
                title: 'Успешная авторизация',
                description: `Добро пожаловать, ${newUser.name}!`,
              });
            }

            // Очищаем URL от параметров
            const newUrl = new URL(window.location.href);
            newUrl.search = '';
            window.history.replaceState({}, '', newUrl.toString());
          } else {
            // Если проверка не удалась, но у нас есть сохраненный пользователь с таким ID,
            // пробуем использовать его
            const savedUser = localStorage.getItem('diet-diary-user');
            if (savedUser) {
              try {
                const parsedUser = JSON.parse(savedUser);
                if (parsedUser && parsedUser.id === chatId) {
                  setAuthenticatedUser(parsedUser);
                  toast({
                    title: 'Восстановлена сессия',
                    description: `С возвращением, ${parsedUser.name}!`,
                  });
                  return;
                }
              } catch (error) {
                console.error('Error parsing saved user:', error);
              }
            }

            toast({
              title: 'Ошибка авторизации',
              description: 'Неверный chat_id или пользователь не найден',
              variant: 'destructive',
            });
            navigate('/');
          }
        } catch (error) {
          console.error('Error checking chat_id:', error);
          toast({
            title: 'Ошибка авторизации',
            description: 'Произошла ошибка при проверке chat_id',
            variant: 'destructive',
          });
          navigate('/');
        }
      };

      checkChatId();
    }
  }, [location.search, setAuthenticatedUser, toast, navigate, user]);

  return null; // Этот компонент не рендерит ничего
};

export default ChatIdAuthHandler; 