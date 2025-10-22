// Instructions.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const Instructions = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isVisible, setIsVisible] = useState(false);
  const [activeUpdate, setActiveUpdate] = useState(0);
  const [isDownloading, setIsDownloading] = useState(null);
  
  const [backendData, setBackendData] = useState({
    title: '',
    subtitle: '',
    categories: {},
    documents: [],
    importantUpdates: [],
    loading: true,
    error: null
  });
  
  const sectionRef = useRef(null);

  const getApiLanguage = useCallback(() => {
    const langMap = {
      'en': 'en',
      'ru': 'ru',
      'kg': 'kg'
    };
    return langMap[i18n.language] || 'en';
  }, [i18n.language]);

  const fetchBackendData = useCallback(async () => {
    try {
      setBackendData(prev => ({ 
        ...prev, 
        loading: true, 
        error: null 
      }));
      
      const lang = getApiLanguage();
      
      // Пробуем разные эндпоинты
      const endpoints = [
        `/api/student-clubs/instructions-page/?lang=${lang}`,
        `/api/instructions-page/?lang=${lang}`,
        `/api/student-clubs/instructions/documents/?lang=${lang}`
      ];
      
      let response = null;
      let data = null;
      
      // Пробуем последовательно разные эндпоинты
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          response = await fetch(endpoint);
          
          if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              data = await response.json();
              console.log('Successfully fetched data from:', endpoint, data);
              break;
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch from ${endpoint}:`, error);
          continue;
        }
      }
      
      if (!data) {
        // Если данные не пришли, используем демо-данные
        console.warn('No data received from any endpoint, using demo data');
        data = getDemoData(lang);
      }
      
      // Обрабатываем разные форматы ответа
      let processedData = data;
      
      // Если ответ содержит results (пагинация)
      if (data.results) {
        processedData = data.results;
      }
      
      // Если это отдельные массивы, объединяем их
      if (data.documents && data.categories) {
        processedData = data;
      }
      
      setBackendData({
        title: processedData.title || t('instructions.title'),
        subtitle: processedData.subtitle || t('instructions.subtitle'),
        categories: processedData.categories || getDemoCategories(lang),
        documents: processedData.documents || processedData || [],
        importantUpdates: processedData.importantUpdates || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching instructions data:', error);
      
      // Используем демо-данные в случае ошибки
      const lang = getApiLanguage();
      const demoData = getDemoData(lang);
      
      setBackendData({
        title: demoData.title,
        subtitle: demoData.subtitle,
        categories: demoData.categories,
        documents: demoData.documents,
        importantUpdates: demoData.importantUpdates,
        loading: false,
        error: error.message
      });
    }
  }, [getApiLanguage, t]);

  // Демо-данные для тестирования
  const getDemoData = (lang) => {
    const demoData = {
      en: {
        title: "Instructions & Documents",
        subtitle: "Academic documents and instructions for students",
        categories: {
          'academic': 'Academic',
          'admission': 'Admission',
          'financial': 'Financial',
          'general': 'General'
        },
        documents: [
          {
            id: 1,
            name: "Student Handbook 2025",
            description: "Complete guide for students with academic policies and campus rules",
            category: "academic",
            format: "PDF",
            size: "2.5 MB",
            version: "1.0",
            pages: 45,
            downloads: 123,
            tags: ["handbook", "guide", "rules"],
            downloadUrl: "/media/instructions/handbook.pdf",
            lastUpdated: "Oct 15, 2025"
          },
          {
            id: 2,
            name: "Admission Requirements",
            description: "Detailed admission requirements and application process",
            category: "admission",
            format: "PDF",
            size: "1.2 MB",
            version: "2.1",
            pages: 23,
            downloads: 89,
            tags: ["admission", "requirements"],
            downloadUrl: "/media/instructions/admission.pdf",
            lastUpdated: "Sep 20, 2025"
          },
          {
            id: 3,
            name: "Scholarship Application Form",
            description: "Official scholarship application form for academic year 2025-2026",
            category: "financial",
            format: "DOCX",
            size: "0.8 MB",
            version: "1.5",
            pages: 8,
            downloads: 156,
            tags: ["scholarship", "financial", "form"],
            downloadUrl: "/media/instructions/scholarship.docx",
            lastUpdated: "Nov 1, 2025"
          }
        ],
        importantUpdates: [
          {
            id: 1,
            title: "New Document Upload System",
            description: "We have updated our document management system for better performance",
            date: "Oct 15, 2025"
          },
          {
            id: 2,
            title: "Updated Academic Calendar",
            description: "Academic calendar for 2025-2026 has been updated with new dates",
            date: "Oct 10, 2025"
          }
        ]
      },
      ru: {
        title: "Инструкции и Документы",
        subtitle: "Академические документы и инструкции для студентов",
        categories: {
          'academic': 'Академические',
          'admission': 'Поступление',
          'financial': 'Финансовые',
          'general': 'Общие'
        },
        documents: [
          {
            id: 1,
            name: "Справочник Студента 2025",
            description: "Полное руководство для студентов с академической политикой и правилами кампуса",
            category: "academic",
            format: "PDF",
            size: "2.5 МБ",
            version: "1.0",
            pages: 45,
            downloads: 123,
            tags: ["справочник", "руководство", "правила"],
            downloadUrl: "/media/instructions/handbook.pdf",
            lastUpdated: "15 окт. 2025"
          }
        ],
        importantUpdates: [
          {
            id: 1,
            title: "Новая система загрузки документов",
            description: "Мы обновили нашу систему управления документами для лучшей производительности",
            date: "15 окт. 2025"
          }
        ]
      },
      kg: {
        title: "Нускамалар жана Документтер",
        subtitle: "Студенттер үчүн академиялык документтер жана нускамалар",
        categories: {
          'academic': 'Академиялык',
          'admission': 'Кабыл алуу',
          'financial': 'Каржылык',
          'general': 'Жалпы'
        },
        documents: [
          {
            id: 1,
            name: "Студенттердин Колдонмосу 2025",
            description: "Академиялык саясат жана кампус эрежелери менен студенттер үчүн толук колдонмо",
            category: "academic",
            format: "PDF",
            size: "2.5 МБ",
            version: "1.0",
            pages: 45,
            downloads: 123,
            tags: ["колдонмо", "жетекчи", "эрежелер"],
            downloadUrl: "/media/instructions/handbook.pdf",
            lastUpdated: "15-окт 2025"
          }
        ],
        importantUpdates: [
          {
            id: 1,
            title: "Документ жүктөөнүн жаңы системасы",
            description: "Жакшыраак өндүрүмдүүлүк үчүн документтерди башкаруу системасын жаңырттык",
            date: "15-окт 2025"
          }
        ]
      }
    };
    
    return demoData[lang] || demoData.en;
  };

  const getDemoCategories = (lang) => {
    const categories = {
      en: {
        'academic': 'Academic',
        'admission': 'Admission',
        'financial': 'Financial',
        'general': 'General'
      },
      ru: {
        'academic': 'Академические',
        'admission': 'Поступление',
        'financial': 'Финансовые',
        'general': 'Общие'
      },
      kg: {
        'academic': 'Академиялык',
        'admission': 'Кабыл алуу',
        'financial': 'Каржылык',
        'general': 'Жалпы'
      }
    };
    return categories[lang] || categories.en;
  };

  useEffect(() => {
    fetchBackendData();
  }, []);

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

  useEffect(() => {
    if (backendData.importantUpdates.length > 0) {
      const interval = setInterval(() => {
        setActiveUpdate((prev) => (prev + 1) % backendData.importantUpdates.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [backendData.importantUpdates]);

  const categories = ["all", ...new Set(backendData.documents.map(doc => doc.category).filter(Boolean))];

  const filteredDocuments = backendData.documents.filter((doc) => {
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesSearch = 
      doc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  const handleDownload = async (documentId, documentName) => {
    setIsDownloading(documentId);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const document = backendData.documents.find(doc => doc.id === documentId);
      if (document?.downloadUrl) {
        window.open(document.downloadUrl, "_blank");
        
        // Increment download count
        try {
          await fetch(`/api/student-clubs/instructions/documents/${documentId}/`);
        } catch (error) {
          console.warn('Could not increment download count:', error);
        }
      }
      
    } catch (error) {
      console.error("Error downloading document:", error);
    } finally {
      setIsDownloading(null);
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-lg border border-white/20 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 animate-pulse">
            <div className="h-12 bg-white/10 rounded-xl"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-12 bg-white/10 rounded-xl"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white/5 rounded-2xl p-6 animate-pulse">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-white/10 rounded"></div>
              <div className="h-3 bg-white/10 rounded w-5/6"></div>
            </div>
            <div className="h-10 bg-white/10 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const ErrorMessage = ({ onRetry }) => (
    <div className="text-center py-12">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <h3 className="text-2xl text-white mb-4">{t('instructions.errorTitle')}</h3>
      <p className="text-blue-200 mb-6">{backendData.error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300"
      >
        {t('instructions.retry')}
      </button>
    </div>
  );

  console.log('Current backend data:', backendData);
  console.log('Filtered documents:', filteredDocuments);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-8 lg:py-12 overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">📚</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">📋</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🎓</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 lg:mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            📚
          </motion.div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
            {backendData.title}
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-4 rounded-full"></div>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
            {backendData.subtitle}
          </p>
        </motion.div>

        {backendData.loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/5 rounded-2xl p-4 lg:p-6 backdrop-blur-lg border border-white/20 shadow-2xl mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t("instructions.searchPlaceholder")}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-white placeholder-blue-200 backdrop-blur-sm"
                    />
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 text-lg">
                      🔍
                    </span>
                  </div>
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-white backdrop-blur-sm"
                >
                  <option value="all" className="bg-slate-800">
                    {t("instructions.categories.all")}
                  </option>
                  {categories
                    .filter((cat) => cat !== "all")
                    .map((category) => (
                      <option
                        key={category}
                        value={category}
                        className="bg-slate-800"
                      >
                        {backendData.categories[category] || category}
                      </option>
                    ))}
                </select>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mb-8"
            >
              {filteredDocuments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 col-span-full"
                >
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-emerald-400 text-3xl mx-auto mb-4 backdrop-blur-sm">
                    {backendData.documents.length === 0 ? "📚" : "🔍"}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {backendData.documents.length === 0 
                      ? t("instructions.noDocumentsAvailable")
                      : t("instructions.noDocuments")
                    }
                  </h3>
                  <p className="text-blue-200">
                    {backendData.documents.length === 0
                      ? t("instructions.checkBackLater")
                      : t("instructions.tryChangingSearch")
                    }
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  <AnimatePresence>
                    {filteredDocuments.map((document, index) => (
                      <DocumentCard 
                        key={document.id}
                        document={document} 
                        index={index}
                        isDownloading={isDownloading === document.id}
                        onDownload={() => handleDownload(document.id, document.name)}
                        categories={backendData.categories}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>

            {backendData.importantUpdates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-2xl p-6 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-4 text-center flex items-center justify-center">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white mr-3 shadow-lg">
                    🚨
                  </div>
                  {t("instructions.importantUpdatesTitle")}
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeUpdate}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-white text-sm lg:text-base">
                          {backendData.importantUpdates[activeUpdate]?.title}
                        </span>
                        <span className="text-emerald-300 text-xs bg-emerald-500/20 px-2 py-1 rounded-full">
                          {backendData.importantUpdates[activeUpdate]?.date}
                        </span>
                      </div>
                      <p className="text-blue-100 text-sm">
                        {backendData.importantUpdates[activeUpdate]?.description}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex flex-col gap-3">
                    {backendData.importantUpdates.map((update, index) => (
                      <motion.button
                        key={update.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveUpdate(index)}
                        className={`p-3 rounded-xl backdrop-blur-sm border text-left transition-all duration-300 ${
                          activeUpdate === index
                            ? "bg-emerald-500/20 border-emerald-400/50 shadow-lg"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium text-sm">
                            {update.title}
                          </span>
                          <span className="text-emerald-300 text-xs">
                            {update.date}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

// DocumentCard component остается таким же как в предыдущем коде
const DocumentCard = ({ document, index, isDownloading, onDownload, categories }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const getFileIcon = (format) => {
    const icons = {
      PDF: "📕",
      DOC: "📘",
      DOCX: "📘",
      XLS: "📊",
      XLSX: "📊",
      PPT: "📽️",
      PPTX: "📽️",
      ZIP: "📦",
    };
    return icons[format?.toUpperCase()] || "📄";
  };

  const getCategoryName = (category) => {
    return categories[category] || category;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white/5 rounded-2xl border border-white/20 overflow-hidden hover:border-emerald-400/50 backdrop-blur-sm group transition-all duration-300 h-full flex flex-col"
    >
      <div className="p-4 lg:p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <motion.div
              animate={{ rotate: isHovered ? [0, -10, 10, 0] : 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl text-emerald-400 flex-shrink-0"
            >
              {getFileIcon(document.format)}
            </motion.div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-base lg:text-lg leading-tight group-hover:text-emerald-300 transition-colors line-clamp-2">
                {document.name}
              </h3>
              <span className="inline-block px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-xs font-medium mt-2">
                {document.format}
              </span>
            </div>
          </div>
        </div>

        <p className="text-blue-100 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {document.description}
        </p>

        <div className="flex items-center justify-between text-xs text-blue-200 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">📊 {document.size}</span>
            <span className="flex items-center">🔄 v{document.version}</span>
          </div>
          <span className="text-xs bg-white/10 text-blue-200 px-2 py-1 rounded-lg">
            {getCategoryName(document.category)}
          </span>
        </div>

        <div className="space-y-2 text-xs text-blue-200 mb-4">
          {document.lastUpdated && (
            <div className="flex justify-between">
              <span>{t("instructions.document.updated")}:</span>
              <span className="font-medium text-emerald-300">{document.lastUpdated}</span>
            </div>
          )}
          {document.pages && (
            <div className="flex justify-between">
              <span>{t("instructions.document.pages")}:</span>
              <span className="font-medium text-emerald-300">{document.pages}</span>
            </div>
          )}
          {document.downloads && (
            <div className="flex justify-between">
              <span>{t("instructions.document.downloads")}:</span>
              <span className="font-medium text-emerald-300">{document.downloads}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-3 mt-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDownload}
            disabled={isDownloading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {t("instructions.document.downloading")}
              </>
            ) : (
              <>
                <span className="mr-2">📥</span>
                {t("instructions.document.download")}
              </>
            )}
          </motion.button>
        </div>

        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {document.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Instructions;