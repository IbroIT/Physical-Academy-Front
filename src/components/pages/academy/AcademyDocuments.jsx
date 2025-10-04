// DocumentsPage.jsx
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDocuments, useSearch } from '../../../hooks/useApi'
import { PageLoading, ErrorDisplay, EmptyState, CardSkeleton } from '../../common/Loading';

const AcademyDocuments = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // API integration - hooks must always be called in the same order
  const filters = activeFilter !== 'all' ? { is_active: true } : {};
  const { documents: apiDocuments, loading, error, refetch } = useDocuments(filters);
  const { query, setQuery, results: searchResults, loading: searching } = useSearch('documents');

  // Use search results if searching, otherwise use API documents
  const documents = searchTerm ? searchResults : (apiDocuments || []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setQuery(value);
  };

  // Фильтрация документов
  const filteredDocuments = useMemo(() => {
    if (!documents || !Array.isArray(documents)) return [];

    return documents.filter(doc => {
      const matchesFilter = activeFilter === 'all' || doc.is_active;
      const matchesSearch = searchTerm === '' ||
        (doc.title && doc.title.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [documents, activeFilter, searchTerm]);

  // Early returns AFTER all hooks are called
  if (loading && !documents.length) {
    return <PageLoading message={t('documents.loading', 'Загрузка документов...')} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
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

  // Получение иконки для типа документа
  const getFileIcon = (fileType) => {
    const icons = {
      pdf: '📕',
      doc: '📘',
      docx: '📘',
      xls: '📗',
      xlsx: '📗',
      internal: '📋',
      academic: '🎓',
      financial: '💰',
      legal: '⚖️'
    };

    if (!fileType) return '📄';

    // Extract file extension from URL if fileType is a URL
    const extension = fileType.includes('.') ?
      fileType.split('.').pop().toLowerCase() :
      fileType.toLowerCase();

    return icons[extension] || '📄';
  };

  // Форматирование размера файла
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '';
    const sizes = ['Байт', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Get file extension from URL
  const getFileExtension = (url) => {
    if (!url) return '';
    const extension = url.split('.').pop().toUpperCase();
    return extension;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('documents.title', 'Документы академии')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('documents.subtitle', 'Официальные документы и материалы академии')}
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Строка поиска */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder={t('documents.searchPlaceholder', 'Поиск документов...')}
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
              {searching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Фильтры */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeFilter === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                }`}
            >
              {t('documents.filters.all', 'Все документы')}
            </button>

            <button
              onClick={() => setActiveFilter('active')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeFilter === 'active'
                ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                }`}
            >
              {t('documents.filters.active', 'Активные')}
            </button>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {filteredDocuments.length}
            </div>
            <div className="text-gray-600">{t('documents.stats.found', 'Найдено документов')}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {documents.filter(doc => doc.is_active).length}
            </div>
            <div className="text-gray-600">{t('documents.stats.active', 'Активных документов')}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {documents.length}
            </div>
            <div className="text-gray-600">{t('documents.stats.total', 'Всего документов')}</div>
          </div>
        </div>

        {/* Список документов */}
        {loading && filteredDocuments.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 hover:border-green-300"
              >
                <div className="p-6">
                  {/* Заголовок документа */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{getFileIcon(doc.file_url)}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                        {doc.title}
                      </h3>

                      {/* Multilingual titles */}
                      <div className="mb-3 space-y-1">
                        {doc.title_ru && doc.title_ru !== doc.title && (
                          <p className="text-sm text-gray-600">
                            🇷🇺 <strong>RU:</strong> {doc.title_ru}
                          </p>
                        )}
                        {doc.title_en && doc.title_en !== doc.title && (
                          <p className="text-sm text-gray-600">
                            🇺🇸 <strong>EN:</strong> {doc.title_en}
                          </p>
                        )}
                        {doc.title_ky && doc.title_ky !== doc.title && (
                          <p className="text-sm text-gray-600">
                            🇰🇬 <strong>KG:</strong> {doc.title_ky}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      {(doc.description_ru || doc.description_en || doc.description_ky) && (
                        <div className="mb-3 bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-semibold text-gray-700 mb-2">📝 {t('documents.description', 'Описание')}:</p>
                          {doc.description_ru && (
                            <div className="mb-2">
                              <p className="text-xs text-gray-600 font-medium">🇷🇺 {t('languages.russian', 'Русский')}:</p>
                              <p className="text-sm text-gray-700">{doc.description_ru}</p>
                            </div>
                          )}
                          {doc.description_en && (
                            <div className="mb-2">
                              <p className="text-xs text-gray-600 font-medium">🇺🇸 English:</p>
                              <p className="text-sm text-gray-700">{doc.description_en}</p>
                            </div>
                          )}
                          {doc.description_ky && (
                            <div className="mb-2">
                              <p className="text-xs text-gray-600 font-medium">🇰🇬 {t('languages.kyrgyz', 'Кыргызча')}:</p>
                              <p className="text-sm text-gray-700">{doc.description_ky}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Метаданные */}
                      <div className="space-y-1 text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
                        <p className="font-semibold text-blue-800 mb-2">📊 {t('documents.metadata', 'Метаданные')}:</p>

                        {doc.upload_date && (
                          <p className="flex items-center justify-between">
                            <span className="flex items-center">
                              <span className="mr-2">📅</span>
                              {t('documents.uploaded', 'Загружен')}:
                            </span>
                            <span className="font-medium">{new Date(doc.upload_date).toLocaleDateString('ru-RU')}</span>
                          </p>
                        )}

                        {doc.file_url && (
                          <p className="flex items-center justify-between">
                            <span className="flex items-center">
                              <span className="mr-2">📎</span>
                              {t('documents.type', 'Тип')}:
                            </span>
                            <span className="font-medium">{getFileExtension(doc.file_url)}</span>
                          </p>
                        )}

                        {doc.file && doc.file !== doc.file_url && (
                          <p className="flex items-center justify-between">
                            <span className="flex items-center">
                              <span className="mr-2">📁</span>
                              {t('documents.path', 'Путь')}:
                            </span>
                            <span className="font-medium text-xs">{doc.file}</span>
                          </p>
                        )}
                      </div>

                      {/* Статус */}
                      <div className="mt-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${doc.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                          }`}>
                          <div className={`w-2 h-2 rounded-full mr-1 ${doc.is_active ? 'bg-green-400' : 'bg-gray-400'
                            }`}></div>
                          {doc.is_active ? `✅ ${t('documents.status.active', 'Активный')}` : `❌ ${t('documents.status.inactive', 'Неактивный')}`}
                        </span>
                      </div>

                      {/* API ID for developers */}
                      <div className="text-xs text-gray-400 mt-2">
                        🔧 ID: {doc.id}
                      </div>
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="flex space-x-3">
                    {doc.file_url && (
                      <>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg text-center font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center"
                        >
                          <span className="mr-2">👁️</span>
                          {t('documents.actions.view', 'Просмотр')}
                        </a>
                        <a
                          href={doc.file_url}
                          download
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg text-center font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center"
                        >
                          <span className="mr-2">⬇️</span>
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
            icon={<div className="text-6xl mb-4">📄</div>}
          />
        )}
      </div>
    </div>
  );
};

export default AcademyDocuments;