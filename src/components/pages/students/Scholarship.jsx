import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { getScholarshipPageData } from "../../../services/api";
import LoadingSpinner from "../../common/LoadingSpinner";

// Scholarship Card Component
const ScholarshipCard = ({
  scholarship,
  index,
  isExpanded,
  onToggle,
  labels,
  statusLabels,
}) => {
  if (!scholarship) return null;

  // Ensure all necessary properties exist to prevent runtime errors
  const safeScholarship = {
    title: scholarship.title || "",
    status: scholarship.status || "active",
    type: scholarship.type || "",
    amount: scholarship.amount || "",
    description: scholarship.description || "",
    emoji: scholarship.emoji || "💰",
    ...scholarship,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white/10 rounded-2xl overflow-hidden backdrop-blur-sm border border-white/20 hover:border-emerald-400/30 transition-all duration-300 shadow-lg"
    >
      <div
        onClick={onToggle}
        className="px-6 py-5 cursor-pointer flex flex-wrap md:flex-nowrap justify-between items-center"
      >
        <div className="flex items-center mb-4 md:mb-0 w-full md:w-auto">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-xl mr-4 flex-shrink-0">
            {safeScholarship.emoji || "💰"}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {safeScholarship.title}
            </h3>
            <div className="flex items-center mt-1 text-sm text-blue-200">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${
                  safeScholarship.status === "active"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                {statusLabels[safeScholarship.status] || safeScholarship.status}
              </span>
              <span>{safeScholarship.type}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full md:w-auto justify-between md:justify-end">
          <div className="mr-6">
            <div className="text-sm text-blue-200">{labels.amount}</div>
            <div className="text-xl font-bold text-white">
              {safeScholarship.amount}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="w-6 h-6 text-white opacity-70"
          >
            ▼
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 py-5 border-t border-white/10 bg-gradient-to-r from-blue-600/20 to-emerald-600/20">
              <div className="prose prose-invert max-w-none">
                <p className="text-blue-100">{safeScholarship.description}</p>

                {safeScholarship.eligibility && (
                  <div className="mt-4">
                    <h4 className="text-white text-lg font-semibold mb-2">
                      {labels.eligibility}
                    </h4>
                    <ul className="list-disc pl-5 text-blue-100 space-y-1">
                      {Array.isArray(safeScholarship.eligibility) &&
                        safeScholarship.eligibility.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                    </ul>
                  </div>
                )}

                {safeScholarship.deadline && (
                  <div className="mt-4">
                    <h4 className="text-white text-lg font-semibold mb-2">
                      {labels.deadline}
                    </h4>
                    <p className="text-blue-100">{safeScholarship.deadline}</p>
                  </div>
                )}

                {safeScholarship.contact && (
                  <div className="mt-4">
                    <h4 className="text-white text-lg font-semibold mb-2">
                      {labels.contact}
                    </h4>
                    <p className="text-blue-100">{safeScholarship.contact}</p>
                  </div>
                )}
              </div>

              {safeScholarship.url && (
                <div className="mt-6 text-center">
                  <a
                    href={safeScholarship.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg"
                  >
                    {labels.apply}
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Scholarship = () => {
  // State management with proper initialization
  const { t, i18n } = useTranslation();
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);

  // Refs
  const sectionRef = useRef(null);

  // Fallback data if API fails
  const fallbackData = {
    title: "Scholarships",
    subtitle: "Explore scholarship opportunities",
    types: [],
    stats: [],
    scholarships: [],
    paymentSchedule: [],
  };

  // Try to get translations
  try {
    const translatedData = t("students.scholarships", { returnObjects: true });
    // Check if it's actually an object and not a string
    if (
      translatedData &&
      typeof translatedData === "object" &&
      !Array.isArray(translatedData)
    ) {
      Object.assign(fallbackData, translatedData);
    }
  } catch (e) {
    console.warn("Could not load scholarship translations", e);
  }

  const labels = t("students.scholarships.labels", { returnObjects: true }) || {
    results: { found: "Results found", status: "Status" },
    status: { active: "Active", upcoming: "Upcoming", past: "Past" },
    card: {
      amount: "Amount",
      eligibility: "Eligibility",
      deadline: "Deadline",
      contact: "Contact",
      apply: "Apply Now",
    },
    emptyState: {
      title: "No scholarships found",
      description: "Try resetting filters",
      reset: "Reset Filters",
    },
    paymentSchedule: { title: "Payment Schedule" },
  };

  // Use actual data or fallback
  const data = apiData || { ...fallbackData };

  // Ensure scholarships is always defined
  if (!data.scholarships) {
    data.scholarships = data.types || [];
  }

  // Закомментированный код для отладки, если понадобится в будущем
  /*
  console.log("Current data state:", {
    apiDataExists: !!apiData,
    fallbackIsString: typeof fallbackData === 'string',
    dataType: typeof data,
    scholarshipsCount: Array.isArray(data.scholarships) ? data.scholarships.length : 'not an array',
  });
  */

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const currentLanguage = i18n.language || "en";
        const response = await getScholarshipPageData(currentLanguage);

        // Закомментировали логирование для предотвращения лишнего шума в консоли
        // console.log("Scholarship API response:", response);

        if (response && typeof response === "object") {
          // Определяем источник данных стипендий (scholarships или programs)
          let scholarships = [];

          if (Array.isArray(response.scholarships)) {
            scholarships = response.scholarships;
          } else if (Array.isArray(response.programs)) {
            scholarships = response.programs;
          }

          // Нормализуем данные стипендий
          const normalizedScholarships = scholarships.map((scholarship) => {
            if (!scholarship || typeof scholarship !== "object") {
              return {
                id: Math.random().toString(),
                title: "Scholarship",
                description: "",
                type: "standard",
                status: "active",
                amount: "",
                emoji: "💰",
              };
            }

            return {
              id: scholarship.id || Math.random().toString(),
              title: scholarship.title || "",
              description: scholarship.description || "",
              type: scholarship.type || "standard",
              status: scholarship.status || "active",
              amount: scholarship.amount || "",
              emoji: scholarship.emoji || "💰",
              ...scholarship, // сохраняем любые другие поля из API
            };
          });

          // Создаем безопасный объект apiData
          const safeApiData = {
            title: response.title || "Scholarships",
            subtitle: response.subtitle || "Explore scholarship opportunities",
            scholarships: normalizedScholarships,
            // Добавляем информацию о текущем языке и времени запроса для отслеживания
            lang: currentLanguage,
            lastFetched: new Date().toISOString(),
            stats: [
              {
                icon: "💰",
                value: response.total_scholarships?.toString() || "0",
                label: t("students.scholarships.stats.total"),
              },
              {
                icon: "✅",
                value: response.active_scholarships?.toString() || "0",
                label: t("students.scholarships.stats.active"),
              },
            ],
            paymentSchedule: Array.isArray(response.paymentSchedule)
              ? response.paymentSchedule
              : [],
          };

          setApiData(safeApiData);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching scholarship data:", err);
        setError(t("errors.loadFailed") || "Failed to load scholarship data");
        // Keep using fallback data
      } finally {
        setLoading(false);
      }
    };

    // Используем мемоизированное значение для языка, чтобы избежать лишних запросов
    const memorizedLang = i18n.language;

    // Проверка, нужно ли делать запрос (если apiData уже загружены для текущего языка, пропускаем)
    if (!apiData || apiData.lang !== memorizedLang) {
      fetchData();
    }
  }, [i18n.language, t, apiData]); // Добавили apiData для отслеживания состояния загрузки

  // Handle intersection observer for animations
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

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  // Start counter animations
  const startCounters = () => {
    // Убедимся, что data и data.stats определены и являются массивом
    const stats = Array.isArray(data?.stats) ? data.stats : [];
    if (!stats.length) return;

    const targetValues = stats.map((stat) => {
      // Убедимся, что stat.value существует и является строкой
      const valueStr = typeof stat.value === "string" ? stat.value : "0";
      return parseInt(valueStr.replace(/\D/g, "") || "0");
    });

    const duration = 2000;
    const steps = 60;
    const stepValues = targetValues.map((target) => target / steps);

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      setCounterValues((prev) =>
        prev.map((value, index) => {
          if (currentStep <= steps && index < targetValues.length) {
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

  // Get unique types from scholarships
  let types = ["all"];

  try {
    // Защищенный код для получения уникальных типов
    if (Array.isArray(data?.scholarships) && data.scholarships.length > 0) {
      const uniqueTypes = [
        ...new Set(
          data.scholarships
            .filter(
              (scholarship) => scholarship && typeof scholarship === "object"
            )
            .map((scholarship) => scholarship?.type)
            .filter(Boolean)
        ),
      ];

      if (uniqueTypes.length > 0) {
        types = ["all", ...uniqueTypes];
      }
    }
  } catch (error) {
    console.error("Error getting unique types:", error);
  }

  // Filter scholarships based on selected type and status
  let filteredScholarships = [];

  try {
    if (Array.isArray(data?.scholarships)) {
      filteredScholarships = data.scholarships.filter((scholarship) => {
        // Проверяем, что scholarship существует и является объектом
        if (!scholarship || typeof scholarship !== "object") return false;

        const matchesType =
          selectedType === "all" ||
          (scholarship.type && scholarship.type === selectedType);

        const matchesStatus =
          selectedStatus === "all" ||
          (scholarship.status && scholarship.status === selectedStatus);

        return matchesType && matchesStatus;
      });
    }
  } catch (error) {
    console.error("Error filtering scholarships:", error);
  }

  // Reset filters function
  const resetFilters = () => {
    setSelectedType("all");
    setSelectedStatus("active");
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-cyan-700 py-16 lg:py-24 overflow-hidden"
    >
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="bg-red-500/20 border border-red-500 p-4 rounded-lg text-white max-w-lg">
            <h3 className="text-xl font-bold mb-2">
              {t("errors.title") || "Error"}
            </h3>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🎓</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          💰
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🏆</div>
      </div>

      {/* Content - only show when not loading or when there's an error but we have fallback data */}
      {(!loading || (error && apiData === null)) && (
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 lg:mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={isVisible ? { scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
            >
              💰
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              {data?.title || "Scholarships"}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              {data?.subtitle || "Explore scholarship opportunities"}
            </p>
          </motion.div>

          {/* Statistics */}
          {Array.isArray(data?.stats) && data.stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
            >
              {data.stats
                .filter((stat) => stat && typeof stat === "object")
                .map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                  >
                    <div className="text-3xl mb-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                      {stat.icon || "📊"}
                    </div>
                    <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 font-mono group-hover:scale-110 transition-transform duration-300">
                      {stat.value?.includes("%")
                        ? `${Math.round(counterValues[index] || 0)}%`
                        : stat.value?.includes("+")
                        ? `${Math.round(counterValues[index] || 0)}+`
                        : Math.round(counterValues[index] || 0)}
                    </div>
                    <div className="text-blue-200 text-sm lg:text-base">
                      {stat.label || ""}
                    </div>
                    <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 mt-3 mx-auto"></div>
                  </motion.div>
                ))}
            </motion.div>
          )}

          {/* Filter tabs */}
          {types.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedType === type
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-blue-100 hover:bg-white/20"
                  }`}
                >
                  {type === "all" ? "All Types" : type}
                </button>
              ))}

              <button
                onClick={() => setSelectedStatus("active")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ml-auto ${
                  selectedStatus === "active"
                    ? "bg-emerald-500 text-white"
                    : "bg-white/10 text-blue-100 hover:bg-white/20"
                }`}
              >
                {labels?.status?.active || "Active"}
              </button>
              <button
                onClick={() => setSelectedStatus("upcoming")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedStatus === "upcoming"
                    ? "bg-amber-500 text-white"
                    : "bg-white/10 text-blue-100 hover:bg-white/20"
                }`}
              >
                {labels?.status?.upcoming || "Upcoming"}
              </button>
            </motion.div>
          )}

          {/* Results count */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-6"
          >
            <div className="flex justify-between items-center">
              <p className="text-blue-200 text-lg">
                {labels.results?.found || "Results found"}:{" "}
                <span className="font-semibold text-white">
                  {filteredScholarships.length}
                </span>
              </p>
              {filteredScholarships.length > 0 && (
                <p className="text-blue-300 text-sm">
                  {labels.results?.status || "Status"}:{" "}
                  <span className="text-emerald-300">
                    {labels?.status?.[selectedStatus] || selectedStatus}
                  </span>
                </p>
              )}
            </div>

            {/* Scholarships list */}
            <div className="space-y-6 mt-6">
              {filteredScholarships.length > 0 ? (
                filteredScholarships.map((scholarship, index) => (
                  <ScholarshipCard
                    key={scholarship?.id || index}
                    scholarship={scholarship}
                    index={index}
                    isExpanded={expandedCard === index}
                    onToggle={() =>
                      setExpandedCard(expandedCard === index ? null : index)
                    }
                    labels={labels?.card || {}}
                    statusLabels={labels?.status || {}}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16 bg-white/5 rounded-3xl border border-white/20 backdrop-blur-sm"
                >
                  <div className="text-6xl mb-4 opacity-50">🔍</div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    {labels.emptyState?.title || "No scholarships found"}
                  </h3>
                  <p className="text-blue-200 text-lg mb-6">
                    {labels.emptyState?.description || "Try resetting filters"}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetFilters}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg"
                  >
                    {labels?.emptyState?.reset || "Reset Filters"}
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Payment Schedule */}
          {Array.isArray(data?.paymentSchedule) &&
            data.paymentSchedule.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 backdrop-blur-lg border border-white/20 shadow-2xl mb-8"
              >
                <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
                  <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                    📅
                  </span>
                  {labels?.paymentSchedule?.title || "Payment Schedule"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {data.paymentSchedule
                    .filter((payment) => payment && typeof payment === "object")
                    .map((payment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-500 transform hover:-translate-y-2 group"
                      >
                        <div className="text-3xl mb-4 text-white">
                          {payment.icon || "📅"}
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">
                          {payment.title}
                        </h4>
                        <p className="text-blue-100">{payment.description}</p>
                        <div className="mt-4 text-lg font-mono text-emerald-300 font-bold">
                          {payment.date}
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
        </div>
      )}
    </section>
  );
};

export default Scholarship;
