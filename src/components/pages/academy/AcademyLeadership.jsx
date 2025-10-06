import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeadership, useDirectors } from '../../../hooks/useApi';
import { PageLoading, ErrorDisplay, EmptyState, CardSkeleton } from '../../common/Loading';

const AcademyLeadership = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);

  // API hooks
  const filters = selectedType ? { leadership_type: selectedType } : {};
  const { leadership, loading, error, refetch } = useLeadership(filters);
  const { data: directors, loading: directorsLoading } = useDirectors();

  const categories = [
    { key: 'all', icon: '👥', apiFilter: '', color: 'blue' },
    { key: 'directors', icon: '👑', apiFilter: 'director', color: 'green' },
    { key: 'deputy_directors', icon: '🌟', apiFilter: 'deputy_director', color: 'blue' },
    { key: 'department_heads', icon: '🏛️', apiFilter: 'department_head', color: 'green' },
    { key: 'deans', icon: '📚', apiFilter: 'dean', color: 'blue' },
    { key: 'vice_deans', icon: '🎓', apiFilter: 'vice_dean', color: 'green' },
  ];

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
    if (activeCategory === 'directors') {
      return directorsLoading ? [] : (directors?.data || directors || []);
    }
    return leadership || [];
  };

  const currentData = getCurrentData();
  const isLoading = loading || (activeCategory === 'directors' && directorsLoading);

  if (isLoading && currentData.length === 0) {
    return <PageLoading message={t('leadership.loading', 'Загрузка руководства...')} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
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

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          hover: 'hover:bg-green-100',
          active: 'bg-green-600 text-white'
        };
      case 'blue':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          hover: 'hover:bg-blue-100',
          active: 'bg-blue-600 text-white'
        };
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('leadership.title', 'Руководство академии')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('leadership.subtitle', 'Профессиональная команда опытных руководителей и преподавателей')}
          </p>
        </div>

        {/* Навигация по категориям */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => {
            const colors = getColorClasses(category.color);
            const isActive = activeCategory === category.key;
            
            return (
              <button
                key={category.key}
                onClick={() => handleCategoryChange(category)}
                className={`flex items-center px-5 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive
                    ? `${colors.active} shadow-md transform scale-105`
                    : `bg-white text-gray-700 border ${colors.border} ${colors.hover}`
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

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {currentData.length}
            </div>
            <div className="text-blue-800 text-sm font-medium">
              {t('leadership.stats.total', 'Всего')}
            </div>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {currentData.filter(p => p.is_director).length}
            </div>
            <div className="text-green-800 text-sm font-medium">
              {t('leadership.stats.directors', 'Директоров')}
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {currentData.filter(p => p.department).length}
            </div>
            <div className="text-blue-800 text-sm font-medium">
              {t('leadership.stats.departments', 'Отделов')}
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-gray-600 mb-1">
              {categories.length}
            </div>
            <div className="text-gray-800 text-sm font-medium">
              {t('leadership.stats.categories', 'Категорий')}
            </div>
          </div>
        </div>

        {/* Содержимое категории */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <span className="text-3xl mr-4">
                {categories.find(cat => cat.key === activeCategory)?.icon}
              </span>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {t(`leadership.categories.${activeCategory}`, activeCategory.replace('_', ' '))}
                </h2>
                <p className="text-gray-600 mt-1">
                  {t('leadership.categoryDescription', 'Профессиональные руководители и преподаватели')}
                </p>
              </div>
            </div>
            <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl">
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
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
                  className="bg-white rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden group cursor-pointer"
                  onClick={() => toggleCardExpand(person.id || index)}
                >
                  <div className="p-6">
                    {/* Фото и основная информация */}
                    <div className="flex items-center gap-4 mb-4">
                      {/* Фото сотрудника */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-xl bg-blue-50 border-2 border-blue-100 overflow-hidden group-hover:border-blue-300 transition-colors">
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
                            className={`w-full h-full bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center ${(person.image_url || person.image) ? 'hidden' : 'flex'}`}
                          >
                            <span className="text-lg font-bold text-blue-600">
                              {generateInitials(person.name)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Имя и должность */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {person.name}
                        </h3>
                        <div className="bg-blue-50 rounded-lg px-3 py-1 border border-blue-100 mt-1">
                          <p className="text-blue-700 font-semibold text-sm truncate">
                            {person.position}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Краткая информация */}
                    <div className="space-y-2">
                      {/* Degree */}
                      {person.degree && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>🎓</span>
                          <span>{person.degree}</span>
                        </div>
                      )}

                      {/* Department */}
                      {person.department && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>🏢</span>
                          <span>{person.department}</span>
                        </div>
                      )}

                      {/* Experience */}
                      {person.experience && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>⏱️</span>
                          <span>{t('leadership.experience', 'Опыт')}: {person.experience}</span>
                        </div>
                      )}
                    </div>

                    {/* Статус и теги */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {person.leadership_type_display && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          📊 {person.leadership_type_display}
                        </span>
                      )}
                      {person.is_director && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          👑 {t('leadership.director', 'Директор')}
                        </span>
                      )}
                    </div>

                    {/* Кнопка раскрытия */}
                    <div className="flex justify-center mt-4">
                      <button className="flex items-center gap-1 text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
                        <span>{expandedCard === (person.id || index) ? t('leadership.showLess', 'Свернуть') : t('leadership.showMore', 'Подробнее')}</span>
                        <svg 
                          className={`w-4 h-4 transform transition-transform ${
                            expandedCard === (person.id || index) ? 'rotate-180' : ''
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
                    <div className="border-t border-gray-100 bg-gray-50 p-6 space-y-4">
                      {/* Specialization */}
                      {person.specialization && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-600">🔬</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {t('leadership.specialization', 'Специализация')}
                            </div>
                            <div className="text-sm text-gray-600">{person.specialization}</div>
                          </div>
                        </div>
                      )}

                      {/* Bio */}
                      {person.bio && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600">📝</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {t('leadership.bio', 'Биография')}
                            </div>
                            <div className="text-sm text-gray-600 leading-relaxed">{person.bio}</div>
                          </div>
                        </div>
                      )}

                      {/* Achievements */}
                      {person.achievements && person.achievements.length > 0 && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-yellow-600">🏆</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 mb-2">
                              {t('leadership.achievements', 'Достижения')}
                            </div>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {person.achievements.map((achievement, idx) => (
                                <li key={idx} className="flex items-start">
                                  <span className="mr-2 text-green-500">•</span>
                                  <span>{achievement}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Contact Information */}
                      {(person.email || person.phone) && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600">📞</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 mb-2">
                              {t('leadership.contacts', 'Контакты')}
                            </div>
                            <div className="space-y-1">
                              {person.email && (
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-gray-500">📧</span>
                                  <a 
                                    href={`mailto:${person.email}`} 
                                    className="text-blue-600 hover:text-blue-700 hover:underline"
                                  >
                                    {person.email}
                                  </a>
                                </div>
                              )}
                              {person.phone && (
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-gray-500">📱</span>
                                  <a 
                                    href={`tel:${person.phone}`} 
                                    className="text-blue-600 hover:text-blue-700 hover:underline"
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
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  {t('leadership.viewAll', 'Посмотреть всех сотрудников')}
                </button>
              }
            />
          )}
        </div>

        {/* Дополнительная информация */}
        <div className="bg-blue-50 rounded-2xl p-8 text-center border border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {t('leadership.contactInfo.title', 'Нужна дополнительная информация?')}
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('leadership.contactInfo.description', 'Свяжитесь с нашим отделом кадров для получения дополнительной информации о руководстве академии')}
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
            {t('leadership.contactInfo.button', 'Связаться с отделом кадров')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcademyLeadership;