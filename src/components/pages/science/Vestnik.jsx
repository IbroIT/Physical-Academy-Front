import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const Vestnik = () => {
  const { t, i18n } = useTranslation();
  const [currentView, setCurrentView] = useState("current");
  const [selectedYear, setSelectedYear] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const [activeIssue, setActiveIssue] = useState(0);
  const sectionRef = useRef(null);

  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    stats: [],
    featuredIssues: [],
    recentIssues: [],
    recentArticles: [],
    loading: false,
    error: null
  });

  // Получение текущего языка для API
  const getApiLanguage = useCallback(() => {
    const langMap = {
      'en': 'en',
      'ru': 'ru',
      'kg': 'kg'
    };
    return langMap[i18n.language] || 'ru';
  }, [i18n.language]);

  // Функция для загрузки данных с бэкенда
  const fetchBackendData = useCallback(async () => {
    try {
      setBackendData(prev => ({ ...prev, loading: true, error: null }));
      
      const lang = getApiLanguage();
      
      const API_URL = import.meta.env.VITE_API_URL;

      const endpoints = [
        `${API_URL}/api/science/vestnik-stats/?lang=${lang}`,
        `${API_URL}/api/science/vestnik-issues/?lang=${lang}&is_featured=true`,
        `${API_URL}/api/science/vestnik-issues/?lang=${lang}&ordering=-publication_date`,
        `${API_URL}/api/science/vestnik-articles/?lang=${lang}&ordering=-id`
      ];


      const responses = await Promise.all(
        endpoints.map(async (url) => {
          try {
            const response = await fetch(url);
            
            // Проверяем content-type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              const text = await response.text();
              console.warn(`Non-JSON response from ${url}:`, text.substring(0, 200));
              return { results: [] };
            }
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
          } catch (error) {
            console.error(`Error fetching ${url}:`, error);
            return { results: [] };
          }
        })
      );

      setBackendData({
        stats: responses[0].results || [],
        featuredIssues: responses[1].results || [],
        recentIssues: responses[2].results || [],
        recentArticles: responses[3].results || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching Vestnik data:', error);
      setBackendData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load data'
      }));
    }
  }, [getApiLanguage]);

  // Загрузка данных при монтировании и изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

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

  // Auto-switching issues in archive
  useEffect(() => {
    if (currentView === "archive" && backendData.recentIssues.length > 0) {
      const interval = setInterval(() => {
        setActiveIssue((prev) => (prev + 1) % backendData.recentIssues.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentView, backendData.recentIssues]);

  const views = [
    { id: "current", label: t("vestnik.views.current"), icon: "🌟" },
    { id: "archive", label: t("vestnik.views.archive"), icon: "📚" },
    { id: "metrics", label: t("vestnik.views.metrics"), icon: "📊" },
  ];

  // Get unique years for archive filtering
  const archiveYears = backendData.recentIssues.length > 0
    ? [...new Set(backendData.recentIssues.map((issue) => issue.year))]
    : [];

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
        {t('vestnik.errorTitle')}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData.error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t('vestnik.retry')}
      </button>
    </div>
  );

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

        {/* Научные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">📰</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          🔬
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">📚</div>
        <div className="absolute top-2/3 right-1/3 text-5xl opacity-5">⚗️</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t("vestnik.title")}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t("vestnik.subtitle")}
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden"
        >
          {/* View Navigation */}
          <div className="border-b border-white/20 bg-white/5">
            <div className="flex overflow-x-auto scrollbar-hide px-4">
              {views.map((view) => (
                <motion.button
                  key={view.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentView(view.id)}
                  className={`flex items-center space-x-2 flex-shrink-0 px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ${
                    currentView === view.id
                      ? "border-emerald-400 text-white bg-white/10"
                      : "border-transparent text-blue-200 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{view.icon}</span>
                  <span>{view.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* View Content */}
          <div className="p-6 lg:p-8">
            {backendData.error ? (
              <ErrorMessage onRetry={fetchBackendData} />
            ) : (
              <AnimatePresence mode="wait">
                {currentView === "current" && (
                  <CurrentIssue
                    data={backendData.featuredIssues.length > 0 ? backendData.featuredIssues[0] : null}
                    loading={backendData.loading}
                    t={t}
                  />
                )}
                {currentView === "archive" && (
                  <Archive
                    data={backendData.recentIssues}
                    selectedYear={selectedYear}
                    onYearChange={setSelectedYear}
                    years={archiveYears}
                    activeIssue={activeIssue}
                    onIssueChange={setActiveIssue}
                    loading={backendData.loading}
                    t={t}
                  />
                )}
                {currentView === "metrics" && (
                  <Metrics
                    data={backendData.stats}
                    loading={backendData.loading}
                    t={t}
                  />
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const CurrentIssue = ({ data, loading, t }) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!data) {
    return (
      <motion.div
        key="current"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-16 bg-white/5 rounded-2xl border border-white/10"
      >
        <div className="text-yellow-400 text-xl mb-2">📰</div>
        <div className="text-white text-xl mb-2">
          {t("vestnik.current.noIssue")}
        </div>
        <div className="text-blue-200">
          {t("vestnik.current.noIssueDescription")}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="current"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex flex-col lg:flex-row items-start gap-8">
        <motion.div
          className="flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <div className="w-48 h-64 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border-2 border-emerald-400/30 backdrop-blur-sm group">
              <span className="text-6xl text-emerald-400">📰</span>
            </div>
            <motion.div
              className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {t("vestnik.current.newBadge")}
            </motion.div>
          </div>
        </motion.div>

        <div className="flex-grow space-y-6">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-full text-sm font-medium backdrop-blur-sm">
            {t("vestnik.current.currentIssue")}
          </div>

          <h3 className="text-3xl lg:text-4xl font-bold text-white">
            {data.title || 
             `Вестник том ${data.volume_number || "X"} №${data.issue_number || "X"} (${data.year || "XXXX"})`}
          </h3>

          <p className="text-blue-100 text-lg leading-relaxed">
            {data.description || t("vestnik.current.defaultDescription")}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                value: data.publication_date
                  ? new Date(data.publication_date).toLocaleDateString()
                  : data.year || new Date().getFullYear().toString(),
                label: t("vestnik.current.releaseDate"),
                color: "blue",
                icon: "📅",
              },
              {
                value: data.issn_print || data.issn_online || "ISSN",
                label: "ISSN",
                color: "green",
                icon: "🏷️",
              },
              {
                value: data.articles_count?.toString() || "0",
                label: t("vestnik.current.articlesCount"),
                color: "purple",
                icon: "📄",
              },
              {
                value: `${t("vestnik.current.volume")} ${data.volume_number || "X"} ${t("vestnik.current.issue")} ${data.issue_number || "X"}`,
                label: t("vestnik.current.issueNumber"),
                color: "orange",
                icon: "📏",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-xl p-4 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
              >
                <div className="text-lg mb-1">{stat.icon}</div>
                <div
                  className={`text-xl font-bold mb-1 ${
                    stat.color === "blue"
                      ? "text-blue-400"
                      : stat.color === "green"
                      ? "text-emerald-400"
                      : stat.color === "purple"
                      ? "text-purple-400"
                      : "text-orange-400"
                  }`}
                >
                  {stat.value}
                </div>
                <div className="text-blue-200 text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => data.pdf_file && window.open(data.pdf_file, "_blank")}
              disabled={!data.pdf_file}
              className={`px-6 py-3 rounded-xl transition-all shadow-lg font-medium flex items-center gap-2 ${
                data.pdf_file
                  ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
            >
              <span>📥</span>
              <span>{t("vestnik.actions.downloadPDF")}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Archive = ({
  data,
  selectedYear,
  onYearChange,
  years,
  activeIssue,
  onIssueChange,
  loading,
  t,
}) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  const filteredData = selectedYear === "all"
    ? data
    : data.filter((issue) => issue.year === parseInt(selectedYear));

  return (
    <motion.div
      key="archive"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h3 className="text-2xl lg:text-3xl font-bold text-white">
          {t("vestnik.archive.title")}
        </h3>

        {/* Year Filter */}
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onYearChange("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-sm border ${
              selectedYear === "all"
                ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white border-transparent shadow-lg"
                : "bg-white/5 text-blue-200 border-white/10 hover:border-emerald-400/30"
            }`}
          >
            {t("vestnik.archive.allYears")}
          </motion.button>
          {years.map((year) => (
            <motion.button
              key={year}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onYearChange(year)}
              className={`px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-sm border ${
                selectedYear === year
                  ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white border-transparent shadow-lg"
                  : "bg-white/5 text-blue-200 border-white/10 hover:border-emerald-400/30"
              }`}
            >
              {year}
            </motion.button>
          ))}
        </div>
      </div>

      {filteredData.length > 0 ? (
        <>
          {/* Featured Issue */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 lg:p-8 border border-emerald-400/20"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-xl lg:text-2xl font-bold text-white mb-4">
                  {filteredData[activeIssue]?.title ||
                    `${t("vestnik.archive.vestnik")} ${t("vestnik.current.volume")} ${filteredData[activeIssue]?.volume_number} ${t("vestnik.current.issue")} ${filteredData[activeIssue]?.issue_number} (${filteredData[activeIssue]?.year})`}
                </h4>
                <p className="text-blue-100 mb-4">
                  {filteredData[activeIssue]?.description || t("vestnik.current.defaultDescription")}
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-blue-200 text-sm">
                    📅{" "}
                    {filteredData[activeIssue]?.publication_date
                      ? new Date(filteredData[activeIssue].publication_date).toLocaleDateString()
                      : filteredData[activeIssue]?.year}
                  </span>
                  <span className="text-blue-200 text-sm">
                    📄 {filteredData[activeIssue]?.articles_count || 0} {t("vestnik.current.articles")}
                  </span>
                  <span className="text-blue-200 text-sm">
                    📏 {t("vestnik.current.volume")} {filteredData[activeIssue]?.volume_number} {t("vestnik.current.issue")} {filteredData[activeIssue]?.issue_number}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    filteredData[activeIssue]?.pdf_file &&
                    window.open(filteredData[activeIssue].pdf_file, "_blank")
                  }
                  className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all shadow-lg"
                >
                  {t("vestnik.actions.openIssue")}
                </motion.button>
              </div>
              <div className="flex justify-center">
                <div className="w-32 h-40 bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center border-2 border-emerald-400/30 backdrop-blur-sm">
                  <span className="text-4xl text-emerald-400">📘</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* All Issues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => onIssueChange(index)}
                className={`bg-white/5 rounded-2xl p-6 backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                  activeIssue === index
                    ? "border-emerald-400/50 bg-gradient-to-r from-blue-500/10 to-emerald-500/10"
                    : "border-white/10 hover:border-emerald-400/30"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-white text-lg mb-2">
                      {issue.title ||
                        `${t("vestnik.current.volume")} ${issue.volume_number} ${t("vestnik.current.issue")} ${issue.issue_number} (${issue.year})`}
                    </h4>
                    <p className="text-blue-200 text-sm">
                      {issue.publication_date
                        ? new Date(issue.publication_date).toLocaleDateString()
                        : issue.year}
                    </p>
                  </div>
                  <span
                    className={`text-2xl transition-all ${
                      activeIssue === index
                        ? "text-emerald-400 scale-110"
                        : "text-blue-400"
                    }`}
                  >
                    📘
                  </span>
                </div>

                <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                  {issue.description || t("vestnik.current.defaultDescription")}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-blue-200 text-sm">
                    📄 {issue.articles_count || 0} {t("vestnik.current.articles")}
                  </span>
                  <span className="text-blue-200 text-sm">
                    📏 {t("vestnik.current.volume")} {issue.volume_number} {t("vestnik.current.issue")} {issue.issue_number}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs font-medium backdrop-blur-sm">
                      PDF
                    </span>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs font-medium backdrop-blur-sm">
                      HTML
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (issue.pdf_file) {
                        window.open(issue.pdf_file, "_blank");
                      }
                    }}
                    disabled={!issue.pdf_file}
                    className={`px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-lg ${
                      issue.pdf_file
                        ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600"
                        : "bg-gray-500 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {t("vestnik.actions.open")}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm"
        >
          <div className="text-6xl mb-4 text-emerald-400">📚</div>
          <h4 className="text-xl font-semibold text-white mb-2">
            {t("vestnik.archive.noIssues.title")}
          </h4>
          <p className="text-blue-200">
            {t("vestnik.archive.noIssues.description")}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

const Metrics = ({ data, loading, t }) => {
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      key="metrics"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <h3 className="text-2xl lg:text-3xl font-bold text-white">
        {t("vestnik.metrics.title")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.length > 0 ? (
          data.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{metric.icon || "📊"}</div>
              <div className="text-2xl font-bold text-emerald-400 mb-2">
                {metric.value}
              </div>
              <div className="text-blue-200 text-sm font-medium">
                {metric.label}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-blue-200">
            {t("vestnik.metrics.noData")}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Reuse the LoadingSkeleton component from above
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

export default Vestnik;