import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const BachelorQuotas = () => {
  const { t, i18n } = useTranslation();
  const [activeQuota, setActiveQuota] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedQuota, setExpandedQuota] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  
  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    quotas: [],
    quota_stats: [],
    additional_support: [],
    process_steps: [],
    loading: false,
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
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/admission/bachelor-quotas/?lang=${lang}`);

      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setBackendData({
        quotas: data.quotas || [],
        quota_stats: data.quota_stats || [],
        additional_support: data.additional_support || [],
        process_steps: data.process_steps || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching bachelor quotas data:', error);
      setBackendData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  }, [getApiLanguage]);

  // Загрузка данных при монтировании и изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  // Intersection Observer для анимаций
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

  // Автопереключение квот
  useEffect(() => {
    const filteredQuotas = getFilteredQuotas();
    if (filteredQuotas.length > 1) {
      const interval = setInterval(() => {
        setActiveQuota(prev => (prev + 1) % filteredQuotas.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [backendData.quotas, selectedType]);

  const toggleQuota = (index) => {
    setExpandedQuota(expandedQuota === index ? null : index);
  };

  // Получение уникальных типов квот
  const getQuotaTypes = () => {
    const types = backendData.quotas.map(quota => quota.type).filter(Boolean);
    return ['all', ...new Set(types)];
  };

  // Фильтрация квот по типу
  const getFilteredQuotas = () => {
    if (selectedType === 'all') {
      return backendData.quotas;
    }
    return backendData.quotas.filter(quota => quota.type === selectedType);
  };

  // Функция для получения иконки квоты
  const getQuotaIcon = (iconName) => {
    const iconMap = {
      'sports': '🏆',
      'talent': '⭐',
      'international': '🌍',
      'regional': '🏛️',
      'special': '🎯',
      'default': '🎓'
    };
    return iconMap[iconName] || iconMap.default;
  };

  // Функция для получения цвета квоты
  const getQuotaColor = (colorName) => {
    const colorMap = {
      'blue': 'from-blue-500 to-cyan-500',
      'green': 'from-emerald-500 to-green-500',
      'purple': 'from-purple-500 to-pink-500',
      'orange': 'from-orange-500 to-amber-500',
      'red': 'from-red-500 to-pink-500',
      'default': 'from-blue-500 to-emerald-500'
    };
    return colorMap[colorName] || colorMap.default;
  };

  // Компонент загрузки
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="bg-white/10 rounded-2xl h-8 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white/5 rounded-3xl p-6 space-y-4">
            <div className="bg-white/10 rounded-2xl h-6 w-3/4"></div>
            <div className="bg-white/10 rounded-2xl h-4"></div>
            <div className="bg-white/10 rounded-2xl h-4 w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Компонент ошибки
  const ErrorMessage = ({ onRetry }) => (
    <div className="text-center py-12">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl text-white mb-4">
        {t('bachelorQuotas.errorTitle')}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData.error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t('bachelorQuotas.retry')}
      </button>
    </div>
  );

  const filteredQuotas = getFilteredQuotas();
  const quotaTypes = getQuotaTypes();

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
        
        {/* Символы квот */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🎓</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🏆</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">⭐</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">📊</div>
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
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            🎓
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('bachelorQuotas.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('bachelorQuotas.subtitle')}
          </p>
        </motion.div>

        {/* Статистика квот */}
        {backendData.quota_stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
          >
            {backendData.quota_stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.stat_type === 'total_spots' ? '🎯' : 
                   stat.stat_type === 'applications' ? '📝' :
                   stat.stat_type === 'success_rate' ? '📊' : '⭐'}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  {stat.label}
                </div>
                {stat.description && (
                  <p className="text-blue-300 text-xs mt-2">{stat.description}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {backendData.error ? (
          <ErrorMessage onRetry={fetchBackendData} />
        ) : (
          <>
            {/* Фильтры по типам квот */}
            {quotaTypes.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex justify-center mb-8 lg:mb-12"
              >
                <div className="bg-white/5 rounded-2xl p-2 backdrop-blur-lg border border-white/20 shadow-2xl">
                  <div className="flex flex-wrap justify-center gap-2">
                    {quotaTypes.map((type) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedType(type);
                          setActiveQuota(0);
                        }}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                          selectedType === type
                            ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                            : 'text-blue-200 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg">
                          {type === 'all' ? '📋' : getQuotaIcon(type)}
                        </span>
                        <span>
                          {type === 'all' 
                            ? t('bachelorQuotas.all') 
                            : t(`bachelorQuotas.types.${type}`) || type
                          }
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Активная квота */}
            {filteredQuotas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-12 lg:mb-16"
              >
                <motion.div
                  key={activeQuota}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-6 lg:p-8 backdrop-blur-sm border border-white/20"
                >
                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Информация о квоте */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getQuotaColor(filteredQuotas[activeQuota]?.color)} flex items-center justify-center text-white text-2xl shadow-lg`}>
                          {getQuotaIcon(filteredQuotas[activeQuota]?.icon)}
                        </div>
                        <div>
                          <h3 className="text-2xl lg:text-3xl font-bold text-white">
                            {filteredQuotas[activeQuota]?.title}
                          </h3>
                          <p className="text-blue-300">
                            {t(`bachelorQuotas.types.${filteredQuotas[activeQuota]?.type}`) || filteredQuotas[activeQuota]?.type}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-blue-200 mb-6 leading-relaxed">
                        {filteredQuotas[activeQuota]?.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                          <h4 className="font-bold text-blue-300 mb-2 text-sm">
                            {t('bachelorQuotas.availableSpots')}
                          </h4>
                          <p className="text-white font-bold text-2xl">
                            {filteredQuotas[activeQuota]?.spots}
                          </p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                          <h4 className="font-bold text-emerald-300 mb-2 text-sm">
                            {t('bachelorQuotas.applicationDeadline')}
                          </h4>
                          <p className="text-white font-bold text-xl">
                            {filteredQuotas[activeQuota]?.deadline}
                          </p>
                        </div>
                      </div>

                      {/* Преимущества */}
                      {filteredQuotas[activeQuota]?.benefits?.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-bold text-white mb-3">{t('bachelorQuotas.benefits')}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {filteredQuotas[activeQuota]?.benefits
                              .sort((a, b) => a.order - b.order)
                              .map((benefit, index) => (
                              <div key={benefit.id} className="flex items-center space-x-2 text-blue-200">
                                <span className="text-emerald-400">✓</span>
                                <span className="text-sm">{benefit.benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Требования */}
                    {filteredQuotas[activeQuota]?.requirements?.length > 0 && (
                      <div className="w-full lg:w-96 bg-white/5 rounded-2xl p-6 border border-white/10">
                        <h4 className="font-bold text-white mb-4">{t('bachelorQuotas.requirements')}</h4>
                        <div className="space-y-3">
                          {filteredQuotas[activeQuota]?.requirements
                            .sort((a, b) => a.order - b.order)
                            .map((requirement, index) => (
                            <div key={requirement.id} className="flex items-start space-x-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-300 rounded-full text-xs flex items-center justify-center mt-0.5">
                                {index + 1}
                              </span>
                              <span className="text-blue-200 text-sm">{requirement.requirement}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Все квоты */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {backendData.loading ? (
                <LoadingSkeleton />
              ) : filteredQuotas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {filteredQuotas.map((quota, index) => (
                    <motion.div
                      key={quota.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white/5 rounded-3xl backdrop-blur-sm border cursor-pointer transition-all duration-300 overflow-hidden ${
                        activeQuota === index
                          ? 'bg-white/10 border-emerald-400/50 shadow-2xl'
                          : 'border-white/10 hover:bg-white/10 hover:border-emerald-400/30'
                      }`}
                      onClick={() => {
                        setActiveQuota(index);
                        setExpandedQuota(expandedQuota === index ? null : index);
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Заголовок квоты */}
                      <div className={`p-6 bg-gradient-to-r ${getQuotaColor(quota.color)}`}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl">
                            {getQuotaIcon(quota.icon)}
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold text-2xl">{quota.spots}</div>
                            <div className="text-white/80 text-sm">{t('bachelorQuotas.spots')}</div>
                          </div>
                        </div>
                        <h4 className="font-bold text-white text-lg mb-2">
                          {quota.title}
                        </h4>
                        <p className="text-white/80 text-sm line-clamp-2">
                          {quota.description}
                        </p>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-blue-300 text-sm font-semibold bg-white/10 px-3 py-1 rounded-full">
                            {t(`bachelorQuotas.types.${quota.type}`) || quota.type}
                          </span>
                          <span className="text-emerald-300 text-sm font-semibold">
                            {t('bachelorQuotas.deadline')}: {quota.deadline}
                          </span>
                        </div>

                        {/* Краткие требования */}
                        {quota.requirements?.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-semibold text-white text-sm mb-2">
                              {t('bachelorQuotas.keyRequirements')}
                            </h5>
                            <div className="space-y-1">
                              {quota.requirements
                                .sort((a, b) => a.order - b.order)
                                .slice(0, 2)
                                .map((req, idx) => (
                                <div key={req.id} className="flex items-center space-x-2 text-blue-200 text-xs">
                                  <span className="text-emerald-400 text-xs">•</span>
                                  <span className="line-clamp-1">{req.requirement}</span>
                                </div>
                              ))}
                              {quota.requirements.length > 2 && (
                                <div className="text-blue-300 text-xs">
                                  +{quota.requirements.length - 2} {t('bachelorQuotas.moreRequirements')}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleQuota(index);
                          }}
                          className="w-full flex items-center justify-center space-x-2 py-2 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
                        >
                          <span className="text-blue-300 text-sm">
                            {expandedQuota === index 
                              ? t('bachelorQuotas.showLess') 
                              : t('bachelorQuotas.showMore')
                            }
                          </span>
                          <svg
                            className={`w-4 h-4 text-blue-300 transition-transform duration-300 ${
                              expandedQuota === index ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Раскрывающаяся детальная информация */}
                      <AnimatePresence>
                        {expandedQuota === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-6 border-t border-white/10 pt-4">
                              <div className="space-y-4">
                                {/* Полные требования */}
                                {quota.requirements?.length > 0 && (
                                  <div>
                                    <h5 className="font-semibold text-white mb-3 text-sm">
                                      {t('bachelorQuotas.fullRequirements')}
                                    </h5>
                                    <div className="space-y-2">
                                      {quota.requirements
                                        .sort((a, b) => a.order - b.order)
                                        .map((requirement, reqIndex) => (
                                        <div key={requirement.id} className="flex items-start space-x-3">
                                          <span className="flex-shrink-0 w-5 h-5 bg-blue-500/20 text-blue-300 rounded-full text-xs flex items-center justify-center mt-0.5">
                                            {reqIndex + 1}
                                          </span>
                                          <span className="text-blue-100 text-sm">{requirement.requirement}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Преимущества */}
                                {quota.benefits?.length > 0 && (
                                  <div>
                                    <h5 className="font-semibold text-white mb-3 text-sm">
                                      {t('bachelorQuotas.benefits')}
                                    </h5>
                                    <div className="grid grid-cols-1 gap-2">
                                      {quota.benefits
                                        .sort((a, b) => a.order - b.order)
                                        .map((benefit) => (
                                        <div key={benefit.id} className="flex items-center space-x-2 text-blue-200 text-sm">
                                          <span className="text-emerald-400">✓</span>
                                          <span>{benefit.benefit}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 text-blue-300">🎓</div>
                  <h3 className="text-xl text-white mb-2">
                    {t('bachelorQuotas.noQuotas')}
                  </h3>
                  <p className="text-blue-200">
                    {selectedType === 'all' 
                      ? t('bachelorQuotas.noQuotasDescription')
                      : t('bachelorQuotas.noFilteredQuotas')
                    }
                  </p>
                </div>
              )}
            </motion.div>

            {/* Процесс подачи заявки */}
            {backendData.process_steps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-16"
              >
                <h2 className="text-3xl lg:text-4xl font-bold text-white text-center mb-8">
                  {t('bachelorQuotas.applicationProcess')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {backendData.process_steps
                    .sort((a, b) => a.step_number - b.step_number)
                    .map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + index * 0.1 }}
                      className="bg-white/5 rounded-3xl p-6 backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group text-center"
                    >
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${step.color_scheme || 'from-blue-500 to-emerald-500'} flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                        {step.step_number}
                      </div>
                      <h3 className="font-bold text-white text-lg mb-3">
                        {step.title}
                      </h3>
                      <p className="text-blue-200 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Дополнительная поддержка */}
            {backendData.additional_support.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="mt-16"
              >
                <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 backdrop-blur-sm border border-white/20">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white text-center mb-6">
                    {t('bachelorQuotas.additionalSupport')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {backendData.additional_support
                      .sort((a, b) => a.order - b.order)
                      .map((support, index) => (
                      <div key={support.id} className="flex items-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-emerald-400 text-lg">💡</span>
                        <span className="text-blue-200 text-sm">{support.support}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default BachelorQuotas;