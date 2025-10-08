// BoardOfTrustees.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const BoardOfTrustees = () => {
  const { t } = useTranslation();
  const [activeTrustee, setActiveTrustee] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Данные попечителей
  const trustees = [
    {
      id: 1,
      name: t('trustees.ivanov.name'),
      position: t('trustees.ivanov.position'),
      bio: t('trustees.ivanov.bio'),
      achievements: [
        t('trustees.ivanov.achievements.0'),
        t('trustees.ivanov.achievements.1'),
        t('trustees.ivanov.achievements.2')
      ],
      image: '/images/trustee1.jpg'
    },
    {
      id: 2,
      name: t('trustees.petrov.name'),
      position: t('trustees.petrov.position'),
      bio: t('trustees.petrov.bio'),
      achievements: [
        t('trustees.petrov.achievements.0'),
        t('trustees.petrov.achievements.1'),
        t('trustees.petrov.achievements.2')
      ],
      image: '/images/trustee2.jpg'
    },
    {
      id: 3,
      name: t('trustees.sidorova.name'),
      position: t('trustees.sidorova.position'),
      bio: t('trustees.sidorova.bio'),
      achievements: [
        t('trustees.sidorova.achievements.0'),
        t('trustees.sidorova.achievements.1'),
        t('trustees.sidorova.achievements.2')
      ],
      image: '/images/trustee3.jpg'
    },
    {
      id: 4,
      name: t('trustees.kuznetsov.name'),
      position: t('trustees.kuznetsov.position'),
      bio: t('trustees.kuznetsov.bio'),
      achievements: [
        t('trustees.kuznetsov.achievements.0'),
        t('trustees.kuznetsov.achievements.1'),
        t('trustees.kuznetsov.achievements.2')
      ],
      image: '/images/trustee4.jpg'
    }
  ];

  // Автопереключение карточек
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveTrustee(prev => (prev + 1) % trustees.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, trustees.length]);

  const handleTrusteeClick = (index) => {
    setActiveTrustee(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-16 px-4 overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Заголовок секции */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            {t('boardOfTrustees.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('boardOfTrustees.subtitle')}
          </p>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Карточка активного попечителя */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
              <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-1/3 relative">
                  <div className="h-64 md:h-full bg-gradient-to-br from-blue-500 to-green-500 relative overflow-hidden">
                    {/* Заглушка для изображения */}
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <p className="text-sm font-medium">{t('boardOfTrustees.photoPlaceholder')}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-8 md:w-2/3">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{trustees[activeTrustee].name}</h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {trustees[activeTrustee].position}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">{trustees[activeTrustee].bio}</p>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{t('boardOfTrustees.achievements')}</h3>
                  <ul className="space-y-2 mb-6">
                    {trustees[activeTrustee].achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex space-x-4">
                    <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                      {t('boardOfTrustees.contact')}
                    </button>
                    <button className="flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path>
                      </svg>
                      {t('boardOfTrustees.profile')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Список всех попечителей */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">{t('boardOfTrustees.allTrustees')}</h3>
            <div className="space-y-4">
              {trustees.map((trustee, index) => (
                <div 
                  key={trustee.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    activeTrustee === index 
                      ? 'border-blue-500 bg-blue-50 transform scale-105 shadow-md' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                  onClick={() => handleTrusteeClick(index)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold mr-4">
                      {trustee.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{trustee.name}</h4>
                      <p className="text-sm text-gray-600">{trustee.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Статистика */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('boardOfTrustees.stats.title')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700">15</div>
                  <div className="text-sm text-gray-600">{t('boardOfTrustees.stats.years')}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">24</div>
                  <div className="text-sm text-gray-600">{t('boardOfTrustees.stats.projects')}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-700">8</div>
                  <div className="text-sm text-gray-600">{t('boardOfTrustees.stats.members')}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-700">56</div>
                  <div className="text-sm text-gray-600">{t('boardOfTrustees.stats.awards')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Навигационные точки */}
        <div className="flex justify-center mt-8 space-x-2">
          {trustees.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                activeTrustee === index ? 'bg-blue-500 scale-125' : 'bg-gray-300'
              }`}
              onClick={() => handleTrusteeClick(index)}
              aria-label={t('boardOfTrustees.goToSlide', { number: index + 1 })}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BoardOfTrustees;