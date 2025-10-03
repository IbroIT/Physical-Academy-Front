import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const EbilimLogin = () => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-2xl p-8 text-white mb-8 max-w-6xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20 animate-pulse"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="mb-6 lg:mb-0 lg:mr-8 flex-1">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">🎓</div>
              <div>
                <h2 className="text-3xl font-bold mb-2">{t('students.ebilim.title')}</h2>
                <p className="text-blue-100 text-lg opacity-90 leading-relaxed">
                  {t('students.ebilim.description')}
                </p>
              </div>
            </div>
            
            {/* Быстрые ссылки */}
            {isExpanded && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 animate-fade-in">
                {t('students.ebilim.quickLinks', { returnObjects: true }).map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-2xl mb-2">{link.icon}</div>
                    <div className="text-sm font-medium">{link.name}</div>
                  </a>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30 flex items-center justify-center"
            >
              <span className="mr-2">{isExpanded ? '📋' : '🔍'}</span>
              {isExpanded ? t('students.ebilim.hideLinks') : t('students.ebilim.showLinks')}
            </button>
            
            <button className="bg-white text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg flex items-center justify-center transform hover:-translate-y-1">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              {t('students.ebilim.button')}
            </button>
          </div>
        </div>
        
        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20">
          {t('students.ebilim.stats', { returnObjects: true }).map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-blue-100 text-sm opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EbilimLogin;