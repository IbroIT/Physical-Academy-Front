// CollegeInfo.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const CollegeInfo = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [activeDepartment, setActiveDepartment] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    programs: [],
    admissionRequirements: [],
    admissionSteps: [],
    statistics: [],
    events: [],
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
      setBackendData(prev => ({ ...prev, loading: true, error: null }));
      
      const lang = getApiLanguage();
      
      const endpoints = [
        `/api/admission/doctor-programs/?lang=${lang}`,
        `/api/admission/college-admission-requirements/?lang=${lang}`,
        `/api/admission/college-admission-steps/?lang=${lang}`,
        `/api/admission/college-statistics/?lang=${lang}`,
        `/api/admission/college-soon-events/?lang=${lang}`
      ];

      const [programsRes, requirementsRes, stepsRes, statsRes, eventsRes] = await Promise.all(
        endpoints.map(url => 
          fetch(url)
            .then(res => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              return res.json();
            })
            .catch(error => {
              console.error(`Error fetching ${url}:`, error);
              return { results: [] };
            })
        )
      );

      setBackendData({
        programs: programsRes.results || [],
        admissionRequirements: requirementsRes.results || [],
        admissionSteps: stepsRes.results || [],
        statistics: statsRes.results || [],
        events: eventsRes.results || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching college data:', error);
      setBackendData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load data'
      }));
    }
  }, [getApiLanguage]);

  // Загрузка данных при монтировании и изменении языка
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

  // Автопереключение кафедр
  useEffect(() => {
    const departments = t('collegeInfo.departments.list', { returnObjects: true });
    if (Array.isArray(departments) && departments.length > 0) {
      const interval = setInterval(() => {
        setActiveDepartment((prev) => (prev + 1) % departments.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [t]);

  const collegeData = t('collegeInfo', { returnObjects: true });
  const tabs = t('collegeInfo.tabs', { returnObjects: true });
  const departments = t('collegeInfo.departments.list', { returnObjects: true });

  // Преобразование данных программ из бэкенда
  const getProgramsData = () => {
    return backendData.programs.map((program, index) => ({
      id: program.id || index,
      name: program.program_name,
      description: program.description,
      level: t('collegeInfo.programs.level'),
      duration: `${program.duration} ${t('collegeInfo.programs.years')}`,
      format: t('collegeInfo.programs.format'),
      icon: '🎓',
      features: program.features || []
    }));
  };

  // Преобразование данных статистики из бэкенда
  const getStatsData = () => {
    return backendData.statistics.map((stat, index) => ({
      id: stat.id || index,
      value: stat.titleInt,
      label: stat.description
    }));
  };

  // Преобразование данных событий из бэкенда
  const getEventsData = () => {
    return backendData.events.map((event, index) => ({
      id: event.id || index,
      name: event.event,
      date: t('collegeInfo.events.soon'),
      daysLeft: '!'
    }));
  };

  // Преобразование данных требований к поступлению
  const getAdmissionRequirements = () => {
    return backendData.admissionRequirements.map((req, index) => ({
      id: req.id || index,
      title: req.title,
      description: req.description,
      deadline: req.duration
    }));
  };

  // Преобразование данных шагов поступления
  const getAdmissionSteps = () => {
    return backendData.admissionSteps.map((step, index) => ({
      id: step.id || index,
      step: index + 1,
      title: step.title,
      description: step.description,
      deadline: step.duration
    }));
  };

  const programsData = getProgramsData();
  const statsData = getStatsData();
  const eventsData = getEventsData();
  const admissionRequirements = getAdmissionRequirements();
  const admissionSteps = getAdmissionSteps();

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
        {t('collegeInfo.errorTitle')}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData.error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t('collegeInfo.retry')}
      </button>
    </div>
  );

  if (backendData.loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/10"></div>
            <div className="h-12 bg-white/10 rounded-2xl w-1/2 mx-auto mb-6"></div>
            <div className="h-4 bg-white/10 rounded-2xl w-1/3 mx-auto"></div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <LoadingSkeleton />
            </div>
            <div className="space-y-8">
              <LoadingSkeleton />
              <LoadingSkeleton />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (backendData.error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <ErrorMessage onRetry={fetchBackendData} />
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный академический фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Академические символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏛️</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">📚</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🎓</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl opacity-5">🏆</div>
        
        {/* Академические линии */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
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
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            🏛️
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {collegeData.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {collegeData.subtitle}
          </p>
        </motion.div>

        {/* Быстрая статистика */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
        >
          {statsData.length > 0 ? (
            statsData.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
              >
                <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))
          ) : (
            // Fallback to static data if no backend data
            collegeData?.stats?.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
              >
                <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Основной контент - 2/3 ширины */}
          <div className="lg:col-span-2">
            {/* Навигационные табы */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex overflow-x-auto scrollbar-hide mb-8 bg-white/5 rounded-2xl p-2 backdrop-blur-sm border border-white/10"
            >
              {Array.isArray(tabs) && tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-max px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </motion.div>

            {/* Контент табов */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <AnimatePresence mode="wait">
                {/* О колледже */}
                {activeTab === 'about' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                      {collegeData.about.title}
                    </h2>
                    <p className="text-blue-100 text-lg leading-relaxed">
                      {collegeData.about.description}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      {collegeData.about.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 group"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-300">
                            {feature.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {feature.title}
                            </h3>
                            <p className="text-blue-200">
                              {feature.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Кафедры */}
                {activeTab === 'departments' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {collegeData.departments.title}
                    </h2>
                    
                    {/* Активная кафедра */}
                    {Array.isArray(departments) && departments.length > 0 && (
                      <motion.div
                        key={activeDepartment}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm border border-white/20 mb-8"
                      >
                        <div className="flex flex-col lg:flex-row gap-6 items-center">
                          <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                            {departments[activeDepartment]?.icon}
                          </div>
                          <div className="flex-1 text-center lg:text-left">
                            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                              {departments[activeDepartment]?.name}
                            </h3>
                            <p className="text-blue-200 mb-4">
                              {departments[activeDepartment]?.description}
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                              {departments[activeDepartment]?.specializations?.map((spec, specIndex) => (
                                <span 
                                  key={specIndex}
                                  className="px-3 py-1 bg-white/10 rounded-full text-sm text-blue-200 backdrop-blur-sm"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Все кафедры */}
                    {Array.isArray(departments) && departments.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {departments.map((department, index) => (
                          <motion.div
                            key={department.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-2xl backdrop-blur-sm border cursor-pointer transition-all duration-300 ${
                              activeDepartment === index
                                ? 'bg-white/10 border-emerald-400/50 shadow-lg'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                            onClick={() => setActiveDepartment(index)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                                {department.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white truncate">
                                  {department.name}
                                </h4>
                                <p className="text-blue-200 text-sm">
                                  {department.head}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-emerald-400 text-sm font-bold">
                                  {department.students}
                                </div>
                                <div className="text-blue-300 text-xs">
                                  {t('collegeInfo.departments.studentsLabel')}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-blue-200">
                        {t('collegeInfo.noDepartments')}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Программы */}
                {activeTab === 'programs' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {collegeData.programs.title}
                    </h2>
                    
                    {programsData.length > 0 ? (
                      <div className="grid gap-6">
                        {programsData.map((program, index) => (
                          <motion.div
                            key={program.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4 mb-3">
                                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-lg">
                                    {program.icon}
                                  </div>
                                  <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-1">
                                      {program.name}
                                    </h3>
                                    <p className="text-emerald-300 font-medium">
                                      {program.level}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-blue-200 mb-3">
                                  {program.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {program.features.map((feature, featureIndex) => (
                                    <span 
                                      key={featureIndex}
                                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-blue-200 backdrop-blur-sm"
                                    >
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-center lg:text-right">
                                <div className="text-2xl font-bold text-emerald-400 mb-2">
                                  {program.duration}
                                </div>
                                <div className="text-blue-300 text-sm mb-3">
                                  {program.format}
                                </div>
                                <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105">
                                  {t('collegeInfo.programs.detailsButton')}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-blue-200">
                        {t('collegeInfo.noPrograms')}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Поступление */}
                {activeTab === 'admission' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {collegeData.admission.title}
                    </h2>
                    
                    {admissionSteps.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {admissionSteps.map((step, index) => (
                          <motion.div
                            key={step.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group text-center"
                          >
                            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                              {step.step}
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-3">
                              {step.title}
                            </h3>
                            <p className="text-blue-200 mb-4">
                              {step.description}
                            </p>
                            <div className="text-emerald-300 font-medium text-sm">
                              {step.deadline}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-blue-200">
                        {t('collegeInfo.noAdmissionSteps')}
                      </div>
                    )}

                    {admissionRequirements.length > 0 && (
                      <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-6 mt-8 backdrop-blur-sm border border-blue-400/30">
                        <h3 className="text-xl font-bold text-white mb-4 text-center">
                          {t('collegeInfo.admission.requirementsTitle')}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {admissionRequirements.map((req, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
                              <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-300">
                                ✓
                              </div>
                              <span className="text-blue-200 text-sm">{req.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Боковая панель - 1/3 ширины */}
          <div className="space-y-8">
            {/* Руководство */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {collegeData.leadership.title}
              </h3>
              
              <div className="space-y-6">
                {collegeData.leadership.members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-semibold truncate">{member.name}</div>
                      <div className="text-emerald-300 text-sm truncate">{member.position}</div>
                      <div className="text-blue-200 text-xs truncate">{member.department}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Ближайшие события */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {t('collegeInfo.events.title')}
              </h3>
              
              <div className="space-y-4">
                {eventsData.length > 0 ? (
                  eventsData.map((event, index) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{event.name}</div>
                        <div className="text-blue-200 text-xs">{event.date}</div>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-300 text-xs font-bold">
                        {event.daysLeft}
                      </div>
                    </div>
                  ))
                ) : (
                  // Fallback to static data
                  Array.isArray(collegeData?.events) && collegeData.events.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{event.name}</div>
                        <div className="text-blue-200 text-xs">{event.date}</div>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-300 text-xs font-bold">
                        {event.daysLeft}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Контакты */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-blue-400/30 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {collegeData.contacts.title}
              </h3>
              
              <div className="space-y-4">
                {collegeData.contacts.details.map((contact, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
                      {contact.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{contact.label}</div>
                      <div className="text-blue-200 text-xs">{contact.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {collegeData.contacts.button}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollegeInfo;