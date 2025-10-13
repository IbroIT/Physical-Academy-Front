import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useScopusPage } from "../../../hooks/useApi";
import Loading from "../../common/Loading";

const Scopus = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useScopusPage();
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [hoveredPublication, setHoveredPublication] = useState(null);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{t("common.errorLoading")}</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>{t("common.noData")}</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Научные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🔬</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          📊
        </div>
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
          <motion.div variants={itemVariants} className="text-center">
            <div className="inline-flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group">
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-xl">�</span>
              </motion.div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white">{data.title}</h2>
                <p className="text-blue-200 text-sm">{data.subtitle}</p>
              </div>
            </div>
          </motion.div>

          {/* Основные метрики */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {data.metrics.map((metric, index) => (
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
                    animate={
                      hoveredMetric === index ? { scale: 1.1 } : { scale: 1 }
                    }
                  >
                    {metric.value}
                  </motion.div>
                  <div className="text-white font-semibold text-sm mb-2">
                    {metric.label}
                  </div>
                  <div className="text-blue-200 text-xs">
                    {metric.description}
                  </div>
                </div>

                {/* Decorative element */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Document Types Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10"
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                �
              </motion.div>
              {t("science.sections.scopus.documentTypes")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                {data.document_types.map((docType, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: docType.color }}
                      ></div>
                      <span className="text-blue-200 text-sm">
                        {docType.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white font-semibold text-sm">
                        {docType.count}
                      </span>
                      <span className="text-blue-300 text-xs ml-2">
                        ({docType.percentage}%)
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {data.document_types.map((docType, index) => {
                    // Calculate each segment's position in the pie chart
                    let cumulativePercentage = 0;
                    for (let i = 0; i < index; i++) {
                      cumulativePercentage += data.document_types[i].percentage;
                    }
                    const startAngle = (cumulativePercentage / 100) * 360;
                    const endAngle =
                      startAngle + (docType.percentage / 100) * 360;

                    // Create SVG path for this segment
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className="absolute inset-0"
                      >
                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                          <path
                            d={`M50,50 L${
                              50 + 45 * Math.cos((startAngle * Math.PI) / 180)
                            },${
                              50 + 45 * Math.sin((startAngle * Math.PI) / 180)
                            } A45,45 0 ${
                              endAngle - startAngle > 180 ? 1 : 0
                            },1 ${
                              50 + 45 * Math.cos((endAngle * Math.PI) / 180)
                            },${
                              50 + 45 * Math.sin((endAngle * Math.PI) / 180)
                            } Z`}
                            fill={docType.color}
                            stroke="#1e293b"
                            strokeWidth="0.5"
                          />
                        </svg>
                      </motion.div>
                    );
                  })}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-slate-800 rounded-full w-16 h-16 flex items-center justify-center">
                      <span className="text-xs text-blue-200">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Publications */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10"
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                📝
              </motion.div>
              {t("science.sections.scopus.publications")}
            </h3>
            <div className="space-y-3">
              {data.publications.map((publication, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredPublication(index)}
                  onMouseLeave={() => setHoveredPublication(null)}
                  className="p-3 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                >
                  <div className="flex justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors">
                        {publication.title}
                      </div>
                      <div className="text-blue-200 text-xs">
                        {publication.authors}
                      </div>
                      <div className="mt-1 flex items-center space-x-3 text-xs">
                        <span className="text-emerald-400">
                          {publication.journal}
                        </span>
                        <span className="text-blue-300">
                          {publication.year}
                        </span>
                        <span className="bg-blue-500/20 px-2 py-0.5 rounded-md text-blue-300">
                          {publication.document_type}
                        </span>
                        <span className="text-yellow-300">
                          {publication.subject_area}
                        </span>
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold text-sm ml-3 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30 self-start">
                      {publication.citation_count}
                    </div>
                  </div>

                  {/* Link to publication */}
                  <AnimatePresence>
                    {hoveredPublication === index && publication.url && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 overflow-hidden"
                      >
                        <a
                          href={publication.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span>View publication</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {data.stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-500 transform hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xl">{stat.icon}</div>
                  <div className="text-2xl font-bold text-blue-400 group-hover:scale-105 transition-transform">
                    {stat.value}
                  </div>
                </div>
                <div className="text-blue-200 text-xs">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* External Links */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {data.links &&
              data.links.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10 ${
                    index % 2 === 0
                      ? "hover:border-blue-400/30"
                      : "hover:border-emerald-400/30"
                  } transition-all duration-500 transform hover:-translate-y-1 group cursor-pointer block`}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className={`w-12 h-12 ${
                        index % 2 === 0
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                          : "bg-gradient-to-r from-emerald-500 to-green-500"
                      } rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      whileHover={{ rotate: 5 }}
                    >
                      <span className="text-xl">{link.icon}</span>
                    </motion.div>
                    <div>
                      <h3
                        className={`font-bold text-white text-lg ${
                          index % 2 === 0
                            ? "group-hover:text-blue-300"
                            : "group-hover:text-emerald-300"
                        } transition-colors`}
                      >
                        {link.title}
                      </h3>
                      <p className="text-blue-200 text-sm">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </motion.a>
              ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Scopus;
