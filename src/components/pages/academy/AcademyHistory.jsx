// components/AcademyHistory.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const AcademyHistory = () => {
  const { t } = useTranslation();
  const [activeEra, setActiveEra] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  // Выносим timeline и milestones выше, чтобы они были доступны в useEffect
  const timeline = [
    {
      year: '2005',
      title: t('academyHistory.era.foundation.title'),
      description: t('academyHistory.era.foundation.description'),
      achievements: [
        t('academyHistory.era.foundation.achievements.0'),
        t('academyHistory.era.foundation.achievements.1'),
        t('academyHistory.era.foundation.achievements.2')
      ],
      icon: '🏛️',
      color: 'blue',
      colorClass: 'from-blue-500 to-blue-600',
      stats: [
        { value: '1', label: t('academyHistory.stats.buildings') },
        { value: '50', label: t('academyHistory.stats.students') },
        { value: '5', label: t('academyHistory.stats.programs') }
      ]
    },
    {
      year: '2010',
      title: t('academyHistory.era.growth.title'),
      description: t('academyHistory.era.growth.description'),
      achievements: [
        t('academyHistory.era.growth.achievements.0'),
        t('academyHistory.era.growth.achievements.1'),
        t('academyHistory.era.growth.achievements.2')
      ],
      icon: '📈',
      color: 'green',
      colorClass: 'from-green-500 to-green-600',
      stats: [
        { value: '3', label: t('academyHistory.stats.buildings') },
        { value: '500', label: t('academyHistory.stats.students') },
        { value: '12', label: t('academyHistory.stats.programs') }
      ]
    },
    {
      year: '2015',
      title: t('academyHistory.era.innovation.title'),
      description: t('academyHistory.era.innovation.description'),
      achievements: [
        t('academyHistory.era.innovation.achievements.0'),
        t('academyHistory.era.innovation.achievements.1'),
        t('academyHistory.era.innovation.achievements.2')
      ],
      icon: '💡',
      color: 'blue',
      colorClass: 'from-blue-500 to-blue-600',
      stats: [
        { value: '5', label: t('academyHistory.stats.buildings') },
        { value: '1,200', label: t('academyHistory.stats.students') },
        { value: '25', label: t('academyHistory.stats.programs') }
      ]
    },
    {
      year: '2020',
      title: t('academyHistory.era.modern.title'),
      description: t('academyHistory.era.modern.description'),
      achievements: [
        t('academyHistory.era.modern.achievements.0'),
        t('academyHistory.era.modern.achievements.1'),
        t('academyHistory.era.modern.achievements.2')
      ],
      icon: '🚀',
      color: 'green',
      colorClass: 'from-green-500 to-green-600',
      stats: [
        { value: '8', label: t('academyHistory.stats.buildings') },
        { value: '2,500', label: t('academyHistory.stats.students') },
        { value: '40+', label: t('academyHistory.stats.programs') }
      ]
    },
    {
      year: '2024',
      title: t('academyHistory.era.future.title'),
      description: t('academyHistory.era.future.description'),
      achievements: [
        t('academyHistory.era.future.achievements.0'),
        t('academyHistory.era.future.achievements.1'),
        t('academyHistory.era.future.achievements.2')
      ],
      icon: '🌟',
      color: 'blue',
      colorClass: 'from-blue-500 to-blue-600',
      stats: [
        { value: '12', label: t('academyHistory.stats.buildings') },
        { value: '5,000+', label: t('academyHistory.stats.students') },
        { value: '60+', label: t('academyHistory.stats.programs') }
      ]
    }
  ];

  const milestones = [
    { 
      number: '1,000', 
      label: t('academyHistory.milestones.firstGraduates'), 
      year: '2008',
      icon: '🎓',
      color: 'blue'
    },
    { 
      number: '10+', 
      label: t('academyHistory.milestones.internationalPrograms'), 
      year: '2012',
      icon: '🌍',
      color: 'green'
    },
    { 
      number: '5,000', 
      label: t('academyHistory.milestones.totalGraduates'), 
      year: '2018',
      icon: '👨‍🎓',
      color: 'blue'
    },
    { 
      number: '50+', 
      label: t('academyHistory.milestones.partnerCompanies'), 
      year: '2023',
      icon: '🤝',
      color: 'green'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
          startProgressAnimation();
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

  // Автопереключение эпох
  useEffect(() => {
    if (!autoPlay) return;
    
    const interval = setInterval(() => {
      setActiveEra(prev => (prev + 1) % timeline.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [autoPlay, timeline.length]);

  const startProgressAnimation = () => {
    const duration = 2000;
    const steps = 100;
    const interval = duration / steps;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(progressInterval);
      }
    }, interval);
  };

  const nextEra = () => {
    setActiveEra((prev) => (prev + 1) % timeline.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const prevEra = () => {
    setActiveEra((prev) => (prev - 1 + timeline.length) % timeline.length);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  const handleEraClick = (index) => {
    setActiveEra(index);
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 10000);
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
        {/* Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 mb-6 group hover:bg-white/20 transition-all duration-300">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-green-300 font-medium text-sm md:text-base">
              {t('academyHistory.badge')}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('academyHistory.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4 leading-relaxed">
            {t('academyHistory.subtitle')}
          </p>
        </div>

        {/* Timeline Navigation */}
        <div className={`flex overflow-x-auto pb-4 mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="flex space-x-4 mx-auto px-4">
            {timeline.map((era, index) => (
              <button
                key={index}
                onClick={() => handleEraClick(index)}
                className={`group flex flex-col items-center space-y-3 px-8 py-6 rounded-2xl transition-all duration-500 transform hover:scale-105 min-w-[140px] ${
                  activeEra === index
                    ? `bg-gradient-to-br ${era.colorClass} text-white shadow-2xl scale-105 border-2 border-white/30`
                    : 'bg-white/10 backdrop-blur-lg text-blue-100 border-2 border-white/20 hover:border-green-400/50 hover:shadow-xl'
                }`}
              >
                <div className={`text-3xl transition-transform duration-300 ${
                  activeEra === index ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {era.icon}
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">{era.year}</div>
                  <div className="text-sm opacity-90 font-medium mt-1">{era.title}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Timeline Content */}
          <div className="lg:col-span-2">
            <div className={`bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-8 gap-6">
                <div className="flex items-center space-x-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${timeline[activeEra].colorClass} flex items-center justify-center text-white text-3xl shadow-lg`}>
                    {timeline[activeEra].icon}
                  </div>
                  <div>
                    <h3 className="text-5xl font-bold text-white">{timeline[activeEra].year}</h3>
                    <h4 className="text-3xl font-semibold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mt-2">
                      {timeline[activeEra].title}
                    </h4>
                  </div>
                </div>
                
                {/* Navigation Controls */}
                <div className="flex space-x-3">
                  <button
                    onClick={prevEra}
                    className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center text-blue-100 border border-white/20 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextEra}
                    className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center text-blue-100 border border-white/20 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-2xl p-6 border-l-4 border-blue-400 mb-8 shadow-inner">
                <p className="text-blue-100 text-xl leading-relaxed font-medium">
                  {timeline[activeEra].description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {timeline[activeEra].stats.map((stat, index) => (
                  <div key={index} className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 shadow-lg group hover:border-green-400/30 transition-all duration-300">
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-blue-100 font-medium mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Achievements */}
              <div className="bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h5 className="font-bold text-white text-2xl mb-6 flex items-center">
                  <span className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white mr-4">🏆</span>
                  {t('academyHistory.achievements')}
                </h5>
                <ul className="space-y-4">
                  {timeline[activeEra].achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start group">
                      <span className="w-6 h-6 bg-white/20 rounded-full mt-1 mr-4 flex-shrink-0 group-hover:scale-125 transition-transform duration-300 flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </span>
                      <span className="text-blue-100 text-lg font-medium group-hover:text-white transition-colors duration-300 leading-relaxed">
                        {achievement}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className={`space-y-6 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
          }`}>
            <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
              <span className="w-3 h-10 bg-gradient-to-b from-blue-400 to-green-400 rounded mr-4"></span>
              {t('academyHistory.keyMilestones')}
            </h3>
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 hover:border-green-400/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                    {milestone.number}
                  </div>
                  <div className={`text-3xl opacity-80 group-hover:scale-110 transition-transform duration-300 ${
                    milestone.color === 'blue' ? 'text-blue-400' : 'text-green-400'
                  }`}>
                    {milestone.icon}
                  </div>
                </div>
                <div className="text-white font-semibold text-xl mb-3 group-hover:text-green-300 transition-colors duration-300">
                  {milestone.label}
                </div>
                <div className="flex items-center text-blue-100 text-sm font-medium">
                  <span className={`w-3 h-3 rounded-full mr-3 animate-pulse ${
                    milestone.color === 'blue' ? 'bg-blue-400' : 'bg-green-400'
                  }`}></span>
                  {milestone.year}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Timeline */}
        <div className={`mt-20 relative transition-all duration-1000 delay-900 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Progress Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full bg-gradient-to-b from-blue-400/30 to-green-400/30 rounded-full overflow-hidden shadow-inner">
            <div 
              className="w-full bg-gradient-to-b from-blue-400 to-green-400 transition-all duration-2000 ease-out shadow-lg"
              style={{ height: `${progress}%` }}
            ></div>
          </div>
          
          {/* Timeline Items */}
          <div className="space-y-20">
            {timeline.map((era, index) => (
              <div
                key={index}
                className={`relative flex flex-col lg:flex-row items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-8`}
              >
                {/* Content */}
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                  <div className={`bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-500 group ${
                    activeEra === index ? 'ring-4 ring-blue-400 scale-105 shadow-2xl' : 'hover:scale-105 hover:shadow-xl'
                  }`}>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${era.colorClass} flex items-center justify-center text-white text-xl shadow-lg`}>
                        {era.icon}
                      </div>
                      <div>
                        <div className="text-lg font-bold text-blue-300">{era.year}</div>
                        <h4 className="font-bold text-white text-xl">{era.title}</h4>
                      </div>
                    </div>
                    <p className="text-blue-100 leading-relaxed text-lg">{era.description}</p>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`w-8 h-8 rounded-full border-4 border-blue-900 shadow-2xl transition-all duration-500 ${
                    activeEra === index 
                      ? `bg-gradient-to-br ${era.colorClass} scale-125 ring-4 ${
                          era.color === 'blue' ? 'ring-blue-400/50' : 'ring-green-400/50'
                        }` 
                      : 'bg-white/30 hover:bg-blue-400 hover:scale-110'
                  }`}></div>
                </div>

                {/* Year Marker */}
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12'}`}>
                  <div className={`text-8xl font-bold text-center transition-all duration-500 ${
                    activeEra === index 
                      ? 'bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent scale-110' 
                      : 'text-white/10 hover:text-white/20'
                  }`}>
                    {era.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-lg">
          <span className="text-lg text-blue-100 font-medium">{t('academyHistory.progress')}</span>
          <div className="w-64 h-3 bg-white/20 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-2000 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            {Math.round(progress)}%
          </span>
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

export default AcademyHistory;