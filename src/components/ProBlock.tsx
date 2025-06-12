import { Lock, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePro } from '@/contexts/ProContext';
import { useToast } from '@/hooks/use-toast';

interface ProBlockProps {
  title: string;
  description: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  buttonText?: string;
}

const ProBlock = ({ 
  title, 
  description, 
  children, 
  icon,
  buttonText = "Открыть доступ"
}: ProBlockProps) => {
  const { isPro, activatePro } = usePro();
  const { toast } = useToast();

  const handleActivatePro = () => {
    activatePro();
    toast({
      title: "PRO активирован!",
      description: "Теперь вам доступны все расширенные функции.",
    });
  };

  // Если пользователь уже PRO, показываем контент без блюра
  if (isPro) {
    return (
      <div className="glass-card animate-fade-in">
        {children}
      </div>
    );
  }

  return (
    <div className="relative glass-card animate-fade-in group hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:shadow-fitness-purple/20">
      {/* Blurred content */}
      <div className="blur-md brightness-50 select-none pointer-events-none">
        {children}
      </div>
      
      {/* Overlay with PRO content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm rounded-xl">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {icon || <Lock className="w-6 h-6 text-fitness-purple" />}
            <span className="text-lg font-bold bg-gradient-to-r from-fitness-purple to-fitness-blue bg-clip-text text-transparent">
              {title}
            </span>
          </div>
          
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-fitness-purple/20 border border-fitness-purple/30">
            <Lock className="w-4 h-4 mr-2 text-fitness-purple" />
            <span className="text-sm text-fitness-purple font-medium">Доступно только для PRO</span>
          </div>
          
          <p className="text-gray-300 text-sm max-w-xs leading-relaxed">
            {description}
          </p>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-fitness-purple to-fitness-blue hover:from-purple-600 hover:to-blue-600 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105">
                {buttonText}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-fitness-purple" />
                  <span>Попробуйте PRO бесплатно</span>
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Получите доступ ко всем расширенным функциям на 7 дней
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Пробный период */}
                <div className="bg-gradient-to-r from-fitness-purple/20 to-fitness-blue/20 p-4 rounded-lg border border-fitness-purple/30">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="w-5 h-5 text-fitness-purple" />
                    <h4 className="text-white font-semibold">Пробный период</h4>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-fitness-green mt-0.5 flex-shrink-0" />
                      <span>7 дней полного доступа ко всем функциям</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-fitness-green mt-0.5 flex-shrink-0" />
                      <span>Без привязки карты и автоматического списания</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-fitness-green mt-0.5 flex-shrink-0" />
                      <span>Можно отменить в любой момент</span>
                    </li>
                  </ul>
                </div>

                {/* PRO функции */}
                <div className="bg-gradient-to-r from-fitness-blue/20 to-fitness-green/20 p-4 rounded-lg border border-fitness-blue/30">
                  <h4 className="text-white font-semibold mb-3">PRO включает:</h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-fitness-blue mt-0.5 flex-shrink-0" />
                      <span>Расширенная аналитика питания за 5 месяцев</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-fitness-blue mt-0.5 flex-shrink-0" />
                      <span>Чат с персональным нутрициологом 24/7</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-fitness-blue mt-0.5 flex-shrink-0" />
                      <span>Экспорт PDF-отчётов для врача</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-fitness-blue mt-0.5 flex-shrink-0" />
                      <span>AI-рекомендации нового уровня</span>
                    </li>
                  </ul>
                </div>

                {/* Кнопки действий */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    Узнать больше
                  </Button>
                  <Button 
                    onClick={handleActivatePro}
                    className="bg-gradient-to-r from-fitness-purple to-fitness-blue hover:from-purple-600 hover:to-blue-600 text-white"
                  >
                    Активировать PRO
                  </Button>
                </div>

                {/* Примечание */}
                <p className="text-xs text-gray-500 text-center">
                  После окончания пробного периода подписка не продлевается автоматически
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ProBlock;
