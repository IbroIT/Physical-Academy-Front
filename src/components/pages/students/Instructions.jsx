import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Instructions = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [activeUpdate, setActiveUpdate] = useState(0);
  const sectionRef = useRef(null);

  const data = t('students.instructions', { returnObjects: true });
  const categories = ['all', ...new Set(data.documents.map(doc => doc.category))];

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

  // Автопереключение важных обновлений
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUpdate((prev) => (prev + 1) % data.importantUpdates.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [data.importantUpdates.length]);

  const filteredDocuments = data.documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-8 lg:py-12 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Спортивные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏆</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">⚽</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🏃‍♂️</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
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
            {data.title}
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-4 rounded-full"></div>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Фильтры и поиск */}
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
                  placeholder={t('students.instructions.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-white placeholder-blue-200 backdrop-blur-sm"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400 text-lg">🔍</span>
              </div>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all text-white backdrop-blur-sm"
            >
              <option value="all" className="bg-slate-800">{t('students.instructions.categories.all')}</option>
              {categories.filter(cat => cat !== 'all').map(category => (
                <option key={category} value={category} className="bg-slate-800">
                  {data.categories[category]}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Документы */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8"
        >
          <AnimatePresence>
            {filteredDocuments.map((document, index) => (
              <motion.div
                key={document.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                layout
              >
                <DocumentCard document={document} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredDocuments.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-emerald-400 text-3xl mx-auto mb-4 backdrop-blur-sm">
              🔍
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('students.instructions.noDocuments')}
            </h3>
            <p className="text-blue-200">
              {t('students.instructions.tryChangingSearch')}
            </p>
          </motion.div>
        )}

        {/* Важные обновления */}
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
            {t('students.instructions.importantUpdatess')}
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
                    {data.importantUpdates[activeUpdate]?.title}
                  </span>
                  <span className="text-emerald-300 text-xs bg-emerald-500/20 px-2 py-1 rounded-full">
                    {data.importantUpdates[activeUpdate]?.date}
                  </span>
                </div>
                <p className="text-blue-100 text-sm">
                  {data.importantUpdates[activeUpdate]?.description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col gap-3">
              {data.importantUpdates.map((update, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveUpdate(index)}
                  className={`p-3 rounded-xl backdrop-blur-sm border text-left transition-all duration-300 ${
                    activeUpdate === index
                      ? 'bg-emerald-500/20 border-emerald-400/50 shadow-lg'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
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
      </div>
    </section>
  );
};

const DocumentCard = ({ document, index }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsDownloading(false);
    window.open(document.downloadUrl, '_blank');
  };

  const getFileIcon = (format) => {
    const icons = {
      'PDF': '📕',
      'DOC': '📘',
      'DOCX': '📘',
      'XLS': '📊',
      'XLSX': '📊',
      'PPT': '📽️',
      'PPTX': '📽️',
      'ZIP': '📦',
      'default': '📄'
    };
    return icons[format] || icons.default;
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white/5 rounded-2xl border border-white/20 overflow-hidden hover:border-emerald-400/50 backdrop-blur-sm group transition-all duration-300 h-full flex flex-col"
    >
      <div className="p-4 lg:p-6 flex-1 flex flex-col">
        {/* Заголовок и иконка */}
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

        {/* Описание */}
        <p className="text-blue-100 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
          {document.description}
        </p>

        {/* Мета-информация */}
        <div className="flex items-center justify-between text-xs text-blue-200 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              📊 {document.size}
            </span>
            <span className="flex items-center">
              🔄 v{document.version}
            </span>
          </div>
          <span className="text-xs bg-white/10 text-blue-200 px-2 py-1 rounded-lg">
            {document.category}
          </span>
        </div>

        {/* Дополнительная информация */}
        <div className="space-y-2 text-xs text-blue-200 mb-4">
          {document.lastUpdated && (
            <div className="flex justify-between">
              <span>Обновлено:</span>
              <span className="font-medium text-emerald-300">{document.lastUpdated}</span>
            </div>
          )}
          {document.pages && (
            <div className="flex justify-between">
              <span>Страниц:</span>
              <span className="font-medium text-emerald-300">{document.pages}</span>
            </div>
          )}
          {document.downloads && (
            <div className="flex justify-between">
              <span>Скачиваний:</span>
              <span className="font-medium text-emerald-300">{document.downloads}</span>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex space-x-3 mt-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Загрузка...
              </>
            ) : (
              <>
                <span className="mr-2">📥</span>
                Скачать
              </>
            )}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors duration-300 flex items-center justify-center backdrop-blur-sm"
          >
            <span className="text-sm">👁️</span>
          </motion.button>
        </div>

        {/* Теги */}
        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {document.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs">
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