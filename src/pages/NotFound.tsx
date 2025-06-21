import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0fdf4] to-[#f7faf7]">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-[#222]">404</h1>
        <p className="text-xl text-[#4b5563] mb-4">Страница не найдена</p>
        <a href="/" className="text-[#38B000] hover:text-[#2c8c00] underline font-medium">
          Вернуться на главную
        </a>
      </div>
    </div>
  );
};

export default NotFound;
