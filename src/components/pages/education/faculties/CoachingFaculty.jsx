import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CoachingFaculty = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [selectedProgram, setSelectedProgram] = useState(0);
  const [expandedDepartment, setExpandedDepartment] = useState(null);

  const faculty = t('coachingFaculty', { returnObjects: true });

  const tabs = [
    { id: 'about', label: t('education.tabs.about', 'О факультете'), icon: '🏛️' },
    { id: 'programs', label: t('education.tabs.programs', 'Программы'), icon: '📚' },
    { id: 'departments', label: t('education.tabs.departments', 'Кафедры'), icon: '🏢' },
    { id: 'coaches', label: t('coachingFaculty.tabs.coaches', 'Преподаватели'), icon: '👨‍🏫' },
    { id: 'achievements', label: t('coachingFaculty.tabs.achievements', 'Достижения'), icon: '🏆' },
    { id: 'contacts', label: t('education.tabs.contacts', 'Контакты'), icon: '📞' }
  ];

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-3xl text-white">🏅</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {faculty.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {faculty.fullDescription}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {faculty.stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
              <div className="text-2xl mb-2 text-blue-600">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto scrollbar-hide px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 flex-shrink-0 px-6 py-4 font-semibold text-sm transition-all duration-200 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                        🎯
                      </div>
                      {faculty.about.missionTitle}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{faculty.about.mission}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-2">
                        ✨
                      </div>
                      Особенности
                    </h4>
                    <ul className="space-y-3">
                      {faculty.about.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                      🎯
                    </div>
                    Основные специализации
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {faculty.specializations.map((spec, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-all duration-200 group">
                        <div className="text-xl mb-2 text-blue-600 group-hover:scale-110 transition-transform duration-200">
                          {spec.icon}
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">{spec.name}</h4>
                        <p className="text-gray-600 text-sm">{spec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Programs Tab */}
            {activeTab === 'programs' && (
              <div className="space-y-8">
                <div className="grid lg:grid-cols-4 gap-4 mb-8">
                  {faculty.educationPrograms.map((program, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedProgram(index)}
                      className={`text-left p-4 rounded-xl transition-all duration-200 border ${
                        selectedProgram === index
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="text-xl mb-2">{program.icon}</div>
                      <h4 className="font-bold text-sm mb-1">{program.name}</h4>
                      <p className="text-xs opacity-80">{program.level}</p>
                    </button>
                  ))}
                </div>

                {/* Program Details */}
                {faculty.educationPrograms[selectedProgram] && (
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          {faculty.educationPrograms[selectedProgram].name}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {faculty.educationPrograms[selectedProgram].description}
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center text-gray-700">
                            <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                              ⏱️
                            </div>
                            Длительность: {faculty.educationPrograms[selectedProgram].duration}
                          </div>
                          <div className="flex items-center text-gray-700">
                            <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                              🎓
                            </div>
                            Форма: {faculty.educationPrograms[selectedProgram].format}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">Основные дисциплины</h4>
                        <div className="grid gap-2">
                          {faculty.educationPrograms[selectedProgram].subjects.map((subject, index) => (
                            <div key={index} className="bg-white rounded-lg px-3 py-2 text-gray-700 border border-gray-200 text-sm">
                              {subject}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Departments Tab */}
            {activeTab === 'departments' && (
              <div className="grid md:grid-cols-2 gap-6">
                {faculty.departments.map((department, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => setExpandedDepartment(expandedDepartment === index ? null : index)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">
                          {department.name}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{department.field}</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 ml-4">
                        {department.icon}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{department.description}</p>
                    
                    {expandedDepartment === index && (
                      <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                        <div className="flex items-center text-gray-700">
                          <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-3">
                            👤
                          </div>
                          <span className="text-sm">{department.head}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                            📧
                          </div>
                          <span className="text-sm">{department.email}</span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-blue-600 text-sm font-medium">
                        {expandedDepartment === index ? 'Скрыть детали' : 'Подробнее'}
                      </span>
                      <div className={`transform transition-transform duration-200 ${
                        expandedDepartment === index ? 'rotate-180' : ''
                      }`}>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Coaches Tab */}
            {activeTab === 'coaches' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {faculty.coaches.map((coach, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                        {coach.avatar}
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">{coach.name}</h4>
                      <p className="text-green-600 text-sm font-medium mb-2">{coach.position}</p>
                      <p className="text-gray-600 text-xs mb-3">{coach.qualification}</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {coach.specializations.map((spec, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-50 rounded-full text-blue-700 text-xs">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                        🏆
                      </div>
                      Достижения выпускников
                    </h3>
                    <div className="space-y-4">
                      {faculty.achievements.graduates.map((achievement, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                            {achievement.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{achievement.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-3">
                        ⭐
                      </div>
                      Спортивные успехи
                    </h3>
                    <div className="space-y-4">
                      {faculty.achievements.sports.map((sport, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <span className="text-gray-900 font-medium">{sport.discipline}</span>
                          <span className="text-green-600 font-bold">{sport.medals}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                      📞
                    </div>
                    Контакты
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(faculty.contacts).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          {key === 'phone' && '📞'}
                          {key === 'email' && '📧'}
                          {key === 'address' && '🏢'}
                          {key === 'workingHours' && '🕒'}
                        </div>
                        <div>
                          <div className="text-gray-900 font-medium">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                      👨‍💼
                    </div>
                    Декан факультета
                  </h3>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                      {faculty.dean.avatar}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{faculty.dean.name}</h4>
                    <p className="text-green-600 mb-2">{faculty.dean.position}</p>
                    <p className="text-gray-600 text-sm mb-3">{faculty.dean.degree}</p>
                    <p className="text-gray-900">{faculty.dean.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachingFaculty;