import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const AchievementsSport = () => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [apiData, setApiData] = useState({
    achievements: [],
    loading: false,
    error: null,
  });
  const sectionRef = useRef(null);
  const modalRef = useRef(null);

  // Загрузка данных с API
  const fetchAchievementsData = async () => {
    try {
      setApiData((prev) => ({ ...prev, loading: true, error: null }));

      // API endpoint для спортивных достижений
      const API_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(
        `${API_URL}/api/sports/achievements/?language=${i18n.language}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // API возвращает пагинированный ответ с полем results
      setApiData({
        achievements: data.results || data, // Берем results или весь data если это массив
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching achievements data:", error);
      setApiData((prev) => ({ ...prev, error: error.message, loading: false }));
    }
  };

  useEffect(() => {
    fetchAchievementsData();
  }, [i18n.language]);

  // Нормализация данных из API
  const normalizeAchievements = (apiAchievements) => {
    // Если API вернул данные, используем их
    if (
      apiAchievements &&
      Array.isArray(apiAchievements) &&
      apiAchievements.length > 0
    ) {
      return apiAchievements.map((ach) => ({
        id: ach.id,
        name: String(ach.name || ach.athlete_name || ach.title || ""),
        sport: String(ach.sport || ach.sport_type || ""),
        competition: String(ach.competition || ach.event || ""),
        // Ensure result is a string to avoid .toLowerCase errors
        result: String(ach.result || ach.place || ach.achievement || ""),
        // Keep date as-is (ISO) but coerce to string or empty
        date: ach.date || ach.event_date || "",
        image: ach.image || ach.photo || "/api/placeholder/300/200",
        description: String(ach.description || ""),
        category: ach.category || "individual",
        details: ach.details || {},
      }));
    }

    // Fallback - пустой массив, если нет данных
    return [];
  };

  // Получаем нормализованные данные
  const achievementsData = {
    all: normalizeAchievements(apiData.achievements),
  };

  // Категории с правильными данными
  const categories = [
    {
      id: "all",
      label: t("achievementsSport.categories.all", "Все достижения"),
      icon: "🏆",
      color: "from-blue-500 to-emerald-500",
      count: achievementsData.all.length,
    },
    {
      id: "individual",
      label: t("achievementsSport.categories.individual", "Индивидуальные"),
      icon: "🏅",
      color: "from-blue-500 to-cyan-500",
      count: achievementsData.all.filter((a) => a.category === "individual")
        .length,
    },
    {
      id: "team",
      label: t("achievementsSport.categories.team", "Командные"),
      icon: "👥",
      color: "from-green-500 to-emerald-500",
      count: achievementsData.all.filter((a) => a.category === "team").length,
    },
    {
      id: "international",
      label: t("achievementsSport.categories.international", "Международные"),
      icon: "🌍",
      color: "from-purple-500 to-blue-500",
      count: achievementsData.all.filter((a) => a.category === "international")
        .length,
    },
    {
      id: "olympic",
      label: t("achievementsSport.categories.olympic", "Олимпийские"),
      icon: "🥇",
      color: "from-yellow-500 to-orange-500",
      count: achievementsData.all.filter((a) => a.category === "olympic")
        .length,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Закрытие модального окна по клику вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const openModal = (achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAchievement(null);
  };

  // Фильтрация достижений по выбранной категории
  const filteredAchievements = achievementsData.all.filter(
    (achievement) =>
      activeCategory === "all" || achievement.category === activeCategory
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  };

  const getResultColor = (result) => {
    const r = String(result || "").toLowerCase();
    if (r.includes("1") || r.includes("золот") || r.includes("золото")) {
      return "from-yellow-400 to-yellow-600";
    }
    if (r.includes("2") || r.includes("серебр")) {
      return "from-gray-400 to-gray-600";
    }
    if (r.includes("3") || r.includes("бронз")) {
      return "from-orange-400 to-orange-700";
    }
    return "from-blue-400 to-cyan-600";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("ru-RU");
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
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏆</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          🥇
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🎯</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl opacity-5">
          🚀
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
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/20 mb-6"
          >
            <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-blue-100 font-medium text-lg">
              {t("achievementsSport.badge", "Гордость академии")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {t("achievementsSport.title", "Наши достижения")}
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
            {t(
              "achievementsSport.subtitle",
              "Гордость КГАФКиС — это наши спортсмены, тренеры и выпускники, прославившие академию на национальном и международном уровне."
            )}
          </motion.p>
        </motion.div>

        {/* Category Navigation - Исправленный фильтр */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl p-6 mb-12"
        >
          <div className="flex overflow-x-auto scrollbar-hide space-x-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-3 flex-shrink-0 px-6 py-4 font-bold text-lg transition-all duration-300 rounded-2xl ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-2xl`
                    : "text-blue-100 hover:text-white"
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-base lg:text-lg">{category.label}</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activeCategory === category.id
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-blue-200"
                  }`}
                >
                  {category.count}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Achievements Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <AnimatePresence>
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                variants={itemVariants}
                layout
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => openModal(achievement)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={achievement.image}
                    alt={achievement.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <div
                      className={`px-4 py-2 rounded-2xl bg-gradient-to-r ${getResultColor(
                        achievement.result
                      )} text-white font-bold text-sm backdrop-blur-sm`}
                    >
                      {achievement.result}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {achievement.name}
                    </h3>
                    <p className="text-emerald-200 text-lg">
                      {achievement.sport}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-blue-200 text-sm">
                      {achievement.competition}
                    </div>
                    <div className="text-emerald-300 text-sm font-medium">
                      {formatDate(achievement.date)}
                    </div>
                  </div>

                  <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                    {achievement.description}
                  </p>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white font-bold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25 text-center"
                  >
                    {t("achievementsSport.card.button", "Подробнее")}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-6">🏆</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {t("achievementsSport.empty.title", "Достижений пока нет")}
            </h3>
            <p className="text-blue-200 text-lg">
              {t(
                "achievementsSport.empty.subtitle",
                "Скоро здесь появятся новые достижения наших спортсменов!"
              )}
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              ref={modalRef}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                <img
                  src={selectedAchievement.image}
                  alt={selectedAchievement.name}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-300"
                >
                  ✕
                </button>
                <div className="absolute top-4 left-4">
                  <div
                    className={`px-4 py-2 rounded-2xl bg-gradient-to-r ${getResultColor(
                      selectedAchievement.result
                    )} text-white font-bold backdrop-blur-sm`}
                  >
                    {selectedAchievement.result}
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {selectedAchievement.name}
                </h2>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded-2xl p-4">
                    <div className="text-emerald-300 text-sm mb-1">
                      {t("achievementsSport.modal.sport", "Вид спорта")}
                    </div>
                    <div className="text-white font-semibold text-lg">
                      {selectedAchievement.sport}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4">
                    <div className="text-emerald-300 text-sm mb-1">
                      {t("achievementsSport.modal.date", "Дата")}
                    </div>
                    <div className="text-white font-semibold text-lg">
                      {formatDate(selectedAchievement.date)}
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                      !
                    </span>
                    {t("achievementsSport.modal.competition", "Соревнование")}
                  </h3>
                  <p className="text-blue-100 text-lg">
                    {selectedAchievement.competition}
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                      📝
                    </span>
                    {t("achievementsSport.modal.description", "Описание")}
                  </h3>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    {selectedAchievement.description}
                  </p>
                </div>

                {selectedAchievement.details && (
                  <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                        🔍
                      </span>
                      {t(
                        "achievementsSport.modal.details",
                        "Детали достижения"
                      )}
                    </h3>
                    <div className="grid gap-3">
                      {Object.entries(selectedAchievement.details).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between items-center py-2 border-b border-white/10"
                          >
                            <span className="text-emerald-300 capitalize">
                              {t(`achievementsSport.modal.${key}`, key)}
                            </span>
                            <span className="text-white font-semibold text-right">
                              {value}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default AchievementsSport;
