import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const InfrastructureSport = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("stadiums");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [apiData, setApiData] = useState({
    infrastructure: null,
    loading: false, // Изменено на false для демонстрации
    error: null,
  });
  const sectionRef = useRef(null);

  // Helper: safely return a localized string for either a plain string
  // or an object like { ru: '...', en: '...', kg: '...' }.
  const getLocalizedString = (val) => {
    if (val == null) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") {
      try {
        return (
          (i18n && i18n.language && val[i18n.language]) ||
          val.en ||
          val.ru ||
          Object.values(val)[0] ||
          ""
        );
      } catch (e) {
        return String(Object.values(val)[0] || "");
      }
    }
    return String(val);
  };

  // Загрузка данных с API
  const fetchInfrastructureData = async () => {
    try {
      setApiData((prev) => ({ ...prev, loading: true, error: null }));

      // API endpoint для спортивной инфраструктуры
      const API_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(
        `${API_URL}/api/sports/infrastructure/?language=${i18n.language}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setApiData({
        infrastructure: data,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching infrastructure data:", error);
      setApiData((prev) => ({ ...prev, error: error.message, loading: false }));
    }
  };

  useEffect(() => {
    fetchInfrastructureData();
  }, [i18n.language]);

  // Функция для нормализации данных из API
  const asArray = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === "string") return [v];
    if (v && typeof v === "object") {
      // If v looks like a dictionary where values are meaningful items,
      // return the values array. Otherwise return empty — avoid surprising shapes.
      const vals = Object.values(v);
      // Accept arrays of strings or objects; otherwise fallback to []
      if (
        vals.length > 0 &&
        vals.every((it) => typeof it === "string" || typeof it === "object")
      ) {
        return vals;
      }
      return [];
    }
    return [];
  };

  const normalizeInfrastructureData = (apiInfrastructure) => {
    // Если API вернул данные, используем их
    if (apiInfrastructure && typeof apiInfrastructure === "object") {
      return {
        name:
          apiInfrastructure.name ||
          apiInfrastructure.title ||
          t(
            "infrastructureSport.name",
            "Современная спортивная инфраструктура КГАФКиС"
          ),
        description:
          apiInfrastructure.description ||
          t(
            "infrastructureSport.description",
            "Наши спортивные комплексы соответствуют международным стандартам и обеспечивают комфортные условия для тренировок и соревнований."
          ),
        badge:
          apiInfrastructure.badge ||
          t("infrastructureSport.badge", "Спортивная инфраструктура"),
        stats:
          asArray(apiInfrastructure.stats).length > 0
            ? apiInfrastructure.stats
            : [
                {
                  label: t(
                    "infrastructureSport.stats.objects",
                    "спортивных объектов"
                  ),
                  value: "25+",
                  icon: "🏟️",
                },
                {
                  label: t(
                    "infrastructureSport.stats.capacity",
                    "мест вместимость"
                  ),
                  value: "5000+",
                  icon: "👥",
                },
                {
                  label: t(
                    "infrastructureSport.stats.equipment",
                    "современного оборудования"
                  ),
                  value: "100%",
                  icon: "⚡",
                },
                {
                  label: t(
                    "infrastructureSport.stats.areas",
                    "тренировочных зон"
                  ),
                  value: "15+",
                  icon: "🎯",
                },
              ],
        categories:
          asArray(apiInfrastructure.categories).length > 0
            ? apiInfrastructure.categories.map((cat) => ({
                id: cat.id || cat.slug,
                name: cat.name || cat.title,
                icon: cat.icon || "🏟️",
                color: cat.color || "from-blue-500 to-cyan-500",
                objects: asArray(cat.objects || cat.items).map((obj) => ({
                  id: obj.id,
                  name: obj.name || obj.title,
                  description: obj.description,
                  image: obj.image || obj.photo || null,
                  features: asArray(obj.features || obj.amenities),
                })),
              }))
            : [
                // Fallback категории
                {
                  id: "stadiums",
                  name: t(
                    "infrastructureSport.categories.stadiums",
                    "Стадионы"
                  ),
                  icon: "⚽",
                  color: "from-green-500 to-emerald-500",
                  objects: [],
                },
              ],
      };
    }

    // Fallback - пустой объект, если нет данных
    return {
      name: "",
      description: "",
      badge: "",
      stats: [],
      categories: [],
    };
  };

  const getIconForStat = (meaning, index) => {
    const defaultIcons = ["🏟️", "📐", "⚽", "🏋️"];
    const icons = {
      объектов: "🏟️",
      площадь: "📐",
      спорта: "⚽",
      оборудования: "🏋️",
      default: defaultIcons[index] || "📊",
    };
    return icons[meaning?.toLowerCase()] || icons.default;
  };

  // Получаем нормализованные данные
  const infrastructureData = normalizeInfrastructureData(
    apiData.infrastructure
  );

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
  }, [infrastructureData.stats]);

  const startCounters = () => {
    if (!infrastructureData.stats || infrastructureData.stats.length === 0)
      return;
    const targetValues = infrastructureData.stats.map((stat) => {
      // Safely coerce stat.value to string before stripping non-digits
      const raw = String(stat?.value ?? "");
      const digits = raw.replace(/\D/g, "");
      return parseInt(digits || "0", 10) || 0;
    });
    const duration = 2000;
    const steps = 60;
    const stepValues = targetValues.map((target) => target / steps);

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      setCounterValues((prev) =>
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  // Логируем ошибки, но не блокируем рендер
  if (apiData.error) {
    console.warn(
      "Infrastructure API error, using fallback data:",
      apiData.error
    );
  }

  if (apiData.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex items-center justify-center">
        <div className="text-white text-2xl">
          {t("common.loading", "Загрузка...")}
        </div>
      </div>
    );
  }

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
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏟️</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          ⚽
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🏋️</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl opacity-5">
          🏊
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {getLocalizedString(infrastructureData.name)}
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
            {getLocalizedString(infrastructureData.description)}
          </motion.p>
        </motion.div>

        {/* Демо-сообщение */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-400/30 rounded-2xl p-6 mb-8 text-center"
        ></motion.div>

        {/* Dynamic Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 lg:mb-20"
        >
          {infrastructureData.stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/5 rounded-3xl p-8 backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group text-center relative overflow-hidden"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>

              <div className="relative z-10">
                <motion.div
                  className={`text-5xl mb-6 transition-transform duration-500 ${
                    hoveredCard === index
                      ? "scale-125 rotate-12"
                      : "group-hover:scale-110"
                  }`}
                  whileHover={{ scale: 1.2, rotate: 12 }}
                >
                  {stat.icon}
                </motion.div>
                <div className="text-4xl lg:text-5xl font-bold mb-4 font-mono bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  {(() => {
                    const valueStr = String(stat?.value ?? "");
                    if (valueStr.includes("%"))
                      return `${Math.round(counterValues[index])}%`;
                    if (valueStr.includes("+"))
                      return `${Math.round(counterValues[index])}+`;
                    return Math.round(counterValues[index]);
                  })()}
                </div>
                <div className="text-blue-100 font-medium text-lg">
                  {getLocalizedString(stat.label)}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="border-b border-white/20 bg-white/5">
            <div className="flex overflow-x-auto scrollbar-hide p-4">
              {infrastructureData.categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(category.id)}
                  className={`flex items-center space-x-3 flex-shrink-0 px-8 py-4 font-bold text-lg transition-all duration-500 transform rounded-2xl mx-2 ${
                    activeTab === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-2xl scale-105`
                      : "text-blue-100 hover:text-white hover:bg-white/10 hover:shadow-lg"
                  }`}
                >
                  <span
                    className={`text-2xl transition-transform duration-300 ${
                      activeTab === category.id ? "scale-110" : ""
                    }`}
                  >
                    {category.icon}
                  </span>
                  <span className="text-base lg:text-lg">
                    {getLocalizedString(category.name)}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {infrastructureData.categories.map(
                (category) =>
                  activeTab === category.id && (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-8"
                    >
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.objects.map((object, index) => (
                          <motion.div
                            key={object.id || index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group backdrop-blur-sm cursor-pointer"
                            onMouseEnter={() =>
                              setHoveredCard(`object-${object.id}`)
                            }
                            onMouseLeave={() => setHoveredCard(null)}
                          >
                            {/* Object Image */}
                            <div className="relative h-48 overflow-hidden">
                              {object.image ? (
                                <img
                                  src={object.image}
                                  alt={getLocalizedString(object.name)}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-emerald-500/20 flex items-center justify-center">
                                  <span className="text-6xl text-white/50">
                                    {category.icon}
                                  </span>
                                </div>
                              )}
                              {/* Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                              <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                                  {getLocalizedString(object.name)}
                                </h3>
                              </div>
                            </div>

                            {/* Object Content */}
                            <div className="p-6">
                              <p className="text-blue-100 text-lg mb-4 leading-relaxed">
                                {getLocalizedString(object.description)}
                              </p>

                              {/* Features */}
                              {object.features &&
                                object.features.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {object.features.map(
                                      (feature, featureIndex) => (
                                        <motion.span
                                          key={featureIndex}
                                          className="px-3 py-2 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-blue-300 rounded-2xl text-sm font-medium hover:bg-blue-500/30 hover:scale-105 transition-all duration-300 cursor-default border border-blue-400/30"
                                          whileHover={{ scale: 1.05 }}
                                        >
                                          {getLocalizedString(feature)}
                                        </motion.span>
                                      )
                                    )}
                                  </div>
                                )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InfrastructureSport;
