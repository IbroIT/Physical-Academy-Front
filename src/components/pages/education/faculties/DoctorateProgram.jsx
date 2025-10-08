import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorateProgram = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [activeDirection, setActiveDirection] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [applicationStep, setApplicationStep] = useState(1);
  const sectionRef = useRef(null);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Автопереключение научных направлений
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'directions') {
        setActiveDirection(prev => (prev + 1) % researchDirections.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [activeTab, researchDirections.length]);

  const handleApplicationStepClick = (step) => {
    setApplicationStep(step);
  };

  const handleApplyNow = () => {
    // В реальном приложении здесь будет логика открытия формы заявки
    alert(t('doctorateProgram.applicationSuccess'));
  };

  const tabs = [
    { id: 'about', label: t('doctorateProgram.tabs.about'), icon: '🎓' },
    { id: 'directions', label: t('doctorateProgram.tabs.directions'), icon: '🔬' },
    { id: 'admission', label: t('doctorateProgram.tabs.admission'), icon: '📝' },
    { id: 'benefits', label: t('doctorateProgram.tabs.benefits'), icon: '✨' },
    { id: 'contact', label: t('doctorateProgram.tabs.contact'), icon: '📞' }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Научные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🎓</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🔬</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">📚</div>
        <div className="absolute top-2/3 right-1/3 text-5xl opacity-5">⚗️</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            🎓
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('doctorateProgram.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed mb-8">
            {t('doctorateProgram.subtitle')}
          </p>

          {/* Ключевые показатели */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
          >
            {[
              { value: '25+', label: t('doctorateProgram.stats.years'), color: 'blue' },
              { value: '150+', label: t('doctorateProgram.stats.graduates'), color: 'green' },
              { value: '12', label: t('doctorateProgram.stats.professors'), color: 'blue' },
              { value: '85%', label: t('doctorateProgram.stats.successRate'), color: 'green' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
              >
                <div className={`text-2xl lg:text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 ${
                  stat.color === 'blue' ? 'text-blue-400' : 'text-emerald-400'
                }`}>
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="border-b border-white/20 bg-white/5">
            <div className="flex overflow-x-auto scrollbar-hide px-4">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 flex-shrink-0 px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-emerald-400 text-white bg-white/10'
                      : 'border-transparent text-blue-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {/* About Tab */}
              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h2 className="text-2xl lg:text-3xl font-bold text-white flex items-center">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mr-4">
                          🎯
                        </div>
                        {t('doctorateProgram.about.title')}
                      </h2>
                      <p className="text-blue-100 text-lg leading-relaxed">
                        {t('doctorateProgram.about.description')}
                      </p>
                      
                      <div className="space-y-4">
                        {[
                          t('doctorateProgram.about.features.0'),
                          t('doctorateProgram.about.features.1'),
                          t('doctorateProgram.about.features.2')
                        ].map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start"
                          >
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                              </svg>
                            </div>
                            <p className="text-blue-100">{feature}</p>
                          </motion.div>
                        ))}
                      </div>
                      
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleApplyNow}
                        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all shadow-lg"
                      >
                        {t('doctorateProgram.applyNow')}
                      </motion.button>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 lg:p-8 border border-emerald-400/20">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mr-4">
                          📚
                        </div>
                        {t('doctorateProgram.programStructure.title')}
                      </h3>
                      
                      <div className="space-y-6">
                        {[
                          {
                            icon: '📚',
                            title: t('doctorateProgram.programStructure.coursework.title'),
                            description: t('doctorateProgram.programStructure.coursework.description')
                          },
                          {
                            icon: '🔬',
                            title: t('doctorateProgram.programStructure.research.title'),
                            description: t('doctorateProgram.programStructure.research.description')
                          },
                          {
                            icon: '📝',
                            title: t('doctorateProgram.programStructure.dissertation.title'),
                            description: t('doctorateProgram.programStructure.dissertation.description')
                          }
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start"
                          >
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                              <span className="text-xl">{item.icon}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg">{item.title}</h4>
                              <p className="text-blue-100 opacity-90">{item.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Research Directions Tab */}
              {activeTab === 'directions' && (
                <motion.div
                  key="directions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {researchDirections.map((direction, index) => (
                      <motion.button
                        key={direction.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setActiveDirection(index)}
                        className={`p-4 rounded-xl border-2 backdrop-blur-sm transition-all duration-300 text-left ${
                          activeDirection === index
                            ? 'border-emerald-400 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 transform scale-105 shadow-lg'
                            : 'border-white/10 bg-white/5 hover:border-emerald-400/30'
                        }`}
                      >
                        <div className="text-2xl mb-3">{direction.icon}</div>
                        <h3 className="font-bold text-white text-sm mb-2">{direction.title}</h3>
                        <p className="text-blue-200 text-xs line-clamp-2">{direction.description}</p>
                      </motion.button>
                    ))}
                  </div>
                  
                  {/* Детальная информация о выбранном направлении */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeDirection}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl border border-emerald-400/20 overflow-hidden"
                    >
                      <div className={`bg-gradient-to-r from-blue-500 to-emerald-500 p-6 lg:p-8 text-white`}>
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                          <div className="flex items-center mb-4 lg:mb-0">
                            <div className="text-4xl mr-4">{researchDirections[activeDirection]?.icon}</div>
                            <div>
                              <h2 className="text-2xl lg:text-3xl font-bold">{researchDirections[activeDirection]?.title}</h2>
                              <p className="text-blue-100 text-lg mt-1">{researchDirections[activeDirection]?.description}</p>
                            </div>
                          </div>
                          <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                            <span className="font-semibold">{researchDirections[activeDirection]?.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-4">{t('doctorateProgram.supervisor')}</h3>
                            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
                              <div className="flex items-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                                  {researchDirections[activeDirection]?.supervisor.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white">{researchDirections[activeDirection]?.supervisor}</h4>
                                  <p className="text-blue-200">{t('doctorateProgram.professor')}</p>
                                </div>
                              </div>
                            </div>
                            
                            <h3 className="text-xl font-bold text-white mt-8 mb-4">{t('doctorateProgram.requirements')}</h3>
                            <ul className="space-y-3">
                              {researchDirections[activeDirection]?.requirements.map((requirement, index) => (
                                <motion.li
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start"
                                >
                                  <svg className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                  </svg>
                                  <span className="text-blue-100">{requirement}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-bold text-white mb-4">{t('doctorateProgram.researchAreas')}</h3>
                            <div className="bg-blue-500/10 rounded-xl p-6 backdrop-blur-sm border border-blue-400/20">
                              <p className="text-blue-100 mb-4">
                                {t('doctorateProgram.researchDescription')}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  t('doctorateProgram.researchTopics.0'),
                                  t('doctorateProgram.researchTopics.1'),
                                  t('doctorateProgram.researchTopics.2'),
                                  t('doctorateProgram.researchTopics.3')
                                ].map((topic, index) => (
                                  <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-sm text-blue-200 border border-blue-400/30 backdrop-blur-sm">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleApplyNow}
                              className="w-full mt-6 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all shadow-lg"
                            >
                              {t('doctorateProgram.applyForDirection')}
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Admission Tab */}
              {activeTab === 'admission' && (
                <motion.div
                  key="admission"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="bg-white/5 rounded-2xl p-6 lg:p-8 backdrop-blur-sm border border-white/10">
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8 text-center">
                      {t('doctorateProgram.applicationProcess.title')}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                      {applicationSteps.map(step => (
                        <motion.button
                          key={step.step}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: step.step * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleApplicationStepClick(step.step)}
                          className={`p-4 rounded-xl border-2 backdrop-blur-sm transition-all duration-300 text-center ${
                            applicationStep === step.step
                              ? 'border-emerald-400 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 transform scale-105 shadow-lg'
                              : 'border-white/10 bg-white/5 hover:border-emerald-400/30'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                            applicationStep === step.step
                              ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white'
                              : 'bg-white/10 text-blue-200'
                          }`}>
                            <span className="font-bold">{step.step}</span>
                          </div>
                          <h3 className="font-semibold text-white text-sm">{step.title}</h3>
                          <p className="text-blue-200 text-xs mt-1">{step.duration}</p>
                        </motion.button>
                      ))}
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 lg:p-8 border border-emerald-400/20">
                      <h3 className="text-2xl font-bold text-white mb-4">{applicationSteps[applicationStep - 1]?.title}</h3>
                      <p className="text-blue-100 text-lg mb-6">{applicationSteps[applicationStep - 1]?.description}</p>
                      
                      <div className="flex flex-wrap gap-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all shadow-lg"
                        >
                          {t('doctorateProgram.downloadChecklist')}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 border border-blue-400 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-all backdrop-blur-sm"
                        >
                          {t('doctorateProgram.viewRequirements')}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                      <h3 className="text-2xl font-bold text-white mb-6">{t('doctorateProgram.deadlines.title')}</h3>
                      
                      <div className="space-y-4">
                        {[
                          { label: t('doctorateProgram.deadlines.springIntake'), date: '15 января', color: 'blue' },
                          { label: t('doctorateProgram.deadlines.fallIntake'), date: '15 августа', color: 'green' },
                          { label: t('doctorateProgram.deadlines.interviews'), date: '1-15 сентября', color: 'blue' }
                        ].map((deadline, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex justify-between items-center py-3 border-b border-white/10"
                          >
                            <span className="text-blue-100">{deadline.label}</span>
                            <span className={`font-semibold ${
                              deadline.color === 'blue' ? 'text-blue-400' : 'text-emerald-400'
                            }`}>
                              {deadline.date}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                      <h3 className="text-2xl font-bold text-white mb-6">{t('doctorateProgram.requiredDocuments.title')}</h3>
                      
                      <ul className="space-y-3">
                        {[
                          t('doctorateProgram.requiredDocuments.list.0'),
                          t('doctorateProgram.requiredDocuments.list.1'),
                          t('doctorateProgram.requiredDocuments.list.2'),
                          t('doctorateProgram.requiredDocuments.list.3'),
                          t('doctorateProgram.requiredDocuments.list.4')
                        ].map((doc, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start"
                          >
                            <svg className="w-5 h-5 text-emerald-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-blue-100">{doc}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Benefits Tab */}
              {activeTab === 'benefits' && (
                <motion.div
                  key="benefits"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
                      >
                        <div className="text-4xl mb-4 text-emerald-400">{benefit.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-3">{benefit.title}</h3>
                        <p className="text-blue-100 text-sm">{benefit.description}</p>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 lg:p-8 border border-emerald-400/20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">{t('doctorateProgram.funding.title')}</h2>
                        <p className="text-blue-100 text-lg mb-6">
                          {t('doctorateProgram.funding.description')}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all shadow-lg"
                        >
                          {t('doctorateProgram.learnMore')}
                        </motion.button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { value: '100%', label: t('doctorateProgram.funding.tuitionCovered') },
                          { value: '₽40,000', label: t('doctorateProgram.funding.monthlyStipend') },
                          { value: '₽100,000', label: t('doctorateProgram.funding.researchGrant') },
                          { value: '5', label: t('doctorateProgram.funding.internationalConferences') }
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm border border-white/30"
                          >
                            <div className="text-xl font-bold text-white">{item.value}</div>
                            <div className="text-blue-100 text-sm opacity-90">{item.label}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  <div className="bg-white/5 rounded-2xl p-6 lg:p-8 backdrop-blur-sm border border-white/10">
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">{t('doctorateProgram.contact.title')}</h2>
                    
                    <div className="space-y-6">
                      {[
                        {
                          icon: '📍',
                          title: t('doctorateProgram.contact.address.title'),
                          value: t('doctorateProgram.contact.address.value')
                        },
                        {
                          icon: '📞',
                          title: t('doctorateProgram.contact.phone.title'),
                          value: t('doctorateProgram.contact.phone.value')
                        },
                        {
                          icon: '📧',
                          title: t('doctorateProgram.contact.email.title'),
                          value: t('doctorateProgram.contact.email.value')
                        },
                        {
                          icon: '🕒',
                          title: t('doctorateProgram.contact.hours.title'),
                          value: t('doctorateProgram.contact.hours.value')
                        }
                      ].map((contact, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start"
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white mr-4 flex-shrink-0">
                            <span className="text-lg">{contact.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg">{contact.title}</h3>
                            <p className="text-blue-100">{contact.value}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 lg:p-8 border border-emerald-400/20">
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">{t('doctorateProgram.contactForm.title')}</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-blue-200">
                          {t('doctorateProgram.contactForm.name')}
                        </label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                          placeholder={t('doctorateProgram.contactForm.namePlaceholder')}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-blue-200">
                          {t('doctorateProgram.contactForm.email')}
                        </label>
                        <input 
                          type="email" 
                          className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                          placeholder={t('doctorateProgram.contactForm.emailPlaceholder')}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1 text-blue-200">
                          {t('doctorateProgram.contactForm.message')}
                        </label>
                        <textarea 
                          rows="4"
                          className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                          placeholder={t('doctorateProgram.contactForm.messagePlaceholder')}
                        ></textarea>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full mt-4 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all shadow-lg"
                      >
                        {t('doctorateProgram.contactForm.submit')}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DoctorateProgram;