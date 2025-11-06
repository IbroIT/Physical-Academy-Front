import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Ipchain = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [backendData, setBackendData] = useState({
    info: [],
    stats: [],
    patents: [],
    features: [],
    benefits: [],
    loading: false,
    error: null
  });

  const sectionRef = useRef(null);
  const modalRef = useRef(null);

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

  // Закрытие модального окна при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Закрытие модального окна при нажатии Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.keyCode === 27) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);

  // Загрузка данных с бэкенда
  const fetchBackendData = useCallback(async () => {
    try {
      setBackendData(prev => ({ ...prev, loading: true, error: null }));
      
      const lang = i18n.language;
      const API_URL = import.meta.env.VITE_API_URL;

      const endpoints = [
        `${API_URL}/api/ipchain/info/`,
        `${API_URL}/api/ipchain/stats/`,
        `${API_URL}/api/ipchain/patents/`,
        `${API_URL}/api/ipchain/features/`,
        `${API_URL}/api/ipchain/benefits/`
      ];

      const responses = await Promise.all(
        endpoints.map(async (url) => {
          try {
            const params = new URLSearchParams({
              lang: lang,
              language: lang,
              locale: lang,
              _: Date.now()
            });
            
            const fullUrl = `${url}?${params}`;
            const response = await fetch(fullUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Accept-Language': lang,
                'Content-Type': 'application/json',
              },
              cache: 'no-store'
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            return data;
          } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return { results: [] };
          }
        })
      );

      setBackendData({
        info: responses[0]?.results || [],
        stats: responses[1]?.results || [],
        patents: responses[2]?.results || [],
        features: responses[3]?.results || [],
        benefits: responses[4]?.results || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching IPChain data:', error);
      setBackendData(prev => ({
        ...prev,
        loading: false,
        error: t('science.sections.ipchain.error', 'Failed to load data')
      }));
    }
  }, [i18n.language, t]);

  useEffect(() => {
    fetchBackendData();
  }, [i18n.language]);

  // Получение переводов для компонента
  const translations = useMemo(() => {
    const data = t('science.sections.ipchain', { returnObjects: true });
    return typeof data === 'object' ? data : {};
  }, [t]);

  // Получение переводов для модального окна
  const modalTranslations = useMemo(() => {
    return translations.patents?.modal || {};
  }, [translations]);

  // Функции для безопасного получения данных
  const safeString = (value, defaultValue = '') => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    return defaultValue;
  };

  const safeArray = (value) => Array.isArray(value) ? value : [];

  // Мемоизированные данные
  const ipchainData = useMemo(() => {
    const info = backendData.info[0] || {};
    const hasBackendData = backendData.info.length > 0;
    
    return {
      title: hasBackendData ? safeString(info.title) : translations.title,
      subtitle: hasBackendData ? safeString(info.subtitle) : translations.subtitle,
      tabs: translations.tabs || {}
    };
  }, [backendData.info, translations]);

  const stats = useMemo(() => {
    const data = safeArray(backendData.stats).map(stat => ({
      id: stat.id || Math.random(),
      value: safeString(stat.value, '0'),
      label: safeString(stat.label, 'Stat')
    }));
    return data.length > 0 ? data : (translations.overview?.stats || []);
  }, [backendData.stats, translations]);

  const patents = useMemo(() => {
    const data = safeArray(backendData.patents).map(patent => ({
      id: patent.id || Math.random(),
      title: safeString(patent.title, 'Patent Title'),
      number: safeString(patent.number, 'PAT0001'),
      description: safeString(patent.description, 'Patent description'),
      status: safeString(patent.status, 'Active'),
      year: safeString(patent.year, '2024'),
      date: safeString(patent.date, '2024-01-01'),
      icon: safeString(patent.icon, '📄'),
      fullDescription: safeString(patent.fullDescription, ''),
      technologies: safeArray(patent.technologies),
      applications: safeArray(patent.applications)
    }));
    return data.length > 0 ? data : (translations.patents?.items || []);
  }, [backendData.patents, translations]);

  const features = useMemo(() => {
    const data = safeArray(backendData.features).map(feature => ({
      id: feature.id || Math.random(),
      title: safeString(feature.title, 'Feature'),
      description: safeString(feature.description, 'Feature description')
    }));
    return data.length > 0 ? data : (translations.blockchain?.features || []);
  }, [backendData.features, translations]);

  const benefits = useMemo(() => {
    const data = safeArray(backendData.benefits).map(benefit => ({
      id: benefit.id || Math.random(),
      title: safeString(benefit.title, 'Benefit'),
      description: safeString(benefit.description, 'Benefit description'),
      icon: safeString(benefit.icon, '✅')
    }));
    return data.length > 0 ? data : (translations.benefits?.items || []);
  }, [backendData.benefits, translations]);

  const openModal = (patent) => {
    setSelectedPatent(patent);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedPatent(null), 300);
  };

  // Анимации
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (backendData.loading) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-8">
            <div className="bg-white/10 rounded-2xl h-24 w-1/3 mx-auto"></div>
            <div className="bg-white/10 rounded-2xl h-12 w-1/2 mx-auto"></div>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white/10 rounded-2xl h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Блокчейн символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">⛓️</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🔗</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">⚡</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl opacity-5">🔒</div>
        
        {/* Блокчейн структура */}
        <div className="absolute top-1/3 left-1/3 w-32 h-32 border-2 border-purple-400/10 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border-2 border-blue-400/10 rounded-full animate-spin-slow reverse"></div>
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
            initial={{ scale: 0, rotate: -180 }}
            animate={isVisible ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            ⛓️
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {ipchainData.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {ipchainData.subtitle}
          </p>
        </motion.div>

        {/* Навигация */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-lg border border-white/20 shadow-2xl">
            {Object.keys(ipchainData.tabs).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {ipchainData.tabs[tab]}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Контент */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {translations.overview?.title}
                    </h2>
                    <p className="text-blue-100 text-lg leading-relaxed mb-8">
                      {translations.overview?.description}
                    </p>
                    
                    <motion.div
                      variants={containerVariants}
                      className="grid grid-cols-2 gap-4 mb-8"
                    >
                      {stats.map((stat, index) => (
                        <motion.div
                          key={stat.id}
                          variants={itemVariants}
                          className="text-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-400/30 transition-all duration-300 group"
                        >
                          <div className="text-2xl font-bold text-purple-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                            {stat.value}
                          </div>
                          <div className="text-blue-200 text-sm">{stat.label}</div>
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 font-semibold shadow-lg"
                    >
                      {translations.overview?.buttonText}
                    </motion.button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl p-8 text-center border border-purple-400/30 backdrop-blur-sm"
                  >
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-lg">
                      {translations.overview?.blockchainCard?.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {translations.overview?.blockchainCard?.title}
                    </h3>
                    <p className="text-blue-200 leading-relaxed">
                      {translations.overview?.blockchainCard?.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Patents Tab */}
            {activeTab === 'patents' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8">
                  {translations.patents?.title}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {patents.map((patent, index) => (
                    <motion.div
                      key={patent.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 rounded-2xl border border-white/10 hover:border-purple-400/30 transition-all duration-300 overflow-hidden group cursor-pointer"
                      whileHover={{ y: -5 }}
                      onClick={() => openModal(patent)}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors mb-2">
                              {patent.title}
                            </h3>
                            <p className="text-blue-300 text-sm">{patent.number}</p>
                          </div>
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-lg ml-4">
                            {patent.icon}
                          </div>
                        </div>
                        
                        <p className="text-blue-200 text-sm mb-4 line-clamp-3">
                          {patent.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            patent.status === 'Granted' 
                              ? 'bg-green-500/20 text-green-300' 
                              : patent.status === 'Pending'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {patent.status}
                          </span>
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                            {patent.year}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-blue-300">
                            {t('science.sections.ipchain.patents.dateLabel', 'Filed:')} {patent.date}
                          </span>
                          <div className="text-purple-400 group-hover:text-purple-300 transition-colors flex items-center">
                            <span className="text-xs font-medium mr-1">
                              {translations.patents?.buttonText}
                            </span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Blockchain Tab */}
            {activeTab === 'blockchain' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8">
                  {translations.blockchain?.title}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-6">
                      {translations.blockchain?.featuresTitle}
                    </h3>
                    <div className="space-y-4">
                      {features.map((feature, index) => (
                        <motion.div
                          key={feature.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-400/30 transition-all duration-300 group"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            ✓
                          </div>
                          <div>
                            <div className="font-semibold text-white text-lg mb-2">
                              {feature.title}
                            </div>
                            <div className="text-blue-200 text-sm leading-relaxed">
                              {feature.description}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl p-6 border border-purple-400/30 backdrop-blur-sm">
                    <h3 className="text-xl font-bold text-white mb-6">
                      {translations.blockchain?.hashesTitle}
                    </h3>
                    <div className="space-y-4">
                      {(translations.blockchain?.hashes || []).map((hash, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="bg-white/10 rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-300"
                        >
                          <div className="text-purple-400 text-sm font-medium mb-1">
                            {hash.label}
                          </div>
                          <div className="text-white font-mono text-sm truncate">
                            {hash.value}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Benefits Tab */}
            {activeTab === 'benefits' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8">
                  {translations.benefits?.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-purple-400/30 transition-all duration-300 group backdrop-blur-sm"
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {benefit.icon}
                      </div>
                      <h3 className="font-bold text-white text-lg mb-3">
                        {benefit.title}
                      </h3>
                      <p className="text-blue-200 text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Модальное окно для патентов */}
      <AnimatePresence>
        {isModalOpen && selectedPatent && (
          <>
            {/* Затемнение фона */}
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={closeModal}
            />
            
            {/* Модальное окно */}
            <motion.div
              ref={modalRef}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-4 md:inset-10 lg:inset-20 xl:inset-40 z-50 flex items-center justify-center"
            >
              <div className="bg-gradient-to-br from-slate-800 to-purple-900 rounded-3xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="relative p-6 lg:p-8 max-h-[90vh] overflow-y-auto">
                  {/* Кнопка закрытия */}
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors duration-200 z-10"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* Заголовок модального окна */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl flex-shrink-0">
                      {selectedPatent.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                        {selectedPatent.title}
                      </h2>
                      <p className="text-blue-300 text-lg">{selectedPatent.number}</p>
                    </div>
                  </div>

                  {/* Статус и мета-информация */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                      selectedPatent.status === 'Granted' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : selectedPatent.status === 'Pending'
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {modalTranslations.statusLabel || 'Status'}: {selectedPatent.status}
                    </span>
                    <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                      {modalTranslations.yearLabel || 'Year'}: {selectedPatent.year}
                    </span>
                    <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
                      {modalTranslations.filedLabel || 'Filed'}: {selectedPatent.date}
                    </span>
                  </div>

                  {/* Полное описание */}
                  <div className="prose prose-invert max-w-none mb-8">
                    <p className="text-blue-100 text-lg leading-relaxed">
                      {selectedPatent.description}
                    </p>
                    
                    {selectedPatent.fullDescription && (
                      <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <h4 className="text-white font-semibold mb-3">
                          {modalTranslations.detailedDescription || 'Detailed Description'}
                        </h4>
                        <p className="text-blue-200 leading-relaxed">
                          {selectedPatent.fullDescription}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Дополнительные секции */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Технологии */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {modalTranslations.technologiesTitle || 'Key Technologies'}
                      </h4>
                      <ul className="space-y-2">
                        {(selectedPatent.technologies && selectedPatent.technologies.length > 0 ? selectedPatent.technologies : (modalTranslations.defaultTechnologies || [
                          'Blockchain Verification',
                          'Cryptographic Security',
                          'Smart Contracts',
                          'Distributed Ledger'
                        ])).map((tech, index) => (
                          <li key={index} className="flex items-center text-blue-200 text-sm">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Применения */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                        {modalTranslations.applicationsTitle || 'Applications'}
                      </h4>
                      <ul className="space-y-2">
                        {(selectedPatent.applications && selectedPatent.applications.length > 0 ? selectedPatent.applications : (modalTranslations.defaultApplications || [
                          'IP Rights Management',
                          'Digital Asset Protection',
                          'Royalty Distribution',
                          'Cross-border Verification'
                        ])).map((app, index) => (
                          <li key={index} className="flex items-center text-blue-200 text-sm">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                            {app}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Ipchain;