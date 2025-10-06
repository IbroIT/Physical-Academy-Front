import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const WebOfScience = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('5years');
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState({});
  const [activeMetric, setActiveMetric] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => {
            setData(t('science.sections.webofscience', { returnObjects: true }));
            setLoading(false);
            startCounters();
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [t]);

  const startCounters = () => {
    if (!data) return;
    
    const filteredData = data.metrics[timeRange];
    const targetValues = {};
    
    Object.entries(filteredData.main).forEach(([key, metric]) => {
      targetValues[key] = parseInt(metric.value.replace(/\D/g, ''));
    });

    const duration = 2000;
    const steps = 60;
    const stepValues = {};

    Object.keys(targetValues).forEach(key => {
      stepValues[key] = targetValues[key] / steps;
    });

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      setCounterValues(prev => {
        const newValues = { ...prev };
        Object.keys(targetValues).forEach(key => {
          if (currentStep <= steps) {
            newValues[key] = Math.min(
              (prev[key] || 0) + stepValues[key],
              targetValues[key]
            );
          }
        });
        return newValues;
      });

      if (currentStep >= steps) {
        clearInterval(counterInterval);
      }
    }, duration / steps);
  };

  useEffect(() => {
    if (data) {
      startCounters();
    }
  }, [timeRange, data]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-16 transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных Web of Science...</p>
        </div>
      </div>
    );
  }

  const filteredData = data.metrics[timeRange];

  return (
    <div ref={sectionRef} className="space-y-8">
      {/* Header */}
      <div className={`text-center transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center space-x-6 bg-white rounded-2xl px-8 py-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl">
            🔵
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-bold text-gray-900">Web of Science</h2>
            <p className="text-gray-600 text-lg">Clarivate Analytics</p>
          </div>
        </div>
      </div>

      {/* Time Range Selection */}
      <div className={`flex justify-center transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
          {Object.keys(data.metrics).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-500 transform hover:scale-105 ${
                timeRange === range
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              {data.timeRanges[range]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Metrics */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {Object.entries(filteredData.main).map(([key, metric], index) => (
          <div 
            key={key}
            className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group text-center relative overflow-hidden"
            onMouseEnter={() => setActiveMetric(key)}
            onMouseLeave={() => setActiveMetric(null)}
          >
            {/* Background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {metric.icon}
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2 font-mono">
                {counterValues[key] ? Math.round(counterValues[key]).toLocaleString() : '0'}
                {metric.value.includes('%') && '%'}
              </div>
              <div className="text-gray-700 font-semibold text-lg mb-2">{metric.label}</div>
              <div className="text-gray-500 text-sm leading-relaxed">{metric.description}</div>
              <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 mt-3 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Information */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-1000 delay-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* Publications by Category */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">📚</span>
            Публикации по категориям
          </h3>
          <div className="space-y-4">
            {filteredData.categories.map((category, index) => {
              const maxCount = Math.max(...filteredData.categories.map(c => c.count));
              const percentage = (category.count / maxCount) * 100;
              
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-xl transition-all duration-300"
                >
                  <span className="text-gray-700 text-lg font-medium flex-1">{category.name}</span>
                  <div className="flex items-center space-x-4 flex-1 max-w-xs">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-gray-900 w-12 text-right text-lg">
                      {category.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* International Collaboration */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">🌍</span>
            Международное сотрудничество
          </h3>
          <div className="space-y-4">
            {filteredData.collaborations.map((collab, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{collab.flag}</span>
                  <div>
                    <span className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300">
                      {collab.country}
                    </span>
                    <div className="text-gray-600 text-sm">{collab.institutions} институтов</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-blue-600 font-bold text-xl">{collab.publications}</div>
                  <div className="text-gray-500 text-sm">совместных статей</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Q1/Q2 Journals */}
      <div className={`bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white shadow-xl transition-all duration-1000 delay-900 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <h3 className="text-2xl font-bold mb-6 flex items-center justify-center">
          <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">🏅</span>
          Журналы Q1/Q2
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredData.topJournals.map((journal, index) => (
            <div 
              key={index} 
              className="bg-white/20 rounded-xl p-6 text-center backdrop-blur-sm hover:bg-white/30 transition-all duration-500 transform hover:-translate-y-2 group"
            >
              <div className="text-3xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                {journal.count}
              </div>
              <div className="text-blue-100 text-lg font-medium mb-1">{journal.quartile}</div>
              <div className="text-white/80 text-sm">публикаций</div>
              <div className="w-0 group-hover:w-full h-1 bg-white/50 transition-all duration-500 mt-2 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-1000 delay-1100 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {[
          {
            icon: '📈',
            title: 'Средний импакт-фактор',
            value: filteredData.impactFactor,
            description: 'по публикациям'
          },
          {
            icon: '🔗',
            title: 'Индекс Хирша',
            value: filteredData.hIndex,
            description: 'за выбранный период'
          },
          {
            icon: '⭐',
            title: 'Высокоцитируемые статьи',
            value: filteredData.highlyCited,
            description: 'топ 1% по цитированиям'
          }
        ].map((metric, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {metric.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{metric.value}</div>
            <div className="text-gray-700 font-semibold text-lg mb-2">{metric.title}</div>
            <div className="text-gray-500 text-sm">{metric.description}</div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className={`bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 text-center border border-gray-200 transition-all duration-1000 delay-1300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Нужна подробная аналитика?
        </h3>
        <p className="text-gray-600 mb-6 text-lg">
          Получите полный отчет о публикационной активности с детальной аналитикой
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            Запросить отчет
          </button>
          <button className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-2xl font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
            Связаться с отделом
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebOfScience;