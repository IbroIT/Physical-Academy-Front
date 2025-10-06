import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const StudentClubs = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const data = t('students.clubs', { returnObjects: true });

  const categories = ['all', ...new Set(data.list.map(club => club.category))];

  const filteredClubs = data.list.filter(club => {
    const matchesCategory = selectedCategory === 'all' || club.category === selectedCategory;
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {data.title}
        </h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-sm">
          {data.subtitle}
        </p>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Поиск клубов и сообществ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
          >
            <option value="all">Все категории</option>
            {categories.filter(cat => cat !== 'all').map(category => (
              <option key={category} value={category}>
                {data.categories[category]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {data.stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg p-4 text-center border border-gray-200 hover:shadow-md transition-all duration-200"
          >
            <div className="text-xl font-bold text-blue-600 mb-1">
              {stat.value}
            </div>
            <div className="text-gray-600 font-medium text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Список клубов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClubs.map((club, index) => (
          <ClubCard key={index} club={club} index={index} />
        ))}
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-2xl mx-auto mb-3">
            🔍
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-1">Клубы не найдены</h3>
          <p className="text-gray-500 text-sm">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
};

const ClubCard = ({ club, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    setIsJoining(true);
    // Имитация отправки заявки
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsJoining(false);
    alert(`Заявка в клуб "${club.name}" отправлена!`);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 overflow-hidden hover:shadow-md transition-all duration-200 group cursor-pointer">
      {/* Заголовок */}
      <div 
        className="bg-blue-600 p-4 text-white"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl">{club.icon}</div>
          <span className="bg-blue-700 px-2 py-1 rounded text-xs font-medium">
            {club.members} участников
          </span>
        </div>
        <h3 className="text-lg font-bold mb-1">{club.name}</h3>
        <p className="text-blue-100 text-xs opacity-90">{club.shortDescription}</p>
      </div>

      {/* Контент */}
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{club.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              📅 {club.meetings}
            </span>
            <span className="flex items-center">
              🏷️ {club.category}
            </span>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            club.status === 'active' 
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {club.status === 'active' ? 'Активен' : 'Набор'}
          </span>
        </div>

        {/* Дополнительная информация */}
        <div className={`space-y-3 transition-all duration-200 overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          {club.leaders && (
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">👥 Руководители:</h4>
              <div className="space-y-1">
                {club.leaders.map((leader, i) => (
                  <div key={i} className="text-xs text-gray-600">
                    {leader.name} - {leader.role}
                  </div>
                ))}
              </div>
            </div>
          )}

          {club.upcomingEvents && club.upcomingEvents.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">📅 Ближайшие события:</h4>
              <div className="space-y-2">
                {club.upcomingEvents.slice(0, 2).map((event, i) => (
                  <div key={i} className="text-xs bg-gray-50 rounded p-2">
                    <div className="font-medium text-gray-800">{event.name}</div>
                    <div className="text-gray-500">{event.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {club.tags.map((tag, i) => (
              <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex space-x-2 mt-3">
          <button
            onClick={handleJoin}
            disabled={isJoining || club.status !== 'active'}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm ${
              club.status === 'active' && !isJoining
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isJoining ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                Отправка...
              </>
            ) : (
              <>
                <span className="mr-1.5">🤝</span>
                Присоединиться
              </>
            )}
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentClubs;