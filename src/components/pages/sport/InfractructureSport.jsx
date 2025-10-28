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

  // Загрузка данных с API - отключена для демонстрации
  const fetchInfrastructureData = async () => {
    try {
      setApiData((prev) => ({ ...prev, loading: true, error: null }));
      
      // Для демонстрации сразу используем моковые данные
      setTimeout(() => {
        setApiData((prev) => ({ 
          ...prev, 
          infrastructure: null, // Пустые данные для демонстрации нормализации
          loading: false 
        }));
      }, 500);
      
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
    if (typeof v === "object") return Object.values(v);
    return [];
  };

  const normalizeInfrastructureData = (apiInfrastructure) => {
    // Всегда возвращаем демонстрационные данные
    return {
      name: t("infrastructureSport.name", "Современная спортивная инфраструктура КГАФКиС"),
      description: t(
        "infrastructureSport.description",
        "Наши спортивные комплексы соответствуют международным стандартам и обеспечивают комфортные условия для тренировок и соревнований."
      ),
      badge: t("infrastructureSport.badge", "Спортивная инфраструктура"),
      stats: [
        { label: t("infrastructureSport.stats.objects", "спортивных объектов"), value: "25+", icon: "🏟️" },
        { label: t("infrastructureSport.stats.area", "м² общая площадь"), value: "8000+", icon: "📐" },
        { label: t("infrastructureSport.stats.sports", "видов спорта"), value: "15+", icon: "⚽" },
        { label: t("infrastructureSport.stats.equipment", "единиц оборудования"), value: "500+", icon: "🏋️" },
      ],
      categories: [
        {
          id: "stadiums",
          name: t("infrastructureSport.categories.stadiums", "Стадионы"),
          icon: "⚽",
          color: "from-green-500 to-emerald-500",
          objects: [
            {
              id: 1,
              name: t("infrastructureSport.objects.mainStadium", "Главный стадион"),
              description: t("infrastructureSport.objects.mainStadiumDesc", "Современный стадион с беговыми дорожками и футбольным полем международного стандарта"),
              image: "https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=400&h=300&fit=crop",
              features: [
                t("infrastructureSport.features.capacity", "Вместимость: 1500 зрителей"),
                t("infrastructureSport.features.track", "Синтетическое покрытие"),
                t("infrastructureSport.features.lighting", "Прожекторное освещение"),
                t("infrastructureSport.features.tribunes", "Трибуны с навесом")
              ]
            },
            {
              id: 2,
              name: t("infrastructureSport.objects.miniStadium", "Мини-стадион"),
              description: t("infrastructureSport.objects.miniStadiumDesc", "Универсальная спортивная площадка для тренировок и соревнований"),
              image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=300&fit=crop",
              features: [
                t("infrastructureSport.features.multisport", "Многофункциональная площадка"),
                t("infrastructureSport.features.artificial", "Искусственное покрытие"),
                t("infrastructureSport.features.allWeather", "Всепогодное использование")
              ]
            }
          ],
        },
        {
          id: "pools",
          name: t("infrastructureSport.categories.pools", "Плавательные бассейны"),
          icon: "🏊",
          color: "from-cyan-500 to-blue-500",
          objects: [
            {
              id: 3,
              name: t("infrastructureSport.objects.olympicPool", "Олимпийский бассейн"),
              description: t("infrastructureSport.objects.olympicPoolDesc", "50-метровый бассейн с 8 дорожками для профессиональных тренировок"),
              image: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=400&h=300&fit=crop",
              features: [
                t("infrastructureSport.features.length", "Длина: 50 метров"),
                t("infrastructureSport.features.lanes", "8 дорожек"),
                t("infrastructureSport.features.depth", "Глубина: 2-3 метра"),
                t("infrastructureSport.features.water", "Система очистки воды")
              ]
            },
            {
              id: 4,
              name: t("infrastructureSport.objects.trainingPool", "Тренировочный бассейн"),
              description: t("infrastructureSport.objects.trainingPoolDesc", "25-метровый бассейн для учебно-тренировочных занятий"),
              image: "https://images.unsplash.com/photo-1584467735871-8db9ac8d0288?w=400&h=300&fit=crop",
              features: [
                t("infrastructureSport.features.length", "Длина: 25 метров"),
                t("infrastructureSport.features.temperature", "Подогрев воды"),
                t("infrastructureSport.features.safety", "Спасательная служба")
              ]
            }
          ],
        },
        {
          id: "gyms",
          name: t("infrastructureSport.categories.gyms", "Тренажёрные залы"),
          icon: "🏋️",
          color: "from-orange-500 to-red-500",
          objects: [
            {
              id: 5,
              name: t("infrastructureSport.objects.powerGym", "Силовой зал"),
              description: t("infrastructureSport.objects.powerGymDesc", "Современный зал с профессиональным силовым оборудованием"),
              image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
              features: [
                t("infrastructureSport.features.equipment", "Профессиональные тренажеры"),
                t("infrastructureSport.features.freeWeights", "Свободные веса"),
                t("infrastructureSport.features.cardio", "Кардио-зона"),
                t("infrastructureSport.features.conditioning", "Система кондиционирования")
              ]
            },
            {
              id: 6,
              name: t("infrastructureSport.objects.fitnessGym", "Фитнес-зал"),
              description: t("infrastructureSport.objects.fitnessGymDesc", "Многофункциональный зал для групповых занятий"),
              image: "https://images.unsplash.com/photo-1549060279-7e168fce7090?w=400&h=300&fit=crop",
              features: [
                t("infrastructureSport.features.group", "Групповые занятия"),
                t("infrastructureSport.features.yoga", "Зона для йоги и пилатеса"),
                t("infrastructureSport.features.mirrors", "Зеркальные стены"),
                t("infrastructureSport.features.sound", "Аудиосистема")
              ]
            }
          ],
        },
        {
          id: "martial",
          name: t("infrastructureSport.categories.martial", "Залы единоборств"),
          icon: "🥋",
          color: "from-red-500 to-orange-500",
          objects: [
            {
              id: 7,
              name: t("infrastructureSport.objects.judoHall", "Зал дзюдо и самбо"),
              description: t("infrastructureSport.objects.judoHallDesc", "Специализированный зал с татами для борьбы"),
              image: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=400&h=300&fit=crop",
              features: [
                t("infrastructureSport.features.tatami", "Профессиональное татами"),
                t("infrastructureSport.features.mats", "Защитные маты"),
                t("infrastructureSport.features.changing", "Раздевалки и душевые"),
                t("infrastructureSport.features.equipment", "Тренажеры для борьбы")
              ]
            },
            {
              id: 8,
              name: t("infrastructureSport.objects.boxingHall", "Боксерский зал"),
              description: t("infrastructureSport.objects.boxingHallDesc", "Зал с рингом и боксерскими мешками"),
              image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=300&fit=crop",
              features: [
                t("infrastructureSport.features.ring", "Профессиональный ринг"),
                t("infrastructureSport.features.bags", "Боксерские мешки"),
                t("infrastructureSport.features.gloves", "Арсенал перчаток"),
                t("infrastructureSport.features.ventilation", "Система вентиляции")
              ]
            }
          ],
        },
        {
          id: "labs",
          name: t("infrastructureSport.categories.labs", "Лаборатории"),
          icon: "🔬",
          color: "from-indigo-500 to-purple-500",
          objects: [
            {
              id: 9,
              name: t("infrastructureSport.objects.biomechLab", "Лаборатория биомеханики"),
              description: t("infrastructureSport.objects.biomechLabDesc", "Современное оборудование для анализа движений спортсменов"),
              image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop",
              features: [
                t("infrastructureSport.features.motion", "Система анализа движения"),
                t("infrastructureSport.features.force", "Силовые платформы"),
                t("infrastructureSport.features.emg", "ЭМГ оборудование"),
                t("infrastructureSport.features.software", "Специализированное ПО")
              ]
            },
            {
              id: 10,
              name: t("infrastructureSport.objects.physioLab", "Физиологическая лаборатория"),
              description: t("infrastructureSport.objects.physioLabDesc", "Оборудование для тестирования физического состояния"),
              image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
              features: [
                t("infrastructureSport.features.ergospirometry", "Эргоспирометрия"),
                t("infrastructureSport.features.lactate", "Анализ лактата"),
                t("infrastructureSport.features.ecg", "ЭКГ мониторинг"),
                t("infrastructureSport.features.anthropometry", "Антропометрия")
              ]
            }
          ],
        }
      ],
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
  const infrastructureData = normalizeInfrastructureData(apiData.infrastructure);

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
    const targetValues = infrastructureData.stats.map(
      (stat) => parseInt(stat.value.replace(/\D/g, "")) || 0
    );
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
    console.warn("Infrastructure API error, using fallback data:", apiData.error);
  }

  if (apiData.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 flex items-center justify-center">
        <div className="text-white text-2xl">{t("common.loading", "Загрузка...")}</div>
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
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">⚽</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🏋️</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl opacity-5">🏊</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 mb-6"
          >
            <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-blue-100 font-medium text-lg">
              {infrastructureData.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {infrastructureData.name}
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
            {infrastructureData.description}
          </motion.p>
        </motion.div>

        {/* Демо-сообщение */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-400/30 rounded-2xl p-6 mb-8 text-center"
        >
          <div className="flex items-center justify-center space-x-3 text-blue-200">
            <span className="text-2xl">💡</span>
            <p className="text-lg">
              {t("infrastructureSport.demoMessage", "Демонстрация спортивной инфраструктуры академии")}
            </p>
          </div>
        </motion.div>

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
                  {stat.value.includes("%")
                    ? `${Math.round(counterValues[index])}%`
                    : stat.value.includes("+")
                    ? `${Math.round(counterValues[index])}+`
                    : Math.round(counterValues[index])}
                </div>
                <div className="text-blue-100 font-medium text-lg">
                  {stat.label}
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
                  <span className="text-base lg:text-lg">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {infrastructureData.categories.map((category) => (
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
                          onMouseEnter={() => setHoveredCard(`object-${object.id}`)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          {/* Object Image */}
                          <div className="relative h-48 overflow-hidden">
                            {object.image ? (
                              <img
                                src={object.image}
                                alt={object.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-emerald-500/20 flex items-center justify-center">
                                <span className="text-6xl text-white/50">{category.icon}</span>
                              </div>
                            )}
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                                {object.name}
                              </h3>
                            </div>
                          </div>

                          {/* Object Content */}
                          <div className="p-6">
                            <p className="text-blue-100 text-lg mb-4 leading-relaxed">
                              {object.description}
                            </p>
                            
                            {/* Features */}
                            {object.features && object.features.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {object.features.map((feature, featureIndex) => (
                                  <motion.span
                                    key={featureIndex}
                                    className="px-3 py-2 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 text-blue-300 rounded-2xl text-sm font-medium hover:bg-blue-500/30 hover:scale-105 transition-all duration-300 cursor-default border border-blue-400/30"
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {feature}
                                  </motion.span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InfrastructureSport;