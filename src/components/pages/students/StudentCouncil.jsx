// StudentCouncil.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const StudentCouncil = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("members");
  const [isVisible, setIsVisible] = useState(false);
  const [expandedMember, setExpandedMember] = useState(null);
  const [expandedInitiative, setExpandedInitiative] = useState(null);

  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    members: [],
    initiatives: [],
    events: [],
    stats: [],
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
    return langMap[i18n.language] || "ru";
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
      const response = await fetch(
        `${API_URL}/api/student-clubs/council-page/?lang=${lang}`
      );

      // Проверяем content-type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.warn(
          "Non-JSON response from council page:",
          text.substring(0, 200)
        );
        setBackendData((prev) => ({
          ...prev,
          loading: false,
          error: "Invalid response format",
        }));
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setBackendData({
        members: data.members || [],
        initiatives: data.initiatives || [],
        events: data.events || [],
        stats: data.stats || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching council data:", error);
      setBackendData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load data",
      }));
    }
  }, [getApiLanguage]);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchBackendData();
  }, []);

  // Перезагрузка данных при изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [i18n.language]);

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

  const commonInfo = t("studentCouncil.commonInfo", { returnObjects: true });

  const toggleMember = (index) => {
    setExpandedMember(expandedMember === index ? null : index);
  };

  const toggleInitiative = (index) => {
    setExpandedInitiative(expandedInitiative === index ? null : index);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExpandedMember(null);
    setExpandedInitiative(null);
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Map app language codes to valid Intl locales.
    // i18n is using 'kg' for Kyrgyz; Intl expects 'ky' or a region-tag like 'ky-KG'.
    const localeMap = {
      en: "en-US",
      ru: "ru-RU",
      kg: "ky-KG",
    };

    const locale = localeMap[i18n.language] || i18n.language || "ru-RU";

    try {
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      // Fallback in case the provided locale is not supported in the environment
      console.warn(
        "Locale not supported for date formatting, falling back to ru-RU:",
        locale,
        err
      );
      return date.toLocaleDateString("ru-RU", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  // Получение статуса события
  const getEventStatus = (event) => {
    const now = new Date();
    const eventDate = new Date(event.date);

    if (event.status === "past" || eventDate < now) {
      return {
        status: "past",
        color: "bg-gray-500/20 text-gray-300",
        label: t("studentCouncil.past"),
      };
    } else if (
      event.status === "ongoing" ||
      eventDate.toDateString() === now.toDateString()
    ) {
      return {
        status: "ongoing",
        color: "bg-emerald-500/20 text-emerald-300",
        label: t("studentCouncil.ongoing"),
      };
    } else {
      return {
        status: "upcoming",
        color: "bg-blue-500/20 text-blue-300",
        label: t("studentCouncil.upcoming"),
      };
    }
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
        {t("studentCouncil.errorTitle")}
      </h2>
      <p className="text-blue-200 mb-6">{backendData.error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t("studentCouncil.retry")}
      </button>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-900 via-cyan-900 to-green-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Символы студенческой активности */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">👥</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          🎯
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">📢</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🌟</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t("studentCouncil.title")}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 rounded-full"></div>
        </motion.div>

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
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-green-400/30 transition-all duration-300 group"
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon || "📊"}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-cyan-200 text-sm lg:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Навигация вкладок */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center mb-12 lg:mb-16"
        >
          <div className="bg-white/5 rounded-2xl p-2 backdrop-blur-lg border border-white/20 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-2">
              {["members", "initiatives", "events"].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTabChange(tab)}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-500 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg"
                      : "text-cyan-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="text-2xl">
                    {tab === "members" && "👥"}
                    {tab === "initiatives" && "🎯"}
                    {tab === "events" && "📅"}
                  </span>
                  <span>{t(`studentCouncil.${tab}Title`)}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {backendData.error ? (
          <ErrorMessage onRetry={fetchBackendData} />
        ) : (
          <div className="space-y-8">
            {/* Контент вкладок */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                {backendData.loading ? (
                  <LoadingSkeleton />
                ) : (
                  <>
                    {/* Вкладка участников */}
                    {activeTab === "members" && (
                      <div>
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-2xl flex items-center justify-center text-white text-2xl">
                            👥
                          </div>
                          <h2 className="text-2xl lg:text-3xl font-bold text-white">
                            {t("studentCouncil.membersTitle")}
                          </h2>
                        </div>

                        {backendData.members.length > 0 ? (
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {backendData.members.map((member, index) => (
                              <motion.div
                                key={member.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 rounded-2xl border border-white/10 hover:border-pink-400/30 transition-all duration-300 overflow-hidden group"
                              >
                                <div className="p-6">
                                  <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-green-400 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                                      {member.avatar ? (
                                        <img
                                          src={member.avatar}
                                          alt={member.name}
                                          className="w-full h-full rounded-2xl object-cover"
                                        />
                                      ) : (
                                        member.name.charAt(0)
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-bold text-white text-lg truncate">
                                        {member.name}
                                      </h3>
                                      <p className="text-purple-300 text-sm truncate">
                                        {member.position}
                                      </p>
                                      <p className="text-purple-400 text-xs truncate">
                                        {member.department}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-2 mb-4">
                                    <div className="flex items-center space-x-2 text-sm">
                                      <span className="text-purple-300">
                                        📧
                                      </span>
                                      <a
                                        href={`mailto:${member.email}`}
                                        className="text-blue-300 hover:text-blue-200 truncate"
                                      >
                                        {member.email}
                                      </a>
                                    </div>
                                    {member.phone && (
                                      <div className="flex items-center space-x-2 text-sm">
                                        <span className="text-purple-300">
                                          📞
                                        </span>
                                        <span className="text-purple-200">
                                          {member.phone}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    onClick={() => toggleMember(index)}
                                    className="w-full py-2 bg-white/10 rounded-xl text-purple-200 hover:text-white hover:bg-white/20 transition-colors duration-300 flex items-center justify-center space-x-2"
                                  >
                                    <span>
                                      {t("studentCouncil.viewDetails")}
                                    </span>
                                    <svg
                                      className={`w-4 h-4 transition-transform duration-300 ${
                                        expandedMember === index
                                          ? "rotate-180"
                                          : ""
                                      }`}
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                      />
                                    </svg>
                                  </button>
                                </div>

                                <AnimatePresence>
                                  {expandedMember === index && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      <div className="px-6 pb-6 border-t border-white/10 pt-4">
                                        {member.bio && (
                                          <div className="mb-4">
                                            <h4 className="font-semibold text-white mb-2">
                                              {t("studentCouncil.bio")}
                                            </h4>
                                            <p className="text-purple-100 text-sm leading-relaxed">
                                              {member.bio}
                                            </p>
                                          </div>
                                        )}
                                        {member.achievements && (
                                          <div className="mb-4">
                                            <h4 className="font-semibold text-white mb-2">
                                              {t("studentCouncil.achievements")}
                                            </h4>
                                            <p className="text-purple-100 text-sm leading-relaxed">
                                              {member.achievements}
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-purple-200">
                            {t("studentCouncil.noMembers")}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Вкладка инициатив */}
                    {activeTab === "initiatives" && (
                      <div>
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-2xl flex items-center justify-center text-white text-2xl">
                            🎯
                          </div>
                          <h2 className="text-2xl lg:text-3xl font-bold text-white">
                            {t("studentCouncil.initiativesTitle")}
                          </h2>
                        </div>

                        {backendData.initiatives.length > 0 ? (
                          <div className="space-y-6">
                            {backendData.initiatives.map(
                              (initiative, index) => (
                                <motion.div
                                  key={initiative.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="bg-white/5 rounded-2xl border border-white/10 hover:border-pink-400/30 transition-all duration-300 overflow-hidden group"
                                >
                                  <button
                                    onClick={() => toggleInitiative(index)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors duration-300"
                                  >
                                    <div className="flex items-center space-x-4">
                                      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                        {initiative.icon}
                                      </div>
                                      <div className="text-left">
                                        <h3 className="font-bold text-white text-lg mb-1">
                                          {initiative.title}
                                        </h3>
                                        <p className="text-purple-200 text-sm">
                                          {initiative.description}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                      <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                          initiative.status === "completed"
                                            ? "bg-emerald-500/20 text-emerald-300"
                                            : initiative.status ===
                                              "in_progress"
                                            ? "bg-blue-500/20 text-blue-300"
                                            : "bg-yellow-500/20 text-yellow-300"
                                        }`}
                                      >
                                        {initiative.status_display}
                                      </span>
                                      <svg
                                        className={`w-6 h-6 text-purple-300 transition-transform duration-300 ${
                                          expandedInitiative === index
                                            ? "rotate-180"
                                            : ""
                                        }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </div>
                                  </button>

                                  <AnimatePresence>
                                    {expandedInitiative === index && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <div className="px-6 pb-6 border-t border-white/10 pt-4">
                                          <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                              <h4 className="font-semibold text-white mb-3">
                                                {t("studentCouncil.goals")}
                                              </h4>
                                              <p className="text-purple-100 text-sm leading-relaxed">
                                                {initiative.goals}
                                              </p>
                                            </div>
                                            <div>
                                              <h4 className="font-semibold text-white mb-3">
                                                {t("studentCouncil.timeline")}
                                              </h4>
                                              <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                  <span className="text-purple-300">
                                                    {t(
                                                      "studentCouncil.startDate"
                                                    )}
                                                  </span>
                                                  <span className="text-purple-100">
                                                    {formatDate(
                                                      initiative.start_date
                                                    )}
                                                  </span>
                                                </div>
                                                <div className="flex justify-between">
                                                  <span className="text-purple-300">
                                                    {t(
                                                      "studentCouncil.endDate"
                                                    )}
                                                  </span>
                                                  <span className="text-purple-100">
                                                    {formatDate(
                                                      initiative.end_date
                                                    )}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          {initiative.lead_members &&
                                            initiative.lead_members.length >
                                              0 && (
                                              <div className="mt-4">
                                                <h4 className="font-semibold text-white mb-2">
                                                  {t(
                                                    "studentCouncil.leadMembers"
                                                  )}
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                  {initiative.lead_members.map(
                                                    (member, memberIndex) => (
                                                      <span
                                                        key={memberIndex}
                                                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                                                      >
                                                        {member.name}
                                                      </span>
                                                    )
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-purple-200">
                            {t("studentCouncil.noInitiatives")}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Вкладка событий */}
                    {activeTab === "events" && (
                      <div>
                        <div className="flex items-center space-x-4 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-2xl flex items-center justify-center text-white text-2xl">
                            📅
                          </div>
                          <h2 className="text-2xl lg:text-3xl font-bold text-white">
                            {t("studentCouncil.eventsTitle")}
                          </h2>
                        </div>

                        {backendData.events.length > 0 ? (
                          <div className="space-y-6">
                            {backendData.events.map((event, index) => {
                              const statusInfo = getEventStatus(event);
                              return (
                                <motion.div
                                  key={event.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="bg-white/5 rounded-2xl border border-white/10 hover:border-pink-400/30 transition-all duration-300 overflow-hidden group"
                                >
                                  <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                      <div className="flex items-center space-x-4">
                                        <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                          {event.icon}
                                        </div>
                                        <div>
                                          <h3 className="font-bold text-white text-lg mb-1">
                                            {event.title}
                                          </h3>
                                          <p className="text-purple-200 text-sm">
                                            {event.description}
                                          </p>
                                        </div>
                                      </div>
                                      <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}
                                      >
                                        {statusInfo.label}
                                      </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                      <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-sm">
                                          <span className="text-purple-300">
                                            📅
                                          </span>
                                          <span className="text-purple-100">
                                            {formatDate(event.date)}
                                          </span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm">
                                          <span className="text-purple-300">
                                            📍
                                          </span>
                                          <span className="text-purple-100">
                                            {event.location}
                                          </span>
                                        </div>
                                      </div>
                                      {event.initiative && (
                                        <div className="text-sm">
                                          <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-purple-300">
                                              🎯
                                            </span>
                                            <span className="text-purple-100">
                                              {t(
                                                "studentCouncil.relatedInitiative"
                                              )}
                                              : {event.initiative.title}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {event.registration_link &&
                                      statusInfo.status !== "past" && (
                                        <motion.a
                                          href={event.registration_link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          className="inline-block w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-400 to-green-400 text-white font-semibold rounded-xl text-center hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                                        >
                                          {t("studentCouncil.register")}
                                        </motion.a>
                                      )}
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-purple-200">
                            {t("studentCouncil.noEvents")}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default StudentCouncil;
