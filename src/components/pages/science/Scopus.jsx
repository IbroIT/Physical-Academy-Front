import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Scopus = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация загрузки данных
    setTimeout(() => {
      setMetrics(t('science.sections.scopus.metrics', { returnObjects: true }));
      setLoading(false);
    }, 1000);
  }, [t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Заголовок с логотипом */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-4 bg-white rounded-xl px-6 py-3 shadow-sm border border-gray-200">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <span className="text-lg">🔴</span>
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-gray-900">Scopus</h2>
            <p className="text-gray-600 text-sm">Elsevier</p>
          </div>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.main.map((metric, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 text-center hover:shadow-md transition-all duration-200"
          >
            <div className="text-2xl font-bold text-blue-600 mb-1">{metric.value}</div>
            <div className="text-gray-700 font-semibold text-xs mb-1">{metric.label}</div>
            <div className="text-gray-500 text-xs">{metric.description}</div>
          </div>
        ))}
      </div>

      {/* Детальная статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-2">
              📈
            </div>
            Динамика публикаций
          </h3>
          <div className="space-y-3">
            {metrics.publicationTrends.map((trend, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{trend.year}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000"
                      style={{ width: `${(trend.count / Math.max(...metrics.publicationTrends.map(t => t.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-900 text-sm w-8 text-right">{trend.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-2">
              🏆
            </div>
            Топ цитирований
          </h3>
          <div className="space-y-2">
            {metrics.topCited.map((article, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-xs line-clamp-1">{article.title}</div>
                  <div className="text-gray-500 text-xs line-clamp-1">{article.authors.join(', ')}</div>
                </div>
                <div className="text-blue-600 font-bold text-sm ml-2">{article.citations}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ссылки на ресурсы */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href={metrics.links.profile}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-200 transition-colors">
              <span className="text-lg">👤</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Профиль организации</h3>
              <p className="text-gray-600 text-xs">Просмотр в Scopus</p>
            </div>
          </div>
        </a>

        <a
          href={metrics.links.analytics}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group cursor-pointer"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-200 transition-colors">
              <span className="text-lg">📊</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">SciVal Analytics</h3>
              <p className="text-gray-600 text-xs">Расширенная аналитика</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Scopus;