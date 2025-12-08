import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Accreditation = () => {
  const { t, i18n } = useTranslation();
  const [activeAccreditation, setActiveAccreditation] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedAccreditation, setExpandedAccreditation] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const API_URL = import.meta.env.VITE_API_URL;

  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    accreditations: [],
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
      const response = await fetch(`${API_URL}/api/academy/accreditations/?lang=${lang}`);

      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setBackendData({
        accreditations: data.results || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching accreditation data:', error);
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

  // Автопереключение аккредитаций
  useEffect(() => {
    const filteredAccreditations = getFilteredAccreditations();
    if (filteredAccreditations.length > 1) {
      const interval = setInterval(() => {
        setActiveAccreditation(prev => (prev + 1) % filteredAccreditations.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [backendData.accreditations, selectedType]);

  const toggleAccreditation = (index) => {
    setExpandedAccreditation(expandedAccreditation === index ? null : index);
  };

  // Получение уникальных типов аккредитаций
  const getAccreditationTypes = () => {
    const types = backendData.accreditations.map(acc => acc.accreditation_type?.name).filter(Boolean);
    return ['all', ...new Set(types)];
  };

  // Фильтрация аккредитаций по типу
  const getFilteredAccreditations = () => {
    if (selectedType === 'all') {
      return backendData.accreditations;
    }
    return backendData.accreditations.filter(acc => acc.accreditation_type?.name === selectedType);
  };

  // Компонент загрузки
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="bg-white/10 rounded-2xl h-8 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white/5 rounded-3xl p-6 space-y-4">
            <div className="bg-white/10 rounded-2xl h-48"></div>
            <div className="bg-white/10 rounded-2xl h-4"></div>
            <div className="bg-white/10 rounded-2xl h-4 w-3/4"></div>
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
        {t('accreditation.errorTitle')}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData.error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t('accreditation.retry')}
      </button>
    </div>
  );

  // Функция для получения иконки типа аккредитации
  const getAccreditationIcon = (typeName) => {
    const iconMap = {
      'международный': '🌍',
      'национальный': '🇰🇬',
      'региональный': '🏛️',
      'default': '🏅'
    };
    
    // Поиск по ключам (частичное совпадение)
    for (const [key, icon] of Object.entries(iconMap)) {
      if (typeName?.toLowerCase().includes(key)) {
        return icon;
      }
    }
    return iconMap.default;
  };

  const filteredAccreditations = getFilteredAccreditations();
  const accreditationTypes = getAccreditationTypes();

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
        
        {/* Символы аккредитации */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏅</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">📜</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">⭐</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🌍</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('accreditation.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('accreditation.subtitle')}
          </p>
        </motion.div>

        {backendData.error ? (
          <ErrorMessage onRetry={fetchBackendData} />
        ) : (
          <>
            {/* Фильтры по типам */}
            {accreditationTypes.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex justify-center mb-8 lg:mb-12"
              >
                <div className="bg-white/5 rounded-2xl p-2 backdrop-blur-lg border border-white/20 shadow-2xl">
                  <div className="flex flex-wrap justify-center gap-2">
                    {accreditationTypes.map((type) => (
                      <motion.button
                        key={type}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedType(type);
                          setActiveAccreditation(0);
                        }}
                        className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                          selectedType === type
                            ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                            : 'text-blue-200 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="text-lg">
                          {type === 'all' ? '📋' : getAccreditationIcon(type)}
                        </span>
                        <span>
                          {type === 'all' 
                            ? t('accreditation.all') 
                            : type
                          }
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Активная аккредитация */}
            {filteredAccreditations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-12 lg:mb-16"
              >
                <motion.div
                  key={activeAccreditation}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-6 lg:p-8 backdrop-blur-sm border border-white/20"
                >
                  <div className="flex flex-col lg:flex-row gap-8 items-center">
                    {/* Фото аккредитации */}
                    <div className="flex-shrink-0 w-full lg:w-96">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative rounded-2xl overflow-hidden shadow-2xl"
                      >
                        <img
                          src={filteredAccreditations[activeAccreditation]?.photo}
                          alt={filteredAccreditations[activeAccreditation]?.organization}
                          className="w-full h-64 lg:h-80 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        {filteredAccreditations[activeAccreditation]?.logo && (
                          <div className="absolute bottom-4 right-4 w-16 h-16 bg-white rounded-xl p-2 shadow-lg">
                            <img
                              src={filteredAccreditations[activeAccreditation]?.logo}
                              alt="Logo"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {/* Информация об аккредитации */}
                    <div className="flex-1 text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                        <span className="text-2xl">
                          {getAccreditationIcon(filteredAccreditations[activeAccreditation]?.accreditation_type?.name)}
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-semibold">
                          {filteredAccreditations[activeAccreditation]?.accreditation_type?.name}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                        {filteredAccreditations[activeAccreditation]?.organization}
                      </h3>
                      
                      <p className="text-blue-200 mb-6 leading-relaxed">
                        {filteredAccreditations[activeAccreditation]?.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                          <h4 className="font-bold text-blue-300 mb-2 text-sm">
                            {t('accreditation.validity')}
                          </h4>
                          <p className="text-white font-semibold">
                            {filteredAccreditations[activeAccreditation]?.validity}
                          </p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                          <h4 className="font-bold text-emerald-300 mb-2 text-sm">
                            {t('accreditation.certificateNumber')}
                          </h4>
                          <p className="text-white font-semibold font-mono">
                            {filteredAccreditations[activeAccreditation]?.certificate_number}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Все аккредитации */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {backendData.loading ? (
                <LoadingSkeleton />
              ) : filteredAccreditations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {filteredAccreditations.map((accreditation, index) => (
                    <motion.div
                      key={accreditation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`bg-white/5 rounded-3xl backdrop-blur-sm border cursor-pointer transition-all duration-300 overflow-hidden ${
                        activeAccreditation === index
                          ? 'bg-white/10 border-emerald-400/50 shadow-2xl'
                          : 'border-white/10 hover:bg-white/10 hover:border-emerald-400/30'
                      }`}
                      onClick={() => {
                        setActiveAccreditation(index);
                        setExpandedAccreditation(expandedAccreditation === index ? null : index);
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {/* Карточка аккредитации */}
                      <div className="relative">
                        <img
                          src={accreditation.photo}
                          alt={accreditation.organization}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-2">
                          <span>{getAccreditationIcon(accreditation.accreditation_type?.name)}</span>
                          <span>{accreditation.accreditation_type?.name}</span>
                        </div>
                        {accreditation.logo && (
                          <div className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-lg p-1 shadow-lg">
                            <img
                              src={accreditation.logo}
                              alt="Logo"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h4 className="font-bold text-white text-lg mb-3 line-clamp-2">
                          {accreditation.organization}
                        </h4>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-emerald-300 text-sm font-semibold">
                            {accreditation.validity}
                          </span>
                          <span className="text-blue-300 text-xs font-mono bg-white/10 px-2 py-1 rounded">
                            #{accreditation.certificate_number}
                          </span>
                        </div>

                        <p className="text-blue-200 text-sm line-clamp-3 mb-4">
                          {accreditation.description}
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAccreditation(index);
                          }}
                          className="w-full flex items-center justify-center space-x-2 py-2 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
                        >
                          <span className="text-blue-300 text-sm">
                            {expandedAccreditation === index 
                              ? t('accreditation.showLess') 
                              : t('accreditation.showMore')
                            }
                          </span>
                          <svg
                            className={`w-4 h-4 text-blue-300 transition-transform duration-300 ${
                              expandedAccreditation === index ? 'rotate-180' : ''
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
                        {expandedAccreditation === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-6 border-t border-white/10 pt-4">
                              <div className="space-y-4">
                                <div>
                                  <h5 className="font-semibold text-white mb-2">
                                    {t('accreditation.fullDescription')}
                                  </h5>
                                  <p className="text-blue-100 text-sm leading-relaxed">
                                    {accreditation.description}
                                  </p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="bg-white/5 rounded-xl p-3">
                                    <p className="text-blue-300 mb-1">{t('accreditation.type')}</p>
                                    <p className="text-white font-semibold">
                                      {accreditation.accreditation_type?.name}
                                    </p>
                                  </div>
                                  <div className="bg-white/5 rounded-xl p-3">
                                    <p className="text-emerald-300 mb-1">{t('accreditation.certificate')}</p>
                                    <p className="text-white font-semibold font-mono">
                                      {accreditation.certificate_number}
                                    </p>
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
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 text-blue-300">🏅</div>
                  <h3 className="text-xl text-white mb-2">
                    {t('accreditation.noAccreditations')}
                  </h3>
                  <p className="text-blue-200">
                    {selectedType === 'all' 
                      ? t('accreditation.noAccreditationsDescription')
                      : t('accreditation.noFilteredAccreditations')
                    }
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default Accreditation;