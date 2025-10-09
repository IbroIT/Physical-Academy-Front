import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeadership, useDirectors } from '../../../hooks/useApi';
import { PageLoading, ErrorDisplay, EmptyState, CardSkeleton } from '../../common/Loading';

const AcademyLeadership = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  // API hooks
  const filters = selectedType ? { leadership_type: selectedType } : {};
  const { leadership, loading, error, refetch } = useLeadership(filters);
  const { data: directors, loading: directorsLoading } = useDirectors();

  const categories = [
    { key: 'all', icon: '👥', apiFilter: '', color: 'from-blue-500 to-blue-600' },
    { key: 'rector', icon: '👑', apiFilter: 'rector', color: 'from-green-500 to-green-600' },
    { key: 'vice_rector', icon: '🌟', apiFilter: 'vice_rector', color: 'from-blue-500 to-green-500' },
    { key: 'director', icon: '🏛️', apiFilter: 'director', color: 'from-green-500 to-blue-500' },
    { key: 'dean', icon: '📚', apiFilter: 'dean', color: 'from-blue-500 to-blue-600' },
    { key: 'department_head', icon: '🎓', apiFilter: 'department_head', color: 'from-green-500 to-green-600' },
  ];

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

  // Set visible when data is loaded
  useEffect(() => {
    if (!loading && leadership.length > 0) {
      setIsVisible(true);
    }
  }, [loading, leadership]);

  const startCounters = () => {
    const currentData = getCurrentData();
    const targetValues = [
      currentData.length,
      currentData.filter(p => p.leadership_type === 'rector' || p.leadership_type === 'director').length,
      currentData.filter(p => p.department).length,
      categories.length
    ];

    const duration = 2000;

    targetValues.forEach((target, index) => {
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

  const handleCategoryChange = (category) => {
    setActiveCategory(category.key);
    setSelectedType(category.apiFilter);
    setExpandedCard(null);
  };

  const toggleCardExpand = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Функция для генерации placeholder фото на основе имени
  const generateInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Получаем данные для отображения
  const getCurrentData = () => {
    return leadership || [];
  };

  const currentData = getCurrentData();
  const isLoading = loading;

  if (isLoading && currentData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 flex items-center justify-center">
        <PageLoading message={t('leadership.loading', 'Загрузка руководства...')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ErrorDisplay
            error={error}
            onRetry={refetch}
            className="max-w-md mx-auto"
          />
        </div>
      </div>
    );
  }

  const stats = [
    {
      value: counterValues[0],
      label: t('leadership.stats.total', 'Всего'),
      color: 'from-blue-500 to-blue-600',
      icon: '👥'
    },
    {
      value: counterValues[1],
      label: t('leadership.stats.directors', 'Директоров'),
      color: 'from-green-500 to-green-600',
      icon: '👑'
    },
    {
      value: counterValues[2],
      label: t('leadership.stats.departments', 'Отделов'),
      color: 'from-blue-500 to-green-500',
      icon: '🏢'
    },
    {
      value: counterValues[3],
      label: t('leadership.stats.categories', 'Категорий'),
      color: 'from-green-500 to-blue-500',
      icon: '📊'
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 mb-6 group hover:bg-white/20 transition-all duration-300">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-green-300 font-medium text-sm md:text-base">
              {t('leadership.badge', 'Руководство')}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('leadership.title', 'РУКОВОДСТВО АКАДЕМИИ')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4 leading-relaxed">
            {t('leadership.subtitle', 'Профессиональная команда опытных руководителей и преподавателей')}
          </p>
        </div>

        {/* Статистика */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 border border-white/20 shadow-2xl transition-all duration-500 hover:scale-105 hover:border-green-400/30 text-center"
            >
              {/* Иконка */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>

              {/* Число с анимацией */}
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono">
                {stat.value}
              </div>

              {/* Описание */}
              <div className="text-blue-100 font-medium text-sm md:text-base">{stat.label}</div>

              {/* Декоративные элементы */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
            </div>
          ))}
        </div>

        {/* Навигация по категориям */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20 shadow-lg">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => {
                const isActive = activeCategory === category.key;

                return (
                  <button
                    key={category.key}
                    onClick={() => handleCategoryChange(category)}
                    className={`flex items-center px-5 py-3 rounded-xl transition-all duration-300 font-medium ${isActive
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                      : `text-blue-100 hover:text-white hover:bg-white/10`
                      }`}
                  >
                    <span className="text-lg mr-2">{category.icon}</span>
                    <span>
                      {t(`leadership.categories.${category.key}`, category.key.replace('_', ' '))}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Содержимое категории */}
        <div className={`mb-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-4xl mr-4">
                {categories.find(cat => cat.key === activeCategory)?.icon}
              </span>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {t(`leadership.categories.${activeCategory}`, activeCategory.replace('_', ' '))}
                </h2>
                <p className="text-blue-100 mt-1">
                  {t('leadership.categoryDescription', 'Профессиональные руководители и преподаватели')}
                </p>
              </div>
            </div>
            <div className="text-sm text-blue-100 bg-white/10 px-4 py-2 rounded-xl border border-white/20">
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400 mr-2"></div>
                  {t('leadership.loading', 'Загрузка...')}
                </span>
              ) : (
                `${currentData.length} ${t('leadership.employees', 'сотрудников')}`
              )}
            </div>
          </div>

          {/* Сетка сотрудников */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }, (_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : currentData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentData.map((person, index) => (
                <div
                  key={person.id || index}
                  className="group bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:border-green-400/30 transition-all duration-500 overflow-hidden cursor-pointer hover:scale-102"
                  onClick={() => toggleCardExpand(person.id || index)}
                >
                  <div className="p-6">
                    {/* Фото и основная информация */}
                    <div className="flex items-center gap-4 mb-4">
                      {/* Фото сотрудника */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500/20 to-green-500/20 border-2 border-white/20 overflow-hidden group-hover:border-green-400/50 transition-colors relative">
                          {person.image_url || person.image ? (
                            <img
                              src={person.image_url || person.image}
                              alt={person.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-full h-full bg-gradient-to-br from-blue-500/30 to-green-500/30 flex items-center justify-center ${(person.image_url || person.image) ? 'hidden' : 'flex'}`}
                          >
                            <span className="text-lg font-bold text-white">
                              {generateInitials(person.name)}
                            </span>
                          </div>

                          {/* Декоративный элемент */}
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>

                      {/* Имя и должность */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate group-hover:text-green-300 transition-colors">
                          {person.name}
                        </h3>
                        <div className="bg-white/10 rounded-xl px-3 py-1 border border-white/20 mt-1 group-hover:border-green-400/30 transition-colors">
                          <p className="text-blue-100 font-semibold text-sm truncate group-hover:text-white">
                            {person.position}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Краткая информация */}
                    <div className="space-y-2">
                      {/* Education */}
                      {person.education && (
                        <div className="flex items-center gap-2 text-sm text-blue-100 group-hover:text-white transition-colors">
                          <span className="text-green-300">🎓</span>
                          <span>{person.education}</span>
                        </div>
                      )}

                      {/* Department */}
                      {person.department && (
                        <div className="flex items-center gap-2 text-sm text-blue-100 group-hover:text-white transition-colors">
                          <span className="text-green-300">🏢</span>
                          <span>{person.department}</span>
                        </div>
                      )}

                      {/* Experience Years */}
                      {person.experience_years && (
                        <div className="flex items-center gap-2 text-sm text-blue-100 group-hover:text-white transition-colors">
                          <span className="text-green-300">⏱️</span>
                          <span>{t('leadership.experience', 'Опыт')}: {person.experience_years} {t('leadership.years', 'лет')}</span>
                        </div>
                      )}
                    </div>

                    {/* Статус и теги */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {person.leadership_type && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                          {person.icon || '📊'} {t(`leadership.types.${person.leadership_type}`, person.leadership_type)}
                        </span>
                      )}
                      {(person.leadership_type === 'rector' || person.leadership_type === 'director') && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                          👑 {t('leadership.director', 'Руководитель')}
                        </span>
                      )}
                    </div>

                    {/* Кнопка раскрытия */}
                    <div className="flex justify-center mt-4">
                      <button className="flex items-center gap-1 text-green-300 text-sm font-medium hover:text-green-400 transition-colors group">
                        <span>{expandedCard === (person.id || index) ? t('leadership.showLess', 'Свернуть') : t('leadership.showMore', 'Подробнее')}</span>
                        <svg
                          className={`w-4 h-4 transform transition-transform group-hover:scale-110 ${expandedCard === (person.id || index) ? 'rotate-180' : ''
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Раскрытая информация */}
                  {expandedCard === (person.id || index) && (
                    <div className="border-t border-white/10 bg-white/5 p-6 space-y-4 animate-fadeIn">
                      {/* Education */}
                      {person.education && (
                        <div className="flex items-start gap-3 group">
                          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/30 transition-colors">
                            <span className="text-purple-300">🎓</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">
                              {t('leadership.education', 'Образование')}
                            </div>
                            <div className="text-sm text-blue-100 group-hover:text-white transition-colors">{person.education}</div>
                          </div>
                        </div>
                      )}

                      {/* Bio */}
                      {person.bio && (
                        <div className="flex items-start gap-3 group">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/30 transition-colors">
                            <span className="text-blue-300">📝</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white mb-1">
                              {t('leadership.bio', 'Биография')}
                            </div>
                            <div className="text-sm text-blue-100 leading-relaxed group-hover:text-white transition-colors">{person.bio}</div>
                          </div>
                        </div>
                      )}

                      {/* Achievements */}
                      {person.achievements && person.achievements.length > 0 && (
                        <div className="flex items-start gap-3 group">
                          <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-500/30 transition-colors">
                            <span className="text-yellow-300">🏆</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white mb-2">
                              {t('leadership.achievements', 'Достижения')}
                            </div>
                            <ul className="text-sm text-blue-100 space-y-1 group-hover:text-white transition-colors">
                              {person.achievements.map((achievement, idx) => (
                                <li key={idx} className="flex items-start group/item">
                                  <span className="mr-2 text-green-400 group-hover/item:text-green-300 transition-colors">•</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Contact Information */}
                      {(person.email || person.phone) && (
                        <div className="flex items-start gap-3 group">
                          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/30 transition-colors">
                            <span className="text-green-300">📞</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white mb-2">
                              {t('leadership.contacts', 'Контакты')}
                            </div>
                            <div className="space-y-1">
                              {person.email && (
                                <div className="flex items-center gap-2 text-sm group/item">
                                  <span className="text-blue-300">📧</span>
                                  <a
                                    href={`mailto:${person.email}`}
                                    className="text-green-300 hover:text-green-400 hover:underline transition-colors"
                                  >
                                    {person.email}
                                  </a>
                                </div>
                              )}
                              {person.phone && (
                                <div className="flex items-center gap-2 text-sm group/item">
                                  <span className="text-blue-300">📱</span>
                                  <a
                                    href={`tel:${person.phone}`}
                                    className="text-green-300 hover:text-green-400 hover:underline transition-colors"
                                  >
                                    {person.phone}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              message={t('leadership.noData', 'Данные не найдены')}
              icon={<div className="text-6xl mb-4">👥</div>}
              action={
                <button
                  onClick={() => setActiveCategory('all')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
                >
                  {t('leadership.viewAll', 'Посмотреть всех сотрудников')}
                </button>
              }
            />
          )}
        </div>

        {/* CTA Section */}
        <div className={`text-center transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 backdrop-blur-lg rounded-2xl md:rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
              {t('leadership.contactInfo.title', 'Нужна дополнительная информация?')}
            </h3>
            <p className="text-blue-100 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              {t('leadership.contactInfo.description', 'Свяжитесь с нашим отделом кадров для получения дополнительной информации о руководстве академии')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg">
                {t('leadership.contactInfo.button', 'Связаться с отделом кадров')}
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 border border-white/20 hover:border-green-400/30">
                {t('leadership.contactInfo.download', 'Скачать структуру')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Плавающие элементы для десктопа */}
      <div className="absolute bottom-20 left-5 w-6 h-6 bg-green-400/20 rounded-full animate-bounce hidden md:block"></div>
      <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping hidden md:block"></div>
    </section>
  );
};

export default AcademyLeadership;