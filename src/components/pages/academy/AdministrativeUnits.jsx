// AdministrativeUnits.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const AdministrativeUnits = () => {
  const { t } = useTranslation();
  const [activeUnit, setActiveUnit] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  // Данные административных подразделений
  const units = [
    {
      id: 1,
      name: t('administrativeUnits.units.rectorate.name'),
      description: t('administrativeUnits.units.rectorate.description'),
      head: t('administrativeUnits.units.rectorate.head'),
      email: 'rector@academy.ru',
      phone: '+7 (495) 111-11-11',
      location: t('administrativeUnits.units.rectorate.location'),
      staff: t('administrativeUnits.units.rectorate.staff'),
      icon: '🏛️',
      color: 'blue',
      colorClass: 'from-blue-500 to-blue-600',
      responsibilities: [
        t('administrativeUnits.units.rectorate.responsibilities.0'),
        t('administrativeUnits.units.rectorate.responsibilities.1'),
        t('administrativeUnits.units.rectorate.responsibilities.2')
      ]
    },
    {
      id: 2,
      name: t('administrativeUnits.units.educationalDepartment.name'),
      description: t('administrativeUnits.units.educationalDepartment.description'),
      head: t('administrativeUnits.units.educationalDepartment.head'),
      email: 'education@academy.ru',
      phone: '+7 (495) 111-22-22',
      location: t('administrativeUnits.units.educationalDepartment.location'),
      staff: t('administrativeUnits.units.educationalDepartment.staff'),
      icon: '📚',
      color: 'green',
      colorClass: 'from-green-500 to-green-600',
      responsibilities: [
        t('administrativeUnits.units.educationalDepartment.responsibilities.0'),
        t('administrativeUnits.units.educationalDepartment.responsibilities.1'),
        t('administrativeUnits.units.educationalDepartment.responsibilities.2')
      ]
    },
    {
      id: 3,
      name: t('administrativeUnits.units.internationalDepartment.name'),
      description: t('administrativeUnits.units.internationalDepartment.description'),
      head: t('administrativeUnits.units.internationalDepartment.head'),
      email: 'international@academy.ru',
      phone: '+7 (495) 111-33-33',
      location: t('administrativeUnits.units.internationalDepartment.location'),
      staff: t('administrativeUnits.units.internationalDepartment.staff'),
      icon: '🌍',
      color: 'blue',
      colorClass: 'from-blue-500 to-blue-600',
      responsibilities: [
        t('administrativeUnits.units.internationalDepartment.responsibilities.0'),
        t('administrativeUnits.units.internationalDepartment.responsibilities.1'),
        t('administrativeUnits.units.internationalDepartment.responsibilities.2')
      ]
    },
    {
      id: 4,
      name: t('administrativeUnits.units.financeDepartment.name'),
      description: t('administrativeUnits.units.financeDepartment.description'),
      head: t('administrativeUnits.units.financeDepartment.head'),
      email: 'finance@academy.ru',
      phone: '+7 (495) 111-44-44',
      location: t('administrativeUnits.units.financeDepartment.location'),
      staff: t('administrativeUnits.units.financeDepartment.staff'),
      icon: '💰',
      color: 'green',
      colorClass: 'from-green-500 to-green-600',
      responsibilities: [
        t('administrativeUnits.units.financeDepartment.responsibilities.0'),
        t('administrativeUnits.units.financeDepartment.responsibilities.1'),
        t('administrativeUnits.units.financeDepartment.responsibilities.2')
      ]
    },
    {
      id: 5,
      name: t('administrativeUnits.units.hrDepartment.name'),
      description: t('administrativeUnits.units.hrDepartment.description'),
      head: t('administrativeUnits.units.hrDepartment.head'),
      email: 'hr@academy.ru',
      phone: '+7 (495) 111-55-55',
      location: t('administrativeUnits.units.hrDepartment.location'),
      staff: t('administrativeUnits.units.hrDepartment.staff'),
      icon: '👥',
      color: 'blue',
      colorClass: 'from-blue-500 to-blue-600',
      responsibilities: [
        t('administrativeUnits.units.hrDepartment.responsibilities.0'),
        t('administrativeUnits.units.hrDepartment.responsibilities.1'),
        t('administrativeUnits.units.hrDepartment.responsibilities.2')
      ]
    },
    {
      id: 6,
      name: t('administrativeUnits.units.researchDepartment.name'),
      description: t('administrativeUnits.units.researchDepartment.description'),
      head: t('administrativeUnits.units.researchDepartment.head'),
      email: 'research@academy.ru',
      phone: '+7 (495) 111-66-66',
      location: t('administrativeUnits.units.researchDepartment.location'),
      staff: t('administrativeUnits.units.researchDepartment.staff'),
      icon: '🔬',
      color: 'green',
      colorClass: 'from-green-500 to-green-600',
      responsibilities: [
        t('administrativeUnits.units.researchDepartment.responsibilities.0'),
        t('administrativeUnits.units.researchDepartment.responsibilities.1'),
        t('administrativeUnits.units.researchDepartment.responsibilities.2')
      ]
    }
  ];

  // Фильтрация подразделений по поисковому запросу
  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    unit.head.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleUnitClick = (index) => {
    setActiveUnit(index);
  };

  const handleContactClick = (email, phone) => {
    // В реальном приложении здесь будет логика открытия контактов
    alert(`${t('administrativeUnits.contactEmail')}: ${email}\n${t('administrativeUnits.contactPhone')}: ${phone}`);
  };

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
        {/* Заголовок секции */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 mb-6 group hover:bg-white/20 transition-all duration-300">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-green-300 font-medium text-sm md:text-base">
              {t('administrativeUnits.badge')}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('administrativeUnits.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto px-4 leading-relaxed">
            {t('administrativeUnits.subtitle')}
          </p>
          
          {/* Поисковая строка */}
          <div className="max-w-2xl mx-auto mt-8">
            <div className="relative">
              <input
                type="text"
                placeholder={t('administrativeUnits.searchPlaceholder')}
                className="w-full px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent shadow-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Левая колонка - Список подразделений */}
          <div className={`lg:col-span-1 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 border border-white/20 shadow-2xl sticky top-6 max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">{t('administrativeUnits.allUnits')}</h2>
              
              <div className="space-y-4">
                {filteredUnits.map((unit, index) => (
                  <div 
                    key={unit.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group ${
                      activeUnit === index 
                        ? `bg-gradient-to-br ${unit.colorClass} text-white border-white/30 transform scale-105 shadow-2xl` 
                        : 'bg-white/5 border-white/20 hover:border-green-400/50 hover:bg-white/10 hover:shadow-xl'
                    }`}
                    onClick={() => handleUnitClick(index)}
                  >
                    <div className="flex items-start">
                      <div className={`text-2xl mr-4 p-2 rounded-lg ${
                        activeUnit === index ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'
                      } transition-all duration-300`}>
                        {unit.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${
                          activeUnit === index ? 'text-white' : 'text-white group-hover:text-green-300'
                        } transition-colors duration-300`}>
                          {unit.name}
                        </h3>
                        <p className={`text-sm mt-1 line-clamp-2 ${
                          activeUnit === index ? 'text-white/90' : 'text-blue-100 group-hover:text-white'
                        } transition-colors duration-300`}>
                          {unit.description}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-blue-200">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                          </svg>
                          {unit.staff}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredUnits.length === 0 && (
                  <div className="text-center py-8 text-blue-200">
                    {t('administrativeUnits.noResults')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Правая колонка - Детальная информация о выбранном подразделении */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Заголовок карточки */}
              <div className={`bg-gradient-to-r ${filteredUnits[activeUnit]?.colorClass} p-6 md:p-8 text-white`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="text-3xl md:text-4xl mr-4">{filteredUnits[activeUnit]?.icon}</div>
                      <h2 className="text-3xl md:text-4xl font-bold">{filteredUnits[activeUnit]?.name}</h2>
                    </div>
                    <p className="text-lg md:text-xl opacity-90">{filteredUnits[activeUnit]?.description}</p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                      </svg>
                      {filteredUnits[activeUnit]?.staff}
                    </div>
                  </div>
                </div>
              </div>

              {/* Основной контент */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Информация о руководителе */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{t('administrativeUnits.departmentHead')}</h3>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                          {filteredUnits[activeUnit]?.head.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-lg">{filteredUnits[activeUnit]?.head}</h4>
                          <p className="text-blue-100">{t('administrativeUnits.headOfDepartment')}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Контактная информация */}
                    <div className="mt-6">
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{t('administrativeUnits.contactInfo')}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-blue-100">{filteredUnits[activeUnit]?.location}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                          </svg>
                          <span className="text-blue-100">{filteredUnits[activeUnit]?.email}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-400 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                          </svg>
                          <span className="text-blue-100">{filteredUnits[activeUnit]?.phone}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleContactClick(filteredUnits[activeUnit]?.email, filteredUnits[activeUnit]?.phone)}
                        className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-green-600 transition-all transform hover:scale-105 shadow-2xl border border-white/20"
                      >
                        {t('administrativeUnits.contactButton')}
                      </button>
                    </div>
                  </div>

                  {/* Обязанности подразделения */}
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{t('administrativeUnits.responsibilities')}</h3>
                    <ul className="space-y-3">
                      {filteredUnits[activeUnit]?.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start group">
                          <svg className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-blue-100 group-hover:text-white transition-colors duration-300">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Дополнительная информация */}
                    <div className="mt-8 bg-blue-500/20 backdrop-blur-lg rounded-xl p-6 border border-blue-400/30">
                      <h4 className="font-semibold text-blue-300 mb-2">{t('administrativeUnits.workingHours')}</h4>
                      <p className="text-blue-100">09:00 - 18:00, {t('administrativeUnits.weekdays')}</p>
                      
                      <h4 className="font-semibold text-green-300 mt-4 mb-2">{t('administrativeUnits.receptionHours')}</h4>
                      <p className="text-blue-100">10:00 - 16:00, {t('administrativeUnits.weekdays')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Быстрая навигация */}
            <div className={`mt-8 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h3 className="text-2xl font-bold text-white mb-6 text-center">{t('administrativeUnits.quickNavigation')}</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {units.map((unit, index) => (
                  <button
                    key={unit.id}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 text-center group ${
                      activeUnit === index 
                        ? `bg-gradient-to-br ${unit.colorClass} text-white border-white/30 shadow-lg scale-105` 
                        : 'bg-white/5 border-white/20 hover:border-green-400/50 hover:bg-white/10 hover:shadow-md'
                    }`}
                    onClick={() => handleUnitClick(index)}
                  >
                    <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{unit.icon}</div>
                    <div className={`text-sm font-medium line-clamp-2 ${
                      activeUnit === index ? 'text-white' : 'text-blue-100 group-hover:text-white'
                    } transition-colors duration-300`}>
                      {unit.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Плавающие элементы для десктопа */}
      {!isMobile && (
        <>
          <div className="absolute bottom-20 left-5 w-6 h-6 bg-green-400/20 rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping"></div>
        </>
      )}
    </section>
  );
};

export default AdministrativeUnits;