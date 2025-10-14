import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const ExchangePrograms = () => {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [activeProgram, setActiveProgram] = useState(0);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);
  
  const data = t('students.exchange', { returnObjects: true });
  const regions = t('students.exchange.filters.regions', { returnObjects: true });
  const durations = t('students.exchange.filters.durations', { returnObjects: true });

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

  // Автопереключение программ
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProgram((prev) => (prev + 1) % (data.programs?.length || 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [data.programs]);

  const startCounters = () => {
    const stats = data.stats || [];

    const targetValues = stats.map(stat => parseInt(stat.value.replace(/\D/g, '')));
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

  const filteredPrograms = data.programs?.filter(program => {
    const matchesRegion = selectedRegion === 'all' || program.region === selectedRegion;
    const matchesDuration = selectedDuration === 'all' || program.durationType === selectedDuration;
    const matchesSearch = program.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesDuration && matchesSearch;
  }) || [];

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
            {data.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
        >
          {data.stats?.map((stat, index) => (
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
              <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300 font-mono">
                {stat.value.includes('%') 
                  ? `${Math.round(counterValues[index])}%`
                  : stat.value.includes('+')
                  ? `${Math.round(counterValues[index])}+`
                  : Math.round(counterValues[index])
                }
              </div>
              <div className="text-blue-200 text-sm lg:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Активная программа */}
        {data.programs?.[activeProgram] && (
          <motion.div
            key={activeProgram}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 backdrop-blur-lg border border-white/20 shadow-2xl mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                {data.programs[activeProgram].icon || '🎓'}
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  {data.programs[activeProgram].university}
                </h3>
                <p className="text-emerald-400 text-lg mb-3">
                  {data.programs[activeProgram].country} • {data.programs[activeProgram].duration}
                </p>
                <p className="text-blue-100 text-lg leading-relaxed">
                  {data.programs[activeProgram].description}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Программы обмена */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="space-y-6 mb-12"
        >
          <AnimatePresence>
            {filteredPrograms.map((program, index) => (
              <ProgramCard 
                key={program.id || index} 
                program={program} 
                index={index}
                isActive={activeProgram === index}
                onActivate={() => setActiveProgram(index)}
              />
            ))}
          </AnimatePresence>

          {/* Состояние "нет результатов" */}
          {filteredPrograms.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm"
            >
              <div className="text-6xl mb-4 text-blue-300 opacity-60">🔍</div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                {data.search?.noResults?.title}
              </h3>
              <p className="text-blue-200 text-lg mb-6">
                {data.search?.noResults?.description}
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedRegion('all');
                  setSelectedDuration('all');
                  setSearchTerm('');
                }}
                className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg"
              >
                {data.buttons?.reset}
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Дедлайны */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 border border-white/20 shadow-2xl mb-12 backdrop-blur-lg"
        >
          <h3 className="text-2xl font-bold text-white mb-8 text-center flex items-center justify-center gap-3">
            <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">📅</span>
            {data.deadlines?.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.deadlines?.list?.map((deadline, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 rounded-2xl p-6 text-center border border-white/10 hover:border-emerald-400/30 transition-all duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-xl font-bold text-white mb-2">{deadline.date}</div>
                <div className="text-emerald-400 text-lg font-medium mb-3">{deadline.program}</div>
                <div className="text-green-400 text-sm font-medium bg-green-500/20 px-3 py-1 rounded-full">
                  {deadline.daysLeft}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ProgramCard = ({ program, index, isActive, onActivate }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const common = t('students.exchange.common', { returnObjects: true });

  const handleApply = async () => {
    setIsApplying(true);
    // Имитация подачи заявки
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsApplying(false);
    alert(t('students.exchange.alerts.applicationSent', { university: program.university }));
  };

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
      className={`bg-white/5 rounded-3xl border backdrop-blur-sm transition-all duration-300 cursor-pointer ${
        isActive
          ? 'border-emerald-400/50 bg-white/10 shadow-2xl'
          : 'border-white/10 hover:border-emerald-400/30'
      }`}
      onClick={onActivate}
      whileHover={{ scale: 1.02 }}
    >
      <div className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Основная информация */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {program.university}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-blue-200 mb-4">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🌍</span>
                    <span>{program.country}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">⏱️</span>
                    <span>{program.duration}</span>
                  </span>
                  <span className={`px-4 py-2 rounded-2xl text-sm font-medium backdrop-blur-sm border ${difficultyColors.bg} ${difficultyColors.text} ${difficultyColors.border}`}>
                    {program.difficultyLabel || program.difficulty}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-400 mb-1">{program.cost || common.free}</div>
                <div className="text-blue-300 text-sm">{common.cost}</div>
              </div>
            </div>

            <p className="text-blue-100 mb-6 leading-relaxed text-lg">{program.description}</p>

            {/* Быстрая информация */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-lg font-bold text-white">{program.language || common.defaultLanguage}</div>
                <div className="text-blue-300 text-sm">{common.language}</div>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-lg font-bold text-white">{program.grantsAvailable || common.grantsAvailable}</div>
                <div className="text-blue-300 text-sm">{common.grants}</div>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-lg font-bold text-white">{program.deadline || common.soon}</div>
                <div className="text-blue-300 text-sm">{common.deadline}</div>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-lg font-bold text-white">{program.availableSpots || common.defaultSpots}</div>
                <div className="text-blue-300 text-sm">{common.spots}</div>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="lg:w-56 flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleApply();
              }}
              disabled={isApplying || program.availableSpots === 0}
              className={`w-full py-4 px-6 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center backdrop-blur-sm ${
                program.availableSpots > 0 && !isApplying
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
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
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
                onClick={(e) => e.stopPropagation()}
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
                    {(program.requirements || common.defaultRequirements).map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start text-blue-200">
                        <span className="text-emerald-400 mr-3 mt-1 text-lg">•</span>
                        {req}
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
                    {(program.benefits || common.defaultBenefits).map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start text-blue-200">
                        <span className="text-emerald-400 mr-3 mt-1 text-lg">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Доступные курсы */}
              {program.availableCourses && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-400/30 backdrop-blur-sm">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-3 text-lg">
                    <span className="text-xl">📚</span>
                    <span>{common.availableCourses}</span>
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {program.availableCourses.map((course, courseIndex) => (
                      <span key={courseIndex} className="px-4 py-2 bg-white/10 text-blue-200 rounded-2xl text-sm font-medium backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300">
                        {course}
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