import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Scholarship = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('active');
  
  const data = t('students.scholarships', { returnObjects: true });

  const types = ['all', ...new Set(data.types.map(scholarship => scholarship.type))];

  const filteredScholarships = data.types.filter(scholarship => {
    const matchesType = selectedType === 'all' || scholarship.type === selectedType;
    const matchesStatus = scholarship.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
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
            className="bg-white rounded-2xl p-6 text-center border border-yellow-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="text-3xl font-bold text-yellow-600 mb-2">{stat.value}</div>
            <div className="text-gray-600 font-medium text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Фильтры */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">🎯 Тип стипендии</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
            >
              <option value="all">Все типы</option>
              {types.filter(type => type !== 'all').map(type => (
                <option key={type} value={type}>
                  {data.scholarshipTypes[type]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">📊 Статус</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all"
            >
              <option value="active">Активные</option>
              <option value="upcoming">Предстоящие</option>
              <option value="archived">Архивные</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={() => {
                setSelectedType('all');
                setSelectedStatus('active');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors duration-300 font-medium"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>
      </div>

      {/* Стипендии */}
      <div className="space-y-6">
        {filteredScholarships.map((scholarship, index) => (
          <ScholarshipCard key={index} scholarship={scholarship} index={index} />
        ))}
      </div>

      {filteredScholarships.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Стипендии не найдены</h3>
          <p className="text-gray-500">Попробуйте изменить параметры фильтрации</p>
        </div>
      )}

      {/* Календарь выплат */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
        <h3 className="text-2xl font-bold mb-4 text-center">📅 Календарь выплат</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.paymentSchedule.map((payment, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-lg font-bold mb-1">{payment.date}</div>
              <div className="text-yellow-100 text-sm">{payment.type}</div>
              <div className="text-green-200 text-xs mt-2">{payment.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ScholarshipCard = ({ scholarship, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    // Имитация подачи заявки
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsApplying(false);
    alert(`Заявка на стипендию "${scholarship.name}" отправлена!`);
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-700',
      'upcoming': 'bg-blue-100 text-blue-700',
      'archived': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || colors.active;
  };

  return (
    <div 
      className="bg-white rounded-2xl border-2 border-gray-200 hover:border-yellow-300 overflow-hidden hover:shadow-xl transition-all duration-500 group transform hover:-translate-y-1"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Основная информация */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-yellow-600 transition-colors">
                  {scholarship.name}
                </h3>
                <div className="flex items-center space-x-4 text-gray-600 mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(scholarship.status)}`}>
                    {scholarship.statusLabel}
                  </span>
                  <span className="flex items-center">
                    🎯 {scholarship.typeLabel}
                  </span>
                  <span className="flex items-center">
                    ⏱️ {scholarship.duration}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-yellow-600 mb-1">{scholarship.amount}</div>
                <div className="text-gray-500 text-sm">В месяц</div>
              </div>
            </div>

            <p className="text-gray-600 mb-4 leading-relaxed">{scholarship.description}</p>

            {/* Быстрая информация */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{scholarship.deadline}</div>
                <div className="text-gray-500 text-sm">Дедлайн</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{scholarship.availableSpots}</div>
                <div className="text-gray-500 text-sm">Места</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{scholarship.minGPA}</div>
                <div className="text-gray-500 text-sm">Мин. GPA</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{scholarship.paymentDate}</div>
                <div className="text-gray-500 text-sm">Выплата</div>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="lg:w-48 flex flex-col space-y-3">
            <button
              onClick={handleApply}
              disabled={isApplying || scholarship.status !== 'active'}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                scholarship.status === 'active' && !isApplying
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-lg transform hover:-translate-y-0.5'
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

            {scholarship.guidelinesUrl && (
              <a
                href={scholarship.guidelinesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 border border-yellow-500 text-yellow-500 rounded-xl hover:bg-yellow-50 transition-colors duration-300 font-medium flex items-center justify-center"
              >
                <span className="mr-2">📖</span>
                Правила
              </a>
            )}
          </div>
        </div>

        {/* Расширенная информация */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}>
          {/* Требования */}
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
            <h4 className="font-semibold text-gray-800 mb-3">📋 Требования</h4>
            <ul className="space-y-2">
              {scholarship.requirements.map((req, reqIndex) => (
                <li key={reqIndex} className="flex items-start text-gray-700">
                  <span className="text-yellow-500 mr-2 mt-1">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Преимущества */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <h4 className="font-semibold text-gray-800 mb-3">⭐ Преимущества</h4>
            <ul className="space-y-2">
              {scholarship.benefits.map((benefit, benefitIndex) => (
                <li key={benefitIndex} className="flex items-start text-gray-700">
                  <span className="text-green-500 mr-2 mt-1">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Документы */}
          {scholarship.requiredDocuments && (
            <div className="lg:col-span-2">
              <h4 className="font-semibold text-gray-800 mb-3">📎 Необходимые документы</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {scholarship.requiredDocuments.map((doc, docIndex) => (
                  <div key={docIndex} className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {doc}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scholarship;