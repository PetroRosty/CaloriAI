import React from 'react';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] to-[#f7faf7] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 animate-fade-in text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-[#38B000] rounded-xl flex items-center justify-center shadow-sm">
              <img
                className="h-6 w-6"
                src="/logo.svg"
                alt="Diet Dashboard"
              />
            </div>
            <h1 className="text-2xl font-bold text-[#222]">Диет-Дневник</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#222] mb-4">Доступ только через Telegram-бота</h2>
            <p className="text-[#4b5563] mb-6">
              Для использования приложения, пожалуйста, войдите через нашего Telegram-бота.
            </p>
            <a 
              href="https://t.me/MyCalorAIBot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-full shadow-sm text-white bg-[#38B000] hover:bg-[#2c8c00] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#38B000]"
            >
              Открыть бота
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
