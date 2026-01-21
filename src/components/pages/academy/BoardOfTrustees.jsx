// BoardOfTrustees.jsx - Simple component with API integration
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiService from '../../../services/api';

const BoardOfTrustees = () => {
  const { t, i18n } = useTranslation();
  const [trustees, setTrustees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const lang = i18n.language;
        const trusteesData = await apiService.getBoardOfTrustees(lang);
        setTrustees(trusteesData || []);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching Board of Trustees data:', err);
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
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 flex items-center justify-center">
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
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 max-w-md">
          <p className="text-white text-center">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок секции */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('boardOfTrustees.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4">
            {t('boardOfTrustees.subtitle')}
          </p>
        </div>

        {/* Карточки попечителей */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {trustees.map((trustee, index) => (
            <div
              key={trustee.id || index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:border-green-400/30"
            >
              <div className="p-6 text-center">
                {/* Фото */}
                <div className="mb-6">
                  {trustee.image_url ? (
                    <img
                      src={trustee.image_url}
                      alt={trustee.name}
                      className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-white/20 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mx-auto border-4 border-white/20 shadow-lg">
                      <span className="text-4xl text-white">👤</span>
                    </div>
                  )}
                </div>

                {/* Имя */}
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {trustee.name}
                </h3>

                {/* Должность */}
                <p className="text-blue-200 text-sm md:text-base">
                  {trustee.position}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Сообщение если нет данных */}
        {trustees.length === 0 && !loading && (
          <div className="text-center mt-12">
            <p className="text-white text-xl">{t('noData', 'Нет данных')}</p>
          </div>
        )}
      </div>

      {/* Плавающие элементы для десктопа */}
      <div className="absolute bottom-20 left-5 w-6 h-6 bg-green-400/20 rounded-full animate-bounce hidden md:block"></div>
      <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping hidden md:block"></div>
    </section>
  );
};

export default BoardOfTrustees;