import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ExchangePrograms = () => {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const data = t('students.exchange', { returnObjects: true });

  const regions = ['all', ...new Set(data.programs?.map(program => program.region))];
  const durations = ['all', ...new Set(data.programs?.map(program => program.durationType))];

  const filteredPrograms = data.programs?.filter(program => {
    const matchesRegion = selectedRegion === 'all' || program.region === selectedRegion;
    const matchesDuration = selectedDuration === 'all' || program.durationType === selectedDuration;
    const matchesSearch = program.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesDuration && matchesSearch;
  }) || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {data?.title || 'Программы обмена'}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          {data?.subtitle || 'Международные программы обмена для студентов'}
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(data?.stats || [
          { value: '50+', label: 'Университетов-партнеров' },
          { value: '30+', label: 'Стран' },
          { value: '500+', label: 'Студентов в год' },
          { value: '95%', label: 'Успешных заявок' }
        ]).map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-4 text-center border border-gray-300 hover:border-blue-300 transition-colors"
          >
            <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
            <div className="text-gray-700 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white rounded-2xl p-6 border border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Поиск */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">🔍 Поиск программ</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск по университету, стране или описанию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <span className="text-gray-400 hover:text-gray-600">✕</span>
                </button>
              )}
            </div>
          </div>

          {/* Регион */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🌍 Регион</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">Все регионы</option>
              {regions.filter(region => region !== 'all').map(region => (
                <option key={region} value={region}>
                  {data?.regions?.[region] || region}
                </option>
              ))}
            </select>
          </div>

          {/* Длительность */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">⏱️ Длительность</label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">Любая длительность</option>
              {durations.filter(duration => duration !== 'all').map(duration => (
                <option key={duration} value={duration}>
                  {data?.durations?.[duration] || duration}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex flex-wrap gap-3 mt-4">
          <button 
            onClick={() => {
              setSelectedRegion('all');
              setSelectedDuration('all');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            Сбросить фильтры
          </button>
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            Найдено: {filteredPrograms.length} программ
          </div>
        </div>
      </div>

      {/* Программы обмена */}
      <div className="space-y-6">
        {filteredPrograms.map((program, index) => (
          <ProgramCard key={program.id || index} program={program} index={index} />
        ))}
      </div>

      {/* Состояние "нет результатов" */}
      {filteredPrograms.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-300">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Программы не найдены</h3>
          <p className="text-gray-600 mb-6">Попробуйте изменить параметры фильтрации</p>
          <button 
            onClick={() => {
              setSelectedRegion('all');
              setSelectedDuration('all');
              setSearchTerm('');
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Сбросить фильтры
          </button>
        </div>
      )}

      {/* Дедлайны */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">📅 Ближайшие дедлайны</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(data?.deadlines || [
            { date: '15 марта 2024', program: 'Erasmus+ Европа', daysLeft: 'Осталось 45 дней' },
            { date: '1 апреля 2024', program: 'Азия-Пасифик', daysLeft: 'Осталось 60 дней' },
            { date: '15 мая 2024', program: 'Северная Америка', daysLeft: 'Осталось 90 дней' }
          ]).map((deadline, index) => (
            <div key={index} className="bg-white rounded-xl p-4 text-center border border-blue-200 hover:border-blue-300 transition-colors">
              <div className="text-lg font-bold text-gray-900 mb-1">{deadline.date}</div>
              <div className="text-blue-600 text-sm font-medium mb-2">{deadline.program}</div>
              <div className="text-green-600 text-xs font-medium">{deadline.daysLeft}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Нужна помощь с выбором программы?</h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Наши консультанты помогут вам подобрать подходящую программу обмена и подготовить все необходимые документы
        </p>
        <button className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-colors font-medium">
          Получить консультацию
        </button>
      </div>
    </div>
  );
};

const ProgramCard = ({ program, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    // Имитация подачи заявки
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsApplying(false);
    alert(`Заявка на программу "${program.university}" отправлена!`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'high': return { bg: 'bg-red-100', text: 'text-red-700' };
      case 'medium': return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
      case 'low': return { bg: 'bg-green-100', text: 'text-green-700' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  };

  const difficultyColors = getDifficultyColor(program.difficulty);

  return (
    <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden hover:border-blue-300 transition-all duration-300">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Основная информация */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {program.university}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <span>🌍</span>
                    <span>{program.country}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span>{program.duration}</span>
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyColors.bg} ${difficultyColors.text}`}>
                    {program.difficultyLabel || program.difficulty}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 mb-1">{program.cost || 'Бесплатно'}</div>
                <div className="text-gray-500 text-sm">Стоимость</div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">{program.description}</p>

            {/* Быстрая информация */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <div className="text-lg font-bold text-gray-900">{program.language || 'Английский'}</div>
                <div className="text-gray-500 text-sm">Язык</div>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <div className="text-lg font-bold text-gray-900">{program.grantsAvailable || 'Доступны'}</div>
                <div className="text-gray-500 text-sm">Гранты</div>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <div className="text-lg font-bold text-gray-900">{program.deadline || 'Скоро'}</div>
                <div className="text-gray-500 text-sm">Дедлайн</div>
              </div>
              <div className="text-center bg-gray-50 rounded-lg p-3">
                <div className="text-lg font-bold text-gray-900">{program.availableSpots || '10'}</div>
                <div className="text-gray-500 text-sm">Места</div>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="lg:w-48 flex flex-col gap-3">
            <button
              onClick={handleApply}
              disabled={isApplying || program.availableSpots === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                program.availableSpots > 0 && !isApplying
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isApplying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Отправка...
                </>
              ) : (
                <>
                  <span className="mr-2">📝</span>
                  Подать заявку
                </>
              )}
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:border-blue-300 transition-colors font-medium flex items-center justify-center"
            >
              <span className="mr-2">{isExpanded ? '📋' : '🔍'}</span>
              {isExpanded ? 'Свернуть' : 'Подробнее'}
            </button>

            {program.website && (
              <a
                href={program.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center"
              >
                <span className="mr-2">🌐</span>
                Сайт вуза
              </a>
            )}
          </div>
        </div>

        {/* Расширенная информация */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Требования */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📋</span>
                  <span>Требования</span>
                </h4>
                <ul className="space-y-2">
                  {(program.requirements || [
                    'Средний балл от 4.0',
                    'Уровень языка B2',
                    'Рекомендации преподавателей'
                  ]).map((req, reqIndex) => (
                    <li key={reqIndex} className="flex items-start text-gray-700">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Преимущества */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>⭐</span>
                  <span>Преимущества</span>
                </h4>
                <ul className="space-y-2">
                  {(program.benefits || [
                    'Стипендия покрывает проживание',
                    'Языковые курсы',
                    'Культурная программа'
                  ]).map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start text-gray-700">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Доступные курсы */}
            {program.availableCourses && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📚</span>
                  <span>Доступные курсы</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {program.availableCourses.map((course, courseIndex) => (
                    <span key={courseIndex} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangePrograms;