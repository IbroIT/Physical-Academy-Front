import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const PedagogicalSports = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
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
    const faculty = t('pedagogicalSports', { returnObjects: true });
    const targetValues = faculty.stats.map(stat => parseInt(stat.value.replace(/\D/g, '')));
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

  const faculty = t('pedagogicalSports', { returnObjects: true });

  const tabs = [
    { id: 'about', label: t('education.tabs.about'), icon: '🏃‍♂️', color: 'from-blue-500 to-blue-600' },
    { id: 'programs', label: t('education.tabs.programs'), icon: '📚', color: 'from-green-500 to-green-600' },
    { id: 'specializations', label: t('pedagogicalSports.tabs.specializations'), icon: '🎯', color: 'from-blue-500 to-green-500' },
    { id: 'sports', label: t('pedagogicalSports.tabs.sports'), icon: '⚽', color: 'from-green-500 to-blue-500' },
    { id: 'teachers', label: t('pedagogicalSports.tabs.teachers'), icon: '👨‍🏫', color: 'from-blue-500 to-green-600' },
    { id: 'contacts', label: t('education.tabs.contacts'), icon: '📞', color: 'from-green-500 to-green-600' }
  ];

  return (
    <div ref={sectionRef} className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className={`text-center mb-16 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-blue-600 font-medium text-sm">
            {t('pedagogicalSports.badge')}
          </span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          {faculty.name}
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-8"></div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {faculty.fullDescription}
        </p>
      </div>

      {/* Dynamic Stats */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {faculty.stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group text-center"
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className={`text-4xl mb-4 transition-transform duration-500 ${
              hoveredCard === index ? 'scale-125 rotate-12' : 'group-hover:scale-110'
            }`}>
              {stat.icon}
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2 font-mono">
              {stat.value.includes('%') 
                ? `${Math.round(counterValues[index])}%`
                : stat.value.includes('+')
                ? `${Math.round(counterValues[index])}+`
                : Math.round(counterValues[index])
              }
            </div>
            <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={`bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden transition-all duration-1000 delay-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto scrollbar-hide p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 flex-shrink-0 px-6 py-4 font-bold text-lg transition-all duration-500 transform hover:scale-105 rounded-2xl mx-1 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg scale-105`
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md'
                }`}
              >
                <span className={`text-xl transition-transform duration-300 ${
                  activeTab === tab.id ? 'scale-110' : ''
                }`}>
                  {tab.icon}
                </span>
                <span className="text-base lg:text-lg">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 lg:p-8">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className={`space-y-8 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-900 flex items-center">
                    <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">🎯</span>
                    Миссия факультета
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed border-l-4 border-blue-500 pl-6 py-2 bg-blue-50 rounded-r-2xl">
                    {faculty.about.mission}
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white mr-3 text-xs">✨</span>
                      Ключевые преимущества
                    </h4>
                    <ul className="space-y-3">
                      {faculty.about.advantages.map((advantage, index) => (
                        <li key={index} className="flex items-start group">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                          <span className="text-gray-700 text-lg group-hover:text-gray-900 transition-colors duration-300">{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white mr-3 text-xs">🏆</span>
                      Наши достижения
                    </h4>
                    <div className="space-y-4">
                      {faculty.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                          <span className="text-2xl text-blue-500 group-hover:scale-110 transition-transform duration-300">{achievement.icon}</span>
                          <div>
                            <div className="text-gray-900 font-bold text-lg">{achievement.value}</div>
                            <div className="text-gray-600 text-sm">{achievement.label}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Programs Tab */}
          {activeTab === 'programs' && (
            <div className={`space-y-8 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {faculty.programs.map((program, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden"
                    onMouseEnter={() => setHoveredCard(`program-${index}`)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className={`text-4xl mb-4 transition-transform duration-500 ${
                        hoveredCard === `program-${index}` ? 'scale-110 rotate-6' : 'group-hover:scale-105'
                      }`}>
                        {program.icon}
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{program.name}</h4>
                      <p className="text-gray-600 text-lg mb-4 leading-relaxed">{program.description}</p>
                      <div className="space-y-3 text-lg">
                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded-xl">
                          <span className="text-gray-600">Уровень:</span>
                          <span className="text-gray-900 font-semibold">{program.level}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded-xl">
                          <span className="text-gray-600">Длительность:</span>
                          <span className="text-gray-900 font-semibold">{program.duration}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded-xl">
                          <span className="text-gray-600">Форма:</span>
                          <span className="text-gray-900 font-semibold">{program.format}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specializations Tab */}
          {activeTab === 'specializations' && (
            <div className={`space-y-8 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-2 h-8 bg-blue-500 rounded mr-3"></span>
                    Педагогические специализации
                  </h3>
                  <div className="space-y-4">
                    {faculty.pedagogicalSpecializations.map((spec, index) => (
                      <div 
                        key={index} 
                        className="flex items-start space-x-4 p-6 bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-300">
                          {spec.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors duration-300">{spec.name}</h4>
                          <p className="text-gray-600 text-lg mb-3">{spec.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {spec.competencies.map((comp, i) => (
                              <span 
                                key={i} 
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-2xl text-sm font-medium hover:bg-blue-200 hover:scale-105 transition-all duration-300 cursor-default"
                              >
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-2 h-8 bg-green-500 rounded mr-3"></span>
                    Спортивные направления
                  </h3>
                  <div className="space-y-4">
                    {faculty.sportsSpecializations.map((sport, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group"
                      >
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{sport.icon}</span>
                          <div>
                            <div className="text-gray-900 font-bold text-lg group-hover:text-green-600 transition-colors duration-300">{sport.name}</div>
                            <div className="text-gray-600 text-lg">{sport.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gray-900 font-bold text-xl">{sport.coaches}</div>
                          <div className="text-gray-500 text-sm">тренеров</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sports Tab */}
          {activeTab === 'sports' && (
            <div className={`space-y-8 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {faculty.sports.map((sport, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden"
                  >
                    {/* Background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {sport.icon}
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors duration-300">{sport.name}</h4>
                      <p className="text-gray-600 text-lg mb-4">{sport.category}</p>
                      <div className="space-y-3 text-lg">
                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded-xl">
                          <span className="text-gray-600">Группы:</span>
                          <span className="text-gray-900 font-semibold">{sport.groups}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded-xl">
                          <span className="text-gray-600">Тренеры:</span>
                          <span className="text-gray-900 font-semibold">{sport.coaches}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sports Infrastructure */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">🏟️</span>
                  Спортивная инфраструктура
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {faculty.infrastructure.map((item, index) => (
                    <div 
                      key={index} 
                      className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 group"
                    >
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                      <div className="text-gray-900 font-bold text-lg mb-2 group-hover:text-green-600 transition-colors duration-300">{item.name}</div>
                      <div className="text-gray-600 text-lg">{item.capacity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Teachers Tab */}
          {activeTab === 'teachers' && (
            <div className={`space-y-8 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {faculty.teachers.map((teacher, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden"
                  >
                    {/* Background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        {teacher.avatar}
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors duration-300">{teacher.name}</h4>
                      <p className="text-blue-600 text-lg font-medium mb-2">{teacher.position}</p>
                      <p className="text-gray-700 text-lg mb-3">{teacher.sport}</p>
                      <p className="text-gray-600 text-lg mb-4">{teacher.qualification}</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {teacher.specializations.map((spec, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-2xl text-sm font-medium hover:bg-green-200 hover:scale-105 transition-all duration-300 cursor-default"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <div className={`grid md:grid-cols-2 gap-8 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="w-2 h-8 bg-blue-500 rounded mr-3"></span>
                  Контакты
                </h3>
                <div className="space-y-4">
                  {Object.entries(faculty.contacts).map(([key, value]) => (
                    <div 
                      key={key} 
                      className="flex items-center space-x-4 p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 group"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                        {key === 'phone' && '📞'}
                        {key === 'email' && '📧'}
                        {key === 'address' && '🏢'}
                        {key === 'workingHours' && '🕒'}
                      </div>
                      <div>
                        <div className="text-gray-900 font-bold text-lg group-hover:text-blue-600 transition-colors duration-300">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">👨‍💼</span>
                  Декан факультета
                </h3>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 hover:scale-110 transition-transform duration-300">
                    {faculty.dean.avatar}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{faculty.dean.name}</h4>
                  <p className="text-blue-600 text-lg font-medium mb-2">{faculty.dean.position}</p>
                  <p className="text-gray-600 text-lg mb-3">{faculty.dean.degree}</p>
                  <p className="text-gray-700 font-semibold">{faculty.dean.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className={`mt-16 bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-12 text-center border border-gray-200 transition-all duration-1000 delay-900 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            {t('pedagogicalSports.cta.title')}
          </h3>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {t('pedagogicalSports.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-semibold hover:bg-blue-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2">
              <span>{t('pedagogicalSports.cta.apply')}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button className="border-2 border-green-600 text-green-600 px-10 py-4 rounded-2xl font-semibold hover:bg-green-600 hover:text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {t('pedagogicalSports.cta.contact')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedagogicalSports;