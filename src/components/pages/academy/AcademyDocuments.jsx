// components/AcademyMission.jsx
import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const AcademyMission = () => {
  const { t, i18n } = useTranslation();

  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    missions: [],
    loading: false,
    error: null,
  });

  // Состояние для выбранного элемента
  const [selectedMission, setSelectedMission] = useState(null);

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
      const url = `${API_URL}/api/academy/missions/?lang=${lang}`;

      const response = await fetch(url);

      // Проверяем content-type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.warn(`Non-JSON response from ${url}:`, text.substring(0, 200));
        setBackendData((prev) => ({
          ...prev,
          missions: [],
          loading: false,
        }));
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setBackendData((prev) => ({
        ...prev,
        missions: data.results || [],
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Error fetching academy missions:", error);
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

  // Функция для выбора элемента
  const selectMission = (mission) => {
    setSelectedMission(selectedMission?.id === mission.id ? null : mission);
  };

  // Функция для открытия PDF
  const openPdf = (pdfUrl) => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Компонент загрузки
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-white/20 rounded w-full mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-4/5"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Компонент ошибки
  const ErrorMessage = ({ onRetry }) => (
    <div className="text-center py-8">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl text-white mb-4">
        {t("common.error", { defaultValue: "Ошибка загрузки данных" })}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData.error ||
          t("common.errors.apiError", {
            defaultValue: "Не удалось загрузить данные с сервера",
          })}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t("accreditation.retry", { defaultValue: "Попробовать снова" })}
      </button>
    </div>
  );

  // Компонент пустых данных
  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-blue-300 text-6xl mb-6">📋</div>
      <h3 className="text-2xl text-white mb-4">
        {t("common.loading", { defaultValue: "Данные отсутствуют" })}
      </h3>
    </div>
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон с частицами */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-bounce delay-1500"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {t("documents.title")}
          </motion.h2>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"
          ></motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
          >
            {t("documents.subtitle")}
          </motion.p>
        </motion.div>

        {/* Список миссий */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl mb-16"
        >
          {backendData.loading ? (
            <LoadingSkeleton />
          ) : backendData.error ? (
            <ErrorMessage onRetry={fetchBackendData} />
          ) : backendData.missions.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {backendData.missions.map((mission, index) => (
                <motion.div
                  key={mission.id}
                  variants={itemVariants}
                  onClick={() => selectMission(mission)}
                  className={`bg-white/5 backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 cursor-pointer hover:-translate-y-1 ${
                    selectedMission?.id === mission.id
                      ? "border-emerald-400/50 bg-white/10"
                      : mission.pdf
                      ? "border-white/20 hover:border-emerald-400/50 hover:bg-white/10"
                      : "border-white/10 opacity-75"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl lg:text-2xl font-bold text-white mb-3">
                        {mission.title}
                      </h3>

                      {/* Кнопка PDF появляется при выборе элемента */}
                      {selectedMission?.id === mission.id && mission.pdf && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 pt-4 border-t border-white/10"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openPdf(mission.pdf);
                            }}
                            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          >
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            {t("common.viewPdf", { defaultValue: "Посмотреть PDF" })}
                          </button>
                        </motion.div>
                      )}
                    </div>
                    
                    {/* Иконка PDF справа */}
                    {mission.pdf && (
                      <div className="flex-shrink-0 ml-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-emerald-400 transition-all duration-300 ${
                          selectedMission?.id === mission.id ? "bg-emerald-500/30" : "bg-emerald-500/20"
                        }`}>
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AcademyMission;
