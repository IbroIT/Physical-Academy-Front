import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SectionSport = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiData, setApiData] = useState({
    sections: [],
    loading: false, // Изменено на false для демонстрации
    error: null,
  });
  const sectionRef = useRef(null);

  // Загрузка данных с API - отключена для демонстрации
  const fetchSectionsData = async () => {
    try {
      setApiData((prev) => ({ ...prev, loading: true, error: null }));
      const API_URL = import.meta.env.VITE_API_URL;

      // Для демонстрации сразу переходим к моковым данным
      // В реальном проекте раскомментировать:
      /*
      const response = await fetch(
        `${API_URL}/api/sport/sections/?lang=${i18n.language}`
      );
      const data = await response.json();
      if (data && Array.isArray(data)) {
        setApiData((prev) => ({ ...prev, sections: data, loading: false }));
      } else {
        setApiData((prev) => ({
          ...prev,
          error: "No data found",
          loading: false,
        }));
      }
      */
      
      // Для демонстрации сразу используем моковые данные
      setTimeout(() => {
        setApiData((prev) => ({ 
          ...prev, 
          sections: [], // Пустой массив для демонстрации нормализации
          loading: false 
        }));
      }, 500);
      
    } catch (error) {
      console.error("Error fetching sections data:", error);
      setApiData((prev) => ({ ...prev, error: error.message, loading: false }));
    }
  };

  useEffect(() => {
    fetchSectionsData();
  }, [i18n.language]);

  // Функция для нормализации данных из API - всегда возвращает демо-данные
  const normalizeSectionData = (apiSections) => {
    // Всегда возвращаем демонстрационные данные
    return [
      {
        id: 1,
        slug: "football",
        name: t("sectionSport.sections.football.name", "Футбол"),
        coach: t("sectionSport.sections.football.coach", "Иванов А.С."),
        schedule: t("sectionSport.sections.football.schedule", "Пн, Ср, Пт 18:00-20:00"),
        image: "https://images.unsplash.com/photo-1553778263-73a83babd9d1?w=400&h=300&fit=crop",
        sportType: "game",
        description: t("sectionSport.sections.football.description", "Командный вид спорта с мячом"),
        coachInfo: {
          name: t("sectionSport.sections.football.coachInfo.name", "Иванов Алексей Сергеевич"),
          rank: t("sectionSport.sections.football.coachInfo.rank", "Заслуженный тренер России"),
          contacts: t("sectionSport.sections.football.coachInfo.contacts", "+7 (999) 123-45-67"),
        },
        trainingSchedule: [
          { day: t("sectionSport.days.monday", "Понедельник"), time: "18:00-20:00" },
          { day: t("sectionSport.days.wednesday", "Среда"), time: "18:00-20:00" },
          { day: t("sectionSport.days.friday", "Пятница"), time: "18:00-20:00" },
        ],
        contactInfo: t("sectionSport.sections.football.contactInfo", "Запись через спорткомплекс"),
      },
      {
        id: 2,
        slug: "wrestling",
        name: t("sectionSport.sections.wrestling.name", "Борьба"),
        coach: t("sectionSport.sections.wrestling.coach", "Петров В.К."),
        schedule: t("sectionSport.sections.wrestling.schedule", "Вт, Чт 17:00-19:00"),
        image: "https://images.unsplash.com/photo-1598366833298-79e96e42f6c9?w=400&h=300&fit=crop",
        sportType: "combat",
        description: t("sectionSport.sections.wrestling.description", "Единоборство с богатой историей"),
        coachInfo: {
          name: t("sectionSport.sections.wrestling.coachInfo.name", "Петров Владимир Константинович"),
          rank: t("sectionSport.sections.wrestling.coachInfo.rank", "Мастер спорта международного класса"),
          contacts: t("sectionSport.sections.wrestling.coachInfo.contacts", "+7 (999) 765-43-21"),
        },
        trainingSchedule: [
          { day: t("sectionSport.days.tuesday", "Вторник"), time: "17:00-19:00" },
          { day: t("sectionSport.days.thursday", "Четверг"), time: "17:00-19:00" },
        ],
        contactInfo: t("sectionSport.sections.wrestling.contactInfo", "Запись у тренера"),
      },
      {
        id: 3,
        slug: "swimming",
        name: t("sectionSport.sections.swimming.name", "Плавание"),
        coach: t("sectionSport.sections.swimming.coach", "Сидорова М.И."),
        schedule: t("sectionSport.sections.swimming.schedule", "Пн-Пт 07:00-09:00, 19:00-21:00"),
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
        sportType: "water",
        description: t("sectionSport.sections.swimming.description", "Водный вид спорта для всех возрастов"),
        coachInfo: {
          name: t("sectionSport.sections.swimming.coachInfo.name", "Сидорова Мария Ивановна"),
          rank: t("sectionSport.sections.swimming.coachInfo.rank", "Кандидат в мастера спорта"),
          contacts: t("sectionSport.sections.swimming.coachInfo.contacts", "+7 (999) 555-44-33"),
        },
        trainingSchedule: [
          { day: t("sectionSport.days.monday", "Понедельник"), time: "07:00-09:00, 19:00-21:00" },
          { day: t("sectionSport.days.tuesday", "Вторник"), time: "07:00-09:00, 19:00-21:00" },
          { day: t("sectionSport.days.wednesday", "Среда"), time: "07:00-09:00, 19:00-21:00" },
          { day: t("sectionSport.days.thursday", "Четверг"), time: "07:00-09:00, 19:00-21:00" },
          { day: t("sectionSport.days.friday", "Пятница"), time: "07:00-09:00, 19:00-21:00" },
        ],
        contactInfo: t("sectionSport.sections.swimming.contactInfo", "Бассейн, 2 этаж"),
      },
      {
        id: 4,
        slug: "basketball",
        name: t("sectionSport.sections.basketball.name", "Баскетбол"),
        coach: t("sectionSport.sections.basketball.coach", "Кузнецов С.П."),
        schedule: t("sectionSport.sections.basketball.schedule", "Пн, Ср, Пт 19:00-21:00"),
        image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop",
        sportType: "game",
        description: t("sectionSport.sections.basketball.description", "Динамичная командная игра с мячом"),
        coachInfo: {
          name: t("sectionSport.sections.basketball.coachInfo.name", "Кузнецов Сергей Петрович"),
          rank: t("sectionSport.sections.basketball.coachInfo.rank", "Мастер спорта"),
          contacts: t("sectionSport.sections.basketball.coachInfo.contacts", "+7 (999) 888-77-66"),
        },
        trainingSchedule: [
          { day: t("sectionSport.days.monday", "Понедельник"), time: "19:00-21:00" },
          { day: t("sectionSport.days.wednesday", "Среда"), time: "19:00-21:00" },
          { day: t("sectionSport.days.friday", "Пятница"), time: "19:00-21:00" },
        ],
        contactInfo: t("sectionSport.sections.basketball.contactInfo", "Спортивный зал №1"),
      },
      {
        id: 5,
        slug: "athletics",
        name: t("sectionSport.sections.athletics.name", "Легкая атлетика"),
        coach: t("sectionSport.sections.athletics.coach", "Орлова Е.В."),
        schedule: t("sectionSport.sections.athletics.schedule", "Вт, Чт, Сб 08:00-10:00"),
        image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop",
        sportType: "athletics",
        description: t("sectionSport.sections.athletics.description", "Королева спорта - бег, прыжки, метания"),
        coachInfo: {
          name: t("sectionSport.sections.athletics.coachInfo.name", "Орлова Елена Викторовна"),
          rank: t("sectionSport.sections.athletics.coachInfo.rank", "Заслуженный тренер"),
          contacts: t("sectionSport.sections.athletics.coachInfo.contacts", "+7 (999) 444-33-22"),
        },
        trainingSchedule: [
          { day: t("sectionSport.days.tuesday", "Вторник"), time: "08:00-10:00" },
          { day: t("sectionSport.days.thursday", "Четверг"), time: "08:00-10:00" },
          { day: t("sectionSport.days.saturday", "Суббота"), time: "08:00-10:00" },
        ],
        contactInfo: t("sectionSport.sections.athletics.contactInfo", "Стадион академии"),
      },
      {
        id: 6,
        slug: "skiing",
        name: t("sectionSport.sections.skiing.name", "Лыжные гонки"),
        coach: t("sectionSport.sections.skiing.coach", "Волков Д.Н."),
        schedule: t("sectionSport.sections.skiing.schedule", "Ср, Пт, Вс 10:00-12:00 (зимой)"),
        image: "https://images.unsplash.com/photo-1517639493569-0696e9d90a81?w=400&h=300&fit=crop",
        sportType: "winter",
        description: t("sectionSport.sections.skiing.description", "Зимний вид спорта на выносливость"),
        coachInfo: {
          name: t("sectionSport.sections.skiing.coachInfo.name", "Волков Дмитрий Николаевич"),
          rank: t("sectionSport.sections.skiing.coachInfo.rank", "Мастер спорта международного класса"),
          contacts: t("sectionSport.sections.skiing.coachInfo.contacts", "+7 (999) 111-22-33"),
        },
        trainingSchedule: [
          { day: t("sectionSport.days.wednesday", "Среда"), time: "10:00-12:00" },
          { day: t("sectionSport.days.friday", "Пятница"), time: "10:00-12:00" },
          { day: t("sectionSport.days.sunday", "Воскресенье"), time: "10:00-12:00" },
        ],
        contactInfo: t("sectionSport.sections.skiing.contactInfo", "Лыжная база академии"),
      }
    ];
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
    const matchesFilter = activeFilter === "all" || section.sportType === activeFilter;
    const matchesSearch = section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const filters = [
    { id: "all", label: t("sectionSport.filters.all", "Все"), icon: "🎯" },
    { id: "game", label: t("sectionSport.filters.game", "Игровые"), icon: "⚽" },
    { id: "combat", label: t("sectionSport.filters.combat", "Единоборства"), icon: "🥋" },
    { id: "winter", label: t("sectionSport.filters.winter", "Зимние"), icon: "⛷️" },
    { id: "water", label: t("sectionSport.filters.water", "Водные"), icon: "🏊" },
    { id: "athletics", label: t("sectionSport.filters.athletics", "Легкая атлетика"), icon: "🏃" },
  ];

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

  const handleCardClick = (sectionSlug) => {
    navigate(`/sport/sections/${sectionSlug}`);
  };

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
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">⚽</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🥋</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🏊</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl opacity-5">🏃</div>
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
            {t("sectionSport.subtitle", "Академия предоставляет широкие возможности для занятий спортом. Каждый студент может выбрать секцию по интересам — от лёгкой атлетики до борьбы.")}
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
                placeholder={t("sectionSport.search.placeholder", "Поиск по названию или тренеру...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-blue-200 focus:outline-none focus:border-emerald-400 transition-all duration-300 text-lg backdrop-blur-sm"
              />
              <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
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
                      ? `bg-gradient-to-r ${getSportColor(filter.id)} text-white shadow-2xl scale-105`
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

        {/* Демо-сообщение */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-400/30 rounded-2xl p-6 mb-8 text-center"
        >
          <div className="flex items-center justify-center space-x-3 text-blue-200">
            <span className="text-2xl">💡</span>
            <p className="text-lg">
              {t("sectionSport.demoMessage", "Демонстрация работы фильтров и поиска")}
            </p>
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
                onClick={() => handleCardClick(section.slug)}
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
                    <div className={`bg-gradient-to-r ${getSportColor(section.sportType)} text-white px-4 py-2 rounded-2xl font-bold text-sm backdrop-blur-sm flex items-center space-x-2`}>
                      <span className="text-lg">{getSportIcon(section.sportType)}</span>
                      <span>{filters.find(f => f.id === section.sportType)?.label}</span>
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="mt-6"
                  >
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
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-4">
              {t("sectionSport.noResults.title", "Секции не найдены")}
            </h3>
            <p className="text-blue-100 text-lg">
              {t("sectionSport.noResults.message", "Попробуйте изменить параметры поиска или фильтрации")}
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default SectionSport;