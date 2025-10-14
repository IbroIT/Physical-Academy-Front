// VisaSupport.jsx
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { getVisaSupportPageData } from "../../../services/api";
import LoadingSpinner from "../../common/LoadingSpinner";

const VisaSupport = () => {
  const { t, i18n } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState("process");
  const [isVisible, setIsVisible] = useState(false);
  const [selectedVisaType, setSelectedVisaType] = useState("student");
  const sectionRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);

  // Используем useMemo для предотвращения пересоздания объекта при каждом рендере
  const translatedData = t("visaSupport", { returnObjects: true }) || {};

  // Create complete safe fallback data structure with empty arrays and objects
  // Используем useMemo для предотвращения пересоздания объекта fallbackVisaData при каждом рендере
  const fallbackVisaData = {
    title: translatedData?.title || "Visa Support",
    subtitle: translatedData?.subtitle || "Information about visa processes",
    headerIcon: translatedData?.headerIcon || "🛂",
    tabs:
      typeof translatedData?.tabs === "object"
        ? translatedData.tabs
        : {
            process: { id: "process", name: "Process" },
            types: { id: "types", name: "Types" },
            documents: { id: "documents", name: "Documents" },
            faq: { id: "faq", name: "FAQ" },
          },
    process: {
      title: translatedData?.process?.title || "Visa Process",
      description: translatedData?.process?.description || "",
      steps: Array.isArray(translatedData?.process?.steps)
        ? translatedData.process.steps
        : [],
    },
    types: {
      title: translatedData?.types?.title || "Visa Types",
      description: translatedData?.types?.description || "",
      list: Array.isArray(translatedData?.types?.list)
        ? translatedData.types.list
        : [],
    },
    documents: {
      title: translatedData?.documents?.title || "Required Documents",
      description: translatedData?.documents?.description || "",
      list: Array.isArray(translatedData?.documents?.list)
        ? translatedData.documents.list
        : [],
      notes: {
        title: translatedData?.documents?.notes?.title || "Important Notes",
        icon: translatedData?.documents?.notes?.icon || "ℹ️",
        items: Array.isArray(translatedData?.documents?.notes?.items)
          ? translatedData.documents.notes.items
          : [],
      },
    },
    faq: {
      title: translatedData?.faq?.title || "FAQ",
      description: translatedData?.faq?.description || "",
      icon: translatedData?.faq?.icon || "❓",
      list: Array.isArray(translatedData?.faq?.list)
        ? translatedData.faq.list
        : [],
    },
    contacts: {
      title: translatedData?.contacts?.title || "Visa Support Contacts",
      details: Array.isArray(translatedData?.contacts?.details)
        ? translatedData.contacts.details
        : [],
      button: translatedData?.contacts?.button || "Contact Us",
    },
    deadlines: {
      title: translatedData?.deadlines?.title || "Important Deadlines",
      items: Array.isArray(translatedData?.deadlines?.items)
        ? translatedData.deadlines.items
        : [],
    },
    status: {
      title: translatedData?.status?.title || "Visa Process Status",
      items: Array.isArray(translatedData?.status?.items)
        ? translatedData.status.items
        : [],
    },
    stats: Array.isArray(translatedData?.stats) ? translatedData.stats : [],
    ui: {
      required: translatedData?.ui?.required || "Required",
      recommended: translatedData?.ui?.recommended || "Recommended",
      locationIcon: translatedData?.ui?.locationIcon || "📍",
      validity: translatedData?.ui?.validity || "Validity",
      cost: translatedData?.ui?.cost || "Cost",
      processingTime: translatedData?.ui?.processingTime || "Processing Time",
    },
    services: [],
    featuredServices: [],
  };

  // Merge API data with fallback data, or use fallback if API data is missing
  const visaData = apiData
    ? {
        ...fallbackVisaData,
        ...apiData,
        // Ensure nested objects are preserved and merged properly
        process: { ...fallbackVisaData.process, ...(apiData?.process || {}) },
        types: { ...fallbackVisaData.types, ...(apiData?.types || {}) },
        documents: {
          ...fallbackVisaData.documents,
          ...(apiData?.documents || {}),
        },
        faq: { ...fallbackVisaData.faq, ...(apiData?.faq || {}) },
        contacts: {
          ...fallbackVisaData.contacts,
          ...(apiData?.contacts || {}),
        },
        deadlines: {
          ...fallbackVisaData.deadlines,
          ...(apiData?.deadlines || {}),
        },
        status: { ...fallbackVisaData.status, ...(apiData?.status || {}) },
        ui: { ...fallbackVisaData.ui, ...(apiData?.ui || {}) },
      }
    : fallbackVisaData;

  // Safely extract arrays with type checking
  const tabs = Object.values(visaData?.tabs || {}).filter(
    (tab) => tab && typeof tab === "object"
  );
  const steps = Array.isArray(visaData?.process?.steps)
    ? visaData.process.steps
    : [];
  const visaTypes = Array.isArray(visaData?.types?.list)
    ? visaData.types.list
    : [];
  const documents = Array.isArray(visaData?.documents?.list)
    ? visaData.documents.list
    : [];
  const faqs = Array.isArray(visaData?.faq?.list) ? visaData.faq.list : [];

  // Fetch data from API
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentLanguage = i18n.language || "en";
        const response = await getVisaSupportPageData(currentLanguage);

        // Only update state if component is still mounted
        if (!isMounted) return;

        if (!response || typeof response !== "object") {
          throw new Error("Invalid API response format");
        }

        // Transform API response to match our component's expected format
        const processedData = {
          // Start with fallback data
          ...fallbackVisaData,
          // Apply top level properties safely
          title: response?.title || fallbackVisaData.title,
          subtitle: response?.subtitle || fallbackVisaData.subtitle,

          // Handle complex nested structures
          process: {
            ...fallbackVisaData.process,
            ...(response?.process || {}),
            title: response?.process?.title || fallbackVisaData.process.title,
            description:
              response?.process?.description ||
              fallbackVisaData.process.description,
            steps: Array.isArray(response?.process?.steps)
              ? response.process.steps
              : fallbackVisaData.process.steps,
          },

          types: {
            ...fallbackVisaData.types,
            ...(response?.types || {}),
            title: response?.types?.title || fallbackVisaData.types.title,
            description:
              response?.types?.description ||
              fallbackVisaData.types.description,
            list: Array.isArray(response?.types?.list)
              ? response.types.list
              : fallbackVisaData.types.list,
          },

          documents: {
            ...fallbackVisaData.documents,
            ...(response?.documents || {}),
            title:
              response?.documents?.title || fallbackVisaData.documents.title,
            list: Array.isArray(response?.documents?.list)
              ? response.documents.list
              : fallbackVisaData.documents.list,
          },

          contacts: {
            ...fallbackVisaData.contacts,
            ...(typeof response?.contacts === "object" &&
            !Array.isArray(response?.contacts)
              ? response.contacts
              : {}),
            details: Array.isArray(response?.contacts?.details)
              ? response.contacts.details
              : Array.isArray(response?.contacts)
              ? response.contacts
              : fallbackVisaData.contacts.details,
          },

          // Handle arrays with proper checks
          services: Array.isArray(response?.services) ? response.services : [],
          featuredServices: Array.isArray(response?.featured_services)
            ? response.featured_services
            : [],
          stats: Array.isArray(response?.stats)
            ? response.stats
            : fallbackVisaData.stats,
        };

        setApiData(processedData);
      } catch (err) {
        // Only update error state if component is still mounted
        if (isMounted) {
          console.error("Error fetching visa support data:", err);
          setError(
            t("errors.loadFailed") || "Failed to load visa support data"
          );
        }
      } finally {
        // Only update loading state if component is still mounted
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function to prevent state updates on unmounted component
    return () => {
      isMounted = false;
    };
  }, [i18n.language]); // Убрали зависимость от t и fallbackVisaData, чтобы предотвратить циклические рендеры

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

  // Автопереключение шагов
  useEffect(() => {
    // Проверяем, что steps существует и имеет длину больше 0
    if (steps && steps.length > 0) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [steps]);

  // Safe selection of visa type with fallback for empty data
  const selectedVisa = visaTypes.find(
    (type) => type && type.id === selectedVisaType
  ) ||
    visaTypes[0] || {
      id: "",
      name: t("visaSupport.noData", "No data available"),
      icon: "📄",
      description: "",
      validity: "-",
      cost: "-",
      processingTime: "-",
      features: [],
    };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {loading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="bg-red-500/20 border border-red-500 p-4 rounded-lg text-white max-w-lg">
            <h3 className="text-xl font-bold mb-2">{t("errors.title")}</h3>
            <p>{error}</p>
          </div>
        </div>
      )}
      {/* Анимированный глобальный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Глобус и паспортные элементы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🌍</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          🛂
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">✈️</div>
        <div className="absolute bottom-1/4 right-1/3 text-5xl opacity-5">
          📋
        </div>

        {/* Анимированные линии границ */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isVisible ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            {visaData.headerIcon}
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {visaData.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {visaData.subtitle}
          </p>
        </motion.div>

        {/* Быстрая статистика */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
        >
          {Array.isArray(visaData?.stats) && visaData.stats.length > 0 ? (
            visaData.stats.map((stat, index) => (
              <motion.div
                key={stat?.id || `stat-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
              >
                <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat?.value || "0"}
                </div>
                <div className="text-blue-200 text-sm lg:text-base">
                  {stat?.label || ""}
                </div>
              </motion.div>
            ))
          ) : (
            // Fallback if no stats are available
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 lg:col-span-4 text-center text-blue-200"
            >
              {t(
                "common.noStatsAvailable",
                "Statistics will be available soon"
              )}
            </motion.div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Основной контент - 2/3 ширины */}
          <div className="lg:col-span-2">
            {/* Навигационные табы */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex overflow-x-auto scrollbar-hide mb-8 bg-white/5 rounded-2xl p-2 backdrop-blur-sm border border-white/10"
            >
              {Array.isArray(tabs) && tabs.length > 0 ? (
                tabs.map((tab) => (
                  <button
                    key={
                      tab?.id ||
                      `tab-${Math.random().toString(36).substr(2, 9)}`
                    }
                    onClick={() => setActiveTab(tab?.id || "process")}
                    className={`flex-1 min-w-max px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                      activeTab === tab?.id
                        ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg"
                        : "text-blue-100 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {tab?.name || "Tab"}
                  </button>
                ))
              ) : (
                // Default tabs if none available
                <>
                  <button
                    onClick={() => setActiveTab("process")}
                    className={`flex-1 min-w-max px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                      activeTab === "process"
                        ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg"
                        : "text-blue-100 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {t("visaSupport.tabs.process", "Process")}
                  </button>
                  <button
                    onClick={() => setActiveTab("documents")}
                    className={`flex-1 min-w-max px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
                      activeTab === "documents"
                        ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg"
                        : "text-blue-100 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {t("visaSupport.tabs.documents", "Documents")}
                  </button>
                </>
              )}
            </motion.div>

            {/* Контент табов */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <AnimatePresence mode="wait">
                {/* Процесс получения */}
                {activeTab === "process" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {visaData.process.title}
                    </h2>

                    {/* Шаги процесса */}
                    <div className="relative">
                      <div className="absolute left-6 top-0 bottom-0 w-1 bg-white/10 rounded-full hidden md:block"></div>

                      <div className="space-y-8">
                        {Array.isArray(steps) && steps.length > 0 ? (
                          steps.map((step, index) => (
                            <motion.div
                              key={step?.id || `step-${index}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.2 }}
                              className="flex items-start space-x-6 group cursor-pointer"
                              onMouseEnter={() => setActiveStep(index)}
                            >
                              <div
                                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all duration-300 ${
                                  activeStep === index
                                    ? "bg-gradient-to-r from-blue-500 to-emerald-500 scale-110 shadow-lg"
                                    : "bg-white/10 group-hover:bg-white/20"
                                }`}
                              >
                                {index + 1}
                              </div>
                              <div
                                className={`flex-1 p-6 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                                  activeStep === index
                                    ? "bg-white/10 border-emerald-400/30 shadow-lg"
                                    : "bg-white/5 border-white/10 group-hover:bg-white/10"
                                }`}
                              >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
                                  <h3 className="text-xl font-semibold text-white">
                                    {step?.title || `Step ${index + 1}`}
                                  </h3>
                                  <span className="text-emerald-400 font-medium text-sm bg-emerald-500/20 px-3 py-1 rounded-full">
                                    {step?.duration || ""}
                                  </span>
                                </div>
                                <p className="text-blue-200 mb-4">
                                  {step?.description || ""}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-blue-300">
                                    {visaData?.ui?.locationIcon || "📍"}{" "}
                                    {step?.location || ""}
                                  </span>
                                  <span className="text-sm text-emerald-300 font-medium">
                                    {step?.cost || ""}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                            <p className="text-blue-200">
                              {t(
                                "visaSupport.noStepsAvailable",
                                "Process steps information will be available soon."
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Типы виз */}
                {activeTab === "types" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {visaData.types.title}
                    </h2>

                    {/* Селектор типа визы */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                      {Array.isArray(visaTypes) && visaTypes.length > 0 ? (
                        visaTypes.map((type) => (
                          <button
                            key={
                              type?.id ||
                              `type-${Math.random().toString(36).substr(2, 9)}`
                            }
                            onClick={() =>
                              setSelectedVisaType(type?.id || "student")
                            }
                            className={`p-4 rounded-2xl text-center transition-all duration-300 ${
                              selectedVisaType === type?.id
                                ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg scale-105"
                                : "bg-white/5 text-blue-100 hover:bg-white/10"
                            }`}
                          >
                            <div className="text-2xl mb-2">
                              {type?.icon || "🎓"}
                            </div>
                            <div className="font-semibold text-sm">
                              {type?.name || "Visa Type"}
                            </div>
                          </button>
                        ))
                      ) : (
                        // Fallback if no visa types available
                        <div className="col-span-2 lg:col-span-4 text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                          <p className="text-blue-200">
                            {t(
                              "visaSupport.noVisaTypesAvailable",
                              "Visa type information will be available soon."
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Детали выбранной визы */}
                    <motion.div
                      key={selectedVisaType}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm border border-white/20"
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                            <span className="text-2xl mr-3">
                              {selectedVisa.icon}
                            </span>
                            {selectedVisa.name}
                          </h3>
                          <p className="text-blue-200 mb-4">
                            {selectedVisa.description}
                          </p>
                          <div className="space-y-2">
                            {Array.isArray(selectedVisa?.features) &&
                            selectedVisa.features.length > 0 ? (
                              selectedVisa.features.map((feature, index) => (
                                <div
                                  key={`feature-${index}`}
                                  className="flex items-center text-blue-100"
                                >
                                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                                  {feature || ""}
                                </div>
                              ))
                            ) : (
                              <div className="text-blue-100">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3 inline-block"></span>
                                {t(
                                  "visaSupport.basicFeature",
                                  "Standard visa features"
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="bg-white/10 rounded-xl p-4">
                            <h4 className="text-white font-semibold mb-2">
                              {visaData.ui.validity}
                            </h4>
                            <p className="text-emerald-300">
                              {selectedVisa.validity}
                            </p>
                          </div>
                          <div className="bg-white/10 rounded-xl p-4">
                            <h4 className="text-white font-semibold mb-2">
                              {visaData.ui.cost}
                            </h4>
                            <p className="text-emerald-300">
                              {selectedVisa.cost}
                            </p>
                          </div>
                          <div className="bg-white/10 rounded-xl p-4">
                            <h4 className="text-white font-semibold mb-2">
                              {visaData.ui.processingTime}
                            </h4>
                            <p className="text-emerald-300">
                              {selectedVisa.processingTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Документы */}
                {activeTab === "documents" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {visaData.documents.title}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                      {Array.isArray(documents) && documents.length > 0 ? (
                        documents.map((doc, index) => (
                          <motion.div
                            key={doc?.id || `doc-${index}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                          >
                            <div className="flex items-start space-x-4">
                              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-300">
                                {doc?.icon || "📄"}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white mb-2">
                                  {doc?.name || `Document ${index + 1}`}
                                </h3>
                                <p className="text-blue-200 text-sm mb-3">
                                  {doc?.description || ""}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="text-emerald-300 text-sm font-medium">
                                    {doc?.importance || ""}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      doc?.required
                                        ? "bg-emerald-500/20 text-emerald-300"
                                        : "bg-blue-500/20 text-blue-300"
                                    }`}
                                  >
                                    {doc?.required
                                      ? visaData?.ui?.required || "Required"
                                      : visaData?.ui?.recommended ||
                                        "Recommended"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                          <p className="text-blue-200">
                            {t(
                              "visaSupport.noDocumentsAvailable",
                              "Document information will be available soon."
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Важное примечание */}
                    <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl p-6 mt-8 backdrop-blur-sm border border-blue-400/30">
                      <h4 className="text-white font-semibold mb-3 flex items-center">
                        <span className="text-xl mr-2">
                          {visaData.documents.notes.icon}
                        </span>
                        {visaData.documents.notes.title}
                      </h4>
                      <ul className="text-blue-200 space-y-2 text-sm">
                        {visaData.documents.notes.items.map((note, index) => (
                          <li key={index}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {/* FAQ */}
                {activeTab === "faq" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                      {visaData.faq.title}
                    </h2>

                    <div className="space-y-4">
                      {Array.isArray(faqs) && faqs.length > 0 ? (
                        faqs.map((faq, index) => (
                          <motion.div
                            key={faq?.id || `faq-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
                          >
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                              <span className="text-emerald-400 mr-3">
                                {visaData?.faq?.icon || "❓"}
                              </span>
                              {faq?.question || `FAQ ${index + 1}`}
                            </h3>
                            <p className="text-blue-200 pl-8">
                              {faq?.answer || ""}
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
                          <p className="text-blue-200">
                            {t(
                              "visaSupport.noFaqsAvailable",
                              "FAQs will be available soon."
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Боковая панель - 1/3 ширины */}
          <div className="space-y-8">
            {/* Контакты визовой поддержки */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {visaData.contacts.title}
              </h3>

              <div className="space-y-4">
                {Array.isArray(visaData?.contacts?.details) &&
                visaData.contacts.details.length > 0 ? (
                  visaData.contacts.details.map((contact, index) => (
                    <motion.div
                      key={`contact-${index}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
                    >
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center text-white">
                        {contact?.icon || "📞"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm">
                          {contact?.label || `Contact ${index + 1}`}
                        </div>
                        <div className="text-blue-200 text-sm truncate">
                          {contact?.value || ""}
                        </div>
                        {contact?.hours && (
                          <div className="text-emerald-300 text-xs">
                            {contact.hours}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm">
                    <p className="text-blue-200">
                      {t(
                        "visaSupport.noContactsAvailable",
                        "Contact information will be available soon."
                      )}
                    </p>
                  </div>
                )}
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {visaData.contacts.button}
              </motion.button>
            </motion.div>

            {/* Срочные сроки */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-blue-400/30 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                {visaData.deadlines.title}
              </h3>

              <div className="space-y-3">
                {visaData.deadlines.items.map((deadline, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-white/10 rounded-lg backdrop-blur-sm"
                  >
                    <span className="text-white text-sm">{deadline.event}</span>
                    <span className="text-emerald-300 text-sm font-semibold">
                      {deadline.date}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Статус визового процесса */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                {visaData.status.title}
              </h3>

              <div className="space-y-4">
                {visaData.status.items.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm text-blue-200">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 backdrop-blur-sm">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: 1.2 + index * 0.2 }}
                        className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-emerald-400 shadow-lg"
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisaSupport;
