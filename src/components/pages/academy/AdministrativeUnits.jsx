// AdministrativeUnits.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AdministrativeUnits = () => {
  const { t } = useTranslation();
  const [activeUnit, setActiveUnit] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Данные административных подразделений
  const units = [
    {
      id: 1,
      name: t('administrativeUnits.units.rectorate.name'),
      description: t('administrativeUnits.units.rectorate.description'),
      head: t('administrativeUnits.units.rectorate.head'),
      email: 'rector@academy.ru',
      phone: '+7 (495) 111-11-11',
      location: 'Главный корпус, 3 этаж',
      staff: '15 сотрудников',
      icon: '🏛️',
      color: 'blue',
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
      location: 'Учебный корпус, 2 этаж',
      staff: '12 сотрудников',
      icon: '📚',
      color: 'green',
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
      location: 'Главный корпус, 4 этаж',
      staff: '8 сотрудников',
      icon: '🌍',
      color: 'blue',
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
      location: 'Административный корпус, 1 этаж',
      staff: '10 сотрудников',
      icon: '💰',
      color: 'green',
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
      location: 'Административный корпус, 2 этаж',
      staff: '6 сотрудников',
      icon: '👥',
      color: 'blue',
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
      location: 'Научный корпус, 3 этаж',
      staff: '14 сотрудников',
      icon: '🔬',
      color: 'green',
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

    const section = document.getElementById('administrative-units');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
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
    <section id="administrative-units" className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 px-4 overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Заголовок секции */}
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-6">
            {t('administrativeUnits.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            {t('administrativeUnits.subtitle')}
          </p>
          
          {/* Поисковая строка */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder={t('administrativeUnits.searchPlaceholder')}
                className="w-full px-6 py-4 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - Список подразделений */}
          <div className={`lg:col-span-1 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6 max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('administrativeUnits.allUnits')}</h2>
              
              <div className="space-y-4">
                {filteredUnits.map((unit, index) => (
                  <div 
                    key={unit.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                      activeUnit === index 
                        ? `border-${unit.color}-500 bg-${unit.color}-50 transform scale-105 shadow-md` 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                    onClick={() => handleUnitClick(index)}
                  >
                    <div className="flex items-start">
                      <div className={`text-2xl mr-4 p-2 rounded-lg bg-${unit.color}-100`}>
                        {unit.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{unit.name}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{unit.description}</p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
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
                  <div className="text-center py-8 text-gray-500">
                    {t('administrativeUnits.noResults')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Правая колонка - Детальная информация о выбранном подразделении */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Заголовок карточки */}
              <div className={`bg-gradient-to-r from-${filteredUnits[activeUnit]?.color}-500 to-${filteredUnits[activeUnit]?.color}-600 p-8 text-white`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="text-3xl mr-4">{filteredUnits[activeUnit]?.icon}</div>
                      <h2 className="text-3xl font-bold">{filteredUnits[activeUnit]?.name}</h2>
                    </div>
                    <p className="text-lg opacity-90">{filteredUnits[activeUnit]?.description}</p>
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
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Информация о руководителе */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{t('administrativeUnits.departmentHead')}</h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                          {filteredUnits[activeUnit]?.head.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{filteredUnits[activeUnit]?.head}</h4>
                          <p className="text-gray-600">{t('administrativeUnits.headOfDepartment')}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Контактная информация */}
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{t('administrativeUnits.contactInfo')}</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-gray-700">{filteredUnits[activeUnit]?.location}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                          </svg>
                          <span className="text-gray-700">{filteredUnits[activeUnit]?.email}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-blue-500 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                          </svg>
                          <span className="text-gray-700">{filteredUnits[activeUnit]?.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Обязанности подразделения */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">{t('administrativeUnits.responsibilities')}</h3>
                    <ul className="space-y-3">
                      {filteredUnits[activeUnit]?.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-gray-700">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* Дополнительная информация */}
                    <div className="mt-8 bg-blue-50 rounded-xl p-6">
                      <h4 className="font-semibold text-blue-800 mb-2">{t('administrativeUnits.workingHours')}</h4>
                      <p className="text-blue-700">09:00 - 18:00, {t('administrativeUnits.weekdays')}</p>
                      
                      <h4 className="font-semibold text-green-800 mt-4 mb-2">{t('administrativeUnits.receptionHours')}</h4>
                      <p className="text-green-700">10:00 - 16:00, {t('administrativeUnits.weekdays')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdministrativeUnits;