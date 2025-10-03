import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ExchangePrograms = () => {
  const { t } = useTranslation();
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  
  const data = t('students.exchange', { returnObjects: true });

  const regions = ['all', ...new Set(data.programs.map(program => program.region))];
  const durations = ['all', ...new Set(data.programs.map(program => program.durationType))];

  const filteredPrograms = data.programs.filter(program => {
    const matchesRegion = selectedRegion === 'all' || program.region === selectedRegion;
    const matchesDuration = selectedDuration === 'all' || program.durationType === selectedDuration;
    return matchesRegion && matchesDuration;
  });

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          {data.title}
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          {data.subtitle}
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 text-center border border-blue-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
            <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Фильтры */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  {data.regions[region]}
                </option>
              ))}
            </select>
          </div>

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
                  {data.durations[duration]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={() => {
                setSelectedRegion('all');
                setSelectedDuration('all');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-300 font-medium"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>

      {/* Программы обмена */}
      <div className="space-y-6">
        {filteredPrograms.map((program, index) => (
          <ProgramCard key={index} program={program} index={index} />
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Программы не найдены</h3>
          <p className="text-gray-500">Попробуйте изменить параметры фильтрации</p>
        </div>
      )}

      {/* Дедлайны */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
        <h3 className="text-2xl font-bold mb-4 text-center">📅 Ближайшие дедлайны</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.deadlines.map((deadline, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-lg font-bold mb-1">{deadline.date}</div>
              <div className="text-blue-100 text-sm">{deadline.program}</div>
              <div className="text-green-200 text-xs mt-2">{deadline.daysLeft}</div>
            </div>
          ))}
        </div>
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

  return (
    <div 
      className="bg-white rounded-2xl border-2 border-gray-200 hover:border-blue-300 overflow-hidden hover:shadow-xl transition-all duration-500 group transform hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Основная информация */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {program.university}
                </h3>
                <div className="flex items-center space-x-4 text-gray-600 mb-3">
                  <span className="flex items-center text-xl">
                    {program.country}
                  </span>
                  <span className="flex items-center">
                    ⏱️ {program.duration}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    program.difficulty === 'high' 
                      ? 'bg-red-100 text-red-700'
                      : program.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {program.difficultyLabel}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 mb-1">{program.cost}</div>
                <div className="text-gray-500 text-sm">Стоимость</div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">{program.description}</p>

            {/* Быстрая информация */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{program.language}</div>
                <div className="text-gray-500 text-sm">Язык</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{program.grantsAvailable}</div>
                <div className="text-gray-500 text-sm">Гранты</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{program.deadline}</div>
                <div className="text-gray-500 text-sm">Дедлайн</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{program.availableSpots}</div>
                <div className="text-gray-500 text-sm">Места</div>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="lg:w-48 flex flex-col space-y-3">
            <button
              onClick={handleApply}
              disabled={isApplying || program.availableSpots === 0}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                program.availableSpots > 0 && !isApplying
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg transform hover:-translate-y-0.5'
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
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-300 font-medium flex items-center justify-center"
            >
              <span className="mr-2">{isExpanded ? '📋' : '🔍'}</span>
              {isExpanded ? 'Свернуть' : 'Подробнее'}
            </button>

            <a
              href={program.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 border border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 transition-colors duration-300 font-medium flex items-center justify-center"
            >
              <span className="mr-2">🌐</span>
              Сайт вуза
            </a>
          </div>
        </div>

        {/* Расширенная информация */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}>
          {/* Требования */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-3">📋 Требования</h4>
            <ul className="space-y-2">
              {program.requirements.map((req, reqIndex) => (
                <li key={reqIndex} className="flex items-start text-gray-700">
                  <span className="text-blue-500 mr-2 mt-1">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Преимущества */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <h4 className="font-semibold text-gray-800 mb-3">⭐ Преимущества</h4>
            <ul className="space-y-2">
              {program.benefits.map((benefit, benefitIndex) => (
                <li key={benefitIndex} className="flex items-start text-gray-700">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Предметы */}
          {program.availableCourses && (
            <div className="lg:col-span-2">
              <h4 className="font-semibold text-gray-800 mb-3">📚 Доступные курсы</h4>
              <div className="flex flex-wrap gap-2">
                {program.availableCourses.map((course, courseIndex) => (
                  <span key={courseIndex} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExchangePrograms;