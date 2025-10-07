// DocumentsPage.jsx
import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocuments, useSearch } from '../../../hooks/useApi';
import { PageLoading, ErrorDisplay, EmptyState, CardSkeleton } from '../../common/Loading';

const AcademyDocuments = () => {
  const { t, i18n } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedDocId, setExpandedDocId] = useState(null);

  // API integration
  const filters = activeFilter !== 'all' ? { is_active: true } : {};
  const { documents: apiDocuments, loading, error, refetch } = useDocuments(filters);
  const { query, setQuery, results: searchResults, loading: searching } = useSearch('documents');

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

  // File type icons
  const getFileIcon = useCallback((fileType) => {
    const iconMap = {
      pdf: '📕',
      doc: '📘',
      docx: '📘',
      xls: '📗',
      xlsx: '📗',
      ppt: '📙',
      pptx: '📙',
      zip: '📦',
      txt: '📄',
      default: '📄'
    };

    if (!fileType) return iconMap.default;

    const extension = fileType.includes('.') ?
      fileType.split('.').pop().toLowerCase() :
      fileType.toLowerCase();

    return iconMap[extension] || iconMap.default;
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes) => {
    if (!bytes || bytes === 0) return t('documents.unknownSize', 'Неизвестно');
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
    return <PageLoading message={t('documents.loading', 'Загрузка документов...')} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 py-8 px-4">
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

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('documents.title', 'Документы академии')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('documents.subtitle', 'Официальные документы и материалы академии')}
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full lg:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('documents.searchPlaceholder', 'Поиск документов...')}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="newest">{t('documents.sort.newest', 'Сначала новые')}</option>
                <option value="oldest">{t('documents.sort.oldest', 'Сначала старые')}</option>
                <option value="name_asc">{t('documents.sort.nameAsc', 'По имени (А-Я)')}</option>
                <option value="name_desc">{t('documents.sort.nameDesc', 'По имени (Я-А)')}</option>
              </select>

              {/* Filter Buttons */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeFilter === 'all'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('documents.filters.all', 'Все')}
                </button>
                <button
                  onClick={() => setActiveFilter('active')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeFilter === 'active'
                      ? 'bg-white text-green-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {t('documents.filters.active', 'Активные')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow duration-200">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {documentStats.found}
            </div>
            <div className="text-gray-600 font-medium">{t('documents.stats.found', 'Найдено документов')}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow duration-200">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {documentStats.active}
            </div>
            <div className="text-gray-600 font-medium">{t('documents.stats.active', 'Активных документов')}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow duration-200">
            <div className="text-2xl font-bold text-gray-600 mb-2">
              {documentStats.total}
            </div>
            <div className="text-gray-600 font-medium">{t('documents.stats.total', 'Всего документов')}</div>
          </div>
        </div>

        {/* Documents Grid */}
        {loading && processedDocuments.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : processedDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 ${
                  !doc.is_active ? 'opacity-60' : ''
                }`}
              >
                <div className="p-6">
                  {/* Document Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{getFileIcon(doc.file_url)}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                        {getLocalizedTitle(doc)}
                      </h3>
                      
                      {/* Status Badge */}
                      <div className="mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          doc.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            doc.is_active ? 'bg-green-400' : 'bg-gray-400'
                          }`}></div>
                          {doc.is_active 
                            ? t('documents.status.active', 'Активный')
                            : t('documents.status.inactive', 'Неактивный')
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Localized Description */}
                  {getLocalizedDescription(doc) && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {getLocalizedDescription(doc)}
                      </p>
                    </div>
                  )}

                  {/* Document Metadata */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    {doc.upload_date && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {t('documents.uploaded', 'Загружен')}
                        </span>
                        <span className="font-medium text-gray-900">
                          {new Date(doc.upload_date).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                    )}

                    {doc.file_url && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {t('documents.type', 'Тип')}
                        </span>
                        <span className="font-medium text-gray-900">
                          {getFileExtension(doc.file_url)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Expandable Details */}
                  {expandedDocId === doc.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {t('documents.details', 'Детали документа')}
                      </h4>
                      
                      {/* Multilingual Titles */}
                      <div className="space-y-2 text-sm">
                        {doc.title_ru && (
                          <div className="flex items-center">
                            <span className="w-8 text-gray-500">🇷🇺</span>
                            <span className="text-gray-700">{doc.title_ru}</span>
                          </div>
                        )}
                        {doc.title_en && (
                          <div className="flex items-center">
                            <span className="w-8 text-gray-500">🇺🇸</span>
                            <span className="text-gray-700">{doc.title_en}</span>
                          </div>
                        )}
                        {doc.title_ky && (
                          <div className="flex items-center">
                            <span className="w-8 text-gray-500">🇰🇬</span>
                            <span className="text-gray-700">{doc.title_ky}</span>
                          </div>
                        )}
                      </div>

                      {/* API ID */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <span className="text-xs text-gray-500">
                          ID: {doc.id}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => toggleDocumentDetails(doc.id)}
                      className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 text-sm"
                    >
                      {expandedDocId === doc.id 
                        ? t('documents.actions.hide', 'Скрыть')
                        : t('documents.actions.details', 'Подробнее')
                      }
                    </button>
                    
                    {doc.file_url && doc.is_active && (
                      <>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {t('documents.actions.view', 'Просмотр')}
                        </a>
                        <a
                          href={doc.file_url}
                          download
                          className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg text-center font-semibold hover:bg-green-700 transition-colors duration-200 text-sm flex items-center justify-center"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          {t('documents.actions.download', 'Скачать')}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            message={searchTerm ?
              t('documents.empty.search', `Документы по запросу "${searchTerm}" не найдены`) :
              t('documents.empty.no_documents', 'Документы не найдены')
            }
            icon={
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            }
            action={
              searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setQuery('');
                  }}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {t('documents.actions.clearSearch', 'Очистить поиск')}
                </button>
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default AcademyDocuments;