// components/BachelorInternational.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const BachelorInternational = () => {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState('germany');
  const [activeTab, setActiveTab] = useState('requirements');
  const [isVisible, setIsVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);

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

  // Автопереключение шагов
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % processSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const countries = t('bachelorInternational.countries', { returnObjects: true });
  const processSteps = t('bachelorInternational.process.steps', { returnObjects: true });
  const stats = t('bachelorInternational.stats', { returnObjects: true });

  const currentCountry = countries.find(country => country.id === selectedCountry) || countries[0];

  const getCountryGradient = (color) => {
    const gradientMap = {
      blue: 'from-blue-500 to-emerald-500',
      green: 'from-emerald-500 to-blue-600',
      red: 'from-red-500 to-orange-500',
      purple: 'from-purple-500 to-pink-500',
      default: 'from-blue-500 to-emerald-500'
    };
    return gradientMap[color] || gradientMap.default;
  };

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Международные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🌍</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🎓</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">✈️</div>
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
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            🌍
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('bachelorInternational.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('bachelorInternational.subtitle')}
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

        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12 mb-16 lg:mb-20">
          {/* Выбор страны */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl sticky top-6"
            >
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                {t('bachelorInternational.chooseCountry')}
              </h3>
              <div className="space-y-4">
                {countries.map((country) => {
                  const gradient = getCountryGradient(country.color);
                  const isSelected = selectedCountry === country.id;
                  
                  return (
                    <motion.button
                      key={country.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedCountry(country.id)}
                      className={`w-full p-4 rounded-2xl border transition-all duration-500 text-left group backdrop-blur-sm ${
                        isSelected
                          ? `bg-gradient-to-r ${gradient} text-white shadow-2xl scale-105 border-transparent`
                          : 'bg-white/5 border-white/10 text-blue-100 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{country.flag}</span>
                          <span className="font-semibold text-lg">{country.name}</span>
                        </div>
                        <motion.div
                          className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                            isSelected 
                              ? 'bg-white border-white shadow-inner' 
                              : 'border-blue-300 group-hover:border-emerald-300 bg-transparent'
                          }`}
                          animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.5 }}
                        ></motion.div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Детали страны */}
          <div className="lg:col-span-3">
            <motion.div
              key={selectedCountry}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
            >
              {/* Заголовок страны */}
              <div className={`bg-gradient-to-r ${getCountryGradient(currentCountry.color)} p-6 lg:p-8`}>
                <div className="flex items-center gap-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-2xl flex items-center justify-center text-white text-3xl lg:text-4xl backdrop-blur-sm"
                  >
                    {currentCountry.flag}
                  </motion.div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                      {currentCountry.name}
                    </h2>
                    <p className="text-blue-100 text-lg">
                      {t('bachelorInternational.opportunities')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Вкладки */}
              <div className="border-b border-white/10">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {[
                    { id: 'requirements', icon: '📋', label: t('bachelorInternational.requirements') },
                    { id: 'support', icon: '🛠️', label: t('bachelorInternational.support') },
                    { id: 'universities', icon: '🎓', label: t('bachelorInternational.universities') }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 px-6 py-4 text-sm lg:text-base font-medium border-b-2 transition-all duration-300 backdrop-blur-sm ${
                        activeTab === tab.id
                          ? 'border-emerald-400 text-white bg-white/5'
                          : 'border-transparent text-blue-200 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Контент вкладок */}
              <div className="p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'requirements' && (
                    <motion.div
                      key="requirements"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-6">
                        {t('bachelorInternational.requirementsForAdmission')}
                      </h3>
                      <div className="grid gap-4">
                        {currentCountry.requirements.map((req, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                          >
                            <div className={`w-8 h-8 bg-gradient-to-r ${getCountryGradient(currentCountry.color)} rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300`}>
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                            <span className="text-blue-100 text-lg leading-relaxed">{req}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'support' && (
                    <motion.div
                      key="support"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-6">
                        {t('bachelorInternational.ourSupport')}
                      </h3>
                      <div className="grid gap-4">
                        {currentCountry.support.map((sup, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-start gap-4 p-4 bg-emerald-500/10 rounded-2xl backdrop-blur-sm border border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-300 group"
                          >
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-300 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300">
                              <span className="text-sm">✓</span>
                            </div>
                            <span className="text-emerald-100 text-lg leading-relaxed">{sup}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'universities' && (
                    <motion.div
                      key="universities"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6"
                    >
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-6">
                        {t('bachelorInternational.topUniversities')}
                      </h3>
                      <div className="grid gap-4">
                        {currentCountry.universities.map((uni, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-blue-400/30 transition-all duration-300 group"
                          >
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-300">
                              🎓
                            </div>
                            <span className="text-blue-100 text-lg font-medium">{uni}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Процесс поступления */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-16 lg:mb-20"
        >
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              {t('bachelorInternational.process.title')}
            </h2>
            <p className="text-blue-100 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
              {t('bachelorInternational.process.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="group"
              >
                <div className={`bg-white/5 backdrop-blur-lg rounded-3xl p-6 lg:p-8 border transition-all duration-500 h-full ${
                  activeStep === index
                    ? 'border-emerald-400/50 shadow-2xl scale-105'
                    : 'border-white/10 hover:border-emerald-400/30 hover:shadow-xl'
                }`}>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6 lg:mb-8">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl lg:text-2xl shadow-2xl ${
                          activeStep === index ? 'ring-2 ring-emerald-400' : ''
                        }`}
                      >
                        {step.step}
                      </motion.div>
                      {index < processSteps.length - 1 && (
                        <div className="hidden lg:block absolute top-1/2 left-full w-full h-1 bg-white/10 -z-10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: activeStep >= index ? '100%' : 0 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500"
                          ></motion.div>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-white text-lg lg:text-xl mb-3 lg:mb-4">
                      {step.title}
                    </h3>
                    <p className="text-emerald-300 font-semibold mb-4 flex items-center gap-2 text-sm lg:text-base">
                      <span>⏱️</span>
                      <span>{step.duration}</span>
                    </p>
                    <p className="text-blue-100 text-sm lg:text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BachelorInternational;