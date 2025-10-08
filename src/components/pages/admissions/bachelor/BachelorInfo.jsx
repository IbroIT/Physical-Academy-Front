// components/BachelorInfo.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorInfo = () => {
  const { t } = useTranslation();
  const [selectedProgram, setSelectedProgram] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  // Перемещаем объявление programs ВЫШЕ всех хуков, которые его используют
  const programs = [
    {
      id: 'cs',
      title: t('bachelor.info.programs.cs.title'),
      description: t('bachelor.info.programs.cs.description'),
      duration: t('bachelor.info.duration'),
      subjects: [
        t('bachelor.info.programs.cs.subjects.0'),
        t('bachelor.info.programs.cs.subjects.1'),
        t('bachelor.info.programs.cs.subjects.2'),
        t('bachelor.info.programs.cs.subjects.3')
      ],
      careers: [
        t('bachelor.info.programs.cs.careers.0'),
        t('bachelor.info.programs.cs.careers.1'),
        t('bachelor.info.programs.cs.careers.2')
      ],
      icon: '💻',
      color: 'from-blue-500 to-blue-600',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      id: 'se',
      title: t('bachelor.info.programs.se.title'),
      description: t('bachelor.info.programs.se.description'),
      duration: t('bachelor.info.duration'),
      subjects: [
        t('bachelor.info.programs.se.subjects.0'),
        t('bachelor.info.programs.se.subjects.1'),
        t('bachelor.info.programs.se.subjects.2'),
        t('bachelor.info.programs.se.subjects.3')
      ],
      careers: [
        t('bachelor.info.programs.se.careers.0'),
        t('bachelor.info.programs.se.careers.1'),
        t('bachelor.info.programs.se.careers.2')
      ],
      icon: '🛠️',
      color: 'from-green-500 to-green-600',
      gradient: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      id: 'cyber',
      title: t('bachelor.info.programs.cyber.title'),
      description: t('bachelor.info.programs.cyber.description'),
      duration: t('bachelor.info.duration'),
      subjects: [
        t('bachelor.info.programs.cyber.subjects.0'),
        t('bachelor.info.programs.cyber.subjects.1'),
        t('bachelor.info.programs.cyber.subjects.2'),
        t('bachelor.info.programs.cyber.subjects.3')
      ],
      careers: [
        t('bachelor.info.programs.cyber.careers.0'),
        t('bachelor.info.programs.cyber.careers.1'),
        t('bachelor.info.programs.cyber.careers.2')
      ],
      icon: '🛡️',
      color: 'from-blue-500 to-green-500',
      gradient: 'bg-gradient-to-r from-blue-500 to-green-500'
    }
  ];

  // Теперь useEffect может безопасно использовать programs
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setSelectedProgram(prev => (prev + 1) % programs.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, programs.length]);

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

  const startCounters = () => {
    const targetValues = [98, 50, 5, 1000];
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

  const stats = [
    { 
      number: counterValues[0], 
      label: t('bachelor.info.stats.employment'),
      icon: '💼',
      color: 'from-blue-500 to-blue-600',
      suffix: '%'
    },
    { 
      number: counterValues[1], 
      label: t('bachelor.info.stats.partners'),
      icon: '🤝',
      color: 'from-green-500 to-green-600',
      suffix: '+'
    },
    { 
      number: counterValues[2], 
      label: t('bachelor.info.stats.years'),
      icon: '🎓',
      color: 'from-blue-500 to-green-500',
      suffix: ''
    },
    { 
      number: counterValues[3], 
      label: t('bachelor.info.stats.graduates'),
      icon: '👨‍🎓',
      color: 'from-green-500 to-blue-500',
      suffix: '+'
    }
  ];

  const features = [
    { 
      icon: '🏆', 
      title: t('bachelor.info.features.quality.title'), 
      desc: t('bachelor.info.features.quality.desc'),
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: '🤝', 
      title: t('bachelor.info.features.industry.title'), 
      desc: t('bachelor.info.features.industry.desc'),
      color: 'from-green-500 to-green-600'
    },
    { 
      icon: '🌐', 
      title: t('bachelor.info.features.international.title'), 
      desc: t('bachelor.info.features.international.desc'),
      color: 'from-blue-500 to-green-500'
    }
  ];

  const nextProgram = () => {
    setSelectedProgram((prev) => (prev + 1) % programs.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevProgram = () => {
    setSelectedProgram((prev) => (prev - 1 + programs.length) % programs.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleProgramSelect = (index) => {
    setSelectedProgram(index);
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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
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
              {t('bachelor.info.badge')}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('bachelor.info.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4 leading-relaxed">
            {t('bachelor.info.subtitle')}
          </p>
        </div>

        {/* Stats Section */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group relative bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 border border-white/20 shadow-2xl transition-all duration-500 hover:scale-105 hover:border-green-400/30 text-center"
            >
              {/* Иконка */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>

              {/* Число с анимацией */}
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono">
                {stat.number}
                <span className="text-green-300">{stat.suffix}</span>
              </div>

              {/* Описание */}
              <div className="text-blue-100 font-medium text-sm md:text-base">{stat.label}</div>

              {/* Декоративные элементы */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
            </div>
          ))}
        </div>

        {/* Programs Section */}
        <div className={`mb-16 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
            {t('bachelor.info.programsTitle')}
          </h2>
          
          {/* Program Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {programs.map((program, index) => (
              <button
                key={program.id}
                onClick={() => handleProgramSelect(index)}
                className={`group flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-500 transform ${
                  selectedProgram === index
                    ? `bg-gradient-to-r ${program.color} text-white shadow-2xl scale-105`
                    : 'bg-white/10 text-blue-100 border border-white/20 hover:bg-white/20 hover:text-white hover:border-green-400/30 hover:scale-105'
                }`}
              >
                <span className={`text-2xl transition-transform duration-300 ${
                  selectedProgram === index ? 'scale-110' : 'group-hover:scale-110'
                }`}>
                  {program.icon}
                </span>
                <span className="text-lg">{program.title}</span>
                {selectedProgram === index && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping ml-2"></div>
                )}
              </button>
            ))}
          </div>

          {/* Program Details */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl relative overflow-hidden group hover:border-green-400/30 transition-all duration-500">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-32 translate-x-32 group-hover:scale-150 transition-transform duration-1000"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-8 gap-6">
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${programs[selectedProgram].color} flex items-center justify-center text-white text-3xl shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                    {programs[selectedProgram].icon}
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {programs[selectedProgram].title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-lg text-blue-100">
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                        <span>⏱️ {programs[selectedProgram].duration}</span>
                      </span>
                      <span className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span>🎓 {t('bachelor.info.fullTime')}</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Navigation Controls */}
                <div className="flex space-x-3 self-center">
                  <button
                    onClick={prevProgram}
                    className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:text-green-300 transition-all duration-300 border border-white/20 hover:border-green-400/30"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextProgram}
                    className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:text-green-300 transition-all duration-300 border border-white/20 hover:border-green-400/30"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                <div className="space-y-6">
                  <p className="text-blue-100 text-lg md:text-xl leading-relaxed border-l-4 border-blue-400 pl-6 py-2 bg-blue-500/10 rounded-r-2xl group-hover:border-green-400 transition-colors duration-300">
                    {programs[selectedProgram].description}
                  </p>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h4 className="font-bold text-white text-xl mb-4 flex items-center">
                      <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">📚</span>
                      {t('bachelor.info.keySubjects')}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {programs[selectedProgram].subjects.map((subject, idx) => (
                        <span 
                          key={idx}
                          className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-2xl text-base font-medium hover:bg-blue-500/30 hover:scale-105 hover:text-white transition-all duration-300 cursor-default border border-blue-400/30"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white text-xl mb-4 flex items-center">
                      <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">💼</span>
                      {t('bachelor.info.careerPaths')}
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {programs[selectedProgram].careers.map((career, idx) => (
                        <span 
                          key={idx}
                          className="bg-green-500/20 text-green-300 px-4 py-2 rounded-2xl text-base font-medium hover:bg-green-500/30 hover:scale-105 hover:text-white transition-all duration-300 cursor-default border border-green-400/30"
                        >
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-white/10">
                <button className={`flex-1 bg-gradient-to-r ${programs[selectedProgram].color} text-white font-bold py-4 px-6 rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105`}>
                  {t('bachelor.info.applyNow')}
                </button>
                <button className="flex-1 bg-white/10 text-white font-bold py-4 px-6 rounded-xl border border-white/20 hover:bg-white/20 hover:border-green-400/30 transition-all duration-300">
                  {t('bachelor.info.learnMore')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {features.map((feature, index) => (
            <div 
              key={index}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="group bg-white/10 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-white/20 hover:border-green-400/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl relative overflow-hidden"
            >
              {/* Animated background */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r ${feature.color}`}></div>
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-3xl transition-all duration-500 group-hover:scale-110 bg-gradient-to-r ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 transition-colors duration-300 group-hover:text-green-300">
                  {feature.title}
                </h3>
                <p className="text-blue-100 leading-relaxed text-lg group-hover:text-white transition-colors">
                  {feature.desc}
                </p>
              </div>

              {/* Hover indicator */}
              {hoveredFeature === index && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Плавающие элементы для десктопа */}
      <div className="absolute bottom-20 left-5 w-6 h-6 bg-green-400/20 rounded-full animate-bounce hidden md:block"></div>
      <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping hidden md:block"></div>
    </section>
  );
};

export default BachelorInfo;