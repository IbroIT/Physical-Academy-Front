// DoctorateProgram.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DoctorateProgram = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [activeDirection, setActiveDirection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [applicationStep, setApplicationStep] = useState(1);

  // Научные направления
  const researchDirections = [
    {
      id: 1,
      title: t('doctorateProgram.researchDirections.sportsPhysiology.title'),
      description: t('doctorateProgram.researchDirections.sportsPhysiology.description'),
      supervisor: t('doctorateProgram.researchDirections.sportsPhysiology.supervisor'),
      duration: '3-4 года',
      requirements: [
        t('doctorateProgram.researchDirections.sportsPhysiology.requirements.0'),
        t('doctorateProgram.researchDirections.sportsPhysiology.requirements.1'),
        t('doctorateProgram.researchDirections.sportsPhysiology.requirements.2')
      ],
      icon: '🧬',
      color: 'blue'
    },
    {
      id: 2,
      title: t('doctorateProgram.researchDirections.sportsPsychology.title'),
      description: t('doctorateProgram.researchDirections.sportsPsychology.description'),
      supervisor: t('doctorateProgram.researchDirections.sportsPsychology.supervisor'),
      duration: '3-4 года',
      requirements: [
        t('doctorateProgram.researchDirections.sportsPsychology.requirements.0'),
        t('doctorateProgram.researchDirections.sportsPsychology.requirements.1'),
        t('doctorateProgram.researchDirections.sportsPsychology.requirements.2')
      ],
      icon: '🧠',
      color: 'green'
    },
    {
      id: 3,
      title: t('doctorateProgram.researchDirections.biomechanics.title'),
      description: t('doctorateProgram.researchDirections.biomechanics.description'),
      supervisor: t('doctorateProgram.researchDirections.biomechanics.supervisor'),
      duration: '3-4 года',
      requirements: [
        t('doctorateProgram.researchDirections.biomechanics.requirements.0'),
        t('doctorateProgram.researchDirections.biomechanics.requirements.1'),
        t('doctorateProgram.researchDirections.biomechanics.requirements.2')
      ],
      icon: '⚙️',
      color: 'blue'
    },
    {
      id: 4,
      title: t('doctorateProgram.researchDirections.sportsManagement.title'),
      description: t('doctorateProgram.researchDirections.sportsManagement.description'),
      supervisor: t('doctorateProgram.researchDirections.sportsManagement.supervisor'),
      duration: '3-4 года',
      requirements: [
        t('doctorateProgram.researchDirections.sportsManagement.requirements.0'),
        t('doctorateProgram.researchDirections.sportsManagement.requirements.1'),
        t('doctorateProgram.researchDirections.sportsManagement.requirements.2')
      ],
      icon: '📊',
      color: 'green'
    }
  ];

  // Процесс поступления
  const applicationSteps = [
    {
      step: 1,
      title: t('doctorateProgram.applicationProcess.step1.title'),
      description: t('doctorateProgram.applicationProcess.step1.description'),
      duration: t('doctorateProgram.applicationProcess.step1.duration')
    },
    {
      step: 2,
      title: t('doctorateProgram.applicationProcess.step2.title'),
      description: t('doctorateProgram.applicationProcess.step2.description'),
      duration: t('doctorateProgram.applicationProcess.step2.duration')
    },
    {
      step: 3,
      title: t('doctorateProgram.applicationProcess.step3.title'),
      description: t('doctorateProgram.applicationProcess.step3.description'),
      duration: t('doctorateProgram.applicationProcess.step3.duration')
    },
    {
      step: 4,
      title: t('doctorateProgram.applicationProcess.step4.title'),
      description: t('doctorateProgram.applicationProcess.step4.description'),
      duration: t('doctorateProgram.applicationProcess.step4.duration')
    }
  ];

  // Преимущества программы
  const benefits = [
    {
      title: t('doctorateProgram.benefits.researchFunding.title'),
      description: t('doctorateProgram.benefits.researchFunding.description'),
      icon: '💰'
    },
    {
      title: t('doctorateProgram.benefits.internationalOpportunities.title'),
      description: t('doctorateProgram.benefits.internationalOpportunities.description'),
      icon: '🌍'
    },
    {
      title: t('doctorateProgram.benefits.modernLabs.title'),
      description: t('doctorateProgram.benefits.modernLabs.description'),
      icon: '🔬'
    },
    {
      title: t('doctorateProgram.benefits.careerSupport.title'),
      description: t('doctorateProgram.benefits.careerSupport.description'),
      icon: '🎯'
    }
  ];

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

    const section = document.getElementById('doctorate-program');
    if (section) {
      observer.observe(section);
    }

    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Автопереключение научных направлений
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDirection(prev => (prev + 1) % researchDirections.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [researchDirections.length]);

  const handleApplicationStepClick = (step) => {
    setApplicationStep(step);
  };

  const handleApplyNow = () => {
    // В реальном приложении здесь будет логика открытия формы заявки
    alert(t('doctorateProgram.applicationSuccess'));
  };

  return (
    <section id="doctorate-program" className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-16 px-4 overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Заголовок секции */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900 mb-6">
            {t('doctorateProgram.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            {t('doctorateProgram.subtitle')}
          </p>
          
          {/* Ключевые показатели */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">25+</div>
              <div className="text-gray-600">{t('doctorateProgram.stats.years')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">150+</div>
              <div className="text-gray-600">{t('doctorateProgram.stats.graduates')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">12</div>
              <div className="text-gray-600">{t('doctorateProgram.stats.professors')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">85%</div>
              <div className="text-gray-600">{t('doctorateProgram.stats.successRate')}</div>
            </div>
          </div>
        </div>

        {/* Навигационные табы */}
        <div className={`flex flex-wrap justify-center mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-2xl shadow-lg p-2 flex flex-wrap gap-2">
            {[
              { id: 'about', label: t('doctorateProgram.tabs.about') },
              { id: 'directions', label: t('doctorateProgram.tabs.directions') },
              { id: 'admission', label: t('doctorateProgram.tabs.admission') },
              { id: 'benefits', label: t('doctorateProgram.tabs.benefits') },
              { id: 'contact', label: t('doctorateProgram.tabs.contact') }
            ].map(tab => (
              <button
                key={tab.id}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Контент табов */}
        <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          {/* О программе */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('doctorateProgram.about.title')}</h2>
                <p className="text-gray-600 mb-6 text-lg">
                  {t('doctorateProgram.about.description')}
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <p className="text-gray-700">{t('doctorateProgram.about.features.0')}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <p className="text-gray-700">{t('doctorateProgram.about.features.1')}</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <p className="text-gray-700">{t('doctorateProgram.about.features.2')}</p>
                  </div>
                </div>
                
                <button 
                  onClick={handleApplyNow}
                  className="mt-8 px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  {t('doctorateProgram.applyNow')}
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl shadow-xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-6">{t('doctorateProgram.programStructure.title')}</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-xl">📚</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{t('doctorateProgram.programStructure.coursework.title')}</h4>
                      <p className="opacity-90">{t('doctorateProgram.programStructure.coursework.description')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-xl">🔬</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{t('doctorateProgram.programStructure.research.title')}</h4>
                      <p className="opacity-90">{t('doctorateProgram.programStructure.research.description')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-xl">📝</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{t('doctorateProgram.programStructure.dissertation.title')}</h4>
                      <p className="opacity-90">{t('doctorateProgram.programStructure.dissertation.description')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Научные направления */}
          {activeTab === 'directions' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {researchDirections.map((direction, index) => (
                  <button
                    key={direction.id}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      activeDirection === index
                        ? `border-${direction.color}-500 bg-${direction.color}-50 transform scale-105 shadow-lg`
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                    onClick={() => setActiveDirection(index)}
                  >
                    <div className="text-3xl mb-4">{direction.icon}</div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{direction.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{direction.description}</p>
                  </button>
                ))}
              </div>
              
              {/* Детальная информация о выбранном направлении */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className={`bg-gradient-to-r from-${researchDirections[activeDirection]?.color}-500 to-${researchDirections[activeDirection]?.color}-600 p-8 text-white`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="text-4xl mr-4">{researchDirections[activeDirection]?.icon}</div>
                      <div>
                        <h2 className="text-3xl font-bold">{researchDirections[activeDirection]?.title}</h2>
                        <p className="text-lg opacity-90 mt-1">{researchDirections[activeDirection]?.description}</p>
                      </div>
                    </div>
                    <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                      <span className="font-semibold">{researchDirections[activeDirection]?.duration}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{t('doctorateProgram.supervisor')}</h3>
                      <div className="bg-gray-50 rounded-xl p-6">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                            {researchDirections[activeDirection]?.supervisor.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{researchDirections[activeDirection]?.supervisor}</h4>
                            <p className="text-gray-600">{t('doctorateProgram.professor')}</p>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">{t('doctorateProgram.requirements')}</h3>
                      <ul className="space-y-3">
                        {researchDirections[activeDirection]?.requirements.map((requirement, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-gray-700">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{t('doctorateProgram.researchAreas')}</h3>
                      <div className="bg-blue-50 rounded-xl p-6">
                        <p className="text-gray-700 mb-4">
                          {t('doctorateProgram.researchDescription')}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            t('doctorateProgram.researchTopics.0'),
                            t('doctorateProgram.researchTopics.1'),
                            t('doctorateProgram.researchTopics.2'),
                            t('doctorateProgram.researchTopics.3')
                          ].map((topic, index) => (
                            <span key={index} className="px-3 py-1 bg-white rounded-full text-sm text-blue-700 border border-blue-200">
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <button 
                        onClick={handleApplyNow}
                        className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
                      >
                        {t('doctorateProgram.applyForDirection')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Процесс поступления */}
          {activeTab === 'admission' && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t('doctorateProgram.applicationProcess.title')}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                  {applicationSteps.map(step => (
                    <button
                      key={step.step}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-center ${
                        applicationStep === step.step
                          ? 'border-blue-500 bg-blue-50 transform scale-105 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                      }`}
                      onClick={() => handleApplicationStepClick(step.step)}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                        applicationStep === step.step
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <span className="font-bold">{step.step}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{step.duration}</p>
                    </button>
                  ))}
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{applicationSteps[applicationStep - 1]?.title}</h3>
                  <p className="text-gray-700 text-lg mb-6">{applicationSteps[applicationStep - 1]?.description}</p>
                  
                  <div className="flex flex-wrap gap-4">
                    <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      {t('doctorateProgram.downloadChecklist')}
                    </button>
                    <button className="px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
                      {t('doctorateProgram.viewRequirements')}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('doctorateProgram.deadlines.title')}</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-700">{t('doctorateProgram.deadlines.springIntake')}</span>
                      <span className="font-semibold text-blue-600">15 января</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-700">{t('doctorateProgram.deadlines.fallIntake')}</span>
                      <span className="font-semibold text-green-600">15 августа</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-700">{t('doctorateProgram.deadlines.interviews')}</span>
                      <span className="font-semibold text-blue-600">1-15 сентября</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('doctorateProgram.requiredDocuments.title')}</h3>
                  
                  <ul className="space-y-3">
                    {[
                      t('doctorateProgram.requiredDocuments.list.0'),
                      t('doctorateProgram.requiredDocuments.list.1'),
                      t('doctorateProgram.requiredDocuments.list.2'),
                      t('doctorateProgram.requiredDocuments.list.3'),
                      t('doctorateProgram.requiredDocuments.list.4')
                    ].map((doc, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-700">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Преимущества */}
          {activeTab === 'benefits' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-xl p-8 text-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-4">{t('doctorateProgram.funding.title')}</h2>
                    <p className="text-lg opacity-90 mb-6">
                      {t('doctorateProgram.funding.description')}
                    </p>
                    <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                      {t('doctorateProgram.learnMore')}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
                      <div className="text-2xl font-bold">100%</div>
                      <div className="text-sm opacity-90">{t('doctorateProgram.funding.tuitionCovered')}</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
                      <div className="text-2xl font-bold">₽40,000</div>
                      <div className="text-sm opacity-90">{t('doctorateProgram.funding.monthlyStipend')}</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
                      <div className="text-2xl font-bold">₽100,000</div>
                      <div className="text-sm opacity-90">{t('doctorateProgram.funding.researchGrant')}</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
                      <div className="text-2xl font-bold">5</div>
                      <div className="text-sm opacity-90">{t('doctorateProgram.funding.internationalConferences')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Контакты */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('doctorateProgram.contact.title')}</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('doctorateProgram.contact.address.title')}</h3>
                      <p className="text-gray-700">{t('doctorateProgram.contact.address.value')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('doctorateProgram.contact.phone.title')}</h3>
                      <p className="text-gray-700">{t('doctorateProgram.contact.phone.value')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('doctorateProgram.contact.email.title')}</h3>
                      <p className="text-gray-700">{t('doctorateProgram.contact.email.value')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('doctorateProgram.contact.hours.title')}</h3>
                      <p className="text-gray-700">{t('doctorateProgram.contact.hours.value')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl shadow-xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-6">{t('doctorateProgram.contactForm.title')}</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 opacity-90">
                      {t('doctorateProgram.contactForm.name')}
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder={t('doctorateProgram.contactForm.namePlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 opacity-90">
                      {t('doctorateProgram.contactForm.email')}
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder={t('doctorateProgram.contactForm.emailPlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1 opacity-90">
                      {t('doctorateProgram.contactForm.message')}
                    </label>
                    <textarea 
                      rows="4"
                      className="w-full px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder={t('doctorateProgram.contactForm.messagePlaceholder')}
                    ></textarea>
                  </div>
                  
                  <button className="w-full mt-4 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105">
                    {t('doctorateProgram.contactForm.submit')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DoctorateProgram;