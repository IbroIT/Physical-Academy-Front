// AdministrativeUnits.jsx - Integrated with API
import { div } from 'framer-motion/client';
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const AdministrativeUnits = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef(null);
  const [activeDepartment, setActiveDepartment] = useState(null);

  const departments = [
    {
      id: 1,
      title: 'Название отдела 1',
      description: 'описание отдела 1',  
    },
    {
      id: 2,
      title: 'Название отдела 2',
      description: 'описание отдела 2',  
    },
    {
      id: 3,
      title: 'Название отдела 3',
      description: 'описание отдела 3',  
    },
  ];

  const toggleDepartment = (id) => {
    setActiveDepartment(prev => (prev === id ? null : id));
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000'
          `}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('administrativeUnits.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 md:mb-8 "></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto px-4 leading-relaxed">
            {t('administrativeUnits.subtitle')}
          </p>
          <div className="max-w-4xl mt-8 mx-auto space-y-6">
          {departments.map(dep => (
            <div
              key={dep.id}
              className="border-l-4 border-green-400 bg-white/5 rounded-lg backdrop-blur-md"
            >
              <button
                onClick={() => toggleDepartment(dep.id)}
                className="w-full text-left px-6 py-4 flex justify-between items-center"
              >
                <h3 className="text-xl font-semibold text-amber-50">
                  {dep.title}
                </h3>
                <span
                  className={`text-green-300 text-2xl transition-transform duration-300 ${
                    activeDepartment === dep.id ? 'rotate-180' : ''
                  }`}
                >
                  ⌄
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  activeDepartment === dep.id
                    ? 'max-h-40 opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-6 pb-4 text-blue-100">
                  {dep.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default AdministrativeUnits;