import { Sparkles, Loader2, MessageSquare, TrendingUp, Droplet, Moon } from 'lucide-react';
import { useLatestDigest } from '@/hooks/useSupabaseData';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const getRecommendationIcon = (type: string) => {
  switch (type) {
    case 'nutrition':
      return { icon: '🥦', color: '#38B000' };
    case 'activity':
      return { icon: '🚶', color: '#3B82F6' };
    case 'water':
      return { icon: '💧', color: '#3B82F6' };
    case 'sleep':
      return { icon: '💤', color: '#8B5CF6' };
    default:
      return { icon: '💡', color: '#38B000' };
  }
};

const AIRecommendation = () => {
  const { data: digest, isLoading, error } = useLatestDigest();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const calculateHoursUntilNextAnalysis = () => {
    if (!digest?.for_date) return 24;
    const lastAnalysisDate = new Date(digest.for_date);
    const now = new Date();
    const hours = (now.getTime() - lastAnalysisDate.getTime()) / (1000 * 60 * 60);
    return Math.max(0, 24 - hours);
  };

  const handleNewAnalysis = () => {
    if (!digest) {
      toast({
        title: "Нет данных для анализа",
        description: "Ведите дневник питания несколько дней, чтобы получить персональные рекомендации",
        variant: "destructive",
      });
      return;
    }

    const hoursUntilNext = calculateHoursUntilNextAnalysis();
    if (hoursUntilNext > 0) {
      setIsDialogOpen(true);
    } else {
      // Здесь будет логика запроса нового анализа
      toast({
        title: "Запрос отправлен",
        description: "Новый анализ будет готов в течение нескольких минут",
      });
    }
  };

  if (isLoading) {
    return (
      <div className={`bg-white p-6 rounded-[24px] shadow-[0_2px_16px_0_rgba(56,176,0,0.07)] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#38B000]" />
          <h3 className="text-lg font-semibold text-[#222]">AI-диетолог</h3>
        </div>
        <div className="flex items-center justify-center h-20">
          <Loader2 className="w-6 h-6 text-[#38B000] animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !digest) {
    return (
      <div className={`bg-white p-6 rounded-[24px] shadow-[0_2px_16px_0_rgba(56,176,0,0.07)] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 text-[#38B000]" />
          <h3 className="text-lg font-semibold text-[#222]">AI-диетолог</h3>
        </div>
        <div className="bg-[#F6FBF4] rounded-[24px] p-6 border border-[#E5E5E5]">
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🤖</div>
            <p className="text-[#222] mb-2">Пока нет персональных рекомендаций</p>
            <p className="text-sm text-gray-500">Ведите дневник питания несколько дней, и AI-диетолог даст вам персональные советы!</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }
  };

  const hoursUntilNext = calculateHoursUntilNextAnalysis();

  return (
    <div className={`bg-white p-6 rounded-[24px] shadow-[0_2px_16px_0_rgba(56,176,0,0.07)] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[#38B000]" />
          <h3 className="text-lg font-semibold text-[#222]">AI-диетолог</h3>
        </div>
        {digest && (
          <span className="text-sm text-gray-500">{formatDate(digest.for_date)}</span>
        )}
      </div>
      
      <div className="space-y-6">
        {digest?.summary_md && (
          <div className="bg-[#F6FBF4] rounded-[24px] p-6 border border-[#E5E5E5]">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">📊</div>
              <div className="flex-1">
                <h4 className="text-[#38B000] font-semibold mb-2">Анализ дня:</h4>
                <p className="text-[#222] text-sm leading-relaxed">
                  {digest.summary_md}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {digest?.recommendation && (
          <div className="bg-[#F6FBF4] rounded-[24px] p-6 border border-[#E5E5E5]">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">💡</div>
              <div className="flex-1">
                <h4 className="text-[#38B000] font-semibold mb-2">Рекомендация дня:</h4>
                <p className="text-[#222] text-sm leading-relaxed">
                  {digest.recommendation}
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Если будут вопросы — пишите в чат-бот!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Button 
        onClick={handleNewAnalysis}
        className="mt-6 w-full bg-[#38B000] hover:bg-[#2c8c00] text-white font-semibold py-3 px-4 rounded-[16px] shadow-[0_2px_12px_0_rgba(56,176,0,0.1)] hover:shadow-[0_4px_24px_0_rgba(56,176,0,0.16)] transition-all duration-200"
      >
        Получить новый анализ
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white border-[#E5E5E5] rounded-[24px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-[#222]">
              <Sparkles className="w-5 h-5 text-[#38B000]" />
              <span>Новый анализ</span>
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Для получения нового анализа необходимо дождаться следующего дня после последнего анализа.
              Это позволяет AI-диетологу собрать достаточно данных для качественных рекомендаций.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 text-sm text-[#222]">
            <p>Последний анализ был получен {formatDate(digest?.for_date || '')}.</p>
            <p className="mt-2">Следующий анализ будет доступен через {Math.ceil(hoursUntilNext)} часов.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AIRecommendation;
