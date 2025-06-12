import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProContextType {
  isPro: boolean;
  activatePro: () => void;
  deactivatePro: () => void;
}

const ProContext = createContext<ProContextType | undefined>(undefined);

export const ProProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPro, setIsPro] = useState(() => {
    // Проверяем сохраненный статус в localStorage
    const savedStatus = localStorage.getItem('pro_status');
    return savedStatus === 'true';
  });

  useEffect(() => {
    // Сохраняем статус в localStorage при изменении
    localStorage.setItem('pro_status', isPro.toString());
  }, [isPro]);

  const activatePro = () => {
    setIsPro(true);
  };

  const deactivatePro = () => {
    setIsPro(false);
  };

  return (
    <ProContext.Provider value={{ isPro, activatePro, deactivatePro }}>
      {children}
    </ProContext.Provider>
  );
};

export const usePro = () => {
  const context = useContext(ProContext);
  if (context === undefined) {
    throw new Error('usePro must be used within a ProProvider');
  }
  return context;
}; 