import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const ScientificPublications = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  const publications = t('science.sections.publications.publications', { returnObjects: true });

  const filteredPublications = useMemo(() => {
    let filtered = publications.filter(pub => 
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
      pub.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filterYear !== 'all') {
      filtered = filtered.filter(pub => pub.year === filterYear);
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'citations') return b.citations - a.citations;
      if (sortBy === 'date') return new Date(b.date) - new Date(a.date);
      return 0;
    });
  }, [publications, searchTerm, filterYear, sortBy]);

  const years = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a);

  return (
    <div className="space-y-8">
      {/* Статистика с анимацией */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {t('science.sections.publications.stats', { returnObjects: true }).map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-2 animate-count">
              {stat.value}
            </div>
            <div className="text-gray-600 font-medium">{stat.label}</div>
            <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-green-400 to-blue-400 transition-all duration-500 mt-2"></div>
          </div>
        ))}
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск публикаций..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
          </div>
          
          <select
            value={filterYear}
            onChange={(e) => setFilterYear(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="all">Все годы</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          >
            <option value="date">По дате</option>
            <option value="citations">По цитированиям</option>
          </select>
        </div>
      </div>

      {/* Список публикаций */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPublications.map((pub, index) => (
          <PublicationCard key={index} publication={pub} index={index} />
        ))}
      </div>

      {filteredPublications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600">Публикации не найдены</h3>
          <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
};

const PublicationCard = ({ publication, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2 leading-tight">
            {publication.title}
          </h3>
          <div className="flex flex-wrap gap-1 mb-3">
            {publication.authors.map((author, i) => (
              <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                {author}
              </span>
            ))}
          </div>
        </div>
        <span className="text-3xl opacity-60 group-hover:opacity-100 transition-opacity">📖</span>
      </div>
      
      <p className={`text-gray-600 mb-4 leading-relaxed transition-all duration-300 ${
        isExpanded ? 'line-clamp-none' : 'line-clamp-3'
      }`}>
        {publication.abstract}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          {publication.journal}
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
          {publication.year}
        </span>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
          {publication.citations} цитирований
        </span>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
          {publication.type}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {publication.keywords.slice(0, 3).map((keyword, i) => (
          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
            #{keyword}
          </span>
        ))}
        {publication.keywords.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
            +{publication.keywords.length - 3}
          </span>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-gray-500 text-sm font-mono">DOI: {publication.doi}</span>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.open(publication.pdfLink, '_blank');
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold text-sm"
          >
            <span>📥</span>
            <span>PDF</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(publication.citation);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 text-sm"
          >
            <span>📋</span>
            <span>Цитировать</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScientificPublications;