import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const ScientificPublications = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startCounters();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const startCounters = () => {
    const stats = t('science.sections.publications.stats', { returnObjects: true });
    const targetValues = stats.map(stat => parseInt(stat.value.replace(/\D/g, '')));
    const duration = 2000;
    const steps = 60;
    const stepValues = targetValues.map(target => target / steps);

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      setCounterValues(prev => 
        prev.map((value, index) => {
          if (currentStep <= steps) {
            return Math.min(value + stepValues[index], targetValues[index]);
          }
          return value;
        })
      );

      if (currentStep >= steps) {
        clearInterval(counterInterval);
      }
    }, duration / steps);
  };

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
  const stats = t('science.sections.publications.stats', { returnObjects: true });

  const resetFilters = () => {
    setSearchTerm('');
    setFilterYear('all');
    setSortBy('date');
  };

  return (
    <div ref={sectionRef} className="space-y-8">
      {/* Header */}
      <div className={`text-center mb-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {t('science.sections.publications.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t('science.sections.publications.subtitle')}
        </p>
      </div>

      {/* Статистика с анимацией */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group text-center"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2 font-mono">
              {stat.value.includes('%') 
                ? `${Math.round(counterValues[index])}%`
                : stat.value.includes('+')
                ? `${Math.round(counterValues[index])}+`
                : Math.round(counterValues[index])
              }
            </div>
            <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
            <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 mt-3 mx-auto"></div>
          </div>
        ))}
      </div>

      {/* Фильтры и поиск */}
      <div className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm transition-all duration-1000 delay-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Поиск публикаций
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Название, автор, ключевые слова..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Год публикации
            </label>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            >
              <option value="all">Все годы</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сортировка
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            >
              <option value="date">По дате публикации</option>
              <option value="citations">По количеству цитирований</option>
            </select>
          </div>

          <div>
            <button
              onClick={resetFilters}
              className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium text-lg"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>

        {/* Active filters info */}
        {(searchTerm || filterYear !== 'all') && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Поиск: "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  className="ml-2 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {filterYear !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Год: {filterYear}
                <button 
                  onClick={() => setFilterYear('all')}
                  className="ml-2 hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className={`transition-all duration-1000 delay-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600 text-lg">
            Найдено публикаций: <span className="font-semibold text-gray-900">{filteredPublications.length}</span>
          </p>
          {filteredPublications.length > 0 && (
            <p className="text-gray-500 text-sm">
              Сортировка: {sortBy === 'date' ? 'по дате' : 'по цитированиям'}
            </p>
          )}
        </div>

        {/* Список публикаций */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPublications.map((pub, index) => (
            <PublicationCard 
              key={index} 
              publication={pub} 
              index={index}
              onSelect={setSelectedPublication}
            />
          ))}
        </div>

        {filteredPublications.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">Публикации не найдены</h3>
            <p className="text-gray-500 text-lg mb-6">Попробуйте изменить параметры поиска</p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      {/* Publication Modal */}
      {selectedPublication && (
        <PublicationModal 
          publication={selectedPublication}
          onClose={() => setSelectedPublication(null)}
        />
      )}
    </div>
  );
};

const PublicationCard = ({ publication, index, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = () => {
    onSelect(publication);
  };

  const handleButtonClick = (e, action) => {
    e.stopPropagation();
    if (action === 'pdf') {
      window.open(publication.pdfLink, '_blank');
    } else if (action === 'cite') {
      navigator.clipboard.writeText(publication.citation);
      // You could add a toast notification here
    }
  };

  return (
    <div 
      className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-3 leading-tight">
              {publication.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {publication.authors.map((author, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-200 transition-colors duration-300"
                >
                  {author}
                </span>
              ))}
            </div>
          </div>
          <span className="text-3xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 flex-shrink-0 ml-4">📖</span>
        </div>
        
        <p className={`text-gray-600 mb-4 leading-relaxed transition-all duration-300 ${
          isExpanded ? 'line-clamp-none' : 'line-clamp-3'
        }`}>
          {publication.abstract}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-medium">
            {publication.journal}
          </span>
          <span className="px-3 py-2 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium">
            {publication.year}
          </span>
          <span className="px-3 py-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-medium">
            {publication.citations} цитирований
          </span>
          <span className="px-3 py-2 bg-orange-100 text-orange-700 rounded-xl text-sm font-medium">
            {publication.type}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {publication.keywords.slice(0, 4).map((keyword, i) => (
            <span 
              key={i} 
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-xl text-sm hover:bg-gray-200 transition-colors duration-300"
            >
              #{keyword}
            </span>
          ))}
          {publication.keywords.length > 4 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-xl text-sm">
              +{publication.keywords.length - 4}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-500 text-sm font-mono bg-gray-100 px-3 py-1 rounded-lg">
            DOI: {publication.doi}
          </span>
          <div className="flex gap-2">
            <button
              onClick={(e) => handleButtonClick(e, 'pdf')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all duration-300 font-medium text-sm"
            >
              <span>📥</span>
              <span>PDF</span>
            </button>
            <button
              onClick={(e) => handleButtonClick(e, 'cite')}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:shadow-lg transition-all duration-300 font-medium text-sm"
            >
              <span>📋</span>
              <span>Цитировать</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PublicationModal = ({ publication, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(publication.citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-900">Детали публикации</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-300"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{publication.title}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {publication.authors.map((author, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-xl text-sm font-medium"
                >
                  {author}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Журнал</h4>
                <p className="text-gray-700">{publication.journal}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Год публикации</h4>
                <p className="text-gray-700">{publication.year}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Тип публикации</h4>
                <p className="text-gray-700">{publication.type}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Цитирования</h4>
                <p className="text-gray-700">{publication.citations}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">DOI</h4>
                <p className="text-gray-700 font-mono">{publication.doi}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Дата публикации</h4>
                <p className="text-gray-700">{publication.date}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Аннотация</h4>
            <p className="text-gray-700 leading-relaxed">{publication.abstract}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Ключевые слова</h4>
            <div className="flex flex-wrap gap-2">
              {publication.keywords.map((keyword, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-xl text-sm"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Цитирование</h4>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 font-mono text-sm">{publication.citation}</p>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => window.open(publication.pdfLink, '_blank')}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
              <span>📥</span>
              <span>Открыть PDF</span>
            </button>
            <button
              onClick={handleCopyCitation}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-300 font-medium"
            >
              <span>📋</span>
              <span>{copied ? 'Скопировано!' : 'Копировать цитирование'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificPublications;