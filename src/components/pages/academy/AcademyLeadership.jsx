import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLeadership, useDirectors } from '../../../hooks/useApi';
import { PageLoading, ErrorDisplay, EmptyState, CardSkeleton } from '../../common/Loading';

const AcademyLeadership = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('');

  // API hooks
  const filters = selectedType ? { leadership_type: selectedType } : {};
  const { leadership, loading, error, refetch } = useLeadership(filters);
  const { data: directors, loading: directorsLoading } = useDirectors();

  const categories = [
    { key: 'all', icon: '👥', apiFilter: '' },
    { key: 'directors', icon: '👨‍🎓', apiFilter: 'director' },
    { key: 'deputy_directors', icon: '👩‍🎓', apiFilter: 'deputy_director' },
    { key: 'department_heads', icon: '🏛️', apiFilter: 'department_head' },
    { key: 'deans', icon: '📊', apiFilter: 'dean' },
    { key: 'vice_deans', icon: '🎓', apiFilter: 'vice_dean' },
  ];

  const handleCategoryChange = (category) => {
    setActiveCategory(category.key);
    setSelectedType(category.apiFilter);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            {t('leadership.title')}
          </h1>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            {t('leadership.subtitle')}
          </p>
        </div>

        {/* Навигация по категориям */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => handleCategoryChange(category)}
              className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${activeCategory === category.key
                  ? 'bg-green-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-blue-800 hover:bg-green-100 border border-green-200'
                }`}
            >
              <span className="text-xl mr-2">{category.icon}</span>
              <span className="font-semibold">
                {t(`leadership.categories.${category.key}`, category.key)}
              </span>
            </button>
          ))}
        </div>

        {/* Содержимое категории */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <span className="text-3xl mr-4">
                {categories.find(cat => cat.key === activeCategory)?.icon}
              </span>
              <h2 className="text-3xl font-bold text-green-800">
                {t(`leadership.categories.${activeCategory}`, activeCategory)}
              </h2>
            </div>
            <div className="text-sm text-gray-600">
              {isLoading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                  Загрузка...
                </span>
              ) : (
                `${currentData.length} ${currentData.length === 1 ? 'сотрудник' : 'сотрудников'}`
              )}
            </div>
          </div>

          {/* Сетка сотрудников */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }, (_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : currentData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentData.map((person, index) => (
                <div
                  key={person.id || index}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300 group"
                >
                  {/* Фото сотрудника */}
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-400 to-blue-500 p-1 shadow-lg group-hover:scale-105 transition-transform duration-300">
                      <div className="w-full h-full rounded-full bg-white p-1">
                        {person.image_url || person.image ? (
                          <img
                            src={person.image_url || person.image}
                            alt={person.name}
                            className="w-full h-full rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className={`w-full h-full rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center ${(person.image_url || person.image) ? 'hidden' : 'flex'}`}
                        >
                          <span className="text-2xl font-bold text-green-800">
                            {generateInitials(person.name)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Декоративный элемент */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                  </div>

                  {/* Информация о сотруднике */}
                  <div className="text-center space-y-3">
                    <h3 className="text-xl font-bold text-green-800 leading-tight">
                      {person.name}
                    </h3>

                    <div className="bg-green-50 rounded-lg py-2 px-4 border border-green-200">
                      <p className="text-blue-700 font-semibold text-sm">
                        {person.position}
                      </p>
                    </div>

                    {/* Degree */}
                    {person.degree && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        🎓 {person.degree}
                      </p>
                    )}

                    {/* Department */}
                    {person.department && (
                      <div className="text-xs text-blue-600 bg-blue-50 rounded-full px-3 py-1">
                        🏢 {person.department}
                      </div>
                    )}

                    {/* Specialization */}
                    {person.specialization && (
                      <div className="text-xs text-purple-600 bg-purple-50 rounded-full px-3 py-1">
                        🔬 {person.specialization}
                      </div>
                    )}

                    {/* Experience */}
                    {person.experience && (
                      <p className="text-xs text-gray-500">
                        ⏱️ Опыт: {person.experience}
                      </p>
                    )}

                    {/* Bio */}
                    {person.bio && (
                      <div className="bg-gray-50 rounded-lg p-3 text-left">
                        <p className="text-xs text-gray-700 leading-relaxed">
                          <strong>Биография:</strong> {person.bio}
                        </p>
                      </div>
                    )}

                    {/* Achievements */}
                    {person.achievements && person.achievements.length > 0 && (
                      <div className="bg-yellow-50 rounded-lg p-3 text-left">
                        <p className="text-xs font-semibold text-yellow-800 mb-2">🏆 Достижения:</p>
                        <ul className="text-xs text-yellow-700 space-y-1">
                          {person.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="mr-1">•</span>
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Contact Information */}
                    {(person.email || person.phone) && (
                      <div className="text-xs text-gray-600 space-y-1 pt-2 bg-gray-50 rounded-lg p-3">
                        <p className="font-semibold mb-2">📞 Контакты:</p>
                        {person.email && (
                          <p className="flex items-center justify-center">
                            <span className="mr-2">📧</span>
                            <a href={`mailto:${person.email}`} className="text-blue-600 hover:underline">
                              {person.email}
                            </a>
                          </p>
                        )}
                        {person.phone && (
                          <p className="flex items-center justify-center">
                            <span className="mr-2">�</span>
                            <a href={`tel:${person.phone}`} className="text-blue-600 hover:underline">
                              {person.phone}
                            </a>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Leadership Type and Status */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {person.leadership_type_display && (
                        <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                          📊 {person.leadership_type_display}
                        </span>
                      )}
                      {person.is_director && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          👑 Директор
                        </span>
                      )}
                      {person.order && (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                          #️⃣ Порядок: {person.order}
                        </span>
                      )}
                    </div>

                    {/* API ID for developers */}
                    <div className="text-xs text-gray-400 mt-2">
                      ID: {person.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              message={t('leadership.noData', 'Данные не найдены')}
              icon={<div className="text-6xl mb-4">👥</div>}
            />
          )}
        </div>

        {/* Дополнительная информация */}
        <div className="mt-8 text-center bg-white rounded-xl p-6 shadow-lg">
          <p className="text-blue-700 text-lg">
            {t('leadership.contactInfo')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcademyLeadership;