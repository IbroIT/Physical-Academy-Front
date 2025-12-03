// ExchangePrograms.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const ExchangePrograms = () => {
  const { t, i18n } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [activeProgram, setActiveProgram] = useState(0);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [isApplying, setIsApplying] = useState(null);

  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    title: "",
    subtitle: "",
    stats: [],
    programs: [],
    filters: {
      regions: [],
      durations: [],
    },
    deadlines: {
      title: "",
      list: [],
    },
    loading: false,
    error: null,
  });

  const sectionRef = useRef(null);

  // Получение текущего языка для API
  const getApiLanguage = useCallback(() => {
    const langMap = {
      en: "en",
      ru: "ru",
      kg: "kg",
    };
    return langMap[i18n.language] || "en";
  }, [i18n.language]);

  // Функция для загрузки данных с бэкенда
  const fetchBackendData = useCallback(async () => {
    try {
      setBackendData((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const lang = getApiLanguage();

      const API_URL = import.meta.env.VITE_API_URL;

      // Правильный endpoint
      const endpoint = `${API_URL}/api/student-clubs/exchange-page/?lang=${lang}`;

      console.log(`Fetching exchange data from: ${endpoint}`);

      const response = await fetch(endpoint);

      // Проверяем content-type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.warn(
          "Non-JSON response from exchange page:",
          text.substring(0, 200)
        );
        throw new Error("Invalid response format");
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Exchange data received:", data);
      console.log("Programs count:", data.programs?.length);
      console.log("Stats count:", data.stats?.length);
      console.log("Filters:", data.filters);

      setBackendData({
        title: data.title || t("students.exchange.title"),
        subtitle: data.subtitle || t("students.exchange.subtitle"),
        stats: data.stats || [],
        programs: data.programs || [],
        filters: data.filters || {
          regions: [],
          durations: [],
        },
        deadlines: data.deadlines || {
          title: t("students.exchange.deadlines.title"),
          list: [],
        },
        loading: false,
        error: null,
      });

      console.log("Backend data state updated");
    } catch (error) {
      console.error("Error fetching exchange data:", error);

      setBackendData((prev) => ({
        ...prev,
        loading: false,
        error: error.message || "Failed to load exchange programs",
      }));
    }
  }, [getApiLanguage, t]);

  // Загрузка данных при монтировании и перезагрузка при изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [i18n.language, fetchBackendData]);

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

  // Автопереключение программ
  useEffect(() => {
    if (backendData.programs.length > 0) {
      const interval = setInterval(() => {
        setActiveProgram((prev) => (prev + 1) % backendData.programs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [backendData.programs]);

  // Анимация счетчиков
  useEffect(() => {
    if (isVisible && backendData.stats.length > 0) {
      const targetValues = backendData.stats.map((stat) => {
        const value = stat.value || "0";
        return parseInt(value.replace(/\D/g, "")) || 0;
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

      return () => clearInterval(counterInterval);
    }
  }, [isVisible, backendData.stats]);

  const filteredPrograms = backendData.programs.filter((program) => {
    const matchesRegion =
      selectedRegion === "all" || program.region == selectedRegion;
    const matchesDuration =
      selectedDuration === "all" || program.duration_type == selectedDuration;

    const university = program.university || "";
    const country = program.country || "";
    const description = program.description || "";

    const matchesSearch =
      university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRegion && matchesDuration && matchesSearch;
  });

  const toggleProgram = (index) => {
    setExpandedProgram(expandedProgram === index ? null : index);
  };

  const handleApply = async (programId, programName) => {
    setIsApplying(programId);
    try {
      // Имитация подачи заявки
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert(
        t("students.exchange.alerts.applicationSent", {
          university: programName,
        })
      );
    } catch (error) {
      console.error("Application error:", error);
      alert(t("students.exchange.alerts.applicationError"));
    } finally {
      setIsApplying(null);
    }
  };

  const handleFilterChange = (type, value) => {
    if (type === "region") {
      setSelectedRegion(value);
    } else if (type === "duration") {
      setSelectedDuration(value);
    }
    setExpandedProgram(null);
  };

  // Компонент загрузки
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="bg-white/10 rounded-2xl h-8 mb-4"></div>
      <div className="bg-white/10 rounded-2xl h-4 mb-2"></div>
      <div className="bg-white/10 rounded-2xl h-4 w-3/4"></div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white/10 rounded-2xl h-20"></div>
        <div className="bg-white/10 rounded-2xl h-20"></div>
      </div>
    </div>
  );

  // Компонент ошибки
  const ErrorMessage = ({ onRetry }) => (
    <div className="text-center py-8">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl text-white mb-4">
        {t("students.exchange.errorTitle")}
      </h2>
      <p className="text-blue-200 mb-6">{backendData.error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t("students.exchange.retry")}
      </button>
    </div>
  );

  // Получение переведенного текста
  const getTranslatedText = (item, field) => {
    if (!item) return "";

    // Сначала пробуем получить уже локализованное поле из бэкенда
    if (item[field] !== undefined && item[field] !== null) {
      return item[field];
    }

    // Если нет, пробуем поля с суффиксом языка (fallback для старых данных)
    const lang = getApiLanguage();
    const translatedField = `${field}_${lang}`;

    if (item[translatedField]) {
      return item[translatedField];
    }

    // Fallback на английский
    if (item[`${field}_en`]) {
      return item[`${field}_en`];
    }

    // Последний fallback
    return "";
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон с международными символами */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Международные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🌍</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          ✈️
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🎓</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🤝</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {backendData.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {backendData.subtitle}
          </p>
        </motion.div>

        {backendData.loading ? (
          <div className="text-center py-8">
            <div className="text-blue-400 text-6xl mb-4">⏳</div>
            <h2 className="text-2xl text-white mb-4">
              {t("students.exchange.loading")}
            </h2>
          </div>
        ) : backendData.error ? (
          <div className="text-center py-8">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl text-white mb-4">
              {t("common.error") || "Error"}
            </h2>
            <p className="text-blue-200">{backendData.error}</p>
          </div>
        ) : backendData.programs.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-blue-400 text-6xl mb-4">📭</div>
            <h2 className="text-2xl text-white mb-4">
              {t("students.exchange.noPrograms") ||
                "No exchange programs available"}
            </h2>
            <p className="text-blue-200">
              {t("students.exchange.noProgramsDesc") ||
                "Please check back later for available programs"}
            </p>
          </div>
        ) : (
          <>
            {/* Статистика */}
            {backendData.stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
              >
                {backendData.stats.map((stat, index) => (
                  <motion.div
                    key={stat.id || index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                  >
                    <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {stat.icon || "📊"}
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300 font-mono">
                      {stat.value?.includes("%")
                        ? `${Math.round(counterValues[index])}%`
                        : stat.value?.includes("+")
                        ? `${Math.round(counterValues[index])}+`
                        : Math.round(counterValues[index])}
                    </div>
                    <div className="text-blue-200 text-sm lg:text-base">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Фильтры и поиск */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Поиск */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t("students.exchange.searchPlaceholder") || "Search..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 text-white placeholder-blue-300 rounded-2xl focus:outline-none focus:border-emerald-400 transition-all duration-300 backdrop-blur-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl">
                    🔍
                  </span>
                </div>

                {/* Фильтр по региону */}
                <div className="relative">
                  <select
                    value={selectedRegion}
                    onChange={(e) =>
                      handleFilterChange("region", e.target.value)
                    }
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 text-white rounded-2xl focus:outline-none focus:border-emerald-400 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="all" className="bg-slate-800">
                      {t("students.exchange.allRegions") || "All Regions"}
                    </option>
                    {backendData.filters.regions.map((region) => (
                      <option
                        key={region.id}
                        value={region.id}
                        className="bg-slate-800"
                      >
                        {region.name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
                    🌍
                  </span>
                </div>

                {/* Фильтр по длительности */}
                <div className="relative">
                  <select
                    value={selectedDuration}
                    onChange={(e) =>
                      handleFilterChange("duration", e.target.value)
                    }
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 text-white rounded-2xl focus:outline-none focus:border-emerald-400 transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="all" className="bg-slate-800">
                      {t("students.exchange.allDurations") || "All Durations"}
                    </option>
                    {backendData.filters.durations.map((duration) => (
                      <option
                        key={duration.id}
                        value={duration.id}
                        className="bg-slate-800"
                      >
                        {duration.name}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl pointer-events-none">
                    ⏱️
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Список всех программ */}
            <div className="space-y-6">
              {filteredPrograms.map((program, index) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  index={index}
                  isExpanded={expandedProgram === index}
                  isApplying={isApplying === program.id}
                  onToggle={() => toggleProgram(index)}
                  onApply={() => handleApply(program.id, program.university)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

// Компонент ProgramCard - обновленная версия с прямыми полями
const ProgramCard = ({
  program,
  index,
  isExpanded,
  isApplying,
  onToggle,
  onApply,
}) => {
  const { t } = useTranslation();

  const common = t("students.exchange.common", { returnObjects: true });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "high":
        return {
          bg: "bg-red-500/20",
          text: "text-red-400",
          border: "border-red-400/30",
        };
      case "medium":
        return {
          bg: "bg-yellow-500/20",
          text: "text-yellow-400",
          border: "border-yellow-400/30",
        };
      case "low":
        return {
          bg: "bg-green-500/20",
          text: "text-green-400",
          border: "border-green-400/30",
        };
      default:
        return {
          bg: "bg-gray-500/20",
          text: "text-gray-400",
          border: "border-gray-400/30",
        };
    }
  };

  const difficultyColors = getDifficultyColor(program.difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/30"
      whileHover={{ scale: 1.01 }}
    >
      <div className="p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Основная информация */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">
                  {program.university}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-blue-200 mb-4">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🌍</span>
                    <span>{program.country}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">⏱️</span>
                    <span>{program.duration}</span>
                  </span>
                  <span
                    className={`px-4 py-2 rounded-2xl text-sm font-medium backdrop-blur-sm border ${difficultyColors.bg} ${difficultyColors.text} ${difficultyColors.border}`}
                  >
                    {program.difficulty_label || program.difficulty}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  {program.cost || common.free}
                </div>
                <div className="text-blue-300 text-sm">{common.cost}</div>
              </div>
            </div>

            <p className="text-blue-100 mb-6 leading-relaxed text-lg">
              {program.description}
            </p>

            {/* Быстрая информация */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-lg font-bold text-white">
                  {program.language || common.defaultLanguage}
                </div>
                <div className="text-blue-300 text-sm">{common.language}</div>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-lg font-bold text-white">
                  {program.grants_available || common.grantsAvailable}
                </div>
                <div className="text-blue-300 text-sm">{common.grants}</div>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-lg font-bold text-white">
                  {program.deadline || common.soon}
                </div>
                <div className="text-blue-300 text-sm">{common.deadline}</div>
              </div>
              <div className="text-center bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-lg font-bold text-white">
                  {program.available_spots || common.defaultSpots}
                </div>
                <div className="text-blue-300 text-sm">{common.spots}</div>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="lg:w-56 flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onApply}
              disabled={isApplying || program.available_spots === 0}
              className={`w-full py-4 px-6 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center backdrop-blur-sm ${
                program.available_spots > 0 && !isApplying
                  ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600 shadow-lg"
                  : "bg-white/10 text-blue-300 cursor-not-allowed border border-white/10"
              }`}
            >
              {isApplying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  {common.sending}
                </>
              ) : (
                <>
                  <span className="text-xl mr-3">📝</span>
                  {common.apply}
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggle}
              className="w-full py-4 px-6 bg-white/10 border border-white/10 text-white rounded-2xl hover:border-emerald-400/30 transition-all duration-300 font-medium flex items-center justify-center backdrop-blur-sm"
            >
              <span className="text-xl mr-3">{isExpanded ? "📋" : "🔍"}</span>
              {isExpanded ? common.collapse : common.more}
            </motion.button>

            {program.website && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={program.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 bg-white/10 border border-emerald-400 text-emerald-400 rounded-2xl hover:bg-emerald-400/10 transition-all duration-300 font-medium flex items-center justify-center backdrop-blur-sm"
              >
                <span className="text-xl mr-3">🌐</span>
                {common.website}
              </motion.a>
            )}
          </div>
        </div>

        {/* Расширенная информация */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 pt-8 border-t border-white/20 space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Требования */}
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-400/30 backdrop-blur-sm">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-3 text-lg">
                    <span className="text-xl">📋</span>
                    <span>{common.requirements}</span>
                  </h4>
                  <ul className="space-y-3">
                    {(program.requirements || []).map((req, reqIndex) => (
                      <li
                        key={reqIndex}
                        className="flex items-start text-blue-200"
                      >
                        <span className="text-emerald-400 mr-3 mt-1 text-lg">
                          •
                        </span>
                        {req.text}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Преимущества */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-2xl p-6 border border-emerald-400/30 backdrop-blur-sm">
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-3 text-lg">
                    <span className="text-xl">⭐</span>
                    <span>{common.benefits}</span>
                  </h4>
                  <ul className="space-y-3">
                    {(program.benefits || []).map((benefit, benefitIndex) => (
                      <li
                        key={benefitIndex}
                        className="flex items-start text-blue-200"
                      >
                        <span className="text-emerald-400 mr-3 mt-1 text-lg">
                          ✓
                        </span>
                        {benefit.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Доступные курсы */}
              {program.available_courses &&
                program.available_courses.length > 0 && (
                  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-400/30 backdrop-blur-sm">
                    <h4 className="font-semibold text-white mb-4 flex items-center gap-3 text-lg">
                      <span className="text-xl">📚</span>
                      <span>{common.availableCourses}</span>
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {program.available_courses.map((course, courseIndex) => (
                        <span
                          key={courseIndex}
                          className="px-4 py-2 bg-white/10 text-blue-200 rounded-2xl text-sm font-medium backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
                        >
                          {course.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ExchangePrograms;
