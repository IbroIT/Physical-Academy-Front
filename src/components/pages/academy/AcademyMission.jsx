// components/AcademyMission.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

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
      gradient: 'from-blue-500 to-emerald-500'
    },
    { 
      id: 'vision', 
      label: t('academy.mission.tabs.vision'), 
      icon: '🔭',
      gradient: 'from-emerald-500 to-blue-600'
    },
    { 
      id: 'values', 
      label: t('academy.mission.tabs.values'), 
      icon: '💎',
      gradient: 'from-blue-600 to-emerald-600'
    },
    { 
      id: 'strategy', 
      label: t('academy.mission.tabs.strategy'), 
      icon: '🚀',
      gradient: 'from-emerald-400 to-blue-500'
    }
  ];

  const values = t('academy.mission.values.list', { returnObjects: true });
  const strategicGoals = t('academy.mission.strategy.goals', { returnObjects: true });

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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'mission':
        return (
          <motion.div
            key="mission"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-3xl p-8 lg:p-12 backdrop-blur-lg border border-white/20 relative overflow-hidden group">
              {/* Анимированный фон */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl animate-bounce delay-1000"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex-shrink-0 w-24 h-24 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl"
                  >
                    🎯
                  </motion.div>
                  <div className="flex-1 text-center lg:text-left">
                    <motion.h3 
                      className="text-3xl lg:text-4xl font-bold text-white mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {t('academy.mission.missionTitle')}
                    </motion.h3>
                    <motion.p 
                      className="text-blue-100 text-xl lg:text-2xl leading-relaxed bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {t('academy.mission.missionStatement')}
                    </motion.p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'vision':
        return (
          <motion.div
            key="vision"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="bg-gradient-to-br from-emerald-500/10 to-blue-600/10 rounded-3xl p-8 lg:p-12 backdrop-blur-lg border border-white/20 relative overflow-hidden group">
              {/* Анимированный фон */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl animate-bounce delay-500"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="flex-shrink-0 w-24 h-24 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl flex items-center justify-center text-white text-4xl shadow-2xl"
                  >
                    🔭
                  </motion.div>
                  <div className="flex-1 text-center lg:text-left">
                    <motion.h3 
                      className="text-3xl lg:text-4xl font-bold text-white mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {t('academy.mission.visionTitle')}
                    </motion.h3>
                    <motion.p 
                      className="text-blue-100 text-xl lg:text-2xl leading-relaxed bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {t('academy.mission.visionStatement')}
                    </motion.p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'values':
        return (
          <motion.div
            key="values"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-6 lg:gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.id}
                variants={itemVariants}
                onMouseEnter={() => setHoveredValue(index)}
                onMouseLeave={() => setHoveredValue(null)}
                className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 lg:p-8 border border-white/10 hover:border-emerald-400/50 transition-all duration-500 group hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Анимированный фон при наведении */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${
                  value.color === 'blue' ? 'from-blue-500 to-blue-600' : 'from-emerald-500 to-emerald-600'
                }`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-start space-x-4 lg:space-x-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center text-2xl lg:text-3xl transition-all duration-500 ${
                        value.color === 'blue'
                          ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white' 
                          : 'bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white'
                      }`}
                    >
                      {value.icon}
                    </motion.div>
                    
                    <div className="flex-1">
                      <motion.h3 
                        className={`text-xl lg:text-2xl font-bold mb-3 lg:mb-4 transition-colors duration-300 ${
                          value.color === 'blue' 
                            ? 'text-white group-hover:text-blue-300' 
                            : 'text-white group-hover:text-emerald-300'
                        }`}
                      >
                        {value.title}
                      </motion.h3>
                      <motion.p 
                        className="text-blue-100 leading-relaxed text-lg lg:text-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        {value.description}
                      </motion.p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      case 'strategy':
        return (
          <motion.div
            key="strategy"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 lg:space-y-8"
          >
            {strategicGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 lg:p-8 border border-white/10 hover:border-blue-400/50 transition-all duration-500 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 space-y-6 lg:space-y-0">
                  {/* Иконка цели */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg"
                  >
                    {goal.icon}
                  </motion.div>
                  
                  {/* Контент цели */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 lg:mb-6">
                      <motion.h4 
                        className="font-bold text-white text-xl lg:text-2xl mb-2 lg:mb-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {goal.goal}
                      </motion.h4>
                      <motion.span 
                        className="text-emerald-300 font-semibold bg-emerald-500/20 px-4 py-2 rounded-full text-sm lg:text-base whitespace-nowrap"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      >
                        {goal.timeline}
                      </motion.span>
                    </div>
                    
                    {/* Прогресс бар */}
                    <motion.div 
                      className="mb-4 lg:mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                    >
                      <div className="flex justify-between text-blue-200 text-sm lg:text-base mb-2">
                        <span>{t('academy.mission.strategy.progress')}</span>
                        <span className="text-emerald-300 font-semibold">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-3 lg:h-4 backdrop-blur-sm">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${goal.progress}%` }}
                          transition={{ duration: 1.5, delay: index * 0.2 + 0.5 }}
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 lg:h-4 rounded-full shadow-lg"
                        ></motion.div>
                      </div>
                    </motion.div>
                    
                    {/* Метрики */}
                    <motion.ul 
                      className="space-y-2 lg:space-y-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      {goal.metrics.map((metric, idx) => (
                        <motion.li 
                          key={idx}
                          className="flex items-start group"
                          whileHover={{ x: 10 }}
                        >
                          <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 lg:mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                          <span className="text-blue-100 text-lg lg:text-xl">{metric}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон с частицами */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-bounce delay-1500"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
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
            className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 mb-6"
          >
            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-emerald-300 font-medium text-sm lg:text-base">
              {t('academy.mission.badge')}
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {t('academy.mission.title')}
          </motion.h2>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"
          ></motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
          >
            {t('academy.mission.subtitle')}
          </motion.p>
        </motion.div>

        {/* Навигационные табы */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 lg:gap-4 mb-12 lg:mb-16"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex items-center space-x-3 px-6 lg:px-8 py-3 lg:py-4 rounded-2xl font-semibold transition-all duration-500 backdrop-blur-sm border ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.gradient} text-white shadow-2xl scale-105 border-transparent`
                  : 'bg-white/5 text-blue-100 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <motion.span
                className={`text-2xl transition-transform duration-300 ${
                  activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'
                }`}
              >
                {tab.icon}
              </motion.span>
              <span className="text-base lg:text-lg whitespace-nowrap">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Основной контент */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl mb-16"
        >
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AcademyMission;