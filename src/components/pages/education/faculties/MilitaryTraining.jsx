import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const MilitaryTraining = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("about");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [apiData, setApiData] = useState({
    faculty: null,
    loading: true,
    error: null,
  });
  const sectionRef = useRef(null);

  // Загрузка данных с API
  const fetchFacultyData = async () => {
    try {
      setApiData((prev) => ({ ...prev, loading: true, error: null }));
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/education/faculties/military-training/?lang=${i18n.language}`);

      const data = await response.json();

      if (data && data.name) {
        setApiData((prev) => ({ ...prev, faculty: data, loading: false }));
      } else {
        setApiData((prev) => ({
          ...prev,
          error: "No data found",
          loading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching faculty data:", error);
      setApiData((prev) => ({ ...prev, error: error.message, loading: false }));
    }
  };

  useEffect(() => {
    fetchFacultyData();
  }, [i18n.language]);

  // Функция для нормализации данных из API
  // Вспомогательная утилита: безопасно привести разные типы в массив
  const asArray = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === "string") return [v];
    if (typeof v === "object") return Object.values(v);
    return [];
  };

  // Простая функция для выбора иконки контакта по заголовку
  const getContactIcon = (title) => {
    if (!title) return "📝";
    const lower = title.toLowerCase();
    if (lower.includes("телефон") || lower.includes("phone")) return "📞";
    if (lower.includes("email") || lower.includes("почта")) return "📧";
    if (lower.includes("адрес") || lower.includes("address")) return "🏢";
    if (
      lower.includes("время") ||
      lower.includes("часы") ||
      lower.includes("hours")
    )
      return "🕒";
    return "📝";
  };

  const normalizeData = (apiFaculty) => {
    const defaultStats = [
      { label: "Курсантов", value: "500+", icon: "🎖️" },
      { label: "Программ", value: "15+", icon: "⚔️" },
      { label: "Преподавателей", value: "25", icon: "🏅" },
      { label: "Специальностей", value: "10", icon: "🎯" },
    ];

    if (!apiFaculty) {
      return {
        name: t("militaryTraining.name", "Военная подготовка"),
        fullDescription: t(
          "militaryTraining.fullDescription",
          "Профессиональная военная подготовка для будущих офицеров"
        ),
        badge: t("militaryTraining.badge", "Военное образование"),
        sections: [],
        stats: defaultStats,
        about: {
          missionTitle: t(
            "militaryTraining.about.missionTitle",
            "Миссия факультета"
          ),
          advantagesTitle: t(
            "militaryTraining.about.advantagesTitle",
            "Преимущества"
          ),
          achievementsTitle: t(
            "militaryTraining.about.achievementsTitle",
            "Достижения"
          ),
          mission: "",
          advantages: [],
          achievements: defaultStats.slice(0, 3),
        },
        teachers: [],
        contacts: { items: [], dean: null },
      };
    }

    return {
      name:
        apiFaculty.name ||
        apiFaculty.title ||
        t("militaryTraining.name", "Военная подготовка"),
      fullDescription:
        apiFaculty.description ||
        t(
          "militaryTraining.fullDescription",
          "Профессиональная военная подготовка для будущих офицеров"
        ),
      badge: t("militaryTraining.badge", "Военное образование"),
      banner_image: apiFaculty.banner_image,
      // statistics may come as 'statistics' from FacultySerializer
      stats: asArray(apiFaculty.statistics).length
        ? asArray(apiFaculty.statistics).map((stat) => ({
            label: stat.meaning || "",
            value: stat.titleInt || "0",
            icon: stat.emoji || "📊",
          }))
        : defaultStats,
      sections: asArray(apiFaculty.sections).length
        ? asArray(apiFaculty.sections)
        : [],
      // Programs and specializations should be present to avoid .map on undefined
      programs: asArray(apiFaculty.programs).length
        ? asArray(apiFaculty.programs)
        : [],
      specializations: asArray(apiFaculty.specializations).length
        ? asArray(apiFaculty.specializations)
        : [],
      // О разделе about: берем миссию/достижения/преимущества из API если есть
      about: {
        missionTitle: t(
          "militaryTraining.about.missionTitle",
          "Миссия факультета"
        ),
        advantagesTitle: t(
          "militaryTraining.about.advantagesTitle",
          "Преимущества"
        ),
        achievementsTitle: t(
          "militaryTraining.about.achievementsTitle",
          "Достижения"
        ),
        mission: Array.isArray(apiFaculty.mission)
          ? apiFaculty.mission.join(". ")
          : apiFaculty.mission || "",
        advantages: Array.isArray(apiFaculty.achievements)
          ? apiFaculty.achievements
          : [],
        achievements: asArray(apiFaculty.statistics)
          .slice(0, 3)
          .map((stat, index) => ({
            value: stat.titleInt || "0",
            label: stat.meaning || "",
            icon: index === 0 ? "🏆" : index === 1 ? "🥇" : "⭐",
          })),
      },
      teachers: asArray(apiFaculty.teachers).length
        ? asArray(apiFaculty.teachers).map((tch) => ({
            id: tch.id,
            name: tch.full_name || tch.name || "",
            position: tch.position || "",
            qualification: tch.position || "",
            avatar: tch.photo
              ? null
              : tch.full_name
              ? tch.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "NN",
            photo: tch.photo || null,
            specializations: asArray(tch.specializations),
            experience: tch.experience || null,
          }))
        : [],
      contacts: {
        items: asArray(apiFaculty.contacts).map((c) => ({
          title: c.title,
          value: c.value,
          icon: getContactIcon(c.title),
        })),
        dean: apiFaculty.dean
          ? {
              name: apiFaculty.dean.name || null,
              position: apiFaculty.dean.position || null,
              qualification: apiFaculty.dean.qualification || null,
              email: apiFaculty.dean.email || null,
              experience: apiFaculty.dean.experience || null,
              avatar: apiFaculty.dean.name
                ? apiFaculty.dean.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : null,
            }
          : null,
      },
    };
  };

  // Получаем нормализованные данные
  const facultyData = normalizeData(apiData.faculty);

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
  }, []);

  const startCounters = () => {
    const targetValues = facultyData.stats.map(
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

  const tabs = [
    {
      id: "about",
      label: t("militaryTraining.tabs.about", "О факультете"),
      icon: "🎖️",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "programs",
      label: t("militaryTraining.tabs.programs", "Программы"),
      icon: "⚔️",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "specializations",
      label: t("militaryTraining.tabs.specializations", "Специализации"),
      icon: "🎯",
      color: "from-blue-500 to-green-500",
    },
    {
      id: "teachers",
      label: t("militaryTraining.tabs.teachers", "Преподаватели"),
      icon: "👨‍✈️",
      color: "from-cyan-500 to-blue-500",
    },
    {
      id: "contacts",
      label: t("militaryTraining.tabs.contacts", "Контакты"),
      icon: "📞",
      color: "from-emerald-500 to-green-500",
    },
  ];

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

        {/* Военные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">⚔️</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          🛡️
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🎯</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🎖️</div>
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
              {facultyData.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {facultyData.name}
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
            {facultyData.fullDescription}
          </motion.p>
        </motion.div>

        {/* Dynamic Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 lg:mb-20"
        >
          {facultyData.stats.map((stat, index) => (
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
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 flex-shrink-0 px-8 py-4 font-bold text-lg transition-all duration-500 transform rounded-2xl mx-2 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl scale-105`
                      : "text-blue-100 hover:text-white hover:bg-white/10 hover:shadow-lg"
                  }`}
                >
                  <span
                    className={`text-2xl transition-transform duration-300 ${
                      activeTab === tab.id ? "scale-110" : ""
                    }`}
                  >
                    {tab.icon}
                  </span>
                  <span className="text-base lg:text-lg">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {/* About Tab */}
              {activeTab === "about" && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold text-white flex items-center">
                        <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mr-4 text-lg">
                          🎯
                        </span>
                        {facultyData.about.missionTitle}
                      </h3>
                      <p className="text-blue-100 text-lg leading-relaxed border-l-4 border-blue-500 pl-6 py-4 bg-white/5 rounded-r-2xl backdrop-blur-sm">
                        {facultyData.about.mission}
                      </p>
                      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20 backdrop-blur-sm">
                        <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                          <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mr-3 text-sm">
                            ✨
                          </span>
                          {facultyData.about.advantagesTitle}
                        </h4>
                        <ul className="space-y-4">
                          {facultyData.about.advantages.map(
                            (advantage, index) => (
                              <motion.li
                                key={index}
                                className="flex items-start group"
                                whileHover={{ x: 10 }}
                                transition={{ duration: 0.3 }}
                              >
                                <span className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                                <span className="text-blue-100 text-lg group-hover:text-white transition-colors duration-300">
                                  {advantage}
                                </span>
                              </motion.li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-6 border border-emerald-500/20 backdrop-blur-sm">
                        <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                          <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center text-white mr-3 text-sm">
                            🏆
                          </span>
                          {facultyData.about.achievementsTitle}
                        </h4>
                        <div className="space-y-4">
                          {facultyData.about.achievements.map(
                            (achievement, index) => (
                              <motion.div
                                key={index}
                                className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                                whileHover={{ scale: 1.02 }}
                              >
                                <span className="text-3xl text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                                  {achievement.icon}
                                </span>
                                <div>
                                  <div className="text-white font-bold text-xl">
                                    {achievement.value}
                                  </div>
                                  <div className="text-blue-200 text-lg">
                                    {achievement.label}
                                  </div>
                                </div>
                              </motion.div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Programs Tab */}
              {activeTab === "programs" && (
                <motion.div
                  key="programs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {facultyData.programs.map((program, index) => (
                      <motion.div
                        key={program.id || index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden backdrop-blur-sm"
                        onMouseEnter={() => setHoveredCard(`program-${index}`)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        {/* Background effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

                        <div className="relative z-10">
                          <div
                            className={`text-5xl mb-6 transition-transform duration-500 ${
                              hoveredCard === `program-${index}`
                                ? "scale-110 rotate-6"
                                : "group-hover:scale-105"
                            }`}
                          >
                            {program.icon}
                          </div>
                          <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                            {program.name}
                          </h4>
                          <p className="text-blue-100 text-lg mb-6 leading-relaxed">
                            {program.description}
                          </p>
                          <div className="space-y-4 text-lg">
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                              <span className="text-blue-200">Уровень:</span>
                              <span className="text-white font-semibold">
                                {program.level}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                              <span className="text-blue-200">
                                Длительность:
                              </span>
                              <span className="text-white font-semibold">
                                {program.duration}
                              </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white/5 rounded-2xl">
                              <span className="text-blue-200">Форма:</span>
                              <span className="text-white font-semibold">
                                {program.format}
                              </span>
                            </div>
                            {program.tuitionFee && (
                              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl">
                                <span className="text-blue-200">
                                  Стоимость:
                                </span>
                                <span className="text-white font-semibold">
                                  {program.tuitionFee}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Specializations Tab */}
              {activeTab === "specializations" && (
                <motion.div
                  key="specializations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="grid gap-6">
                    {facultyData.specializations.map(
                      (specialization, index) => (
                        <motion.div
                          key={specialization.id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-6 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-1 group backdrop-blur-sm"
                        >
                          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                            {specialization.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-2xl mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                              {specialization.name}
                            </h4>
                            <p className="text-blue-100 text-lg mb-4 leading-relaxed">
                              {specialization.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {specialization.competencies?.map(
                                (competency, i) => (
                                  <motion.span
                                    key={i}
                                    className="px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-2xl text-base font-medium hover:bg-emerald-500/30 hover:scale-105 transition-all duration-300 cursor-default border border-emerald-400/30"
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    {competency}
                                  </motion.span>
                                )
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                </motion.div>
              )}

              {/* Teachers Tab */}
              {activeTab === "teachers" && (
                <motion.div
                  key="teachers"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {facultyData.teachers.map((teacher, index) => (
                      <motion.div
                        key={teacher.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-2xl p-6 text-center border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group backdrop-blur-sm"
                      >
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          {teacher.avatar}
                        </div>
                        <h4 className="font-bold text-white text-xl mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                          {teacher.name}
                        </h4>
                        <p className="text-emerald-400 text-lg font-medium mb-2">
                          {teacher.position}
                        </p>
                        <p className="text-blue-200 text-sm mb-3">
                          {teacher.qualification}
                        </p>
                        <p className="text-blue-100 text-xs mb-4">
                          Опыт: {teacher.experience}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {teacher.specializations.map((spec, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-xl text-sm font-medium border border-blue-400/30"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Contacts Tab */}
              {activeTab === "contacts" && (
                <motion.div
                  key="contacts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold text-white flex items-center">
                      <span className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mr-4 text-lg">
                        📞
                      </span>
                      Контакты
                    </h3>
                    <div className="space-y-4">
                      {facultyData.contacts.items.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group backdrop-blur-sm"
                          whileHover={{ scale: 1.02 }}
                        >
                          <span className="text-2xl text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                          </span>
                          <div>
                            <div className="text-white font-medium text-lg">
                              {item.value}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  {facultyData.contacts.dean && (
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-sm">
                      <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                        <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white mr-3 text-sm">
                          👨‍✈️
                        </span>
                        {t(
                          "militaryTraining.contacts.dean",
                          "Начальник факультета"
                        )}
                      </h3>
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                          {facultyData.contacts.dean.avatar}
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-2">
                          {facultyData.contacts.dean.name}
                        </h4>
                        <p className="text-emerald-400 text-lg mb-2 font-medium">
                          {facultyData.contacts.dean.position}
                        </p>
                        <p className="text-blue-200 text-base mb-2">
                          {facultyData.contacts.dean.qualification}
                        </p>
                        <p className="text-blue-100 text-sm mb-3">
                          Опыт: {facultyData.contacts.dean.experience}
                        </p>
                        <p className="text-white font-medium">
                          {facultyData.contacts.dean.email}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MilitaryTraining;
