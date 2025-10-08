import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const EbilimLogin = () => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);

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

  useEffect(() => {
    if (isVisible) {
      startCounters();
    }
  }, [isVisible]);

  const startCounters = () => {
    const stats = t('students.ebilim.stats', { returnObjects: true }) || [];
    const targetValues = stats.map(stat => parseInt(stat.value.replace(/\D/g, '')) || 0);
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

  const stats = t('students.ebilim.stats', { returnObjects: true }) || [];
  const quickLinks = t('students.ebilim.quickLinks', { returnObjects: true }) || [];

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 rounded-3xl p-6 lg:p-8 text-white mb-8 mx-auto shadow-2xl border border-white/20 backdrop-blur-sm overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-4 left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-4 right-4 w-24 h-24 bg-emerald-500/15 rounded-full blur-2xl animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Образовательные символы */}
        <div className="absolute top-1/4 right-1/4 text-4xl opacity-5">🎓</div>
        <div className="absolute bottom-1/3 left-1/4 text-3xl opacity-5">📚</div>
        <div className="absolute top-1/2 left-1/2 text-2xl opacity-5">💻</div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <motion.div 
              className="flex items-start mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white mr-4 shadow-lg">
                <span className="text-2xl">🎓</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  {t('students.ebilim.title', 'Электронное обучение')}
                </h2>
                <p className="text-blue-100 text-lg leading-relaxed">
                  {t('students.ebilim.description', 'Доступ к образовательным ресурсам и онлайн-курсам')}
                </p>
              </div>
            </motion.div>
            
            {/* Быстрые ссылки */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6"
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickLinks.map((link, index) => (
                      <motion.a
                        key={index}
                        href={link.url}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                      >
                        <div className="text-2xl mb-2 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                          {link.icon}
                        </div>
                        <div className="text-white font-medium text-sm">{link.name}</div>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.button 
              onClick={() => setIsExpanded(!isExpanded)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/10 backdrop-blur-sm text-white px-5 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center text-base"
            >
              <span className="mr-2 text-lg">{isExpanded ? '📋' : '🔍'}</span>
              {isExpanded 
                ? t('students.ebilim.hideLinks', 'Скрыть ссылки') 
                : t('students.ebilim.showLinks', 'Быстрые ссылки')
              }
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-lg flex items-center justify-center text-base"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {t('students.ebilim.button', 'Войти в систему')}
            </motion.button>
          </motion.div>
        </div>
        
        {/* Статистика */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="text-center group"
            >
              <div className="text-2xl lg:text-3xl font-bold text-white mb-1 font-mono bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                {stat.value.includes('%') 
                  ? `${Math.round(counterValues[index])}%`
                  : stat.value.includes('+')
                  ? `${Math.round(counterValues[index])}+`
                  : Math.round(counterValues[index])
                }
              </div>
              <div className="text-blue-200 text-sm font-medium group-hover:text-white transition-colors duration-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Дополнительная информация */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-white/10 text-sm text-blue-200"
        >
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            <span>{t('students.ebilim.status.online', 'Система работает стабильно')}</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
            <span>{t('students.ebilim.status.updates', 'Последнее обновление: сегодня')}</span>
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
            <span>{t('students.ebilim.status.support', 'Техническая поддержка 24/7')}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EbilimLogin;