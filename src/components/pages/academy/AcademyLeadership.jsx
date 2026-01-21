import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import apiService from "../../../services/api";

const AcademyLeadership = () => {
  const { t, i18n } = useTranslation();
  const [leadership, setLeadership] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  // Fetch leadership data from API
  useEffect(() => {
    const fetchLeadership = async () => {
      try {
        setLoading(true);
        const lang = i18n.language;

        const data = await apiService.getLeadership(lang);
        setLeadership(data || []);

        // Set first position as selected by default
        if (data && data.length > 0) {
          setSelectedPosition(data[0]);
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching leadership data:', err);
        setError(t('error.loadingData', 'Ошибка загрузки данных'));
      } finally {
        setLoading(false);
      }
    };

    fetchLeadership();
  }, [i18n.language, t]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 flex items-center justify-center">
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
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 max-w-md">
          <p className="text-white text-center">{error}</p>
        </div>
      </section>
    );
  }

  // No data state
  if (leadership.length === 0) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">{t('noData', 'Нет данных')}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">
          <svg className="w-16 h-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">
          <svg className="w-10 h-10 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">
          <svg className="w-12 h-12 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('leadership.title') || 'Руководство академии'}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('leadership.subtitle') || 'Профессиональная команда опытных руководителей и преподавателей'}
          </p>
        </div>

        {/* Основной контент */}
        <div className="flex flex-col lg:flex-row-reverse gap-8 max-w-7xl mx-auto">
          {/* Правая часть - Должности */}
          <div className="lg:w-1/3">
            <div className="sticky top-8">
              <div className="space-y-3">
                {leadership.map((person, index) => (
                  <button
                    key={person.id}
                    onClick={() => setSelectedPosition(person)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                      selectedPosition?.id === person.id
                        ? 'bg-gradient-to-r from-blue-500 to-emerald-500 border-white/30 shadow-2xl transform scale-105'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:transform hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 flex-shrink-0">
                        {person.image_url ? (
                          <img
                            src={person.image_url}
                            alt={person.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${
                            selectedPosition?.id === person.id
                              ? 'bg-white/20'
                              : 'bg-white/10'
                          }`}>
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold ${
                          selectedPosition?.id === person.id
                            ? 'text-white'
                            : 'text-blue-100'
                        }`}>
                          {person.position}
                        </h4>
                        <p className={`text-sm truncate ${
                          selectedPosition?.id === person.id
                            ? 'text-white/80'
                            : 'text-blue-200'
                        }`}>
                          {person.name}
                        </p>
                      </div>
                      <div className={`transform transition-transform ${
                        selectedPosition?.id === person.id ? '-rotate-90' : ''
                      }`}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </div>
                    </div>
                    </button>
                ))}
              </div>
            </div>
          </div>

          {/* Левая часть - Информация о выбранном человеке */}
          <div className="flex-1 lg:w-2/3">
            {selectedPosition && (
              <div className="bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 p-8 lg:p-10">
                {/* Верхняя часть с фото и основной информацией */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                  {/* Фото */}
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    {selectedPosition.image_url ? (
                      <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                        <img
                          src={selectedPosition.image_url}
                          alt={selectedPosition.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl bg-gradient-to-br from-blue-500/30 to-emerald-500/30 flex items-center justify-center border-4 border-white/20 shadow-2xl">
                        <svg className="w-16 h-16 lg:w-20 lg:h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Основная информация */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                      {selectedPosition.name}
                    </h2>
                    <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl px-4 py-3 mb-4 border border-white/10">
                      <p className="text-lg font-semibold text-blue-100">
                        {selectedPosition.position}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Биография как HTML */}
                {selectedPosition.bio && (
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {t('leadership.bio', 'Биография')}
                    </h3>
                    <div
                      className="text-blue-100 leading-relaxed text-base lg:text-lg prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedPosition.bio }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AcademyLeadership;
