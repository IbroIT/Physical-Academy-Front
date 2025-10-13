import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import apiService from "../../../services/api";

const ScientificPublications = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([]);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [activeStat, setActiveStat] = useState(0);
  const sectionRef = useRef(null);

  // Get translations data
  const publicationsData = t("science.sections.publications", {
    returnObjects: true,
  });

  // New state for API data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [publications, setPublications] = useState([]);
  const [stats, setStats] = useState([]);
  const [featured, setFeatured] = useState([]);

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

  // Separate effect to start counters when both conditions are met
  useEffect(() => {
    if (isVisible && stats.length > 0) {
      startCounters();
    }
  }, [isVisible, stats]);

  // Автопереключение статистики
  useEffect(() => {
    if (stats.length === 0) return;
    const interval = setInterval(() => {
      setActiveStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  const startCounters = () => {
    if (stats.length === 0) return;
    const targetValues = stats.map((stat) => {
      // Handle both string and number values
      if (typeof stat.value === "string") {
        return parseInt(stat.value.replace(/\D/g, "")) || 0;
      }
      if (typeof stat.value === "number") {
        return stat.value;
      }
      return 0;
    });
    const duration = 2000;
    const steps = 60;
    const stepValues = targetValues.map((target) => target / steps);

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      setCounterValues((prev) =>
        prev.map((value, index) => {
          if (currentStep <= steps) {
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

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getPublicationsPage(i18n.language);
        const newStats = data.stats || [];
        setStats(newStats);
        setCounterValues(new Array(newStats.length).fill(0));
        setFeatured(data.featured || []);
        setPublications(data.publications || []);
      } catch (err) {
        console.error("Failed to fetch publications:", err);
        setError(err.message);
        // Fallback to translation data if API fails
        const fallbackData = t("science.sections.publications", {
          returnObjects: true,
        });
        setStats(fallbackData.stats || []);
        setPublications(fallbackData.publications || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language]);

  const filteredPublications = useMemo(() => {
    let filtered = publications.filter(
      (pub) =>
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pub.author &&
          pub.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pub.abstract &&
          pub.abstract.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filterYear !== "all") {
      filtered = filtered.filter((pub) => pub.year === parseInt(filterYear));
    }

    return filtered.sort((a, b) => {
      if (sortBy === "citations")
        return (b.citation_count || 0) - (a.citation_count || 0);
      if (sortBy === "date") {
        const dateA = pub.publication_date
          ? new Date(a.publication_date)
          : new Date(a.year, 0);
        const dateB = pub.publication_date
          ? new Date(b.publication_date)
          : new Date(b.year, 0);
        return dateB - dateA;
      }
      return 0;
    });
  }, [publications, searchTerm, filterYear, sortBy]);

  const years = [...new Set(publications.map((pub) => pub.year))].sort(
    (a, b) => b - a
  );

  const resetFilters = () => {
    setSearchTerm("");
    setFilterYear("all");
    setSortBy("date");
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон с научными элементами */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Научные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🔬</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          📊
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">📚</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🎓</div>
      </div>

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
            📚
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t("science.sections.publications.title")}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t("science.sections.publications.subtitle")}
          </p>
        </motion.div>

        {/* Статистика с анимацией */}
        {stats.length === 0 ? (
          <div className="bg-white/5 rounded-3xl p-8 mb-12 lg:mb-16 text-center border border-white/20">
            <div className="text-yellow-400 text-xl mb-2">
              ⚠️ No Statistics Available
            </div>
            <div className="text-blue-200">
              Please add publication statistics in the Django admin panel.
            </div>
            <div className="text-blue-300 text-sm mt-2">
              Stats loaded: {stats.length}, Loading:{" "}
              {loading ? "true" : "false"}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12 lg:mb-16">
            {/* Активная статистика */}
            <motion.div
              key={activeStat}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                  {stats[activeStat]?.icon}
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {stats[activeStat]?.label}
                  </h3>
                  <div className="text-4xl lg:text-5xl font-bold text-emerald-400 font-mono">
                    {stats[activeStat]?.value
                      ? typeof stats[activeStat].value === "string" &&
                        stats[activeStat].value.includes("%")
                        ? `${Math.round(counterValues[activeStat] || 0)}%`
                        : typeof stats[activeStat].value === "string" &&
                          stats[activeStat].value.includes("+")
                        ? `${Math.round(counterValues[activeStat] || 0)}+`
                        : Math.round(counterValues[activeStat] || 0)
                      : "0"}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Вся статистика */}
            <div className="lg:col-span-3 grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                    activeStat === index
                      ? "border-emerald-400/50 bg-white/10 shadow-lg"
                      : "border-white/10 hover:border-emerald-400/30"
                  }`}
                  onClick={() => setActiveStat(index)}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl mb-3">{stat.icon}</div>
                  <div className="text-2xl font-bold text-emerald-400 mb-1 font-mono">
                    {stat.value
                      ? typeof stat.value === "string" &&
                        stat.value.includes("%")
                        ? `${Math.round(counterValues[index] || 0)}%`
                        : typeof stat.value === "string" &&
                          stat.value.includes("+")
                        ? `${Math.round(counterValues[index] || 0)}+`
                        : Math.round(counterValues[index] || 0)
                      : "0"}
                  </div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Фильтры и поиск */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/5 rounded-3xl p-6 lg:p-8 backdrop-blur-lg border border-white/20 shadow-2xl mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
            <div className="relative">
              <label className="block text-sm font-medium text-blue-200 mb-2">
                {publicationsData.filters.searchLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={publicationsData.filters.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-lg text-white placeholder-blue-300 backdrop-blur-sm"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300 text-xl">
                  🔍
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                {publicationsData.filters.yearLabel}
              </label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-lg text-white backdrop-blur-sm"
              >
                <option value="all" className="bg-slate-800">
                  {publicationsData.filters.allYears}
                </option>
                {years.map((year) => (
                  <option key={year} value={year} className="bg-slate-800">
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                {publicationsData.filters.sortLabel}
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-lg text-white backdrop-blur-sm"
              >
                <option value="date" className="bg-slate-800">
                  {publicationsData.filters.sortByDate}
                </option>
                <option value="citations" className="bg-slate-800">
                  {publicationsData.filters.sortByCitations}
                </option>
              </select>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="w-full px-4 py-3 border-2 border-white/20 text-blue-200 rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 font-medium text-lg backdrop-blur-sm"
              >
                {publicationsData.filters.resetButton}
              </motion.button>
            </div>
          </div>

          {/* Active filters info */}
          <AnimatePresence>
            {(searchTerm || filterYear !== "all") && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 flex flex-wrap gap-2"
              >
                {searchTerm && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm backdrop-blur-sm"
                  >
                    {publicationsData.filters.searchFilter}: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-2 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </motion.span>
                )}
                {filterYear !== "all" && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm backdrop-blur-sm"
                  >
                    {publicationsData.filters.yearFilter}: {filterYear}
                    <button
                      onClick={() => setFilterYear("all")}
                      className="ml-2 hover:text-white transition-colors"
                    >
                      ×
                    </button>
                  </motion.span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-blue-200 text-lg">
              {publicationsData.results.found}:{" "}
              <span className="font-semibold text-white">
                {filteredPublications.length}
              </span>
            </p>
            {filteredPublications.length > 0 && (
              <p className="text-blue-300 text-sm">
                {publicationsData.results.sorting}:{" "}
                {sortBy === "date"
                  ? publicationsData.results.sortByDate
                  : publicationsData.results.sortByCitations}
              </p>
            )}
          </div>

          {/* Список публикаций */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredPublications.map((pub, index) => (
                <PublicationCard
                  key={pub.id || index}
                  publication={pub}
                  index={index}
                  onSelect={setSelectedPublication}
                />
              ))}
            </AnimatePresence>
          </div>

          {filteredPublications.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm"
            >
              <div className="text-6xl mb-4 text-blue-300 opacity-60">🔍</div>
              <h3 className="text-2xl font-semibold text-white mb-2">
                {publicationsData.noResults.title}
              </h3>
              <p className="text-blue-200 text-lg mb-6">
                {publicationsData.noResults.description}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg"
              >
                {publicationsData.noResults.resetButton}
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Publication Modal */}
        <AnimatePresence>
          {selectedPublication && (
            <PublicationModal
              publication={selectedPublication}
              onClose={() => setSelectedPublication(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const PublicationCard = ({ publication, index, onSelect }) => {
  const { t } = useTranslation();
  const publicationsData = t("science.sections.publications", {
    returnObjects: true,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    onSelect(publication);
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    if (action === "pdf") {
      if (publication.pdf_url) {
        window.open(publication.pdf_url, "_blank");
      }
    } else if (action === "cite") {
      // Generate citation from publication data
      const citation = `${publication.author} (${publication.year}). ${
        publication.title
      }. ${publication.journal}. DOI: ${publication.doi || "N/A"}`;
      navigator.clipboard.writeText(citation);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-3xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-500 backdrop-blur-sm group cursor-pointer relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors duration-300 mb-3 leading-tight">
              {publication.title}
            </h3>
            {publication.image_url && (
              <div className="mb-3">
                <img
                  src={publication.image_url}
                  alt={publication.title}
                  className="w-full h-32 object-cover rounded-xl"
                />
              </div>
            )}
            <div className="flex flex-wrap gap-2 mb-3">
              <motion.span
                className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-xl text-sm font-medium hover:bg-blue-500/30 transition-colors duration-300 backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
              >
                {publication.author}
              </motion.span>
            </div>
          </div>
          <span className="text-3xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 flex-shrink-0 ml-4">
            📖
          </span>
        </div>

        <p className="text-blue-200 mb-4 leading-relaxed line-clamp-3">
          {publication.abstract}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {publication.journal && (
            <span className="px-3 py-2 bg-emerald-500/20 text-emerald-300 rounded-xl text-sm font-medium backdrop-blur-sm">
              {publication.journal}
            </span>
          )}
          <span className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-xl text-sm font-medium backdrop-blur-sm">
            {publication.year}
          </span>
          {publication.publication_date && (
            <span className="px-3 py-2 bg-cyan-500/20 text-cyan-300 rounded-xl text-sm font-medium backdrop-blur-sm">
              {new Date(publication.publication_date).toLocaleDateString()}
            </span>
          )}
          <span className="px-3 py-2 bg-purple-500/20 text-purple-300 rounded-xl text-sm font-medium backdrop-blur-sm">
            {publication.citation_count || 0} citations
          </span>
          <span className="px-3 py-2 bg-orange-500/20 text-orange-300 rounded-xl text-sm font-medium backdrop-blur-sm">
            {publication.publication_type}
          </span>
        </div>

        {/* Keywords section - can be removed since not in the new model or add custom tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <motion.span
            className="px-3 py-1 bg-white/10 text-blue-200 rounded-xl text-sm hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            #{publication.publication_type}
          </motion.span>
          {publication.impact_factor && (
            <motion.span
              className="px-3 py-1 bg-yellow-500/20 text-yellow-200 rounded-xl text-sm hover:bg-yellow-500/30 transition-colors duration-300 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              IF: {publication.impact_factor}
            </motion.span>
          )}
        </div>

        <div className="flex justify-between items-center">
          {publication.doi && (
            <span className="text-blue-300 text-sm font-mono bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
              DOI: {publication.doi}
            </span>
          )}
          {publication.url && !publication.doi && (
            <a
              href={publication.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 text-sm font-mono bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              External Link
            </a>
          )}
          <div className="flex gap-2">
            {publication.pdf_url && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleButtonClick(e, "pdf")}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-medium text-sm shadow-lg"
              >
                <span>📥</span>
                <span>Download PDF</span>
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleButtonClick(e, "cite")}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-blue-200 rounded-xl hover:bg-white/20 transition-all duration-300 font-medium text-sm backdrop-blur-sm"
            >
              <span>📋</span>
              <span>{publicationsData.card.citeButton}</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PublicationModal = ({ publication, onClose }) => {
  const { t } = useTranslation();
  const publicationsData = t("science.sections.publications", {
    returnObjects: true,
  });
  const [copied, setCopied] = useState(false);

  const handleCopyCitation = () => {
    const citation = `${publication.author} (${publication.year}). ${
      publication.title
    }. ${publication.journal}. ${
      publication.doi ? `DOI: ${publication.doi}` : ""
    }`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 bg-white/5">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-white">
              {publicationsData.modal.title}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300 text-white"
            >
              ×
            </motion.button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              {publication.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-xl text-sm font-medium backdrop-blur-sm">
                {publication.author}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">
                  {publicationsData.modal.journal}
                </h4>
                <p className="text-blue-200">{publication.journal}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">
                  {publicationsData.modal.year}
                </h4>
                <p className="text-blue-200">{publication.year}</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">
                  Publication Type
                </h4>
                <p className="text-blue-200">{publication.publication_type}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Citations</h4>
                <p className="text-emerald-400 font-semibold">
                  {publication.citation_count || 0}
                </p>
              </div>
              {publication.doi && (
                <div>
                  <h4 className="font-semibold text-white mb-2">DOI</h4>
                  <p className="text-blue-200 font-mono">{publication.doi}</p>
                </div>
              )}
              {publication.publication_date && (
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Publication Date
                  </h4>
                  <p className="text-blue-200">
                    {new Date(
                      publication.publication_date
                    ).toLocaleDateString()}
                  </p>
                </div>
              )}
              {publication.impact_factor && (
                <div>
                  <h4 className="font-semibold text-white mb-2">
                    Impact Factor
                  </h4>
                  <p className="text-yellow-400 font-semibold">
                    {publication.impact_factor}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">
              {publicationsData.modal.abstract}
            </h4>
            <p className="text-blue-200 leading-relaxed">
              {publication.abstract}
            </p>
          </div>

          {/* Remove keywords section for now since not in new model */}

          <div>
            <h4 className="font-semibold text-white mb-2">Citation</h4>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <p className="text-blue-200 font-mono text-sm">
                {`${publication.author} (${publication.year}). ${
                  publication.title
                }. ${publication.journal}. ${
                  publication.doi ? `DOI: ${publication.doi}` : ""
                }`}
              </p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            {publication.pdf_url && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(publication.pdf_url, "_blank")}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-2xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg"
              >
                <span>📥</span>
                <span>Download PDF</span>
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyCitation}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 text-blue-200 rounded-2xl hover:bg-white/20 transition-all duration-300 font-medium backdrop-blur-sm"
            >
              <span>📋</span>
              <span>
                {copied
                  ? publicationsData.modal.copied
                  : publicationsData.modal.copyButton}
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ScientificPublications;
