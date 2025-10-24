// components/BachelorQuotas.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useBachelorQuotas } from '../../../../hooks/useApi';

const BachelorQuotas = () => {
  const { t } = useTranslation();
  const [selectedQuota, setSelectedQuota] = useState(0);
  const [expandedSection, setExpandedSection] = useState('requirements');
  const [isVisible, setIsVisible] = useState(true);
  const sectionRef = useRef(null);

  // Получаем данные из API
  const { quotasData, loading, error } = useBachelorQuotas();

  // Извлекаем данные из API response
  const quotas = quotasData?.quotas || [];
  const quotaStats = quotasData?.quota_stats || [];
  const additionalSupport = quotasData?.additional_support || [];
  const processSteps = quotasData?.process_steps || [];

  // Базовая отладочная информация
  console.log('BachelorQuotas - Data loaded:', !!quotasData, 'Loading:', loading, 'Error:', error);
  if (quotasData) {
    console.log('BachelorQuotas - Quotas count:', quotas.length, 'Stats count:', quotaStats.length, 'Support count:', additionalSupport.length, 'Steps count:', processSteps.length);
  }

  // Intersection Observer для анимаций
  useEffect(() => {
    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry]) => setIsVisible(entry.isIntersecting),
        { threshold: 0.1 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Автопереключение квот
  useEffect(() => {
    if (quotas.length > 0) {
      const interval = setInterval(() => {
        setSelectedQuota((prev) => (prev + 1) % quotas.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [quotas.length]);

  // Обработка loading состояния
  if (loading && !quotasData) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl animate-pulse">
                🎓
              </div>
              <div className="text-white text-xl">{t('bachelorQuotas.loading.text', 'Загрузка данных о квотах...')}</div>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Обработка error состояния
  if (error) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white text-2xl shadow-2xl">
                ⚠️
              </div>
              <div className="text-white text-xl mb-4">{t('bachelorQuotas.error.title', 'Ошибка загрузки данных')}</div>
              <div className="text-blue-200">{error}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Если нет данных после загрузки
  if (!quotas.length && !loading) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center text-white text-2xl shadow-2xl">
                📋
              </div>
              <div className="text-white text-xl mb-4">{t('bachelorQuotas.noData.title', 'Нет данных о квотах')}</div>
              <div className="text-blue-200">{t('bachelorQuotas.noData.description', 'Данные временно недоступны. Попробуйте обновить страницу.')}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
      purple: {
        gradient: 'from-purple-500 to-pink-500',
        light: 'bg-purple-500/20',
        border: 'border-purple-400/30',
        text: 'text-purple-400',
        button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
      },
      red: {
        gradient: 'from-red-500 to-orange-500',
        light: 'bg-red-500/20',
        border: 'border-red-400/30',
        text: 'text-red-400',
        button: 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600'
      }
    };
    return colors[color] || colors.blue;
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

  // Основной рендер с данными
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            🎓
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('bachelorQuotas.title', 'Образовательные квоты')}
            {/* Индикатор источника данных */}
            {quotasData ? (
              <span className="text-green-400 text-sm ml-2">🟢 API</span>
            ) : (
              <span className="text-yellow-400 text-sm ml-2">🟡 Demo</span>
            )}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('bachelorQuotas.subtitle', 'Специальные программы поддержки для талантливых спортсменов и абитуриентов')}
          </p>
        </motion.div>

        {/* Статистика */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
        >
          {quotaStats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-blue-200 text-sm uppercase tracking-wide mb-1">
                {t(`bachelorQuotas.stats.${stat.labelKey}`, stat.label)}
              </div>
              <div className="text-blue-300/70 text-xs">
                {t(`bachelorQuotas.stats.${stat.descriptionKey}`, stat.description)}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Навигация по квотам */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {quotas.map((quota, index) => (
            <button
              key={quota.id}
              onClick={() => setSelectedQuota(index)}
              className={`px-6 py-3 rounded-full transition-all duration-300 text-sm font-medium ${selectedQuota === index
                  ? `${getColorClasses(quota.color).button} text-white shadow-lg`
                  : 'bg-white/10 text-blue-200 hover:bg-white/20'
                }`}
            >
              {quota.icon} {t(`bachelorQuotas.quotas.${quota.titleKey}`, quota.title)}
            </button>
          ))}
        </div>

        {/* Отображение выбранной квоты */}
        <AnimatePresence mode="wait">
          {quotas[selectedQuota] && (
            <motion.div
              key={selectedQuota}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-white/10 shadow-2xl">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* Левая колонка - информация о квоте */}
                  <div>
                    <div className="flex items-center mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${getColorClasses(quotas[selectedQuota].color).gradient} flex items-center justify-center text-2xl shadow-lg mr-4`}>
                        {quotas[selectedQuota].icon}
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                          {t(`bachelorQuotas.quotas.${quotas[selectedQuota].titleKey}`, quotas[selectedQuota].title)}
                        </h2>
                        <p className="text-blue-200">
                          {t(`bachelorQuotas.quotas.${quotas[selectedQuota].descriptionKey}`, quotas[selectedQuota].description)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className={`p-4 rounded-xl ${getColorClasses(quotas[selectedQuota].color).light} border ${getColorClasses(quotas[selectedQuota].color).border}`}>
                        <div className="text-white text-2xl font-bold">{quotas[selectedQuota].spots}</div>
                        <div className="text-blue-200 text-sm">
                          {t('bachelorQuotas.spots', 'мест')}
                        </div>
                      </div>
                      <div className={`p-4 rounded-xl ${getColorClasses(quotas[selectedQuota].color).light} border ${getColorClasses(quotas[selectedQuota].color).border}`}>
                        <div className="text-white text-lg font-bold">{quotas[selectedQuota].deadline}</div>
                        <div className="text-blue-200 text-sm">
                          {t('bachelorQuotas.deadline', 'дедлайн')}
                        </div>
                      </div>
                    </div>

                    {/* Навигация по секциям */}
                    <div className="flex gap-2 mb-6">
                      {['requirements', 'benefits'].map((section) => (
                        <button
                          key={section}
                          onClick={() => setExpandedSection(section)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${expandedSection === section
                              ? `${getColorClasses(quotas[selectedQuota].color).button} text-white`
                              : 'bg-white/10 text-blue-200 hover:bg-white/20'
                            }`}
                        >
                          {section === 'requirements' 
                            ? t('bachelorQuotas.requirements.button', '📋 Требования')
                            : t('bachelorQuotas.benefits.button', '🎁 Преимущества')
                          }
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Правая колонка - детальная информация */}
                  <div>
                    <AnimatePresence mode="wait">
                      {expandedSection === 'requirements' && quotas[selectedQuota].requirements && (
                        <motion.div
                          key="requirements"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-xl font-bold text-white mb-4">
                            {t('bachelorQuotas.requirements.title', '📋 Требования')}
                          </h3>
                          <div className="space-y-3">
                            {quotas[selectedQuota].requirements.map((req, index) => (
                              <div key={index} className="flex items-start">
                                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getColorClasses(quotas[selectedQuota].color).gradient} flex items-center justify-center mr-3 mt-0.5 flex-shrink-0`}>
                                  <span className="text-white text-xs font-bold">{index + 1}</span>
                                </div>
                                <p className="text-blue-100">
                                  {t(`bachelorQuotas.requirements.${req.key}`, req.requirement)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {expandedSection === 'benefits' && quotas[selectedQuota].benefits && (
                        <motion.div
                          key="benefits"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-xl font-bold text-white mb-4">
                            {t('bachelorQuotas.benefits.title', '🎁 Преимущества')}
                          </h3>
                          <div className="space-y-3">
                            {quotas[selectedQuota].benefits.map((benefit, index) => (
                              <div key={index} className="flex items-start">
                                <div className="text-lg mr-3">🌟</div>
                                <p className="text-blue-100">
                                  {t(`bachelorQuotas.benefits.${benefit.key}`, benefit.benefit)}
                                </p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Дополнительная поддержка */}
        {additionalSupport.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 lg:mt-24"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {t('bachelorQuotas.additionalSupport.title', '🤝 Дополнительная поддержка')}
              </h2>
              <p className="text-blue-200 max-w-2xl mx-auto">
                {t('bachelorQuotas.additionalSupport.subtitle', 'Программы поддержки для спортсменов и студентов')}
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {additionalSupport.map((support, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-3xl mb-4">🎯</div>
                  <p className="text-blue-100">
                    {t(`bachelorQuotas.additionalSupport.${support.key}`, support.support)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Процесс подачи документов */}
        {processSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 lg:mt-24"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {t('bachelorQuotas.process.title', '📝 Процесс подачи документов')}
              </h2>
              <p className="text-blue-200 max-w-2xl mx-auto">
                {t('bachelorQuotas.process.subtitle', 'Пошаговое руководство для подачи заявления')}
              </p>
            </div>
            <div className="space-y-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="flex items-center gap-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color_scheme} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                    {step.step_number}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {t(`bachelorQuotas.process.steps.${step.key}.title`, step.title)}
                    </h3>
                    <p className="text-blue-200">
                      {t(`bachelorQuotas.process.steps.${step.key}.description`, step.description)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BachelorQuotas;