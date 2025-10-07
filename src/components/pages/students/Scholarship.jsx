import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const Scholarship = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [expandedCard, setExpandedCard] = useState(null);
  const sectionRef = useRef(null);
  
  const data = t('students.scholarships', { returnObjects: true });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startCounters();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const startCounters = () => {
    const targetValues = data.stats.map(stat => parseInt(stat.value.replace(/\D/g, '')));
    const duration = 2000;
    const steps = 60;
    const stepValues = targetValues.map(target => target / steps);

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      setCounterValues(prev => 
        prev.map((value, index) => {
          if (currentStep <= steps) {
            return Math.min(value + stepValues[index], targetValues[index]);
          }
          return value;
        })
      );

      if (currentStep >= steps) {
        clearInterval(counterInterval);
      }
    }, duration / steps);
  };

  const types = ['all', ...new Set(data.types.map(scholarship => scholarship.type))];

  const filteredScholarships = data.types.filter(scholarship => {
    const matchesType = selectedType === 'all' || scholarship.type === selectedType;
    const matchesStatus = scholarship.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedStatus('active');
  };

  return (
    <div ref={sectionRef} className="space-y-8">
      {/* Header */}
      <div className={`text-center mb-8 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
          {data.title}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-6"></div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {data.subtitle}
        </p>
      </div>

      {/* Statistics */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {data.stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 text-center border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2 font-mono">
              {stat.value.includes('%') 
                ? `${Math.round(counterValues[index])}%`
                : stat.value.includes('+')
                ? `${Math.round(counterValues[index])}+`
                : Math.round(counterValues[index])
              }
            </div>
            <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
            <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 mt-3 mx-auto"></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm transition-all duration-1000 delay-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white mr-2 text-sm">🎯</span>
              Тип стипендии
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            >
              <option value="all">Все типы стипендий</option>
              {types.filter(type => type !== 'all').map(type => (
                <option key={type} value={type}>
                  {data.scholarshipTypes[type]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 mb-3 flex items-center">
              <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-2 text-sm">📊</span>
              Статус
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
            >
              <option value="active">Активные</option>
              <option value="upcoming">Предстоящие</option>
              <option value="archived">Архивные</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={resetFilters}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:shadow-lg transition-all duration-300 font-medium text-lg transform hover:-translate-y-0.5"
            >
              Сбросить фильтры
            </button>
          </div>
        </div>

        {/* Active filters info */}
        {(selectedType !== 'all' || selectedStatus !== 'active') && (
          <div className="mt-4 flex flex-wrap gap-2">
            {selectedType !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Тип: {data.scholarshipTypes[selectedType]}
                <button 
                  onClick={() => setSelectedType('all')}
                  className="ml-2 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {selectedStatus !== 'active' && (
              <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Статус: {selectedStatus === 'upcoming' ? 'Предстоящие' : 'Архивные'}
                <button 
                  onClick={() => setSelectedStatus('active')}
                  className="ml-2 hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results count */}
      <div className={`transition-all duration-1000 delay-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600 text-lg">
            Найдено стипендий: <span className="font-semibold text-gray-900">{filteredScholarships.length}</span>
          </p>
          {filteredScholarships.length > 0 && (
            <p className="text-gray-500 text-sm">
              Статус: {selectedStatus === 'active' ? 'активные' : selectedStatus === 'upcoming' ? 'предстоящие' : 'архивные'}
            </p>
          )}
        </div>

        {/* Scholarships */}
        <div className="space-y-6">
          {filteredScholarships.map((scholarship, index) => (
            <ScholarshipCard 
              key={index} 
              scholarship={scholarship} 
              index={index}
              isExpanded={expandedCard === index}
              onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
            />
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">Стипендии не найдены</h3>
            <p className="text-gray-500 text-lg mb-6">Попробуйте изменить параметры фильтрации</p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-300 font-medium"
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>

      {/* Payment Schedule */}
      <div className={`bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white shadow-xl transition-all duration-1000 delay-900 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
          <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">📅</span>
          Календарь выплат
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.paymentSchedule.map((payment, index) => (
            <div 
              key={index} 
              className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/30 transition-all duration-500 transform hover:-translate-y-2 group"
            >
              <div className="text-xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">{payment.date}</div>
              <div className="text-blue-100 text-lg mb-3">{payment.type}</div>
              <div className="text-green-200 text-lg font-semibold">{payment.amount}</div>
              <div className="w-0 group-hover:w-full h-1 bg-white/50 transition-all duration-500 mt-3 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className={`bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 text-center border border-gray-200 transition-all duration-1000 delay-1100 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Нужна помощь с выбором стипендии?
        </h3>
        <p className="text-gray-600 mb-6 text-lg">
          Наши консультанты помогут подобрать подходящие стипендии и подготовить документы
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            Получить консультацию
          </button>
          <button className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
            Частые вопросы
          </button>
        </div>
      </div>
    </div>
  );
};

const ScholarshipCard = ({ scholarship, index, isExpanded, onToggle }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    // Simulate application submission
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

  const getStatusLabel = (status) => {
    const labels = {
      'active': 'Активная',
      'upcoming': 'Предстоящая',
      'archived': 'Архивная'
    };
    return labels[status] || labels.active;
  };

  return (
    <div 
      className="bg-white rounded-2xl border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
      
      <div className="p-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Main Information */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {scholarship.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-4">
                  <span className={`px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(scholarship.status)}`}>
                    {getStatusLabel(scholarship.status)}
                  </span>
                  <span className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    🎯 {scholarship.typeLabel}
                  </span>
                  <span className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm">
                    ⏱️ {scholarship.duration}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 mb-1">{scholarship.amount}</div>
                <div className="text-gray-500 text-sm">В месяц</div>
              </div>
            </div>

            <p className="text-gray-700 text-lg mb-6 leading-relaxed">{scholarship.description}</p>

            {/* Quick Info */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-300 group">
                <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{scholarship.deadline}</div>
                <div className="text-gray-600 text-sm">Дедлайн</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-300 group">
                <div className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">{scholarship.availableSpots}</div>
                <div className="text-gray-600 text-sm">Места</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors duration-300 group">
                <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{scholarship.minGPA}</div>
                <div className="text-gray-600 text-sm">Мин. GPA</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors duration-300 group">
                <div className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">{scholarship.paymentDate}</div>
                <div className="text-gray-600 text-sm">Выплата</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="lg:w-48 flex flex-col space-y-3">
            <button
              onClick={handleApply}
              disabled={isApplying || scholarship.status !== 'active'}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center transform hover:-translate-y-0.5 ${
                scholarship.status === 'active' && !isApplying
                  ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg'
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
              onClick={onToggle}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center transform hover:-translate-y-0.5"
            >
              <span className="mr-2">{isExpanded ? '📋' : '🔍'}</span>
              {isExpanded ? 'Свернуть' : 'Подробнее'}
            </button>

            {scholarship.guidelinesUrl && (
              <a
                href={scholarship.guidelinesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 border border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center transform hover:-translate-y-0.5"
              >
                <span className="mr-2">📖</span>
                Правила
              </a>
            )}
          </div>
        </div>

        {/* Expanded Information */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-500 overflow-hidden ${
          isExpanded ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}>
          {/* Requirements */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
            <h4 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">📋</span>
              Требования
            </h4>
            <ul className="space-y-3">
              {scholarship.requirements.map((req, reqIndex) => (
                <li key={reqIndex} className="flex items-start text-gray-700 group">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                  <span className="text-lg group-hover:text-gray-900 transition-colors duration-300">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Benefits */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
            <h4 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
              <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">⭐</span>
              Преимущества
            </h4>
            <ul className="space-y-3">
              {scholarship.benefits.map((benefit, benefitIndex) => (
                <li key={benefitIndex} className="flex items-start text-gray-700 group">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                  <span className="text-lg group-hover:text-gray-900 transition-colors duration-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Documents */}
          {scholarship.requiredDocuments && (
            <div className="lg:col-span-2">
              <h4 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">📎</span>
                Необходимые документы
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {scholarship.requiredDocuments.map((doc, docIndex) => (
                  <div key={docIndex} className="flex items-center text-lg text-gray-700 group hover:text-gray-900 transition-colors duration-300">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-4 group-hover:scale-150 transition-transform duration-300"></span>
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