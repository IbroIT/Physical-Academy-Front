import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const CoachingFaculty = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);

  // Получаем данные с проверками
  const faculty = t('coachingFaculty', { returnObjects: true }) || {};
  
  // Функция для нормализации данных
  const normalizeData = (data) => {
    const defaultFaculty = {
      name: t('coachingFaculty.name', 'Факультет тренерского мастерства'),
      fullDescription: t('coachingFaculty.fullDescription', 'Подготовка высококвалифицированных тренеров и специалистов в области спорта.'),
      badge: t('coachingFaculty.badge', 'Тренерское образование'),
      stats: Array.isArray(data.stats) ? data.stats : [
        { label: 'Студентов', value: '1500+', icon: '👨‍🎓' },
        { label: 'Выпускников', value: '3000+', icon: '🎓' },
        { label: 'Преподавателей', value: '120+', icon: '👨‍🏫' },
        { label: 'Спортивных программ', value: '15+', icon: '🏆' }
      ],
      about: {
        missionTitle: t('coachingFaculty.about.missionTitle', 'Миссия факультета'),
        featuresTitle: t('coachingFaculty.about.featuresTitle', 'Ключевые особенности'),
        mission: t('coachingFaculty.about.mission', 'Подготовка профессиональных тренеров и специалистов в области физической культуры и спорта.'),
        features: Array.isArray(data.about?.features) ? data.about.features : [
          'Современные методики тренировок',
          'Практическая подготовка',
          'Международные стандарты'
        ]
      },
      specializations: Array.isArray(data.specializations) ? data.specializations : [
        {
          name: 'Спортивная подготовка',
          description: 'Методики спортивной тренировки и подготовки спортсменов',
          icon: '🏃‍♂️'
        }
      ],
      educationPrograms: Array.isArray(data.educationPrograms) ? data.educationPrograms : [
        {
          name: 'Бакалавриат',
          description: 'Фундаментальная подготовка по тренерским дисциплинам',
          level: 'Бакалавр',
          duration: '4 года',
          format: 'Очная',
          icon: '🎓',
          subjects: ['Теория спорта', 'Методика тренировок', 'Спортивная психология']
        }
      ],
      departments: Array.isArray(data.departments) ? data.departments : [
        {
          name: 'Кафедра спортивных дисциплин',
          field: 'Спортивная подготовка',
          description: 'Подготовка специалистов в области спортивных дисциплин',
          icon: '⚽',
          head: 'Проф. Иванов А.С.',
          email: 'sports@coaching.ru'
        }
      ],
      coaches: Array.isArray(data.coaches) ? data.coaches : [
        {
          name: 'Петр Сидоров',
          position: 'Старший тренер',
          qualification: 'Мастер спорта международного класса',
          avatar: 'ПС',
          specializations: ['Футбол', 'Баскетбол']
        }
      ],
      achievements: {
        graduatesTitle: t('coachingFaculty.achievements.graduatesTitle', 'Достижения выпускников'),
        sportsTitle: t('coachingFaculty.achievements.sportsTitle', 'Спортивные достижения'),
        graduates: Array.isArray(data.achievements?.graduates) ? data.achievements.graduates : [
          {
            title: 'Чемпионы мира',
            description: 'Наши выпускники подготовили 50+ чемпионов мира',
            icon: '🏆'
          }
        ],
        sports: Array.isArray(data.achievements?.sports) ? data.achievements.sports : [
          { discipline: 'Футбол', medals: '25' }
        ]
      },
      contacts: {
        title: t('coachingFaculty.contacts.title', 'Контакты'),
        deanTitle: t('coachingFaculty.contacts.deanTitle', 'Декан факультета'),
        phone: {
          label: 'Телефон',
          value: data.contacts?.phone?.value || '+7 (495) 123-45-67',
          icon: '📞'
        },
        email: {
          label: 'Email',
          value: data.contacts?.email?.value || 'coaching@sports-academy.ru',
          icon: '📧'
        },
        address: {
          label: 'Адрес',
          value: data.contacts?.address?.value || 'Москва, ул. Тренерская, д. 15',
          icon: '📍'
        },
        dean: {
          name: data.contacts?.dean?.name || 'Сергей Козлов',
          position: data.contacts?.dean?.position || 'Декан факультета',
          degree: data.contacts?.dean?.degree || 'Доктор педагогических наук, профессор',
          email: data.contacts?.dean?.email || 'kozlov@coaching.ru',
          avatar: data.contacts?.dean?.avatar || 'СК'
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
    { id: 'about', label: t('coachingFaculty.tabs.about', 'О факультете'), icon: '🎯', color: 'from-blue-500 to-cyan-500' },
    { id: 'programs', label: t('coachingFaculty.tabs.programs', 'Программы'), icon: '📚', color: 'from-green-500 to-emerald-500' },
    { id: 'departments', label: t('coachingFaculty.tabs.departments', 'Кафедры'), icon: '🏢', color: 'from-purple-500 to-pink-500' },
    { id: 'coaches', label: t('coachingFaculty.tabs.coaches', 'Тренеры'), icon: '👨‍🏫', color: 'from-orange-500 to-red-500' },
    { id: 'achievements', label: t('coachingFaculty.tabs.achievements', 'Достижения'), icon: '🏆', color: 'from-yellow-500 to-amber-500' },
    { id: 'contacts', label: t('coachingFaculty.tabs.contacts', 'Контакты'), icon: '📞', color: 'from-indigo-500 to-purple-500' }
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

  // Определяем массив контактов для рендеринга
  const contactItems = [
    facultyData.contacts.phone,
    facultyData.contacts.email,
    facultyData.contacts.address
  ].filter(Boolean);

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
        
        {/* Спортивные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏆</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">⚽</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🎯</div>
        <div className="absolute top-2/3 right-1/3 text-5xl opacity-5">🏃‍♂️</div>
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
                          {facultyData.about.featuresTitle}
                        </h4>
                        <ul className="space-y-4">
                          {facultyData.about.features.map((feature, index) => (
                            <motion.li 
                              key={index} 
                              className="flex items-start group"
                              whileHover={{ x: 10 }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                              <span className="text-blue-100 text-lg group-hover:text-white transition-colors duration-300">{feature}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold text-white flex items-center">
                        <span className="w-3 h-12 bg-gradient-to-b from-emerald-400 to-green-400 rounded mr-4"></span>
                        {t('coachingFaculty.about.specializationsTitle', 'Специализации')}
                      </h3>
                      <div className="space-y-4">
                        {facultyData.specializations.map((spec, index) => (
                          <motion.div 
                            key={index} 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-1 group backdrop-blur-sm"
                          >
                            <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                              {spec.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-xl mb-3 group-hover:text-emerald-300 transition-colors duration-300">{spec.name}</h4>
                              <p className="text-blue-100 text-lg">{spec.description}</p>
                            </div>
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
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {facultyData.educationPrograms.map((program, index) => (
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
                              <span className="text-blue-200">Уровень:</span>
                              <span className="text-white font-semibold">{program.level}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                              <span className="text-blue-200">Длительность:</span>
                              <span className="text-white font-semibold">{program.duration}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                              <span className="text-blue-200">Форма:</span>
                              <span className="text-white font-semibold">{program.format}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Departments Tab */}
              {activeTab === 'departments' && (
                <motion.div
                  key="departments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    {facultyData.departments.map((department, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden backdrop-blur-sm"
                        onMouseEnter={() => setHoveredCard(`department-${index}`)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                                {department.name}
                              </h3>
                              <p className="text-blue-200 text-lg mt-2">{department.field}</p>
                            </div>
                            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl ml-4 group-hover:scale-110 transition-transform duration-300">
                              {department.icon}
                            </div>
                          </div>
                          <p className="text-blue-100 text-lg leading-relaxed mb-6">{department.description}</p>
                          
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                                👤
                              </div>
                              <div>
                                <div className="text-white font-semibold">Заведующий</div>
                                <div className="text-blue-200 text-sm">{department.head}</div>
                              </div>
                            </div>
                            <div className="text-purple-400 font-semibold">{department.email}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Coaches Tab */}
              {activeTab === 'coaches' && (
                <motion.div
                  key="coaches"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {facultyData.coaches.map((coach, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:border-orange-400/30 transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden backdrop-blur-sm"
                        onMouseEnter={() => setHoveredCard(`coach-${index}`)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                        
                        <div className="relative z-10">
                          <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            {coach.avatar}
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300">{coach.name}</h4>
                          <p className="text-orange-400 text-lg font-medium mb-2">{coach.position}</p>
                          <p className="text-blue-200 text-base mb-4">{coach.qualification}</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {coach.specializations.map((spec, i) => (
                              <motion.span 
                                key={i} 
                                className="px-3 py-1 bg-orange-500/20 rounded-2xl text-orange-300 text-sm backdrop-blur-sm hover:bg-orange-500/30 hover:scale-105 transition-all duration-300 cursor-default border border-orange-400/30"
                                whileHover={{ scale: 1.05 }}
                              >
                                {spec}
                              </motion.span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Achievements Tab */}
              {activeTab === 'achievements' && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl p-8 border border-blue-400/20 backdrop-blur-sm">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mr-4 text-lg">🏆</span>
                        {facultyData.achievements.graduatesTitle}
                      </h3>
                      <div className="space-y-6">
                        {facultyData.achievements.graduates.map((achievement, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-6 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-300 group"
                          >
                            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                              {achievement.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-xl mb-3 group-hover:text-cyan-300 transition-colors duration-300">{achievement.title}</h4>
                              <p className="text-blue-100 text-lg">{achievement.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-2xl p-8 border border-yellow-400/20 backdrop-blur-sm">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-2xl flex items-center justify-center text-white mr-4 text-lg">⭐</span>
                        {facultyData.achievements.sportsTitle}
                      </h3>
                      <div className="space-y-4">
                        {facultyData.achievements.sports.map((sport, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-yellow-400/30 transition-all duration-300 group"
                          >
                            <span className="text-white font-bold text-xl group-hover:text-yellow-300 transition-colors duration-300">{sport.discipline}</span>
                            <div className="text-right">
                              <span className="text-yellow-400 font-bold text-3xl">{sport.medals}</span>
                              <div className="text-yellow-300 text-base">медалей</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
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
                      <span className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mr-4 text-lg">📞</span>
                      {facultyData.contacts.title}
                    </h3>
                    <div className="space-y-4">
                      {contactItems.map((contact, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-6 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-indigo-400/30 transition-all duration-300 group backdrop-blur-sm"
                        >
                          <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                            {contact.icon}
                          </div>
                          <div>
                            <div className="text-white font-bold text-lg mb-1 group-hover:text-indigo-300 transition-colors duration-300">{contact.label}</div>
                            <div className="text-blue-200 text-lg">{contact.value}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-8 border border-indigo-400/20 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <span className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white mr-4 text-lg">👨‍💼</span>
                      {facultyData.contacts.deanTitle}
                    </h3>
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg group hover:scale-105 transition-transform duration-300">
                        {facultyData.contacts.dean.avatar}
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors duration-300">{facultyData.contacts.dean.name}</h4>
                      <p className="text-indigo-400 text-xl mb-3">{facultyData.contacts.dean.position}</p>
                      <p className="text-blue-100 text-lg mb-6">{facultyData.contacts.dean.degree}</p>
                      <div className="bg-white/5 rounded-2xl py-4 px-6 backdrop-blur-sm border border-white/10">
                        <p className="text-white text-lg font-semibold">{facultyData.contacts.dean.email}</p>
                      </div>
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

export default CoachingFaculty;