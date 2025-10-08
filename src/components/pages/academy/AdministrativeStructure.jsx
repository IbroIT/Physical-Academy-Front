// AdministrativeStructure.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AdministrativeStructure = () => {
  const { t } = useTranslation();
  const [activeDepartment, setActiveDepartment] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const departments = [
    {
      id: 1,
      name: t('admin.departments.0.name'),
      head: t('admin.departments.0.head'),
      responsibilities: [
        t('admin.departments.0.responsibilities.0'),
        t('admin.departments.0.responsibilities.1'),
        t('admin.departments.0.responsibilities.2'),
        t('admin.departments.0.responsibilities.3')
      ],
      email: 'rectorat@sport-academy.ru',
      phone: '+7 (495) 123-45-67',
      icon: '🏛️'
    },
    {
      id: 2,
      name: t('admin.departments.1.name'),
      head: t('admin.departments.1.head'),
      responsibilities: [
        t('admin.departments.1.responsibilities.0'),
        t('admin.departments.1.responsibilities.1'),
        t('admin.departments.1.responsibilities.2'),
        t('admin.departments.1.responsibilities.3')
      ],
      email: 'academic@sport-academy.ru',
      phone: '+7 (495) 123-45-68',
      icon: '📚'
    },
    {
      id: 3,
      name: t('admin.departments.2.name'),
      head: t('admin.departments.2.head'),
      responsibilities: [
        t('admin.departments.2.responsibilities.0'),
        t('admin.departments.2.responsibilities.1'),
        t('admin.departments.2.responsibilities.2'),
        t('admin.departments.2.responsibilities.3')
      ],
      email: 'science@sport-academy.ru',
      phone: '+7 (495) 123-45-69',
      icon: '🔬'
    },
    {
      id: 4,
      name: t('admin.departments.3.name'),
      head: t('admin.departments.3.head'),
      responsibilities: [
        t('admin.departments.3.responsibilities.0'),
        t('admin.departments.3.responsibilities.1'),
        t('admin.departments.3.responsibilities.2'),
        t('admin.departments.3.responsibilities.3')
      ],
      email: 'sports@sport-academy.ru',
      phone: '+7 (495) 123-45-70',
      icon: '⚽'
    },
    {
      id: 5,
      name: t('admin.departments.4.name'),
      head: t('admin.departments.4.head'),
      responsibilities: [
        t('admin.departments.4.responsibilities.0'),
        t('admin.departments.4.responsibilities.1'),
        t('admin.departments.4.responsibilities.2'),
        t('admin.departments.4.responsibilities.3')
      ],
      email: 'international@sport-academy.ru',
      phone: '+7 (495) 123-45-71',
      icon: '🌍'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleDepartmentClick = (index) => {
    setActiveDepartment(index);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
            {t('admin.title')}
          </h1>
          <div className="w-20 h-1 bg-green-400 mx-auto mb-3 md:mb-4"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4">
            {t('admin.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Навигация по отделам */}
          <div className={`lg:col-span-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20 shadow-2xl">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 text-center">
                {t('admin.departmentsTitle')}
              </h3>
              
              <div className="space-y-3">
                {departments.map((department, index) => (
                  <button
                    key={department.id}
                    onClick={() => handleDepartmentClick(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${
                      index === activeDepartment
                        ? 'bg-gradient-to-r from-blue-500 to-green-500 shadow-lg transform scale-105'
                        : 'bg-white/5 hover:bg-white/10 hover:transform hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3 group-hover:scale-110 transition-transform duration-300">
                        {department.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold truncate ${
                          index === activeDepartment ? 'text-white' : 'text-white group-hover:text-green-300'
                        }`}>
                          {department.name}
                        </h4>
                        <p className={`text-sm truncate ${
                          index === activeDepartment ? 'text-blue-100' : 'text-blue-200'
                        }`}>
                          {department.head}
                        </p>
                      </div>
                      {index === activeDepartment && (
                        <div className="w-2 h-2 bg-green-300 rounded-full animate-ping ml-2"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Детальная информация об отделе */}
          <div className={`lg:col-span-2 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-8 border border-white/20 shadow-2xl h-full">
              <div className="flex items-center mb-6 md:mb-8">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center text-2xl md:text-3xl">
                  {departments[activeDepartment].icon}
                </div>
                <div className="ml-4 md:ml-6 flex-1 min-w-0">
                  <h2 className="text-2xl md:text-3xl font-bold text-white truncate">
                    {departments[activeDepartment].name}
                  </h2>
                  <p className="text-green-300 font-semibold text-lg md:text-xl truncate">
                    {departments[activeDepartment].head}
                  </p>
                </div>
              </div>

              {/* Обязанности */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                  {t('admin.responsibilities')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  {departments[activeDepartment].responsibilities.map((responsibility, index) => (
                    <div
                      key={index}
                      className="bg-white/5 rounded-xl p-3 md:p-4 border border-white/10 hover:border-green-400/30 transition-all duration-300 group"
                    >
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-blue-100 group-hover:text-white transition-colors text-sm md:text-base">
                          {responsibility}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Контактная информация */}
              <div className="bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center">
                  <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
                  {t('admin.contactInfo')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center group hover:transform hover:translate-x-2 transition-transform duration-300">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-500/30 transition-colors">
                      <span className="text-blue-300">📧</span>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm">{t('admin.email')}</p>
                      <p className="text-white font-semibold truncate">{departments[activeDepartment].email}</p>
                    </div>
                  </div>
                  <div className="flex items-center group hover:transform hover:translate-x-2 transition-transform duration-300">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-500/30 transition-colors">
                      <span className="text-green-300">📞</span>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm">{t('admin.phone')}</p>
                      <p className="text-white font-semibold">{departments[activeDepartment].phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className={`mt-12 md:mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/10 text-center group hover:border-green-400/30 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500/30 transition-colors">
                <span className="text-2xl">👥</span>
              </div>
              <h4 className="text-white font-bold text-lg md:text-xl mb-2">{t('admin.stats.employees')}</h4>
              <p className="text-green-300 text-2xl md:text-3xl font-bold">150+</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/10 text-center group hover:border-blue-400/30 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500/30 transition-colors">
                <span className="text-2xl">🏢</span>
              </div>
              <h4 className="text-white font-bold text-lg md:text-xl mb-2">{t('admin.stats.departments')}</h4>
              <p className="text-blue-300 text-2xl md:text-3xl font-bold">12+</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/10 text-center group hover:border-green-400/30 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500/30 transition-colors">
                <span className="text-2xl">📈</span>
              </div>
              <h4 className="text-white font-bold text-lg md:text-xl mb-2">{t('admin.stats.experience')}</h4>
              <p className="text-green-300 text-2xl md:text-3xl font-bold">25 {t('admin.stats.years')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Плавающие элементы для десктопа */}
      {!isMobile && (
        <>
          <div className="absolute bottom-20 left-5 w-6 h-6 bg-green-400/20 rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 left-10 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
        </>
      )}
    </section>
  );
};

export default AdministrativeStructure;