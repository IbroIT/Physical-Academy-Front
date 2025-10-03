// DocumentsPage.jsx
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const AcademyDocuments = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const documents = t('documents.documentsList', { returnObjects: true });
  const filters = t('documents.filters', { returnObjects: true });

  // Фильтрация документов
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesFilter = activeFilter === 'all' || doc.type === activeFilter;
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [documents, activeFilter, searchTerm]);

  // Получение иконки для типа документа
  const getFileIcon = (fileType) => {
    const icons = {
      pdf: '📕',
      doc: '📘',
      xls: '📗',
      internal: '📋',
      academic: '🎓',
      financial: '💰',
      legal: '⚖️'
    };
    return icons[fileType] || '📄';
  };

  // Форматирование размера файла
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Байт', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('documents.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('documents.subtitle')}
          </p>
        </div>

        {/* Поиск и фильтры */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Строка поиска */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder={t('documents.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>

          {/* Фильтры */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
              }`}
            >
              {t('documents.filterAll')}
            </button>
            
            {Object.entries(filters).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeFilter === key
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Счетчик документов */}
        <div className="mb-6">
          <p className="text-gray-600">
            {t('documents.foundDocuments', { count: filteredDocuments.length })}
          </p>
        </div>

        {/* Список документов */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDocuments.map((document, index) => (
            <div
              key={document.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="p-6">
                {/* Заголовок и иконка */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">
                      {getFileIcon(document.fileType || document.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {document.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {filters[document.type] || document.type}
                        </span>
                        {document.fileSize && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                            {formatFileSize(document.fileSize)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Описание */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {document.description}
                </p>

                {/* Дополнительная информация и кнопка скачивания */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {document.date && (
                      <span>Опубликован: {document.date}</span>
                    )}
                    {document.version && (
                      <span className="ml-4">Версия: {document.version}</span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => window.open(document.downloadLink, '_blank')}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold"
                  >
                    <span>📥</span>
                    <span>{t('documents.downloadButton')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Сообщение, если документов не найдено */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {t('documents.noDocumentsFound')}
            </h3>
            <p className="text-gray-600">
              {t('documents.tryChangingFilters')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcademyDocuments;