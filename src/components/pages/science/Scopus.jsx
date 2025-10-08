import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Scopus = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredMetric, setHoveredMetric] = useState(null);

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setMetrics(t('science.sections.scopus.metrics', { returnObjects: true }));
      setLoading(false);
    }, 1000);
  }, [t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-2 border-emerald-400"
        ></motion.div>
      </div>
    );
  }

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden">
      {/* Анимированный фон как в PedagogicalSports */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Научные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🔬</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">📊</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">📈</div>
        <div className="absolute top-2/3 right-1/3 text-5xl opacity-5">🎓</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Заголовок с логотипом */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-xl">🔴</span>
              </motion.div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white">
                  {t('science.sections.scopus.title')}
                </h2>
                <p className="text-blue-200 text-sm">
                  {t('science.sections.scopus.subtitle')}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Основные метрики */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {metrics.main.map((metric, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                onMouseEnter={() => setHoveredMetric(index)}
                onMouseLeave={() => setHoveredMetric(null)}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group text-center relative overflow-hidden"
              >
                {/* Background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <motion.div 
                    className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300"
                    animate={hoveredMetric === index ? { scale: 1.1 } : { scale: 1 }}
                  >
                    {metric.value}
                  </motion.div>
                  <div className="text-white font-semibold text-sm mb-2">{metric.label}</div>
                  <div className="text-blue-200 text-xs">{metric.description}</div>
                </div>

                {/* Decorative element */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Детальная статистика */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-500 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  📈
                </motion.div>
                {t('science.sections.scopus.publicationTrends.title')}
              </h3>
              <div className="space-y-4">
                {metrics.publicationTrends.map((trend, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex justify-between items-center"
                  >
                    <span className="text-blue-200 text-sm w-16">{trend.year}</span>
                    <div className="flex items-center space-x-4 flex-1 max-w-xs">
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(trend.count / Math.max(...metrics.publicationTrends.map(t => t.count))) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        ></motion.div>
                      </div>
                      <span className="font-semibold text-white text-sm w-8 text-right">{trend.count}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-1">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <motion.div 
                  className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  🏆
                </motion.div>
                {t('science.sections.scopus.topCited.title')}
              </h3>
              <div className="space-y-3">
                {metrics.topCited.map((article, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm line-clamp-1 group-hover:text-blue-300 transition-colors">
                        {article.title}
                      </div>
                      <div className="text-blue-200 text-xs line-clamp-1">{article.authors.join(', ')}</div>
                    </div>
                    <div className="text-emerald-400 font-bold text-sm ml-3 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30 group-hover:scale-105 transition-transform">
                      {article.citations}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Ссылки на ресурсы */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <motion.a
              href={metrics.links.profile}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-500 transform hover:-translate-y-1 group cursor-pointer block"
            >
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  whileHover={{ rotate: 5 }}
                >
                  <span className="text-xl">👤</span>
                </motion.div>
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-blue-300 transition-colors">
                    {t('science.sections.scopus.links.profile.title')}
                  </h3>
                  <p className="text-blue-200 text-sm">
                    {t('science.sections.scopus.links.profile.description')}
                  </p>
                </div>
              </div>
            </motion.a>

            <motion.a
              href={metrics.links.analytics}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-1 group cursor-pointer block"
            >
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  whileHover={{ rotate: 5 }}
                >
                  <span className="text-xl">📊</span>
                </motion.div>
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-emerald-300 transition-colors">
                    {t('science.sections.scopus.links.analytics.title')}
                  </h3>
                  <p className="text-blue-200 text-sm">
                    {t('science.sections.scopus.links.analytics.description')}
                  </p>
                </div>
              </div>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Scopus;