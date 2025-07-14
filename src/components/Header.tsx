import { useState } from 'react';
import { User, LogOut, MessageSquare, Menu, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import FeedbackForm from './FeedbackForm';
import { useNavigate } from 'react-router-dom';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import ContactForm from './ContactForm';
import { useIsMobile } from '@/hooks/use-mobile';

const Header = () => {
  const { user, logout, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const isMobile = useIsMobile();

  // Динамическое имя пользователя: @username, имя или 'Гость'
  const displayName = user?.username
    ? `@${user.username}`
    : user?.name
      ? user.name
      : 'Гость';
  // Инициал для аватара
  const avatarInitial = user?.username
    ? user.username[0].toUpperCase()
    : user?.name
      ? user.name[0].toUpperCase()
      : 'U';

  const handleLogout = () => {
    logout();
    toast({
      title: "До свидания!",
      description: "Вы успешно вышли из системы.",
    });
    navigate('/');
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

  if (isMobile) {
    return (
      <header className="bg-white shadow-[0_2px_16px_0_rgba(56,176,0,0.07)] rounded-b-[24px] mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#38B000] rounded-xl flex items-center justify-center shadow-sm">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg font-bold text-[#222]">Мой дневник</h1>
            </div>
            {/* Кнопка профиля справа */}
            {user ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-[#222] border-[#E5E5E5] hover:bg-[#F6FBF4] hover:text-[#38B000] hover:border-[#38B000] w-10 h-10 p-0 rounded-full flex items-center justify-center"
                  >
                    <span className="font-semibold text-[#38B000]">{avatarInitial}</span>
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
                          {avatarInitial}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-[#222]">{displayName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full mt-4"
                      onClick={handleLogout}
                    >
                      Выйти
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button
                variant="default"
                className="bg-[#38B000] hover:bg-[#2c8c00] text-white w-20 h-10 text-sm"
              >
                Войти
              </Button>
            )}
          </div>
        </div>
      </header>
    );
  }
  // Desktop-версия (без изменений)
  return (
    <header className="bg-white shadow-[0_2px_16px_0_rgba(56,176,0,0.07)] rounded-b-[24px] mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-[#38B000] rounded-xl flex items-center justify-center shadow-sm">
                <Utensils className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-[#222]">Мой дневник</h1>
              <p className="text-xs sm:text-sm text-gray-500">Ваш путь к здоровому питанию</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-[#222] hover:text-[#38B000] hover:bg-[#F6FBF4]"
              onClick={() => scrollToSection('overview')}
            >
              Обзор дня
            </Button>
            <Button
              variant="ghost"
              className="text-[#222] hover:text-[#38B000] hover:bg-[#F6FBF4]"
              onClick={() => scrollToSection('weekly')}
            >
              Рацион за неделю
            </Button>
            <Button
              variant="ghost"
              className="text-[#222] hover:text-[#38B000] hover:bg-[#F6FBF4]"
              onClick={() => scrollToSection('history')}
            >
              История приёмов пищи
            </Button>
          </nav>

          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile Menu Trigger */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-[#222]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-3/4 sm:w-2/3 bg-white border-r-[#E5E5E5]">
                <SheetHeader>
                  <SheetTitle className="text-[#222]">Навигация</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-2 mt-6">
                  <Button
                    variant="ghost"
                    className="justify-start text-[#222] hover:text-[#38B000] hover:bg-[#F6FBF4]"
                    onClick={() => scrollToSection('overview')}
                  >
                    Обзор дня
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-[#222] hover:text-[#38B000] hover:bg-[#F6FBF4]"
                    onClick={() => scrollToSection('weekly')}
                  >
                    Рацион за неделю
                  </Button>
                  <Button
                    variant="ghost"
                    className="justify-start text-[#222] hover:text-[#38B000] hover:bg-[#F6FBF4]"
                    onClick={() => scrollToSection('history')}
                  >
                    История приёмов пищи
                  </Button>
                  <Button
                    onClick={() => {
                      setIsContactFormOpen(true);
                      // Close the sheet after clicking on contact button
                      const sheetCloseButton = document.querySelector('[data-radix-collection-item][data-state="open"]');
                      if (sheetCloseButton) {
                        (sheetCloseButton as HTMLElement).click();
                      }
                    }}
                    variant="outline"
                    className="justify-start text-[#222] border-[#E5E5E5] hover:bg-[#F6FBF4] hover:text-[#38B000] hover:border-[#38B000]"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Связаться с нами
                  </Button>
                </nav>
                <div className="mt-6 pt-4 border-t border-[#E5E5E5]">
                  {user ? (
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#F6FBF4] flex items-center justify-center">
                        <span className="text-[#38B000] font-semibold">
                          {avatarInitial}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-[#222]">{displayName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  ) : null} {/* Display user info or login button inside sheet */}
                  {user ? (
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Выйти
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      className="bg-[#38B000] hover:bg-[#2c8c00] text-white w-full"
                    >
                      Войти
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Contact Button */}
            <Button
              onClick={() => setIsContactFormOpen(true)}
              variant="outline"
              className="hidden md:flex text-[#222] border-[#E5E5E5] hover:bg-[#F6FBF4] hover:text-[#38B000] hover:border-[#38B000]"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Связаться с нами
            </Button>

            {/* Desktop/Mobile User Button */}
            {user ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden md:flex text-[#222] border-[#E5E5E5] hover:bg-[#F6FBF4] hover:text-[#38B000] hover:border-[#38B000] px-4 py-2"
                  >
                    {displayName}
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
                          {avatarInitial}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-[#222]">{displayName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full mt-4"
                      onClick={handleLogout}
                    >
                      Выйти
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button
                variant="default"
                className="hidden md:flex bg-[#38B000] hover:bg-[#2c8c00] text-white px-4 py-2"
              >
                Войти
              </Button>
            )}
            {/* Mobile user/login button: show only avatar initial on small screens */}
            {user ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className="md:hidden text-[#222] border-[#E5E5E5] hover:bg-[#F6FBF4] hover:text-[#38B000] hover:border-[#38B000] w-10 h-10 p-0 rounded-full flex items-center justify-center"
                  >
                    <span className="font-semibold text-[#38B000]">{avatarInitial}</span>
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
                          {avatarInitial}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-[#222]">{displayName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      className="w-full mt-4"
                      onClick={handleLogout}
                    >
                      Выйти
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button
                variant="default"
                className="md:hidden bg-[#38B000] hover:bg-[#2c8c00] text-white w-20 h-10 text-sm"
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
