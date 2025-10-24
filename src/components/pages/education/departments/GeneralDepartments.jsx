import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const GeneralDepartments = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('academic');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);

  // Получаем данные с проверками
  const departmentsData = t('generalDepartments', { returnObjects: true }) || {};
  
  // Функция для нормализации данных
  const normalizeData = (data) => {
    const defaultData = {
      name: t('generalDepartments.name', 'Отделы и структуры'),
      fullDescription: t('generalDepartments.fullDescription', 'Организационная структура академии и все подразделения'),
      badge: t('generalDepartments.badge', 'Организационная структура'),
      stats: Array.isArray(data.stats) ? data.stats : [
        { 
          label: t('generalDepartments.stats.departments.label', 'Отделов'), 
          value: '25+', 
          icon: '🏢' 
        },
        { 
          label: t('generalDepartments.stats.employees.label', 'Сотрудников'), 
          value: '150+', 
          icon: '👨‍🏫' 
        },
        { 
          label: t('generalDepartments.stats.faculties.label', 'Факультетов'), 
          value: '15', 
          icon: '🎓' 
        },
        { 
          label: t('generalDepartments.stats.campuses.label', 'Кампусов'), 
          value: '5', 
          icon: '🏛️' 
        }
      ],
      categories: Array.isArray(data.categories) ? data.categories : [
        { 
          id: 'academic', 
          label: t('generalDepartments.categories.academic', 'Академические'), 
          icon: '🎓', 
          color: 'blue' 
        },
        { 
          id: 'administrative', 
          label: t('generalDepartments.categories.administrative', 'Административные'), 
          icon: '🏢', 
          color: 'green' 
        },
        { 
          id: 'research', 
          label: t('generalDepartments.categories.research', 'Научные'), 
          icon: '🔬', 
          color: 'purple' 
        },
        { 
          id: 'student', 
          label: t('generalDepartments.categories.student', 'Студенческие'), 
          icon: '👥', 
          color: 'orange' 
        },
        { 
          id: 'technical', 
          label: t('generalDepartments.categories.technical', 'Технические'), 
          icon: '⚙️', 
          color: 'red' 
        }
      ],
      departments: Array.isArray(data.departments) ? data.departments : [
        {
          id: 1,
          name: t('generalDepartments.departments.academic.name', 'Учебный отдел'),
          description: t('generalDepartments.departments.academic.description', 'Организация учебного процесса'),
          category: 'academic',
          head: t('generalDepartments.departments.academic.head', 'Иван Петров'),
          phone: '+7 (495) 123-45-67',
          location: t('generalDepartments.departments.academic.location', 'Главный корпус, каб. 101'),
          icon: '📚',
          functions: [
            t('generalDepartments.departments.academic.functions.0', 'Планирование учебного процесса'),
            t('generalDepartments.departments.academic.functions.1', 'Контроль успеваемости'),
            t('generalDepartments.departments.academic.functions.2', 'Организация сессий')
          ]
        }
      ],
      functions: Array.isArray(data.functions) ? data.functions : [
        { 
          icon: '📚', 
          title: t('generalDepartments.functions.education.title', 'Образование'), 
          description: t('generalDepartments.functions.education.description', 'Организация учебного процесса и программ') 
        },
        { 
          icon: '🔬', 
          title: t('generalDepartments.functions.research.title', 'Исследования'), 
          description: t('generalDepartments.functions.research.description', 'Научная деятельность и разработки') 
        },
        { 
          icon: '🤝', 
          title: t('generalDepartments.functions.community.title', 'Сообщество'), 
          description: t('generalDepartments.functions.community.description', 'Развитие студенческого сообщества') 
        },
        { 
          icon: '💼', 
          title: t('generalDepartments.functions.management.title', 'Управление'), 
          description: t('generalDepartments.functions.management.description', 'Административное управление академией') 
        }
      ]
    };

    return defaultData;
  };

  // Нормализуем данные
  const normalizedData = normalizeData(departmentsData);

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
  }, []);

  const startCounters = () => {
    const targetValues = normalizedData.stats.map(stat => parseInt(stat.value.replace(/\D/g, '')) || 0);
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
  };

  // Фильтрация отделов по категории и поиску
  const filteredDepartments = normalizedData.departments
    .filter(dept => dept.category === activeCategory)
    .filter(dept => 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
          bg: 'bg-gray-500/10', 
          border: 'border-gray-400/30', 
          text: 'text-gray-400',
          active: 'bg-gray-500',
          light: 'bg-gray-500/20',
          gradient: 'from-gray-500 to-blue-500'
        };
    }
  };

  const currentCategory = normalizedData.categories.find(cat => cat.id === activeCategory);
  const categoryColors = currentCategory ? getColorClasses(currentCategory.color) : getColorClasses('blue');

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
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 mb-6"
          >
            <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-blue-100 font-medium text-lg">
              {normalizedData.badge}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {normalizedData.name}
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
            {normalizedData.fullDescription}
          </motion.p>
        </motion.div>

        {/* Dynamic Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 lg:mb-20"
        >
          {normalizedData.stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group text-center relative overflow-hidden"
            >
              {/* Background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <motion.div 
                  className="text-5xl mb-6 transition-transform duration-500 group-hover:scale-110"
                  whileHover={{ scale: 1.2, rotate: 12 }}
                >
                  {stat.icon}
                </motion.div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-4 font-mono bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
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

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/5 rounded-3xl border border-white/20 p-6 sticky top-6 backdrop-blur-lg shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-2xl">📂</span>
                <span>{t('generalDepartments.sidebar.categories', 'Категории')}</span>
              </h3>
              
              <div className="space-y-2">
                {normalizedData.categories.map((category) => {
                  const colors = getColorClasses(category.color);
                  const isActive = activeCategory === category.id;
                  
                  return (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setSelectedDepartment(null);
                      }}
                      className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center gap-3 group backdrop-blur-sm ${
                        isActive
                          ? `${colors.bg} ${colors.border} border-2 shadow-lg`
                          : 'bg-white/5 border border-transparent hover:border-white/20'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isActive ? colors.light : 'bg-white/10'
                      }`}>
                        <span className={`text-lg ${isActive ? colors.text : 'text-blue-300'}`}>
                          {category.icon}
                        </span>
                      </div>
                      <span className={`font-medium ${isActive ? 'text-white' : 'text-blue-200'}`}>
                        {category.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="mt-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('generalDepartments.search.placeholder', 'Поиск отделов...')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-blue-300 focus:outline-none focus:border-emerald-400/50 transition-all duration-300 backdrop-blur-sm"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300">
                    🔍
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/5 rounded-3xl border border-white/20 p-6 mb-6 backdrop-blur-lg shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${categoryColors.bg} rounded-2xl flex items-center justify-center border ${categoryColors.border}`}>
                    <span className={`text-2xl ${categoryColors.text}`}>{currentCategory?.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {currentCategory?.label}
                    </h2>
                    <p className="text-blue-200">
                      {t('generalDepartments.category.subtitle', 'Отделы {{category}} направлений', { 
                        category: currentCategory?.label.toLowerCase() 
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-emerald-400 bg-emerald-500/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                  {t('generalDepartments.search.results', '{{count}} найдено', { 
                    count: filteredDepartments.length 
                  })}
                </div>
              </div>
            </motion.div>

            {/* Departments Grid */}
            {filteredDepartments.length > 0 ? (
              <motion.div
                layout
                className="grid md:grid-cols-2 gap-6 mb-8"
              >
                {filteredDepartments.map((department, index) => {
                  const isSelected = selectedDepartment?.id === department.id;
                  const deptColors = getColorClasses(currentCategory.color);
                  
                  return (
                    <motion.div
                      key={department.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedDepartment(department)}
                      className={`bg-white/5 rounded-3xl border cursor-pointer transition-all duration-300 overflow-hidden backdrop-blur-sm ${
                        isSelected
                          ? `${deptColors.border} shadow-2xl border-2`
                          : 'border-white/10 hover:border-emerald-400/30 hover:shadow-lg'
                      }`}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">
                              {department.name}
                            </h3>
                            <p className="text-blue-200 text-sm">
                              {department.description}
                            </p>
                          </div>
                          <div className={`text-3xl ml-4 ${
                            isSelected ? deptColors.text : 'text-blue-300'
                          }`}>
                            {department.icon || '🏢'}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-blue-200">
                          <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                            <span className="text-sm">👤</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{department.head}</div>
                            <div className="text-xs text-blue-300">
                              {t('generalDepartments.department.head.title', 'Руководитель отдела')}
                            </div>
                          </div>
                        </div>

                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-4 pt-4 border-t border-white/20"
                            >
                              <div className="flex items-center justify-between text-sm text-blue-200">
                                <div className="flex items-center gap-2">
                                  <span>📞</span>
                                  <span>{department.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span>📍</span>
                                  <span>{department.location}</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 rounded-3xl border border-white/20 p-12 text-center backdrop-blur-lg"
              >
                <div className="text-6xl mb-4 text-blue-300">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t('generalDepartments.search.noResults.title', 'Отделы не найдены')}
                </h3>
                <p className="text-blue-200 mb-6">
                  {t('generalDepartments.search.noResults.description', 'Попробуйте изменить поисковый запрос или выбрать другую категорию')}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchTerm('')}
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-lg"
                >
                  {t('generalDepartments.search.clear', 'Очистить поиск')}
                </motion.button>
              </motion.div>
            )}

            {/* Selected Department Details */}
            <AnimatePresence>
              {selectedDepartment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/5 rounded-3xl border border-white/20 p-6 mb-8 backdrop-blur-lg shadow-2xl"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {selectedDepartment.name}
                      </h3>
                      <p className="text-blue-100 text-lg leading-relaxed">
                        {selectedDepartment.detailedDescription || selectedDepartment.description}
                      </p>
                    </div>
                    <div className="text-4xl text-emerald-400 ml-6">
                      {selectedDepartment.icon || '🏢'}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-4 border border-blue-400/30">
                      <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                        <span>👤</span>
                        <span>{t('generalDepartments.details.head.title', 'Руководитель')}</span>
                      </h4>
                      <p className="text-white font-medium">{selectedDepartment.head}</p>
                      {selectedDepartment.position && (
                        <p className="text-blue-300 text-sm">{selectedDepartment.position}</p>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl p-4 border border-emerald-400/30">
                      <h4 className="font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                        <span>📞</span>
                        <span>{t('generalDepartments.details.phone.title', 'Телефон')}</span>
                      </h4>
                      <a 
                        href={`tel:${selectedDepartment.phone}`}
                        className="text-white font-medium hover:text-emerald-300 transition-colors"
                      >
                        {selectedDepartment.phone}
                      </a>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-4 border border-purple-400/30">
                      <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                        <span>📍</span>
                        <span>{t('generalDepartments.details.location.title', 'Местоположение')}</span>
                      </h4>
                      <p className="text-white font-medium">{selectedDepartment.location}</p>
                    </div>
                  </div>

                  {/* Department Functions */}
                  {selectedDepartment.functions && (
                    <div>
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="text-2xl">🎯</span>
                        <span>{t('generalDepartments.details.functions.title', 'Основные функции')}</span>
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {selectedDepartment.functions.map((func, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-emerald-400 text-sm">✓</span>
                            </div>
                            <span className="text-blue-100">{func}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Department Functions Overview */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white/5 rounded-3xl border border-white/20 p-6 backdrop-blur-lg shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                {t('generalDepartments.overview.title', 'Основные направления деятельности')}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {normalizedData.functions.map((func, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-white/5 rounded-3xl p-6 border border-white/10 text-center hover:border-emerald-400/30 transition-all duration-300 group backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 text-emerald-400">
                      {func.icon}
                    </div>
                    <h4 className="font-semibold text-white mb-3">{func.title}</h4>
                    <p className="text-blue-200 text-sm leading-relaxed">{func.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralDepartments;