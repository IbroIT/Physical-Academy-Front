import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Instructions = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const data = t('students.instructions', { returnObjects: true });

  const categories = ['all', ...new Set(data.documents.map(doc => doc.category))];

  const filteredDocuments = data.documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {data.title}
        </h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-sm">
          {data.subtitle}
        </p>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск инструкций и документов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          >
            <option value="all">Все категории</option>
            {categories.filter(cat => cat !== 'all').map(category => (
              <option key={category} value={category}>
                {data.categories[category]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Документы */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((document, index) => (
          <DocumentCard key={index} document={document} index={index} />
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-2xl mx-auto mb-3">
            🔍
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-1">Документы не найдены</h3>
          <p className="text-gray-500 text-sm">Попробуйте изменить параметры поиска</p>
        </div>
      )}

      {/* Важные обновления */}
      <div className="bg-blue-600 rounded-xl p-4 text-white">
        <h3 className="text-lg font-bold mb-3 text-center flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-700 rounded-lg flex items-center justify-center text-white mr-2">
            🚨
          </div>
          Важные обновления
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.importantUpdates.map((update, index) => (
            <div key={index} className="bg-blue-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm">{update.title}</span>
                <span className="text-blue-200 text-xs">{update.date}</span>
              </div>
              <p className="text-blue-100 text-xs">{update.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DocumentCard = ({ document, index }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    // Имитация скачивания
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsDownloading(false);
    // В реальном приложении здесь будет логика скачивания
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
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 overflow-hidden hover:shadow-md transition-all duration-200 group">
      <div className="p-4">
        {/* Заголовок и иконка */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-2">
            <div className="text-2xl text-blue-600">
              {getFileIcon(document.format)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                {document.name}
              </h3>
              <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium mt-1">
                {document.format}
              </span>
            </div>
          </div>
        </div>

        {/* Описание */}
        <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-3">
          {document.description}
        </p>

        {/* Мета-информация */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              📊 {document.size}
            </span>
            <span className="flex items-center">
              🔄 v{document.version}
            </span>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
            {document.category}
          </span>
        </div>

        {/* Дополнительная информация */}
        <div className="space-y-1 text-xs text-gray-500 mb-3">
          {document.lastUpdated && (
            <div className="flex justify-between">
              <span>Обновлено:</span>
              <span className="font-medium">{document.lastUpdated}</span>
            </div>
          )}
          {document.pages && (
            <div className="flex justify-between">
              <span>Страниц:</span>
              <span className="font-medium">{document.pages}</span>
            </div>
          )}
          {document.downloads && (
            <div className="flex justify-between">
              <span>Скачиваний:</span>
              <span className="font-medium">{document.downloads}</span>
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                Загрузка...
              </>
            ) : (
              <>
                <span className="mr-1.5">📥</span>
                Скачать
              </>
            )}
          </button>
          
          <button className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center">
            <span className="text-sm">👁️</span>
          </button>
        </div>

        {/* Теги */}
        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {document.tags.map((tag, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructions;