import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MessageSquare, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FeedbackForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'feedback',
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Здесь будет отправка данных на сервер
      // Пока просто имитируем задержку
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Спасибо за обратную связь!",
        description: "Мы рассмотрим ваше сообщение и свяжемся с вами в ближайшее время.",
      });
      
      setIsOpen(false);
      setFormData({
        type: 'feedback',
        name: '',
        email: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="text-[#222] hover:text-[#38B000] hover:bg-[#F6FBF4] transition-all duration-200"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-[#E5E5E5] rounded-[24px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-[#222]">
            <MessageSquare className="w-5 h-5 text-[#38B000]" />
            <span>Связаться с нами</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-[#222] font-medium">Тип сообщения</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 bg-[#F6FBF4] border border-[#E5E5E5] rounded-[16px] text-[#222] focus:outline-none focus:ring-2 focus:ring-[#38B000] focus:border-transparent"
            >
              <option value="feedback">Предложение по улучшению</option>
              <option value="bug">Сообщить о баге</option>
              <option value="cooperation">Сотрудничество</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#222] font-medium">Ваше имя</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[#F6FBF4] border-[#E5E5E5] text-[#222] rounded-[16px]"
              placeholder="Как к вам обращаться"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#222] font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-[#F6FBF4] border-[#E5E5E5] text-[#222] rounded-[16px]"
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-[#222] font-medium">Сообщение</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-[#F6FBF4] border-[#E5E5E5] text-[#222] min-h-[120px] rounded-[16px]"
              placeholder="Опишите ваше предложение, проблему или идею для сотрудничества"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#38B000] hover:bg-[#2c8c00] text-white font-semibold py-3 px-4 rounded-[16px] shadow-[0_2px_12px_0_rgba(56,176,0,0.1)] hover:shadow-[0_4px_24px_0_rgba(56,176,0,0.16)] transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Отправка...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Отправить
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackForm; 