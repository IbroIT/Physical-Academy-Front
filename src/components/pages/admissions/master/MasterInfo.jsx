// GraduateStudies.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const GraduateStudies = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('master');
  const [activeProgram, setActiveProgram] = useState(0);
  const [activeRequirement, setActiveRequirement] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedRequirement, setExpandedRequirement] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    program: ''
  });
  
  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    master: {
      documents: [],
      programs: [],
      dates: [],
      requirements: [],
      loading: false,
      error: null
    },
    aspirant: {
      documents: [],
      programs: [],
      dates: [],
      requirements: [],
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
const fetchBackendData = useCallback(async (type) => {
  try {
    setBackendData(prev => ({ 
      ...prev, 
      [type]: { ...prev[type], loading: true, error: null } 
    }));
    
    const lang = getApiLanguage();
    
  const API_URL = import.meta.env.VITE_API_URL;

  const endpoints = {
    master: [
      `${API_URL}/api/admission/master-documents/?lang=${lang}`,
      `${API_URL}/api/admission/master-programs/?lang=${lang}`,
      `${API_URL}/api/admission/master-main-dates/?lang=${lang}`,
      `${API_URL}/api/admission/master-requirements/?lang=${lang}`
    ],
    aspirant: [
      `${API_URL}/api/admission/aspirant-documents/?lang=${lang}`,
      `${API_URL}/api/admission/aspirant-programs/?lang=${lang}`,
      `${API_URL}/api/admission/aspirant-main-dates/?lang=${lang}`,
      `${API_URL}/api/admission/aspirant-requirements/?lang=${lang}`
    ]
  };


    const responses = await Promise.all(
      endpoints[type].map(async (url) => {
        try {
          const response = await fetch(url);
          
          // Проверяем content-type
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.warn(`Non-JSON response from ${url}:`, text.substring(0, 200));
            return { results: [] };
          }
          
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

    setBackendData(prev => ({
      ...prev,
      [type]: {
        documents: responses[0].results || [],
        programs: responses[1].results || [],
        dates: responses[2].results || [],
        requirements: responses[3].results || [],
        loading: false,
        error: null
      }
    }));

  } catch (error) {
    console.error(`Error fetching ${type} data:`, error);
    setBackendData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        loading: false,
        error: 'Failed to load data'
      }
    }));
  }
}, [getApiLanguage]);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchBackendData('master');
    fetchBackendData('aspirant');
  }, []); // Убрали fetchBackendData из зависимостей

  // Перезагрузка данных при изменении языка
  useEffect(() => {
    const currentType = activeTab === 'master' ? 'master' : 'aspirant';
    fetchBackendData(currentType);
  }, [i18n.language, activeTab]); // Убрали fetchBackendData из зависимостей

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

  // Автопереключение программ и требований
  useEffect(() => {
    const currentData = backendData[activeTab === 'master' ? 'master' : 'aspirant'];
    if (currentData.programs.length > 0 && currentData.requirements.length > 0) {
      const interval = setInterval(() => {
        setActiveProgram(prev => (prev + 1) % currentData.programs.length);
        setActiveRequirement(prev => (prev + 1) % currentData.requirements.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeTab, backendData]);

  const commonInfo = t('graduateStudies.commonInfo', { returnObjects: true });

  // Получение текущих данных в зависимости от активной вкладки
  const getCurrentData = () => {
    const dataType = activeTab === 'master' ? 'master' : 'aspirant';
    return backendData[dataType];
  };

  const getCurrentPrograms = () => {
  const currentData = getCurrentData();
  return currentData.programs.map(program => ({
    name: program.program_name,
    field: program.description,
    // Преобразуем features в массив, если это строка
    tags: Array.isArray(program.features)
      ? program.features
      : typeof program.features === 'string'
      ? program.features.split(',').map(tag => tag.trim())
      : []
  }));
};


  const getCurrentRequirements = () => {
    const currentData = getCurrentData();
    return currentData.requirements.map(req => ({
      title: req.title,
      description: req.description
    }));
  };

  const getCurrentDocuments = () => {
    const currentData = getCurrentData();
    return currentData.documents.map(doc => ({
      title: doc.document_name,
      format: doc.file?.split('.').pop()?.toUpperCase() || 'PDF',
      type: 'pdf',
      link: doc.file
    }));
  };

  const getCurrentDates = () => {
    const currentData = getCurrentData();
    return currentData.dates.map(date => ({
      event: date.event_name,
      date: date.date
    }));
  };

  const currentData = getCurrentData();
  const currentPrograms = getCurrentPrograms();
  const currentRequirements = getCurrentRequirements();
  const currentDocuments = getCurrentDocuments();
  const currentDates = getCurrentDates();

  const toggleRequirement = (index) => {
    setExpandedRequirement(expandedRequirement === index ? null : index);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Здесь можно добавить отправку формы на соответствующий эндпоинт
      const response = await fetch('/api/admission/application/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          program_type: activeTab,
          language: getApiLanguage()
        })
      });

      if (response.ok) {
        alert(t('graduateStudies.formSuccess'));
        setFormData({ name: '', email: '', program: '' });
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert(t('graduateStudies.formError'));
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveProgram(0);
    setActiveRequirement(0);
    setExpandedRequirement(null);
  };

  const stats = [
    { number: '95%', label: t('graduateStudies.stats.employment'), icon: '💼' },
    { number: '50+', label: t('graduateStudies.stats.professors'), icon: '👨‍🏫' },
    { number: '30+', label: t('graduateStudies.stats.researchLabs'), icon: '🔬' },
    { number: '80%', label: t('graduateStudies.stats.funding'), icon: '💰' }
  ];

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
  const ErrorMessage = ({ onRetry, type }) => (
    <div className="text-center py-8">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl text-white mb-4">
        {t('graduateStudies.errorTitle')}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData[type].error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t('graduateStudies.retry')}
      </button>
    </div>
  );

  // Проверка загрузки и ошибок для текущей вкладки
  const isCurrentTabLoading = currentData.loading;
  const isCurrentTabError = currentData.error;

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон с спортивными элементами */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Спортивные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏃‍♂️</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🏆</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">⚽</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🏅</div>
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
            {t('graduateStudies.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('graduateStudies.subtitle')}
          </p>
        </motion.div>

        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-blue-200 text-sm lg:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Навигация вкладок */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center mb-12 lg:mb-16"
        >
          <div className="bg-white/5 rounded-2xl p-2 backdrop-blur-lg border border-white/20 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTabChange('master')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 ${
                  activeTab === 'master'
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-2xl">🎓</span>
                <span>{t('graduateStudies.masterTitle')}</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTabChange('aspirant')}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 ${
                  activeTab === 'aspirant'
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="text-2xl">📚</span>
                <span>{t('graduateStudies.phdTitle')}</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {isCurrentTabError ? (
          <ErrorMessage 
            onRetry={() => fetchBackendData(activeTab === 'master' ? 'master' : 'aspirant')}
            type={activeTab === 'master' ? 'master' : 'aspirant'}
          />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Основной контент */}
            <div className="lg:col-span-2 space-y-8">
              {/* Общая информация */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                {isCurrentTabLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                        ℹ️
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white">
                        {t('graduateStudies.generalInfo')}
                      </h2>
                    </div>
                    
                    <div className="prose prose-lg max-w-none">
                      <p className="text-blue-100 text-lg leading-relaxed mb-6 border-l-4 border-emerald-400 pl-6 py-2 bg-white/5 rounded-r-2xl">
                        {commonInfo.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300 group">
                          <h4 className="font-bold text-blue-300 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
                            {t('graduateStudies.duration')}
                          </h4>
                          <p className="text-white text-lg font-semibold">{commonInfo.duration}</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group">
                          <h4 className="font-bold text-emerald-300 mb-3 flex items-center">
                            <span className="w-3 h-3 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
                            {t('graduateStudies.format')}
                          </h4>
                          <p className="text-white text-lg font-semibold">{commonInfo.format}</p>
                        </div>
                      </div>

                      {commonInfo.features && (
                        <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 border border-white/10">
                          <h4 className="font-bold text-white text-xl mb-6 flex items-center">
                            <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">⭐</span>
                            {t('graduateStudies.keyFeatures')}
                          </h4>
                          <ul className="space-y-4">
                            {commonInfo.features.map((feature, index) => (
                              <motion.li 
                                key={index} 
                                className="flex items-start group"
                                whileHover={{ x: 5 }}
                              >
                                <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                                <span className="text-blue-100 text-lg group-hover:text-white transition-colors duration-300">{feature}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>

              {/* Программы и требования */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                {isCurrentTabLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                        📋
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white">
                        {t('graduateStudies.programsAndRequirements')}
                      </h2>
                    </div>

                    {/* Активная программа */}
                    {currentPrograms.length > 0 && (
                      <motion.div
                        key={activeProgram}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm border border-white/20 mb-6"
                      >
                        <div className="flex flex-col lg:flex-row gap-6 items-center">
                          <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                            🎯
                          </div>
                          <div className="flex-1 text-center lg:text-left">
                            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                              {currentPrograms[activeProgram]?.name}
                            </h3>
                            <p className="text-blue-200 mb-3">
                              {currentPrograms[activeProgram]?.field}
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                              {currentPrograms[activeProgram]?.tags.map((tag, tagIndex) => (
                                <span
                                  key={tagIndex}
                                  className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Все программы */}
                    {currentPrograms.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4 mb-8">
                        {currentPrograms.map((program, index) => (
                          <motion.div
                            key={index}
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
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                                🎓
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white truncate">
                                  {program.name}
                                </h4>
                                <p className="text-blue-200 text-sm truncate">
                                  {program.field}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-blue-200">
                        {t('graduateStudies.noPrograms')}
                      </div>
                    )}

                    {/* Требования к поступлению */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <span className="w-2 h-8 bg-emerald-400 rounded mr-3"></span>
                        {t('graduateStudies.admissionRequirements')}
                      </h3>
                      {currentRequirements.length > 0 ? (
                        <div className="space-y-4">
                          {currentRequirements.map((requirement, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 overflow-hidden"
                              whileHover={{ scale: 1.01 }}
                            >
                              <button
                                onClick={() => toggleRequirement(index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-300"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-white text-lg">
                                      {requirement.title}
                                    </h4>
                                  </div>
                                </div>
                                <svg
                                  className={`w-6 h-6 text-blue-300 transition-transform duration-300 ${
                                    expandedRequirement === index ? 'rotate-180' : ''
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              <AnimatePresence>
                                {expandedRequirement === index && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <div className="px-6 pb-6">
                                      <div className="border-t border-white/20 pt-4">
                                        <p className="text-blue-100 leading-relaxed">{requirement.description}</p>
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
                          {t('graduateStudies.noRequirements')}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            </div>

            {/* Боковая панель */}
            <div className="space-y-8">
             
                
                
                  
                  
              {/* Документы */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                {isCurrentTabLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                        📄
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white">
                        {t('graduateStudies.documents')}
                      </h2>
                    </div>
                    
                    {currentDocuments.length > 0 ? (
                      <div className="space-y-4">
                        {currentDocuments.map((doc, index) => (
                          <motion.a
                            key={index}
                            href={doc.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-center space-x-4">
                              <span className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${
                                doc.type === 'pdf' ? 'text-red-400' : 
                                doc.type === 'doc' ? 'text-blue-400' : 'text-emerald-400'
                              }`}>
                                {doc.type === 'pdf' ? '📕' : doc.type === 'doc' ? '📘' : '📋'}
                              </span>
                              <div>
                                <h4 className="font-semibold text-white group-hover:text-emerald-300 transition-colors duration-300">
                                  {doc.title}
                                </h4>
                                <p className="text-blue-300 text-sm">{doc.format}</p>
                              </div>
                            </div>
                            <span className="text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110 transition-all duration-300">↓</span>
                          </motion.a>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-blue-200">
                        {t('graduateStudies.noDocuments')}
                      </div>
                    )}
                  </>
                )}
              </motion.div>

              {/* Важные даты */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                {isCurrentTabLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                        📅
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-white">
                        {t('graduateStudies.importantDates')}
                      </h2>
                    </div>
                    
                    {currentDates.length > 0 ? (
                      <div className="space-y-4">
                        {currentDates.map((date, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                            whileHover={{ scale: 1.01 }}
                          >
                            <span className="text-blue-200 font-medium group-hover:text-white transition-colors duration-300">
                              {date.event}
                            </span>
                            <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-semibold group-hover:bg-emerald-500/30 group-hover:scale-105 transition-all duration-300">
                              {date.date}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-blue-200">
                        {t('graduateStudies.noDates')}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GraduateStudies;