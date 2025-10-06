import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const UsefulLinks = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const data = t('students.links', { returnObjects: true });

  const categories = ['all', ...new Set(data.resources.map(resource => resource.category))];

  const filteredResources = data.resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
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
                placeholder="Поиск ресурсов, сервисов и ссылок..."
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

      {/* Популярные ссылки */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-2">
            🔥
          </div>
          Популярные ресурсы
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {data.popularResources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 rounded-lg p-3 text-white text-center hover:bg-blue-700 transition-colors duration-200 group"
            >
              <div className="text-xl mb-1 group-hover:scale-110 transition-transform duration-200">
                {resource.icon}
              </div>
              <div className="font-semibold text-xs">{resource.name}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Все ресурсы */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((resource, index) => (
          <ResourceCard key={index} resource={resource} index={index} />
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-2xl mx-auto mb-3">
            🔍
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-1">Ресурсы не найдены</h3>
          <p className="text-gray-500 text-sm">Попробуйте изменить параметры поиска</p>
        </div>
      )}

      {/* Быстрый доступ */}
      <div className="bg-blue-600 rounded-xl p-4 text-white">
        <h3 className="text-lg font-bold mb-3 text-center flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-700 rounded-lg flex items-center justify-center text-white mr-2">
            ⚡
          </div>
          Быстрый доступ
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.quickAccess.map((access, index) => (
            <a
              key={index}
              href={access.url}
              className="bg-blue-700 rounded-lg p-3 text-center hover:bg-blue-800 transition-colors duration-200"
            >
              <div className="text-lg mb-1">{access.icon}</div>
              <div className="text-xs font-medium">{access.name}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const ResourceCard = ({ resource, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 overflow-hidden hover:shadow-md transition-all duration-200 group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        {/* Заголовок и иконка */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-2">
            <div className={`text-xl transition-transform duration-200 ${
              isHovered ? 'scale-110' : ''
            }`}>
              {resource.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                {resource.name}
              </h3>
              <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium mt-1">
                {resource.categoryLabel}
              </span>
            </div>
          </div>
          
          <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>

        {/* Описание */}
        <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-3">
          {resource.description}
        </p>

        {/* Мета-информация */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-2">
            <span className="flex items-center">
              🔗 {resource.type}
            </span>
            {resource.access && (
              <span className={`px-1.5 py-0.5 rounded text-xs ${
                resource.access === 'free' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {resource.access === 'free' ? 'Бесплатно' : 'По логину'}
              </span>
            )}
          </div>
          
          {resource.rating && (
            <div className="flex items-center space-x-1">
              <span className="text-yellow-500 text-xs">⭐</span>
              <span className="font-medium text-xs">{resource.rating}</span>
            </div>
          )}
        </div>

        {/* Теги */}
        <div className="flex flex-wrap gap-1">
          {resource.tags.map((tag, i) => (
            <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
              #{tag}
            </span>
          ))}
        </div>

        {/* Дополнительная информация при наведении */}
        <div className={`mt-3 space-y-1 text-xs text-gray-500 transition-all duration-200 overflow-hidden ${
          isHovered ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          {resource.lastUpdated && (
            <div className="flex justify-between">
              <span>Обновлено:</span>
              <span className="font-medium">{resource.lastUpdated}</span>
            </div>
          )}
          {resource.features && (
            <div className="flex justify-between">
              <span>Особенности:</span>
              <span className="font-medium text-blue-600 text-xs">{resource.features.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

export default UsefulLinks;