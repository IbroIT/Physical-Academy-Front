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
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          {data.title}
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          {data.subtitle}
        </p>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Поиск клубов и сообществ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {data.stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Список клубов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.map((club, index) => (
          <ClubCard key={index} club={club} index={index} />
        ))}
      </div>

      {filteredClubs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Клубы не найдены</h3>
          <p className="text-gray-500">Попробуйте изменить параметры поиска</p>
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
    <div 
      className="bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-300 overflow-hidden hover:shadow-xl transition-all duration-500 group cursor-pointer transform hover:-translate-y-2"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Заголовок */}
      <div 
        className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative overflow-hidden"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="text-3xl">{club.icon}</div>
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              {club.members} участников
            </span>
          </div>
          <h3 className="text-xl font-bold mb-2">{club.name}</h3>
          <p className="text-purple-100 text-sm opacity-90">{club.shortDescription}</p>
        </div>
        
        {/* Анимированный фон */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      </div>

      {/* Контент */}
      <div className="p-6">
        <p className="text-gray-600 mb-4 leading-relaxed">{club.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              📅 {club.meetings}
            </span>
            <span className="flex items-center">
              🏷️ {club.category}
            </span>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            club.status === 'active' 
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {club.status === 'active' ? 'Активен' : 'Набор'}
          </span>
        </div>

        {/* Дополнительная информация */}
        <div className={`space-y-3 transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          {club.leaders && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">👥 Руководители:</h4>
              <div className="space-y-1">
                {club.leaders.map((leader, i) => (
                  <div key={i} className="text-sm text-gray-600">
                    {leader.name} - {leader.role}
                  </div>
                ))}
              </div>
            </div>
          )}

          {club.upcomingEvents && club.upcomingEvents.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">📅 Ближайшие события:</h4>
              <div className="space-y-2">
                {club.upcomingEvents.slice(0, 2).map((event, i) => (
                  <div key={i} className="text-sm bg-gray-50 rounded-lg p-2">
                    <div className="font-medium text-gray-800">{event.name}</div>
                    <div className="text-gray-500">{event.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {club.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex space-x-3 mt-4">
          <button
            onClick={handleJoin}
            disabled={isJoining || club.status !== 'active'}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
              club.status === 'active' && !isJoining
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isJoining ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Отправка...
              </>
            ) : (
              <>
                <span className="mr-2">🤝</span>
                Присоединиться
              </>
            )}
          </button>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center"
          >
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
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