// components/BachelorInfo.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorInfo = () => {
  const { t } = useTranslation();
  const [selectedProgram, setSelectedProgram] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startCounters();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const startCounters = () => {
    const targetValues = [98, 50, 5, 1000];
    const duration = 2000;
    const steps = 60;
    const stepValues = targetValues.map(target => target / steps);

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      setCounterValues(prev => 
        prev.map((value, index) => {
          if (currentStep <= steps) {
            return Math.min(value + stepValues[index], targetValues[index]);
          }
          return value;
        })
      );

      if (currentStep >= steps) {
        clearInterval(counterInterval);
      }
    }, duration / steps);
  };

  const programs = [
    {
      id: 'cs',
      title: t('bachelor.info.programs.cs.title'),
      description: t('bachelor.info.programs.cs.description'),
      duration: '4 года',
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
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'se',
      title: t('bachelor.info.programs.se.title'),
      description: t('bachelor.info.programs.se.description'),
      duration: '4 года',
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
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'cyber',
      title: t('bachelor.info.programs.cyber.title'),
      description: t('bachelor.info.programs.cyber.description'),
      duration: '4 года',
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
      color: 'from-blue-500 to-green-500'
    }
  ];

  const stats = [
    { 
      number: `${Math.round(counterValues[0])}%`, 
      label: t('bachelor.info.stats.employment'),
      icon: '💼',
      delay: 0
    },
    { 
      number: `${Math.round(counterValues[1])}+`, 
      label: t('bachelor.info.stats.partners'),
      icon: '🤝',
      delay: 200
    },
    { 
      number: `${Math.round(counterValues[2])}`, 
      label: t('bachelor.info.stats.years'),
      icon: '🎓',
      delay: 400
    },
    { 
      number: `${Math.round(counterValues[3]).toLocaleString()}+`, 
      label: t('bachelor.info.stats.graduates'),
      icon: '👨‍🎓',
      delay: 600
    }
  ];

  const features = [
    { 
      icon: '🏆', 
      title: t('bachelor.info.features.quality.title'), 
      desc: t('bachelor.info.features.quality.desc'),
      color: 'blue'
    },
    { 
      icon: '🤝', 
      title: t('bachelor.info.features.industry.title'), 
      desc: t('bachelor.info.features.industry.desc'),
      color: 'green'
    },
    { 
      icon: '🌐', 
      title: t('bachelor.info.features.international.title'), 
      desc: t('bachelor.info.features.international.desc'),
      color: 'blue'
    }
  ];

  const nextProgram = () => {
    setSelectedProgram((prev) => (prev + 1) % programs.length);
  };

  const prevProgram = () => {
    setSelectedProgram((prev) => (prev - 1 + programs.length) % programs.length);
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
            {t('bachelor.info.badge')}
          </span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          {t('bachelor.info.title')}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-8"></div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t('bachelor.info.subtitle')}
        </p>
      </div>

      {/* Stats Section */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="text-center p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-500 group hover:-translate-y-2"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2 font-mono">
              {stat.number}
            </div>
            <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Programs Section */}
      <div className={`mb-16 transition-all duration-1000 delay-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          {t('bachelor.info.programsTitle')}
        </h2>
        
        {/* Program Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {programs.map((program, index) => (
            <button
              key={program.id}
              onClick={() => setSelectedProgram(index)}
              className={`group flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 ${
                selectedProgram === index
                  ? `bg-gradient-to-r ${program.color} text-white shadow-xl scale-105`
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }`}
            >
              <span className={`text-2xl transition-transform duration-300 ${
                selectedProgram === index ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {program.icon}
              </span>
              <span className="text-lg">{program.title}</span>
            </button>
          ))}
        </div>

        {/* Program Details */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative overflow-hidden group">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-5 rounded-full -translate-y-32 translate-x-32 group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${programs[selectedProgram].color} flex items-center justify-center text-white text-3xl shadow-lg`}>
                  {programs[selectedProgram].icon}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {programs[selectedProgram].title}
                  </h3>
                  <div className="flex items-center space-x-6 text-lg text-gray-600">
                    <span className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span>⏱️ {programs[selectedProgram].duration}</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>🎓 {t('bachelor.info.fullTime')}</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Navigation Controls */}
              <div className="flex space-x-2">
                <button
                  onClick={prevProgram}
                  className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextProgram}
                  className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-gray-700 text-lg leading-relaxed border-l-4 border-blue-500 pl-6 py-2 bg-blue-50 rounded-r-2xl">
                  {programs[selectedProgram].description}
                </p>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-gray-900 text-xl mb-4 flex items-center">
                    <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">📚</span>
                    {t('bachelor.info.keySubjects')}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {programs[selectedProgram].subjects.map((subject, idx) => (
                      <span 
                        key={idx}
                        className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl text-lg font-medium hover:bg-blue-200 hover:scale-105 transition-all duration-300 cursor-default"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-900 text-xl mb-4 flex items-center">
                    <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">💼</span>
                    {t('bachelor.info.careerPaths')}
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {programs[selectedProgram].careers.map((career, idx) => (
                      <span 
                        key={idx}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-2xl text-lg font-medium hover:bg-green-200 hover:scale-105 transition-all duration-300 cursor-default"
                      >
                        {career}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className={`grid md:grid-cols-3 gap-8 transition-all duration-1000 delay-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {features.map((feature, index) => (
          <div 
            key={index}
            onMouseEnter={() => setHoveredFeature(index)}
            onMouseLeave={() => setHoveredFeature(null)}
            className="bg-white p-8 rounded-2xl border border-gray-200 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 relative overflow-hidden"
          >
            {/* Animated background */}
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${
              feature.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
            }`}></div>
            
            <div className="relative z-10">
              <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-3xl transition-all duration-500 group-hover:scale-110 ${
                feature.color === 'blue' 
                  ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white' 
                  : 'bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white'
              }`}>
                {feature.icon}
              </div>
              <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                feature.color === 'blue' 
                  ? 'text-gray-900 group-hover:text-blue-600' 
                  : 'text-gray-900 group-hover:text-green-600'
              }`}>
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {feature.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BachelorInfo;