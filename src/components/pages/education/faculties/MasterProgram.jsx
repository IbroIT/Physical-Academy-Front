// MasterProgram.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const MasterProgram = () => {
  const { t, i18n } = useTranslation();
  const [activeProgram, setActiveProgram] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  
  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    programs: [],
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

      const response = await fetch(`${API_URL}/api/education/master-programs/?lang=${lang}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid content type');
      }
      
      const data = await response.json();
      
      setBackendData({
        programs: data.results || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching master programs:', error);
      setBackendData({
        programs: [],
        loading: false,
        error: 'Failed to load programs data'
      });
    }
  }, [getApiLanguage]);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchBackendData();
  }, []);

  // Перезагрузка данных при изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [i18n.language]);

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

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Преобразование данных с бэкенда в формат компонента
  const getFormattedPrograms = useCallback(() => {
    return backendData.programs.map((program, index) => ({
      id: program.id || index,
      title: program.name,
      duration: `${program.duration_years} ${t('master.years')}`,
      format: program.offline ? t('master.offline') : t('master.online'),
      description: program.description,
      features: Array.isArray(program.features) 
        ? program.features 
        : typeof program.features === 'string'
        ? program.features.split(',').map(f => f.trim())
        : [],
      price: `${program.tuition_fee} ${t('master.currency')}`,
      icon: program.emoji || '🎓',
      color: getProgramColor(index),
      hoverColor: getProgramHoverColor(index)
    }));
  }, [backendData.programs, t]);

  const getProgramColor = (index) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-blue-500 to-green-500',
      'from-green-500 to-blue-500',
      'from-purple-500 to-pink-500',
      'from-orange-500 to-red-500'
    ];
    return colors[index % colors.length];
  };

  const getProgramHoverColor = (index) => {
    const colors = [
      'from-blue-600 to-blue-700',
      'from-green-600 to-green-700',
      'from-blue-600 to-green-600',
      'from-green-600 to-blue-600',
      'from-purple-600 to-pink-600',
      'from-orange-600 to-red-600'
    ];
    return colors[index % colors.length];
  };

  const formattedPrograms = getFormattedPrograms();

  const handleProgramClick = (index) => {
    setActiveProgram(index);
  };

  const handleLearnMore = (program) => {
    setSelectedProgram(program);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProgram(null);
  };

  // Компонент загрузки
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      {/* Заголовок скелетон */}
      <div className="text-center mb-12">
        <div className="bg-white/10 rounded-2xl h-12 w-3/4 mx-auto mb-4"></div>
        <div className="bg-white/10 rounded-2xl h-4 w-1/2 mx-auto mb-3"></div>
        <div className="bg-white/10 rounded-2xl h-4 w-2/3 mx-auto"></div>
      </div>
      
      {/* Программы скелетон */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white/10 rounded-2xl p-6">
            <div className="bg-white/10 rounded-2xl w-16 h-16 mx-auto mb-4"></div>
            <div className="bg-white/10 rounded-2xl h-6 w-3/4 mx-auto mb-3"></div>
            <div className="bg-white/10 rounded-2xl h-4 w-full mb-2"></div>
            <div className="bg-white/10 rounded-2xl h-4 w-2/3"></div>
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
        {t('master.errorTitle')}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData.error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t('master.retry')}
      </button>
    </div>
  );

  if (backendData.error) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <ErrorMessage onRetry={fetchBackendData} />
        </div>
      </section>
    );
  }

  return (
    <>
      <section 
        ref={sectionRef}
        className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden"
      >
        {/* Анимированный фон */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Заголовок */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
              {t('master.title')}
            </h1>
            <div className="w-20 h-1 bg-green-400 mx-auto mb-3 md:mb-4"></div>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4">
              {t('master.subtitle')}
            </p>
          </motion.div>

          {backendData.loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* Основные программы */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-12 md:mb-16"
              >
                {formattedPrograms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {formattedPrograms.map((program, index) => (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 border border-white/20 shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer ${
                          activeProgram === index ? 'ring-2 ring-green-400 ring-opacity-50' : ''
                        }`}
                        onClick={() => handleProgramClick(index)}
                      >
                        {/* Иконка программы */}
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${program.color} flex items-center justify-center text-2xl mb-4 mx-auto`}>
                          {program.icon}
                        </div>

                        {/* Заголовок */}
                        <h3 className="text-xl font-bold text-white text-center mb-3 line-clamp-2">
                          {program.title}
                        </h3>

                        {/* Длительность и формат */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-green-300 text-sm font-semibold bg-green-500/20 px-2 py-1 rounded-lg">
                            {program.duration}
                          </span>
                          <span className="text-blue-300 text-sm bg-blue-500/20 px-2 py-1 rounded-lg">
                            {program.format}
                          </span>
                        </div>

                        {/* Описание */}
                        <p className="text-blue-100 text-sm mb-4 line-clamp-3">
                          {program.description}
                        </p>

                        {/* Цена */}
                        <div className="text-center mb-4">
                          <span className="text-2xl font-bold text-white">{program.price}</span>
                        </div>

                        {/* Кнопка */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLearnMore(program);
                          }}
                          className={`w-full bg-gradient-to-r ${program.color} hover:${program.hoverColor} text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
                        >
                          {t('master.learnMore')}
                        </button>

                        {/* Индикатор активной программы */}
                        {activeProgram === index && (
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-2xl text-white mb-2">{t('master.noPrograms')}</h3>
                    <p className="text-blue-200">{t('master.noProgramsDescription')}</p>
                  </div>
                )}
              </motion.div>

              {/* Детали активной программы */}
              {formattedPrograms.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
                    <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                      {/* Основная информация */}
                      <div className="lg:w-2/3">
                        <div className="flex items-start mb-6">
                          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${formattedPrograms[activeProgram].color} flex items-center justify-center text-3xl mr-4 md:mr-6`}>
                            {formattedPrograms[activeProgram].icon}
                          </div>
                          <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                              {formattedPrograms[activeProgram].title}
                            </h2>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-green-300 font-semibold bg-green-500/20 px-3 py-1 rounded-lg">
                                {formattedPrograms[activeProgram].duration}
                              </span>
                              <span className="text-blue-300 bg-blue-500/20 px-3 py-1 rounded-lg">
                                {formattedPrograms[activeProgram].format}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-blue-100 text-lg mb-6">
                          {formattedPrograms[activeProgram].description}
                        </p>

                        {/* Особенности программы */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formattedPrograms[activeProgram].features.map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center bg-white/5 rounded-xl p-4 border border-white/10 hover:border-green-400/30 transition-all duration-300 group"
                            >
                              <div className="w-8 h-8 bg-green-400/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-green-400/30 transition-colors">
                                <span className="text-green-300">✓</span>
                              </div>
                              <span className="text-white group-hover:text-green-300 transition-colors">
                                {feature}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Боковая панель с действиями */}
                      <div className="lg:w-1/3">
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 sticky top-6">
                          <div className="text-center mb-6">
                            <div className="text-3xl font-bold text-white mb-2">
                              {formattedPrograms[activeProgram].price}
                            </div>
                            <div className="text-blue-200">{t('master.perYear')}</div>
                          </div>

                          <div className="space-y-4">
                            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all duration-300 border border-white/20">
                              {t('master.downloadBrochure')}
                            </button>
                          </div>

                          {/* Дополнительная информация */}
                          <div className="mt-6 pt-6 border-t border-white/10">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-blue-200">{t('master.startDate')}</span>
                              <span className="text-white font-semibold">{t('master.september')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-blue-200">{t('master.places')}</span>
                              <span className="text-green-300 font-semibold">25</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Преимущества обучения */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-12 md:mt-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 md:mb-12">
                  {t('master.advantagesTitle')}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {[1, 2, 3, 4].map((item) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + item * 0.1 }}
                      className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 text-center group hover:border-green-400/30 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">
                          {item === 1 && '👨‍🎓'}
                          {item === 2 && '🌍'}
                          {item === 3 && '💼'}
                          {item === 4 && '🏆'}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-lg md:text-xl mb-2">
                        {t(`master.advantages.${item-1}.title`)}
                      </h4>
                      <p className="text-blue-100 text-sm md:text-base">
                        {t(`master.advantages.${item-1}.description`)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Плавающие элементы для десктопа */}
        {!isMobile && (
          <>
            <div className="absolute bottom-20 left-5 w-6 h-6 bg-green-400/20 rounded-full animate-bounce"></div>
            <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping"></div>
          </>
        )}
      </section>

      {/* Модальное окно */}
      <AnimatePresence>
        {showModal && selectedProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-blue-900 to-green-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl"
            >
              <div className="p-6 md:p-8">
                {/* Заголовок */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${selectedProgram.color} flex items-center justify-center text-2xl mr-4`}>
                      {selectedProgram.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white">
                        {selectedProgram.title}
                      </h2>
                      <p className="text-green-300">{selectedProgram.duration}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Контент */}
                <div className="space-y-6">
                  <p className="text-blue-100 text-lg">
                    {selectedProgram.description}
                  </p>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {t('master.programFeatures')}
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {selectedProgram.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center mr-3">
                            <span className="text-green-300 text-sm">✓</span>
                          </div>
                          <span className="text-white">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MasterProgram;