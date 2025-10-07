import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ScientificCouncil = () => {
  const { t } = useTranslation();
  const [filterField, setFilterField] = useState('all');
  const [expandedMember, setExpandedMember] = useState(null);
  
  const data = t('science.sections.council', { returnObjects: true });
  const members = filterField === 'all' 
    ? data.members 
    : data.members.filter(member => member.field === filterField);

  const fields = [...new Set(data.members.map(member => member.field))];

  const toggleMember = (index) => {
    setExpandedMember(expandedMember === index ? null : index);
  };

  return (
    <div className="space-y-8">
      {/* Информация о совете */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{data.info.title}</h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">{data.info.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {data.info.stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
                  <div className="text-gray-700 text-sm font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Основные функции</h4>
            <ul className="space-y-3">
              {data.info.functions.map((func, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">{func}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Фильтр по направлениям */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilterField('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 border ${
              filterField === 'all'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
            }`}
          >
            Все направления
          </button>
          {fields.map((field) => (
            <button
              key={field}
              onClick={() => setFilterField(field)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 border ${
                filterField === field
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
              }`}
            >
              {field}
            </button>
          ))}
        </div>
      </div>

      {/* Члены совета */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Члены научно-технического совета</h3>
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
            {members.length} {members.length === 1 ? 'член' : 'членов'}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <MemberCard 
              key={index} 
              member={member} 
              index={index}
              isExpanded={expandedMember === index}
              onToggle={() => toggleMember(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const MemberCard = ({ member, index, isExpanded, onToggle }) => {
  return (
    <div 
      className="bg-white border border-gray-300 rounded-2xl p-6 hover:border-blue-300 transition-all duration-300 cursor-pointer"
      onClick={onToggle}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold group-hover:scale-110 transition-transform duration-300">
            {member.avatar || '👨‍🎓'}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-lg leading-tight truncate">{member.name}</h4>
          <p className="text-blue-600 font-medium text-sm mt-1 truncate">{member.position}</p>
          <p className="text-gray-500 text-xs mt-1 truncate">{member.academicTitle}</p>
        </div>
      </div>
      
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Направление:</span>
          <span className="font-medium text-gray-900">{member.field}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Стаж:</span>
          <span className="font-medium text-gray-900">{member.experience}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Ученая степень:</span>
          <span className="font-medium text-gray-900">{member.degree}</span>
        </div>
      </div>
      
      {/* Expandable Content */}
      <div className={`transition-all duration-300 overflow-hidden ${
        isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <div>
            <div className="text-gray-600 text-sm mb-2 font-medium">Области экспертизы:</div>
            <div className="flex flex-wrap gap-2">
              {member.expertise.map((exp, i) => (
                <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                  {exp}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4 text-sm">
            {member.email && (
              <a 
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                <span>📧</span>
                <span>Email</span>
              </a>
            )}
            {member.phone && (
              <a 
                href={`tel:${member.phone}`}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                <span>📞</span>
                <span>{member.phone}</span>
              </a>
            )}
          </div>

          {member.achievements && (
            <div>
              <div className="text-gray-600 text-sm mb-2 font-medium">Достижения:</div>
              <ul className="space-y-1 text-sm text-gray-700">
                {member.achievements.map((achievement, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Toggle Button */}
      <div className="flex justify-center mt-4 pt-4 border-t border-gray-200">
        <button 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <span>{isExpanded ? 'Свернуть' : 'Подробнее'}</span>
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
    </div>
  );
};

export default ScientificCouncil;