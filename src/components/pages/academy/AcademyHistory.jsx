// components/AcademyHistory.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const AcademyHistory = () => {
  const { t } = useTranslation();
  const [activeEra, setActiveEra] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startProgressAnimation();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const timeline = [
    {
      year: '2005',
      title: t('academy.history.era.foundation.title'),
      description: t('academy.history.era.foundation.description'),
      achievements: [
        t('academy.history.era.foundation.achievements.0'),
        t('academy.history.era.foundation.achievements.1'),
        t('academy.history.era.foundation.achievements.2')
      ],
      icon: '🏛️',
      color: 'from-blue-500 to-blue-600'
    },
    {
      year: '2010',
      title: t('academy.history.era.growth.title'),
      description: t('academy.history.era.growth.description'),
      achievements: [
        t('academy.history.era.growth.achievements.0'),
        t('academy.history.era.growth.achievements.1'),
        t('academy.history.era.growth.achievements.2')
      ],
      icon: '📈',
      color: 'from-green-500 to-green-600'
    },
    {
      year: '2015',
      title: t('academy.history.era.innovation.title'),
      description: t('academy.history.era.innovation.description'),
      achievements: [
        t('academy.history.era.innovation.achievements.0'),
        t('academy.history.era.innovation.achievements.1'),
        t('academy.history.era.innovation.achievements.2')
      ],
      icon: '💡',
      color: 'from-blue-500 to-green-500'
    },
    {
      year: '2020',
      title: t('academy.history.era.modern.title'),
      description: t('academy.history.era.modern.description'),
      achievements: [
        t('academy.history.era.modern.achievements.0'),
        t('academy.history.era.modern.achievements.1'),
        t('academy.history.era.modern.achievements.2')
      ],
      icon: '🚀',
      color: 'from-green-600 to-blue-600'
    }
  ];

  const milestones = [
    { 
      number: '1,000', 
      label: t('academy.history.milestones.firstGraduates'), 
      year: '2008',
      icon: '🎓'
    },
    { 
      number: '10+', 
      label: t('academy.history.milestones.internationalPrograms'), 
      year: '2012',
      icon: '🌍'
    },
    { 
      number: '5,000', 
      label: t('academy.history.milestones.totalGraduates'), 
      year: '2018',
      icon: '👨‍🎓'
    },
    { 
      number: '50+', 
      label: t('academy.history.milestones.partnerCompanies'), 
      year: '2023',
      icon: '🤝'
    }
  ];

  const nextEra = () => {
    setActiveEra((prev) => (prev + 1) % timeline.length);
  };

  const prevEra = () => {
    setActiveEra((prev) => (prev - 1 + timeline.length) % timeline.length);
  };

  return (
    <div ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      {/* Header */}
      <div className={`text-center mb-16 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-blue-600 font-medium text-sm">
            {t('academy.history.badge')}
          </span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          {t('academy.history.title')}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-8"></div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t('academy.history.subtitle')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Timeline Navigation */}
        <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {timeline.map((era, index) => (
            <button
              key={index}
              onClick={() => setActiveEra(index)}
              className={`group flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-500 transform hover:scale-105 ${
                activeEra === index
                  ? `bg-gradient-to-r ${era.color} text-white shadow-xl scale-105`
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }`}
            >
              <div className={`text-2xl transition-transform duration-300 ${
                activeEra === index ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {era.icon}
              </div>
              <div className="text-left">
                <div className="font-bold text-lg">{era.year}</div>
                <div className="text-sm opacity-90">{era.title}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Timeline Content */}
          <div className="lg:col-span-2">
            <div className={`bg-white rounded-2xl p-8 border border-gray-200 shadow-sm transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center space-x-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${timeline[activeEra].color} flex items-center justify-center text-white text-2xl shadow-lg`}>
                    {timeline[activeEra].icon}
                  </div>
                  <div>
                    <h3 className="text-4xl font-bold text-gray-900">{timeline[activeEra].year}</h3>
                    <h4 className="text-2xl font-semibold text-blue-600 mt-1">{timeline[activeEra].title}</h4>
                  </div>
                </div>
                
                {/* Navigation Controls */}
                <div className="flex space-x-2">
                  <button
                    onClick={prevEra}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextEra}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-8 border-l-4 border-blue-500 pl-6 py-2 bg-blue-50 rounded-r-2xl">
                {timeline[activeEra].description}
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100">
                <h5 className="font-bold text-gray-900 text-xl mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3">🏆</span>
                  {t('academy.history.achievements')}
                </h5>
                <ul className="space-y-4">
                  {timeline[activeEra].achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start group">
                      <span className={`w-3 h-3 bg-gradient-to-r ${timeline[activeEra].color} rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-125 transition-transform duration-300`}></span>
                      <span className="text-gray-700 text-lg group-hover:text-gray-900 transition-colors duration-300">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className={`space-y-6 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-2 h-8 bg-green-500 rounded mr-3"></span>
              {t('academy.history.keyMilestones')}
            </h3>
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-500 group hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl font-bold text-gray-900">
                    {milestone.number}
                  </div>
                  <div className="text-2xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                    {milestone.icon}
                  </div>
                </div>
                <div className="text-gray-800 font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors duration-300">
                  {milestone.label}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {milestone.year}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Timeline */}
        <div className={`mt-16 relative transition-all duration-1000 delay-900 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Progress Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="w-full bg-gradient-to-b from-blue-500 to-green-500 transition-all duration-2000 ease-out"
              style={{ height: `${progress}%` }}
            ></div>
          </div>
          
          {/* Timeline Items */}
          <div className="space-y-12">
            {timeline.map((era, index) => (
              <div
                key={index}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                  <div className={`bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-500 group ${
                    activeEra === index ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'
                  }`}>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${era.color} flex items-center justify-center text-white text-lg`}>
                        {era.icon}
                      </div>
                      <div>
                        <div className="text-sm text-blue-600 font-semibold">{era.year}</div>
                        <h4 className="font-bold text-gray-900 text-lg">{era.title}</h4>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{era.description}</p>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <div className={`w-6 h-6 rounded-full border-4 border-white shadow-lg transition-all duration-500 ${
                    activeEra === index 
                      ? `bg-gradient-to-r ${era.color} scale-125` 
                      : 'bg-gray-300 hover:bg-blue-400 hover:scale-110'
                  }`}></div>
                </div>

                {/* Year Marker */}
                <div className={`w-1/2 ${index % 2 === 0 ? 'pl-12' : 'pr-12'}`}>
                  <div className={`text-6xl font-bold text-gray-200 text-center transition-all duration-500 ${
                    activeEra === index ? 'text-gray-300 scale-110' : 'hover:text-gray-300'
                  }`}>
                    {era.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-12 flex items-center justify-center space-x-4">
          <span className="text-sm text-gray-500">{t('academy.history.progress')}</span>
          <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-2000 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default AcademyHistory;