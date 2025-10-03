import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ScientificCouncil = () => {
  const { t } = useTranslation();
  const [filterField, setFilterField] = useState('all');
  
  const data = t('science.sections.council', { returnObjects: true });
  const members = filterField === 'all' 
    ? data.members 
    : data.members.filter(member => member.field === filterField);

  const fields = [...new Set(data.members.map(member => member.field))];

  return (
    <div className="space-y-8">
      {/* Информация о совете */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{data.info.title}</h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">{data.info.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {data.info.stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-white rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
                  <div className="text-gray-700 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h4 className="font-bold text-gray-800 mb-4 text-lg">Основные функции</h4>
            <ul className="space-y-3">
              {data.info.functions.map((func, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-green-500 text-xl mt-1">✓</span>
                  <span className="text-gray-700">{func}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Фильтр по направлениям */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilterField('all')}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              filterField === 'all'
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Все направления
          </button>
          {fields.map((field) => (
            <button
              key={field}
              onClick={() => setFilterField(field)}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                filterField === field
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {field}
            </button>
          ))}
        </div>
      </div>

      {/* Члены совета */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Члены научно-технического совета</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => (
            <MemberCard key={index} member={member} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MemberCard = ({ member, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-2"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="text-center mb-4">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
          {member.avatar}
        </div>
        <h4 className="font-bold text-gray-800 text-lg leading-tight">{member.name}</h4>
        <p className="text-blue-600 font-medium text-sm mt-1">{member.position}</p>
        <p className="text-gray-500 text-xs mt-1">{member.academicTitle}</p>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Направление:</span>
          <span className="font-medium text-gray-800">{member.field}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Стаж:</span>
          <span className="font-medium text-gray-800">{member.experience}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Ученая степень:</span>
          <span className="font-medium text-gray-800">{member.degree}</span>
        </div>
      </div>
      
      <div className={`mt-4 pt-4 border-t border-gray-100 transition-all duration-300 ${
        isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
      }`}>
        <div className="mb-3">
          <div className="text-gray-600 text-sm mb-2">Области экспертизы:</div>
          <div className="flex flex-wrap gap-1">
            {member.expertise.map((exp, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {exp}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex space-x-3 text-sm">
          {member.email && (
            <a 
              href={`mailto:${member.email}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              📧 Email
            </a>
          )}
          {member.phone && (
            <a 
              href={`tel:${member.phone}`}
              className="text-green-600 hover:text-green-700 font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              📞 {member.phone}
            </a>
          )}
        </div>
      </div>
      
      <div className="text-center mt-4">
        <button 
          className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? 'Свернуть' : 'Подробнее'}
        </button>
      </div>
    </div>
  );
};

export default ScientificCouncil;