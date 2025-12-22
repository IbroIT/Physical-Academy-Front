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
        title: t("master.programs.master1.title"),
        subtitle: t("master.programs.master1.subtitle"),
        description: t("master.programs.master1.description"),
        features: [
          t("master.programs.master1.features.0"),
          t("master.programs.master1.features.1"),
          t("master.programs.master1.features.2"),
          t("master.programs.master1.features.3"),
          t("master.programs.master1.features.4"),
          t("master.programs.master1.features.5")
        ],
        duration: t("master.duration2Years"),
        format: t("master.fullTime"),
        price: "90000.00",
        currency: t("master.currency"),
        icon: "🎓",
        color: "from-blue-500 to-blue-600",
        facultyInfo: {
          name: t("master.programs.master1.faculty.name"),
          description: t("master.programs.master1.faculty.description"),
          achievements: [
            t("master.programs.master1.faculty.achievements.0"),
            t("master.programs.master1.faculty.achievements.1"),
            t("master.programs.master1.faculty.achievements.2"),
            t("master.programs.master1.faculty.achievements.3")
          ],
          director: {
            name: t("master.programs.master1.faculty.director.name"),
            position: t("master.programs.master1.faculty.director.position"),
            avatar: "👨‍🏫"
          }
        },
        cards: [
          {
            id: 101,
            title: t("master.programs.master1.cards.0.title"),
            description: t("master.programs.master1.cards.0.description"),
            duration: t("master.duration2Years"),
            price: "85000.00",
            icon: "🏃‍♂️"
          },
          {
            id: 102,
            title: t("master.programs.master1.cards.1.title"),
            description: t("master.programs.master1.cards.1.description"),
            duration: t("master.duration2Years"),
            price: "95000.00",
            icon: "🤝"
          }
        ]
      },
      {
        id: 2,
        title: t("master.programs.master2.title"),
        subtitle: t("master.programs.master2.subtitle"),
        description: t("master.programs.master2.description"),
        features: [
          t("master.programs.master2.features.0"),
          t("master.programs.master2.features.1"),
          t("master.programs.master2.features.2"),
          t("master.programs.master2.features.3"),
          t("master.programs.master2.features.4")
        ],
        duration: t("master.duration2Years"),
        format: t("master.partTime"),
        price: "85000.00",
        currency: t("master.currency"),
        icon: "🔬",
        color: "from-indigo-500 to-purple-600",
        facultyInfo: {
          name: t("master.programs.master2.faculty.name"),
          description: t("master.programs.master2.faculty.description"),
          achievements: [
            t("master.programs.master2.faculty.achievements.0"),
            t("master.programs.master2.faculty.achievements.1"),
            t("master.programs.master2.faculty.achievements.2"),
            t("master.programs.master2.faculty.achievements.3")
          ],
          director: {
            name: t("master.programs.master2.faculty.director.name"),
            position: t("master.programs.master2.faculty.director.position"),
            avatar: "👩‍🔬"
          }
        },
        cards: [
          {
            id: 201,
            title: t("master.programs.master2.cards.0.title"),
            description: t("master.programs.master2.cards.0.description"),
            duration: t("master.duration2Years"),
            price: "88000.00",
            icon: "📊"
          },
          {
            id: 202,
            title: t("master.programs.master2.cards.1.title"),
            description: t("master.programs.master2.cards.1.description"),
            duration: t("master.duration2Years"),
            price: "87000.00",
            icon: "❤️"
          }
        ]
      }
    ],
    aspirant: [
      {
        id: 3,
        title: t("master.programs.aspirant1.title"),
        subtitle: t("master.programs.aspirant1.subtitle"),
        description: t("master.programs.aspirant1.description"),
        features: [
          t("master.programs.aspirant1.features.0"),
          t("master.programs.aspirant1.features.1"),
          t("master.programs.aspirant1.features.2"),
          t("master.programs.aspirant1.features.3"),
          t("master.programs.aspirant1.features.4")
        ],
        duration: t("master.duration3Years"),
        format: t("master.fullTime"),
        price: "75000.00",
        currency: t("master.currency"),
        icon: "📚",
        color: "from-orange-500 to-red-600",
        facultyInfo: {
          name: t("master.programs.aspirant1.faculty.name"),
          description: t("master.programs.aspirant1.faculty.description"),
          achievements: [
            t("master.programs.aspirant1.faculty.achievements.0"),
            t("master.programs.aspirant1.faculty.achievements.1"),
            t("master.programs.aspirant1.faculty.achievements.2"),
            t("master.programs.aspirant1.faculty.achievements.3")
          ],
          director: {
            name: t("master.programs.aspirant1.faculty.director.name"),
            position: t("master.programs.aspirant1.faculty.director.position"),
            avatar: "👨‍🎓"
          }
        },
        cards: [
          {
            id: 301,
            title: t("master.programs.aspirant1.cards.0.title"),
            description: t("master.programs.aspirant1.cards.0.description"),
            duration: t("master.duration3Years"),
            price: "72000.00",
            icon: "🎯"
          },
          {
            id: 302,
            title: t("master.programs.aspirant1.cards.1.title"),
            description: t("master.programs.aspirant1.cards.1.description"),
            duration: t("master.duration3Years"),
            price: "78000.00",
            icon: "🧠"
          }
        ]
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
    // ЗАКОММЕНТИРУЕМ ДЛЯ ПРОСМОТРА ДЕМО-ДАННЫХ
    // if (!backendData.programs || backendData.programs.length === 0) {
      // Если данных нет, возвращаем демо-данные для активной вкладки
      return demoPrograms[activeTab] || [];
    // }
    
    // // Если есть данные с API, форматируем их по вкладкам
    // const apiPrograms = backendData.programs.map((program, index) => ({
    //   id: program.id || index,
    //   title: program.name,
    //   subtitle: program.subtitle || "",
    //   duration: `${program.duration_years} ${t("master.years")}`,
    //   format: program.offline ? t("master.offline") : t("master.online"),
    //   description: program.description,
    //   features: Array.isArray(program.features)
    //     ? program.features
    //     : typeof program.features === "string"
    //     ? program.features.split(",").map((f) => f.trim())
    //     : [],
    //   price: program.tuition_fee || "0",
    //   currency: t("master.currency"),
    //   perYear: t("master.perYear"),
    //   icon: program.emoji || "🎓",
    //   color: getProgramColor(index),
    //   facultyInfo: program.facultyInfo || null,
    //   cards: program.cards || [],
    //   isDemo: false,
    // }));

    // // Группируем по типам программ
    // const masterPrograms = apiPrograms.filter(p => p.title.toLowerCase().includes("магистр"));
    // const aspirantPrograms = apiPrograms.filter(p => p.title.toLowerCase().includes("аспирант"));
    
    // return {
    //   master: masterPrograms,
    //   aspirant: aspirantPrograms,
    // }[activeTab] || [];
  }, [backendData.programs, t, activeTab]);

  const getProgramColor = (index) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-indigo-500 to-purple-600",
      "from-orange-500 to-red-600",
      "from-green-500 to-emerald-600",
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
      <div className="grid grid-cols-1 gap-8">
        {[1].map((item) => (
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
    { id: "master", label: t("master.tabs.master"), icon: "🎓" },
    { id: "aspirant", label: t("master.tabs.aspirant"), icon: "📚" }
  ];

  // ЗАКОММЕНТИРУЕМ ДЛЯ ПРОСМОТРА ДЕМО-ДАННЫХ
  // if (backendData.error && backendData.programs.length === 0) {
  //   return (
  //     <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden">
  //       <div className="container mx-auto px-4">
  //         <ErrorMessage onRetry={fetchBackendData} />
  //       </div>
  //     </section>
  //   );
  // }

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

          {/* Два столбца - Магистратура и Аспирантура */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
              {/* Магистратура (Master) */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-6"
              >
                {/* Заголовок колонки */}
                <div className="text-center mb-8">
                  <div className="inline-block mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg mx-auto">
                      🎓
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {t("master.tabs.master")}
                  </h2>
                  <div className="h-1 w-12 bg-green-400 mx-auto"></div>
                </div>

                {/* Информация о магистратуре */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-orange-400/30">
                  <h3 className="text-white font-bold text-lg mb-4 text-center">
                    {t("master.aboutProgram")}
                  </h3>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-2 bg-orange-400/20 rounded-full"></div>
                    ))}
                  </div>
                </div>

                {/* Карточки без резюме */}
                <div className="space-y-4">
                  {demoPrograms.master.map((program, idx) => (
                    <motion.div
                      key={program.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-orange-400/30 cursor-pointer hover:border-orange-400/50 transition-all"
                      onClick={() => handleLearnMore(program)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${program.color} flex items-center justify-center text-2xl`}>
                            {program.icon}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-white font-bold text-base md:text-lg mb-1">
                            {program.title}
                          </h4>
                          <p className="text-blue-200 text-sm mb-3">
                            {program.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-green-300 text-xs font-semibold bg-green-500/20 px-2 py-1 rounded">
                              {program.duration}
                            </span>
                            <span className="text-blue-300 text-xs bg-blue-500/20 px-2 py-1 rounded">
                              {program.price} {program.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Аспирантура (Aspirant) */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="space-y-6"
              >
                {/* Заголовок колонки */}
                <div className="text-center mb-8">
                  <div className="inline-block mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg mx-auto">
                      📚
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {t("master.tabs.aspirant")}
                  </h2>
                  <div className="h-1 w-12 bg-green-400 mx-auto"></div>
                </div>

                {/* Информация об аспирантуре */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-orange-400/30">
                  <h3 className="text-white font-bold text-lg mb-4 text-center">
                    {t("master.aboutProgram")}
                  </h3>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-2 bg-orange-400/20 rounded-full"></div>
                    ))}
                  </div>
                </div>

                {/* Карточки без резюме */}
                <div className="space-y-4">
                  {demoPrograms.aspirant.map((program) => (
                    <motion.div
                      key={program.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-orange-400/30 cursor-pointer hover:border-orange-400/50 transition-all"
                      onClick={() => handleLearnMore(program)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${program.color} flex items-center justify-center text-2xl`}>
                            {program.icon}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-white font-bold text-base md:text-lg mb-1">
                            {program.title}
                          </h4>
                          <p className="text-blue-200 text-sm mb-3">
                            {program.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <span className="text-green-300 text-xs font-semibold bg-green-500/20 px-2 py-1 rounded">
                              {program.duration}
                            </span>
                            <span className="text-blue-300 text-xs bg-blue-500/20 px-2 py-1 rounded">
                              {program.price} {program.currency}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Уведомление о демо-данных */}
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
                  : t("master.demoDataWarning")}
              </p>
            </div>
          </motion.div>
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
              className="bg-gradient-to-br from-blue-900 to-green-900 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8">
                {/* Заголовок */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center">
                    <div
                      className={`w-24 h-24 rounded-2xl bg-gradient-to-r ${selectedProgram.color} flex items-center justify-center text-4xl mr-6`}
                    >
                      {selectedProgram.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {selectedProgram.title}
                      </h2>
                      {selectedProgram.subtitle && (
                        <p className="text-green-300 font-medium text-xl mb-2">
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
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
                  >
                    ×
                  </button>
                </div>

                {/* Индикатор демо-данных в модальном окне */}
                {/* {selectedProgram.isDemo && ( */}
                  <div className="mb-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <div className="flex items-center">
                      <span className="text-yellow-300 text-2xl mr-3">⚠️</span>
                      <div>
                        <h4 className="text-yellow-200 font-bold mb-1">{t("master.demoData")}</h4>
                        <p className="text-yellow-200/80 text-sm">
                          {t("master.demoModalWarning")}
                        </p>
                      </div>
                    </div>
                  </div>
                {/* )} */}

                {/* Цена */}
                <div className="text-center mb-8 p-6 bg-white/5 rounded-2xl">
                  <div className="text-5xl font-bold text-white mb-2">
                    {selectedProgram.price}
                    {selectedProgram.currency && <span className="text-xl ml-2">{selectedProgram.currency}</span>}
                  </div>
                  <div className="text-blue-200 text-lg">
                    {t("master.perYear")}
                  </div>
                </div>

                {/* Контент */}
                <div className="space-y-8">
                  {/* Информация о факультете */}
                  {selectedProgram.facultyInfo && (
                    <div className="bg-white/5 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                        <span className="text-3xl mr-3">🏛️</span>
                        {t("master.aboutFaculty")}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-xl font-bold text-white mb-3">
                            {selectedProgram.facultyInfo.name}
                          </h4>
                          <p className="text-blue-100 leading-relaxed">
                            {selectedProgram.facultyInfo.description}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-white mb-3">{t("master.achievements")}</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {selectedProgram.facultyInfo.achievements?.map((achievement, idx) => (
                              <div
                                key={idx}
                                className="bg-white/5 rounded-xl p-4 text-center"
                              >
                                <span className="text-green-300 font-medium">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      {selectedProgram.facultyInfo.director && (
                        <div className="mt-6 pt-6 border-t border-white/10">
                          <div className="flex items-center">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl mr-6">
                              {selectedProgram.facultyInfo.director.avatar}
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-white">
                                {selectedProgram.facultyInfo.director.name}
                              </h4>
                              <p className="text-green-300 text-lg mb-2">
                                {selectedProgram.facultyInfo.director.position}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Направления подготовки */}
                  {selectedProgram.cards && selectedProgram.cards.length > 0 && (
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-6">
                        {t("master.specializations")}
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        {selectedProgram.cards.map((card) => (
                          <div
                            key={card.id}
                            className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all duration-300"
                          >
                            <div className="flex items-center mb-4">
                              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 flex items-center justify-center text-3xl mr-4">
                                {card.icon}
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-white mb-1">
                                  {card.title}
                                </h4>
                                <p className="text-blue-200">
                                  {card.duration}
                                </p>
                              </div>
                            </div>
                            <p className="text-blue-100 mb-6">
                              {card.description}
                            </p>
                            <div className="text-center p-4 bg-white/5 rounded-xl">
                              <div className="text-2xl font-bold text-white mb-1">
                                {card.price} {t("master.currency")}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Особенности программы */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">
                      {t("master.programFeatures")}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedProgram.features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center bg-white/5 rounded-xl p-4"
                        >
                          <div className="w-8 h-8 bg-green-400/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <span className="text-green-300">✓</span>
                          </div>
                          <span className="text-white text-lg">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Дополнительная информация */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <div className="text-blue-200 text-sm mb-2">
                        {t("master.startDate")}
                      </div>
                      <div className="text-white font-bold text-lg">
                        {t("master.september")}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <div className="text-blue-200 text-sm mb-2">
                        {t("master.places")}
                      </div>
                      <div className="text-green-300 font-bold text-lg">25</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <div className="text-blue-200 text-sm mb-2">
                        {t("master.studyFormat")}
                      </div>
                      <div className="text-white font-bold text-lg">{t("master.fullTime")}</div>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-xl">
                      <div className="text-blue-200 text-sm mb-2">
                        {t("master.language")}
                      </div>
                      <div className="text-white font-bold text-lg">{t("master.russian")}</div>
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