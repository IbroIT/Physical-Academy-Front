// components/AcademyHistory.jsx
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const AcademyHistory = () => {
  const { t, i18n } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL;

  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    history: null,
    loading: false,
    error: null
  });

  // Получение текущего языка для API
  const getApiLanguage = useCallback(() => {
    const langMap = {
      'en': 'en',
      'ru': 'ru',
      'kg': 'kg'
    };
    return langMap[i18n.language] || 'ru';
  }, [i18n.language]);

  // Функция для загрузки данных с бэкенда
  const fetchBackendData = useCallback(async () => {
    try {
      setBackendData(prev => ({
        ...prev,
        loading: true,
        error: null
      }));

      const lang = getApiLanguage();
      const response = await fetch(`${API_URL}/api/academy/history/?lang=${lang}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setBackendData({
        history: data.results && data.results.length > 0 ? data.results[0] : null,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching history data:', error);
      setBackendData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load history data'
      }));
    }
  }, [getApiLanguage]);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchBackendData();
  }, []);

  // Перезагрузка данных при изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [i18n.language]);

  // Компонент загрузки
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-8">
      <div className="text-center mb-12">
        <div className="h-12 bg-white/20 rounded w-3/4 mx-auto mb-6"></div>
        <div className="h-4 bg-white/20 rounded w-1/2 mx-auto"></div>
      </div>
      <div className="w-full h-96 bg-white/10 rounded-2xl"></div>
      <div className="space-y-4">
        <div className="h-4 bg-white/20 rounded w-full"></div>
        <div className="h-4 bg-white/20 rounded w-5/6"></div>
        <div className="h-4 bg-white/20 rounded w-4/5"></div>
      </div>
    </div>
  );

  // Компонент ошибки
  const ErrorMessage = () => (
    <div className="text-center py-16">
      <div className="text-red-400 text-6xl mb-6">⚠️</div>
      <h3 className="text-2xl text-white mb-4">
        {t('academyHistory.errorTitle')}
      </h3>
      <p className="text-blue-200 mb-6">
        {backendData.error}
      </p>
      <button
        onClick={fetchBackendData}
        className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
      >
        {t('academyHistory.retry')}
      </button>
    </div>
  );

  if (backendData.loading) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton />
        </div>
      </section>
    );
  }

  if (backendData.error && !backendData.history) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <ErrorMessage />
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('academyHistory.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4 leading-relaxed">
            {t('academyHistory.subtitle')}
          </p>
        </div>

        {backendData.error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-8 text-center">
            <p className="text-red-300">{backendData.error}</p>
          </div>
        )}

        {backendData.history ? (
          <div className="max-w-6xl mx-auto">
            {/* Главное изображение */}
            <div className="mb-12">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 border border-white/20 shadow-2xl overflow-hidden">
                <img
                  src={backendData.history.image_url || '/placeholder-image.jpg'}
                  alt="Academy History"
                  className="w-full h-96 md:h-[500px] object-cover rounded-xl"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
            </div>

            {/* Описание */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="text-blue-100 text-lg md:text-xl leading-relaxed prose prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: backendData.history.text }} />
              </div>
            </div>
          </div>
        ) : (
          !backendData.loading && (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">📊</div>
              <h3 className="text-2xl text-white mb-4">
                {t('academyHistory.noData')}
              </h3>
              <p className="text-blue-200">
                {t('academyHistory.noDataDescription')}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default AcademyHistory;
