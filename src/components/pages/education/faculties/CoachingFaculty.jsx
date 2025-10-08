import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const CoachingFaculty = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [selectedProgram, setSelectedProgram] = useState(0);
  const [expandedDepartment, setExpandedDepartment] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const faculty = t('coachingFaculty', { returnObjects: true });

  const tabs = [
    { id: 'about', label: t('education.tabs.about', 'О факультете'), icon: '🏛️' },
    { id: 'programs', label: t('education.tabs.programs', 'Программы'), icon: '📚' },
    { id: 'departments', label: t('education.tabs.departments', 'Кафедры'), icon: '🏢' },
    { id: 'coaches', label: t('coachingFaculty.tabs.coaches', 'Преподаватели'), icon: '👨‍🏫' },
    { id: 'achievements', label: t('coachingFaculty.tabs.achievements', 'Достижения'), icon: '🏆' },
    { id: 'contacts', label: t('education.tabs.contacts', 'Контакты'), icon: '📞' }
  ];

  // Автопереключение программ
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'programs') {
        setSelectedProgram((prev) => (prev + 1) % faculty.educationPrograms.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeTab, faculty.educationPrograms.length]);

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
        
        {/* Спортивные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏆</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">⚽</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🎯</div>
        <div className="absolute top-2/3 right-1/3 text-5xl opacity-5">🏃‍♂️</div>
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
            🏅
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {faculty.name}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {faculty.fullDescription}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
        >
          {faculty.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
            >
              <div className="text-3xl mb-3 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors duration-300">
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
                        {faculty.about.missionTitle}
                      </h3>
                      <p className="text-blue-100 text-lg leading-relaxed">{faculty.about.mission}</p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-emerald-400/20">
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                        <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mr-3">
                          ✨
                        </div>
                        Особенности
                      </h4>
                      <ul className="space-y-3">
                        {faculty.about.features.map((feature, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center text-blue-100"
                          >
                            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Specializations */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mr-4">
                        🎯
                      </div>
                      Основные специализации
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {faculty.specializations.map((spec, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group cursor-pointer"
                        >
                          <div className="text-2xl mb-3 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                            {spec.icon}
                          </div>
                          <h4 className="font-bold text-white text-lg mb-2">{spec.name}</h4>
                          <p className="text-blue-200 text-sm">{spec.description}</p>
                        </motion.div>
                      ))}
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
                  <div className="grid lg:grid-cols-4 gap-4 mb-8">
                    {faculty.educationPrograms.map((program, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedProgram(index)}
                        className={`text-left p-5 rounded-xl transition-all duration-300 border backdrop-blur-sm ${
                          selectedProgram === index
                            ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white border-transparent shadow-lg'
                            : 'bg-white/5 text-blue-100 border-white/10 hover:border-emerald-400/30'
                        }`}
                      >
                        <div className="text-2xl mb-3">{program.icon}</div>
                        <h4 className="font-bold text-sm mb-1">{program.name}</h4>
                        <p className="text-xs opacity-90">{program.level}</p>
                      </motion.button>
                    ))}
                  </div>

                  {/* Program Details */}
                  <AnimatePresence mode="wait">
                    {faculty.educationPrograms[selectedProgram] && (
                      <motion.div
                        key={selectedProgram}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 lg:p-8 border border-emerald-400/20"
                      >
                        <div className="grid lg:grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                              {faculty.educationPrograms[selectedProgram].name}
                            </h3>
                            <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                              {faculty.educationPrograms[selectedProgram].description}
                            </p>
                            <div className="space-y-4">
                              <div className="flex items-center text-blue-100">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mr-4">
                                  ⏱️
                                </div>
                                Длительность: {faculty.educationPrograms[selectedProgram].duration}
                              </div>
                              <div className="flex items-center text-blue-100">
                                <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mr-4">
                                  🎓
                                </div>
                                Форма: {faculty.educationPrograms[selectedProgram].format}
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-white mb-4">Основные дисциплины</h4>
                            <div className="grid gap-3">
                              {faculty.educationPrograms[selectedProgram].subjects.map((subject, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="bg-white/5 rounded-lg px-4 py-3 text-blue-100 border border-white/10 text-sm backdrop-blur-sm hover:border-emerald-400/30 transition-all duration-300"
                                >
                                  {subject}
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Departments Tab */}
              {activeTab === 'departments' && (
                <motion.div
                  key="departments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid lg:grid-cols-2 gap-6"
                >
                  {faculty.departments.map((department, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 cursor-pointer backdrop-blur-sm"
                      onClick={() => setExpandedDepartment(expandedDepartment === index ? null : index)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white">
                            {department.name}
                          </h3>
                          <p className="text-blue-200 text-sm mt-1">{department.field}</p>
                        </div>
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-lg ml-4">
                          {department.icon}
                        </div>
                      </div>
                      <p className="text-blue-100 text-sm leading-relaxed mb-4">{department.description}</p>
                      
                      <AnimatePresence>
                        {expandedDepartment === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-white/10 space-y-3"
                          >
                            <div className="flex items-center text-blue-100">
                              <div className="w-6 h-6 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 mr-3">
                                👤
                              </div>
                              <span className="text-sm">{department.head}</span>
                            </div>
                            <div className="flex items-center text-blue-100">
                              <div className="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 mr-3">
                                📧
                              </div>
                              <span className="text-sm">{department.email}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-emerald-400 text-sm font-medium">
                          {expandedDepartment === index ? 'Скрыть детали' : 'Подробнее'}
                        </span>
                        <motion.div
                          animate={{ rotate: expandedDepartment === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <svg className="w-5 h-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Coaches Tab */}
              {activeTab === 'coaches' && (
                <motion.div
                  key="coaches"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {faculty.coaches.map((coach, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:border-emerald-400/30 transition-all duration-300 backdrop-blur-sm"
                      >
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-lg">
                          {coach.avatar}
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">{coach.name}</h4>
                        <p className="text-emerald-400 text-sm font-medium mb-2">{coach.position}</p>
                        <p className="text-blue-200 text-xs mb-4">{coach.qualification}</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {coach.specializations.map((spec, i) => (
                            <span key={i} className="px-3 py-1 bg-emerald-500/20 rounded-full text-emerald-300 text-xs backdrop-blur-sm">
                              {spec}
                            </span>
                          ))}
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
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl p-6 lg:p-8 border border-blue-400/20">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mr-4">
                          🏆
                        </div>
                        Достижения выпускников
                      </h3>
                      <div className="space-y-6">
                        {faculty.achievements.graduates.map((achievement, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-4"
                          >
                            <div className="flex-shrink-0 w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                              {achievement.icon}
                            </div>
                            <div>
                              <h4 className="font-bold text-white text-lg">{achievement.title}</h4>
                              <p className="text-blue-100 text-sm mt-2">{achievement.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl p-6 lg:p-8 border border-emerald-400/20">
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mr-4">
                          ⭐
                        </div>
                        Спортивные успехи
                      </h3>
                      <div className="space-y-4">
                        {faculty.achievements.sports.map((sport, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm hover:border-emerald-400/30 transition-all duration-300"
                          >
                            <span className="text-white font-medium">{sport.discipline}</span>
                            <span className="text-emerald-400 font-bold text-lg">{sport.medals}</span>
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
                  transition={{ duration: 0.3 }}
                  className="grid lg:grid-cols-2 gap-8"
                >
                  <div className="space-y-6">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white flex items-center">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mr-4">
                        📞
                      </div>
                      Контакты
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(faculty.contacts).map(([key, value], index) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm hover:border-emerald-400/30 transition-all duration-300"
                        >
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                            {key === 'phone' && '📞'}
                            {key === 'email' && '📧'}
                            {key === 'address' && '🏢'}
                            {key === 'workingHours' && '🕒'}
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
                      Декан факультета
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

export default CoachingFaculty;