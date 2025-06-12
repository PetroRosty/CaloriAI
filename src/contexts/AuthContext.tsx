import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, TelegramUser } from '@/types/auth';
import { supabase } from '@/lib/supabase';

interface AuthContextType extends AuthState {
  logout: () => void;
  setAuthenticatedUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        isAuthenticated: true, 
        user: action.payload, 
        isLoading: false,
        error: null
      };
    case 'LOGIN_ERROR':
      return { 
        isAuthenticated: false, 
        user: null, 
        isLoading: false,
        error: 'Ошибка авторизации'
      };
    case 'LOGOUT':
      return { 
        isAuthenticated: false, 
        user: null, 
        isLoading: false,
        error: null
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    default:
      return state;
  }
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Проверяем наличие сохраненного пользователя
        const savedUser = localStorage.getItem('diet-diary-user');
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser);
            // Проверяем валидность данных пользователя
            if (user && user.id && user.name) {
              // Проверяем, не истек ли срок хранения (7 дней)
              const savedDate = localStorage.getItem('diet-diary-user-date');
              if (savedDate) {
                const savedTimestamp = parseInt(savedDate, 10);
                const now = Date.now();
                const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 дней в миллисекундах
                
                if (now - savedTimestamp < sevenDays) {
                  dispatch({ type: 'LOGIN_SUCCESS', payload: user });
                } else {
                  // Если данные устарели, очищаем их
                  localStorage.removeItem('diet-diary-user');
                  localStorage.removeItem('diet-diary-user-date');
                  dispatch({ type: 'LOGIN_ERROR' });
                }
              } else {
                // Если нет даты сохранения, считаем данные устаревшими
                localStorage.removeItem('diet-diary-user');
                dispatch({ type: 'LOGIN_ERROR' });
              }
            } else {
              throw new Error('Invalid user data');
            }
          } catch (error) {
            console.error('Error parsing saved user:', error);
            localStorage.removeItem('diet-diary-user');
            localStorage.removeItem('diet-diary-user-date');
            dispatch({ type: 'LOGIN_ERROR' });
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'LOGIN_ERROR' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const setAuthenticatedUser = (user: User) => {
    try {
      if (!user || !user.id || !user.name) {
        throw new Error('Invalid user data');
      }
      
      // Сохраняем пользователя и дату сохранения
      localStorage.setItem('diet-diary-user', JSON.stringify(user));
      localStorage.setItem('diet-diary-user-date', Date.now().toString());
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      console.log('Authentication state updated with user:', user);
    } catch (error) {
      console.error('Error setting authenticated user:', error);
      dispatch({ type: 'LOGIN_ERROR' });
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('diet-diary-user');
      localStorage.removeItem('diet-diary-user-date');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      logout,
      setAuthenticatedUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
