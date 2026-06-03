// BoardOfTrustees.jsx - Simple component with API integration
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiService from '../../../services/api';

const BoardOfTrustees = () => {
  const { t, i18n } = useTranslation();
  const [trustees, setTrustees] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const lang = i18n.language;
        const [trusteesData, documentsData] = await Promise.all([
          apiService.getBoardOfTrustees(lang),
          apiService.getBoardOfTrusteesDocuments(lang),
        ]);
        setTrustees(trusteesData || []);
        setDocuments(documentsData || []);
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

        <div className="mt-16 md:mt-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl p-6 md:p-8">
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                {t('boardOfTrustees.documentsTitle', 'Документы')}
              </h2>
              <p className="text-blue-100 text-base md:text-lg">
                {t('boardOfTrustees.documentsSubtitle', 'Откройте PDF-документы попечительского совета')}
              </p>
            </div>

            {documents.length > 0 ? (
              <div className="flex flex-col gap-4">
                {documents.map((document, index) => (
                  <button
                    key={document.id || index}
                    type="button"
                    onClick={() =>
                      document.pdf &&
                      window.open(document.pdf, '_blank', 'noopener,noreferrer')
                    }
                    className="w-full text-left flex items-center justify-between gap-4 rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-white transition-all duration-300 hover:bg-white/10 hover:border-green-400/40 hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
                    disabled={!document.pdf}
                  >
                    <span className="font-semibold text-base md:text-lg">
                      {document.title}
                    </span>
                    <span className="shrink-0 inline-flex items-center rounded-xl bg-gradient-to-r from-blue-400 to-green-400 px-4 py-2 text-sm font-semibold text-slate-900">
                      PDF
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-blue-100">
                {t('boardOfTrustees.documentsEmpty', 'Документы пока не добавлены')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Плавающие элементы для десктопа */}
      <div className="absolute bottom-20 left-5 w-6 h-6 bg-green-400/20 rounded-full animate-bounce hidden md:block"></div>
      <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping hidden md:block"></div>
    </section>
  );
};

export default BoardOfTrustees;
