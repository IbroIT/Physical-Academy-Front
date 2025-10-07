// GeneralDepartments.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const GeneralDepartments = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('academic');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'academic', label: t('departments.categories.academic', 'Академические'), icon: '🎓', color: 'blue' },
    { id: 'administrative', label: t('departments.categories.administrative', 'Административные'), icon: '🏢', color: 'green' },
    { id: 'research', label: t('departments.categories.research', 'Научные'), icon: '🔬', color: 'purple' },
    { id: 'student', label: t('departments.categories.student', 'Студенческие'), icon: '👥', color: 'orange' },
    { id: 'technical', label: t('departments.categories.technical', 'Технические'), icon: '⚙️', color: 'red' }
  ];

  const departmentsData = t('departments.list', { returnObjects: true });
  
  // Фильтрация отделов по категории и поиску
  const filteredDepartments = Array.isArray(departmentsData) ? departmentsData
    .filter(dept => dept.category === activeCategory)
    .filter(dept => 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  const stats = [
    { number: '25+', label: t('departments.stats.departments', 'Отделов'), icon: '🏢' },
    { number: '150+', label: t('departments.stats.staff', 'Сотрудников'), icon: '👨‍🏫' },
    { number: '15', label: t('departments.stats.faculties', 'Факультетов'), icon: '🎓' },
    { number: '5', label: t('departments.stats.campuses', 'Кампусов'), icon: '🏛️' }
  ];

  const departmentFunctions = [
    { icon: '📚', title: t('departments.functions.education.title', 'Образование'), description: t('departments.functions.education.description', 'Организация учебного процесса и программ') },
    { icon: '🔬', title: t('departments.functions.research.title', 'Исследования'), description: t('departments.functions.research.description', 'Научная деятельность и разработки') },
    { icon: '🤝', title: t('departments.functions.community.title', 'Сообщество'), description: t('departments.functions.community.description', 'Развитие студенческого сообщества') },
    { icon: '💼', title: t('departments.functions.management.title', 'Управление'), description: t('departments.functions.management.description', 'Административное управление академией') }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return { 
          bg: 'bg-green-50', 
          border: 'border-green-200', 
          text: 'text-green-800',
          active: 'bg-green-600',
          light: 'bg-green-100'
        };
      case 'blue':
        return { 
          bg: 'bg-blue-50', 
          border: 'border-blue-200', 
          text: 'text-blue-800',
          active: 'bg-blue-600',
          light: 'bg-blue-100'
        };
      case 'purple':
        return { 
          bg: 'bg-purple-50', 
          border: 'border-purple-200', 
          text: 'text-purple-800',
          active: 'bg-purple-600',
          light: 'bg-purple-100'
        };
      case 'orange':
        return { 
          bg: 'bg-orange-50', 
          border: 'border-orange-200', 
          text: 'text-orange-800',
          active: 'bg-orange-600',
          light: 'bg-orange-100'
        };
      case 'red':
        return { 
          bg: 'bg-red-50', 
          border: 'border-red-200', 
          text: 'text-red-800',
          active: 'bg-red-600',
          light: 'bg-red-100'
        };
      default:
        return { 
          bg: 'bg-gray-50', 
          border: 'border-gray-200', 
          text: 'text-gray-800',
          active: 'bg-gray-600',
          light: 'bg-gray-100'
        };
    }
  };

  const currentCategory = categories.find(cat => cat.id === activeCategory);
  const categoryColors = currentCategory ? getColorClasses(currentCategory.color) : getColorClasses('blue');

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('departments.title', 'Отделы и структуры')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('departments.subtitle', 'Организационная структура академии и все подразделения')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 text-center border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {stat.number}
              </div>
              <div className="text-gray-800 text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder={t('departments.search.placeholder', 'Поиск по отделам...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <span className="text-gray-400 hover:text-gray-600">✕</span>
                  </button>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
              {t('departments.search.results', { count: filteredDepartments.length })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-2xl">📂</span>
                <span>{t('departments.categories.title', 'Категории')}</span>
              </h3>
              
              <div className="space-y-2">
                {categories.map((category) => {
                  const colors = getColorClasses(category.color);
                  const isActive = activeCategory === category.id;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setSelectedDepartment(null);
                      }}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center gap-3 group ${
                        isActive
                          ? `${colors.bg} ${colors.border} border shadow-sm`
                          : 'bg-white border border-transparent hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isActive ? colors.light : 'bg-gray-100'
                      }`}>
                        <span className={`text-lg ${isActive ? colors.text : 'text-gray-600'}`}>
                          {category.icon}
                        </span>
                      </div>
                      <span className={`font-medium ${isActive ? colors.text : 'text-gray-700'}`}>
                        {category.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${categoryColors.bg} rounded-xl flex items-center justify-center`}>
                    <span className={`text-2xl ${categoryColors.text}`}>{currentCategory?.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {currentCategory?.label}
                    </h2>
                    <p className="text-gray-600">
                      {t('departments.categoryDescription', { 
                        category: currentCategory?.label.toLowerCase() 
                      }, `Отделы ${currentCategory?.label.toLowerCase()} направлений`)}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                  {filteredDepartments.length} {t('departments.found', 'найдено')}
                </div>
              </div>
            </div>

            {/* Departments Grid */}
            {filteredDepartments.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {filteredDepartments.map((department, index) => {
                  const isSelected = selectedDepartment?.id === department.id;
                  const deptColors = getColorClasses(currentCategory.color);
                  
                  return (
                    <div
                      key={department.id || index}
                      onClick={() => setSelectedDepartment(department)}
                      className={`bg-white rounded-2xl border cursor-pointer transition-all duration-300 overflow-hidden ${
                        isSelected
                          ? `${deptColors.border} shadow-lg border-2`
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-2 ${
                              isSelected ? deptColors.text : 'text-gray-900'
                            }`}>
                              {department.name}
                            </h3>
                            <p className={`text-sm ${
                              isSelected ? 'text-gray-600' : 'text-gray-600'
                            }`}>
                              {department.description}
                            </p>
                          </div>
                          <div className={`text-3xl ml-4 ${
                            isSelected ? deptColors.text : 'text-gray-400'
                          }`}>
                            {department.icon || '🏢'}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm">👤</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium">{department.head}</div>
                            <div className="text-xs text-gray-500">
                              {t('departments.departmentHead', 'Руководитель отдела')}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <span>📞</span>
                                <span>{department.phone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>📍</span>
                                <span>{department.location}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* No Results */
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {t('departments.search.noResults.title', 'Отделы не найдены')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('departments.search.noResults.description', 'Попробуйте изменить поисковый запрос или выбрать другую категорию')}
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                >
                  {t('departments.search.clear', 'Очистить поиск')}
                </button>
              </div>
            )}

            {/* Selected Department Details */}
            {selectedDepartment && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {selectedDepartment.name}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {selectedDepartment.detailedDescription || selectedDepartment.description}
                    </p>
                  </div>
                  <div className="text-4xl text-blue-600 ml-6">
                    {selectedDepartment.icon || '🏢'}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <span>👤</span>
                      <span>{t('departments.contact.head', 'Руководитель')}</span>
                    </h4>
                    <p className="text-blue-700 font-medium">{selectedDepartment.head}</p>
                    {selectedDepartment.position && (
                      <p className="text-blue-600 text-sm">{selectedDepartment.position}</p>
                    )}
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <span>📞</span>
                      <span>{t('departments.contact.phone', 'Телефон')}</span>
                    </h4>
                    <a 
                      href={`tel:${selectedDepartment.phone}`}
                      className="text-green-700 font-medium hover:text-green-800 transition-colors"
                    >
                      {selectedDepartment.phone}
                    </a>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                      <span>📍</span>
                      <span>{t('departments.contact.location', 'Местоположение')}</span>
                    </h4>
                    <p className="text-purple-700 font-medium">{selectedDepartment.location}</p>
                  </div>
                </div>

                {/* Department Functions */}
                {selectedDepartment.functions && (
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <span className="text-2xl">🎯</span>
                      <span>{t('departments.functions.title', 'Основные функции')}</span>
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedDepartment.functions.map((func, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-green-600 text-sm">✓</span>
                          </div>
                          <span className="text-gray-700">{func}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Department Functions Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                {t('departments.overview.title', 'Основные направления деятельности')}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {departmentFunctions.map((func, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:border-blue-300 transition-all duration-300 group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {func.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-3">{func.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{func.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralDepartments;