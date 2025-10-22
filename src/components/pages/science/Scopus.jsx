import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../../common/Loading";

const Scopus = () => {
  const { t, i18n } = useTranslation();
  const [hoveredMetric, setHoveredMetric] = useState(null);
  const [hoveredPublication, setHoveredPublication] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    stats: [],
    publications: [],
    documentTypes: [],
    metrics: [],
    authors: [],
    journals: [],
    publishers: [],
    publicationAuthors: [],
    sections: [],
    loading: false,
    error: null
  });

  const sectionRef = useRef(null);

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
      
      const endpoints = [
        '/api/science/scopus-stats/',
        '/api/science/scopus-publications/',
        '/api/science/scopus-document-types/',
        '/api/science/scopus-metrics/',
        '/api/science/scopus-authors/',
        '/api/science/scopus-journals/',
        '/api/science/scopus-publishers/',
        '/api/science/scopus-publication-authors/',
        '/api/science/scopus-sections/'
      ];

      const responses = await Promise.all(
        endpoints.map(async (url) => {
          try {
            const fullUrl = `${url}?lang=${lang}`;
            const response = await fetch(fullUrl);
            
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
        publications: responses[1].results || [],
        documentTypes: responses[2].results || [],
        metrics: responses[3].results || [],
        authors: responses[4].results || [],
        journals: responses[5].results || [],
        publishers: responses[6].results || [],
        publicationAuthors: responses[7].results || [],
        sections: responses[8].results || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching Scopus data:', error);
      setBackendData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load data'
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

  // Преобразование данных в формат, ожидаемый компонентом
  const transformData = () => {
    const { stats, publications, documentTypes, metrics, journals, publicationAuthors, authors } = backendData;

    // Подсчет документов по типам
    const docTypeCounts = {};
    publications.forEach(pub => {
      // Здесь нужно определить тип документа для каждой публикации
      // Временное решение - используем первый доступный тип
      const docType = documentTypes[0]?.label || 'Article';
      docTypeCounts[docType] = (docTypeCounts[docType] || 0) + 1;
    });

    const totalPublications = publications.length;
    const documentTypesWithStats = documentTypes.map((docType, index) => {
      const count = docTypeCounts[docType.label] || 0;
      const percentage = totalPublications > 0 ? Math.round((count / totalPublications) * 100) : 0;
      
      // Цвета для круговой диаграммы
      const colors = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6'];
      
      return {
        name: docType.label,
        count: count,
        percentage: percentage,
        color: colors[index % colors.length]
      };
    });

    // Преобразование публикаций
    const transformedPublications = publications.map(pub => {
      // Находим журнал
      const journal = journals.find(j => j.id === pub.journal) || {};
      
      // Находим авторов для этой публикации
      const pubAuthors = publicationAuthors
        .filter(pa => pa.publication === pub.id)
        .map(pa => {
          const author = authors.find(a => a.id === pa.author);
          return author ? `${author.first_name} ${author.last_name}` : '';
        })
        .filter(name => name)
        .join(', ');

      return {
        title: pub[`title_${getApiLanguage()}`] || pub.title,
        authors: pubAuthors || 'Unknown Authors',
        journal: journal[`title_${getApiLanguage()}`] || journal.title || 'Unknown Journal',
        year: pub.year,
        document_type: documentTypes[0]?.label || 'Article',
        subject_area: 'Computer Science', // Временное значение
        citation_count: pub.citation_count || 0,
        url: pub.url || '#'
      };
    });

    // Статистика для нижних карточек
    const statsCards = [
      { icon: "📊", value: metrics[0]?.citation_count || "0", label: t("science.sections.scopus.totalCitations") },
      { icon: "📈", value: metrics[0]?.h_index || "0", label: t("science.sections.scopus.hIndex") },
      { icon: "📚", value: journals.length.toString(), label: t("science.sections.scopus.journals") },
      { icon: "👨‍🎓", value: authors.length.toString(), label: t("science.sections.scopus.authors") }
    ];

    // Внешние ссылки (можно оставить статичными или получать с бэкенда)
    const links = [
      {
        icon: "🔍",
        title: t("science.sections.scopus.scopusProfile"),
        description: t("science.sections.scopus.viewOfficialProfile"),
        url: "https://www.scopus.com"
      },
      {
        icon: "📖",
        title: t("science.sections.scopus.researchPortal"),
        description: t("science.sections.scopus.accessPublications"),
        url: "#"
      }
    ];

    return {
      title: t("science.sections.scopus.title"),
      subtitle: t("science.sections.scopus.subtitle"),
      metrics: stats.map(stat => ({
        value: stat.value,
        label: stat.label,
        description: "" // Можно добавить описание если будет в API
      })),
      document_types: documentTypesWithStats,
      publications: transformedPublications,
      stats: statsCards,
      links: links
    };
  };

  const data = transformData();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  // Компонент загрузки
  if (backendData.loading) {
    return <Loading />;
  }

  // Компонент ошибки
  if (backendData.error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
        >
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl text-white mb-4">
            {t("common.errorLoading")}
          </h2>
          <p className="text-blue-200 mb-6">
            {backendData.error}
          </p>
          <button
            onClick={fetchBackendData}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
          >
            {t("common.retry")}
          </button>
        </motion.div>
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

        {/* Научные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🔬</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          📊
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">📈</div>
        <div className="absolute top-2/3 right-1/3 text-5xl opacity-5">🎓</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="space-y-8"
        >
          {/* Заголовок с логотипом */}
          <motion.div variants={itemVariants} className="text-center">
            <motion.div 
              className="inline-flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-2xl px-8 py-4 shadow-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-xl">🔍</span>
              </motion.div>
              <div className="text-left">
                <h2 className="text-2xl font-bold text-white">{data.title}</h2>
                <p className="text-blue-200 text-sm">{data.subtitle}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Основные метрики */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
          >
            {data.metrics.map((metric, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                onMouseEnter={() => setHoveredMetric(index)}
                onMouseLeave={() => setHoveredMetric(null)}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group text-center relative overflow-hidden"
              >
                {/* Background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <motion.div
                    className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300"
                    animate={
                      hoveredMetric === index ? { scale: 1.1 } : { scale: 1 }
                    }
                  >
                    {metric.value}
                  </motion.div>
                  <div className="text-white font-semibold text-sm mb-2">
                    {metric.label}
                  </div>
                  <div className="text-blue-200 text-xs">
                    {metric.description}
                  </div>
                </div>

                {/* Decorative element */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* Document Types Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10"
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                📑
              </motion.div>
              {t("science.sections.scopus.documentTypes")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                {data.document_types.map((docType, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: docType.color }}
                      ></div>
                      <span className="text-blue-200 text-sm">
                        {docType.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-white font-semibold text-sm">
                        {docType.count}
                      </span>
                      <span className="text-blue-300 text-xs ml-2">
                        ({docType.percentage}%)
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  {data.document_types.map((docType, index) => {
                    // Calculate each segment's position in the pie chart
                    let cumulativePercentage = 0;
                    for (let i = 0; i < index; i++) {
                      cumulativePercentage += data.document_types[i].percentage;
                    }
                    const startAngle = (cumulativePercentage / 100) * 360;
                    const endAngle =
                      startAngle + (docType.percentage / 100) * 360;

                    // Create SVG path for this segment
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.2 }}
                        className="absolute inset-0"
                      >
                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                          <path
                            d={`M50,50 L${
                              50 + 45 * Math.cos((startAngle * Math.PI) / 180)
                            },${
                              50 + 45 * Math.sin((startAngle * Math.PI) / 180)
                            } A45,45 0 ${
                              endAngle - startAngle > 180 ? 1 : 0
                            },1 ${
                              50 + 45 * Math.cos((endAngle * Math.PI) / 180)
                            },${
                              50 + 45 * Math.sin((endAngle * Math.PI) / 180)
                            } Z`}
                            fill={docType.color}
                            stroke="#1e293b"
                            strokeWidth="0.5"
                          />
                        </svg>
                      </motion.div>
                    );
                  })}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-slate-800 rounded-full w-16 h-16 flex items-center justify-center">
                      <span className="text-xs text-blue-200">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Publications */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10"
          >
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center text-white mr-3 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                📝
              </motion.div>
              {t("science.sections.scopus.publications")}
            </h3>
            <div className="space-y-3">
              {data.publications.map((publication, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredPublication(index)}
                  onMouseLeave={() => setHoveredPublication(null)}
                  className="p-3 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                >
                  <div className="flex justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors">
                        {publication.title}
                      </div>
                      <div className="text-blue-200 text-xs">
                        {publication.authors}
                      </div>
                      <div className="mt-1 flex items-center space-x-3 text-xs">
                        <span className="text-emerald-400">
                          {publication.journal}
                        </span>
                        <span className="text-blue-300">
                          {publication.year}
                        </span>
                        <span className="bg-blue-500/20 px-2 py-0.5 rounded-md text-blue-300">
                          {publication.document_type}
                        </span>
                        <span className="text-yellow-300">
                          {publication.subject_area}
                        </span>
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold text-sm ml-3 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30 self-start">
                      {publication.citation_count}
                    </div>
                  </div>

                  {/* Link to publication */}
                  <AnimatePresence>
                    {hoveredPublication === index && publication.url && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 overflow-hidden"
                      >
                        <a
                          href={publication.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span>View publication</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {data.stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/10 hover:border-blue-400/30 transition-all duration-500 transform hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xl">{stat.icon}</div>
                  <div className="text-2xl font-bold text-blue-400 group-hover:scale-105 transition-transform">
                    {stat.value}
                  </div>
                </div>
                <div className="text-blue-200 text-xs">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* External Links */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {data.links &&
              data.links.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/10 ${
                    index % 2 === 0
                      ? "hover:border-blue-400/30"
                      : "hover:border-emerald-400/30"
                  } transition-all duration-500 transform hover:-translate-y-1 group cursor-pointer block`}
                >
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className={`w-12 h-12 ${
                        index % 2 === 0
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                          : "bg-gradient-to-r from-emerald-500 to-green-500"
                      } rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      whileHover={{ rotate: 5 }}
                    >
                      <span className="text-xl">{link.icon}</span>
                    </motion.div>
                    <div>
                      <h3
                        className={`font-bold text-white text-lg ${
                          index % 2 === 0
                            ? "group-hover:text-blue-300"
                            : "group-hover:text-emerald-300"
                        } transition-colors`}
                      >
                        {link.title}
                      </h3>
                      <p className="text-blue-200 text-sm">
                        {link.description}
                      </p>
                    </div>
                  </div>
                </motion.a>
              ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Scopus;