// BoardOfTrustees.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const BoardOfTrustees = () => {
  const { t } = useTranslation();
  const [activeTrustee, setActiveTrustee] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

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
      image: '/images/trustees/ivanov.jpg',
      email: 'ivanov@academy.ru',
      phone: '+7 (495) 123-45-67',
      icon: '👑'
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
      image: '/images/trustees/petrov.jpg',
      email: 'petrov@academy.ru',
      phone: '+7 (495) 123-45-68',
      icon: '💼'
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
      image: '/images/trustees/sidorova.jpg',
      email: 'sidorova@academy.ru',
      phone: '+7 (495) 123-45-69',
      icon: '🌍'
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
      image: '/images/trustees/kuznetsov.jpg',
      email: 'kuznetsov@academy.ru',
      phone: '+7 (495) 123-45-70',
      icon: '🏆'
    }
  ];

  const stats = [
    {
      value: counterValues[0],
      label: t('boardOfTrustees.stats.years'),
      color: 'from-blue-500 to-blue-600',
      icon: '📅'
    },
    {
      value: counterValues[1],
      label: t('boardOfTrustees.stats.projects'),
      color: 'from-green-500 to-green-600',
      icon: '🚀'
    },
    {
      value: counterValues[2],
      label: t('boardOfTrustees.stats.members'),
      color: 'from-blue-500 to-green-500',
      icon: '👥'
    },
    {
      value: counterValues[3],
      label: t('boardOfTrustees.stats.awards'),
      color: 'from-green-500 to-blue-500',
      icon: '🏅'
    }
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

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setActiveTrustee(prev => (prev + 1) % trustees.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, trustees.length]);

  const startCounters = () => {
    const targetValues = [15, 24, 8, 56];
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

  const handleTrusteeClick = (index) => {
    setActiveTrustee(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

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
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 mb-6 group hover:bg-white/20 transition-all duration-300">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-green-300 font-medium text-sm md:text-base">
              {t('boardOfTrustees.badge', 'Попечительский совет')}
            </span>
          </div>
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
            <div className={`bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-102 hover:border-green-400/30 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-2/5 relative">
                  <div className="h-80 md:h-full bg-gradient-to-br from-blue-500/20 to-green-500/20 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                          <span className="text-4xl text-white">{trustees[activeTrustee].icon}</span>
                        </div>
                        <p className="text-blue-100 text-sm font-medium">{t('boardOfTrustees.photoPlaceholder')}</p>
                      </div>
                    </div>
                    
                    {/* Декоративные элементы */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-ping opacity-60"></div>
                    <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
                  </div>
                </div>
                <div className="p-6 md:p-8 md:w-3/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-0">{trustees[activeTrustee].name}</h2>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-400/30">
                      {trustees[activeTrustee].position}
                    </span>
                  </div>
                  
                  <p className="text-blue-100 mb-6 leading-relaxed">{trustees[activeTrustee].bio}</p>
                  
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center">
                    <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                    {t('boardOfTrustees.achievements')}
                  </h3>
                  <ul className="space-y-3 mb-8">
                    {trustees[activeTrustee].achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start group hover:transform hover:translate-x-2 transition-transform duration-300">
                        <svg className="h-6 w-6 text-green-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-blue-100 group-hover:text-white transition-colors">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Контактная информация */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-blue-100 group hover:text-white transition-colors">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-500/30 transition-colors">
                        <span className="text-blue-300">📧</span>
                      </div>
                      <div>
                        <div className="text-sm text-blue-300">Email</div>
                        <div className="font-medium">{trustees[activeTrustee].email}</div>
                      </div>
                    </div>
                    <div className="flex items-center text-blue-100 group hover:text-white transition-colors">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-500/30 transition-colors">
                        <span className="text-green-300">📞</span>
                      </div>
                      <div>
                        <div className="text-sm text-green-300">Телефон</div>
                        <div className="font-medium">{trustees[activeTrustee].phone}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <button className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                      {t('boardOfTrustees.contact')}
                    </button>
                    <button className="flex items-center justify-center px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 hover:border-green-400/30 transition-all duration-300">
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

          {/* Боковая панель с попечителями и статистикой */}
          <div className={`space-y-6 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
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
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group ${
                      activeTrustee === index 
                        ? 'border-green-400 bg-green-500/20 transform scale-105 shadow-lg' 
                        : 'border-white/20 hover:border-green-400/50 hover:bg-white/10'
                    }`}
                    onClick={() => handleTrusteeClick(index)}
                  >
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold mr-4 transition-all duration-300 ${
                        activeTrustee === index
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
                {t('boardOfTrustees.stats.title')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-white/5 rounded-2xl p-4 text-center group hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  >
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-xl mb-2 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      {stat.icon}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Навигационные точки */}
        <div className={`flex justify-center mt-8 md:mt-12 space-x-3 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {trustees.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeTrustee === index 
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