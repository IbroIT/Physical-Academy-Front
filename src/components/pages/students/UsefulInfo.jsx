import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const UsefulInfo = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const sectionRef = useRef(null);
  
  const infoItems = t('students.info.items', { returnObjects: true });
  const common = t('students.info.common', { returnObjects: true });
  const stats = t('students.info.stats', { returnObjects: true });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredItems = infoItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.links.some(link => link.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <div ref={sectionRef} className="space-y-8">
      {/* Header */}
      <div className={`transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('students.info.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto lg:mx-0 mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              {t('students.info.subtitle')}
            </p>
          </div>
          
          <div className="relative w-full lg:w-80">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              {common.search.label}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={common.search.placeholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl">🔍</span>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600 text-lg">
            {common.results.count} <span className="font-semibold text-gray-900">{filteredItems.length}</span>
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 hover:text-blue-700 font-medium text-lg"
            >
              {common.results.clear}
            </button>
          )}
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {filteredItems.map((item, index) => (
          <InfoCard 
            key={index} 
            item={item} 
            index={index}
            isExpanded={expandedCard === index}
            isHovered={hoveredCard === index}
            onToggle={() => toggleCard(index)}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className={`text-center py-16 bg-white rounded-2xl border border-gray-200 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-6xl mb-4 opacity-50">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-600 mb-2">{common.noResults.title}</h3>
          <p className="text-gray-500 text-lg mb-6">{common.noResults.description}</p>
          <button
            onClick={() => setSearchTerm('')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            {common.noResults.reset}
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
            <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 mt-3 mx-auto"></div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className={`bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 text-center border border-gray-200 transition-all duration-1000 delay-900 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {common.cta.title}
        </h3>
        <p className="text-gray-600 mb-6 text-lg">
          {common.cta.description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            {common.cta.ask}
          </button>
          <button className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
            {common.cta.suggest}
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ item, index, isExpanded, isHovered, onToggle, onMouseEnter, onMouseLeave }) => {
  const { t } = useTranslation();
  const common = t('students.info.common', { returnObjects: true });

  const handleLinkClick = (e, url) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  return (
    <div 
      className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group cursor-pointer relative overflow-hidden"
      onClick={onToggle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-start space-x-6">
          <div className={`text-4xl transition-all duration-500 ${
            isHovered ? 'scale-110 rotate-6' : 'group-hover:scale-105'
          }`}>
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
              {item.title}
            </h3>
            <p className={`text-gray-700 leading-relaxed text-lg transition-all duration-500 ${
              isExpanded ? 'line-clamp-none' : 'line-clamp-3'
            }`}>
              {item.description}
            </p>
            
            {/* Links */}
            <div className={`mt-4 space-y-3 transition-all duration-500 overflow-hidden ${
              isExpanded ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              {item.links.map((link, linkIndex) => (
                <button 
                  key={linkIndex}
                  onClick={(e) => handleLinkClick(e, link.url)}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-lg group/link w-full text-left"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-4 group-hover/link:scale-150 transition-transform duration-300 flex-shrink-0"></span>
                  <span className="truncate">{link.text}</span>
                  <span className="ml-2 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">↗</span>
                </button>
              ))}
            </div>
            
            {/* Expand/Collapse Button */}
            <button 
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-lg flex items-center transform hover:-translate-y-0.5 transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
              {isExpanded ? common.card.collapse : common.card.more}
              <svg 
                className={`w-5 h-5 ml-2 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Additional Info */}
        {isExpanded && item.additionalInfo && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200 transition-all duration-500">
            <h4 className="font-semibold text-gray-900 text-lg mb-3 flex items-center">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">💡</span>
              {common.card.additional}
            </h4>
            <p className="text-gray-700 leading-relaxed">{item.additionalInfo}</p>
          </div>
        )}

        {/* Tags */}
        {item.tags && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag, tagIndex) => (
              <span 
                key={tagIndex}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors duration-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsefulInfo;