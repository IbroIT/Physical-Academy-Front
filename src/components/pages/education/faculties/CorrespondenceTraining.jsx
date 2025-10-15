import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const CorrespondenceTraining = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);

  // Получаем данные с проверками
  const faculty = t('correspondenceTraining', { returnObjects: true }) || {};
  
  // Функция для нормализации данных - гарантирует, что поля являются массивами
  const normalizeData = (data) => {
    const defaultFaculty = {
      name: t('correspondenceTraining.name', 'Заочное обучение'),
      fullDescription: t('correspondenceTraining.fullDescription', 'Современное дистанционное образование с использованием передовых технологий.'),
      badge: t('correspondenceTraining.badge', 'Дистанционное образование'),
      stats: Array.isArray(data.stats) ? data.stats : [
        { label: 'Студентов онлайн', value: '3000+', icon: '👨‍💻' },
        { label: 'Выпускников', value: '8000+', icon: '🎓' },
        { label: 'Преподавателей', value: '200+', icon: '👨‍🏫' },
        { label: 'Онлайн-курсов', value: '150+', icon: '📚' }
      ],
      about: {
        missionTitle: t('correspondenceTraining.about.missionTitle', 'Миссия факультета'),
        advantagesTitle: t('correspondenceTraining.about.advantagesTitle', 'Ключевые преимущества'),
        achievementsTitle: t('correspondenceTraining.about.achievementsTitle', 'Наши достижения'),
        mission: t('correspondenceTraining.about.mission', 'Обеспечение качественного дистанционного образования с использованием современных технологий.'),
        advantages: Array.isArray(data.about?.advantages) ? data.about.advantages : [
          'Гибкий график обучения',
          'Доступ к материалам 24/7',
          'Современные образовательные платформы'
        ],
        achievements: Array.isArray(data.about?.achievements) ? data.about.achievements : [
          { value: '95%', label: 'Успеваемость', icon: '📊' },
          { value: '50+', label: 'Партнеров', icon: '🤝' },
          { value: '10', label: 'Лет опыта', icon: '⭐' }
        ]
      },
      programs: Array.isArray(data.programs) ? data.programs : [
        {
          name: 'Бакалавриат',
          description: 'Фундаментальная подготовка по выбранной специальности',
          level: 'Бакалавр',
          duration: '4-4.5 года',
          format: 'Заочная',
          icon: '🎓'
        },
        {
          name: 'Магистратура',
          description: 'Углубленное изучение профессиональных дисциплин',
          level: 'Магистр',
          duration: '2-2.5 года',
          format: 'Заочная',
          icon: '📚'
        }
      ],
      technologies: Array.isArray(data.technologies) ? data.technologies : [
        {
          name: 'LMS платформы',
          description: 'Системы управления обучением',
          icon: '🖥️',
          features: ['Moodle', 'Canvas', 'Blackboard']
        }
      ],
      platforms: Array.isArray(data.platforms) ? data.platforms : [
        {
          name: 'Онлайн-платформа',
          description: 'Основная образовательная платформа',
          students: '95%',
          icon: '🌐'
        }
      ],
      learningProcess: Array.isArray(data.learningProcess) ? data.learningProcess : [
        {
          step: '1',
          title: 'Поступление',
          description: 'Подача документов и зачисление',
          duration: '1-2 недели',
          icon: '📝'
        }
      ],
      teachers: Array.isArray(data.teachers) ? data.teachers : [
        {
          name: 'Мария Иванова',
          position: 'Профессор',
          qualification: 'Доктор педагогических наук',
          avatar: 'МИ',
          specializations: ['Дистанционное образование', 'EdTech']
        }
      ],
      contacts: {
        phone: data.contacts?.phone || '+7 (495) 123-45-67',
        email: data.contacts?.email || 'distance@university.ru',
        address: data.contacts?.address || 'Москва, ул. Образовательная, д. 15',
        workingHours: data.contacts?.workingHours || 'Пн-Пт: 9:00-18:00',
        dean: {
          name: data.contacts?.dean?.name || 'Сергей Петров',
          position: data.contacts?.dean?.position || 'Декан факультета',
          degree: data.contacts?.dean?.degree || 'Доктор педагогических наук, профессор',
          email: data.contacts?.dean?.email || 'petrov@distance.ru',
          avatar: data.contacts?.dean?.avatar || 'СП'
        }
      }
    };

    return defaultFaculty;
  };

  // Нормализуем данные
  const facultyData = normalizeData(faculty);

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
    const targetValues = facultyData.stats.map(stat => parseInt(stat.value.replace(/\D/g, '')) || 0);
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

  const tabs = [
    { id: 'about', label: t('correspondenceTraining.tabs.about', 'О факультете'), icon: '🏢', color: 'from-blue-500 to-cyan-500' },
    { id: 'programs', label: t('correspondenceTraining.tabs.programs', 'Программы'), icon: '📚', color: 'from-green-500 to-emerald-500' },
    { id: 'technology', label: t('correspondenceTraining.tabs.technology', 'Технологии'), icon: '🖥️', color: 'from-blue-500 to-green-500' },
    { id: 'process', label: t('correspondenceTraining.tabs.process', 'Процесс обучения'), icon: '🔄', color: 'from-cyan-500 to-blue-500' },
    { id: 'contacts', label: t('correspondenceTraining.tabs.contacts', 'Контакты'), icon: '📞', color: 'from-emerald-500 to-green-500' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

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
        <div className="absolute bottom-1/4 right-1/3 text-5xl opacity-5">🔄</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
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
            className="inline-flex items-center px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 mb-6"
          >
            <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-blue-100 font-medium text-lg">
              {facultyData.badge}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {facultyData.name}
          </motion.h1>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-8 rounded-full"
          ></motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
          >
            {facultyData.fullDescription}
          </motion.p>
        </motion.div>

        {/* Dynamic Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 lg:mb-20"
        >
          {facultyData.stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group text-center relative overflow-hidden"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <motion.div 
                  className={`text-5xl mb-6 transition-transform duration-500 ${
                    hoveredCard === index ? 'scale-125 rotate-12' : 'group-hover:scale-110'
                  }`}
                  whileHover={{ scale: 1.2, rotate: 12 }}
                >
                  {stat.icon}
                </motion.div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-4 font-mono bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  {stat.value.includes('%') 
                    ? `${Math.round(counterValues[index])}%`
                    : stat.value.includes('+')
                    ? `${Math.round(counterValues[index])}+`
                    : Math.round(counterValues[index])
                  }
                </div>
                <div className="text-blue-100 font-medium text-lg">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="border-b border-white/20 bg-white/5">
            <div className="flex overflow-x-auto scrollbar-hide p-4">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 flex-shrink-0 px-8 py-4 font-bold text-lg transition-all duration-500 transform rounded-2xl mx-2 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl scale-105`
                      : 'text-blue-100 hover:text-white hover:bg-white/10 hover:shadow-lg'
                  }`}
                >
                  <span className={`text-2xl transition-transform duration-300 ${
                    activeTab === tab.id ? 'scale-110' : ''
                  }`}>
                    {tab.icon}
                  </span>
                  <span className="text-base lg:text-lg">{tab.label}</span>
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
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold text-white flex items-center">
                        <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mr-4 text-lg">🎯</span>
                        {facultyData.about.missionTitle}
                      </h3>
                      <p className="text-blue-100 text-lg leading-relaxed border-l-4 border-blue-500 pl-6 py-4 bg-white/5 rounded-r-2xl backdrop-blur-sm">
                        {facultyData.about.mission}
                      </p>
                      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
                        <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                          <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mr-3 text-sm">✨</span>
                          {facultyData.about.advantagesTitle}
                        </h4>
                        <ul className="space-y-4">
                          {facultyData.about.advantages.map((advantage, index) => (
                            <motion.li 
                              key={index} 
                              className="flex items-start group"
                              whileHover={{ x: 10 }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                              <span className="text-blue-100 text-lg group-hover:text-white transition-colors duration-300">{advantage}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-6 border border-emerald-500/20 backdrop-blur-sm">
                        <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                          <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center text-white mr-3 text-sm">🏆</span>
                          {facultyData.about.achievementsTitle}
                        </h4>
                        <div className="space-y-4">
                          {facultyData.about.achievements.map((achievement, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                              whileHover={{ scale: 1.02 }}
                            >
                              <span className="text-3xl text-emerald-400 group-hover:scale-110 transition-transform duration-300">{achievement.icon}</span>
                              <div>
                                <div className="text-white font-bold text-xl">{achievement.value}</div>
                                <div className="text-blue-200 text-lg">{achievement.label}</div>
                              </div>
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
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {facultyData.programs.map((program, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden backdrop-blur-sm"
                        onMouseEnter={() => setHoveredCard(`program-${index}`)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        {/* Background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                          <div className={`text-5xl mb-6 transition-transform duration-500 ${
                            hoveredCard === `program-${index}` ? 'scale-110 rotate-6' : 'group-hover:scale-105'
                          }`}>
                            {program.icon}
                          </div>
                          <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">{program.name}</h4>
                          <p className="text-blue-100 text-lg mb-6 leading-relaxed">{program.description}</p>
                          <div className="space-y-4 text-lg">
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                              <span className="text-blue-200">{t('correspondenceTraining.programs.level', 'Уровень')}:</span>
                              <span className="text-white font-semibold">{program.level}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                              <span className="text-blue-200">{t('correspondenceTraining.programs.duration', 'Длительность')}:</span>
                              <span className="text-white font-semibold">{program.duration}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                              <span className="text-blue-200">{t('correspondenceTraining.programs.format', 'Форма')}:</span>
                              <span className="text-white font-semibold">{program.format}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Technology Tab */}
              {activeTab === 'technology' && (
                <motion.div
                  key="technology"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="w-3 h-12 bg-gradient-to-b from-blue-400 to-cyan-400 rounded mr-4"></span>
                        {t('correspondenceTraining.technology.title', 'Технологии обучения')}
                      </h3>
                      <div className="space-y-4">
                        {facultyData.technologies.map((tech, index) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-500 transform hover:-translate-y-1 group backdrop-blur-sm"
                          >
                            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                              {tech.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-white text-xl mb-3 group-hover:text-cyan-300 transition-colors duration-300">{tech.name}</h4>
                              <p className="text-blue-100 text-lg mb-4">{tech.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {tech.features?.map((feature, i) => (
                                  <motion.span 
                                    key={i} 
                                    className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-2xl text-base font-medium hover:bg-blue-500/30 hover:scale-105 transition-all duration-300 cursor-default border border-blue-400/30"
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {feature}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="w-3 h-12 bg-gradient-to-b from-emerald-400 to-green-400 rounded mr-4"></span>
                        {t('correspondenceTraining.platforms.title', 'Образовательные платформы')}
                      </h3>
                      <div className="space-y-4">
                        {facultyData.platforms.map((platform, index) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-1 group backdrop-blur-sm"
                          >
                            <div className="flex items-center space-x-4">
                              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{platform.icon}</span>
                              <div>
                                <div className="text-white font-bold text-xl group-hover:text-emerald-300 transition-colors duration-300">{platform.name}</div>
                                <div className="text-blue-200 text-lg">{platform.description}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-white font-bold text-2xl">{platform.students}</div>
                              <div className="text-blue-300 text-base">{t('correspondenceTraining.platforms.usage', 'студентов')}</div>
                            </div>
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
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <h3 className="text-3xl font-bold text-white text-center mb-8 flex items-center justify-center">
                    <span className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white mr-4 text-lg">🔄</span>
                    {t('correspondenceTraining.learningProcess.title', 'Процесс обучения')}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {facultyData.learningProcess.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-cyan-400/30 transition-all duration-500 transform hover:-translate-y-2 group text-center relative overflow-hidden backdrop-blur-sm"
                        onMouseEnter={() => setHoveredCard(`process-${index}`)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        {/* Background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                          <div className={`text-5xl mb-4 transition-transform duration-500 ${
                            hoveredCard === `process-${index}` ? 'scale-110 rotate-6' : 'group-hover:scale-105'
                          }`}>
                            {step.icon}
                          </div>
                          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                            {step.step}
                          </div>
                          <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">{step.title}</h4>
                          <p className="text-blue-100 text-lg mb-4 leading-relaxed">{step.description}</p>
                          <div className="flex items-center justify-center text-cyan-400 text-lg font-medium">
                            <span className="mr-2">⏱️</span>
                            {step.duration}
                          </div>
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
                  transition={{ duration: 0.5 }}
                  className="grid lg:grid-cols-2 gap-8"
                >
                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold text-white flex items-center">
                      <span className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center text-white mr-4 text-lg">📞</span>
                      {t('correspondenceTraining.contacts.title', 'Контакты')}
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(facultyData.contacts).map(([key, value], index) => {
                        if (key === 'dean') return null;
                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center space-x-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 backdrop-blur-sm group"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                              {key === 'phone' && '📞'}
                              {key === 'email' && '📧'}
                              {key === 'address' && '🏢'}
                              {key === 'workingHours' && '🕒'}
                            </div>
                            <div>
                              <div className="text-white font-bold text-xl group-hover:text-emerald-300 transition-colors duration-300">{value}</div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl p-6 lg:p-8 border border-emerald-500/20 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <span className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center text-white mr-4 text-lg">👨‍💼</span>
                      {t('correspondenceTraining.leadership.title', 'Руководство')}
                    </h3>
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                        {facultyData.contacts.dean.avatar}
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-2">{facultyData.contacts.dean.name}</h4>
                      <p className="text-emerald-400 text-xl mb-2">{facultyData.contacts.dean.position}</p>
                      <p className="text-blue-100 text-lg mb-4">{facultyData.contacts.dean.degree}</p>
                      <motion.a 
                        href={`mailto:${facultyData.contacts.dean.email}`}
                        className="text-white text-lg bg-white/5 rounded-2xl py-3 px-6 backdrop-blur-sm inline-block hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-emerald-400/30"
                        whileHover={{ scale: 1.05 }}
                      >
                        {facultyData.contacts.dean.email}
                      </motion.a>
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