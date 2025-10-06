import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Vestnik = () => {
  const { t } = useTranslation();
  const [currentView, setCurrentView] = useState('current');
  const [selectedYear, setSelectedYear] = useState('all');
  
  const journalData = t('science.sections.journal', { returnObjects: true });

  // Получаем уникальные годы для фильтрации архива
  const archiveYears = [...new Set(journalData.archive?.map(issue => issue.year))];

  return (
    <div className="space-y-8">
      {/* Переключение представлений */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl p-2 border border-gray-300">
          {['current', 'archive', 'metrics'].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                currentView === view
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t(`science.sections.journal.views.${view}`, {
                current: 'Текущий выпуск',
                archive: 'Архив',
                metrics: 'Метрики'
              }[view])}
            </button>
          ))}
        </div>
      </div>

      {currentView === 'current' && <CurrentIssue data={journalData.currentIssue} />}
      {currentView === 'archive' && (
        <Archive 
          data={journalData.archive} 
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          years={archiveYears}
        />
      )}
      {currentView === 'metrics' && <Metrics data={journalData.metrics} />}
    </div>
  );
};

const CurrentIssue = ({ data }) => (
  <div className="bg-white rounded-2xl p-8 border border-gray-300">
    <div className="flex flex-col lg:flex-row items-start gap-8">
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="w-48 h-64 bg-blue-50 rounded-2xl flex items-center justify-center border-2 border-blue-300 group-hover:border-blue-400 transition-colors">
            <span className="text-6xl text-blue-600">📰</span>
          </div>
          <div className="absolute -top-3 -right-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-xs">
            НОВЫЙ
          </div>
        </div>
      </div>
      
      <div className="flex-grow">
        <div className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium mb-4">
          ТЕКУЩИЙ ВЫПУСК
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">{data?.title || 'Вестник академии'}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed text-lg">
          {data?.description || 'Научный журнал с последними исследованиями и публикациями'}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center bg-blue-50 rounded-xl p-4 border border-blue-200">
            <div className="text-xl font-bold text-blue-600 mb-1">{data?.releaseDate || '2024'}</div>
            <div className="text-gray-700 text-sm font-medium">Дата выпуска</div>
          </div>
          <div className="text-center bg-green-50 rounded-xl p-4 border border-green-200">
            <div className="text-xl font-bold text-green-600 mb-1">{data?.issn || '0000-0000'}</div>
            <div className="text-gray-700 text-sm font-medium">ISSN</div>
          </div>
          <div className="text-center bg-purple-50 rounded-xl p-4 border border-purple-200">
            <div className="text-xl font-bold text-purple-600 mb-1">{data?.articlesCount || '12'}</div>
            <div className="text-gray-700 text-sm font-medium">Статей</div>
          </div>
          <div className="text-center bg-orange-50 rounded-xl p-4 border border-orange-200">
            <div className="text-xl font-bold text-orange-600 mb-1">{data?.pages || '150'}</div>
            <div className="text-gray-700 text-sm font-medium">Страниц</div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => window.open(data?.downloadLink, '_blank')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
          >
            <span>📥</span>
            <span>Скачать PDF</span>
          </button>
          <button className="px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium flex items-center gap-2">
            <span>🌐</span>
            <span>Читать онлайн</span>
          </button>
          <button className="px-6 py-3 bg-white border-2 border-green-600 text-green-600 rounded-xl hover:bg-green-50 transition-colors font-medium flex items-center gap-2">
            <span>📋</span>
            <span>Для авторов</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Archive = ({ data, selectedYear, onYearChange, years }) => {
  const filteredData = selectedYear === 'all' 
    ? data 
    : data?.filter(issue => issue.year === selectedYear);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Архив выпусков</h3>
        
        {/* Фильтр по годам */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onYearChange('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
              selectedYear === 'all'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
            }`}
          >
            Все годы
          </button>
          {years?.map((year) => (
            <button
              key={year}
              onClick={() => onYearChange(year)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                selectedYear === year
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData?.map((issue, index) => (
          <div 
            key={index}
            className="bg-white border border-gray-300 rounded-2xl p-6 hover:border-blue-300 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2 text-lg">
                  {issue.title}
                </h4>
                <p className="text-gray-500 text-sm">{issue.period}</p>
              </div>
              <span className="text-3xl text-blue-600 opacity-80 group-hover:opacity-100 transition-opacity">📘</span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{issue.theme}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm">📄 {issue.articles} статей</span>
              <span className="text-gray-500 text-sm">📏 {issue.pages} стр.</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">PDF</span>
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">HTML</span>
              </div>
              <button
                onClick={() => window.open(issue.downloadLink, '_blank')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Открыть
              </button>
            </div>
          </div>
        ))}
      </div>

      {(!filteredData || filteredData.length === 0) && (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-300">
          <div className="text-6xl mb-4">📚</div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Выпуски не найдены</h4>
          <p className="text-gray-600">Попробуйте выбрать другой год для просмотра</p>
        </div>
      )}
    </div>
  );
};

const Metrics = ({ data }) => (
  <div className="space-y-8">
    <h3 className="text-2xl font-bold text-gray-900">Метрики журнала</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data?.map((metric, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 border border-gray-300 text-center hover:border-blue-300 transition-colors">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {metric.value}
          </div>
          <div className="text-gray-900 font-semibold mb-2">{metric.label}</div>
          <div className="text-gray-600 text-sm">{metric.description}</div>
        </div>
      )) || (
        <>
          <div className="bg-white rounded-2xl p-6 border border-gray-300 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">4.2</div>
            <div className="text-gray-900 font-semibold mb-2">Импакт-фактор</div>
            <div className="text-gray-600 text-sm">Рейтинг журнала</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-300 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
            <div className="text-gray-900 font-semibold mb-2">Принятие статей</div>
            <div className="text-gray-600 text-sm">Уровень принятия</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-300 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">3.5</div>
            <div className="text-gray-900 font-semibold mb-2">Время рецензии</div>
            <div className="text-gray-600 text-sm">Недель в среднем</div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-300 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">150+</div>
            <div className="text-gray-900 font-semibold mb-2">Цитирований</div>
            <div className="text-gray-600 text-sm">Всего цитирований</div>
          </div>
        </>
      )}
    </div>

    {/* Дополнительная информация о метриках */}
    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
      <h4 className="text-lg font-bold text-gray-900 mb-4">О метриках журнала</h4>
      <p className="text-gray-600 mb-4">
        Наши метрики отражают качество и влияние журнала в научном сообществе. 
        Мы постоянно работаем над улучшением показателей и повышением стандартов публикаций.
      </p>
      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
        Узнать больше о метриках
      </button>
    </div>
  </div>
);

export default Vestnik;