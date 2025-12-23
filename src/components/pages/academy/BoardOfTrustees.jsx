// BoardOfTrustees.jsx - Integrated with API
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import apiService from '../../../services/api';

const BoardOfTrustees = () => {
  const { t, i18n } = useTranslation();
  const [activeTrustee, setActiveTrustee] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([]);
  const [trustees, setTrustees] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const lang = i18n.language;

        

        const [trusteesData, statsData] = await Promise.all([
          apiService.getBoardOfTrustees(lang),
          apiService.getBoardOfTrusteesStats(lang)
        ]);

        

        

        setTrustees(trusteesData || []);
        setStats(statsData || []);
        setCounterValues(new Array(statsData.length).fill(0));
        setError(null);
        // Set visible immediately after data loads
        setIsVisible(true);
      } catch (err) {
        console.error('❌ Error fetching Board of Trustees data:', err);
        setError(t('error.loadingData', 'Ошибка загрузки данных'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, t]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
          startCounters();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveTrustee(prev => (prev + 1) % trustees.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, trustees.length]);

  const startCounters = () => {
    if (stats.length === 0) return;

    const duration = 2000;

    stats.forEach((stat, index) => {
      const target = stat.value;
      const startTime = performance.now();
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(easeOutQuart * target);

        setCounterValues(prev => {
          const newValues = [...prev];
          newValues[index] = currentValue;
          return newValues;
        });

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };
      requestAnimationFrame(updateCounter);
    });
  };

  const handleTrusteeClick = (index) => {
    setActiveTrustee(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

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

  // No data state
  

  if (trustees.length === 0) {
    
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">{t('noData', 'Нет данных')}</p>
        </div>
      </section>
    );
  }

  const currentTrustee = trustees[activeTrustee];

  

  if (!currentTrustee) {
    console.error('❌ currentTrustee is undefined!', { activeTrustee, trustees });
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">{t('error.invalidTrustee', 'Ошибка: попечитель не найден')}</p>
        </div>
      </section>
    );
  }

  

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок секции */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('boardOfTrustees.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4">
            {t('boardOfTrustees.subtitle')}
          </p>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          {/* Карточка активного попечителя */}
          <div className="lg:col-span-2">
            <div className={`bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-102 hover:border-green-400/30 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}>
              <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-2/5 relative">
                  <div className="h-80 md:h-full bg-gradient-to-br from-blue-500/20 to-green-500/20 relative overflow-hidden">
                    {currentTrustee.image_url ? (
                      <img
                        src={currentTrustee.image_url}
                        alt={currentTrustee.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="text-center">
                          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                            <span className="text-4xl text-white">👤</span>
                          </div>
                          <p className="text-blue-100 text-sm font-medium">{t('boardOfTrustees.photoPlaceholder', 'Фото')}</p>
                        </div>
                      </div>
                    )}

                    {/* Декоративные элементы */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-ping opacity-60"></div>
                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
                  </div>
                </div>
                <div className="p-6 md:p-8 md:w-3/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-0">{currentTrustee.name}</h2>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                      {currentTrustee.position}
                    </span>
                  </div>

                  <p className="text-blue-100 mb-6 leading-relaxed">{currentTrustee.bio}</p>

                  {currentTrustee.achievements && currentTrustee.achievements.length > 0 && (
                    <>
                      <h3 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center">
                        <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                        {t('boardOfTrustees.achievements', 'Достижения')}
                      </h3>
                      <ul className="space-y-3 mb-8">
                        {currentTrustee.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start group hover:transform hover:translate-x-2 transition-transform duration-300">
                            <svg className="h-6 w-6 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-blue-100 group-hover:text-white transition-colors">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Боковая панель с попечителями и статистикой */}
          <div className={`space-y-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
            {/* Список всех попечителей */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
                {t('boardOfTrustees.allTrustees')}
              </h3>
              <div className="space-y-4">
                {trustees.map((trustee, index) => (
                  <div
                    key={trustee.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group ${activeTrustee === index
                        ? 'border-green-400 bg-green-500/20 transform scale-105 shadow-lg'
                        : 'border-white/20 hover:border-green-400/50 hover:bg-white/10'
                      }`}
                    onClick={() => handleTrusteeClick(index)}
                  >
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold mr-4 transition-all duration-300 ${activeTrustee === index
                          ? 'bg-gradient-to-r from-green-500 to-green-600 scale-110'
                          : 'bg-gradient-to-r from-blue-500 to-green-500 group-hover:scale-110'
                        }`}>
                        {trustee.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">{trustee.name}</h4>
                        <p className="text-blue-200 text-sm truncate">{trustee.position}</p>
                      </div>
                      {activeTrustee === index && (
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-ping ml-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Статистика */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 border border-white/20 shadow-2xl">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                {t('boardOfTrustees.stats.title', 'Статистика')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-2xl p-4 text-center group hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-xl mb-2 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon || '📊'}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{counterValues[index] || 0}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Навигационные точки */}
        <div className={`flex justify-center mt-8 md:mt-12 space-x-3 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          {trustees.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeTrustee === index
                  ? 'bg-green-400 scale-125 shadow-lg'
                  : 'bg-white/30 hover:bg-white/50'
                }`}
              onClick={() => handleTrusteeClick(index)}
              aria-label={t('boardOfTrustees.goToSlide', { number: index + 1 })}
            />
          ))}
        </div>
      </div>

      {/* Плавающие элементы для десктопа */}
      <div className="absolute bottom-20 left-5 w-6 h-6 bg-green-400/20 rounded-full animate-bounce hidden md:block"></div>
      <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping hidden md:block"></div>
    </section>
  );
};

export default BoardOfTrustees;