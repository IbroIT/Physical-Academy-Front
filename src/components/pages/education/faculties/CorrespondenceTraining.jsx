import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const CorrespondenceTraining = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [expandedStep, setExpandedStep] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeProgram, setActiveProgram] = useState(0);
  const sectionRef = useRef(null);

  const faculty = t('correspondenceTraining', { returnObjects: true });

  const tabs = [
    { id: 'about', label: t('education.tabs.about', 'О факультете'), icon: '🌐' },
    { id: 'programs', label: t('education.tabs.programs', 'Программы'), icon: '📱' },
    { id: 'technology', label: t('correspondenceTraining.tabs.technology', 'Технологии'), icon: '💻' },
    { id: 'process', label: t('correspondenceTraining.tabs.process', 'Процесс обучения'), icon: '🔄' },
    { id: 'contacts', label: t('education.tabs.contacts', 'Контакты'), icon: '📞' }
  ];

  // Автопереключение программ
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'programs') {
        setActiveProgram((prev) => (prev + 1) % faculty.programs.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeTab, faculty.programs?.length]);

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
        
        {/* Технологические символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🌐</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">💻</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">📱</div>
        <div className="absolute top-2/3 right-1/3 text-5xl opacity-5">🔄</div>
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
            🌐
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {faculty.name}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {faculty.fullDescription}
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 lg:mb-16"
        >
          {faculty.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
            >
              <div className="text-3xl mb-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-blue-100 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
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
                      <h3 className="text-2xl lg:text-3xl font-bold text-white flex items-center">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mr-4">
                          🎯
                        </div>
                        Миссия факультета
                      </h3>
                      <p className="text-blue-100 text-lg leading-relaxed mb-6">
                        {faculty.about.mission}
                      </p>
                      <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 border border-emerald-400/20">
                        <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                          <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mr-3">
                            ✨
                          </div>
                          Преимущества
                        </h4>
                        <ul className="space-y-3">
                          {faculty.about.advantages.map((advantage, index) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center text-blue-100"
                            >
                              <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                              {advantage}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl p-6 border border-blue-400/20">
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mr-3">
                          📊
                        </div>
                        Статистика
                      </h4>
                      <div className="space-y-4">
                        {faculty?.stats?.map((stat, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm hover:border-emerald-400/30 transition-all duration-300"
                          >
                            <span className="text-blue-100">{stat.label}</span>
                            <span className="text-white font-bold text-lg">{stat.value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Programs Tab */}
              {activeTab === 'programs' && (
                <motion.div
                  key="programs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Program Cards */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {faculty.programs.map((program, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className={`bg-white/5 rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 cursor-pointer ${
                          activeProgram === index
                            ? 'border-emerald-400/50 bg-gradient-to-r from-blue-500/10 to-emerald-500/10'
                            : 'border-white/10 hover:border-emerald-400/30'
                        }`}
                        onClick={() => setActiveProgram(index)}
                      >
                        <div className="text-2xl mb-4 text-emerald-400 transition-transform duration-300">
                          {program.icon}
                        </div>
                        <h4 className="text-lg font-bold text-white mb-3">{program.name}</h4>
                        <p className="text-blue-100 text-sm mb-4 leading-relaxed">{program.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-200">Длительность:</span>
                            <span className="text-white font-medium">{program.duration}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-blue-200">Стоимость:</span>
                            <span className="text-emerald-400 font-medium">{program.cost}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Active Program Details */}
                  <AnimatePresence mode="wait">
                    {faculty.programs[activeProgram] && (
                      <motion.div
                        key={activeProgram}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 lg:p-8 border border-emerald-400/20"
                      >
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                          <div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                              {faculty.programs[activeProgram].name}
                            </h3>
                            <p className="text-blue-100 text-lg leading-relaxed mb-6">
                              {faculty.programs[activeProgram].fullDescription || faculty.programs[activeProgram].description}
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg"
                            >
                              Подать заявку
                            </motion.button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                              <div className="text-2xl text-emerald-400 mb-2">⏱️</div>
                              <div className="text-white font-bold">{faculty.programs[activeProgram].duration}</div>
                              <div className="text-blue-200 text-sm">Длительность</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                              <div className="text-2xl text-blue-400 mb-2">💰</div>
                              <div className="text-white font-bold">{faculty.programs[activeProgram].cost}</div>
                              <div className="text-blue-200 text-sm">Стоимость</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                              <div className="text-2xl text-cyan-400 mb-2">🎓</div>
                              <div className="text-white font-bold">{faculty.programs[activeProgram].level || 'Бакалавр'}</div>
                              <div className="text-blue-200 text-sm">Уровень</div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                              <div className="text-2xl text-purple-400 mb-2">📚</div>
                              <div className="text-white font-bold">Online</div>
                              <div className="text-blue-200 text-sm">Формат</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Technology Tab */}
              {activeTab === 'technology' && (
                <motion.div
                  key="technology"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 flex items-center">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mr-4">
                          🛠️
                        </div>
                        Технологии обучения
                      </h3>
                      <div className="space-y-4">
                        {faculty.technologies.map((tech, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 backdrop-blur-sm"
                          >
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                              {tech.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg mb-1">{tech.name}</h4>
                              <p className="text-blue-100 text-sm">{tech.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl p-6 lg:p-8 border border-emerald-400/20">
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6 flex items-center">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mr-4">
                          📱
                        </div>
                        Платформы
                      </h3>
                      <div className="grid gap-4">
                        {faculty.platforms.map((platform, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-400/30 transition-all duration-300 backdrop-blur-sm"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl text-emerald-400">{platform.icon}</span>
                              <span className="text-white font-medium text-lg">{platform.name}</span>
                            </div>
                            <motion.a 
                              href={platform.link} 
                              whileHover={{ scale: 1.1 }}
                              className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium bg-emerald-500/20 px-4 py-2 rounded-lg backdrop-blur-sm"
                            >
                              Перейти →
                            </motion.a>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Process Tab */}
              {activeTab === 'process' && (
                <motion.div
                  key="process"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <h3 className="text-2xl lg:text-3xl font-bold text-white text-center mb-8 flex items-center justify-center">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mr-4">
                      🔄
                    </div>
                    Процесс обучения
                  </h3>
                  
                  <div className="space-y-6">
                    {faculty.learningProcess.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-sm hover:border-emerald-400/30 transition-all duration-300"
                      >
                        <motion.button
                          whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                          onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                          className="w-full p-6 lg:p-8 text-left flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center space-x-4 lg:space-x-6">
                            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-lg lg:text-xl">
                              {step.step}
                            </div>
                            <div>
                              <h4 className="text-lg lg:text-xl font-bold text-white">{step.title}</h4>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center text-blue-200 text-sm lg:text-base">
                                  <span className="text-lg lg:text-xl mr-2">{step.icon}</span>
                                  <span>{step.duration}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedStep === index ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <svg 
                              className="w-5 h-5 lg:w-6 lg:h-6 text-blue-300"
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </motion.div>
                        </motion.button>
                        
                        <AnimatePresence>
                          {expandedStep === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="px-6 lg:px-8 pb-6 lg:pb-8 border-t border-white/10 pt-4 lg:pt-6"
                            >
                              <p className="text-blue-100 text-lg leading-relaxed">{step.description}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Contacts Tab */}
              {activeTab === 'contacts' && (
                <motion.div
                  key="contacts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid lg:grid-cols-2 gap-8"
                >
                  <div className="space-y-6">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white flex items-center">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mr-4">
                        📞
                      </div>
                      Контактная информация
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(faculty.contacts).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 backdrop-blur-sm"
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                            {key === 'phone' && '📞'}
                            {key === 'email' && '📧'}
                            {key === 'address' && '🏢'}
                            {key === 'workingHours' && '🕒'}
                            {key === 'support' && '💬'}
                          </div>
                          <div>
                            <div className="text-white font-medium text-lg">{value}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 lg:p-8 border border-emerald-400/20">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mr-4">
                        👨‍💼
                      </div>
                      Руководство
                    </h3>
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                        {faculty.dean.avatar}
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">{faculty.dean.name}</h4>
                      <p className="text-emerald-400 text-lg mb-2">{faculty.dean.position}</p>
                      <p className="text-blue-100 text-sm mb-4">{faculty.dean.degree}</p>
                      <p className="text-white text-lg bg-white/5 rounded-lg py-2 px-4 backdrop-blur-sm">
                        {faculty.dean.email}
                      </p>
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

export default CorrespondenceTraining;