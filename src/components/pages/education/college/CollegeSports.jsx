// CollegeSports.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CollegeSports = () => {
  const { t } = useTranslation();
  const [activeProgram, setActiveProgram] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const programs = [
    {
      id: 1,
      title: t('collegeSports.programs.list.0.title'),
      duration: t('collegeSports.programs.list.0.duration'),
      format: t('collegeSports.programs.list.0.format', { defaultValue: 'Full-time' }),
      description: t('collegeSports.programs.list.0.description'),
      features: t('collegeSports.programs.list.0.subjects', { returnObjects: true }).slice(0, 4),
      careers: t('collegeSports.programs.list.0.careers', { returnObjects: true }).slice(0, 3),
      price: t('collegeSports.programs.list.0.price', { defaultValue: '$15,000/year' }),
      icon: '🎓',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      id: 2,
      title: t('collegeSports.programs.list.1.title'),
      duration: t('collegeSports.programs.list.1.duration'),
      format: t('collegeSports.programs.list.1.format', { defaultValue: 'Full-time' }),
      description: t('collegeSports.programs.list.1.description'),
      features: t('collegeSports.programs.list.1.subjects', { returnObjects: true }).slice(0, 4),
      careers: t('collegeSports.programs.list.1.careers', { returnObjects: true }).slice(0, 3),
      price: t('collegeSports.programs.list.1.price', { defaultValue: '$15,000/year' }),
      icon: '⚽',
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    },
    {
      id: 3,
      title: t('collegeSports.programs.list.2.title'),
      duration: t('collegeSports.programs.list.2.duration'),
      format: t('collegeSports.programs.list.2.format', { defaultValue: 'Full-time' }),
      description: t('collegeSports.programs.list.2.description'),
      features: t('collegeSports.programs.list.2.subjects', { returnObjects: true }).slice(0, 4),
      careers: t('collegeSports.programs.list.2.careers', { returnObjects: true }).slice(0, 3),
      price: t('collegeSports.programs.list.2.price', { defaultValue: '$15,000/year' }),
      icon: '🏀',
      color: 'from-blue-500 to-green-500',
      hoverColor: 'from-blue-600 to-green-600'
    },
    {
      id: 4,
      title: t('collegeSports.programs.list.3.title'),
      duration: t('collegeSports.programs.list.3.duration'),
      format: t('collegeSports.programs.list.3.format', { defaultValue: 'Full-time' }),
      description: t('collegeSports.programs.list.3.description'),
      features: t('collegeSports.programs.list.3.subjects', { returnObjects: true }).slice(0, 4),
      careers: t('collegeSports.programs.list.3.careers', { returnObjects: true }).slice(0, 3),
      price: t('collegeSports.programs.list.3.price', { defaultValue: '$15,000/year' }),
      icon: '🏃‍♂️',
      color: 'from-green-500 to-blue-500',
      hoverColor: 'from-green-600 to-blue-600'
    }
  ];

  const stats = [
    { 
      number: '500+', 
      label: t('collegeSports.stats.students'), 
      icon: '👨‍🎓'
    },
    { 
      number: '15+', 
      label: t('collegeSports.stats.programs'), 
      icon: '📚'
    },
    { 
      number: '95%', 
      label: t('collegeSports.stats.employment'), 
      icon: '💼'
    },
    { 
      number: '10', 
      label: t('collegeSports.stats.sports'), 
      icon: '🏆'
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

  const handleProgramClick = (index) => {
    setActiveProgram(index);
  };

  const handleLearnMore = (program) => {
    setSelectedProgram(program);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProgram(null);
  };

  return (
    <>
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-12 md:py-20 overflow-hidden">
        {/* Анимированный фон */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          
          {/* Спортивные символы */}
          <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">⚽</div>
          <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🏃‍♂️</div>
          <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🎯</div>
          <div className="absolute top-2/3 right-1/3 text-5xl opacity-5">🏆</div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Заголовок */}
          <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl">
              🏫
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
              {t('collegeSports.title')}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-3 md:mb-4"></div>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4">
              {t('collegeSports.subtitle')}
            </p>
          </div>

          {/* Статистика */}
          <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 md:mb-16 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
              >
                <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Основные программы */}
          <div className={`mb-12 md:mb-16 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {programs.map((program, index) => (
                <div
                  key={program.id}
                  className={`relative bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 border border-white/20 shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                    activeProgram === index ? 'ring-2 ring-emerald-400 ring-opacity-50' : ''
                  }`}
                  onClick={() => handleProgramClick(index)}
                >
                  {/* Иконка программы */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${program.color} flex items-center justify-center text-2xl mb-4 mx-auto`}>
                    {program.icon}
                  </div>

                  {/* Заголовок */}
                  <h3 className="text-xl font-bold text-white text-center mb-3 line-clamp-2">
                    {program.title}
                  </h3>

                  {/* Длительность и формат */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-emerald-300 text-sm font-semibold bg-emerald-500/20 px-2 py-1 rounded-lg">
                      {program.duration}
                    </span>
                    <span className="text-blue-300 text-sm bg-blue-500/20 px-2 py-1 rounded-lg">
                      {program.format}
                    </span>
                  </div>

                  {/* Описание */}
                  <p className="text-blue-100 text-sm mb-4 line-clamp-3">
                    {program.description}
                  </p>

                  {/* Цена */}
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold text-white">{program.price}</span>
                  </div>

                  {/* Кнопка */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLearnMore(program);
                    }}
                    className={`w-full bg-gradient-to-r ${program.color} hover:${program.hoverColor} text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
                  >
                    {t('collegeSports.programs.learnMore')}
                  </button>

                  {/* Индикатор активной программы */}
                  {activeProgram === index && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Детали активной программы */}
          <div className={`transition-all duration-1000 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                {/* Основная информация */}
                <div className="lg:w-2/3">
                  <div className="flex items-start mb-6">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${programs[activeProgram].color} flex items-center justify-center text-3xl mr-4 md:mr-6`}>
                      {programs[activeProgram].icon}
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {programs[activeProgram].title}
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-emerald-300 font-semibold bg-emerald-500/20 px-3 py-1 rounded-lg">
                          {programs[activeProgram].duration}
                        </span>
                        <span className="text-blue-300 bg-blue-500/20 px-3 py-1 rounded-lg">
                          {programs[activeProgram].format}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-blue-100 text-lg mb-6">
                    {programs[activeProgram].description}
                  </p>

                  {/* Особенности программы */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {t('collegeSports.programs.keySubjects')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {programs[activeProgram].features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-white/5 rounded-xl p-4 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                        >
                          <div className="w-8 h-8 bg-emerald-400/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-emerald-400/30 transition-colors">
                            <span className="text-emerald-300">✓</span>
                          </div>
                          <span className="text-white group-hover:text-emerald-300 transition-colors">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Карьерные возможности */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {t('collegeSports.programs.careerPaths')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {programs[activeProgram].careers.map((career, index) => (
                        <span
                          key={index}
                          className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded-xl text-sm font-medium border border-blue-400/30 hover:bg-blue-500/30 transition-all duration-300"
                        >
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Боковая панель с действиями */}
                <div className="lg:w-1/3">
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/10 sticky top-6">
                    <div className="text-center mb-6">
                      <div className="text-3xl font-bold text-white mb-2">
                        {programs[activeProgram].price}
                      </div>
                      <div className="text-blue-200">{t('collegeSports.perYear')}</div>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => handleLearnMore(programs[activeProgram])}
                        className={`w-full bg-gradient-to-r ${programs[activeProgram].color} hover:${programs[activeProgram].hoverColor} text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
                      >
                        {t('collegeSports.applyNow')}
                      </button>
                      <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all duration-300 border border-white/20">
                        {t('collegeSports.downloadBrochure')}
                      </button>
                      <button className="w-full bg-transparent hover:bg-white/5 text-white font-bold py-4 rounded-xl transition-all duration-300 border border-white/20">
                        {t('collegeSports.scheduleConsultation')}
                      </button>
                    </div>

                    {/* Дополнительная информация */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-200">{t('collegeSports.startDate')}</span>
                        <span className="text-white font-semibold">{t('collegeSports.september')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-200">{t('collegeSports.places')}</span>
                        <span className="text-emerald-300 font-semibold">25</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Преимущества обучения */}
          <div className={`mt-12 md:mt-16 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12">
              {t('collegeSports.advantagesTitle')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center group hover:border-emerald-400/30 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">
                      {item === 1 && '🏆'}
                      {item === 2 && '👨‍🏫'}
                      {item === 3 && '💼'}
                      {item === 4 && '🌍'}
                    </span>
                  </div>
                  <h4 className="text-white font-bold text-lg md:text-xl mb-2">
                    {t(`collegeSports.advantages.${item-1}.title`)}
                  </h4>
                  <p className="text-blue-100 text-sm md:text-base">
                    {t(`collegeSports.advantages.${item-1}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Плавающие элементы для десктопа */}
        {!isMobile && (
          <>
            <div className="absolute bottom-20 left-5 w-6 h-6 bg-emerald-400/20 rounded-full animate-bounce"></div>
            <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping"></div>
          </>
        )}
      </section>

      {/* Модальное окно */}
      {showModal && selectedProgram && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-900 to-emerald-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl animate-scaleIn">
            <div className="p-6 md:p-8">
              {/* Заголовок */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${selectedProgram.color} flex items-center justify-center text-2xl mr-4`}>
                    {selectedProgram.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {selectedProgram.title}
                    </h2>
                    <p className="text-emerald-300">{selectedProgram.duration}</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Контент */}
              <div className="space-y-6">
                <p className="text-blue-100 text-lg">
                  {selectedProgram.description}
                </p>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {t('collegeSports.programs.keySubjects')}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedProgram.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-6 h-6 bg-emerald-400/20 rounded-full flex items-center justify-center mr-3">
                          <span className="text-emerald-300 text-sm">✓</span>
                        </div>
                        <span className="text-white">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {t('collegeSports.programs.careerPaths')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProgram.careers.map((career, index) => (
                      <span
                        key={index}
                        className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded-xl text-sm font-medium border border-blue-400/30"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-center pt-6 border-t border-white/10">
                  <button
                    onClick={closeModal}
                    className={`bg-gradient-to-r ${selectedProgram.color} hover:${selectedProgram.hoverColor} text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
                  >
                    {t('collegeSports.applyNow')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CollegeSports;