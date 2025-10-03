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
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
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
                placeholder="Поиск ресурсов, сервисов и ссылок..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
            </div>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
        <h3 className="text-xl font-bold text-gray-800 mb-4">🔥 Популярные ресурсы</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {data.popularResources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                {resource.icon}
              </div>
              <div className="font-semibold text-sm">{resource.name}</div>
            </a>
          ))}
        </div>
      </div>

      {/* Все ресурсы */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource, index) => (
          <ResourceCard key={index} resource={resource} index={index} />
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Ресурсы не найдены</h3>
          <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
        </div>
      )}

      {/* Быстрый доступ */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
        <h3 className="text-2xl font-bold mb-4 text-center">⚡ Быстрый доступ</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.quickAccess.map((access, index) => (
            <a
              key={index}
              href={access.url}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-2xl mb-2">{access.icon}</div>
              <div className="text-sm font-medium">{access.name}</div>
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
      className="bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-300 overflow-hidden hover:shadow-xl transition-all duration-500 group transform hover:-translate-y-2 block"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        {/* Заголовок и иконка */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className={`text-3xl transition-transform duration-300 ${
              isHovered ? 'scale-110' : ''
            }`}>
              {resource.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-purple-600 transition-colors">
                {resource.name}
              </h3>
              <span className="inline-block px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium mt-1">
                {resource.categoryLabel}
              </span>
            </div>
          </div>
          
          <div className="text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:translate-x-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </div>

        {/* Описание */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {resource.description}
        </p>

        {/* Мета-информация */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <span className="flex items-center">
              🔗 {resource.type}
            </span>
            {resource.access && (
              <span className={`px-2 py-1 rounded-full text-xs ${
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
              <span className="text-yellow-500">⭐</span>
              <span className="font-medium">{resource.rating}</span>
            </div>
          )}
        </div>

        {/* Теги */}
        <div className="flex flex-wrap gap-1">
          {resource.tags.map((tag, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
              #{tag}
            </span>
          ))}
        </div>

        {/* Дополнительная информация при наведении */}
        <div className={`mt-4 space-y-2 text-xs text-gray-500 transition-all duration-300 overflow-hidden ${
          isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
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
              <span className="font-medium text-purple-600">{resource.features.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

export default UsefulLinks;