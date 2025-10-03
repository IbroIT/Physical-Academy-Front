import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Vestnik = () => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState('current');
  
  const journalData = t('science.sections.journal', { returnObjects: true });

  return (
    <div className="space-y-8">
      {/* Переключение представлений */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          {['current', 'archive', 'metrics'].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentView === view
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t(`science.sections.journal.views.${view}`)}
            </button>
          ))}
        </div>
      </div>

      {currentView === 'current' && <CurrentIssue data={journalData.currentIssue} />}
      {currentView === 'archive' && <Archive data={journalData.archive} />}
      {currentView === 'metrics' && <Metrics data={journalData.metrics} />}
    </div>
  );
};

const CurrentIssue = ({ data }) => (
  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-200">
    <div className="flex flex-col lg:flex-row items-center gap-8">
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="w-48 h-64 bg-white rounded-2xl shadow-2xl flex items-center justify-center border-4 border-blue-300 transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-6xl">📰</span>
          </div>
          <div className="absolute -top-4 -right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm animate-pulse">
            НОВЫЙ
          </div>
        </div>
      </div>
      
      <div className="flex-grow">
        <div className="inline-block px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-bold mb-4">
          ТЕКУЩИЙ ВЫПУСК
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-4">{data.title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed text-lg">{data.description}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{data.releaseDate}</div>
            <div className="text-gray-600 text-sm">Дата выпуска</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{data.issn}</div>
            <div className="text-gray-600 text-sm">ISSN</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">{data.articlesCount}</div>
            <div className="text-gray-600 text-sm">Статей</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">{data.pages}</div>
            <div className="text-gray-600 text-sm">Страниц</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => window.open(data.downloadLink, '_blank')}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl hover:shadow-xl transition-all duration-300 font-bold transform hover:-translate-y-1"
          >
            <span className="flex items-center space-x-2">
              <span>📥</span>
              <span>Скачать PDF</span>
            </span>
          </button>
          <button className="px-8 py-4 bg-white border-2 border-blue-500 text-blue-500 rounded-2xl hover:bg-blue-50 transition-all duration-300 font-bold transform hover:-translate-y-1">
            <span className="flex items-center space-x-2">
              <span>🌐</span>
              <span>Читать онлайн</span>
            </span>
          </button>
          <button className="px-8 py-4 bg-white border-2 border-green-500 text-green-500 rounded-2xl hover:bg-green-50 transition-all duration-300 font-bold transform hover:-translate-y-1">
            <span className="flex items-center space-x-2">
              <span>📋</span>
              <span>Для авторов</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Archive = ({ data }) => (
  <div>
    <h3 className="text-2xl font-bold text-gray-800 mb-6">Архив выпусков</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((issue, index) => (
        <div 
          key={index}
          className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-2"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-2 text-lg">
                {issue.title}
              </h4>
              <p className="text-gray-500 text-sm">{issue.period}</p>
            </div>
            <span className="text-3xl opacity-60 group-hover:opacity-100 transition-opacity">📘</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{issue.theme}</p>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">📄 {issue.articles} статей</span>
            <span className="text-gray-500 text-sm">📏 {issue.pages} стр.</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">PDF</span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">HTML</span>
            </div>
            <button
              onClick={() => window.open(issue.downloadLink, '_blank')}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium transform hover:scale-105"
            >
              Открыть
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Metrics = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.map((metric, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <div className="text-4xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent mb-2">
            {metric.value}
          </div>
          <div className="text-gray-700 font-semibold mb-2">{metric.label}</div>
          <div className="text-gray-500 text-sm">{metric.description}</div>
        </div>
      ))}
    </div>
  </div>
);

export default Vestnik;