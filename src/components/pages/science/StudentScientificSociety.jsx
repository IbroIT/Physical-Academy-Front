// StudentScientificSociety.jsx
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const StudentScientificSociety = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [activeProject, setActiveProject] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState(null);
  
  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    info: [],
    stats: [],
    features: [],
    projects: [],
    events: [],
    joinSteps: [],
    leadership: [],
    contacts: [],
    loading: false,
    error: null
  });

  const sectionRef = useRef(null);

  // Получение текущего языка для API - ИСПРАВЛЕННАЯ ВЕРСИЯ
  const getApiLanguage = useCallback(() => {
    const langMap = {
      'en': 'en',
      'ru': 'ru', 
      'kg': 'ky'
    };
    return langMap[i18n.language] || 'ru';
  }, [i18n.language]);

  // Функция для загрузки данных с бэкенда - ИСПРАВЛЕННАЯ ВЕРСИЯ
  const fetchBackendData = useCallback(async () => {
    try {
      setBackendData(prev => ({ ...prev, loading: true, error: null }));
      
      const lang = getApiLanguage();
      console.log('Fetching data for language:', lang); // Для отладки
      
      const endpoints = [
        '/api/science/sss-info/',
        '/api/science/sss-stats/',
        '/api/science/sss-features/',
        '/api/science/sss-projects/',
        '/api/science/sss-events/',
        '/api/science/sss-join-steps/',
        '/api/science/sss-leadership/',
        '/api/science/sss-contacts/'
      ];

      const responses = await Promise.all(
        endpoints.map(async (url) => {
          try {
            // ИСПРАВЛЕНИЕ: Добавляем language в параметры запроса
            const fullUrl = `${url}?language=${lang}`;
            console.log('Fetching:', fullUrl); // Для отладки
            
            const response = await fetch(fullUrl, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Accept-Language': lang, // Добавляем заголовок языка
              },
              cache: 'no-cache' // Отключаем кеширование
            });
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              console.warn(`Non-JSON response from ${url}`);
              return { results: [] };
            }
            
            const data = await response.json();
            console.log(`Data from ${url}:`, data); // Для отладки
            return data;
          } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return { results: [] };
          }
        })
      );

      // ИСПРАВЛЕНИЕ: Убеждаемся, что данные обновляются
      setBackendData({
        info: responses[0]?.results || [],
        stats: responses[1]?.results || [],
        features: responses[2]?.results || [],
        projects: responses[3]?.results || [],
        events: responses[4]?.results || [],
        joinSteps: responses[5]?.results || [],
        leadership: responses[6]?.results || [],
        contacts: responses[7]?.results || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching Student Scientific Society data:', error);
      setBackendData(prev => ({
        ...prev,
        loading: false,
        error: t('studentScientificSociety.error') || 'Failed to load data'
      }));
    }
  }, [getApiLanguage, t]);

  // Загрузка данных при монтировании и изменении языка - ИСПРАВЛЕННАЯ ВЕРСИЯ
  useEffect(() => {
    console.log('Language changed to:', i18n.language); // Для отладки
    fetchBackendData();
  }, [i18n.language, fetchBackendData]);

  // Сброс состояний при изменении языка
  useEffect(() => {
    setActiveTab('about');
    setActiveProject(0);
    setExpandedFeature(null);
  }, [i18n.language]);

  // Добавляем обработчик изменения языка
  useEffect(() => {
    const handleLanguageChanged = (lng) => {
      console.log('Language changed in i18n:', lng);
      // Принудительно перезагружаем данные
      fetchBackendData();
    };

    i18n.on('languageChanged', handleLanguageChanged);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, fetchBackendData]);

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

  // Автопереключение проектов
  useEffect(() => {
    if (backendData.projects.length > 0) {
      const interval = setInterval(() => {
        setActiveProject((prev) => (prev + 1) % backendData.projects.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [backendData.projects.length]);

  // Функция для безопасного получения строки
  const safeString = (value, defaultValue = '') => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    return defaultValue;
  };

  // Функция для безопасного получения массива
  const safeArray = (value) => {
    return Array.isArray(value) ? value : [];
  };

  // Получение основной информации с использованием useMemo для оптимизации
  const societyData = useMemo(() => {
    const info = backendData.info[0] || {};
    console.log('Current society data:', info); // Для отладки
    
    return {
      title: safeString(info.title, t('studentScientificSociety.title', "Student Scientific Society")),
      subtitle: safeString(info.subtitle, t('studentScientificSociety.subtitle', "Join our research community")),
      about: {
        title: safeString(info.about_title, t('studentScientificSociety.about.title', "About SSS")),
        description: safeString(info.about_description, t('studentScientificSociety.about.description', "Student Scientific Society description"))
      },
      projects: {
        title: safeString(info.projects_title, t('studentScientificSociety.projects.title', "Our Projects"))
      },
      events: {
        title: safeString(info.events_title, t('studentScientificSociety.events.title', "Events"))
      },
      join: {
        title: safeString(info.join_title, t('studentScientificSociety.join.title', "How to Join"))
      },
      leadership: {
        title: safeString(info.leadership_title, t('studentScientificSociety.leadership.title', "Leadership"))
      },
      contacts: {
        title: safeString(info.contacts_title, t('studentScientificSociety.contacts.title', "Contacts"))
      },
      upcomingEvents: {
        title: safeString(info.upcoming_events_title, t('studentScientificSociety.upcomingEvents.title', "Upcoming Events"))
      }
    };
  }, [backendData.info, t, i18n.language]); // Добавляем i18n.language в зависимости

  // Преобразование статистики с useMemo
  const stats = useMemo(() => {
    return safeArray(backendData.stats).map(stat => ({
      id: stat.id || Math.random(),
      value: safeString(stat.value, '0'),
      label: safeString(stat.label, 'Stat')
    }));
  }, [backendData.stats, i18n.language]); // Добавляем i18n.language

  // Преобразование фич с useMemo
  const features = useMemo(() => {
    return safeArray(backendData.features).map(feature => ({
      id: feature.id || Math.random(),
      title: safeString(feature.title, 'Feature'),
      description: safeString(feature.description, 'Description'),
      icon: safeString(feature.icon, '🔬')
    }));
  }, [backendData.features, i18n.language]);

  // Преобразование проектов с useMemo
  const projects = useMemo(() => {
    return safeArray(backendData.projects).map(project => {
      let tags = [];
      if (Array.isArray(project.tags)) {
        tags = project.tags.map(tag => {
          if (typeof tag === 'string') return tag;
          if (tag && typeof tag === 'object' && tag.name) return safeString(tag.name);
          return 'Tag';
        });
      }
      
      return {
        id: project.id || Math.random(),
        name: safeString(project.name, 'Project'),
        shortDescription: safeString(project.short_description, 'Short description'),
        description: safeString(project.description, 'Project description'),
        icon: safeString(project.icon, '📚'),
        tags: tags
      };
    });
  }, [backendData.projects, i18n.language]);

  // Преобразование событий с useMemo
  const events = useMemo(() => {
    return safeArray(backendData.events).map(event => ({
      id: event.id || Math.random(),
      name: safeString(event.name, 'Event'),
      description: safeString(event.description, 'Event description'),
      icon: safeString(event.icon, '📅'),
      date: safeString(event.date, ''),
      time: safeString(event.time, ''),
      status: safeString(event.status, ''),
      status_display: safeString(event.status_display, ''),
      days_left: event.days_left || 0
    }));
  }, [backendData.events, i18n.language]);

  // Преобразование шагов вступления с useMemo
  const joinSteps = useMemo(() => {
    return safeArray(backendData.joinSteps).map(step => ({
      id: step.id || Math.random(),
      step: safeString(step.step, '1'),
      title: safeString(step.title, 'Step'),
      description: safeString(step.description, 'Step description')
    }));
  }, [backendData.joinSteps, i18n.language]);

  // Преобразование руководства с useMemo
  const leadership = useMemo(() => {
    return safeArray(backendData.leadership).map(member => ({
      id: member.id || Math.random(),
      name: safeString(member.name, 'Name'),
      position: safeString(member.position, 'Position'),
      department: safeString(member.department, 'Department')
    }));
  }, [backendData.leadership, i18n.language]);

  // Преобразование контактов с useMemo
  const contacts = useMemo(() => {
    return safeArray(backendData.contacts).map(contact => ({
      id: contact.id || Math.random(),
      label: safeString(contact.label, 'Contact'),
      value: safeString(contact.value, ''),
      icon: safeString(contact.icon, '📞')
    }));
  }, [backendData.contacts, i18n.language]);

  // Получение предстоящих событий с useMemo
  const upcomingEvents = useMemo(() => {
    return safeArray(backendData.events)
      .filter(event => event.status === 'upcoming')
      .slice(0, 3)
      .map(event => ({
        name: safeString(event.name, 'Event'),
        date: safeString(event.date, ''),
        daysLeft: event.days_left || 0
      }));
  }, [backendData.events, i18n.language]);

  // Табы с использованием useMemo для перевода
  const tabs = useMemo(() => {
    try {
      // Пробуем получить переведенные табы
      const translatedTabs = t('studentScientificSociety.tabs', { 
        returnObjects: true,
        defaultValue: [
          { id: 'about', name: 'About SSS' },
          { id: 'projects', name: 'Projects' },
          { id: 'events', name: 'Events' },
          { id: 'join', name: 'Join Us' }
        ]
      });
      
      if (Array.isArray(translatedTabs)) {
        return translatedTabs;
      }
      
      // Если это объект, преобразуем в массив
      if (translatedTabs && typeof translatedTabs === 'object') {
        return Object.keys(translatedTabs).map(key => ({
          id: key,
          name: translatedTabs[key]
        }));
      }
      
      return [
        { id: 'about', name: 'About SSS' },
        { id: 'projects', name: 'Projects' },
        { id: 'events', name: 'Events' },
        { id: 'join', name: 'Join Us' }
      ];
    } catch (error) {
      console.warn('Error loading tabs translation:', error);
      return [
        { id: 'about', name: 'About SSS' },
        { id: 'projects', name: 'Projects' },
        { id: 'events', name: 'Events' },
        { id: 'join', name: 'Join Us' }
      ];
    }
  }, [t, i18n.language]); // Добавляем i18n.language

  // Локальные переводы для статических текстов
  const localTranslations = useMemo(() => ({
    loading: t('studentScientificSociety.loading', "Loading..."),
    errorTitle: t('studentScientificSociety.errorTitle', "Error"),
    retry: t('studentScientificSociety.retry', "Retry"),
    noProjects: t('studentScientificSociety.noProjects', "No projects available"),
    noEvents: t('studentScientificSociety.noEvents', "No events available"),
    noJoinSteps: t('studentScientificSociety.noJoinSteps', "No join steps available"),
    noLeadership: t('studentScientificSociety.noLeadership', "No leadership information"),
    noUpcomingEvents: t('studentScientificSociety.noUpcomingEvents', "No upcoming events"),
    noContacts: t('studentScientificSociety.noContacts', "No contacts available"),
    joinApplySuccess: t('studentScientificSociety.join.applySuccess', "Application submitted successfully!"),
    joinAskSuccess: t('studentScientificSociety.join.askSuccess', "Your question has been sent!"),
    joinReadyTitle: t('studentScientificSociety.join.readyTitle', "📝 Ready to join?"),
    joinApplyButton: t('studentScientificSociety.join.applyButton', "Apply Now"),
    joinAskButton: t('studentScientificSociety.join.askButton', "Ask a Question")
  }), [t, i18n.language]); // Добавляем i18n.language

  const toggleFeature = (index) => {
    setExpandedFeature(expandedFeature === index ? null : index);
  };

  const handleJoinClick = () => {
    alert(localTranslations.joinApplySuccess);
  };

  const handleAskClick = () => {
    alert(localTranslations.joinAskSuccess);
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
        {localTranslations.errorTitle}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData.error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {localTranslations.retry}
      </button>
    </div>
  );


  if (backendData.loading) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <LoadingSkeleton />
          </div>
        </div>
      </section>
    );
  }

  if (backendData.error) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
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
      {/* Анимированный научный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Научные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🔬</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">📊</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🧪</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl opacity-5">⚗️</div>
        
        {/* Атомная структура */}
        <div className="absolute top-1/3 left-1/3 w-32 h-32 border-2 border-blue-400/10 rounded-full animate-spin-slow"></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 border-2 border-emerald-400/10 rounded-full animate-spin-slow reverse"></div>
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
            🔬
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {societyData.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {societyData.subtitle}
          </p>
        </motion.div>

        {/* Быстрая статистика */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
        >
          {stats.map((stat, index) => (
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
          ))}
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
              {tabs.map((tab) => (
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
                {/* О СНТ */}
                {activeTab === 'about' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                      {societyData.about.title}
                    </h2>
                    <p className="text-blue-100 text-lg leading-relaxed">
                      {societyData.about.description}
                    </p>
                    
                    <div className="space-y-4 mt-8">
                      {features.map((feature, index) => (
                        <motion.div
                          key={feature.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 overflow-hidden"
                          whileHover={{ scale: 1.01 }}
                        >
                          <button
                            onClick={() => toggleFeature(index)}
                            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-300"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-lg">
                                {feature.icon}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-white">
                                  {feature.title}
                                </h3>
                              </div>
                            </div>
                            <svg
                              className={`w-6 h-6 text-blue-300 transition-transform duration-300 ${
                                expandedFeature === index ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <AnimatePresence>
                            {expandedFeature === index && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="px-6 pb-6">
                                  <div className="border-t border-white/20 pt-4">
                                    <p className="text-blue-100 leading-relaxed">{feature.description}</p>
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

                {/* Проекты */}
                {activeTab === 'projects' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {societyData.projects.title}
                    </h2>
                    
                    {/* Активный проект */}
                    {projects.length > 0 && (
                      <motion.div
                        key={activeProject}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm border border-white/20 mb-8"
                      >
                        <div className="flex flex-col lg:flex-row gap-6 items-center">
                          <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                            {projects[activeProject]?.icon}
                          </div>
                          <div className="flex-1 text-center lg:text-left">
                            <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                              {projects[activeProject]?.name}
                            </h3>
                            <p className="text-blue-200 mb-4">
                              {projects[activeProject]?.description}
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                              {projects[activeProject]?.tags.map((tag, tagIndex) => (
                                <span 
                                  key={tagIndex}
                                  className="px-3 py-1 bg-white/10 rounded-full text-sm text-blue-200 backdrop-blur-sm"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Все проекты */}
                    {projects.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {projects.map((project, index) => (
                          <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-2xl backdrop-blur-sm border cursor-pointer transition-all duration-300 ${
                              activeProject === index
                                ? 'bg-white/10 border-emerald-400/50 shadow-lg'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                            onClick={() => setActiveProject(index)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                                {project.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white truncate">
                                  {project.name}
                                </h4>
                                <p className="text-blue-200 text-sm truncate">
                                  {project.shortDescription}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-blue-200">
                        {localTranslations.noProjects}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Мероприятия */}
                {activeTab === 'events' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {societyData.events.title}
                    </h2>
                    
                    {events.length > 0 ? (
                      <div className="space-y-4">
                        {events.map((event, index) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                          >
                            <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-lg">
                                {event.icon}
                              </div>
                              <div>
                                <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                                  {event.name}
                                </h3>
                                <p className="text-blue-200 text-sm">
                                  {event.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:items-end">
                              <div className="text-emerald-400 font-semibold">
                                {event.date}
                              </div>
                              <div className="text-blue-300 text-sm">
                                {event.time}
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                                event.status === 'upcoming' 
                                  ? 'bg-blue-500/20 text-blue-300' 
                                  : 'bg-emerald-500/20 text-emerald-300'
                              }`}>
                                {event.status_display}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-blue-200">
                        {localTranslations.noEvents}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Как вступить */}
                {activeTab === 'join' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {societyData.join.title}
                    </h2>
                    
                    {joinSteps.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        {joinSteps.map((step, index) => (
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
                            <p className="text-blue-200">
                              {step.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-blue-200">
                        {localTranslations.noJoinSteps}
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-6 mt-8 backdrop-blur-sm border border-blue-400/30">
                      <h3 className="text-xl font-bold text-white mb-4 text-center">
                        {localTranslations.joinReadyTitle}
                      </h3>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                          onClick={handleJoinClick}
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          {localTranslations.joinApplyButton}
                        </button>
                        <button 
                          onClick={handleAskClick}
                          className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
                        >
                          {localTranslations.joinAskButton}
                        </button>
                      </div>
                    </div>
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
                {societyData.leadership.title}
              </h3>
              
              {leadership.length > 0 ? (
                <div className="space-y-6">
                  {leadership.map((member, index) => (
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
              ) : (
                <div className="text-center py-4 text-blue-200">
                  {localTranslations.noLeadership}
                </div>
              )}
            </motion.div>

            {/* Ближайшие события */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {societyData.upcomingEvents.title}
              </h3>
              
              {upcomingEvents.length > 0 ? (
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{event.name}</div>
                        <div className="text-blue-200 text-xs">{event.date}</div>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-300 text-xs font-bold">
                        {event.daysLeft}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-blue-200">
                  {localTranslations.noUpcomingEvents}
                </div>
              )}
            </motion.div>

            {/* Контакты */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-blue-400/30 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {societyData.contacts.title}
              </h3>
              
              {contacts.length > 0 ? (
                <div className="space-y-4">
                  {contacts.map((contact, index) => (
                    <div key={contact.id} className="flex items-center space-x-3 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
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
              ) : (
                <div className="text-center py-4 text-blue-200">
                  {localTranslations.noContacts}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentScientificSociety;