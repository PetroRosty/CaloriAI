export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  isPro?: boolean;
  loginMethod?: 'telegram' | 'email';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
  language_code?: string;
  id_str?: string;
  auth_date_str?: string;
  check_string?: string;
  check_hash?: string;
}
