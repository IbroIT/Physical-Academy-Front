// VisaSupport.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const VisaSupport = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState('process');
  const [isVisible, setIsVisible] = useState(false);
  const [selectedVisaType, setSelectedVisaType] = useState('student');
  const sectionRef = useRef(null);

  const visaData = t('visaSupport', { returnObjects: true });
  const tabs = visaData.tabs;
  const steps = visaData.process.steps;
  const visaTypes = visaData.types.list;
  const documents = visaData.documents.list;
  const faqs = visaData.faq.list;

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
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [steps.length]);

  const selectedVisa = visaTypes.find(type => type.id === selectedVisaType) || visaTypes[0];

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный глобальный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Глобус и паспортные элементы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🌍</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🛂</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">✈️</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl opacity-5">📋</div>
        
        {/* Анимированные линии границ */}
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
            {visaData.headerIcon}
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {visaData.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {visaData.subtitle}
          </p>
        </motion.div>

        {/* Быстрая статистика */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
        >
          {visaData.stats.map((stat, index) => (
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
                {/* Процесс получения */}
                {activeTab === 'process' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {visaData.process.title}
                    </h2>
                    
                    {/* Шаги процесса */}
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-1 bg-white/10 rounded-full hidden md:block"></div>
                      
                      <div className="space-y-8">
                        {steps.map((step, index) => (
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
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
                                <h3 className="text-xl font-semibold text-white">
                                  {step.title}
                                </h3>
                                <span className="text-emerald-400 font-medium text-sm bg-emerald-500/20 px-3 py-1 rounded-full">
                                  {step.duration}
                                </span>
                              </div>
                              <p className="text-blue-200 mb-4">
                                {step.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-300">
                                  {visaData.ui.locationIcon} {step.location}
                                </span>
                                <span className="text-sm text-emerald-300 font-medium">
                                  {step.cost}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Типы виз */}
                {activeTab === 'types' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {visaData.types.title}
                    </h2>
                    
                    {/* Селектор типа визы */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                      {visaTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedVisaType(type.id)}
                          className={`p-4 rounded-2xl text-center transition-all duration-300 ${
                            selectedVisaType === type.id
                              ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg scale-105'
                              : 'bg-white/5 text-blue-100 hover:bg-white/10'
                          }`}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-semibold text-sm">{type.name}</div>
                        </button>
                      ))}
                    </div>

                    {/* Детали выбранной визы */}
                    <motion.div
                      key={selectedVisaType}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm border border-white/20"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                            <span className="text-2xl mr-3">{selectedVisa.icon}</span>
                            {selectedVisa.name}
                          </h3>
                          <p className="text-blue-200 mb-4">
                            {selectedVisa.description}
                          </p>
                          <div className="space-y-2">
                            {selectedVisa.features.map((feature, index) => (
                              <div key={index} className="flex items-center text-blue-100">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-white/10 rounded-xl p-4">
                            <h4 className="text-white font-semibold mb-2">{visaData.ui.validity}</h4>
                            <p className="text-emerald-300">{selectedVisa.validity}</p>
                          </div>
                          <div className="bg-white/10 rounded-xl p-4">
                            <h4 className="text-white font-semibold mb-2">{visaData.ui.cost}</h4>
                            <p className="text-emerald-300">{selectedVisa.cost}</p>
                          </div>
                          <div className="bg-white/10 rounded-xl p-4">
                            <h4 className="text-white font-semibold mb-2">{visaData.ui.processingTime}</h4>
                            <p className="text-emerald-300">{selectedVisa.processingTime}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Документы */}
                {activeTab === 'documents' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {visaData.documents.title}
                    </h2>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {documents.map((doc, index) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-300">
                              {doc.icon}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-2">
                                {doc.name}
                              </h3>
                              <p className="text-blue-200 text-sm mb-3">
                                {doc.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-emerald-300 text-sm font-medium">
                                  {doc.importance}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  doc.required 
                                    ? 'bg-emerald-500/20 text-emerald-300' 
                                    : 'bg-blue-500/20 text-blue-300'
                                }`}>
                                  {doc.required ? visaData.ui.required : visaData.ui.recommended}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Важное примечание */}
                    <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-6 mt-8 backdrop-blur-sm border border-blue-400/30">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <span className="text-xl mr-2">{visaData.documents.notes.icon}</span>
                        {visaData.documents.notes.title}
                      </h4>
                      <ul className="text-blue-200 space-y-2 text-sm">
                        {visaData.documents.notes.items.map((note, index) => (
                          <li key={index}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* FAQ */}
                {activeTab === 'faq' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {visaData.faq.title}
                    </h2>
                    
                    <div className="space-y-4">
                      {faqs.map((faq, index) => (
                        <motion.div
                          key={faq.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
                        >
                          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                            <span className="text-emerald-400 mr-3">{visaData.faq.icon}</span>
                            {faq.question}
                          </h3>
                          <p className="text-blue-200 pl-8">
                            {faq.answer}
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
            {/* Контакты визовой поддержки */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {visaData.contacts.title}
              </h3>
              
              <div className="space-y-4">
                {visaData.contacts.details.map((contact, index) => (
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
                    <div className="flex-1 min-w-0">
                      <div className="text-white font-medium text-sm">{contact.label}</div>
                      <div className="text-blue-200 text-sm truncate">{contact.value}</div>
                      {contact.hours && (
                        <div className="text-emerald-300 text-xs">{contact.hours}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {visaData.contacts.button}
              </motion.button>
            </motion.div>

            {/* Срочные сроки */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-blue-400/30 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                {visaData.deadlines.title}
              </h3>
              
              <div className="space-y-3">
                {visaData.deadlines.items.map((deadline, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <span className="text-white text-sm">{deadline.event}</span>
                    <span className="text-emerald-300 text-sm font-semibold">{deadline.date}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Статус визового процесса */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {visaData.status.title}
              </h3>
              
              <div className="space-y-4">
                {visaData.status.items.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm text-blue-200">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 backdrop-blur-sm">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: 1.2 + index * 0.2 }}
                        className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 shadow-lg"
                      ></motion.div>
                    </div>
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

export default VisaSupport;