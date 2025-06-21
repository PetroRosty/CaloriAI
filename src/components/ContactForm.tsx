import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MessageSquare, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sendFeedback } from '@/services/feedbackService';

const messageTypes = [
  { value: 'bug', label: 'Сообщить о баге' },
  { value: 'feature', label: 'Предложить улучшение' },
  { value: 'cooperation', label: 'Сотрудничество' },
  { value: 'other', label: 'Другое' },
];

const ContactForm = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    name: '',
    email: '',
    message: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await sendFeedback(formData);
      
      if (result.success) {
        toast({
          title: "Сообщение отправлено",
          description: "Спасибо за обратную связь! Мы ответим вам в ближайшее время.",
        });
        
        onOpenChange(false);
        setFormData({ type: '', name: '', email: '', message: '' });
      } else {
        throw new Error(result.error || 'Неизвестная ошибка');
      }
    } catch (error: any) {
      console.error('Feedback submission error:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось отправить сообщение. Пожалуйста, попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-[#E5E5E5] rounded-[24px] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-[#222]">
            <MessageSquare className="w-5 h-5 text-[#38B000]" />
            <span>Связаться с нами</span>
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Расскажите нам о вашей идее, проблеме или предложении
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#222]">Тип сообщения</label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="w-full bg-[#F6FBF4] border-[#E5E5E5] rounded-[16px]">
                <SelectValue placeholder="Выберите тип сообщения" />
              </SelectTrigger>
              <SelectContent>
                {messageTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#222]">Ваше имя</label>
            <Input
              type="text"
              placeholder="Как к вам обращаться?"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-[#F6FBF4] border-[#E5E5E5] rounded-[16px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#222]">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-[#F6FBF4] border-[#E5E5E5] rounded-[16px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#222]">Сообщение</label>
            <Textarea
              placeholder="Опишите вашу идею или проблему..."
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              className="bg-[#F6FBF4] border-[#E5E5E5] rounded-[16px] min-h-[120px]"
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
              'Отправить сообщение'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm; 