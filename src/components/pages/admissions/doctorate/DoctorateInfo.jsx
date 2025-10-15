// DoctorateInfo.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorateInfo = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [apiData, setApiData] = useState({
    admissionSteps: [],
    statistics: [],
    programs: [],
    programDetails: null
  });
  const [loading, setLoading] = useState({
    admissionSteps: true,
    statistics: true,
    programs: true
  });
  const sectionRef = useRef(null);

  // Базовые данные из переводов
  const doctorateData = t('doctorate', { returnObjects: true });
  const tabs = t('doctorate.tabs', { returnObjects: true });
  const contacts = t('doctorate.contacts.details', { returnObjects: true });
  const deadlines = t('doctorate.deadlines', { returnObjects: true });

  // Функции для загрузки данных с API
  const fetchAdmissionSteps = async () => {
    try {
      const response = await fetch(`/api/admission/doctor-admission-steps/?lang=${i18n.language}`);
      const data = await response.json();
      setApiData(prev => ({ ...prev, admissionSteps: data.results }));
    } catch (error) {
      console.error('Error fetching admission steps:', error);
    } finally {
      setLoading(prev => ({ ...prev, admissionSteps: false }));
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`/api/admission/doctor-statistics/?lang=${i18n.language}`);
      const data = await response.json();
      setApiData(prev => ({ ...prev, statistics: data.results }));
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(prev => ({ ...prev, statistics: false }));
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`/api/admission/doctor-programs/?lang=${i18n.language}`);
      const data = await response.json();
      setApiData(prev => ({ ...prev, programs: data }));
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(prev => ({ ...prev, programs: false }));
    }
  };

  const fetchProgramDetails = async (programId) => {
    try {
      const response = await fetch(`/api/admission/doctor-programs/?lang=${i18n.language}&id=${programId}`);
      const data = await response.json();
      setApiData(prev => ({ ...prev, programDetails: data }));
    } catch (error) {
      console.error('Error fetching program details:', error);
    }
  };

  // Загрузка данных при монтировании и смене языка
  useEffect(() => {
    fetchAdmissionSteps();
    fetchStatistics();
    fetchPrograms();
  }, [i18n.language]);

  // Intersection Observer для анимаций
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

  // Автопереключение шагов поступления
  useEffect(() => {
    if (apiData.admissionSteps.length > 0) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % apiData.admissionSteps.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [apiData.admissionSteps.length]);

  // Функция для преобразования данных программ в нужный формат
  const formatProgramData = (program) => ({
    id: program.id,
    name: program.program_name,
    description: program.short_description || program.description,
    duration: `${program.duration} ${t('doctorate.programs.years')}`,
    tags: program.features || []
  });

  // Функция для преобразования статистики
  const formatStatData = (stat) => ({
    id: stat.id,
    value: stat.titleInt,
    label: stat.description
  });

  // Функция для преобразования шагов поступления
  const formatStepData = (step) => ({
    id: step.id,
    title: step.title,
    description: step.description,
    deadline: step.deadline,
    requirements: step.requirement
  });

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон (остается без изменений) */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-bounce delay-1500"></div>
        
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🎓</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🔬</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🏆</div>
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
            🎓
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {doctorateData.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {doctorateData.subtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Основной контент - 2/3 ширины */}
          <div className="lg:col-span-2">
            {/* Навигационные табы */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
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
                {/* Вкладка "О программе" */}
                {activeTab === 'about' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                      {doctorateData.about.title}
                    </h2>
                    <p className="text-blue-100 text-lg leading-relaxed">
                      {doctorateData.about.description}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                      {doctorateData.about.features.map((feature, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-4 p-4 bg-white/5 rounded-2xl backdrop-blur-sm"
                        >
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
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

                {/* Вкладка "Программы" */}
                {activeTab === 'programs' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {doctorateData.programs.title}
                    </h2>
                    
                    {loading.programs ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        <p className="text-blue-200 mt-4">{t('common.loading')}</p>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {apiData.programs.map((program, index) => (
                          <motion.div
                            key={program.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                                  {program.program_name}
                                </h3>
                                <p className="text-blue-200 mb-3">
                                  {program.short_description || program.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {program.features?.map((tag, tagIndex) => (
                                    <span 
                                      key={tagIndex}
                                      className="px-3 py-1 bg-white/10 rounded-full text-sm text-blue-200 backdrop-blur-sm"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-emerald-400 mb-2">
                                  {program.duration} {t('doctorate.programs.years')}
                                </div>
                                <button 
                                  onClick={() => fetchProgramDetails(program.id)}
                                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
                                >
                                  {t('doctorate.buttons.moreDetails')}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Вкладка "Поступление" */}
                {activeTab === 'admission' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {doctorateData.admission.title}
                    </h2>
                    
                    {loading.admissionSteps ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                        <p className="text-blue-200 mt-4">{t('common.loading')}</p>
                      </div>
                    ) : (
                      <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-1 bg-white/10 rounded-full hidden md:block"></div>
                        
                        <div className="space-y-8">
                          {apiData.admissionSteps.map((step, index) => (
                            <motion.div
                              key={step.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.2 }}
                              className="flex items-start space-x-6 group cursor-pointer"
                              onMouseEnter={() => setActiveStep(index)}
                            >
                              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${
                                activeStep === index
                                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 scale-110 shadow-lg'
                                  : 'bg-white/10 group-hover:bg-white/20'
                              }`}>
                                {index + 1}
                              </div>
                              <div className={`flex-1 p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                                activeStep === index
                                  ? 'bg-white/10 border-emerald-400/30 shadow-lg'
                                  : 'bg-white/5 border-white/10 group-hover:bg-white/10'
                              }`}>
                                <h3 className="text-xl font-semibold text-white mb-3">
                                  {step.title}
                                </h3>
                                <p className="text-blue-200 mb-4">
                                  {step.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-emerald-400 font-medium">
                                    {step.deadline}
                                  </span>
                                  <span className="text-sm text-blue-300">
                                    {step.requirement}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Вкладка "Исследования" */}
                {activeTab === 'research' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {doctorateData.research.title}
                    </h2>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {doctorateData.research.areas.map((area, index) => (
                        <motion.div
                          key={area.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group text-center"
                        >
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                            {area.icon}
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-3">
                            {area.name}
                          </h3>
                          <p className="text-blue-200 text-sm">
                            {area.description}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Боковая панель - 1/3 ширины */}
          <div className="space-y-8">
            {/* Статистика */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {doctorateData.stats.title}
              </h3>
              
              {loading.statistics ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {apiData.statistics.map((stat, index) => (
                    <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2">
                        {stat.titleInt}
                      </div>
                      <div className="text-blue-200 text-sm lg:text-base">
                        {stat.description}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Контакты */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {doctorateData.contacts.title}
              </h3>
              
              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center text-white">
                      {contact.icon}
                    </div>
                    <div>
                      <div className="text-white font-medium">{contact.label}</div>
                      <div className="text-blue-200 text-sm">{contact.value}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Срочные даты */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-blue-400/30 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                {t('doctorate.deadlinesTitle')}
              </h3>
              
              <div className="space-y-3">
                {deadlines.map((deadline, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <span className="text-white text-sm">{deadline.event}</span>
                    <span className="text-emerald-300 text-sm font-semibold">{deadline.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorateInfo;