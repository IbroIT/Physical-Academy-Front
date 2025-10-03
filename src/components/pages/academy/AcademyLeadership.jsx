import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AcademyLeadership = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('rector');

  const categories = [
    { key: 'rector', icon: '👨‍🎓' },
    { key: 'proRectors', icon: '👩‍🎓' },
    { key: 'boardOfTrustees', icon: '🏛️' },
    { key: 'auditCommission', icon: '📊' },
    { key: 'academicCouncil', icon: '🎓' },
    { key: 'managementCouncil', icon: '⚙️' },
    { key: 'commissions', icon: '📋' },
  ];

  // Функция для генерации placeholder фото на основе имени
  const generateInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const leadershipData = t(`leadership.people.${activeCategory}`, { returnObjects: true });

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
              onClick={() => setActiveCategory(category.key)}
              className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                activeCategory === category.key
                  ? 'bg-green-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-blue-800 hover:bg-green-100 border border-green-200'
              }`}
            >
              <span className="text-xl mr-2">{category.icon}</span>
              <span className="font-semibold">
                {t(`leadership.categories.${category.key}`)}
              </span>
            </button>
          ))}
        </div>

        {/* Содержимое категории */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-8">
            <span className="text-3xl mr-4">
              {categories.find(cat => cat.key === activeCategory)?.icon}
            </span>
            <h2 className="text-3xl font-bold text-green-800">
              {t(`leadership.categories.${activeCategory}`)}
            </h2>
          </div>

          {/* Сетка сотрудников */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(leadershipData) && leadershipData.map((person, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100 hover:border-green-300 group"
              >
                {/* Фото сотрудника */}
                <div className="relative mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-green-400 to-blue-500 p-1 shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-white p-1">
                      {person.photo ? (
                        <img 
                          src={person.photo} 
                          alt={person.name}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-full h-full rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center ${person.photo ? 'hidden' : 'flex'}`}
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
                  
                  {person.degree && (
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {person.degree}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Сообщение если нет данных */}
          {(!Array.isArray(leadershipData) || leadershipData.length === 0) && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl text-gray-600">
                {t('leadership.noData')}
              </p>
            </div>
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