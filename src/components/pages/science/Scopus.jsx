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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Заголовок с логотипом */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-4 bg-white rounded-2xl px-8 py-4 shadow-lg border border-red-200">
          <span className="text-4xl">🔴</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Scopus</h2>
            <p className="text-gray-600">Elsevier</p>
          </div>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.main.map((metric, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-3xl font-bold text-red-600 mb-2">{metric.value}</div>
            <div className="text-gray-700 font-semibold text-sm">{metric.label}</div>
            <div className="text-gray-500 text-xs mt-2">{metric.description}</div>
          </div>
        ))}
      </div>

      {/* Детальная статистика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Динамика публикаций</h3>
          <div className="space-y-4">
            {metrics.publicationTrends.map((trend, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-600">{trend.year}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${(trend.count / Math.max(...metrics.publicationTrends.map(t => t.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-800">{trend.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🏆 Топ цитирований</h3>
          <div className="space-y-3">
            {metrics.topCited.map((article, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 text-sm line-clamp-1">{article.title}</div>
                  <div className="text-gray-500 text-xs">{article.authors.join(', ')}</div>
                </div>
                <div className="text-red-600 font-bold">{article.citations}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ссылки на ресурсы */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href={metrics.links.profile}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <span className="text-3xl text-red-500 group-hover:scale-110 transition-transform">👤</span>
            <div>
              <h3 className="font-bold text-gray-800">Профиль организации</h3>
              <p className="text-gray-600 text-sm">Просмотр в Scopus</p>
            </div>
          </div>
        </a>

        <a
          href={metrics.links.analytics}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <span className="text-3xl text-red-500 group-hover:scale-110 transition-transform">📊</span>
            <div>
              <h3 className="font-bold text-gray-800">SciVal Analytics</h3>
              <p className="text-gray-600 text-sm">Расширенная аналитика</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Scopus;