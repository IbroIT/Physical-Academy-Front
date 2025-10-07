import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const EbilimLogin = () => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-blue-600 rounded-xl p-6 text-white mb-6 max-w-6xl mx-auto shadow-sm border border-blue-700 relative">
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="mb-4 lg:mb-0 lg:mr-6 flex-1">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-blue-700 rounded-lg flex items-center justify-center text-white mr-3">
                <span className="text-xl">🎓</span>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">{t('students.ebilim.title')}</h2>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {t('students.ebilim.description')}
                </p>
              </div>
            </div>
            
            {/* Быстрые ссылки */}
            {isExpanded && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {t('students.ebilim.quickLinks', { returnObjects: true }).map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="bg-blue-700 rounded-lg p-3 text-center hover:bg-blue-800 transition-colors duration-200"
                  >
                    <div className="text-lg mb-1">{link.icon}</div>
                    <div className="text-xs font-medium">{link.name}</div>
                  </a>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors duration-200 border border-blue-600 flex items-center justify-center text-sm"
            >
              <span className="mr-2">{isExpanded ? '📋' : '🔍'}</span>
              {isExpanded ? t('students.ebilim.hideLinks') : t('students.ebilim.showLinks')}
            </button>
            
            <button className="bg-white text-blue-600 px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {t('students.ebilim.button')}
            </button>
          </div>
        </div>
        
        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-blue-500">
          {t('students.ebilim.stats', { returnObjects: true }).map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-lg font-bold text-white mb-1">{stat.value}</div>
              <div className="text-blue-100 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EbilimLogin;