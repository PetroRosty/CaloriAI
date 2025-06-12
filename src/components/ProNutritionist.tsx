
import { MessageCircle, Star } from 'lucide-react';
import ProBlock from './ProBlock';

const ProNutritionist = () => {
  const chatContent = (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
        <MessageCircle className="w-5 h-5 text-fitness-green" />
        <span>Чат с нутрициологом</span>
      </h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-fitness-green rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 bg-glass-bg p-3 rounded-lg">
            <p className="text-white text-sm">Добрый день! Вижу, что вы отлично справляетесь с планом питания. Рекомендую добавить больше омега-3 жирных кислот.</p>
            <span className="text-xs text-gray-400">Сегодня, 14:20</span>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-fitness-blue rounded-full flex items-center justify-center text-white text-sm font-bold">
            А
          </div>
          <div className="flex-1 bg-fitness-blue/20 p-3 rounded-lg">
            <p className="text-white text-sm">Спасибо! А какие продукты лучше выбрать?</p>
            <span className="text-xs text-gray-400">Сегодня, 14:25</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <div className="flex-1 bg-gray-700 rounded-lg p-2">
            <span className="text-gray-400 text-sm">Напишите сообщение...</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ProBlock
      title="PRO Нутрициолог"
      description="Личный чат с сертифицированным специалистом для вопросов и поддержки 24/7"
      icon={<MessageCircle className="w-6 h-6 text-fitness-green" />}
      buttonText="Узнать про преимущества PRO"
    >
      {chatContent}
    </ProBlock>
  );
};

export default ProNutritionist;
