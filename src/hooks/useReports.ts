import { useUserMeals } from './useSupabaseData';
import * as XLSX from 'xlsx';

export const useReports = () => {
  const { data: meals } = useUserMeals(30); // Получаем данные за последние 30 дней

  const exportToExcel = async (period: 'week' | 'month') => {
    if (!meals) {
      throw new Error('No meals data available');
    }

    // Фильтруем данные в зависимости от периода
    const startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setDate(startDate.getDate() - 30);
    }

    const reportData = meals.filter(meal => new Date(meal.eaten_at) >= startDate);

    // Создаем новую книгу Excel
    const workbook = XLSX.utils.book_new();

    // Добавляем лист с общей статистикой
    const statsData = [
      ['Статистика питания', ''],
      ['Период', period === 'week' ? '7 дней' : '30 дней'],
      ['Всего приёмов пищи', reportData.length],
      ['Средние калории в день', Math.round(reportData.reduce((sum, meal) => sum + (meal.kcal || 0), 0) / (period === 'week' ? 7 : 30))],
      ['Средний белок в день', Math.round(reportData.reduce((sum, meal) => sum + (meal.prot || 0), 0) / (period === 'week' ? 7 : 30))],
      ['Средний жир в день', Math.round(reportData.reduce((sum, meal) => sum + (meal.fat || 0), 0) / (period === 'week' ? 7 : 30))],
      ['Средние углеводы в день', Math.round(reportData.reduce((sum, meal) => sum + (meal.carb || 0), 0) / (period === 'week' ? 7 : 30))],
    ];

    const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(workbook, statsSheet, 'Статистика');

    // Добавляем лист с приёмами пищи
    const mealsSheet = XLSX.utils.json_to_sheet([
      {
        date: 'Дата',
        name: 'Блюдо',
        calories: 'Калории',
        protein: 'Белки (г)',
        fat: 'Жиры (г)',
        carbs: 'Углеводы (г)'
      },
      ...reportData.map(meal => ({
        date: new Date(meal.eaten_at).toLocaleDateString('ru-RU'),
        name: meal.dish || 'Не указано',
        calories: meal.kcal || 0,
        protein: meal.prot || 0,
        fat: meal.fat || 0,
        carbs: meal.carb || 0
      }))
    ]);

    // Стилизация заголовков
    mealsSheet['!cols'] = [
      { wch: 12 }, // Дата
      { wch: 30 }, // Блюдо
      { wch: 10 }, // Калории
      { wch: 10 }, // Белки
      { wch: 10 }, // Жиры
      { wch: 10 }  // Углеводы
    ];

    XLSX.utils.book_append_sheet(workbook, mealsSheet, 'Приёмы пищи');

    // Сохраняем файл
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `diet-report-${period}-${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return {
    exportToExcel
  };
}; 