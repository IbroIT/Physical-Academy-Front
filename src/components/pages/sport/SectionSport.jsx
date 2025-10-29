import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const SectionSport = () => {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSection, setSelectedSection] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiData, setApiData] = useState({
    sections: [],
    loading: false,
    error: null,
  });
  const sectionRef = useRef(null);
  const modalRef = useRef(null);

  // Загрузка данных с API
  const fetchSectionsData = async () => {
    try {
      setApiData((prev) => ({ ...prev, loading: true, error: null }));

      // API endpoint для спортивных секций
      const API_URL = import.meta.env.VITE_API_URL || "";
      const response = await fetch(
        `${API_URL}/api/sports/sections/?language=${i18n.language}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // API возвращает пагинированный ответ с полем results
      setApiData({
        sections: data.results || data, // Берем results или весь data если это массив
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching sections data:", error);
      setApiData((prev) => ({ ...prev, error: error.message, loading: false }));
    }
  };

  useEffect(() => {
    fetchSectionsData();
  }, [i18n.language]);

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

  const openModal = (section) => {
    setSelectedSection(section);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSection(null);
  };

  // Функция для нормализации данных из API
  const normalizeSectionData = (apiSections) => {
    // Если API вернул данные, используем их
    if (apiSections && Array.isArray(apiSections) && apiSections.length > 0) {
      return apiSections.map((section) => ({
        id: section.id,
        slug: section.slug || section.id,
        name: section.name || section.title,
        // Ensure coach is always a string to avoid .toLowerCase() errors
        coach: section.coach || section.trainer || "",
        // Top-level schedule (string) if present
        schedule: section.schedule || section.training_schedule || "",
        image:
          section.image ||
          section.photo ||
          "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
        sportType: section.sport_type || section.type || "all",
        description: section.description || "",
        coachInfo: section.coach_info
          ? {
              name: section.coach_info.name || section.coach_info.full_name,
              rank: section.coach_info.rank || section.coach_info.title,
              contacts: section.coach_info.contacts || section.coach_info.phone,
            }
          : null,
        // Normalize training schedule items so they include `day` and `time`
        trainingSchedule: (
          section.training_schedule_details ||
          section.schedule_details ||
          []
        ).map((s) => ({
          day: s.day || s.get_day_of_week_display || "",
          // Provide a unified `time` field expected by the component
          time:
            s.time ||
            (s.time_start && s.time_end
              ? `${s.time_start} - ${s.time_end}`
              : s.time_start || s.time_end || ""),
          location: s.location || "",
        })),
        contactInfo: section.contact_info || section.contacts || "",
      }));
    }

    // Fallback - пустой массив, если нет данных
    return [];
  };

  // Получаем нормализованные данные
  const sectionsData = normalizeSectionData(apiData.sections);

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

  // Фильтрация секций
  const filteredSections = sectionsData.filter((section) => {
    const matchesFilter =
      activeFilter === "all" || section.sportType === activeFilter;
    const matchesSearch =
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.coach.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Получение иконки для типа спорта
  const getSportIcon = (sportType) => {
    const icons = {
      game: "⚽",
      combat: "🥋",
      winter: "⛷️",
      water: "🏊",
      athletics: "🏃",
      other: "🎯",
    };
    return icons[sportType] || icons.other;
  };

  // Получение цвета для типа спорта
  const getSportColor = (sportType) => {
    const colors = {
      game: "from-blue-500 to-green-500",
      combat: "from-red-500 to-orange-500",
      winter: "from-cyan-500 to-blue-500",
      water: "from-blue-400 to-cyan-400",
      athletics: "from-emerald-500 to-green-500",
      other: "from-purple-500 to-pink-500",
    };
    return colors[sportType] || colors.other;
  };

  const defaultFilters = [
    { id: "all", label: t("sectionSport.filters.all", "Все"), icon: "🎯" },
    {
      id: "game",
      label: t("sectionSport.filters.game", "Игровые"),
      icon: "⚽",
    },
    {
      id: "combat",
      label: t("sectionSport.filters.combat", "Единоборства"),
      icon: "🥋",
    },
    {
      id: "winter",
      label: t("sectionSport.filters.winter", "Зимние"),
      icon: "⛷️",
    },
    {
      id: "water",
      label: t("sectionSport.filters.water", "Водные"),
      icon: "🏊",
    },
    {
      id: "athletics",
      label: t("sectionSport.filters.athletics", "Легкая атлетика"),
      icon: "🏃",
    },
  ];

  const [filters, setFilters] = useState(defaultFilters);

  // Fetch filter types from backend: /api/sports/types/?language=...
  const fetchFiltersData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "";
      const res = await fetch(
        `${API_URL}/api/sports/types/?language=${i18n.language}`
      );
      
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      let list = data.results || data;
      if (!Array.isArray(list)) {
        console.warn("/api/sports/types returned unexpected shape", list);
        setFilters(defaultFilters);
        return;
      }

      const mapped = list.map((item) => {
        // support simple string items or objects {id,label,icon}
        if (typeof item === "string") {
          return { id: item, label: item, icon: getSportIcon(item) };
        }
        return {
          id: item.id ?? item.key ?? item.slug ?? String(item.id),
          label: item.label ?? item.name ?? item.title ?? String(item.id),
          icon:
            item.icon ??
            item.emoji ??
            getSportIcon(item.id ?? item.key ?? item.slug ?? "other"),
        };
      });

      // ensure 'all' exists at beginning
      if (!mapped.find((m) => m.id === "all")) {
        mapped.unshift(defaultFilters[0]);
      }

      setFilters(mapped);
    } catch (err) {
      console.error("Error fetching sport filter types:", err);
      setFilters(defaultFilters);
    }
  };

  useEffect(() => {
    fetchFiltersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

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
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">⚽</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          🥋
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🏊</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl opacity-5">
          🏃
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
              {t("sectionSport.badge", "Спортивные секции")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {t("sectionSport.title", "Спортивные секции КГАФКиС")}
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
              "sectionSport.subtitle",
              "Академия предоставляет широкие возможности для занятий спортом. Каждый студент может выбрать секцию по интересам — от лёгкой атлетики до борьбы."
            )}
          </motion.p>
        </motion.div>

        {/* Поиск и фильтрация */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl p-6 lg:p-8 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Поле поиска */}
            <div className="relative">
              <input
                type="text"
                placeholder={t(
                  "sectionSport.search.placeholder",
                  "Поиск по названию или тренеру..."
                )}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:border-emerald-400 transition-all duration-300 text-lg backdrop-blur-sm"
              />
            </div>

            {/* Фильтры */}
            <div className="flex flex-wrap gap-3">
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center space-x-2 px-6 py-3 font-bold text-lg transition-all duration-500 transform rounded-2xl ${
                    activeFilter === filter.id
                      ? `bg-gradient-to-r ${getSportColor(
                          filter.id
                        )} text-white shadow-2xl scale-105`
                      : "text-blue-100 hover:text-white hover:bg-white/10 hover:shadow-lg"
                  }`}
                >
                  <span className="text-xl">{filter.icon}</span>
                  <span className="text-base lg:text-lg">{filter.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Список секций */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence>
            {filteredSections.map((section, index) => (
              <motion.div
                key={section.id}
                variants={itemVariants}
                layout
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer"
                onMouseEnter={() => setHoveredCard(section.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => openModal(section)}
              >
                {/* Картинка секции */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={section.image}
                    alt={section.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>

                  {/* Бейдж типа спорта */}
                  <div className="absolute top-4 right-4">
                    <div
                      className={`bg-gradient-to-r ${getSportColor(
                        section.sportType
                      )} text-white px-4 py-2 rounded-2xl font-bold text-sm backdrop-blur-sm flex items-center space-x-2`}
                    >
                      <span className="text-lg">
                        {getSportIcon(section.sportType)}
                      </span>
                      <span>
                        {filters.find((f) => f.id === section.sportType)?.label}
                      </span>
                    </div>
                  </div>

                  {/* Эффект при наведении */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Контент карточки */}
                <div className="p-6 lg:p-8">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                    {section.name}
                  </h3>

                  <div className="space-y-4 text-lg">
                    {/* Тренер */}
                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-emerald-400/30 transition-all duration-300">
                      <span className="text-2xl text-emerald-400">👨‍🏫</span>
                      <div>
                        <div className="text-blue-200 text-sm">
                          {t("sectionSport.card.coach", "Тренер")}
                        </div>
                        <div className="text-white font-semibold">
                          {section.coach}
                        </div>
                      </div>
                    </div>

                    {/* Расписание */}
                    <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-emerald-400/30 transition-all duration-300">
                      <span className="text-2xl text-blue-400">🕒</span>
                      <div>
                        <div className="text-blue-200 text-sm">
                          {t("sectionSport.card.schedule", "Расписание")}
                        </div>
                        <div className="text-white font-semibold">
                          {section.schedule}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Кнопка подробнее */}
                  <motion.div whileHover={{ scale: 1.05 }} className="mt-6">
                    <div className="w-full bg-gradient-to-r from-emerald-500 to-green-500 text-white text-center py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform group-hover:scale-105">
                      {t("sectionSport.card.more", "Подробнее")}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Сообщение если нет результатов */}
        {filteredSections.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-6">�</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {t("sectionSport.noData.title", "Данных нет")}
            </h3>
            <p className="text-blue-100 text-lg">
              {t(
                "sectionSport.noData.message",
                "В данный момент информация о спортивных секциях отсутствует"
              )}
            </p>
          </motion.div>
        )}
      </div>

      {/* Модальное окно */}
      <AnimatePresence>
        {isModalOpen && selectedSection && (
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
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                <img
                  src={selectedSection.image}
                  alt={selectedSection.name}
                  className="w-full h-80 object-cover"
                />
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-300 text-xl"
                >
                  ✕
                </button>
                <div className="absolute top-4 left-4">
                  <div
                    className={`bg-gradient-to-r ${getSportColor(
                      selectedSection.sportType
                    )} text-white px-4 py-2 rounded-2xl font-bold backdrop-blur-sm flex items-center space-x-2`}
                  >
                    <span className="text-lg">
                      {getSportIcon(selectedSection.sportType)}
                    </span>
                    <span>
                      {
                        filters.find((f) => f.id === selectedSection.sportType)
                          ?.label
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-4xl font-bold text-white mb-6">
                  {selectedSection.name}
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-2xl p-4">
                      <div className="text-emerald-300 text-sm mb-1">
                        {t("sectionSport.modal.coach", "Тренер")}
                      </div>
                      <div className="text-white font-semibold text-xl">
                        {selectedSection.coach}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4">
                      <div className="text-emerald-300 text-sm mb-1">
                        {t("sectionSport.modal.schedule", "Расписание")}
                      </div>
                      <div className="text-white font-semibold text-xl">
                        {selectedSection.schedule}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                      <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                        📞
                      </span>
                      {t(
                        "sectionSport.modal.contactInfo",
                        "Контактная информация"
                      )}
                    </h3>
                    <p className="text-blue-100 text-lg">
                      {selectedSection.contactInfo}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center">
                    <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                      📝
                    </span>
                    {t("sectionSport.modal.description", "Описание")}
                  </h3>
                  <p className="text-blue-100 text-lg leading-relaxed">
                    {selectedSection.description}
                  </p>
                </div>

                {/* Информация о тренере */}
                {selectedSection.coachInfo && (
                  <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 mb-6 border border-emerald-500/20">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                        👨‍🏫
                      </span>
                      {t(
                        "sectionSport.modal.coachInfo",
                        "Информация о тренере"
                      )}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-emerald-300 text-sm mb-1">
                          {t("sectionSport.modal.coachName", "ФИО")}
                        </div>
                        <div className="text-white font-semibold text-lg">
                          {selectedSection.coachInfo.name}
                        </div>
                      </div>
                      <div>
                        <div className="text-emerald-300 text-sm mb-1">
                          {t("sectionSport.modal.coachRank", "Звание")}
                        </div>
                        <div className="text-white font-semibold text-lg">
                          {selectedSection.coachInfo.rank}
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-emerald-300 text-sm mb-1">
                          {t("sectionSport.modal.coachContacts", "Контакты")}
                        </div>
                        <div className="text-white font-semibold text-lg">
                          {selectedSection.coachInfo.contacts}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Расписание тренировок */}
                {selectedSection.trainingSchedule &&
                  selectedSection.trainingSchedule.length > 0 && (
                    <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-6 border border-blue-500/20">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <span className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                          🕒
                        </span>
                        {t(
                          "sectionSport.modal.trainingSchedule",
                          "Расписание тренировок"
                        )}
                      </h3>
                      <div className="space-y-3">
                        {selectedSection.trainingSchedule.map(
                          (schedule, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center py-3 border-b border-white/10"
                            >
                              <span className="text-emerald-300 text-lg font-medium">
                                {schedule.day}
                              </span>
                              <span className="text-white font-semibold text-lg">
                                {schedule.time}
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

export default SectionSport;
