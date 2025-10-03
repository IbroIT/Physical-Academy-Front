import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const WebOfScience = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('5years');

  useEffect(() => {
    setTimeout(() => {
      setData(t('science.sections.webofscience', { returnObjects: true }));
      setLoading(false);
    }, 1000);
  }, [t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const filteredData = data.metrics[timeRange];

  return (
    <div className="space-y-8">
      {/* Заголовок с логотипом */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-4 bg-white rounded-2xl px-8 py-4 shadow-lg border border-blue-200">
          <span className="text-4xl">🔵</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Web of Science</h2>
            <p className="text-gray-600">Clarivate Analytics</p>
          </div>
        </div>
      </div>

      {/* Выбор периода */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          {Object.keys(data.metrics).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                timeRange === range
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {data.timeRanges[range]}
            </button>
          ))}
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Object.entries(filteredData.main).map(([key, metric]) => (
          <div 
            key={key}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">{metric.value}</div>
            <div className="text-gray-700 font-semibold text-sm">{metric.label}</div>
            <div className="text-gray-500 text-xs mt-2">{metric.description}</div>
          </div>
        ))}
      </div>

      {/* Детальная информация */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📚 Публикации по категориям</h3>
          <div className="space-y-3">
            {filteredData.categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">{category.name}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(category.count / Math.max(...filteredData.categories.map(c => c.count))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-800 w-8 text-right">{category.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🌍 Международное сотрудничество</h3>
          <div className="space-y-4">
            {filteredData.collaborations.map((collab, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{collab.flag}</span>
                  <span className="font-semibold text-gray-800">{collab.country}</span>
                </div>
                <div className="text-blue-600 font-bold">{collab.publications} статей</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Журналы Q1 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">🏅 Журналы Q1/Q2</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredData.topJournals.map((journal, index) => (
            <div key={index} className="bg-white bg-opacity-20 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="font-bold text-lg">{journal.count}</div>
              <div className="text-blue-100 text-sm">{journal.quartile}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WebOfScience;