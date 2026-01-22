// Commissions.jsx - Static component
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiService from '../../../services/api';

const Commissions = () => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const lang = i18n.language;

        const response = await apiService.getCommissions(lang);
        // API returns array of results
        setContent(Array.isArray(response) ? response : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching Commissions data:', err);
        setError(t('error.loadingData', 'Ошибка загрузки данных'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, t]);

  // Loading state
  if (loading) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-emerald-800 py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">{t('loading', 'Загрузка...')}</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-emerald-800 py-20 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 max-w-md">
          <p className="text-white text-center">{error}</p>
        </div>
      </section>
    );
  }

  // No data state
  if (!content || content.length === 0) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-emerald-800 py-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">{t('noData', 'Нет данных')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-emerald-800 py-20 overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-400 rounded-full mix-blend-screen filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-blue-300 rounded-full mix-blend-screen filter blur-xl animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
            {t('commissions.title', 'Комиссии')}
          </h2>
          <div className="w-24 h-1 bg-emerald-400 mx-auto mb-6"></div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            {t('commissions.subtitle', 'Рабочие комиссии и комитеты академии')}
          </p>
        </div>

        {/* Контент комиссий */}
        <div className="max-w-6xl mx-auto space-y-6">
          {content.map((item, index) => (
            <div key={item.id || index} className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <div
                className="prose prose-invert prose-lg max-w-none text-blue-100 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Commissions;