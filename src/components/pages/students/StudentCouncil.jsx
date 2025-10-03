import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const StudentCouncil = () => {
  const { t } = useTranslation();
  const [selectedMember, setSelectedMember] = useState(null);
  
  const data = t('students.council', { returnObjects: true });

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          {data.title}
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          {data.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Члены совета */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.members.map((member, index) => (
              <MemberCard 
                key={index} 
                member={member} 
                index={index}
                onSelect={setSelectedMember}
                isSelected={selectedMember?.id === member.id}
              />
            ))}
          </div>
        </div>

        {/* Информация о совете */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">📊 Статистика совета</h3>
            <div className="space-y-3">
              {data.stats.map((stat, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-gray-600">{stat.label}</span>
                  <span className="font-bold text-blue-600">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-lg">
            <h3 className="font-bold text-gray-800 mb-4 text-lg">🎯 Основные цели</h3>
            <ul className="space-y-2">
              {data.goals.map((goal, index) => (
                <li key={index} className="flex items-start text-gray-700">
                  <span className="text-green-500 mr-2 mt-1">•</span>
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Инициативы */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6 text-center">🚀 Текущие инициативы</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.initiatives.map((initiative, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl mb-3">{initiative.icon}</div>
              <h4 className="font-semibold mb-2">{initiative.title}</h4>
              <p className="text-blue-100 text-sm opacity-90">{initiative.description}</p>
              <div className="mt-3 text-xs text-green-200">
                {initiative.progress}% выполнено
              </div>
            </div>
          ))}
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
      className={`bg-white rounded-2xl p-6 border-2 transition-all duration-500 cursor-pointer transform hover:-translate-y-2 ${
        isSelected 
          ? 'border-green-500 shadow-xl scale-105' 
          : 'border-gray-200 hover:border-green-300 hover:shadow-lg'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onSelect(member)}
    >
      <div className="text-center">
        <div className="relative inline-block mb-4">
          {member.avatar ? (
            <img 
              src={member.avatar} 
              alt={member.name}
              className="w-20 h-20 rounded-full mx-auto border-4 border-green-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full mx-auto border-4 border-green-200 bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center text-white font-bold text-xl">
              {generateInitials(member.name)}
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            {member.role === 'president' ? '👑' : '⭐'}
          </div>
        </div>
        
        <h3 className="font-bold text-gray-800 text-lg mb-1">{member.name}</h3>
        <p className="text-green-600 font-semibold mb-1">{member.position}</p>
        <p className="text-gray-600 text-sm mb-3">{member.department}</p>
        
        <div className="flex flex-wrap gap-1 justify-center">
          {member.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              {tag}
            </span>
          ))}
          {member.tags.length > 2 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
              +{member.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const MemberModal = ({ member, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Заголовок */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 text-white rounded-t-2xl">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-16 h-16 rounded-full border-4 border-white/50"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full border-4 border-white/50 bg-white/20 flex items-center justify-center text-white font-bold text-lg">
                    {member.name.split(' ').map(w => w[0]).join('')}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  <p className="text-green-100">{member.position}</p>
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

          {/* Контент */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">📋 Информация</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Факультет:</span>
                    <span className="font-medium">{member.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Курс:</span>
                    <span className="font-medium">{member.course}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Роль:</span>
                    <span className="font-medium text-green-600">{member.roleLabel}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-3">📞 Контакты</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <span className="w-6">📧</span>
                    <a href={`mailto:${member.email}`} className="hover:text-green-600">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-6">📱</span>
                    <a href={`tel:${member.phone}`} className="hover:text-green-600">
                      {member.phone}
                    </a>
                  </div>
                  {member.telegram && (
                    <div className="flex items-center text-gray-600">
                      <span className="w-6">📢</span>
                      <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-green-600">
                        Telegram
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🎯 Обязанности</h4>
              <ul className="space-y-2">
                {member.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">🏆 Достижения</h4>
              <div className="flex flex-wrap gap-2">
                {member.achievements.map((achievement, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
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