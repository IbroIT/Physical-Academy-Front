import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const GeneralDepartments = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('structure');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [apiData, setApiData] = useState({
    departments: null,
    loading: true,
    error: null,
  });
  const sectionRef = useRef(null);

  // Загрузка данных с API
  const fetchDepartmentsData = async () => {
    try {
      setApiData((prev) => ({ ...prev, loading: true, error: null }));
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(
        `${API_URL}/api/education/departments/?lang=${i18n.language}`
      );

      const data = await response.json();

      if (data) {
        setApiData((prev) => ({ ...prev, departments: data, loading: false }));
      } else {
        setApiData((prev) => ({
          ...prev,
          error: "No data found",
          loading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching departments data:", error);
      setApiData((prev) => ({ ...prev, error: error.message, loading: false }));
    }
  };

  useEffect(() => {
    fetchDepartmentsData();
  }, [i18n.language]);

  // Вспомогательная утилита: безопасно привести разные типы в массив
  const asArray = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === 'string') return [v];
    if (typeof v === 'object') return Object.values(v);
    return [];
  };

  const normalizeDepartmentsData = (apiData) => {
    if (!apiData) {
      return getDefaultData();
    }

    return {
      name: t('generalDepartments.name', 'Отделы и структуры'),
      fullDescription: t('generalDepartments.fullDescription', 'Организационная структура академии и все подразделения'),
      badge: t('generalDepartments.badge', 'Организационная структура'),
      stats: asArray(apiData.statistics).map((stat) => ({
        label: stat.meaning || '',
        value: stat.titleInt || '0',
        icon: getIconForStat(stat.meaning),
      })),
      categories: asArray(apiData.categories).map((cat) => ({
        id: cat.id || cat.name?.toLowerCase(),
        label: cat.name || '',
        icon: cat.emoji || getCategoryIcon(cat.name),
        color: getCategoryColor(cat.name),
        description: cat.description || '',
      })),
      departments: asArray(apiData.departments).map((dept) => ({
        id: dept.id,
        name: dept.name,
        description: dept.description,
        category: dept.category,
        head: dept.head_name,
        position: dept.head_position,
        phone: dept.phone,
        email: dept.email,
        location: dept.location,
        icon: dept.emoji || '🏢',
        functions: asArray(dept.functions),
      })),
      leadership: asArray(apiData.leadership).map((leader) => ({
        id: leader.id,
        name: leader.name,
        position: leader.position,
        department: leader.department,
        avatar: getInitials(leader.name),
        bio: leader.bio,
      })),
      overview: {
        title: t('generalDepartments.overview.title', 'Основные направления деятельности'),
        items: asArray(apiData.overview).map((item) => ({
          icon: item.emoji || '📋',
          title: item.title,
          description: item.description,
        })),
      },
    };
  };

  const getDefaultData = () => {
    const defaultStats = [
      { label: 'Отделов', value: '25+', icon: '🏢' },
      { label: 'Сотрудников', value: '150+', icon: '👨‍🏫' },
      { label: 'Факультетов', value: '15', icon: '🎓' },
      { label: 'Кампусов', value: '5', icon: '🏛️' }
    ];

    return {
      name: t('generalDepartments.name', 'Отделы и структуры'),
      fullDescription: t('generalDepartments.fullDescription', 'Организационная структура академии и все подразделения'),
      badge: t('generalDepartments.badge', 'Организационная структура'),
      stats: defaultStats,
      categories: [],
      departments: [],
      leadership: [],
      overview: {
        title: t('generalDepartments.overview.title', 'Основные направления деятельности'),
        items: []
      },
    };
  };

  const getIconForStat = (meaning) => {
    const icons = {
      отделов: '🏢',
      сотрудников: '👨‍🏫',
      факультетов: '🎓',
      кампусов: '🏛️',
      departments: '🏢',
      employees: '👨‍🏫',
      faculties: '🎓',
      campuses: '🏛️',
      default: '📊',
    };
    return icons[meaning?.toLowerCase()] || icons.default;
  };

  const getCategoryIcon = (name) => {
    if (!name) return '🏢';
    const n = name.toLowerCase();
    if (n.includes('академ') || n.includes('academic')) return '🎓';
    if (n.includes('админ') || n.includes('admin')) return '🏢';
    if (n.includes('науч') || n.includes('research')) return '🔬';
    if (n.includes('студент') || n.includes('student')) return '👥';
    if (n.includes('техн') || n.includes('technical')) return '⚙️';
    return '🏢';
  };

  const getCategoryColor = (name) => {
    if (!name) return 'blue';
    const n = name.toLowerCase();
    if (n.includes('академ') || n.includes('academic')) return 'blue';
    if (n.includes('админ') || n.includes('admin')) return 'green';
    if (n.includes('науч') || n.includes('research')) return 'purple';
    if (n.includes('студент') || n.includes('student')) return 'orange';
    if (n.includes('техн') || n.includes('technical')) return 'red';
    return 'blue';
  };

  const getInitials = (fullName) => {
    return (
      fullName
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase() || 'NN'
    );
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return { 
          bg: 'bg-emerald-500/10', 
          border: 'border-emerald-400/30', 
          text: 'text-emerald-400',
          active: 'bg-emerald-500',
          light: 'bg-emerald-500/20',
          gradient: 'from-emerald-500 to-green-500'
        };
      case 'blue':
        return { 
          bg: 'bg-blue-500/10', 
          border: 'border-blue-400/30', 
          text: 'text-blue-400',
          active: 'bg-blue-500',
          light: 'bg-blue-500/20',
          gradient: 'from-blue-500 to-cyan-500'
        };
      case 'purple':
        return { 
          bg: 'bg-purple-500/10', 
          border: 'border-purple-400/30', 
          text: 'text-purple-400',
          active: 'bg-purple-500',
          light: 'bg-purple-500/20',
          gradient: 'from-purple-500 to-pink-500'
        };
      case 'orange':
        return { 
          bg: 'bg-orange-500/10', 
          border: 'border-orange-400/30', 
          text: 'text-orange-400',
          active: 'bg-orange-500',
          light: 'bg-orange-500/20',
          gradient: 'from-orange-500 to-yellow-500'
        };
      case 'red':
        return { 
          bg: 'bg-red-500/10', 
          border: 'border-red-400/30', 
          text: 'text-red-400',
          active: 'bg-red-500',
          light: 'bg-red-500/20',
          gradient: 'from-red-500 to-pink-500'
        };
      default:
        return { 
          bg: 'bg-blue-500/10', 
          border: 'border-blue-400/30', 
          text: 'text-blue-400',
          active: 'bg-blue-500',
          light: 'bg-blue-500/20',
          gradient: 'from-blue-500 to-cyan-500'
        };
    }
  };

  // Получаем нормализованные данные
  const departmentsData = normalizeDepartmentsData(apiData.departments);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startCounters();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [departmentsData.stats]);

  const startCounters = () => {
    const targetValues = departmentsData.stats.map((stat) => {
      const value = stat.value;
      if (value.includes('%')) {
        return parseFloat(value) || 0;
      } else {
        return parseInt(value.replace(/\D/g, '')) || 0;
      }
    });
    const duration = 2000;
    const steps = 60;
    const stepValues = targetValues.map((target) => target / steps);

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      setCounterValues((prev) =>
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
  };

  // Проверяем наличие данных для табов
  const hasCategories = departmentsData.categories && departmentsData.categories.length > 0;
  const hasDepartments = departmentsData.departments && departmentsData.departments.length > 0;
  const hasLeadership = departmentsData.leadership && departmentsData.leadership.length > 0;
  const hasOverview = departmentsData.overview && departmentsData.overview.items && departmentsData.overview.items.length > 0;

  // Получаем табы из i18n с дефолтными значениями
  const getAvailableTabs = () => {
    // Получаем табы из i18n
    const i18nTabs = t('generalDepartments.tabs', { 
      returnObjects: true,
      defaultValue: [
        {
          id: 'structure',
          label: 'Структура',
          icon: '🏢'
        },
        {
          id: 'departments',
          label: 'Отделы',
          icon: '📂'
        },
        {
          id: 'leadership',
          label: 'Руководство',
          icon: '👨‍💼'
        },
        {
          id: 'overview',
          label: 'Обзор',
          icon: '📊'
        }
      ]
    });

    // Проверяем что это массив
    if (!Array.isArray(i18nTabs)) {
      return [
        {
          id: 'structure',
          label: 'Структура',
          icon: '🏢',
          color: 'from-blue-500 to-cyan-500'
        },
        {
          id: 'departments',
          label: 'Отделы',
          icon: '📂',
          color: 'from-green-500 to-emerald-500'
        },
        {
          id: 'leadership',
          label: 'Руководство',
          icon: '👨‍💼',
          color: 'from-purple-500 to-pink-500'
        },
        {
          id: 'overview',
          label: 'Обзор',
          icon: '📊',
          color: 'from-orange-500 to-yellow-500'
        }
      ];
    }

    // Фильтруем по доступности данных
    return i18nTabs.filter(tab => {
      if (!tab || !tab.id) return false;
      
      // Проверяем наличие данных для каждого таба
      switch(tab.id) {
        case 'structure':
        case 'overview':
          return hasOverview;
        case 'departments':
          return hasDepartments;
        case 'leadership':
          return hasLeadership;
        default:
          return true;
      }
    }).map(tab => ({
      ...tab,
      color: getTabColor(tab.id)
    }));
  };

  const availableTabs = getAvailableTabs();

  // Фильтруем отделы для активной категории
  const getDepartmentsByCategory = (categoryId) => {
    if (!departmentsData.departments || !categoryId) return [];
    return departmentsData.departments.filter(dept => dept.category === categoryId);
  };

  const getTabColor = (tabId) => {
    const colors = {
      structure: 'from-blue-500 to-cyan-500',
      departments: 'from-green-500 to-emerald-500',
      leadership: 'from-purple-500 to-pink-500',
      overview: 'from-orange-500 to-yellow-500',
      default: 'from-blue-500 to-cyan-500'
    };
    return colors[tabId] || colors.default;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  if (apiData.error) {
    console.warn("Departments API error, using fallback data:", apiData.error);
  }

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
        
        {/* Символы отделов */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏢</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🎓</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🔬</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">👥</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {departmentsData.name}
          </motion.h1>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-8 rounded-full"
          ></motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
          >
            {departmentsData.fullDescription}
          </motion.p>
        </motion.div>

        {/* Dynamic Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 lg:mb-20"
        >
          {departmentsData.stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group text-center relative overflow-hidden"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <motion.div 
                  className={`text-5xl mb-6 transition-transform duration-500 ${
                    hoveredCard === index
                      ? "scale-125 rotate-12"
                      : "group-hover:scale-110"
                  }`}
                  whileHover={{ scale: 1.2, rotate: 12 }}
                >
                  {stat.icon}
                </motion.div>
                <div className="text-4xl lg:text-5xl font-bold mb-4 font-mono bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  {stat.value.includes('%') 
                    ? `${Math.round(counterValues[index])}%`
                    : stat.value.includes('+')
                    ? `${Math.round(counterValues[index])}+`
                    : Math.round(counterValues[index])
                  }
                </div>
                <div className="text-blue-100 font-medium text-lg">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="border-b border-white/20 bg-white/5">
            <div className="flex overflow-x-auto scrollbar-hide p-4">
              {availableTabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 flex-shrink-0 px-8 py-4 font-bold text-lg transition-all duration-500 transform rounded-2xl mx-2 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color || getTabColor(tab.id)} text-white shadow-2xl scale-105`
                      : "text-blue-100 hover:text-white hover:bg-white/10 hover:shadow-lg"
                  }`}
                >
                  <span
                    className={`text-2xl transition-transform duration-300 ${
                      activeTab === tab.id ? "scale-110" : ""
                    }`}
                  >
                    {tab.icon || '📋'}
                  </span>
                  <span className="text-base lg:text-lg whitespace-nowrap">
                    {tab.label || 'Tab'}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {/* Structure Tab */}
              {activeTab === 'structure' && (
                <motion.div
                  key="structure"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-white mb-4">
                      {departmentsData.overview.title}
                    </h3>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                      {t('generalDepartments.structure.description', 'Организационная структура академии включает различные подразделения, каждое из которых выполняет важные функции')}
                    </p>
                  </div>

                  {hasOverview ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {departmentsData.overview.items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:border-blue-400/30 transition-all duration-500 transform hover:-translate-y-2 group backdrop-blur-sm"
                        >
                          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 text-blue-400">
                            {item.icon}
                          </div>
                          <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                            {item.title}
                          </h4>
                          <p className="text-blue-100 text-lg">{item.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-blue-200 py-12">
                      {t('generalDepartments.noData', 'Данные о структуре пока не добавлены')}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Departments Tab */}
              {activeTab === 'departments' && (
                <motion.div
                  key="departments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  {/* Categories Navigation */}
                  {hasCategories && (
                    <div className="mb-8">
                      <h3 className="text-2xl font-bold text-white mb-6">
                        {t('generalDepartments.categories.title', 'Категории отделов')}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {departmentsData.categories.map((category) => {
                          const colors = getColorClasses(category.color);
                          return (
                            <motion.button
                              key={category.id}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                const depts = getDepartmentsByCategory(category.id);
                                if (depts.length > 0) {
                                  setSelectedDepartment(depts[0]);
                                }
                              }}
                              className={`px-4 py-3 rounded-2xl transition-all duration-300 flex items-center gap-3 ${
                                selectedDepartment?.category === category.id
                                  ? `${colors.bg} ${colors.border} border-2`
                                  : 'bg-white/5 border border-white/10 hover:border-white/20'
                              }`}
                            >
                              <span className={`text-xl ${selectedDepartment?.category === category.id ? colors.text : 'text-blue-300'}`}>
                                {category.icon}
                              </span>
                              <span className={`font-medium ${selectedDepartment?.category === category.id ? 'text-white' : 'text-blue-200'}`}>
                                {category.label}
                              </span>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Departments Grid */}
                  {hasDepartments ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {departmentsData.departments.map((dept, index) => {
                        const colors = getColorClasses(getCategoryColor(dept.category));
                        const isSelected = selectedDepartment?.id === dept.id;
                        
                        return (
                          <motion.div
                            key={dept.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedDepartment(dept)}
                            className={`bg-white/5 rounded-2xl p-6 border cursor-pointer transition-all duration-300 backdrop-blur-sm ${
                              isSelected
                                ? `${colors.border} shadow-2xl border-2`
                                : 'border-white/10 hover:border-emerald-400/30 hover:shadow-lg'
                            }`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-white mb-2">
                                  {dept.name}
                                </h4>
                                <p className="text-blue-200 text-sm mb-3">
                                  {dept.description}
                                </p>
                                <div className="flex items-center gap-3 text-blue-300">
                                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                                    <span className="text-sm">👤</span>
                                  </div>
                                  <div>
                                    <div className="text-sm font-medium">{dept.head}</div>
                                    <div className="text-xs text-blue-400">
                                      {t('generalDepartments.department.head.title', 'Руководитель')}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={`text-3xl ml-4 ${
                                isSelected ? colors.text : 'text-blue-300'
                              }`}>
                                {dept.icon}
                              </div>
                            </div>

                            <AnimatePresence>
                              {isSelected && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="mt-4 pt-4 border-t border-white/20 space-y-4"
                                >
                                  <div className="flex items-center justify-between text-sm text-blue-200">
                                    <div className="flex items-center gap-2">
                                      <span>📞</span>
                                      <span>{dept.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span>📍</span>
                                      <span>{dept.location}</span>
                                    </div>
                                  </div>
                                  
                                  {dept.functions && dept.functions.length > 0 && (
                                    <div>
                                      <h5 className="text-sm font-semibold text-white mb-2">
                                        {t('generalDepartments.department.functions.title', 'Функции')}:
                                      </h5>
                                      <div className="flex flex-wrap gap-2">
                                        {dept.functions.slice(0, 3).map((func, i) => (
                                          <span
                                            key={i}
                                            className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-xl text-xs border border-blue-400/30"
                                          >
                                            {func}
                                          </span>
                                        ))}
                                        {dept.functions.length > 3 && (
                                          <span className="px-3 py-1 bg-white/10 text-blue-300 rounded-xl text-xs">
                                            +{dept.functions.length - 3}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center text-blue-200 py-12">
                      {t('generalDepartments.noDepartments', 'Информация об отделах пока не добавлена')}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Leadership Tab */}
              {activeTab === 'leadership' && (
                <motion.div
                  key="leadership"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-white mb-4">
                      {t('generalDepartments.leadership.title', 'Руководство')}
                    </h3>
                    <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                      {t('generalDepartments.leadership.description', 'Профессиональное руководство обеспечивает эффективную работу всех подразделений академии')}
                    </p>
                  </div>

                  {hasLeadership ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {departmentsData.leadership.map((leader, index) => (
                        <motion.div
                          key={leader.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:border-purple-400/30 transition-all duration-500 transform hover:-translate-y-2 group backdrop-blur-sm"
                        >
                          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                            {leader.avatar}
                          </div>
                          <h4 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                            {leader.name}
                          </h4>
                          <p className="text-purple-400 text-lg mb-2">
                            {leader.position}
                          </p>
                          <p className="text-blue-200 text-sm mb-4">
                            {leader.department}
                          </p>
                          {leader.bio && (
                            <p className="text-blue-100 text-sm leading-relaxed">
                              {leader.bio}
                            </p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-blue-200 py-12">
                      {t('generalDepartments.noLeadership', 'Информация о руководстве пока не добавлена')}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold text-white flex items-center">
                        <span className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center text-white mr-4 text-lg">
                          🏢
                        </span>
                        {t('generalDepartments.about.title', 'О структуре')}
                      </h3>
                      <p className="text-blue-100 text-lg leading-relaxed border-l-4 border-orange-500 pl-6 py-4 bg-white/5 rounded-r-2xl backdrop-blur-sm">
                        {t('generalDepartments.about.description', 'Организационная структура академии включает в себя академические, административные, научные и технические подразделения, каждое из которых играет важную роль в обеспечении качественного образования и развития')}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-2xl p-6 border border-orange-500/20 backdrop-blur-sm">
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                        <span className="w-8 h-8 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center text-white mr-3 text-sm">
                          ✨
                        </span>
                        {t('generalDepartments.principles.title', 'Основные принципы')}
                      </h4>
                      <ul className="space-y-4">
                        {[
                          t('generalDepartments.principles.1', 'Эффективное управление ресурсами'),
                          t('generalDepartments.principles.2', 'Современные подходы к организации'),
                          t('generalDepartments.principles.3', 'Профессиональное развитие сотрудников'),
                          t('generalDepartments.principles.4', 'Инновационные решения в управлении'),
                        ].map((principle, index) => (
                          <motion.li
                            key={index}
                            className="flex items-start group"
                            whileHover={{ x: 10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <span className="w-3 h-3 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                            <span className="text-blue-100 text-lg group-hover:text-white transition-colors duration-300">
                              {principle}
                            </span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GeneralDepartments;