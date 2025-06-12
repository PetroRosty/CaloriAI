import { FileSpreadsheet, FileType, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProBlock from './ProBlock';
import { useReports } from '@/hooks/useReports';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const ProReports = () => {
  const { exportToExcel } = useReports();
  const [isExporting, setIsExporting] = useState(false);
  const hasData = true; // TODO: Add actual data check

  const handleExport = async (period: 'week' | 'month') => {
    try {
      setIsExporting(true);
      await exportToExcel(period);
    } catch (error) {
      console.error('Error exporting report:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const reportContent = (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <BarChart2 className="w-5 h-5 text-[#38B000]" />
        <h3 className="text-lg font-semibold text-[#222]">Расширенные отчёты</h3>
      </div>

      <div className="space-y-6">
        {/* Отчёт за неделю */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[#222] font-semibold">Отчёт за неделю</h4>
              <span className="text-sm text-gray-500">7 дней</span>
            </div>
            
            <Button
              className="w-full bg-[#38B000] hover:bg-[#2c8c00] text-white font-semibold py-3 px-4 rounded-[16px] shadow-[0_2px_12px_0_rgba(56,176,0,0.1)] hover:shadow-[0_4px_24px_0_rgba(56,176,0,0.16)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#38B000] disabled:hover:shadow-none"
              onClick={() => handleExport('week')}
              disabled={isExporting || !hasData}
            >
              <div className="flex items-center justify-center space-x-2">
                {isExporting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-5 h-5" />
                )}
                <span>Скачать Excel</span>
              </div>
            </Button>

            <p className="text-sm text-gray-500">
              Статистика питания за последние 7 дней с детальным анализом макронутриентов
            </p>

            {!hasData && (
              <p className="text-xs text-[#FF2E63] mt-1">
                Недостаточно данных для формирования отчёта
              </p>
            )}
          </div>
        </div>

        {/* Отчёт за месяц */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-[#222] font-semibold">Отчёт за месяц</h4>
              <span className="text-sm text-gray-500">30 дней</span>
            </div>
            
            <Button
              className="w-full bg-[#38B000] hover:bg-[#2c8c00] text-white font-semibold py-3 px-4 rounded-[16px] shadow-[0_2px_12px_0_rgba(56,176,0,0.1)] hover:shadow-[0_4px_24px_0_rgba(56,176,0,0.16)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#38B000] disabled:hover:shadow-none"
              onClick={() => handleExport('month')}
              disabled={isExporting || !hasData}
            >
              <div className="flex items-center justify-center space-x-2">
                {isExporting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileSpreadsheet className="w-5 h-5" />
                )}
                <span>Скачать Excel</span>
              </div>
            </Button>

            <p className="text-sm text-gray-500">
              Детальный анализ рациона за 30 дней с графиками и рекомендациями
            </p>

            {!hasData && (
              <p className="text-xs text-[#FF2E63] mt-1">
                Недостаточно данных для формирования отчёта
              </p>
            )}
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-500">
            Выгрузите статистику питания за выбранный период в удобном формате Excel — для врача, дневника или контроля рациона
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <ProBlock
      title="Расширенные отчёты"
      description="Экспортируйте детальные отчёты о вашем питании в Excel"
      icon={<FileSpreadsheet className="w-6 h-6 text-[#38B000]" />}
      buttonText="Открыть доступ"
    >
      {reportContent}
    </ProBlock>
  );
};

export default ProReports;
