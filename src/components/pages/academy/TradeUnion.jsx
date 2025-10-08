// TradeUnion.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const TradeUnion = () => {
  const { t } = useTranslation();
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [activeEvent, setActiveEvent] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: ''
  });
  const sectionRef = useRef(null);

  const benefits = t('tradeUnion.benefits.list', { returnObjects: true });
  const events = t('tradeUnion.events.list', { returnObjects: true });
  const stats = t('tradeUnion.stats', { returnObjects: true });

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

  // Автопереключение преимуществ и событий
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBenefit((prev) => (prev + 1) % benefits.length);
      setActiveEvent((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [benefits.length, events.length]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // В реальном приложении здесь будет API запрос
    alert(t('tradeUnion.joinSuccess'));
    setFormData({ name: '', email: '', position: '' });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        
        {/* Символы сообщества */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🤝</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">⚖️</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">💪</div>
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
            🤝
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('tradeUnion.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('tradeUnion.subtitle')}
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

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Левая колонка - Преимущества */}
          <div className="space-y-8">
            {/* Приветственное сообщение */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                {t('tradeUnion.welcome.title')}
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-6">
                {t('tradeUnion.welcome.description')}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
                  <span className="text-blue-200 text-sm">{t('tradeUnion.welcome.members')}</span>
                </div>
                <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
                  <span className="text-blue-200 text-sm">{t('tradeUnion.welcome.activeSince')}</span>
                </div>
              </div>
            </motion.div>

            {/* Преимущества */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                {t('tradeUnion.benefits.title')}
              </h2>

              {/* Активное преимущество */}
              <motion.div
                key={activeBenefit}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm border border-white/20 mb-6"
              >
                <div className="flex flex-col lg:flex-row gap-6 items-center">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                    {benefits[activeBenefit]?.icon}
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">
                      {benefits[activeBenefit]?.title}
                    </h3>
                    <p className="text-blue-200">
                      {benefits[activeBenefit]?.description}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Все преимущества */}
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-2xl backdrop-blur-sm border cursor-pointer transition-all duration-300 ${
                      activeBenefit === index
                        ? 'bg-white/10 border-emerald-400/50 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                    onClick={() => setActiveBenefit(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                        {benefit.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate">
                          {benefit.title}
                        </h4>
                        <p className="text-blue-200 text-sm truncate">
                          {benefit.shortDescription}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Правая колонка - Мероприятия и форма */}
          <div className="space-y-8">
            {/* Мероприятия */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-white">
                  {t('tradeUnion.events.title')}
                </h2>
                <span className="text-sm bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full backdrop-blur-sm">
                  {t('tradeUnion.events.upcoming')}
                </span>
              </div>

              <div className="space-y-4">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-blue-200 text-sm mt-1">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <span className="text-emerald-300 font-semibold text-sm bg-emerald-500/20 px-3 py-1 rounded-full whitespace-nowrap">
                          {event.date}
                        </span>
                        <div className="flex items-center text-blue-300 text-sm">
                          <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                          {event.participants} {t('tradeUnion.events.participants')}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
              >
                {t('tradeUnion.events.viewAll')}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradeUnion;