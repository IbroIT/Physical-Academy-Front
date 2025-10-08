import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const WebOfScience = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('5years');
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState({});
  const [activeMetric, setActiveMetric] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => {
            setData(t('science.sections.webofscience', { returnObjects: true }));
            setLoading(false);
            startCounters();
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [t]);

  // Автопереключение метрик и категорий
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric(prev => (prev + 1) % (data?.metrics[timeRange]?.main ? Object.keys(data.metrics[timeRange].main).length : 1));
      setActiveCategory(prev => (prev + 1) % (data?.metrics[timeRange]?.categories?.length || 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [timeRange, data]);

  const startCounters = () => {
    if (!data) return;
    
    const filteredData = data.metrics[timeRange];
    const targetValues = {};
    
    Object.entries(filteredData.main).forEach(([key, metric]) => {
      targetValues[key] = parseInt(metric.value.replace(/\D/g, ''));
    });

    const duration = 2000;
    const steps = 60;
    const stepValues = {};

    Object.keys(targetValues).forEach(key => {
      stepValues[key] = targetValues[key] / steps;
    });

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      setCounterValues(prev => {
        const newValues = { ...prev };
        Object.keys(targetValues).forEach(key => {
          if (currentStep <= steps) {
            newValues[key] = Math.min(
              (prev[key] || 0) + stepValues[key],
              targetValues[key]
            );
          }
        });
        return newValues;
      });

      if (currentStep >= steps) {
        clearInterval(counterInterval);
      }
    }, duration / steps);
  };

  useEffect(() => {
    if (data) {
      startCounters();
    }
  }, [timeRange, data]);

  if (loading) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-blue-200">{t('science.sections.webofscience.loading')}</p>
        </motion.div>
      </section>
    );
  }

  const filteredData = data.metrics[timeRange];
  const mainMetrics = Object.entries(filteredData.main);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон с научными элементами */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Научные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🔬</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">📊</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🌍</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🏅</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
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
            {data.titleIcon}
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {data.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Time Range Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-12 lg:mb-16"
        >
          <div className="bg-white/5 rounded-2xl p-2 backdrop-blur-lg border border-white/20 shadow-2xl">
            {Object.keys(data.metrics).map((range) => (
              <motion.button
                key={range}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTimeRange(range)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-500 ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                    : 'text-blue-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                {data.timeRanges[range]}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12 lg:mb-16">
          {/* Активная метрика */}
          {mainMetrics[activeMetric] && (
            <motion.div
              key={activeMetric}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                  {mainMetrics[activeMetric][1].icon}
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {mainMetrics[activeMetric][1].label}
                  </h3>
                  <div className="text-4xl lg:text-5xl font-bold text-emerald-400 font-mono mb-2">
                    {counterValues[mainMetrics[activeMetric][0]] 
                      ? Math.round(counterValues[mainMetrics[activeMetric][0]]).toLocaleString()
                      : '0'
                    }
                    {mainMetrics[activeMetric][1].value.includes('%') && '%'}
                  </div>
                  <p className="text-blue-200 text-lg">
                    {mainMetrics[activeMetric][1].description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Все метрики */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4">
            {mainMetrics.map(([key, metric], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                  activeMetric === index
                    ? 'border-emerald-400/50 bg-white/10 shadow-lg'
                    : 'border-white/10 hover:border-emerald-400/30'
                }`}
                onClick={() => setActiveMetric(index)}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-2xl mb-3">{metric.icon}</div>
                <div className="text-2xl font-bold text-emerald-400 mb-1 font-mono">
                  {counterValues[key] 
                    ? Math.round(counterValues[key]).toLocaleString()
                    : '0'
                  }
                  {metric.value.includes('%') && '%'}
                </div>
                <div className="text-blue-200 text-sm">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Publications by Category */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">
                {data.categoriesIcon}
              </span>
              {data.categoriesTitle}
            </h3>
            <div className="space-y-4">
              {filteredData.categories.map((category, index) => {
                const maxCount = Math.max(...filteredData.categories.map(c => c.count));
                const percentage = (category.count / maxCount) * 100;
                
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                      activeCategory === index
                        ? 'bg-white/10 border-emerald-400/30'
                        : 'bg-white/5 border-white/10 hover:border-emerald-400/30'
                    }`}
                    onClick={() => setActiveCategory(index)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-white text-lg font-medium flex-1">{category.name}</span>
                    <div className="flex items-center space-x-4 flex-1 max-w-xs">
                      <div className="w-full bg-white/10 rounded-full h-3">
                        <motion.div 
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full shadow-lg"
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        ></motion.div>
                      </div>
                      <span className="font-bold text-emerald-400 w-12 text-right text-lg">
                        {category.count}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* International Collaboration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">
                {data.collaborationsIcon}
              </span>
              {data.collaborationsTitle}
            </h3>
            <div className="space-y-4">
              {filteredData.collaborations.map((collab, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group backdrop-blur-sm"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{collab.flag}</span>
                    <div>
                      <span className="font-semibold text-white text-lg group-hover:text-emerald-300 transition-colors duration-300">
                        {collab.country}
                      </span>
                      <div className="text-blue-200 text-sm">
                        {collab.institutions} {data.collaborationsInstitutions}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold text-xl">{collab.publications}</div>
                    <div className="text-blue-300 text-sm">{data.collaborationsPublications}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Q1/Q2 Journals */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 text-white shadow-2xl mb-12 backdrop-blur-lg border border-white/20"
        >
          <h3 className="text-2xl font-bold mb-8 flex items-center justify-center">
            <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
              {data.topJournalsIcon}
            </span>
            {data.topJournalsTitle}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filteredData.topJournals.map((journal, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 group border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 text-emerald-400">
                  {journal.count}
                </div>
                <div className="text-blue-200 text-lg font-medium mb-1">{journal.quartile}</div>
                <div className="text-white/80 text-sm">{data.topJournalsPublications}</div>
                <div className="w-0 group-hover:w-full h-1 bg-emerald-400/50 transition-all duration-500 mt-2 mx-auto"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {data.additionalMetrics.map((metric, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="bg-white/5 rounded-3xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 text-emerald-400">
                {metric.icon}
              </div>
              <div className="text-2xl font-bold text-white mb-2">{filteredData[metric.key]}</div>
              <div className="text-blue-200 font-semibold text-lg mb-2">{metric.title}</div>
              <div className="text-blue-300 text-sm">{metric.description}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WebOfScience;