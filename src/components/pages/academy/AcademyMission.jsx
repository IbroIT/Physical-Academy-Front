// components/AcademyMission.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const AcademyMission = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('mission');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredValue, setHoveredValue] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const tabs = [
    { 
      id: 'mission', 
      label: t('academy.mission.tabs.mission'), 
      icon: '🎯',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'vision', 
      label: t('academy.mission.tabs.vision'), 
      icon: '🔭',
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'values', 
      label: t('academy.mission.tabs.values'), 
      icon: '💎',
      color: 'from-blue-500 to-green-500'
    },
    { 
      id: 'strategy', 
      label: t('academy.mission.tabs.strategy'), 
      icon: '📊',
      color: 'from-green-600 to-blue-600'
    }
  ];

  const values = [
    {
      icon: '🎓',
      title: t('academy.mission.values.excellence.title'),
      description: t('academy.mission.values.excellence.description'),
      color: 'blue'
    },
    {
      icon: '💡',
      title: t('academy.mission.values.innovation.title'),
      description: t('academy.mission.values.innovation.description'),
      color: 'green'
    },
    {
      icon: '🤝',
      title: t('academy.mission.values.community.title'),
      description: t('academy.mission.values.community.description'),
      color: 'blue'
    },
    {
      icon: '🔬',
      title: t('academy.mission.values.research.title'),
      description: t('academy.mission.values.research.description'),
      color: 'green'
    }
  ];

  const strategicGoals = [
    {
      goal: t('academy.mission.strategy.goals.0.goal'),
      timeline: '2024-2026',
      metrics: [
        t('academy.mission.strategy.goals.0.metrics.0'),
        t('academy.mission.strategy.goals.0.metrics.1')
      ],
      progress: 75,
      icon: '🎯'
    },
    {
      goal: t('academy.mission.strategy.goals.1.goal'),
      timeline: '2024-2028',
      metrics: [
        t('academy.mission.strategy.goals.1.metrics.0'),
        t('academy.mission.strategy.goals.1.metrics.1')
      ],
      progress: 45,
      icon: '🌍'
    },
    {
      goal: t('academy.mission.strategy.goals.2.goal'),
      timeline: '2024-2030',
      metrics: [
        t('academy.mission.strategy.goals.2.metrics.0'),
        t('academy.mission.strategy.goals.2.metrics.1')
      ],
      progress: 25,
      icon: '🚀'
    }
  ];

  const renderContent = () => {
    const contentVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };

    switch (activeTab) {
      case 'mission':
        return (
          <div className={`space-y-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-200 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                    🎯
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {t('academy.mission.missionTitle')}
                  </h3>
                </div>
                <p className="text-gray-700 text-xl leading-relaxed bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white">
                  {t('academy.mission.missionStatement')}
                </p>
              </div>
            </div>
          </div>
        );

      case 'vision':
        return (
          <div className={`space-y-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-500 opacity-5 rounded-full translate-y-20 -translate-x-20 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                    🔭
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {t('academy.mission.visionTitle')}
                  </h3>
                </div>
                <p className="text-gray-700 text-xl leading-relaxed bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white">
                  {t('academy.mission.visionStatement')}
                </p>
              </div>
            </div>
          </div>
        );

      case 'values':
        return (
          <div className={`grid md:grid-cols-2 gap-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {values.map((value, index) => (
              <div 
                key={index}
                onMouseEnter={() => setHoveredValue(index)}
                onMouseLeave={() => setHoveredValue(null)}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-500 group hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Animated background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${
                  value.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl mb-6 flex items-center justify-center text-2xl transition-all duration-500 group-hover:scale-110 ${
                    value.color === 'blue' 
                      ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white' 
                      : 'bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white'
                  }`}>
                    {value.icon}
                  </div>
                  <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                    value.color === 'blue' 
                      ? 'text-gray-900 group-hover:text-blue-600' 
                      : 'text-gray-900 group-hover:text-green-600'
                  }`}>
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );

      case 'strategy':
        return (
          <div className={`space-y-8 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                  📊
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  {t('academy.mission.strategy.title')}
                </h3>
              </div>
              
              <div className="space-y-6">
                {strategicGoals.map((goal, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-500 group"
                  >
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                        {goal.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                          <h4 className="font-bold text-gray-900 text-xl mb-2 lg:mb-0">
                            {goal.goal}
                          </h4>
                          <span className="text-sm text-green-600 font-semibold bg-green-100 px-4 py-2 rounded-full whitespace-nowrap">
                            {goal.timeline}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>{t('academy.mission.strategy.progress')}</span>
                            <span>{goal.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${goal.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <ul className="space-y-3">
                          {goal.metrics.map((metric, idx) => (
                            <li key={idx} className="flex items-start group">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                              <span className="text-gray-700 text-lg">{metric}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      {/* Header */}
      <div className={`text-center mb-16 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-blue-600 font-medium text-sm">
            {t('academy.mission.badge')}
          </span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          {t('academy.mission.title')}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-8"></div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t('academy.mission.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className={`flex flex-wrap justify-center gap-4 mb-12 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group flex items-center space-x-3 px-8 py-4 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 ${
              activeTab === tab.id
                ? `bg-gradient-to-r ${tab.color} text-white shadow-xl scale-105`
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:shadow-lg'
            }`}
          >
            <span className={`text-2xl transition-transform duration-300 ${
              activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'
            }`}>
              {tab.icon}
            </span>
            <span className="text-lg">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={`bg-white rounded-2xl p-8 border border-gray-200 transition-all duration-1000 delay-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {renderContent()}
      </div>

      {/* Call to Action */}
      <div className={`mt-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-12 text-center border border-gray-200 transition-all duration-1000 delay-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            {t('academy.mission.cta.title')}
          </h3>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {t('academy.mission.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-blue-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2">
              <span>{t('academy.mission.cta.button')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button className="border-2 border-green-600 text-green-600 px-10 py-4 rounded-2xl font-semibold hover:bg-green-600 hover:text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {t('academy.mission.cta.learnMore')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyMission;