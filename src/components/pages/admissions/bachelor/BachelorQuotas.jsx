// components/BachelorQuotas.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const BachelorQuotas = () => {
  const { t } = useTranslation();
  const [selectedQuota, setSelectedQuota] = useState(0);
  const [expandedSection, setExpandedSection] = useState('requirements');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const quotas = [
    {
      type: 'sports',
      title: t('bachelor.quotas.types.sports.title', 'Спортивная квота'),
      description: t('bachelor.quotas.types.sports.description', 'Для спортсменов с выдающимися достижениями'),
      icon: '🏆',
      requirements: [
        t('bachelor.quotas.types.sports.requirements.0', 'Документы, подтверждающие спортивные достижения'),
        t('bachelor.quotas.types.sports.requirements.1', 'Рекомендация от спортивной федерации'),
        t('bachelor.quotas.types.sports.requirements.2', 'Медицинская справка о допуске к занятиям'),
        t('bachelor.quotas.types.sports.requirements.3', 'Аттестат о среднем образовании')
      ],
      benefits: [
        t('bachelor.quotas.types.sports.benefits.0', 'Индивидуальный учебный план'),
        t('bachelor.quotas.types.sports.benefits.1', 'Совмещение тренировок и учебы'),
        t('bachelor.quotas.types.sports.benefits.2', 'Спортивная стипендия'),
        t('bachelor.quotas.types.sports.benefits.3', 'Проживание в спортивном общежитии')
      ],
      spots: 15,
      deadline: '20 августа',
      color: 'blue'
    },
    {
      type: 'health',
      title: t('bachelor.quotas.types.health.title', 'Квота по состоянию здоровья'),
      description: t('bachelor.quotas.types.health.description', 'Для лиц с ограниченными возможностями здоровья'),
      icon: '❤️',
      requirements: [
        t('bachelor.quotas.types.health.requirements.0', 'Медико-социальная экспертиза'),
        t('bachelor.quotas.types.health.requirements.1', 'Индивидуальная программа реабилитации'),
        t('bachelor.quotas.types.health.requirements.2', 'Заключение врачебной комиссии академии')
      ],
      benefits: [
        t('bachelor.quotas.types.health.benefits.0', 'Адаптированная программа обучения'),
        t('bachelor.quotas.types.health.benefits.1', 'Доступная среда'),
        t('bachelor.quotas.types.health.benefits.2', 'Персональный тьютор'),
        t('bachelor.quotas.types.health.benefits.3', 'Социальная поддержка')
      ],
      spots: 10,
      deadline: '25 августа',
      color: 'green'
    },
    {
      type: 'target',
      title: t('bachelor.quotas.types.target.title', 'Целевая квота'),
      description: t('bachelor.quotas.types.target.description', 'Для будущих сотрудников спортивных организаций'),
      icon: '🎯',
      requirements: [
        t('bachelor.quotas.types.target.requirements.0', 'Направление от спортивной организации'),
        t('bachelor.quotas.types.target.requirements.1', 'Трехсторонний договор'),
        t('bachelor.quotas.types.target.requirements.2', 'Обязательство отработать 3 года')
      ],
      benefits: [
        t('bachelor.quotas.types.target.benefits.0', 'Гарантированное трудоустройство'),
        t('bachelor.quotas.types.target.benefits.1', 'Стажировка в профильных организациях'),
        t('bachelor.quotas.types.target.benefits.2', 'Дополнительная стипендия')
      ],
      spots: 20,
      deadline: '15 августа',
      color: 'cyan'
    }
  ];

  const quotaStats = [
    { 
      number: '45', 
      label: t('bachelor.quotas.stats.totalSpots', 'всего мест по квотам'),
      description: t('bachelor.quotas.stats.totalSpotsDesc', 'Ежегодно выделяется')
    },
    { 
      number: '98%', 
      label: t('bachelor.quotas.stats.successRate', 'успешного зачисления'),
      description: t('bachelor.quotas.stats.successRateDesc', 'Проходят конкурсный отбор')
    },
    { 
      number: '25+', 
      label: t('bachelor.quotas.stats.sportsOrganizations', 'спортивных организаций'),
      description: t('bachelor.quotas.stats.sportsOrganizationsDesc', 'Участвуют в программе')
    },
    { 
      number: '3', 
      label: t('bachelor.quotas.stats.quotaTypes', 'вида квот'),
      description: t('bachelor.quotas.stats.quotaTypesDesc', 'Для разных категорий абитуриентов')
    }
  ];

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

  // Автопереключение квот
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedQuota((prev) => (prev + 1) % quotas.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [quotas.length]);

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        gradient: 'from-blue-500 to-cyan-500',
        light: 'bg-blue-500/20',
        border: 'border-blue-400/30',
        text: 'text-blue-400',
        button: 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
      },
      green: {
        gradient: 'from-green-500 to-emerald-500',
        light: 'bg-green-500/20',
        border: 'border-green-400/30',
        text: 'text-green-400',
        button: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
      },
      cyan: {
        gradient: 'from-cyan-500 to-blue-500',
        light: 'bg-cyan-500/20',
        border: 'border-cyan-400/30',
        text: 'text-cyan-400',
        button: 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'
      }
    };
    return colors[color] || colors.blue;
  };

  const currentQuota = quotas[selectedQuota];
  const colorClasses = getColorClasses(currentQuota.color);

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
        
        {/* Спортивные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏃‍♂️</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">⚽</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🏅</div>
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
            {t('bachelor.quotas.title', 'Образовательные квоты')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('bachelor.quotas.subtitle', 'Специальные программы поддержки для талантливых спортсменов и абитуриентов')}
          </p>
        </motion.div>

        {/* Статистика */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
        >
          {quotaStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
            >
              <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="font-semibold text-white mb-2">{stat.label}</div>
              <div className="text-blue-200 text-sm">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Выбор квоты */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 rounded-3xl p-6 backdrop-blur-lg border border-white/20 shadow-2xl sticky top-6">
              <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">
                {t('bachelor.quotas.availableQuotas', 'Доступные квоты')}
              </h2>
              <div className="space-y-3">
                {quotas.map((quota, index) => {
                  const quotaColor = getColorClasses(quota.color);
                  return (
                    <motion.button
                      key={quota.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedQuota(index)}
                      className={`w-full p-4 rounded-2xl border transition-all duration-300 text-left group ${
                        selectedQuota === index
                          ? `${quotaColor.border} ${quotaColor.light} shadow-lg`
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                          selectedQuota === index 
                            ? 'bg-white text-gray-900' 
                            : 'bg-white/10 text-white'
                        } transition-all duration-300`}>
                          {quota.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-sm ${
                            selectedQuota === index ? 'text-white' : 'text-blue-100'
                          }`}>
                            {quota.title}
                          </h3>
                          <p className="text-xs text-blue-200/80 mt-1 line-clamp-2">
                            {quota.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Детали квоты */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-3"
          >
            <div className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden">
              {/* Заголовок */}
              <div className={`p-6 lg:p-8 border-b border-white/20 relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses.gradient} opacity-10`}></div>
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl bg-white/20 backdrop-blur-sm text-white`}>
                        {currentQuota.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl lg:text-3xl font-bold text-white">{currentQuota.title}</h2>
                        <p className="text-blue-100 mt-2 text-lg">{currentQuota.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-200">{t('bachelor.quotas.availableSpots', 'Доступно мест')}</div>
                      <div className="text-3xl lg:text-4xl font-bold text-white">{currentQuota.spots}</div>
                      <div className="text-blue-200 text-sm mt-2">
                        {t('bachelor.quotas.deadline', 'До')} {currentQuota.deadline}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 lg:p-8">
                {/* Навигационные вкладки */}
                <div className="flex space-x-1 bg-white/5 rounded-2xl p-1 mb-8 backdrop-blur-sm">
                  {['requirements', 'benefits', 'process'].map((section) => (
                    <motion.button
                      key={section}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setExpandedSection(section)}
                      className={`flex-1 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                        expandedSection === section
                          ? `${colorClasses.light} text-white shadow-lg`
                          : 'text-blue-200 hover:text-white'
                      }`}
                    >
                      {t(`bachelor.quotas.${section}`, {
                        requirements: 'Требования',
                        benefits: 'Преимущества',
                        process: 'Процесс'
                      })}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {/* Секция требований */}
                  {expandedSection === 'requirements' && (
                    <motion.div
                      key="requirements"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="font-semibold text-white mb-6 flex items-center text-lg">
                            <span className="w-2 h-2 bg-red-400 rounded-full mr-3 animate-pulse"></span>
                            {t('bachelor.quotas.requiredDocuments', 'Необходимые документы')}
                          </h3>
                          <div className="space-y-4">
                            {currentQuota.requirements.map((req, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group"
                              >
                                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                                <span className="text-blue-100 group-hover:text-white transition-colors">{req}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white mb-6 flex items-center text-lg">
                            <span className="w-2 h-2 bg-yellow-400 rounded-full mr-3 animate-pulse"></span>
                            {t('bachelor.quotas.deadlines', 'Сроки подачи')}
                          </h3>
                          <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-blue-100">{t('bachelor.quotas.applicationDeadline', 'Крайний срок подачи')}:</span>
                              <span className="font-bold text-white text-xl">{currentQuota.deadline}</span>
                            </div>
                            <div className="text-blue-200/80 text-sm">
                              {t('bachelor.quotas.recommendEarly', 'Рекомендуем подать документы заранее для прохождения дополнительных испытаний')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Секция преимуществ */}
                  {expandedSection === 'benefits' && (
                    <motion.div
                      key="benefits"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h3 className="font-semibold text-white mb-6 flex items-center text-lg">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></span>
                            {t('bachelor.quotas.mainBenefits', 'Основные преимущества')}
                          </h3>
                          <div className="space-y-4">
                            {currentQuota.benefits.map((benefit, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-start p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group"
                              >
                                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                                <span className="text-blue-100 group-hover:text-white transition-colors">{benefit}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white mb-6 flex items-center text-lg">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
                            {t('bachelor.quotas.additionalSupport', 'Дополнительная поддержка')}
                          </h3>
                          <div className="space-y-4">
                            {[
                              t('bachelor.quotas.support.mentoring', 'Персональный спортивный наставник'),
                              t('bachelor.quotas.support.equipment', 'Спортивная экипировка и инвентарь'),
                              t('bachelor.quotas.support.nutrition', 'Специализированное питание'),
                              t('bachelor.quotas.support.recovery', 'Медицинское сопровождение и восстановление')
                            ].map((support, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group"
                              >
                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-4 group-hover:scale-150 transition-transform duration-300"></div>
                                <span className="text-blue-100 group-hover:text-white transition-colors">{support}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Секция процесса */}
                  {expandedSection === 'process' && (
                    <motion.div
                      key="process"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-8"
                    >
                      <div className="grid md:grid-cols-3 gap-6">
                        {[
                          {
                            step: 1,
                            title: t('bachelor.quotas.steps.consultation', 'Консультация'),
                            description: t('bachelor.quotas.steps.consultationDesc', 'Получите консультацию в приемной комиссии и определите подходящую квоту'),
                            color: 'from-blue-500 to-cyan-500'
                          },
                          {
                            step: 2,
                            title: t('bachelor.quotas.steps.documents', 'Документы'),
                            description: t('bachelor.quotas.steps.documentsDesc', 'Подготовьте необходимый пакет документов и спортивные достижения'),
                            color: 'from-green-500 to-emerald-500'
                          },
                          {
                            step: 3,
                            title: t('bachelor.quotas.steps.submission', 'Подача'),
                            description: t('bachelor.quotas.steps.submissionDesc', 'Подайте заявление и пройдите дополнительные испытания'),
                            color: 'from-purple-500 to-pink-500'
                          }
                        ].map((step, idx) => (
                          <motion.div
                            key={step.step}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.2 }}
                            className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 group"
                          >
                            <div className={`w-12 h-12 bg-gradient-to-r ${step.color} text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold group-hover:scale-110 transition-transform duration-300`}>
                              {step.step}
                            </div>
                            <h4 className="font-semibold text-white mb-3 text-lg">{step.title}</h4>
                            <p className="text-blue-200/80 text-sm leading-relaxed">{step.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Важная информация */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-6 bg-yellow-500/10 border border-yellow-400/30 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-start">
                <div className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 text-lg">⚠️</div>
                <div>
                  <h4 className="font-semibold text-yellow-300 mb-2 text-lg">
                    {t('bachelor.quotas.importantNotes', 'Важная информация')}
                  </h4>
                  <p className="text-yellow-200/80">
                    {t('bachelor.quotas.notesDescription', 'Количество мест ограничено. Для участия в конкурсе необходимо пройти дополнительные спортивные испытания. Рекомендуем подавать документы заранее.')}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BachelorQuotas;