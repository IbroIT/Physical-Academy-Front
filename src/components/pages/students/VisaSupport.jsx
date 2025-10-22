import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const VisaSupport = () => {
  const { t, i18n } = useTranslation();
  const [activeService, setActiveService] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedService, setExpandedService] = useState(null);
  
  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    services: [],
    contacts: [],
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
      
      const endpoints = [
        `/api/student-clubs/visa/services/?lang=${lang}`,
        `/api/student-clubs/visa/contacts/?lang=${lang}`
      ];

      const responses = await Promise.all(
        endpoints.map(async (url) => {
          try {
            const response = await fetch(url);
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
          } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return { results: [] };
          }
        })
      );

      setBackendData({
        services: responses[0].results || [],
        contacts: responses[1].results || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching visa support data:', error);
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

  // Автопереключение услуг
  useEffect(() => {
    if (backendData.services.length > 1) {
      const interval = setInterval(() => {
        setActiveService(prev => (prev + 1) % backendData.services.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [backendData.services.length]);

  const toggleService = (index) => {
    setExpandedService(expandedService === index ? null : index);
  };

  // Компонент загрузки
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="bg-white/10 rounded-2xl h-8 mb-4"></div>
      <div className="bg-white/10 rounded-2xl h-4 mb-2"></div>
      <div className="bg-white/10 rounded-2xl h-4 w-3/4"></div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white/10 rounded-2xl h-20"></div>
        <div className="bg-white/10 rounded-2xl h-20"></div>
      </div>
    </div>
  );

  // Компонент ошибки
  const ErrorMessage = ({ onRetry }) => (
    <div className="text-center py-8">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl text-white mb-4">
        {t('visa.errorTitle')}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData.error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t('visa.retry')}
      </button>
    </div>
  );

  // Функция для получения иконки
  const getServiceIcon = (iconName) => {
    const iconMap = {
      'passport': '📘',
      'document': '📄',
      'consultation': '💬',
      'application': '✍️',
      'support': '🛟',
      'default': '🛂'
    };
    return iconMap[iconName] || iconMap.default;
  };

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
        
        {/* Символы визовой поддержки */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🛂</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🌍</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">✈️</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">📋</div>
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
            🛂
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('visa.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('visa.subtitle')}
          </p>
        </motion.div>

        {backendData.error ? (
          <ErrorMessage onRetry={fetchBackendData} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Основной контент */}
            <div className="lg:col-span-2 space-y-8">
              {/* Услуги визовой поддержки */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                {backendData.loading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                        🛂
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white">
                        {t('visa.services')}
                      </h2>
                    </div>

                    {/* Активная услуга */}
                    {backendData.services.length > 0 && (
                      <motion.div
                        key={activeService}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm border border-white/20 mb-6"
                      >
                        <div className="flex flex-col lg:flex-row gap-6 items-start">
                          <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                            {getServiceIcon(backendData.services[activeService]?.icon)}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 lg:mb-0">
                                {backendData.services[activeService]?.title}
                                {backendData.services[activeService]?.is_featured && (
                                  <span className="ml-3 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-semibold">
                                    {t('visa.featured')}
                                  </span>
                                )}
                              </h3>
                            </div>
                            <p className="text-blue-200 mb-4 leading-relaxed">
                              {backendData.services[activeService]?.description}
                            </p>
                            <div className="flex items-center text-emerald-300">
                              <span className="mr-2">⭐</span>
                              <span className="text-sm">
                                {t('visa.serviceOrder')}: {backendData.services[activeService]?.order}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Все услуги */}
                    {backendData.services.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {backendData.services.map((service, index) => (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-2xl backdrop-blur-sm border cursor-pointer transition-all duration-300 ${
                              activeService === index
                                ? 'bg-white/10 border-emerald-400/50 shadow-lg'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                            onClick={() => setActiveService(index)}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                                {getServiceIcon(service.icon)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="font-semibold text-white truncate">
                                    {service.title}
                                  </h4>
                                  {service.is_featured && (
                                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full text-xs ml-2 flex-shrink-0">
                                      {t('visa.featured')}
                                    </span>
                                  )}
                                </div>
                                <p className="text-blue-200 text-sm line-clamp-2 mb-2">
                                  {service.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-emerald-400 text-xs">
                                    {t('visa.order')}: {service.order}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    service.is_active 
                                      ? 'bg-green-500/20 text-green-300' 
                                      : 'bg-red-500/20 text-red-300'
                                  }`}>
                                    {service.is_active ? t('visa.active') : t('visa.inactive')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-blue-200">
                        {t('visa.noServices')}
                      </div>
                    )}
                  </>
                )}
              </motion.div>

              {/* Детальная информация об услугах */}
              {backendData.services.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
                >
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                    {t('visa.serviceDetails')}
                  </h2>
                  
                  <div className="space-y-4">
                    {backendData.services.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 overflow-hidden"
                        whileHover={{ scale: 1.01 }}
                      >
                        <button
                          onClick={() => toggleService(index)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-300"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                              {getServiceIcon(service.icon)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white text-lg">
                                {service.title}
                              </h4>
                              <p className="text-blue-300 text-sm">
                                {service.is_featured ? t('visa.featuredService') : t('visa.standardService')}
                              </p>
                            </div>
                          </div>
                          <svg
                            className={`w-6 h-6 text-blue-300 transition-transform duration-300 ${
                              expandedService === index ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {expandedService === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="px-6 pb-6">
                                <div className="border-t border-white/20 pt-4">
                                  <p className="text-blue-100 leading-relaxed mb-4">{service.description}</p>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center text-emerald-300">
                                      <span className="mr-2">🆔</span>
                                      <span>ID: {service.id}</span>
                                    </div>
                                    <div className="flex items-center text-blue-300">
                                      <span className="mr-2">📊</span>
                                      <span>{t('visa.order')}: {service.order}</span>
                                    </div>
                                    <div className="flex items-center text-emerald-300">
                                      <span className="mr-2">⭐</span>
                                      <span>
                                        {service.is_featured ? t('visa.featured') : t('visa.standard')}
                                      </span>
                                    </div>
                                    <div className="flex items-center text-blue-300">
                                      <span className="mr-2">🔍</span>
                                      <span>
                                        {service.is_active ? t('visa.active') : t('visa.inactive')}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Боковая панель - Контакты */}
            <div className="space-y-8">
              {/* Контактная информация */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                    👥
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">
                    {t('visa.contacts')}
                  </h2>
                </div>
                
                {backendData.contacts.length > 0 ? (
                  <div className="space-y-6">
                    {backendData.contacts.map((contact, index) => (
                      <motion.div
                        key={contact.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                      >
                        <div className="text-center mb-4">
                          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                            👤
                          </div>
                          <h3 className="font-bold text-white text-lg">{contact.full_name}</h3>
                          <p className="text-emerald-300 text-sm">{contact.position}</p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-300">
                              📧
                            </div>
                            <div className="flex-1">
                              <p className="text-blue-200 text-xs">{t('visa.email')}</p>
                              <a 
                                href={`mailto:${contact.email}`}
                                className="text-white text-sm font-medium hover:text-emerald-300 transition-colors"
                              >
                                {contact.email}
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-300">
                              📱
                            </div>
                            <div className="flex-1">
                              <p className="text-blue-200 text-xs">{t('visa.phone')}</p>
                              <a 
                                href={`tel:${contact.phone}`}
                                className="text-white text-sm font-medium hover:text-emerald-300 transition-colors"
                              >
                                {contact.phone}
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-300">
                              🏢
                            </div>
                            <div className="flex-1">
                              <p className="text-blue-200 text-xs">{t('visa.office')}</p>
                              <p className="text-white text-sm font-medium">{contact.office_location}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-300">
                              🕒
                            </div>
                            <div className="flex-1">
                              <p className="text-blue-200 text-xs">{t('visa.hours')}</p>
                              <p className="text-white text-sm font-medium">{contact.office_hours}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-blue-300">{t('visa.order')}: {contact.order}</span>
                            <span className={`px-2 py-1 rounded-full ${
                              contact.is_active 
                                ? 'bg-green-500/20 text-green-300' 
                                : 'bg-red-500/20 text-red-300'
                            }`}>
                              {contact.is_active ? t('visa.active') : t('visa.inactive')}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-blue-200">
                    {t('visa.noContacts')}
                  </div>
                )}
              </motion.div>

              {/* Быстрые действия */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                  {t('visa.quickActions')}
                </h2>
                
                <div className="space-y-4">
                  <motion.a
                    href="mailto:visa-support@university.edu"
                    className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl border border-blue-400/30 hover:border-emerald-400 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-blue-300 group-hover:text-emerald-300 transition-colors duration-300">
                      📧
                    </span>
                    <span className="text-white font-semibold group-hover:text-emerald-300 transition-colors duration-300">
                      {t('visa.emailSupport')}
                    </span>
                  </motion.a>
                  
                  <motion.button
                    className="w-full flex items-center justify-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-emerald-300 group-hover:text-blue-300 transition-colors duration-300">
                      📋
                    </span>
                    <span className="text-white font-semibold group-hover:text-blue-300 transition-colors duration-300">
                      {t('visa.downloadForms')}
                    </span>
                  </motion.button>
                  
                  <motion.button
                    className="w-full flex items-center justify-center space-x-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <span className="text-blue-300 group-hover:text-emerald-300 transition-colors duration-300">
                      🗓️
                    </span>
                    <span className="text-white font-semibold group-hover:text-emerald-300 transition-colors duration-300">
                      {t('visa.scheduleAppointment')}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VisaSupport;