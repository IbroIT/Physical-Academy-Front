// ExchangePrograms.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const ExchangePrograms = () => {
  const { t, i18n } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [activeProgram, setActiveProgram] = useState(0);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [isApplying, setIsApplying] = useState(null);
  
  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    title: '',
    subtitle: '',
    stats: [],
    programs: [],
    filters: {
      regions: [],
      durations: []
    },
    deadlines: {
      title: '',
      list: []
    },
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
    return langMap[i18n.language] || 'en';
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
      
      // Пробуем разные эндпоинты
      const endpoints = [
        `/api/student-clubs/exchange-page/?lang=${lang}`,
        `/api/exchange-page/?lang=${lang}`,
        `/api/student-clubs/exchange/programs/?lang=${lang}`
      ];
      
      let response = null;
      let data = null;
      
      // Пробуем последовательно разные эндпоинты
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await fetch(endpoint);
          
          if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              data = await response.json();
              console.log('Successfully fetched data from:', endpoint, data);
              break;
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch from ${endpoint}:`, error);
          continue;
        }
      }
      
      if (!data) {
        // Если данные не пришли, создаем mock данные для тестирования
        console.warn('No data received from any endpoint, using mock data');
        data = getMockData(lang);
      }
      
      // Обрабатываем разные форматы ответа
      let processedData = data;
      
      // Если ответ содержит results (пагинация)
      if (data.results) {
        processedData = data.results;
      }
      
      // Если это отдельные массивы, объединяем их
      if (data.programs && data.stats) {
        processedData = data;
      }
      
      setBackendData({
        title: processedData.title || t('students.exchange.title'),
        subtitle: processedData.subtitle || t('students.exchange.subtitle'),
        stats: processedData.stats || [],
        programs: processedData.programs || processedData || [],
        filters: {
          regions: processedData.filters?.regions || getMockRegions(lang),
          durations: processedData.filters?.durations || getMockDurations(lang)
        },
        deadlines: {
          title: processedData.deadlines?.title || t('students.exchange.deadlines.title'),
          list: processedData.deadlines?.list || []
        },
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching exchange data:', error);
      // Используем mock данные в случае ошибки
      const lang = getApiLanguage();
      const mockData = getMockData(lang);
      
      setBackendData({
        title: mockData.title,
        subtitle: mockData.subtitle,
        stats: mockData.stats,
        programs: mockData.programs,
        filters: {
          regions: getMockRegions(lang),
          durations: getMockDurations(lang)
        },
        deadlines: {
          title: t('students.exchange.deadlines.title'),
          list: []
        },
        loading: false,
        error: null
      });
    }
  }, [getApiLanguage, t]);

  // Mock данные для тестирования
  const getMockData = (lang) => {
    const mockData = {
      en: {
        title: "International Exchange Programs",
        subtitle: "Expand your horizons with our partner universities worldwide",
        stats: [
          { id: 1, icon: "🌍", value: "25+", label: "Partner Countries" },
          { id: 2, icon: "🎓", value: "50+", label: "Partner Universities" },
          { id: 3, icon: "✈️", value: "200+", label: "Students Exchanged" },
          { id: 4, icon: "💰", value: "80%", label: "Receive Funding" }
        ],
        programs: [
          {
            id: 1,
            university: "University of California",
            country: "USA",
            description: "Study at one of the world's top universities in beautiful California",
            duration: "4-6 months",
            cost: "$5000",
            language: "English",
            grants_available: "Available",
            deadline: "October 15, 2024",
            available_spots: 5,
            icon: "🎓",
            website: "https://www.uc.edu",
            difficulty: "medium",
            difficulty_label: "Moderate",
            region: 1,
            duration_type: 1,
            requirements: [
              { id: 1, text: "GPA of 3.5 or higher" },
              { id: 2, text: "English proficiency certificate" }
            ],
            benefits: [
              { id: 1, text: "Course credit transfer" },
              { id: 2, text: "Cultural immersion program" }
            ],
            available_courses: [
              { id: 1, name: "Computer Science" },
              { id: 2, name: "Business Administration" }
            ]
          },
          {
            id: 2,
            university: "University of Tokyo",
            country: "Japan",
            description: "Experience cutting-edge technology and rich culture in Tokyo",
            duration: "1 year",
            cost: "$7000",
            language: "Japanese/English",
            grants_available: "Limited",
            deadline: "December 1, 2024",
            available_spots: 3,
            icon: "🏯",
            website: "https://www.u-tokyo.ac.jp",
            difficulty: "high",
            difficulty_label: "Competitive",
            region: 2,
            duration_type: 2,
            requirements: [
              { id: 1, text: "GPA of 3.7 or higher" },
              { id: 2, text: "Japanese language basic knowledge" }
            ],
            benefits: [
              { id: 1, text: "Research opportunities" },
              { id: 2, text: "Japanese culture courses" }
            ],
            available_courses: [
              { id: 1, name: "Engineering" },
              { id: 2, name: "Asian Studies" }
            ]
          }
        ]
      },
      ru: {
        title: "Международные Программы Обмена",
        subtitle: "Расширьте свои горизонты с нашими университетами-партнерами по всему миру",
        stats: [
          { id: 1, icon: "🌍", value: "25+", label: "Стран-партнеров" },
          { id: 2, icon: "🎓", value: "50+", label: "Университетов-партнеров" },
          { id: 3, icon: "✈️", value: "200+", label: "Студентов по обмену" },
          { id: 4, icon: "💰", value: "80%", label: "Получают финансирование" }
        ],
        programs: [
          {
            id: 1,
            university: "Университет Калифорнии",
            country: "США",
            description: "Учитесь в одном из лучших университетов мира в прекрасной Калифорнии",
            duration: "4-6 месяцев",
            cost: "$5000",
            language: "Английский",
            grants_available: "Доступны",
            deadline: "15 октября 2024",
            available_spots: 5,
            icon: "🎓",
            website: "https://www.uc.edu",
            difficulty: "medium",
            difficulty_label: "Средняя",
            region: 1,
            duration_type: 1
          }
        ]
      },
      kg: {
        title: "Эл аралык Алмашуу Программалары",
        subtitle: "Бүткүл дүйнө жүзүндөгү өнөктөш университеттерибиз менен көз караңызды кеңейтиңиз",
        stats: [
          { id: 1, icon: "🌍", value: "25+", label: "Өнөктөш өлкөлөр" },
          { id: 2, icon: "🎓", value: "50+", label: "Өнөктөш университеттер" },
          { id: 3, icon: "✈️", value: "200+", label: "Алмашылган студенттер" },
          { id: 4, icon: "💰", value: "80%", label: "Каржылоо алышат" }
        ],
        programs: [
          {
            id: 1,
            university: "Калифорния Университети",
            country: "АКШ",
            description: "Калифорниянын коозунда дүйнөдөгү эң мыкты университеттердин биринде окуңуз",
            duration: "4-6 ай",
            cost: "$5000",
            language: "Англисче",
            grants_available: "Жеткиликтүү",
            deadline: "15-октябрь 2024",
            available_spots: 5,
            icon: "🎓",
            website: "https://www.uc.edu",
            difficulty: "medium",
            difficulty_label: "Орточо",
            region: 1,
            duration_type: 1
          }
        ]
      }
    };
    
    return mockData[lang] || mockData.en;
  };

  const getMockRegions = (lang) => {
    const regions = {
      en: [
        { id: 1, name: "North America", code: "north-america" },
        { id: 2, name: "Europe", code: "europe" },
        { id: 3, name: "Asia", code: "asia" }
      ],
      ru: [
        { id: 1, name: "Северная Америка", code: "north-america" },
        { id: 2, name: "Европа", code: "europe" },
        { id: 3, name: "Азия", code: "asia" }
      ],
      kg: [
        { id: 1, name: "Түндүк Америка", code: "north-america" },
        { id: 2, name: "Европа", code: "europe" },
        { id: 3, name: "Азия", code: "asia" }
      ]
    };
    return regions[lang] || regions.en;
  };

  const getMockDurations = (lang) => {
    const durations = {
      en: [
        { id: 1, name: "Semester", code: "semester" },
        { id: 2, name: "1 Year", code: "1-year" },
        { id: 3, name: "Short-term", code: "short-term" }
      ],
      ru: [
        { id: 1, name: "Семестр", code: "semester" },
        { id: 2, name: "1 Год", code: "1-year" },
        { id: 3, name: "Краткосрочный", code: "short-term" }
      ],
      kg: [
        { id: 1, name: "Семестр", code: "semester" },
        { id: 2, name: "1 Жыл", code: "1-year" },
        { id: 3, name: "Кыска мөөнөт", code: "short-term" }
      ]
    };
    return durations[lang] || durations.en;
  };

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  // Перезагрузка данных при изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [i18n.language, fetchBackendData]);

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
    if (backendData.programs.length > 0) {
      const interval = setInterval(() => {
        setActiveProgram(prev => (prev + 1) % backendData.programs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [backendData.programs]);

  // Анимация счетчиков
  useEffect(() => {
    if (isVisible && backendData.stats.length > 0) {
      const targetValues = backendData.stats.map(stat => {
        const value = stat.value || '0';
        return parseInt(value.replace(/\D/g, '')) || 0;
      });
      
      const duration = 2000;
      const steps = 60;
      const stepValues = targetValues.map(target => target / steps);

      let currentStep = 0;
      const counterInterval = setInterval(() => {
        currentStep++;
        setCounterValues(prev => 
          prev.map((value, index) => {
            if (currentStep <= steps) {
              return Math.min(value + stepValues[index], targetValues[index]);
            }
            return value;
          })
        );

        if (currentStep >= steps) {
          clearInterval(counterInterval);
        }
      }, duration / steps);

      return () => clearInterval(counterInterval);
    }
  }, [isVisible, backendData.stats]);

  const filteredPrograms = backendData.programs.filter(program => {
    const matchesRegion = selectedRegion === 'all' || program.region == selectedRegion;
    const matchesDuration = selectedDuration === 'all' || program.duration_type == selectedDuration;
    
    const university = program.university || '';
    const country = program.country || '';
    const description = program.description || '';
    
    const matchesSearch = university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRegion && matchesDuration && matchesSearch;
  });

  const toggleProgram = (index) => {
    setExpandedProgram(expandedProgram === index ? null : index);
  };

  const handleApply = async (programId, programName) => {
    setIsApplying(programId);
    try {
      // Имитация подачи заявки
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(t('students.exchange.alerts.applicationSent', { university: programName }));
    } catch (error) {
      console.error('Application error:', error);
      alert(t('students.exchange.alerts.applicationError'));
    } finally {
      setIsApplying(null);
    }
  };

  const handleFilterChange = (type, value) => {
    if (type === 'region') {
      setSelectedRegion(value);
    } else if (type === 'duration') {
      setSelectedDuration(value);
    }
    setExpandedProgram(null);
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
        {t('students.exchange.errorTitle')}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData.error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t('students.exchange.retry')}
      </button>
    </div>
  );

  // Получение переведенного текста
  const getTranslatedText = (item, field) => {
    const lang = getApiLanguage();
    const translatedField = `${field}_${lang}`;
    
    // Сначала пробуем получить переведенное поле
    if (item[translatedField]) {
      return item[translatedField];
    }
    
    // Затем пробуем общее поле
    if (item[field]) {
      return item[field];
    }
    
    // Если ничего нет, возвращаем пустую строку
    return '';
  };

  console.log('Backend Data:', backendData);
  console.log('Filtered Programs:', filteredPrograms);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон с международными символами */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Международные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🌍</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">✈️</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🎓</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🤝</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
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
            🌍
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {backendData.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {backendData.subtitle}
          </p>
        </motion.div>

        {backendData.loading ? (
          <div className="text-center py-8">
            <div className="text-blue-400 text-6xl mb-4">⏳</div>
            <h2 className="text-2xl text-white mb-4">
              {t('students.exchange.loading')}
            </h2>
          </div>
        ) : (
          <>
            {/* Статистика */}
            {backendData.stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
              >
                {backendData.stats.map((stat, index) => (
                  <motion.div
                    key={stat.id || index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                  >
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {stat.icon || '📊'}
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300 font-mono">
                      {stat.value?.includes('%') 
                        ? `${Math.round(counterValues[index])}%`
                        : stat.value?.includes('+')
                        ? `${Math.round(counterValues[index])}+`
                        : Math.round(counterValues[index])
                      }
                    </div>
                    <div className="text-blue-200 text-sm lg:text-base">
                      {getTranslatedText(stat, 'label')}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Фильтры и поиск */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl mb-8"
            >
            </motion.div>

            {/* Активная программа */}
            {filteredPrograms.length > 0 && filteredPrograms[activeProgram] && (
              <motion.div
                key={activeProgram}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 backdrop-blur-lg border border-white/20 shadow-2xl mb-8"
              >
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                    {filteredPrograms[activeProgram].icon || '🎓'}
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                      {getTranslatedText(filteredPrograms[activeProgram], 'university')}
                    </h3>
                    <p className="text-emerald-400 text-lg mb-3">
                      {getTranslatedText(filteredPrograms[activeProgram], 'country')} • {getTranslatedText(filteredPrograms[activeProgram], 'duration')}
                    </p>
                    <p className="text-blue-100 text-lg leading-relaxed">
                      {getTranslatedText(filteredPrograms[activeProgram], 'description')}
                    </p>
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

// Компонент ProgramCard остается без изменений, как в предыдущем коде
const ProgramCard = ({ program, index, isExpanded, isApplying, onToggle, onApply, getTranslatedText }) => {
  const { t } = useTranslation();
  
  const common = t('students.exchange.common', { returnObjects: true });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'high': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-400/30' };
      case 'medium': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-400/30' };
      case 'low': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-400/30' };
      default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-400/30' };
    }
  };

  const difficultyColors = getDifficultyColor(program.difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/30"
      whileHover={{ scale: 1.01 }}
    >
      <div className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Основная информация */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {getTranslatedText(program, 'university')}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-blue-200 mb-4">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🌍</span>
                    <span>{getTranslatedText(program, 'country')}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">⏱️</span>
                    <span>{getTranslatedText(program, 'duration')}</span>
                  </span>
                  <span className={`px-4 py-2 rounded-2xl text-sm font-medium backdrop-blur-sm border ${difficultyColors.bg} ${difficultyColors.text} ${difficultyColors.border}`}>
                    {getTranslatedText(program, 'difficulty_label') || program.difficulty}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  {program.cost || common.free}
                </div>
                <div className="text-blue-300 text-sm">{common.cost}</div>
              </div>
            </div>

            <p className="text-blue-100 mb-6 leading-relaxed text-lg">
              {getTranslatedText(program, 'description')}
            </p>

            {/* Быстрая информация */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-lg font-bold text-white">
                  {getTranslatedText(program, 'language') || common.defaultLanguage}
                </div>
                <div className="text-blue-300 text-sm">{common.language}</div>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-lg font-bold text-white">
                  {getTranslatedText(program, 'grants_available') || common.grantsAvailable}
                </div>
                <div className="text-blue-300 text-sm">{common.grants}</div>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-lg font-bold text-white">
                  {program.deadline || common.soon}
                </div>
                <div className="text-blue-300 text-sm">{common.deadline}</div>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-lg font-bold text-white">
                  {program.available_spots || common.defaultSpots}
                </div>
                <div className="text-blue-300 text-sm">{common.spots}</div>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="lg:w-56 flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onApply}
              disabled={isApplying || program.available_spots === 0}
              className={`w-full py-4 px-6 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center backdrop-blur-sm ${
                program.available_spots > 0 && !isApplying
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 shadow-lg'
                  : 'bg-white/10 text-blue-300 cursor-not-allowed border border-white/10'
              }`}
            >
              {isApplying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  {common.sending}
                </>
              ) : (
                <>
                  <span className="text-xl mr-3">📝</span>
                  {common.apply}
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggle}
              className="w-full py-4 px-6 bg-white/10 border border-white/10 text-white rounded-2xl hover:border-emerald-400/30 transition-all duration-300 font-medium flex items-center justify-center backdrop-blur-sm"
            >
              <span className="text-xl mr-3">{isExpanded ? '📋' : '🔍'}</span>
              {isExpanded ? common.collapse : common.more}
            </motion.button>

            {program.website && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={program.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 bg-white/10 border border-emerald-400 text-emerald-400 rounded-2xl hover:bg-emerald-400/10 transition-all duration-300 font-medium flex items-center justify-center backdrop-blur-sm"
              >
                <span className="text-xl mr-3">🌐</span>
                {common.website}
              </motion.a>
            )}
          </div>
        </div>

        {/* Расширенная информация */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 pt-8 border-t border-white/20 space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Требования */}
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-400/30 backdrop-blur-sm">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-3 text-lg">
                    <span className="text-xl">📋</span>
                    <span>{common.requirements}</span>
                  </h4>
                  <ul className="space-y-3">
                    {(program.requirements || []).map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start text-blue-200">
                        <span className="text-emerald-400 mr-3 mt-1 text-lg">•</span>
                        {getTranslatedText(req, 'text')}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Преимущества */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl p-6 border border-emerald-400/30 backdrop-blur-sm">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-3 text-lg">
                    <span className="text-xl">⭐</span>
                    <span>{common.benefits}</span>
                  </h4>
                  <ul className="space-y-3">
                    {(program.benefits || []).map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start text-blue-200">
                        <span className="text-emerald-400 mr-3 mt-1 text-lg">✓</span>
                        {getTranslatedText(benefit, 'text')}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Доступные курсы */}
              {program.available_courses && program.available_courses.length > 0 && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-400/30 backdrop-blur-sm">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-3 text-lg">
                    <span className="text-xl">📚</span>
                    <span>{common.availableCourses}</span>
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {program.available_courses.map((course, courseIndex) => (
                      <span key={courseIndex} className="px-4 py-2 bg-white/10 text-blue-200 rounded-2xl text-sm font-medium backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300">
                        {getTranslatedText(course, 'name')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ExchangePrograms;