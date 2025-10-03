import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const UsefulInfo = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  
  const infoItems = t('students.info.items', { returnObjects: true });

  const filteredItems = infoItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            {t('students.info.title')}
          </h2>
          <p className="text-gray-600 mt-2">
            {t('students.info.subtitle')}
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Поиск информации..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item, index) => (
          <InfoCard key={index} item={item} index={index} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Информация не найдена</h3>
          <p className="text-gray-500">Попробуйте изменить поисковый запрос</p>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ item, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 border border-green-200 hover:shadow-xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-2"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start space-x-4">
        <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
          {item.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-700 mb-3 group-hover:text-green-600 transition-colors">
            {item.title}
          </h3>
          <p className={`text-gray-600 leading-relaxed transition-all duration-300 ${
            isExpanded ? 'line-clamp-none' : 'line-clamp-3'
          }`}>
            {item.description}
          </p>
          
          <div className={`mt-4 space-y-2 transition-all duration-300 ${
            isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
          }`}>
            {item.links.map((link, linkIndex) => (
              <a 
                key={linkIndex} 
                href={link.url}
                className="flex items-center text-green-600 hover:text-green-700 font-medium group/link"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover/link:scale-150 transition-transform"></span>
                {link.text}
              </a>
            ))}
          </div>
          
          <button 
            className="mt-4 text-green-600 hover:text-green-700 font-medium text-sm flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? 'Свернуть' : 'Подробнее'}
            <svg 
              className={`w-4 h-4 ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsefulInfo;