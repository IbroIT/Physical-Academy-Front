import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const StudentCouncil = () => {
  const { t } = useTranslation();
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState('members');
  
  const data = t('students.council', { returnObjects: true });

  const tabs = [
    { id: 'members', label: 'Члены совета', icon: '👥' },
    { id: 'initiatives', label: 'Инициативы', icon: '🚀' },
    { id: 'events', label: 'Мероприятия', icon: '📅' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          {data?.title || 'Студенческий совет'}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          {data?.subtitle || 'Представительство студентов и организация студенческой жизни'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl p-2 border border-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(data?.stats || [
          { label: 'Всего членов', value: '24' },
          { label: 'Факультетов', value: '8' },
          { label: 'Инициатив в год', value: '50+' },
          { label: 'Участников мероприятий', value: '1000+' }
        ]).map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-4 text-center border border-gray-300 hover:border-blue-300 transition-colors">
            <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
            <div className="text-gray-700 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'members' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(data?.members || []).map((member, index) => (
                <MemberCard 
                  key={member.id || index} 
                  member={member} 
                  index={index}
                  onSelect={setSelectedMember}
                  isSelected={selectedMember?.id === member.id}
                />
              ))}
            </div>
          )}

          {activeTab === 'initiatives' && (
            <div className="space-y-6">
              {(data?.initiatives || []).map((initiative, index) => (
                <InitiativeCard key={index} initiative={initiative} index={index} />
              ))}
            </div>
          )}

          {activeTab === 'events' && (
            <div className="space-y-6">
              {(data?.events || []).map((event, index) => (
                <EventCard key={index} event={event} index={index} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Goals */}
          <div className="bg-white rounded-2xl p-6 border border-gray-300">
            <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
              <span>🎯</span>
              <span>Основные цели</span>
            </h3>
            <ul className="space-y-3">
              {(data?.goals || [
                'Представление интересов студентов',
                'Организация мероприятий',
                'Развитие студенческого сообщества',
                'Поддержка студенческих инициатив'
              ]).map((goal, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                    <span className="text-green-600 text-xs">✓</span>
                  </div>
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
              <span>💡</span>
              <span>Быстрые действия</span>
            </h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Предложить идею
              </button>
              <button className="w-full bg-white border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
                Стать волонтером
              </button>
              <button className="w-full bg-white border border-gray-600 text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Задать вопрос
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
              <span>📞</span>
              <span>Контакты</span>
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <span>📧</span>
                <span>council@academy.edu</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span>🏢</span>
                <span>Кабинет 215, Главный корпус</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <span>🕒</span>
                <span>Пн-Пт 14:00-18:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно с деталями члена совета */}
      {selectedMember && (
        <MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </div>
  );
};

const MemberCard = ({ member, index, onSelect, isSelected }) => {
  const generateInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div 
      className={`bg-white rounded-2xl p-6 border transition-all duration-300 cursor-pointer ${
        isSelected 
          ? 'border-blue-600 shadow-lg' 
          : 'border-gray-300 hover:border-blue-300 hover:shadow-md'
      }`}
      onClick={() => onSelect(member)}
    >
      <div className="text-center">
        <div className="relative inline-block mb-4">
          {member.avatar ? (
            <img 
              src={member.avatar} 
              alt={member.name}
              className="w-20 h-20 rounded-full mx-auto border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full mx-auto border-2 border-gray-200 bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              {generateInitials(member.name)}
            </div>
          )}
          <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white ${
            member.role === 'president' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'
          }`}>
            {member.role === 'president' ? '👑' : '⭐'}
          </div>
        </div>
        
        <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
        <p className="text-blue-600 font-semibold mb-1">{member.position}</p>
        <p className="text-gray-600 text-sm mb-3">{member.department}</p>
        
        <div className="flex flex-wrap gap-1 justify-center">
          {(member.tags || []).slice(0, 2).map((tag, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {tag}
            </span>
          ))}
          {member.tags?.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              +{member.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const InitiativeCard = ({ initiative, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-300 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-blue-600 text-xl">{initiative.icon || '🚀'}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{initiative.title}</h3>
            <p className="text-gray-600">{initiative.description}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <svg 
            className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Прогресс</span>
          <span className="text-sm font-medium text-blue-600">{initiative.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${initiative.progress}%` }}
          ></div>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Задачи</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                {(initiative.tasks || []).map((task, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-500">•</span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Участники</h4>
              <div className="flex flex-wrap gap-2">
                {(initiative.participants || []).map((participant, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {participant}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Присоединиться к инициативе
          </button>
        </div>
      )}
    </div>
  );
};

const EventCard = ({ event, index }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-300 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-green-600 text-xl">📅</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-3">{event.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <span>📅</span>
                <span>{event.date}</span>
              </span>
              <span className="flex items-center gap-1">
                <span>🕒</span>
                <span>{event.time}</span>
              </span>
              <span className="flex items-center gap-1">
                <span>📍</span>
                <span>{event.location}</span>
              </span>
              <span className="flex items-center gap-1">
                <span>👥</span>
                <span>{event.participantsCount} участников</span>
              </span>
            </div>
          </div>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex-shrink-0">
          Записаться
        </button>
      </div>
    </div>
  );
};

const MemberModal = ({ member, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Header */}
          <div className="bg-blue-600 p-6 text-white rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-16 h-16 rounded-full border-2 border-white"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border-2 border-white bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
                    {member.name.split(' ').map(w => w[0]).join('')}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  <p className="text-blue-100">{member.position}</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📋</span>
                  <span>Информация</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Факультет:</span>
                    <span className="font-medium text-gray-900">{member.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Курс:</span>
                    <span className="font-medium text-gray-900">{member.course}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Роль:</span>
                    <span className="font-medium text-blue-600">{member.roleLabel}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span>📞</span>
                  <span>Контакты</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <span className="w-6">📧</span>
                    <a href={`mailto:${member.email}`} className="hover:text-blue-600">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-6">📱</span>
                    <a href={`tel:${member.phone}`} className="hover:text-blue-600">
                      {member.phone}
                    </a>
                  </div>
                  {member.telegram && (
                    <div className="flex items-center text-gray-600">
                      <span className="w-6">📢</span>
                      <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                        Telegram
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>🎯</span>
                <span>Обязанности</span>
              </h4>
              <ul className="space-y-2">
                {(member.responsibilities || []).map((resp, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-blue-500 mr-2 mt-1">•</span>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>🏆</span>
                <span>Достижения</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(member.achievements || []).map((achievement, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCouncil;