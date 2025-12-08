import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Scholarship = () => {
  const { t, i18n } = useTranslation();
  const [activeProgram, setActiveProgram] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedDocument, setExpandedDocument] = useState(null);
  
  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    documents: [],
    programs: [],
    pageData: null,
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

      const endpoints = [
        `${API_URL}/api/student-clubs/scholarship/documents/?lang=${lang}`,
        `${API_URL}/api/student-clubs/scholarship/programs/?lang=${lang}`,
        `${API_URL}/api/student-clubs/scholarship-page/?lang=${lang}`
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
            return { results: [], scholarships: [] };
          }
        })
      );

      setBackendData({
        documents: responses[0].results || [],
        programs: responses[1].results || [],
        pageData: responses[2] || null,
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching scholarship data:', error);
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

  // Автопереключение программ
  useEffect(() => {
    if (backendData.programs.length > 1) {
      const interval = setInterval(() => {
        setActiveProgram(prev => (prev + 1) % backendData.programs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [backendData.programs.length]);

  const toggleDocument = (index) => {
    setExpandedDocument(expandedDocument === index ? null : index);
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
        {t('scholarship.errorTitle')}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData.error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t('scholarship.retry')}
      </button>
    </div>
  );

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
        
        {/* Символы стипендий */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">💰</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🎓</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">⭐</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🏆</div>
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
            {t('scholarship.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('scholarship.subtitle')}
          </p>
        </motion.div>

        

        {backendData.error ? (
          <ErrorMessage onRetry={fetchBackendData} />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Основной контент */}
            <div className="lg:col-span-2 space-y-8">
              {/* Стипендиальные программы */}
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
                        🎯
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white">
                        {t('scholarship.programs')}
                      </h2>
                    </div>

                    {/* Активная программа */}
                    {backendData.programs.length > 0 && (
                      <motion.div
                        key={activeProgram}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm border border-white/20 mb-6"
                      >
                        <div className="flex flex-col lg:flex-row gap-6 items-start">
                          <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                            💰
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3">
                              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 lg:mb-0">
                                {backendData.programs[activeProgram]?.name}
                              </h3>
                              <div className="bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full font-bold">
                                {backendData.programs[activeProgram]?.amount} {backendData.programs[activeProgram]?.currency}
                              </div>
                            </div>
                            <p className="text-blue-200 mb-4 leading-relaxed">
                              {backendData.programs[activeProgram]?.description}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center text-emerald-300">
                                <span className="mr-2">📅</span>
                                <span>
                                  {t('scholarship.deadline')}: {backendData.programs[activeProgram]?.application_deadline}
                                </span>
                              </div>
                              <div className="flex items-center text-blue-300">
                                <span className="mr-2">📧</span>
                                <span>{backendData.programs[activeProgram]?.contact_email}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Все программы */}
                    {backendData.programs.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {backendData.programs.map((program, index) => (
                          <motion.div
                            key={program.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-2xl backdrop-blur-sm border cursor-pointer transition-all duration-300 ${
                              activeProgram === index
                                ? 'bg-white/10 border-emerald-400/50 shadow-lg'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                            onClick={() => setActiveProgram(index)}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                                💸
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white truncate mb-1">
                                  {program.name}
                                </h4>
                                <p className="text-blue-200 text-sm mb-2 line-clamp-2">
                                  {program.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-emerald-400 font-bold text-sm">
                                    {program.amount} {program.currency}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    program.is_active 
                                      ? 'bg-green-500/20 text-green-300' 
                                      : 'bg-red-500/20 text-red-300'
                                  }`}>
                                    {program.is_active ? t('scholarship.active') : t('scholarship.inactive')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-blue-200">
                        {t('scholarship.noPrograms')}
                      </div>
                    )}
                  </>
                )}
              </motion.div>

              {/* Требуемые документы */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                {backendData.loading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                        📄
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white">
                        {t('scholarship.requiredDocuments')}
                      </h2>
                    </div>
                    
                    {backendData.documents.length > 0 ? (
                      <div className="space-y-4">
                        {backendData.documents.map((document, index) => (
                          <motion.div
                            key={document.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 overflow-hidden"
                            whileHover={{ scale: 1.01 }}
                          >
                            <button
                              onClick={() => toggleDocument(index)}
                              className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-300"
                            >
                              <div className="flex items-center space-x-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                                  document.is_required 
                                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500' 
                                    : 'bg-gray-500'
                                }`}>
                                  {document.is_required ? '!' : '?'}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-white text-lg">
                                    {document.name}
                                  </h4>
                                  <p className="text-blue-300 text-sm">
                                    {document.is_required 
                                      ? t('scholarship.required') 
                                      : t('scholarship.optional')}
                                  </p>
                                </div>
                              </div>
                              <svg
                                className={`w-6 h-6 text-blue-300 transition-transform duration-300 ${
                                  expandedDocument === index ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <AnimatePresence>
                              {expandedDocument === index && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="px-6 pb-6">
                                    <div className="border-t border-white/20 pt-4">
                                      <p className="text-blue-100 leading-relaxed">{document.description}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-blue-200">
                        {t('scholarship.noDocuments')}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </div>

            {/* Боковая панель */}
            <div className="space-y-8">
              {/* Контактная информация */}
              {backendData.programs.length > 0 && backendData.programs[activeProgram] && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                      📞
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white">
                      {t('scholarship.contactInfo')}
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-300 group-hover:scale-110 transition-transform duration-300">
                        📧
                      </div>
                      <div>
                        <p className="text-blue-200 text-sm">{t('scholarship.email')}</p>
                        <p className="text-white font-medium">{backendData.programs[activeProgram]?.contact_email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-300 group">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform duration-300">
                        📱
                      </div>
                      <div>
                        <p className="text-blue-200 text-sm">{t('scholarship.phone')}</p>
                        <p className="text-white font-medium">{backendData.programs[activeProgram]?.contact_phone}</p>
                      </div>
                    </div>
                    
                    {backendData.programs[activeProgram]?.application_link && (
                      <motion.a
                        href={backendData.programs[activeProgram]?.application_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center space-x-3 p-4 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl border border-blue-400/30 hover:border-emerald-400 transition-all duration-300 group"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-blue-300 group-hover:text-emerald-300 transition-colors duration-300">
                          🌐
                        </span>
                        <span className="text-white font-semibold group-hover:text-emerald-300 transition-colors duration-300">
                          {t('scholarship.applyOnline')}
                        </span>
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Сроки подачи */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                    ⏰
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white">
                    {t('scholarship.deadlines')}
                  </h2>
                </div>
                
                {backendData.programs.length > 0 ? (
                  <div className="space-y-4">
                    {backendData.programs.map((program, index) => (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                        whileHover={{ scale: 1.01 }}
                      >
                        <span className="text-blue-200 font-medium group-hover:text-white transition-colors duration-300 truncate mr-2">
                          {program.name}
                        </span>
                        <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap group-hover:bg-emerald-500/30 group-hover:scale-105 transition-all duration-300">
                          {program.application_deadline}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-blue-200">
                    {t('scholarship.noDeadlines')}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Scholarship;