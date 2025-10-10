import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStudentClubsPageData, useJoinStudentClub } from '../../../hooks/useApi';
import { LoadingSkeleton } from '../../common/Loading';

const StudentClubs = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Build filters for API
  const filters = {};
  if (selectedCategory !== 'all') {
    filters.category = selectedCategory;
  }
  if (searchTerm.trim()) {
    filters.search = searchTerm;
  }

  // Fetch page data from API
  const { data, loading, error } = useStudentClubsPageData(filters);

  // Handle loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Handle error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 text-2xl mx-auto mb-4">
          ⚠️
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {t('common.error', 'Ошибка загрузки')}
        </h3>
        <p className="text-gray-600 text-sm">{error}</p>
      </div>
    );
  }

  // Handle no data
  if (!data) {
    return null;
  }

  const { title, subtitle, stats, categories = [], clubs = [] } = data;

  // Add "all" option to categories
  const allCategories = ['all', ...categories.map(cat => cat.slug)];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-sm">
          {subtitle}
        </p>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={t('students.clubs.searchPlaceholder', 'Поиск клубов и сообществ...')}
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
            <option value="all">{t('students.clubs.allCategories', 'Все категории')}</option>
            {categories.map(category => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Статистика */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-lg p-4 text-center border border-gray-200 hover:shadow-md transition-all duration-200"
            >
              <div className="text-xl font-bold text-blue-600 mb-1">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Список клубов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>

      {clubs.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-2xl mx-auto mb-3">
            🔍
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-1">
            {t('students.clubs.notFound', 'Клубы не найдены')}
          </h3>
          <p className="text-gray-500 text-sm">
            {t('students.clubs.tryAdjustSearch', 'Попробуйте изменить параметры поиска')}
          </p>
        </div>
      )}
    </div>
  );
};

const ClubCard = ({ club }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { joinClub, loading: isJoining, error: joinError, success: joinSuccess, reset } = useJoinStudentClub();

  const handleJoin = async () => {
    try {
      // For now, we'll use a simple modal or prompt for user data
      // In a real app, you'd have a proper form/modal
      const email = prompt(t('students.clubs.enterEmail', 'Введите ваш email:'));
      const name = prompt(t('students.clubs.enterName', 'Введите ваше имя:'));

      if (!email || !name) {
        return;
      }

      const result = await joinClub(club.id, { email, name });

      if (result.join_link) {
        alert(
          `${result.message}\n\n${t('students.clubs.joinLink', 'Ссылка для вступления')}: ${result.join_link}`
        );
        // Open join link in new tab
        window.open(result.join_link, '_blank');
      } else {
        alert(result.message);
      }

      reset();
    } catch (error) {
      alert(t('students.clubs.joinError', 'Ошибка при отправке заявки. Попробуйте позже.'));
    }
  };

  // Get status display
  const getStatusDisplay = (status) => {
    const statusMap = {
      active: { text: t('students.clubs.statusActive', 'Активен'), class: 'bg-green-100 text-green-700' },
      recruiting: { text: t('students.clubs.statusRecruiting', 'Набор'), class: 'bg-yellow-100 text-yellow-700' },
      inactive: { text: t('students.clubs.statusInactive', 'Неактивен'), class: 'bg-gray-100 text-gray-700' }
    };
    return statusMap[status] || statusMap.active;
  };

  const statusDisplay = getStatusDisplay(club.status);

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
            {club.members_count} {t('students.clubs.members', 'участников')}
          </span>
        </div>
        <h3 className="text-lg font-bold mb-1">{club.name}</h3>
        <p className="text-blue-100 text-xs opacity-90">{club.short_description}</p>
      </div>
      {/* Контент */}
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-3 leading-relaxed">{club.description}</p>


        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              📅 {club.meetings}
            </span>
            {club.category && (
              <span className="flex items-center">
                🏷️ {club.category.name}
              </span>
            )}
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${statusDisplay.class}`}>
            {statusDisplay.text}
          </span>
        </div>

        {/* Дополнительная информация */}
        <div className={`space-y-3 transition-all duration-200 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
          {club.leaders && club.leaders.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">
                👥 {t('students.clubs.leaders', 'Руководители')}:
              </h4>
              <div className="space-y-1">
                {club.leaders.map((leader) => (
                  <div key={leader.id} className="text-xs text-gray-600">
                    {leader.name} - {leader.role}
                  </div>
                ))}
              </div>
            </div>
          )}

          {club.goals && (
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">
                🎯 {t('students.clubs.goals', 'Цели')}:
              </h4>
              <p className="text-xs text-gray-600 whitespace-pre-line">{club.goals}</p>
            </div>
          )}

          {club.motivation && (
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">
                💡 {t('students.clubs.motivation', 'Почему стоит присоединиться')}:
              </h4>
              <p className="text-xs text-gray-600 whitespace-pre-line">{club.motivation}</p>
            </div>
          )}

          {club.tags && club.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {club.tags.map((tag, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex space-x-2 mt-3">
          <button
            onClick={handleJoin}
            disabled={isJoining || club.status === 'inactive'}
            className={`flex-1 py-2 px-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center text-sm ${club.status !== 'inactive' && !isJoining
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {isJoining ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1.5"></div>
                {t('students.clubs.sending', 'Отправка...')}
              </>
            ) : (
              <>
                <span className="mr-1.5">🤝</span>
                {t('students.clubs.join', 'Присоединиться')}
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