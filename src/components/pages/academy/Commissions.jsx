// Commissions.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Commissions = () => {
  const { t } = useTranslation();
  const [activeCommission, setActiveCommission] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [filter, setFilter] = useState('all');
  const sectionRef = useRef(null);

  // Получаем данные комиссий из i18n
  const commissions = t('commissions.list', { returnObjects: true });
  const filters = t('commissions.filters', { returnObjects: true });

  const filteredCommissions = filter === 'all' 
    ? commissions 
    : commissions.filter(commission => commission.category === filter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Автопереключение активной комиссии
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCommission((prev) => (prev + 1) % filteredCommissions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [filteredCommissions.length]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон с частицами */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Градиентные линии */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {t('commissions.title')}
          </motion.h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('commissions.subtitle')}
          </p>
        </motion.div>

        {/* Фильтры */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12 lg:mb-16"
        >
          {filters.map((filterItem) => (
            <button
              key={filterItem.id}
              onClick={() => setFilter(filterItem.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                filter === filterItem.id
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-2xl shadow-blue-500/30'
                  : 'bg-white/10 text-blue-100 backdrop-blur-sm border border-white/20 hover:bg-white/20'
              }`}
            >
              {filterItem.name}
            </button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Список комиссий */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {filteredCommissions.map((commission, index) => (
                <motion.div
                  key={commission.id}
                  layout
                  initial={{ opacity: 0, x: -50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`p-6 rounded-2xl backdrop-blur-lg border-2 transition-all duration-500 cursor-pointer group ${
                    activeCommission === index
                      ? 'bg-white/20 border-emerald-400 shadow-2xl scale-105'
                      : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-blue-300'
                  }`}
                  onMouseEnter={() => setActiveCommission(index)}
                  onClick={() => setActiveCommission(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold transition-all duration-300 group-hover:scale-110 ${
                      activeCommission === index 
                        ? 'bg-gradient-to-r from-emerald-500 to-blue-500 shadow-lg' 
                        : 'bg-gradient-to-r from-blue-600 to-emerald-600'
                    }`}>
                      {commission.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {commission.name}
                        </h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-blue-100 backdrop-blur-sm">
                          {commission.category}
                        </span>
                      </div>
                      <p className="text-blue-200 mt-2 line-clamp-2">
                        {commission.description}
                      </p>
                      
                      {/* Дополнительная информация при активности */}
                      <AnimatePresence>
                        {activeCommission === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 space-y-3"
                          >
                            <div className="flex flex-wrap gap-2">
                              {commission.tags.map((tag, tagIndex) => (
                                <span 
                                  key={tagIndex}
                                  className="px-3 py-1 bg-white/10 rounded-full text-sm text-blue-200 backdrop-blur-sm border border-white/10"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                              <div className="flex items-center space-x-4 text-sm text-blue-200">
                                <span className="flex items-center">
                                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                                  {commission.members} участников
                                </span>
                                <span className="flex items-center">
                                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                                  {commission.projects} проектов
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Детализация активной комиссии */}
          <motion.div
            key={activeCommission}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-8"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl">
              {filteredCommissions[activeCommission] && (
                <>
                  <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {filteredCommissions[activeCommission].icon}
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                      {filteredCommissions[activeCommission].name}
                    </h3>
                    <p className="text-emerald-300 text-lg">
                      {filteredCommissions[activeCommission].role}
                    </p>
                  </div>

                  {/* Прогресс-бары */}
                  <div className="space-y-4 mb-8">
                    {filteredCommissions[activeCommission].metrics.map((metric, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm text-blue-200">
                          <span>{metric.label}</span>
                          <span>{metric.value}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2 backdrop-blur-sm">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 shadow-lg"
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Контактная информация */}
                  <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                      Контактная информация
                    </h4>
                    <div className="space-y-3 text-blue-200">
                      <p>📧 {filteredCommissions[activeCommission].contact.email}</p>
                      <p>🏢 {filteredCommissions[activeCommission].contact.location}</p>
                      <p>👥 Руководитель: {filteredCommissions[activeCommission].contact.leader}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Commissions;