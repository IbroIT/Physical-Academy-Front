// GeneralDepartments.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const GeneralDepartments = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('academic');
  const [selectedDepartment, setSelectedDepartment] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'academic', label: t('departments.categories.academic'), icon: '🎓' },
    { id: 'administrative', label: t('departments.categories.administrative'), icon: '🏢' },
    { id: 'research', label: t('departments.categories.research'), icon: '🔬' },
    { id: 'student', label: t('departments.categories.student'), icon: '👥' },
    { id: 'technical', label: t('departments.categories.technical'), icon: '⚙️' }
  ];

  const departmentsData = t('departments.list', { returnObjects: true });
  
  // Фильтрация отделов по категории и поиску
  const filteredDepartments = departmentsData
    .filter(dept => dept.category === activeCategory)
    .filter(dept => 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = [
    { number: '25+', label: t('departments.stats.departments'), icon: '🏢' },
    { number: '150+', label: t('departments.stats.staff'), icon: '👨‍🏫' },
    { number: '15', label: t('departments.stats.faculties'), icon: '🎓' },
    { number: '5', label: t('departments.stats.campuses'), icon: '🏛️' }
  ];

  const departmentFunctions = [
    { icon: '📚', title: t('departments.functions.education.title'), description: t('departments.functions.education.description') },
    { icon: '🔬', title: t('departments.functions.research.title'), description: t('departments.functions.research.description') },
    { icon: '🤝', title: t('departments.functions.community.title'), description: t('departments.functions.community.description') },
    { icon: '💼', title: t('departments.functions.management.title'), description: t('departments.functions.management.description') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-cyan-600 to-green-600 bg-clip-text text-transparent mb-4">
              {t('departments.title')}
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6 leading-relaxed">
            {t('departments.subtitle')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-cyan-600 bg-clip-text text-transparent">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium mt-2 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-200 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder={t('departments.search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {t('departments.search.results', { count: filteredDepartments.length })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 sticky top-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">📂</span>
                {t('departments.categories.title')}
              </h3>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveCategory(category.id);
                      setSelectedDepartment(0);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center space-x-3 group ${
                      activeCategory === category.id
                        ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-lg transform scale-105'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
                    }`}
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </span>
                    <span className="font-medium">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Departments List */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {categories.find(cat => cat.id === activeCategory)?.label}
                </h2>
                <p className="text-gray-600">
                  {t('departments.categoryDescription', { 
                    category: categories.find(cat => cat.id === activeCategory)?.label.toLowerCase()
                  })}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 p-6">
                {filteredDepartments.map((department, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedDepartment(index)}
                    className={`bg-gradient-to-br rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedDepartment === index
                        ? 'from-green-500 to-cyan-500 text-white shadow-2xl scale-105'
                        : 'from-white to-gray-50 text-gray-800 border border-gray-200 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className={`text-xl font-bold mb-2 ${
                          selectedDepartment === index ? 'text-white' : 'text-gray-800'
                        }`}>
                          {department.name}
                        </h3>
                        <p className={`text-sm ${
                          selectedDepartment === index ? 'text-blue-100' : 'text-gray-600'
                        }`}>
                          {department.description}
                        </p>
                      </div>
                      <div className={`text-3xl ${
                        selectedDepartment === index ? 'text-white' : 'text-green-500'
                      }`}>
                        {department.icon}
                      </div>
                    </div>

                    <div className={`flex items-center space-x-3 ${
                      selectedDepartment === index ? 'text-blue-100' : 'text-gray-600'
                    }`}>
                      <span className="text-lg">👤</span>
                      <div>
                        <div className="text-sm font-medium">{department.head}</div>
                        <div className="text-xs">{t('departments.departmentHead')}</div>
                      </div>
                    </div>

                    {selectedDepartment === index && (
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="flex items-center justify-between text-sm">
                          <span>📞 {department.phone}</span>
                          <span>📍 {department.location}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* No Results */}
              {filteredDepartments.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {t('departments.search.noResults.title')}
                  </h3>
                  <p className="text-gray-600">
                    {t('departments.search.noResults.description')}
                  </p>
                </div>
              )}
            </div>

            {/* Selected Department Details */}
            {filteredDepartments[selectedDepartment] && (
              <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {filteredDepartments[selectedDepartment].name}
                    </h3>
                    <p className="text-gray-600">
                      {filteredDepartments[selectedDepartment].detailedDescription}
                    </p>
                  </div>
                  <div className="text-4xl text-green-500">
                    {filteredDepartments[selectedDepartment].icon}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                      <span className="text-lg mr-2">👤</span>
                      {t('departments.contact.head')}
                    </h4>
                    <p className="text-green-700">{filteredDepartments[selectedDepartment].head}</p>
                    <p className="text-green-600 text-sm">{filteredDepartments[selectedDepartment].position}</p>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                      <span className="text-lg mr-2">📞</span>
                      {t('departments.contact.phone')}
                    </h4>
                    <a 
                      href={`tel:${filteredDepartments[selectedDepartment].phone}`}
                      className="text-blue-700 hover:text-blue-800 transition-colors"
                    >
                      {filteredDepartments[selectedDepartment].phone}
                    </a>
                  </div>

                  <div className="bg-cyan-50 rounded-xl p-4 border border-cyan-200">
                    <h4 className="font-semibold text-cyan-800 mb-2 flex items-center">
                      <span className="text-lg mr-2">📍</span>
                      {t('departments.contact.location')}
                    </h4>
                    <p className="text-cyan-700">{filteredDepartments[selectedDepartment].location}</p>
                  </div>
                </div>

                {/* Department Functions */}
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    {t('departments.functions.title')}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredDepartments[selectedDepartment].functions.map((func, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-lg text-green-500 mt-1">✓</span>
                        <span className="text-gray-700">{func}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Department Functions Overview */}
            <div className="mt-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {t('departments.overview.title')}
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {departmentFunctions.map((func, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-lg transition-all duration-300 group">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {func.icon}
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-3">{func.title}</h4>
                    <p className="text-gray-600 text-sm">{func.description}</p>
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