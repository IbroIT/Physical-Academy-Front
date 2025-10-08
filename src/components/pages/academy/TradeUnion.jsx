// TradeUnion.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const TradeUnion = () => {
  const { t } = useTranslation();
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Данные преимуществ профсоюза
  const benefits = [
    {
      id: 1,
      title: t('tradeUnion.benefits.legal.title'),
      description: t('tradeUnion.benefits.legal.description'),
      icon: '⚖️',
      color: 'blue'
    },
    {
      id: 2,
      title: t('tradeUnion.benefits.financial.title'),
      description: t('tradeUnion.benefits.financial.description'),
      icon: '💰',
      color: 'green'
    },
    {
      id: 3,
      title: t('tradeUnion.benefits.social.title'),
      description: t('tradeUnion.benefits.social.description'),
      icon: '👥',
      color: 'blue'
    },
    {
      id: 4,
      title: t('tradeUnion.benefits.health.title'),
      description: t('tradeUnion.benefits.health.description'),
      icon: '🏥',
      color: 'green'
    }
  ];

  // Данные мероприятий
  const events = [
    {
      id: 1,
      title: t('tradeUnion.events.sportsFestival.title'),
      date: t('tradeUnion.events.sportsFestival.date'),
      description: t('tradeUnion.events.sportsFestival.description'),
      participants: '150+'
    },
    {
      id: 2,
      title: t('tradeUnion.events.legalConsultation.title'),
      date: t('tradeUnion.events.legalConsultation.date'),
      description: t('tradeUnion.events.legalConsultation.description'),
      participants: '89'
    },
    {
      id: 3,
      title: t('tradeUnion.events.healthDay.title'),
      date: t('tradeUnion.events.healthDay.date'),
      description: t('tradeUnion.events.healthDay.description'),
      participants: '200+'
    }
  ];

  // Анимация появления при скролле
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.getElementById('trade-union');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Автопереключение преимуществ
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBenefit(prev => (prev + 1) % benefits.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [benefits.length]);

  const handleJoinClick = () => {
    // В реальном приложении здесь будет логика отправки формы
    alert(t('tradeUnion.joinSuccess'));
  };

  return (
    <section id="trade-union" className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 px-4 overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Заголовок секции */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-6">
            {t('tradeUnion.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {t('tradeUnion.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Левая колонка - Основная информация */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Приветственное сообщение */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-blue-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('tradeUnion.welcome.title')}</h2>
              <p className="text-gray-600 mb-6">{t('tradeUnion.welcome.description')}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">{t('tradeUnion.welcome.members')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-gray-700">{t('tradeUnion.welcome.activeSince')}</span>
                </div>
              </div>
            </div>

            {/* Преимущества профсоюза */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('tradeUnion.benefits.title')}</h2>
              
              {/* Десктопная версия - сетка */}
              <div className="hidden md:grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={benefit.id}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      activeBenefit === index 
                        ? `border-${benefit.color}-500 bg-${benefit.color}-50 transform scale-105 shadow-md` 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                    onClick={() => setActiveBenefit(index)}
                  >
                    <div className="flex items-start">
                      <div className="text-2xl mr-3">{benefit.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Мобильная версия - карусель */}
              <div className="md:hidden relative overflow-hidden rounded-xl bg-blue-50 p-4">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${activeBenefit * 100}%)` }}
                >
                  {benefits.map((benefit) => (
                    <div key={benefit.id} className="w-full flex-shrink-0 p-4">
                      <div className="flex items-start">
                        <div className="text-2xl mr-3">{benefit.icon}</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{benefit.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Индикаторы для мобильной версии */}
                <div className="flex justify-center mt-4 space-x-2">
                  {benefits.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeBenefit === index ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      onClick={() => setActiveBenefit(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка - Мероприятия и форма */}
          <div className={`space-y-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Предстоящие мероприятия */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{t('tradeUnion.events.title')}</h2>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {t('tradeUnion.events.upcoming')}
                </span>
              </div>
              
              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="border-l-4 border-green-500 pl-4 py-2 hover:bg-green-50 transition-colors rounded-r">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900">{event.title}</h3>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                        {event.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                      </svg>
                      {event.participants} {t('tradeUnion.events.participants')}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-green-600 transition-all transform hover:scale-105">
                {t('tradeUnion.events.viewAll')}
              </button>
            </div>

            {/* Форма вступления в профсоюз */}
            <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl shadow-xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">{t('tradeUnion.join.title')}</h2>
              <p className="mb-6 opacity-90">{t('tradeUnion.join.subtitle')}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 opacity-90">
                    {t('tradeUnion.join.form.name')}
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder={t('tradeUnion.join.form.namePlaceholder')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 opacity-90">
                    {t('tradeUnion.join.form.email')}
                  </label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder={t('tradeUnion.join.form.emailPlaceholder')}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1 opacity-90">
                    {t('tradeUnion.join.form.position')}
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white">
                    <option value="">{t('tradeUnion.join.form.selectPosition')}</option>
                    <option value="teacher">{t('tradeUnion.join.form.positions.teacher')}</option>
                    <option value="trainer">{t('tradeUnion.join.form.positions.trainer')}</option>
                    <option value="staff">{t('tradeUnion.join.form.positions.staff')}</option>
                    <option value="student">{t('tradeUnion.join.form.positions.student')}</option>
                  </select>
                </div>
                
                <button 
                  onClick={handleJoinClick}
                  className="w-full mt-2 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105"
                >
                  {t('tradeUnion.join.form.submit')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradeUnion;