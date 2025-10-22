// CollegeInfo.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const CollegeInfo = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [activeDepartment, setActiveDepartment] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    programs: [],
    requirements: [],
    steps: [],
    statistics: [],
    events: [],
    loading: false,
    error: null
  });

  // Получение текущего языка для API
  const getApiLanguage = useCallback(() => {
    const langMap = {
      'en': 'en',
      'ru': 'ru',
      'kg': 'kg'
    };
    return langMap[i18n.language] || 'ru';
  }, [i18n.language]);

  // Функция для загрузки программ
  const fetchPrograms = useCallback(async (lang) => {
    try {
      const response = await fetch(`/api/admission/doctor-programs/?lang=${lang}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Programs data:', data);
      
      // Если данные приходят как объект, преобразуем в массив
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        return [data];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching programs:', error);
      return [];
    }
  }, []);

  // Функция для загрузки требований
  const fetchRequirements = useCallback(async (lang) => {
    try {
      const response = await fetch(`/api/admission/college-admission-requirements/?lang=${lang}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data?.results || [];
    } catch (error) {
      console.error('Error fetching requirements:', error);
      return [];
    }
  }, []);

  // Функция для загрузки шагов поступления
  const fetchSteps = useCallback(async (lang) => {
    try {
      const response = await fetch(`/api/admission/college-admission-steps/?lang=${lang}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data?.results || [];
    } catch (error) {
      console.error('Error fetching steps:', error);
      return [];
    }
  }, []);

  // Функция для загрузки статистики
  const fetchStatistics = useCallback(async (lang) => {
    try {
      const response = await fetch(`/api/admission/college-statistics/?lang=${lang}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data?.results || [];
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return [];
    }
  }, []);

  // Функция для загрузки событий
  const fetchEvents = useCallback(async (lang) => {
    try {
      const response = await fetch(`/api/admission/college-soon-events/?lang=${lang}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data?.results || [];
    } catch (error) {
      console.error('Error fetching events:', error);
      return [];
    }
  }, []);

  // Функция для загрузки всех данных с бэкенда
  const fetchBackendData = useCallback(async () => {
    try {
      setBackendData(prev => ({ 
        ...prev, 
        loading: true, 
        error: null 
      }));
      
      const lang = getApiLanguage();
      
      // Параллельная загрузка всех данных
      const [programs, requirements, steps, statistics, events] = await Promise.all([
        fetchPrograms(lang),
        fetchRequirements(lang),
        fetchSteps(lang),
        fetchStatistics(lang),
        fetchEvents(lang)
      ]);

      console.log('All loaded data:', {
        programs,
        requirements,
        steps,
        statistics,
        events
      });

      setBackendData({
        programs: programs || [],
        requirements: requirements || [],
        steps: steps || [],
        statistics: statistics || [],
        events: events || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching college data:', error);
      setBackendData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load college data'
      }));
    }
  }, [getApiLanguage, fetchPrograms, fetchRequirements, fetchSteps, fetchStatistics, fetchEvents]);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  // Перезагрузка данных при изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [i18n.language, fetchBackendData]);

  const collegeData = t('collegeInfo', { returnObjects: true });
  const tabs = t('collegeInfo.tabs', { returnObjects: true });
  const departments = t('collegeInfo.departments.list', { returnObjects: true });

  // Исправленная функция для программ - только данные с бэкенда
  const getPrograms = useCallback(() => {
    if (!backendData.programs || backendData.programs.length === 0) {
      return [];
    }

    return backendData.programs.map((program, index) => {
      // Безопасное преобразование features в массив
      const programFeatures = Array.isArray(program.features) 
        ? program.features 
        : typeof program.features === 'string' 
          ? [program.features] 
          : program.features 
            ? Object.values(program.features).filter(val => val) 
            : [];

      // Безопасное получение названия программы
      const programName = program.program_name || program.name || `Программа ${index + 1}`;
      
      // Безопасное получение описания
      const programDescription = program.description || 'Описание программы будет добавлено в ближайшее время.';
      
      return {
        id: program.id || index,
        name: programName,
        description: programDescription,
        level: 'Бакалавриат',
        duration: program.duration ? `${program.duration} ${t('collegeInfo.years', 'лет')}` : '3 года',
        format: 'Очная',
        icon: '🎓',
        features: programFeatures.length > 0 ? programFeatures : ['Современные методики', 'Практическая направленность', 'Квалифицированные преподаватели']
      };
    });
  }, [backendData.programs, t]);

  // Упрощенные функции для остальных данных - только с бэкенда
  const getRequirements = useCallback(() => {
    if (!backendData.requirements || backendData.requirements.length === 0) {
      return [];
    }
    return backendData.requirements.map((req, index) => 
      req.title || req.description || `Требование ${index + 1}`
    );
  }, [backendData.requirements]);

  const getAdmissionSteps = useCallback(() => {
    if (!backendData.steps || backendData.steps.length === 0) {
      return [];
    }
    return backendData.steps.map((step, index) => ({
      id: step.id || index,
      step: index + 1,
      title: step.title || `Шаг ${index + 1}`,
      description: step.description || 'Описание шага будет добавлено в ближайшее время.',
      deadline: step.duration || step.deadline || 'Уточняется'
    }));
  }, [backendData.steps]);

  const getStatistics = useCallback(() => {
    if (!backendData.statistics || backendData.statistics.length === 0) {
      return [];
    }
    return backendData.statistics.map((stat, index) => ({
      id: stat.id || index,
      value: stat.titleInt || stat.value || stat.description || '0',
      label: stat.description || stat.label || 'Статистика'
    }));
  }, [backendData.statistics]);

  const getEvents = useCallback(() => {
    if (!backendData.events || !Array.isArray(backendData.events) || backendData.events.length === 0) {
      return [];
    }
    return backendData.events.map((event, index) => ({
      id: event.id || index,
      name: event.event || event.name || `Событие ${index + 1}`,
      date: event.date || 'Дата уточняется',
      daysLeft: event.daysLeft || event.days_left || '0'
    }));
  }, [backendData.events]);

  const programs = getPrograms();
  const requirements = getRequirements();
  const admissionSteps = getAdmissionSteps();
  const statistics = getStatistics();
  const events = getEvents();

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
    const interval = setInterval(() => {
      setActiveDepartment((prev) => (prev + 1) % departments.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [departments.length]);

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
        {t('collegeInfo.errorTitle', 'Ошибка загрузки')}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData.error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t('collegeInfo.retry', 'Попробовать снова')}
      </button>
    </div>
  );

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
            {collegeData.title || 'Колледж'}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {collegeData.subtitle || 'Современное образование для будущих специалистов'}
          </p>
        </motion.div>

        {/* Быстрая статистика */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
        >
          {backendData.loading ? (
            // Скелетон для статистики
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white/5 rounded-2xl p-6 animate-pulse">
                <div className="bg-white/10 rounded-2xl h-8 mb-2"></div>
                <div className="bg-white/10 rounded-2xl h-4"></div>
              </div>
            ))
          ) : (
            statistics.map((stat, index) => (
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

        {backendData.error ? (
          <ErrorMessage onRetry={fetchBackendData} />
        ) : (
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
                {backendData.loading ? (
                  <LoadingSkeleton />
                ) : (
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
                          {collegeData.about?.title || 'О колледже'}
                        </h2>
                        <p className="text-blue-100 text-lg leading-relaxed">
                          {collegeData.about?.description || 'Информация о колледже загружается...'}
                        </p>
                        
                        {collegeData.about?.features && (
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
                          {collegeData.programs?.title || 'Образовательные программы'}
                        </h2>
                        
                        <div className="grid gap-6">
                          {programs.length > 0 ? (
                            programs.map((program, index) => (
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
                                      {Array.isArray(program.features) && program.features.map((feature, featureIndex) => (
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
                                      {t('collegeInfo.programs.detailsButton', 'Подробнее')}
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-blue-200">
                              Программы загружаются...
                            </div>
                          )}
                        </div>
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
                          {collegeData.admission?.title || 'Поступление в колледж'}
                        </h2>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                          {admissionSteps.length > 0 ? (
                            admissionSteps.map((step, index) => (
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
                            ))
                          ) : (
                            <div className="text-center py-8 text-blue-200 col-span-2">
                              Информация о поступлении загружается...
                            </div>
                          )}
                        </div>

                        {requirements.length > 0 && (
                          <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-6 mt-8 backdrop-blur-sm border border-blue-400/30">
                            <h3 className="text-xl font-bold text-white mb-4 text-center">
                              {t('collegeInfo.admission.requirementsTitle', 'Требования для поступления')}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                              {requirements.map((req, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl">
                                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-300">
                                    ✓
                                  </div>
                                  <span className="text-blue-200 text-sm">{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
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
                  {collegeData.leadership?.title || 'Руководство'}
                </h3>
                
                <div className="space-y-6">
                  {collegeData.leadership?.members ? (
                    collegeData.leadership.members.map((member, index) => (
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
                    ))
                  ) : (
                    <div className="text-center py-4 text-blue-200">
                      Информация о руководстве загружается...
                    </div>
                  )}
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
                  {t('collegeInfo.events.title', 'Ближайшие события')}
                </h3>
                
                <div className="space-y-4">
                  {events.length > 0 ? (
                    events.map((event, index) => (
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
                    <div className="text-center py-4 text-blue-200">
                      События загружаются...
                    </div>
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
                  {collegeData.contacts?.title || 'Контакты'}
                </h3>
                
                <div className="space-y-4">
                  {collegeData.contacts?.details ? (
                    collegeData.contacts.details.map((contact, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                        <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
                          {contact.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-white text-sm font-medium">{contact.label}</div>
                          <div className="text-blue-200 text-xs">{contact.value}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-blue-200">
                      Контактная информация загружается...
                    </div>
                  )}
                </div>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {collegeData.contacts?.button || 'Связаться с нами'}
                </motion.button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CollegeInfo;