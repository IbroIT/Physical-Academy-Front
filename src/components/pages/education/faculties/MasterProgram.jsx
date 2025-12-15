// MasterProgram.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const MasterProgram = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("master");
  const [isVisible, setIsVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    programs: [],
    loading: false,
    error: null,
  });

  const sectionRef = useRef(null);

  // Демо-данные для карточек вкладок
  const demoPrograms = {
    master: [
      {
        id: 1,
        title: "МАГИСТРАТУРА",
        subtitle: "Мероприятие",
        description: "Магистрация с углубленным изучением современных методик преподавания физической культуры",
        features: ["Тип карточка ведущий специалист", "Практические занятия", "Индивидуальный подход", "Современные методики"],
        price: "90000.00",
        currency: "сом/год",
        icon: "🎓",
        color: "from-blue-500 to-blue-600",
        specialist: {
          name: "Иванов Иван Иванович",
          position: "Профессор, доктор педагогических наук",
          avatar: "👨‍🏫",
          info: "Эксперт в области физического воспитания, автор 50+ научных работ"
        }
      },
      {
        id: 2,
        title: "СПОРТИВНЫЙ МЕНЕДЖМЕНТ",
        subtitle: "Управление в спорте",
        description: "Подготовка менеджеров для спортивных организаций и федераций",
        features: ["Управление проектами", "Маркетинг в спорте", "Финансовый менеджмент", "Event-менеджмент"],
        price: "95000.00",
        currency: "сом/год",
        icon: "🤝",
        color: "from-green-500 to-green-600",
        specialist: {
          name: "Петрова Мария Сергеевна",
          position: "Кандидат экономических наук",
          avatar: "👩‍💼",
          info: "Более 15 лет опыта в спортивном менеджменте"
        }
      }
    ],
    base: [
      {
        id: 3,
        title: "МАТЕРИАЛЬНО ТЕХНИЧЕСКАЯ БАЗА",
        subtitle: "Инфраструктура обучения",
        description: "Тома неизвестно что мулет элеон. Современное оборудование и лаборатории для практической подготовки",
        features: ["Современные лаборатории", "Спортивные залы", "Мультимедийные классы", "Библиотека с электронными ресурсами"],
        price: "-",
        currency: "",
        icon: "🏢",
        color: "from-purple-500 to-purple-600"
      }
    ],
    aspirant: [
      {
        id: 4,
        title: "АСПИРАНТУРА",
        subtitle: "Научно-исследовательская работа",
        description: "Подготовка научных кадров высшей квалификации в области физической культуры и спорта",
        features: ["Научные исследования", "Публикации в рецензируемых журналах", "Участие в конференциях", "Подготовка диссертации"],
        price: "85000.00",
        currency: "сом/год",
        icon: "📚",
        color: "from-orange-500 to-orange-600",
        specialist: {
          name: "Сидоров Алексей Петрович",
          position: "Доктор биологических наук",
          avatar: "👨‍🔬",
          info: "Руководитель 10+ научных проектов, член диссертационного совета"
        }
      }
    ],
    unknown: [
      {
        id: 5,
        title: "ЕЩЕ НЕ ИЗВЕСТНО",
        subtitle: "Новые направления",
        description: "Разработка новых образовательных программ в сфере физической культуры и спорта",
        features: ["Инновационные методики", "Междисциплинарный подход", "Международное сотрудничество", "Цифровизация образования"],
        price: "уточняется",
        currency: "",
        icon: "❓",
        color: "from-gray-500 to-gray-600"
      }
    ]
  };

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
        `${API_URL}/api/education/master-programs/?lang=${lang}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid content type");
      }

      const data = await response.json();

      setBackendData({
        programs: data.results || [],
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching master programs:", error);
      setBackendData({
        programs: [],
        loading: false,
        error: "Failed to load programs data",
      });
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

  // Преобразование данных с бэкенда в формат компонента
  const getFormattedPrograms = useCallback(() => {
    if (!backendData.programs || backendData.programs.length === 0) {
      // Если данных нет, возвращаем демо-данные для активной вкладки
      return demoPrograms[activeTab] || [];
    }
    
    // Если есть данные с API, форматируем их по вкладкам
    const apiPrograms = backendData.programs.map((program, index) => ({
      id: program.id || index,
      title: program.name,
      subtitle: program.subtitle || "",
      duration: `${program.duration_years} ${t("master.years")}`,
      format: program.offline ? t("master.offline") : t("master.online"),
      description: program.description,
      features: Array.isArray(program.features)
        ? program.features
        : typeof program.features === "string"
        ? program.features.split(",").map((f) => f.trim())
        : [],
      price: program.tuition_fee || "0",
      currency: t("master.currency"),
      perYear: t("master.perYear"),
      icon: program.emoji || "🎓",
      color: getProgramColor(index),
      specialist: program.specialist || null,
      isDemo: false,
    }));

    // Группируем по типам программ (заглушка, в реальном API должен быть тип)
    const masterPrograms = apiPrograms.filter(p => p.title.toLowerCase().includes("магистр"));
    const aspirantPrograms = apiPrograms.filter(p => p.title.toLowerCase().includes("аспирант"));
    
    return {
      master: masterPrograms,
      aspirant: aspirantPrograms,
      base: demoPrograms.base,
      unknown: demoPrograms.unknown
    }[activeTab] || [];
  }, [backendData.programs, t, activeTab]);

  const getProgramColor = (index) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-orange-500 to-orange-600",
      "from-blue-500 to-green-500",
      "from-green-500 to-blue-500",
    ];
    return colors[index % colors.length];
  };

  const formattedPrograms = getFormattedPrograms();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedProgram(null);
  };

  const handleLearnMore = (program) => {
    setSelectedProgram(program);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProgram(null);
  };

  // Компонент загрузки
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      {/* Заголовок скелетон */}
      <div className="text-center mb-12">
        <div className="bg-white/10 rounded-2xl h-12 w-3/4 mx-auto mb-4"></div>
        <div className="bg-white/10 rounded-2xl h-4 w-1/2 mx-auto mb-3"></div>
        <div className="bg-white/10 rounded-2xl h-4 w-2/3 mx-auto"></div>
      </div>

      {/* Программы скелетон */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2].map((item) => (
          <div key={item} className="bg-white/10 rounded-2xl p-8">
            <div className="bg-white/10 rounded-2xl w-20 h-20 mx-auto mb-6"></div>
            <div className="bg-white/10 rounded-2xl h-8 w-3/4 mx-auto mb-4"></div>
            <div className="bg-white/10 rounded-2xl h-4 w-full mb-3"></div>
            <div className="bg-white/10 rounded-2xl h-4 w-2/3"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Компонент ошибки
  const ErrorMessage = ({ onRetry }) => (
    <div className="text-center py-12">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl text-white mb-4">{t("master.errorTitle")}</h2>
      <p className="text-blue-200 mb-6">{backendData.error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t("master.retry")}
      </button>
    </div>
  );

  const tabs = [
    { id: "master", label: t("master.tabs.master") },
    { id: "base", label: t("master.tabs.base") },
    { id: "aspirant", label: t("master.tabs.aspirant") },
    { id: "unknown", label: t("master.tabs.unknown") }
  ];

  if (backendData.error && backendData.programs.length === 0) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <ErrorMessage onRetry={fetchBackendData} />
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        ref={sectionRef}
        className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden"
      >
        {/* Анимированный фон */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Заголовок */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
              {t("master.title")}
            </h1>
            <div className="w-20 h-1 bg-green-400 mx-auto mb-3 md:mb-4"></div>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4">
              {t("master.subtitle")}
            </p>
          </motion.div>

          {/* Навигация вкладок */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-12 lg:mb-16"
          >
            <div className="bg-white/5 rounded-2xl p-2 backdrop-blur-lg border border-white/20 shadow-2xl w-full max-w-4xl">
              <div className="flex flex-col sm:flex-row gap-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-3 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-500 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                        : 'text-blue-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{tab.icon}</span>
                    <span className="text-sm sm:text-base">{tab.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {backendData.loading && backendData.programs.length === 0 ? (
            <LoadingSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 gap-8 md:gap-10 max-w-6xl mx-auto"
            >
              {formattedPrograms.length > 0 ? (
                formattedPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer"
                    onClick={() => handleLearnMore(program)}
                  >
                    <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                      {/* Левая часть - текст */}
                      <div className="flex-1">
                        {/* Индикатор демо-данных */}
                        {program.isDemo && (
                          <div className="inline-block mb-4">
                            <span className="bg-yellow-500/20 text-yellow-300 text-xs px-3 py-1 rounded-full">
                              Демо
                            </span>
                          </div>
                        )}

                        {/* Иконка программы (для мобильных) */}
                        <div className="lg:hidden flex justify-center mb-6">
                          <div
                            className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${program.color} flex items-center justify-center text-3xl shadow-lg`}
                          >
                            {program.icon}
                          </div>
                        </div>

                        {/* Заголовок */}
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                          {program.title}
                        </h3>

                        {/* Подзаголовок */}
                        {program.subtitle && (
                          <p className="text-green-300 text-lg font-medium mb-4">
                            {program.subtitle}
                          </p>
                        )}

                        {/* Длительность и формат */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {program.duration && (
                            <span className="text-green-300 text-sm font-semibold bg-green-500/20 px-3 py-1 rounded-lg">
                              {program.duration}
                            </span>
                          )}
                          {program.format && (
                            <span className="text-blue-300 text-sm bg-blue-500/20 px-3 py-1 rounded-lg">
                              {program.format}
                            </span>
                          )}
                        </div>

                        {/* Описание */}
                        <p className="text-blue-100 text-lg leading-relaxed mb-6">
                          {program.description}
                        </p>

                        {/* Особенности (первые 2) */}
                        <div className="space-y-3 mb-6">
                          {program.features.slice(0, 2).map((feature, idx) => (
                            <div key={idx} className="flex items-center">
                              <div className="w-5 h-5 bg-green-400/20 rounded-full flex items-center justify-center mr-3">
                                <span className="text-green-300 text-xs">✓</span>
                              </div>
                              <span className="text-white">{feature}</span>
                            </div>
                          ))}
                          {program.features.length > 2 && (
                            <div className="pl-8">
                              <span className="text-blue-300 text-sm">
                                +{program.features.length - 2} {t("master.moreFeatures")}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Цена (если есть) */}
                        {program.price !== "-" && program.price !== "уточняется" && (
                          <div className="mt-6 p-4 bg-white/5 rounded-2xl">
                            <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                              {program.price}
                              {program.currency && <span className="text-lg ml-2">{program.currency}</span>}
                            </div>
                            {program.perYear && (
                              <div className="text-blue-200 text-sm">
                                {program.perYear}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Правая часть - для вкладок с специалистами */}
                      {(activeTab === "master" || activeTab === "aspirant") && program.specialist ? (
                        <div className="lg:w-1/3">
                          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            {/* Аватарка ведущего специалиста */}
                            <div className="flex flex-col items-center mb-4">
                              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl mb-4 shadow-lg">
                                {program.specialist.avatar}
                              </div>
                              <h4 className="text-xl font-bold text-white text-center">
                                {program.specialist.name}
                              </h4>
                              <p className="text-green-300 text-center text-sm mt-1">
                                {program.specialist.position}
                              </p>
                            </div>

                            {/* Краткая информация */}
                            <div className="bg-white/5 rounded-xl p-4">
                              <p className="text-blue-100 text-sm leading-relaxed">
                                {program.specialist.info}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Для остальных вкладок - просто иконка */
                        <div className="lg:w-1/3 flex items-center justify-center">
                          <div
                            className={`w-32 h-32 rounded-3xl bg-gradient-to-r ${program.color} flex items-center justify-center text-5xl shadow-lg`}
                          >
                            {program.icon}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Кнопка */}
                    <div className="mt-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLearnMore(program);
                        }}
                        className={`w-full bg-gradient-to-r ${program.color} hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg`}
                      >
                        {t("master.learnMore")}
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-2xl text-white mb-2">
                    {t("master.noPrograms")}
                  </h3>
                  <p className="text-blue-200">
                    {t("master.noProgramsDescription")}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Уведомление о демо-данных */}
          {formattedPrograms.some(p => p.isDemo) && !backendData.loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 text-center"
            >
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                <span className="text-yellow-300 mr-2">ℹ️</span>
                <p className="text-blue-100">
                  {backendData.error 
                    ? t("master.usingDemoData") 
                    : t("master.loadingData")}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Модальное окно */}
      <AnimatePresence>
        {showModal && selectedProgram && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-blue-900 to-green-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8">
                {/* Заголовок */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${selectedProgram.color} flex items-center justify-center text-3xl mr-6`}
                    >
                      {selectedProgram.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {selectedProgram.title}
                      </h2>
                      {selectedProgram.subtitle && (
                        <p className="text-green-300 font-medium mb-2">
                          {selectedProgram.subtitle}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {selectedProgram.duration && (
                          <span className="text-green-300 font-semibold bg-green-500/20 px-3 py-1 rounded-lg">
                            {selectedProgram.duration}
                          </span>
                        )}
                        {selectedProgram.format && (
                          <span className="text-blue-300 bg-blue-500/20 px-3 py-1 rounded-lg">
                            {selectedProgram.format}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Индикатор демо-данных в модальном окне */}
                {selectedProgram.isDemo && (
                  <div className="mb-6 p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <div className="flex items-center justify-center">
                      <span className="text-yellow-300 mr-2">⚠️</span>
                      <span className="text-yellow-200 text-sm">
                        {t("master.demoModalWarning")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Цена */}
                {selectedProgram.price !== "-" && selectedProgram.price !== "уточняется" && (
                  <div className="text-center mb-6 p-4 bg-white/5 rounded-2xl">
                    <div className="text-5xl font-bold text-white mb-1">
                      {selectedProgram.price}
                      {selectedProgram.currency && <span className="text-lg ml-2">{selectedProgram.currency}</span>}
                    </div>
                    {selectedProgram.perYear && (
                      <div className="text-blue-200">
                        {selectedProgram.perYear}
                      </div>
                    )}
                  </div>
                )}

                {/* Контент */}
                <div className="space-y-6">
                  {/* Ведущий специалист */}
                  {(activeTab === "master" || activeTab === "aspirant") && selectedProgram.specialist && (
                    <div className="bg-white/5 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <span className="text-2xl mr-2">👨‍🏫</span>
                        {t("master.leadingSpecialist")}
                      </h3>
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-4xl">
                            {selectedProgram.specialist.avatar}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-white mb-2">
                            {selectedProgram.specialist.name}
                          </h4>
                          <p className="text-green-300 mb-3">
                            {selectedProgram.specialist.position}
                          </p>
                          <p className="text-blue-100">
                            {selectedProgram.specialist.info}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {t("master.description")}
                    </h3>
                    <p className="text-blue-100 text-lg leading-relaxed">
                      {selectedProgram.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {t("master.programFeatures")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedProgram.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-white/5 rounded-xl p-3"
                        >
                          <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center mr-3">
                            <span className="text-green-300 text-sm">✓</span>
                          </div>
                          <span className="text-white">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Дополнительная информация */}
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-blue-200 text-sm mb-1">
                        {t("master.startDate")}
                      </div>
                      <div className="text-white font-semibold">
                        {t("master.september")}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-200 text-sm mb-1">
                        {t("master.places")}
                      </div>
                      <div className="text-green-300 font-semibold">25</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MasterProgram;