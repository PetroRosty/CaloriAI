import { useState } from 'react';
import { User, LogOut, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import FeedbackForm from './FeedbackForm';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import ContactForm from './ContactForm';

const Header = () => {
  const { user, logout, signOut } = useAuth();
  const { toast } = useToast();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "До свидания!",
      description: "Вы успешно вышли из системы.",
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-white shadow-[0_2px_16px_0_rgba(56,176,0,0.07)] rounded-b-[24px] mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-[#38B000] rounded-xl flex items-center justify-center shadow-sm">
                <img
                  className="h-6 w-6"
                  src="/logo.svg"
                  alt="Diet Dashboard"
                />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#222]">Мой дневник</h1>
              <p className="text-sm text-gray-500">Ваш путь к здоровому питанию</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-[#222] hover:text-[#38B000] hover:bg-[#F6FBF4]"
            >
              Обзор дня
            </Button>
            <Button
              variant="ghost"
              className="text-[#222] hover:text-[#38B000] hover:bg-[#F6FBF4]"
            >
              Рацион за неделю
            </Button>
            <Button
              variant="ghost"
              className="text-[#222] hover:text-[#38B000] hover:bg-[#F6FBF4]"
            >
              История приёмов пищи
            </Button>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsContactFormOpen(true)}
              variant="outline"
              className="text-[#222] border-[#E5E5E5] hover:bg-[#F6FBF4] hover:text-[#38B000] hover:border-[#38B000]"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Связаться с нами
            </Button>

            {user ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-[#222] border-[#E5E5E5] hover:bg-[#F6FBF4] hover:text-[#38B000] hover:border-[#38B000]"
                  >
                    {user.name || 'Профиль'}
                  </Button>
                </SheetTrigger>
                <SheetContent className="bg-white border-[#E5E5E5]">
                  <SheetHeader>
                    <SheetTitle className="text-[#222]">Профиль</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#F6FBF4] flex items-center justify-center">
                        <span className="text-[#38B000] font-semibold">
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-[#222]">{user.name || 'Пользователь'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    {user.is_pro && (
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#38B000] text-white">
                        PRO
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      className="w-full mt-4"
                      onClick={() => signOut()}
                    >
                      Выйти
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button
                variant="default"
                className="bg-[#38B000] hover:bg-[#2c8c00] text-white"
              >
                Войти
              </Button>
            )}
          </div>
        </div>
      </div>

      <ContactForm 
        isOpen={isContactFormOpen} 
        onOpenChange={setIsContactFormOpen} 
      />
    </header>
  );
};

export default Header;
