import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../../../services/api";

const Vestnik = () => {
  const { t, i18n } = useTranslation();
  const [currentView, setCurrentView] = useState("current");
  const [selectedYear, setSelectedYear] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const [activeIssue, setActiveIssue] = useState(0);
  const sectionRef = useRef(null);

  // API data states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState([]);
  const [featuredIssues, setFeaturedIssues] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);

  // Add error display component if needed

  // Get unique years for archive filtering
  const archiveYears =
    recentIssues.length > 0
      ? [...new Set(recentIssues.map((issue) => issue.year))]
      : [];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getVestnikPage(i18n.language);

        console.log("Vestnik API Response:", data);
        setStats(data.stats || []);
        setFeaturedIssues(data.featured_issues || []);
        setRecentIssues(data.recent_issues || []);
        setRecentArticles(data.recent_articles || []);
        console.log("Vestnik data set:", {
          stats: data.stats?.length,
          featuredIssues: data.featured_issues?.length,
          recentIssues: data.recent_issues?.length,
          recentArticles: data.recent_articles?.length,
        });
      } catch (err) {
        console.error("Failed to fetch Vestnik data:", err);
        setError(err.message);
        // Data will fallback to translation file
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Auto-switching issues in archive
  useEffect(() => {
    if (currentView === "archive" && recentIssues.length > 0) {
      const interval = setInterval(() => {
        setActiveIssue((prev) => (prev + 1) % recentIssues.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentView, recentIssues]);

  const views = [
    { id: "current", label: t("vestnik.views.current"), icon: "🌟" },
    { id: "archive", label: t("vestnik.views.archive"), icon: "📚" },
    { id: "metrics", label: t("vestnik.views.metrics"), icon: "📊" },
  ];

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
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            📰
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t("vestnik.title")}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t("vestnik.subtitle")}
          </p>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8 text-center"
          >
            <div className="text-red-400 text-lg font-semibold mb-2">
              Failed to load Vestnik data
            </div>
            <div className="text-red-300 text-sm">{error}</div>
          </motion.div>
        )}

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
            <AnimatePresence mode="wait">
              {currentView === "current" && (
                <CurrentIssue
                  data={featuredIssues.length > 0 ? featuredIssues[0] : null}
                  loading={loading}
                  t={t}
                />
              )}
              {currentView === "archive" && (
                <Archive
                  data={recentIssues.length > 0 ? recentIssues : []}
                  selectedYear={selectedYear}
                  onYearChange={setSelectedYear}
                  years={archiveYears}
                  activeIssue={activeIssue}
                  onIssueChange={setActiveIssue}
                  loading={loading}
                  t={t}
                />
              )}
              {currentView === "metrics" && (
                <Metrics
                  data={stats.length > 0 ? stats : []}
                  loading={loading}
                  t={t}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const CurrentIssue = ({ data, loading, t }) => {
  if (loading) {
    return (
      <motion.div
        key="current"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center py-16"
      >
        <div className="text-white text-xl">Loading...</div>
      </motion.div>
    );
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
          No Current Issue Available
        </div>
        <div className="text-blue-200">
          Please add a featured Vestnik issue in the admin panel.
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
            {data?.title ||
              `Вестник том ${data?.volume_number || "X"} №${
                data?.issue_number || "X"
              } (${data?.year || "XXXX"})`}
          </h3>

          <p className="text-blue-100 text-lg leading-relaxed">
            {data?.description || "Научный журнал Физической Академии"}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                value: data?.publication_date
                  ? new Date(data.publication_date).toLocaleDateString()
                  : new Date().getFullYear().toString(),
                label: "Дата выпуска",
                color: "blue",
                icon: "📅",
              },
              {
                value: data?.issn_print || data?.issn_online || "ISSN",
                label: "ISSN",
                color: "green",
                icon: "🏷️",
              },
              {
                value: data?.articles?.length?.toString() || "0",
                label: "Статей",
                color: "purple",
                icon: "📄",
              },
              {
                value: `Том ${data?.volume_number || "X"} №${
                  data?.issue_number || "X"
                }`,
                label: "Номер выпуска",
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
              onClick={() =>
                data?.pdf_url && window.open(data.pdf_url, "_blank")
              }
              disabled={!data?.pdf_url}
              className={`px-6 py-3 rounded-xl transition-all shadow-lg font-medium flex items-center gap-2 ${
                data?.pdf_url
                  ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
            >
              <span>📥</span>
              <span>Скачать PDF</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all font-medium flex items-center gap-2"
            >
              <span>🌐</span>
              <span>{t("vestnik.actions.readOnline")}</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-emerald-400/30 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all font-medium flex items-center gap-2"
            >
              <span>📋</span>
              <span>{t("vestnik.actions.forAuthors")}</span>
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
    return (
      <motion.div
        key="archive"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center py-16"
      >
        <div className="text-white text-xl">Loading archive...</div>
      </motion.div>
    );
  }
  const filteredData = Array.isArray(data)
    ? selectedYear === "all"
      ? data
      : data.filter((issue) => issue.year === parseInt(selectedYear))
    : [];

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

        {/* Фильтр по годам */}
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
          {years?.map((year) => (
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

      {Array.isArray(filteredData) && filteredData.length > 0 ? (
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
                    `Вестник том ${filteredData[activeIssue]?.volume_number} №${filteredData[activeIssue]?.issue_number} (${filteredData[activeIssue]?.year})`}
                </h4>
                <p className="text-blue-100 mb-4">
                  {filteredData[activeIssue]?.description || "Научный журнал"}
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-blue-200 text-sm">
                    📅{" "}
                    {filteredData[activeIssue]?.publication_date
                      ? new Date(
                          filteredData[activeIssue].publication_date
                        ).toLocaleDateString()
                      : filteredData[activeIssue]?.year}
                  </span>
                  <span className="text-blue-200 text-sm">
                    📄 {filteredData[activeIssue]?.articles?.length || 0} статей
                  </span>
                  <span className="text-blue-200 text-sm">
                    📏 Том {filteredData[activeIssue]?.volume_number} №
                    {filteredData[activeIssue]?.issue_number}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    filteredData[activeIssue]?.pdf_url &&
                    window.open(filteredData[activeIssue].pdf_url, "_blank")
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
                key={index}
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
                        `Том ${issue.volume_number} №${issue.issue_number} (${issue.year})`}
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
                  {issue.description || "Научный журнал Физической Академии"}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-blue-200 text-sm">
                    📄 {issue.articles?.length || 0} статей
                  </span>
                  <span className="text-blue-200 text-sm">
                    📏 Том {issue.volume_number} №{issue.issue_number}
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
                      if (issue.pdf_url) {
                        window.open(issue.pdf_url, "_blank");
                      }
                    }}
                    disabled={!issue.pdf_url}
                    className={`px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-lg ${
                      issue.pdf_url
                        ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:from-blue-600 hover:to-emerald-600"
                        : "bg-gray-500 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Открыть
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
    return (
      <motion.div
        key="metrics"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center py-16"
      >
        <div className="text-white text-xl">Loading metrics...</div>
      </motion.div>
    );
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
        {!Array.isArray(data) || data.length === 0 ? (
          <div className="col-span-full text-center text-blue-200 py-8">
            No metrics available
          </div>
        ) : (
          data
            .filter((item) => {
              // Check if it's a proper metric object, not an article object
              return (
                item &&
                typeof item === "object" &&
                ("value" in item || "label" in item || "icon" in item) &&
                // Exclude article objects that have title/author properties
                !("title" in item && "author" in item)
              );
            })
            .map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{metric.icon || "📊"}</div>
                <div className="text-2xl font-bold text-emerald-400 mb-2">
                  {String(metric.value || "0")}
                </div>
                <div className="text-blue-200 text-sm font-medium">
                  {String(metric.label || "Metric")}
                </div>
              </motion.div>
            ))
        )}

        {/* Show warning if data structure doesn't match expected format */}
        {Array.isArray(data) &&
          data.length > 0 &&
          data.filter(
            (item) =>
              item &&
              typeof item === "object" &&
              ("value" in item || "label" in item || "icon" in item) &&
              !("title" in item && "author" in item)
          ).length === 0 && (
            <div className="col-span-full text-center py-8">
              <div className="text-yellow-400 mb-2 text-lg">
                ⚠️ Data Format Issue
              </div>
              <div className="text-blue-200 text-sm">
                Expected metrics data, but received article data instead.
                <br />
                Please check your backend API configuration.
              </div>
            </div>
          )}
      </div>

      {/* Дополнительная информация о метриках */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-6 lg:p-8 border border-emerald-400/20"
      >
        <h4 className="text-xl font-bold text-white mb-4">
          {t("vestnik.metrics.about.title")}
        </h4>
        <p className="text-blue-100 mb-6 leading-relaxed">
          {t("vestnik.metrics.about.description")}
        </p>
        <div className="flex flex-wrap gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all shadow-lg font-medium"
          >
            {t("vestnik.metrics.about.learnMore")}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all font-medium"
          >
            {t("vestnik.metrics.about.journalPolicy")}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Vestnik;
