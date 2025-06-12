import { MessageCircle, Star } from 'lucide-react';

const ProNutritionist = () => {
  const chatContent = (
    <div className="p-6 bg-white rounded-xl border border-[#E5E5E5] shadow-sm">
      <h3 className="text-lg font-semibold text-[#222] mb-4 flex items-center space-x-2">
        <MessageCircle className="w-5 h-5 text-[#38B000]" />
        <span>Чат с нутрициологом</span>
      </h3>
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-[#38B000] rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 bg-[#F6FBF4] p-3 rounded-lg">
            <p className="text-[#222] text-sm">Добрый день! Вижу, что вы отлично справляетесь с планом питания. Рекомендую добавить больше омега-3 жирных кислот.</p>
            <span className="text-xs text-gray-400">Сегодня, 14:20</span>
          </div>
        </div>
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center text-white text-sm font-bold">
            А
          </div>
          <div className="flex-1 bg-[#E0F2FE] p-3 rounded-lg">
            <p className="text-[#222] text-sm">Спасибо! А какие продукты лучше выбрать?</p>
            <span className="text-xs text-gray-400">Сегодня, 14:25</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <div className="flex-1 bg-[#F6FBF4] rounded-lg p-2">
            <span className="text-gray-400 text-sm">Напишите сообщение...</span>
          </div>
        </div>
      </div>
    </div>
  );

  return chatContent;
};

export default ProNutritionist;
