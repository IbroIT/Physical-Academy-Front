import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const MilitaryTraining = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [selectedProgram, setSelectedProgram] = useState(0);
  const [expandedSpecialty, setExpandedSpecialty] = useState(null);
  const [activeOfficer, setActiveOfficer] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const faculty = t('militaryTraining', { returnObjects: true });

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

  // Автопереключение офицеров
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveOfficer((prev) => (prev + 1) % (faculty.command?.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [faculty.command?.length]);

  const tabs = [
    { id: 'about', label: t('militaryTraining.tabs.about', 'О факультете'), icon: '🎖️' },
    { id: 'programs', label: t('militaryTraining.tabs.programs', 'Программы'), icon: '⚔️' },
    { id: 'specialties', label: t('militaryTraining.tabs.specialties', 'Специальности'), icon: '🎯' },
    { id: 'facilities', label: t('militaryTraining.tabs.facilities', 'Объекты'), icon: '🏹' },
    { id: 'command', label: t('militaryTraining.tabs.command', 'Командование'), icon: '👨‍✈️' },
    { id: 'contacts', label: t('militaryTraining.tabs.contacts', 'Контакты'), icon: '📞' }
  ];

  const toggleSpecialty = (index) => {
    setExpandedSpecialty(expandedSpecialty === index ? null : index);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон с военными элементами */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Военные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">⚔️</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🛡️</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🎯</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🎖️</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            🎖️
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {faculty.name || t('militaryTraining.name', 'Военная подготовка')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {faculty.fullDescription || t('militaryTraining.fullDescription', 'Профессиональная военная подготовка для будущих офицеров')}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
        >
          {(faculty.stats || [
            { value: '500+', label: t('militaryTraining.stats.cadets', 'Курсантов'), icon: '🎖️' },
            { value: '15+', label: t('militaryTraining.stats.programs', 'Программ'), icon: '⚔️' },
            { value: '25', label: t('militaryTraining.stats.teachers', 'Преподавателей'), icon: '🏅' },
            { value: '10', label: t('militaryTraining.stats.specialties', 'Специальностей'), icon: '🎯' }
          ]).map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-blue-200 text-sm lg:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
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
                      <h3 className="text-2xl font-bold text-white">
                        {t('militaryTraining.about.title', 'Военная подготовка')}
                      </h3>
                      <p className="text-blue-100 text-lg leading-relaxed">
                        {faculty.about?.description || t('militaryTraining.about.description', 'Профессиональная военная подготовка, сочетающая теоретические знания с практическими навыками для подготовки квалифицированных офицеров.')}
                      </p>
                      <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 border border-white/10">
                        <h4 className="text-xl font-bold text-white mb-4">
                          {t('militaryTraining.about.featuresTitle', 'Особенности подготовки')}
                        </h4>
                        <ul className="space-y-3">
                          {(faculty.about?.features || [
                            t('militaryTraining.about.features.0', 'Современные методы обучения'),
                            t('militaryTraining.about.features.1', 'Практические тренировки'),
                            t('militaryTraining.about.features.2', 'Профессиональные преподаватели'),
                            t('militaryTraining.about.features.3', 'Современное оборудование')
                          ]).map((feature, index) => (
                            <motion.li 
                              key={index} 
                              className="flex items-center text-blue-100"
                              whileHover={{ x: 5 }}
                            >
                              <span className="text-emerald-400 mr-3 text-lg">✓</span>
                              {feature}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-white/10">
                        <h4 className="text-xl font-bold text-white mb-4">
                          {t('militaryTraining.ranks.title', 'Воинские звания')}
                        </h4>
                        <div className="space-y-3">
                          {(faculty.ranks || [
                            { 
                              name: t('militaryTraining.ranks.cadet', 'Курсант'), 
                              category: t('militaryTraining.ranks.cadetCategory', 'Начальная подготовка') 
                            },
                            { 
                              name: t('militaryTraining.ranks.juniorLieutenant', 'Младший лейтенант'), 
                              category: t('militaryTraining.ranks.juniorLieutenantCategory', 'Выпускное звание') 
                            },
                            { 
                              name: t('militaryTraining.ranks.lieutenant', 'Лейтенант'), 
                              category: t('militaryTraining.ranks.lieutenantCategory', 'Первое офицерское') 
                            }
                          ]).map((rank, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
                              whileHover={{ scale: 1.02 }}
                            >
                              <span className="text-white font-medium">{rank.name}</span>
                              <span className="text-emerald-400 text-sm font-medium">{rank.category}</span>
                            </motion.div>
                          ))}
                        </div>
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
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {(faculty.programs || []).map((program, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedProgram(index)}
                        className={`text-left p-6 rounded-2xl transition-all duration-300 border backdrop-blur-sm ${
                          selectedProgram === index
                            ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white border-transparent shadow-lg'
                            : 'bg-white/5 text-blue-200 border-white/10 hover:border-emerald-400/30'
                        }`}
                      >
                        <div className="text-2xl mb-3">{program.icon || '⚔️'}</div>
                        <h4 className="font-bold text-lg mb-2">{program.name}</h4>
                        <p className="text-sm opacity-80">{program.duration}</p>
                      </motion.button>
                    ))}
                  </div>

                  {/* Program Details */}
                  {faculty.programs?.[selectedProgram] && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-8 border border-white/10"
                    >
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-4">
                            {faculty.programs[selectedProgram].name}
                          </h3>
                          <p className="text-blue-100 mb-6">
                            {faculty.programs[selectedProgram].description}
                          </p>
                          <div className="space-y-4">
                            <div className="flex items-center text-blue-100">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center text-white mr-3">
                                ⏱️
                              </div>
                              {t('militaryTraining.programs.duration', 'Длительность')}: {faculty.programs[selectedProgram].duration}
                            </div>
                            <div className="flex items-center text-blue-100">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center text-white mr-3">
                                🎓
                              </div>
                              {t('militaryTraining.programs.format', 'Форма')}: {faculty.programs[selectedProgram].format}
                            </div>
                            <div className="flex items-center text-blue-100">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center text-white mr-3">
                                ⚔️
                              </div>
                              {t('militaryTraining.programs.specialization', 'Специализация')}: {faculty.programs[selectedProgram].specialization}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-4">
                            {t('militaryTraining.programs.subjects', 'Дисциплины')}
                          </h4>
                          <div className="grid gap-3">
                            {faculty.programs[selectedProgram].subjects.map((subject, index) => (
                              <motion.div 
                                key={index} 
                                className="bg-white/5 rounded-xl px-4 py-3 text-blue-100 border border-white/10 text-sm backdrop-blur-sm"
                                whileHover={{ scale: 1.02 }}
                              >
                                {subject}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Specialties Tab */}
              {activeTab === 'specialties' && (
                <motion.div
                  key="specialties"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid gap-4">
                    {(faculty.specialties || []).map((specialty, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-emerald-400/30 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                        onClick={() => toggleSpecialty(index)}
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                                <span className="text-xl">{specialty.icon || '🎯'}</span>
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-white">{specialty.name}</h4>
                                <p className="text-emerald-400 font-medium">{specialty.category}</p>
                              </div>
                            </div>
                            <motion.button 
                              className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 text-blue-200 flex items-center justify-center hover:bg-white/20 transition-colors"
                              animate={{ rotate: expandedSpecialty === index ? 180 : 0 }}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </motion.button>
                          </div>
                          
                          <AnimatePresence>
                            {expandedSpecialty === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-6 space-y-4"
                              >
                                <p className="text-blue-100 leading-relaxed">
                                  {specialty.description}
                                </p>
                                <div>
                                  <h5 className="font-semibold text-white mb-3">
                                    {t('militaryTraining.specialties.skills', 'Ключевые навыки')}:
                                  </h5>
                                  <div className="flex flex-wrap gap-2">
                                    {specialty.skills.map((skill, i) => (
                                      <span key={i} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium backdrop-blur-sm">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Facilities Tab */}
              {activeTab === 'facilities' && (
                <motion.div
                  key="facilities"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6">
                        {t('militaryTraining.facilities.title', 'Учебные объекты')}
                      </h3>
                      <div className="space-y-4">
                        {(faculty.facilities || []).map((facility, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 backdrop-blur-sm"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                              <span className="text-lg">{facility.icon || '🏹'}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-white mb-1">{facility.name}</h4>
                              <p className="text-blue-200 text-sm mb-2">{facility.description}</p>
                              <p className="text-emerald-400 text-xs font-medium">{facility.equipment}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-white/10">
                      <h3 className="text-2xl font-bold text-white mb-6">
                        {t('militaryTraining.trainingPrograms.title', 'Тренировочные программы')}
                      </h3>
                      <div className="space-y-4">
                        {(faculty.trainingPrograms || []).map((program, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">{program.name}</span>
                              <span className="text-emerald-400 text-sm font-medium">{program.duration}</span>
                            </div>
                            <p className="text-blue-200 text-sm">{program.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Command Tab */}
              {activeTab === 'command' && (
                <motion.div
                  key="command"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Активный офицер */}
                  {faculty.command?.[activeOfficer] && (
                    <motion.div
                      key={activeOfficer}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-8 backdrop-blur-sm border border-white/20 mb-8"
                    >
                      <div className="flex flex-col lg:flex-row gap-8 items-center">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                            {faculty.command[activeOfficer].avatar || '👨‍✈️'}
                          </div>
                        </div>
                        <div className="flex-1 text-center lg:text-left">
                          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                            {faculty.command[activeOfficer].name}
                          </h3>
                          <p className="text-emerald-400 text-lg font-medium mb-2">{faculty.command[activeOfficer].rank}</p>
                          <p className="text-blue-200 mb-3">{faculty.command[activeOfficer].position}</p>
                          <p className="text-blue-100 text-sm mb-4">{faculty.command[activeOfficer].education}</p>
                          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                            {faculty.command[activeOfficer].specializations.map((spec, i) => (
                              <span key={i} className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm">
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Все офицеры */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(faculty.command || []).map((officer, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white/5 rounded-2xl p-6 text-center border backdrop-blur-sm transition-all duration-300 ${
                          activeOfficer === index
                            ? 'border-emerald-400/50 bg-white/10 shadow-lg'
                            : 'border-white/10 hover:border-emerald-400/30'
                        }`}
                        onClick={() => setActiveOfficer(index)}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                          {officer.avatar || '👨‍✈️'}
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">{officer.name}</h4>
                        <p className="text-emerald-400 text-sm font-medium mb-2">{officer.rank}</p>
                        <p className="text-blue-200 text-sm mb-3">{officer.position}</p>
                        <p className="text-blue-100 text-xs mb-3">{officer.education}</p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {officer.specializations.map((spec, i) => (
                            <span key={i} className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs">
                              {spec}
                            </span>
                          ))}
                        </div>
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
                  className="grid md:grid-cols-2 gap-8"
                >
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">
                      {t('militaryTraining.contacts.title', 'Контакты')}
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(faculty.contacts || {
                        phone: t('militaryTraining.contacts.phone', '+7 (999) 123-45-67'),
                        email: t('militaryTraining.contacts.email', 'military@academy.edu'),
                        address: t('militaryTraining.contacts.address', 'ул. Военная, 123'),
                        workingHours: t('militaryTraining.contacts.workingHours', 'Пн-Пт: 9:00-18:00')
                      }).map(([key, value], index) => (
                        <motion.div 
                          key={key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 backdrop-blur-sm"
                          whileHover={{ scale: 1.02 }}
                        >
                          <span className="text-2xl text-emerald-400">
                            {key === 'phone' && '📞'}
                            {key === 'email' && '📧'}
                            {key === 'address' && '🏢'}
                            {key === 'workingHours' && '🕒'}
                          </span>
                          <div>
                            <div className="text-white font-medium">{value}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 border border-white/10">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {t('militaryTraining.dean.title', 'Начальник факультета')}
                    </h3>
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                        {(faculty.dean?.avatar || '👨‍✈️')}
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">{faculty.dean?.name || t('militaryTraining.dean.name', 'Иванов А.С.')}</h4>
                      <p className="text-emerald-400 mb-2 font-medium">{faculty.dean?.rank || t('militaryTraining.dean.rank', 'Полковник')}</p>
                      <p className="text-blue-200 text-sm mb-2">{faculty.dean?.position || t('militaryTraining.dean.position', 'Начальник факультета')}</p>
                      <p className="text-blue-100 text-sm mb-3">{faculty.dean?.education || t('militaryTraining.dean.education', 'Высшее военное образование')}</p>
                      <p className="text-white">{faculty.dean?.email || t('militaryTraining.dean.email', 'dean@academy.edu')}</p>
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

export default MilitaryTraining;