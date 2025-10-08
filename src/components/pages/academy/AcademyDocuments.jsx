// DocumentsPage.jsx
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useDocuments, useSearch } from '../../../hooks/useApi';
import { PageLoading, ErrorDisplay, EmptyState, CardSkeleton } from '../../common/Loading';

const AcademyDocuments = () => {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedDocId, setExpandedDocId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeDocument, setActiveDocument] = useState(null);
  const sectionRef = useRef(null);

  // API integration
  const filters = activeFilter !== 'all' ? { is_active: true } : {};
  const { documents: apiDocuments, loading, error, refetch } = useDocuments(filters);
  const { query, setQuery, results: searchResults, loading: searching } = useSearch('documents');

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

  // Use search results if searching, otherwise use API documents
  const documents = searchTerm ? searchResults : (apiDocuments || []);

  // Handle search with debounce
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setQuery(value);
  }, [setQuery]);

  // Toggle document details
  const toggleDocumentDetails = useCallback((docId) => {
    setExpandedDocId(expandedDocId === docId ? null : docId);
    setActiveDocument(docId);
  }, [expandedDocId]);

  // Filter and sort documents
  const processedDocuments = useMemo(() => {
    if (!documents || !Array.isArray(documents)) return [];

    let filtered = documents.filter(doc => {
      const matchesFilter = activeFilter === 'all' || doc.is_active;
      const matchesSearch = searchTerm === '' ||
        (doc.title && doc.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.title_ru && doc.title_ru.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.title_en && doc.title_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (doc.title_ky && doc.title_ky.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    });

    // Sort documents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.upload_date || b.created_at) - new Date(a.upload_date || a.created_at);
        case 'oldest':
          return new Date(a.upload_date || a.created_at) - new Date(b.upload_date || b.created_at);
        case 'name_asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'name_desc':
          return (b.title || '').localeCompare(a.title || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [documents, activeFilter, searchTerm, sortBy]);

  // Get localized title
  const getLocalizedTitle = useCallback((doc) => {
    const currentLang = i18n.language;
    switch (currentLang) {
      case 'ru': return doc.title_ru || doc.title;
      case 'en': return doc.title_en || doc.title;
      case 'ky': return doc.title_ky || doc.title;
      default: return doc.title;
    }
  }, [i18n.language]);

  // Get localized description
  const getLocalizedDescription = useCallback((doc) => {
    const currentLang = i18n.language;
    switch (currentLang) {
      case 'ru': return doc.description_ru;
      case 'en': return doc.description_en;
      case 'ky': return doc.description_ky;
      default: return doc.description_ru;
    }
  }, [i18n.language]);

  // File type icons and gradients
  const getFileConfig = useCallback((fileType) => {
    const configMap = {
      pdf: { icon: '📕', gradient: 'from-red-500 to-pink-500' },
      doc: { icon: '📘', gradient: 'from-blue-500 to-cyan-500' },
      docx: { icon: '📘', gradient: 'from-blue-500 to-cyan-500' },
      xls: { icon: '📗', gradient: 'from-green-500 to-emerald-500' },
      xlsx: { icon: '📗', gradient: 'from-green-500 to-emerald-500' },
      ppt: { icon: '📙', gradient: 'from-orange-500 to-red-500' },
      pptx: { icon: '📙', gradient: 'from-orange-500 to-red-500' },
      zip: { icon: '📦', gradient: 'from-purple-500 to-pink-500' },
      txt: { icon: '📄', gradient: 'from-gray-500 to-blue-500' },
      default: { icon: '📄', gradient: 'from-blue-500 to-emerald-500' }
    };

    if (!fileType) return configMap.default;

    const extension = fileType.includes('.') ?
      fileType.split('.').pop().toLowerCase() :
      fileType.toLowerCase();

    return configMap[extension] || configMap.default;
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes) => {
    if (!bytes || bytes === 0) return t('documents.unknownSize');
    const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }, [t]);

  // Get file extension
  const getFileExtension = useCallback((url) => {
    if (!url) return '';
    return url.split('.').pop().toUpperCase();
  }, []);

  // Document statistics
  const documentStats = useMemo(() => ({
    total: documents.length,
    active: documents.filter(doc => doc.is_active).length,
    found: processedDocuments.length
  }), [documents, processedDocuments]);

  // Early returns
  if (loading && !documents.length) {
    return <PageLoading message={t('documents.loading')} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ErrorDisplay
            error={error}
            onRetry={refetch}
            className="max-w-md mx-auto"
          />
        </div>
      </div>
    );
  }

  const DocumentCard = ({ doc, index }) => {
    const fileConfig = getFileConfig(doc.file_url);
    const isExpanded = expandedDocId === doc.id;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`bg-white/5 backdrop-blur-lg rounded-3xl border border-white/20 hover:border-emerald-400/50 transition-all duration-500 overflow-hidden group cursor-pointer ${
          activeDocument === doc.id ? 'ring-2 ring-emerald-400 scale-105' : ''
        } ${!doc.is_active ? 'opacity-60' : ''}`}
        onClick={() => setActiveDocument(doc.id)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="p-6 lg:p-8">
          {/* Document Header */}
          <div className="flex items-start space-x-4 lg:space-x-6 mb-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex-shrink-0"
            >
              <div className={`w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r ${fileConfig.gradient} rounded-2xl flex items-center justify-center text-white text-2xl lg:text-3xl shadow-2xl`}>
                {fileConfig.icon}
              </div>
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <motion.h3 
                className="text-xl lg:text-2xl font-bold text-white mb-3 line-clamp-2"
                layout
              >
                {getLocalizedTitle(doc)}
              </motion.h3>
              
              {/* Status Badge */}
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm border ${
                  doc.is_active
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : 'bg-gray-500/20 text-gray-300 border-gray-400/30'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    doc.is_active ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
                  }`}></div>
                  {doc.is_active 
                    ? t('documents.status.active')
                    : t('documents.status.inactive')
                  }
                </span>
              </motion.div>
            </div>
          </div>

          {/* Localized Description */}
          {getLocalizedDescription(doc) && (
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-blue-100 text-lg leading-relaxed line-clamp-2">
                {getLocalizedDescription(doc)}
              </p>
            </motion.div>
          )}

          {/* Document Metadata */}
          <motion.div 
            className="space-y-3 text-blue-100 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {doc.upload_date && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-sm">📅</span>
                  </div>
                  {t('documents.uploaded')}
                </span>
                <span className="font-semibold text-white">
                  {new Date(doc.upload_date).toLocaleDateString('ru-RU')}
                </span>
              </div>
            )}

            {doc.file_url && (
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-sm">📄</span>
                  </div>
                  {t('documents.type')}
                </span>
                <span className="font-semibold text-white">
                  {getFileExtension(doc.file_url)}
                </span>
              </div>
            )}
          </motion.div>

          {/* Expandable Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20"
              >
                <h4 className="font-bold text-white mb-4 text-lg">
                  {t('documents.details')}
                </h4>
                
                {/* Multilingual Titles */}
                <div className="space-y-3 text-sm mb-4">
                  {doc.title_ru && (
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-blue-200">🇷🇺</span>
                      <span className="text-blue-100">{doc.title_ru}</span>
                    </div>
                  )}
                  {doc.title_en && (
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-blue-200">🇺🇸</span>
                      <span className="text-blue-100">{doc.title_en}</span>
                    </div>
                  )}
                  {doc.title_ky && (
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-blue-200">🇰🇬</span>
                      <span className="text-blue-100">{doc.title_ky}</span>
                    </div>
                  )}
                </div>

                {/* API ID */}
                <div className="pt-4 border-t border-white/20">
                  <span className="text-xs text-blue-300">
                    ID: {doc.id}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <motion.div 
            className="flex gap-3 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleDocumentDetails(doc.id)}
              className="flex-1 py-3 px-4 border border-white/20 text-blue-100 rounded-xl font-medium hover:bg-white/10 transition-all duration-300 backdrop-blur-sm text-sm lg:text-base"
            >
              {isExpanded 
                ? t('documents.actions.hide')
                : t('documents.actions.details')
              }
            </motion.button>
            
            {doc.file_url && doc.is_active && (
              <>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-3 px-4 rounded-xl text-center font-semibold hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-lg text-sm lg:text-base flex items-center justify-center gap-2"
                >
                  <span>👁️</span>
                  {t('documents.actions.view')}
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={doc.file_url}
                  download
                  className="flex-1 bg-white text-blue-600 py-3 px-4 rounded-xl text-center font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg text-sm lg:text-base flex items-center justify-center gap-2"
                >
                  <span>⬇️</span>
                  {t('documents.actions.download')}
                </motion.a>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.section
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Документальные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">📚</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">📄</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">📋</div>
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
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            📚
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('documents.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('documents.subtitle')}
          </p>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl mb-8 lg:mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('documents.searchPlaceholder')}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-300 border-t-emerald-400"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Sort */}
              <motion.select
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all duration-300"
              >
                <option value="newest" className="text-gray-800">{t('documents.sort.newest')}</option>
                <option value="oldest" className="text-gray-800">{t('documents.sort.oldest')}</option>
                <option value="name_asc" className="text-gray-800">{t('documents.sort.nameAsc')}</option>
                <option value="name_desc" className="text-gray-800">{t('documents.sort.nameDesc')}</option>
              </motion.select>

              {/* Filter Buttons */}
              <div className="flex bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                    activeFilter === 'all'
                      ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {t('documents.filters.all')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter('active')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                    activeFilter === 'active'
                      ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {t('documents.filters.active')}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12"
        >
          {[
            { value: documentStats.found, label: t('documents.stats.found'), gradient: 'from-blue-500 to-emerald-500' },
            { value: documentStats.active, label: t('documents.stats.active'), gradient: 'from-emerald-500 to-blue-600' },
            { value: documentStats.total, label: t('documents.stats.total'), gradient: 'from-blue-600 to-emerald-600' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
            >
              <div className={`text-3xl lg:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300`}>
                {stat.value}
              </div>
              <div className="text-blue-200 text-sm lg:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Documents Grid */}
        {loading && processedDocuments.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : processedDocuments.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {processedDocuments.map((doc, index) => (
              <DocumentCard key={doc.id} doc={doc} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <EmptyState
              message={searchTerm ?
                t('documents.empty.search', `"${searchTerm}"`) :
                t('documents.empty.no_documents')
              }
              icon={
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-2xl mb-6">
                  📚
                </div>
              }
              action={
                searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSearchTerm('');
                      setQuery('');
                    }}
                    className="mt-6 bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-lg"
                  >
                    {t('documents.actions.clearSearch')}
                  </motion.button>
                )
              }
            />
          </motion.div>
        )}

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 lg:p-12 backdrop-blur-lg border border-white/20 text-center"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            {t('documents.contactInfo.title')}
          </h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('documents.contactInfo.description')}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl"
          >
            {t('documents.contactInfo.button')}
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default AcademyDocuments;