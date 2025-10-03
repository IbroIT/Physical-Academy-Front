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
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          {data.title}
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          {data.subtitle}
        </p>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск инструкций и документов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
            </div>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document, index) => (
          <DocumentCard key={index} document={document} index={index} />
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Документы не найдены</h3>
          <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
        </div>
      )}

      {/* Важные обновления */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <h3 className="text-2xl font-bold mb-4 text-center">🚨 Важные обновления</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.importantUpdates.map((update, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{update.title}</span>
                <span className="text-orange-200 text-sm">{update.date}</span>
              </div>
              <p className="text-orange-100 text-sm">{update.description}</p>
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
    <div 
      className="bg-white rounded-2xl border-2 border-gray-200 hover:border-green-300 overflow-hidden hover:shadow-xl transition-all duration-500 group transform hover:-translate-y-2"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-6">
        {/* Заголовок и иконка */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="text-3xl text-green-500">
              {getFileIcon(document.format)}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-green-600 transition-colors">
                {document.name}
              </h3>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium mt-1">
                {document.format}
              </span>
            </div>
          </div>
        </div>

        {/* Описание */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {document.description}
        </p>

        {/* Мета-информация */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              📊 {document.size}
            </span>
            <span className="flex items-center">
              🔄 v{document.version}
            </span>
          </div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {document.category}
          </span>
        </div>

        {/* Дополнительная информация */}
        <div className="space-y-2 text-xs text-gray-500 mb-4">
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
        <div className="flex space-x-3">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center justify-center transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Скачивание...
              </>
            ) : (
              <>
                <span className="mr-2">📥</span>
                Скачать
              </>
            )}
          </button>
          
          <button className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center group/preview">
            <span className="group-hover/preview:scale-110 transition-transform">👁️</span>
          </button>
        </div>

        {/* Теги */}
        {document.tags && document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {document.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
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