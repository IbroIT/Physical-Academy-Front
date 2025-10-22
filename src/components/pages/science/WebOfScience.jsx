import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const WebOfScience = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState({});
  const [activeMetric, setActiveMetric] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  
  // Единое состояние для данных с бэкенда
  const [backendData, setBackendData] = useState({
    metrics: {
      results: [],
      loading: false,
      error: null
    },
    categories: {
      results: [],
      loading: false,
      error: null
    },
    collaborations: {
      results: [],
      loading: false,
      error: null
    },
    journalQuartiles: {
      results: [],
      loading: false,
      error: null
    },
    additionalMetrics: {
      results: [],
      loading: false,
      error: null
    },
    sections: {
      results: [],
      loading: false,
      error: null
    }
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
      const lang = getApiLanguage();
      console.log('Fetching Web of Science data for language:', lang);
      
      // Устанавливаем состояние загрузки для всех разделов
      setBackendData(prev => ({
        metrics: { ...prev.metrics, loading: true, error: null },
        categories: { ...prev.categories, loading: true, error: null },
        collaborations: { ...prev.collaborations, loading: true, error: null },
        journalQuartiles: { ...prev.journalQuartiles, loading: true, error: null },
        additionalMetrics: { ...prev.additionalMetrics, loading: true, error: null },
        sections: { ...prev.sections, loading: true, error: null }
      }));

      // Определяем все эндпоинты
      const endpoints = [
        `/api/science/wos-metrics/?lang=${lang}`,
        `/api/science/wos-categories/?lang=${lang}`,
        `/api/science/wos-collaborations/?lang=${lang}`,
        `/api/science/wos-journal-quartiles/?lang=${lang}`,
        `/api/science/wos-additional-metrics/?lang=${lang}`,
        `/api/science/wos-sections/?lang=${lang}`
      ];

      const responses = await Promise.all(
        endpoints.map(async (url) => {
          try {
            const response = await fetch(url);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              const text = await response.text();
              console.warn(`Non-JSON response from ${url}:`, text.substring(0, 200));
              return { results: [] };
            }
            
            return await response.json();
          } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return { results: [] };
          }
        })
      );

      // Обновляем данные для каждого раздела
      setBackendData({
        metrics: { 
          results: responses[0].results || [], 
          loading: false, 
          error: null 
        },
        categories: { 
          results: responses[1].results || [], 
          loading: false, 
          error: null 
        },
        collaborations: { 
          results: responses[2].results || [], 
          loading: false, 
          error: null 
        },
        journalQuartiles: { 
          results: responses[3].results || [], 
          loading: false, 
          error: null 
        },
        additionalMetrics: { 
          results: responses[4].results || [], 
          loading: false, 
          error: null 
        },
        sections: { 
          results: responses[5].results || [], 
          loading: false, 
          error: null 
        }
      });

      console.log('Loaded data:', {
        metrics: responses[0].results?.length || 0,
        categories: responses[1].results?.length || 0,
        collaborations: responses[2].results?.length || 0,
        journalQuartiles: responses[3].results?.length || 0,
        additionalMetrics: responses[4].results?.length || 0,
        sections: responses[5].results?.length || 0
      });

    } catch (error) {
      console.error('Error fetching Web of Science data:', error);
      setBackendData(prev => ({
        metrics: { ...prev.metrics, loading: false, error: 'Failed to load metrics' },
        categories: { ...prev.categories, loading: false, error: 'Failed to load categories' },
        collaborations: { ...prev.collaborations, loading: false, error: 'Failed to load collaborations' },
        journalQuartiles: { ...prev.journalQuartiles, loading: false, error: 'Failed to load journal quartiles' },
        additionalMetrics: { ...prev.additionalMetrics, loading: false, error: 'Failed to load additional metrics' },
        sections: { ...prev.sections, loading: false, error: 'Failed to load sections' }
      }));
    }
  }, [getApiLanguage]);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  // Перезагрузка данных при изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [i18n.language]);

  // Сброс состояний при изменении языка
  useEffect(() => {
    setCounterValues({});
    setActiveMetric(0);
    setActiveCategory(0);
  }, [i18n.language]);

  // Intersection Observer для анимаций
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
  }, [backendData.metrics.results]);

  // Автопереключение метрик и категорий
  useEffect(() => {
    const metricsCount = backendData.metrics.results.length;
    const categoriesCount = backendData.categories.results.length;
    
    if (metricsCount === 0 && categoriesCount === 0) return;
    
    const interval = setInterval(() => {
      if (metricsCount > 0) {
        setActiveMetric(prev => (prev + 1) % metricsCount);
      }
      if (categoriesCount > 0) {
        setActiveCategory(prev => (prev + 1) % categoriesCount);
      }
    }, 4000);
    
    return () => clearInterval(interval);
  }, [backendData.metrics.results, backendData.categories.results]);

  // Получение текста секции
  const getSectionText = (sectionKey) => {
    const section = backendData.sections.results.find(s => s.section_key === sectionKey);
    return section ? section.text : t(`wos.${sectionKey}`) || sectionKey;
  };

  // Запуск счетчиков
  const startCounters = () => {
    const metrics = backendData.metrics.results;
    if (!metrics || metrics.length === 0) return;
    
    const targetValues = {};
    
    metrics.forEach(metric => {
      if (metric && metric.value) {
        // Извлекаем числовое значение (убираем все нецифровые символы кроме точки и запятой)
        const numericValue = parseFloat(metric.value.toString().replace(/[^\d.,]/g, '').replace(',', '.'));
        targetValues[metric.id || metric.key] = isNaN(numericValue) ? 0 : numericValue;
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
    if (isVisible && backendData.metrics.results.length > 0) {
      startCounters();
    }
  }, [isVisible, backendData.metrics.results]);

  // Проверка загрузки
  const isLoading = Object.values(backendData).some(section => section.loading);
  const hasError = Object.values(backendData).some(section => section.error);

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
          {Object.values(backendData).find(section => section.error)?.error}
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

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (hasError) {
    return <ErrorMessage onRetry={fetchBackendData} />;
  }

  // Получаем текущие данные
  const currentMetrics = backendData.metrics.results;
  const currentCategories = backendData.categories.results;
  const currentCollaborations = backendData.collaborations.results;
  const currentJournalQuartiles = backendData.journalQuartiles.results;
  const currentAdditionalMetrics = backendData.additionalMetrics.results;

  // Если нет данных, показываем сообщение
  if (currentMetrics.length === 0 && currentCategories.length === 0) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex justify-center items-center">
        <div className="text-center">
          <p className="text-blue-200">{t('error.no_data') || "No data available"}</p>
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
            {getSectionText('titleIcon') || '📊'}
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {getSectionText('title') || "Web of Science"}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {getSectionText('subtitle') || "Research metrics and publication data"}
          </p>
        </motion.div>

        {/* Main Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12 lg:mb-16">
          {/* Активная метрика */}
          {currentMetrics[activeMetric] && (
            <motion.div
              key={activeMetric}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                  {currentMetrics[activeMetric]?.icon || "📊"}
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {currentMetrics[activeMetric]?.label || currentMetrics[activeMetric]?.title || "Metric"}
                  </h3>
                  <div className="text-4xl lg:text-5xl font-bold text-emerald-400 font-mono mb-2">
                    {counterValues[currentMetrics[activeMetric]?.id || currentMetrics[activeMetric]?.key] 
                      ? Math.round(counterValues[currentMetrics[activeMetric]?.id || currentMetrics[activeMetric]?.key]).toLocaleString()
                      : '0'
                    }
                    {currentMetrics[activeMetric]?.value?.includes('%') && '%'}
                  </div>
                  <p className="text-blue-200 text-lg">
                    {currentMetrics[activeMetric]?.description || ""}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Все метрики */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4">
            {currentMetrics.map((metric, index) => (
              <motion.div
                key={metric.id || metric.key}
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
                  {counterValues[metric.id || metric.key] 
                    ? Math.round(counterValues[metric.id || metric.key]).toLocaleString()
                    : '0'
                  }
                  {metric?.value?.includes('%') && '%'}
                </div>
                <div className="text-blue-200 text-sm">{metric?.label || metric?.title || "Label"}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Detailed Information */}
        {(currentCategories.length > 0 || currentCollaborations.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Publications by Category */}
            {currentCategories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">
                    {getSectionText('categoriesIcon') || '📈'}
                  </span>
                  {getSectionText('categoriesTitle') || "Publications by Category"}
                </h3>
                <div className="space-y-4">
                  {currentCategories.map((category, index) => {
                    const maxCount = Math.max(...currentCategories.map(c => c.count || 0));
                    const percentage = maxCount > 0 ? ((category.count || 0) / maxCount) * 100 : 0;
                    
                    return (
                      <motion.div 
                        key={category.id}
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
            )}

            {/* International Collaboration */}
            {currentCollaborations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">
                    {getSectionText('collaborationsIcon') || '🌍'}
                  </span>
                  {getSectionText('collaborationsTitle') || "International Collaboration"}
                </h3>
                <div className="space-y-4">
                  {currentCollaborations.map((collab, index) => (
                    <motion.div 
                      key={collab.id}
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
                            {collab.institutions || 0} {getSectionText('collaborationsInstitutions') || "institutions"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-emerald-400 font-bold text-xl">{collab.publications || 0}</div>
                        <div className="text-blue-300 text-sm">{getSectionText('collaborationsPublications') || "publications"}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Q1/Q2 Journals */}
        {currentJournalQuartiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 text-white shadow-2xl mb-12 backdrop-blur-lg border border-white/20"
          >
            <h3 className="text-2xl font-bold mb-8 flex items-center justify-center">
              <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                {getSectionText('topJournalsIcon') || '⭐'}
              </span>
              {getSectionText('topJournalsTitle') || "Publications by Journal Quartile"}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {currentJournalQuartiles.map((journal, index) => (
                <motion.div 
                  key={journal.id}
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
                  <div className="text-white/80 text-sm">{t('wos.publications') || "publications"}</div>
                  <div className="w-0 group-hover:w-full h-1 bg-emerald-400/50 transition-all duration-500 mt-2 mx-auto"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Additional Metrics */}
        {currentAdditionalMetrics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {currentAdditionalMetrics.map((metric, index) => (
              <motion.div 
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="bg-white/5 rounded-3xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300 text-emerald-400">
                  {metric.icon || "📊"}
                </div>
                <div className="text-2xl font-bold text-white mb-2">{metric.value || "0"}</div>
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