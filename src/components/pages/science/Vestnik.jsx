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

  const [backendData, setBackendData] = useState({
    stats: [],
    featuredIssues: [],
    recentIssues: [],
    recentArticles: [],
    loading: false,
    error: null
  });

  const getApiLanguage = useCallback(() => {
    const langMap = {
      'en': 'en',
      'ru': 'ru',
      'kg': 'kg'
    };
    return langMap[i18n.language] || 'ru';
  }, [i18n.language]);

  const fetchBackendData = useCallback(async () => {
    try {
      setBackendData(prev => ({ ...prev, loading: true, error: null }));

      const lang = getApiLanguage();
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/science/vestnik-page/?lang=${lang}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setBackendData({
        stats: [],
        featuredIssues: data.results || [],
        recentIssues: [],
        recentArticles: [],
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

  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData, i18n.language]);

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

  useEffect(() => {
    if (currentView === "archive" && backendData.recentIssues.length > 0) {
      const interval = setInterval(() => {
        setActiveIssue((prev) => (prev + 1) % backendData.recentIssues.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentView, backendData.recentIssues]);

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
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">📰</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🔬</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">📚</div>
        <div className="absolute top-2/3 right-1/3 text-5xl opacity-5">⚗️</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
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

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden p-6 lg:p-8"
        >
          {backendData.error ? (
            <ErrorMessage onRetry={fetchBackendData} />
          ) : (
            <AnimatePresence mode="wait">
              <CurrentIssue
                data={backendData.featuredIssues}
                loading={backendData.loading}
                t={t}
              />
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </section>
  );
};
const CurrentIssue = ({ data, loading, t }) => {
  const [expandedYear, setExpandedYear] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  // Функция для обработки клика по году
  const handleYearClick = (year) => {
    if (expandedYear === year) {
      setExpandedYear(null);
      setSelectedIssue(null);
      setPdfFile(null);
    } else {
      setExpandedYear(year);
      const yearData = data.find(y => y.year === year);
      if (yearData && yearData.releases.length > 0) {
        handleIssueClick(yearData.releases[0]);
      }
    }
  };

  // Функция для обработки клика по выпуску
  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    setPdfFile(issue.pdf);
  };

  if (loading) {
    return (
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
  }

  // Если данных нет, показать сообщение
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-blue-400 text-6xl mb-4">📚</div>
        <h2 className="text-2xl text-white mb-4">
          {t('vestnik.current.noDataTitle', 'Данные не найдены')}
        </h2>
        <p className="text-blue-200">
          {t('vestnik.current.noDataDescription', 'Не удалось загрузить данные вестника')}
        </p>
      </div>
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
      <div className="flex flex-col lg:flex-row gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:w-1/4"
        >
          <div className="bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 p-6 h-full">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-emerald-400">📅</span>
              {t("vestnik.current.yearsArchive", "Архив по годам")}
            </h4>

            <div className="space-y-2">
              {data.map((yearData) => (
                <div key={yearData.year} className="mb-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleYearClick(yearData.year)}
                    className={`w-full flex justify-between items-center px-4 py-3 rounded-xl transition-all duration-200 ${expandedYear === yearData.year
                      ? "bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border border-emerald-400/30"
                      : "bg-white/5 hover:bg-white/10 border border-white/10"
                      }`}
                  >
                    <span className="text-lg font-semibold text-white">
                      {yearData.year}
                    </span>
                    <motion.span
                      animate={{ rotate: expandedYear === yearData.year ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl font-bold text-emerald-400"
                    >
                      {expandedYear === yearData.year ? "−" : "+"}
                    </motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {expandedYear === yearData.year && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2 ml-4 pl-4 border-l-2 border-emerald-400/30 space-y-2 overflow-hidden"
                      >
                        {yearData.releases.map((issue) => (
                          <motion.button
                            key={issue.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleIssueClick(issue)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${selectedIssue?.id === issue.id
                              ? "bg-emerald-500/20 text-white"
                              : "text-blue-200 hover:bg-white/5"
                              }`}
                          >
                            <div className="text-sm font-medium">{issue.title}</div>
                            <div className="text-xs opacity-70 mt-1">📄 PDF</div>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:w-2/4"
        >
          <div className="bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 p-6 h-full">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">📖</span>
                {selectedIssue ?
                  t("vestnik.current.issueContent", "Содержание выпуска") :
                  t("vestnik.current.selectIssue", "Выберите выпуск")}
              </h4>
              {selectedIssue && (
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm font-medium">
                  {t("vestnik.current.selected", "Выбрано")}
                </div>
              )}
            </div>

            {selectedIssue ? (
              <motion.div
                key={selectedIssue.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h5 className="text-2xl font-bold text-white mb-3">
                    {selectedIssue.title}
                  </h5>
                </div>

                <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-xl p-6 border border-emerald-400/20">
                  <p className="text-blue-100 text-lg leading-relaxed whitespace-pre-line">
                    {selectedIssue.description}
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 text-emerald-400 opacity-50">📚</div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  {t("vestnik.current.selectIssueTitle", "Выберите выпуск")}
                </h4>
                <p className="text-blue-200">
                  {t("vestnik.current.selectIssueDescription", "Нажмите на выпуск в левой панели, чтобы увидеть его содержимое")}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:w-1/4"
        >
          <div className="bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 p-6 h-full">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="text-emerald-400">📄</span>
              {t("vestnik.current.pdfViewer", "Просмотр PDF")}
            </h4>

            {pdfFile ? (
              <motion.div
                key={pdfFile}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-500/20 to-emerald-500/20 rounded-2xl aspect-[3/4] flex flex-col items-center justify-center border-2 border-emerald-400/30 backdrop-blur-sm">
                    <div className="text-6xl mb-4 text-emerald-400">📰</div>
                    <div className="text-white font-bold text-lg text-center px-4">
                      {selectedIssue?.title}
                    </div>
                    <div className="text-blue-200 text-sm mt-2">
                      {expandedYear} {t("vestnik.current.year", "год")}
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs shadow-lg">
                    PDF
                  </div>
                </div>

                <div className="space-y-4">

                  <div className="flex flex-col gap-3">
                    
  
                
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(pdfFile, "_blank")}
                      className="w-full bg-white/10 text-white py-3 rounded-xl font-medium hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center gap-2"
                    >
                      <span>{t("vestnik.actions.preview", "Предпросмотр")}</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 text-emerald-400 opacity-50">📄</div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  {t("vestnik.current.noPdfTitle", "PDF не выбран")}
                </h4>
                <p className="text-blue-200">
                  {t("vestnik.current.noPdfDescription", "Выберите выпуск для просмотра PDF файла")}
                </p>
              </div>
            )}
          </div>
        </motion.div>
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

        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onYearChange("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-sm border ${selectedYear === "all"
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
              className={`px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-sm border ${selectedYear === year
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => onIssueChange(index)}
                className={`bg-white/5 rounded-2xl p-6 backdrop-blur-sm border transition-all duration-300 cursor-pointer ${activeIssue === index
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
                    className={`text-2xl transition-all ${activeIssue === index
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
                    className={`px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-lg ${issue.pdf_file
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
    return (
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

export default Vestnik;