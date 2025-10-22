import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const WebOfScience = () => {
  const { t, i18n } = useTranslation();
  const [timeRange, setTimeRange] = useState('5years');
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState({});
  const [activeMetric, setActiveMetric] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  
  // Единое состояние для данных
  const [backendData, setBackendData] = useState({
    pageData: null,
    metrics: {},
    loading: true,
    error: null
  });

  const sectionRef = useRef(null);

  // Получение текущего языка для API
  const getApiLanguage = useCallback(() => {
    const langMap = {
      'en': 'en',
      'ru': 'ru',
      'kg': 'kg'
    };
    return langMap[i18n.language] || 'ru';
  }, [i18n.language]);

  // Функция для загрузки данных с бэкенда
  const fetchBackendData = useCallback(async () => {
    try {
      setBackendData(prev => ({ 
        ...prev, 
        loading: true, 
        error: null 
      }));
      
      const lang = getApiLanguage();
      console.log('Fetching data for language:', lang); // Для отладки
      
      const response = await fetch(`/api/science/wos-page/?lang=${lang}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid content type');
      }
      
      const data = await response.json();
      
      // Преобразуем данные из API в формат компонента
      const transformedData = transformApiData(data);
      
      setBackendData({
        pageData: transformedData.pageData,
        metrics: transformedData.metrics,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching Web of Science data:', error);
      setBackendData(prev => ({
        ...prev,
        loading: false,
        error: t('error.failed_to_load') || 'Failed to load Web of Science data'
      }));
    }
  }, [getApiLanguage, t]);

  // Преобразование данных API в формат компонента
  const transformApiData = (apiData) => {
    // Если API возвращает данные в ожидаемом формате, используем их как есть
    if (apiData.metrics && typeof apiData.metrics === 'object') {
      return {
        pageData: apiData,
        metrics: apiData.metrics
      };
    }

    // Иначе преобразуем из структуры API
    const metrics = {};
    const timeRanges = {};

    // Обрабатываем временные диапазоны
    if (apiData.timeRanges && Array.isArray(apiData.timeRanges)) {
      apiData.timeRanges.forEach(range => {
        timeRanges[range.key] = range.name;
      });
    }

    // Обрабатываем основные метрики
    if (apiData.metrics && Array.isArray(apiData.metrics)) {
      // Группируем метрики по временным диапазонам
      apiData.metrics.forEach(metric => {
        const rangeKey = metric.time_range || '5years';
        if (!metrics[rangeKey]) {
          metrics[rangeKey] = {
            main: {},
            categories: [],
            collaborations: [],
            topJournals: []
          };
        }
        
        metrics[rangeKey].main[metric.key] = {
          value: metric.value,
          label: metric.label,
          icon: metric.icon,
          description: metric.description
        };
      });
    }

    // Обрабатываем категории
    if (apiData.categories && Array.isArray(apiData.categories)) {
      apiData.categories.forEach(category => {
        const rangeKey = category.time_range || '5years';
        if (!metrics[rangeKey]) {
          metrics[rangeKey] = {
            main: {},
            categories: [],
            collaborations: [],
            topJournals: []
          };
        }
        
        metrics[rangeKey].categories.push({
          name: category.name,
          count: category.count
        });
      });
    }

    // Обрабатываем коллаборации
    if (apiData.collaborations && Array.isArray(apiData.collaborations)) {
      apiData.collaborations.forEach(collab => {
        const rangeKey = collab.time_range || '5years';
        if (!metrics[rangeKey]) {
          metrics[rangeKey] = {
            main: {},
            categories: [],
            collaborations: [],
            topJournals: []
          };
        }
        
        metrics[rangeKey].collaborations.push({
          country: collab.country,
          institutions: collab.institutions,
          publications: collab.publications,
          flag: collab.flag
        });
      });
    }

    // Обрабатываем квартили журналов
    if (apiData.topJournals && Array.isArray(apiData.topJournals)) {
      apiData.topJournals.forEach(journal => {
        const rangeKey = journal.time_range || '5years';
        if (!metrics[rangeKey]) {
          metrics[rangeKey] = {
            main: {},
            categories: [],
            collaborations: [],
            topJournals: []
          };
        }
        
        metrics[rangeKey].topJournals.push({
          quartile: journal.quartile,
          count: journal.count
        });
      });
    }

    return {
      pageData: {
        title: apiData.title || t('wos.title') || "Web of Science",
        subtitle: apiData.subtitle || t('wos.subtitle') || "Research metrics and publication data",
        titleIcon: apiData.titleIcon || "📊",
        categoriesIcon: apiData.categoriesIcon || "📈",
        collaborationsIcon: apiData.collaborationsIcon || "🌍",
        topJournalsIcon: apiData.topJournalsIcon || "⭐",
        timeRanges: timeRanges,
        collaborationsInstitutions: apiData.collaborationsInstitutions || t('wos.institutions') || "institutions",
        collaborationsPublications: apiData.collaborationsPublications || t('wos.publications') || "publications",
        topJournalsTitle: apiData.topJournalsTitle || t('wos.journal_quartiles') || "Publications by Journal Quartile",
        categoriesTitle: apiData.categoriesTitle || t('wos.by_category') || "Publications by Category",
        collaborationsTitle: apiData.collaborationsTitle || t('wos.collaborations') || "International Collaboration",
        additionalMetrics: apiData.additionalMetrics || []
      },
      metrics: metrics
    };
  };

  // Загрузка данных при монтировании и изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [i18n.language]); // Добавляем i18n.language в зависимости

  // Сброс состояний при изменении языка
  useEffect(() => {
    setCounterValues({});
    setActiveMetric(0);
    setActiveCategory(0);
  }, [i18n.language]);

  // Остальной код без изменений...
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => {
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
  }, [backendData]);

  // Автопереключение метрик и категорий
  useEffect(() => {
    const currentMetrics = backendData.metrics[timeRange];
    if (!currentMetrics?.main) return;
    
    const interval = setInterval(() => {
      const mainMetricsCount = Object.keys(currentMetrics.main || {}).length;
      const categoriesCount = currentMetrics.categories?.length || 0;
      
      if (mainMetricsCount > 0) {
        setActiveMetric(prev => (prev + 1) % mainMetricsCount);
      }
      if (categoriesCount > 0) {
        setActiveCategory(prev => (prev + 1) % categoriesCount);
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [timeRange, backendData.metrics]);

  const startCounters = () => {
    const currentMetrics = backendData.metrics[timeRange];
    if (!currentMetrics?.main) return;
    
    const targetValues = {};
    
    Object.entries(currentMetrics.main || {}).forEach(([key, metric]) => {
      if (metric && metric.value) {
        targetValues[key] = parseInt(metric.value.replace(/\D/g, '')) || 0;
      }
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
    if (backendData.pageData && isVisible) {
      startCounters();
    }
  }, [timeRange, backendData, isVisible]);

  // Компонент загрузки
  const LoadingSkeleton = () => (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400 mx-auto mb-4"></div>
        <p className="text-blue-200">{t('wos.loading') || "Loading Web of Science data..."}</p>
      </motion.div>
    </div>
  );

  // Компонент ошибки
  const ErrorMessage = ({ onRetry }) => (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl text-white mb-4">
          {t('error.failed_to_load') || "Failed to load data"}
        </h2>
        <p className="text-blue-200 mb-6">
          {backendData.error}
        </p>
        <button 
          onClick={onRetry}
          className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
        >
          {t('error.retry') || "Retry"}
        </button>
      </motion.div>
    </div>
  );

  if (backendData.loading) {
    return <LoadingSkeleton />;
  }

  if (backendData.error) {
    return <ErrorMessage onRetry={fetchBackendData} />;
  }

  if (!backendData.pageData) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex justify-center items-center">
        <div className="text-center">
          <p className="text-blue-200">{t('error.no_data') || "No data available"}</p>
          <button 
            onClick={fetchBackendData}
            className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            {t('error.retry') || "Retry"}
          </button>
        </div>
      </div>
    );
  }

  const currentMetrics = backendData.metrics[timeRange] || {};
  const mainMetrics = Object.entries(currentMetrics.main || {});
  const pageData = backendData.pageData;

  // Если нет основных метрик, показываем сообщение
  if (mainMetrics.length === 0) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex justify-center items-center">
        <div className="text-center">
          <p className="text-blue-200">{t('error.no_metrics') || "No metrics data available"}</p>
          <button 
            onClick={fetchBackendData}
            className="mt-4 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            {t('error.retry') || "Retry"}
          </button>
        </div>
      </section>
    );
  }

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
            {pageData.titleIcon}
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {pageData.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {pageData.subtitle}
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
            {Object.keys(backendData.metrics).map((range) => (
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
                {pageData.timeRanges?.[range] || range}
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
                  {mainMetrics[activeMetric][1]?.icon || "📊"}
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {mainMetrics[activeMetric][1]?.label || "Metric"}
                  </h3>
                  <div className="text-4xl lg:text-5xl font-bold text-emerald-400 font-mono mb-2">
                    {counterValues[mainMetrics[activeMetric][0]] 
                      ? Math.round(counterValues[mainMetrics[activeMetric][0]]).toLocaleString()
                      : '0'
                    }
                    {mainMetrics[activeMetric][1]?.value?.includes('%') && '%'}
                  </div>
                  <p className="text-blue-200 text-lg">
                    {mainMetrics[activeMetric][1]?.description || ""}
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
                <div className="text-2xl mb-3">{metric?.icon || "📊"}</div>
                <div className="text-2xl font-bold text-emerald-400 mb-1 font-mono">
                  {counterValues[key] 
                    ? Math.round(counterValues[key]).toLocaleString()
                    : '0'
                  }
                  {metric?.value?.includes('%') && '%'}
                </div>
                <div className="text-blue-200 text-sm">{metric?.label || "Label"}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Detailed Information */}
        {currentMetrics.categories && currentMetrics.collaborations && (
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
                  {pageData.categoriesIcon}
                </span>
                {pageData.categoriesTitle}
              </h3>
              <div className="space-y-4">
                {Array.isArray(currentMetrics.categories) && currentMetrics.categories.map((category, index) => {
                  const maxCount = Math.max(...(currentMetrics.categories || []).map(c => c.count || 0));
                  const percentage = maxCount > 0 ? ((category.count || 0) / maxCount) * 100 : 0;
                  
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
                      <span className="text-white text-lg font-medium flex-1">{category.name || "Category"}</span>
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
                          {category.count || 0}
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
                  {pageData.collaborationsIcon}
                </span>
                {pageData.collaborationsTitle}
              </h3>
              <div className="space-y-4">
                {(currentMetrics.collaborations || []).map((collab, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{collab.flag || "🇺🇳"}</span>
                      <div>
                        <span className="font-semibold text-white text-lg group-hover:text-emerald-300 transition-colors duration-300">
                          {collab.country || "Country"}
                        </span>
                        <div className="text-blue-200 text-sm">
                          {collab.institutions || 0} {pageData.collaborationsInstitutions}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-400 font-bold text-xl">{collab.publications || 0}</div>
                      <div className="text-blue-300 text-sm">{pageData.collaborationsPublications}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* Q1/Q2 Journals */}
        {currentMetrics.topJournals && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 text-white shadow-2xl mb-12 backdrop-blur-lg border border-white/20"
          >
            <h3 className="text-2xl font-bold mb-8 flex items-center justify-center">
              <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                {pageData.topJournalsIcon}
              </span>
              {pageData.topJournalsTitle}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.isArray(currentMetrics.topJournals) &&
              currentMetrics.topJournals.map((journal, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2 group border border-white/10"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300 text-emerald-400">
                    {journal.count || 0}
                  </div>
                  <div className="text-blue-200 text-lg font-medium mb-1">{journal.quartile || "Q"}</div>
                  <div className="text-white/80 text-sm">{pageData.topJournalsPublications}</div>
                  <div className="w-0 group-hover:w-full h-1 bg-emerald-400/50 transition-all duration-500 mt-2 mx-auto"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Additional Metrics */}
        {pageData.additionalMetrics && pageData.additionalMetrics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {(pageData.additionalMetrics || []).map((metric, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="bg-white/5 rounded-3xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 text-emerald-400">
                  {metric.icon || "📊"}
                </div>
                <div className="text-2xl font-bold text-white mb-2">{currentMetrics?.[metric.key] || "0"}</div>
                <div className="text-blue-200 font-semibold text-lg mb-2">{metric.title || "Metric"}</div>
                <div className="text-blue-300 text-sm">{metric.description || ""}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default WebOfScience;