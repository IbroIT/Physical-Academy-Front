import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MilitaryTraining = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [selectedProgram, setSelectedProgram] = useState(0);
  const [expandedSpecialty, setExpandedSpecialty] = useState(null);

  const faculty = t('militaryTraining', { returnObjects: true });

  const tabs = [
    { id: 'about', label: t('education.tabs.about', 'О факультете'), icon: '🎖️' },
    { id: 'programs', label: t('education.tabs.programs', 'Программы'), icon: '⚔️' },
    { id: 'specialties', label: t('militaryTraining.tabs.specialties', 'Специальности'), icon: '🎯' },
    { id: 'facilities', label: t('militaryTraining.tabs.facilities', 'Объекты'), icon: '🏹' },
    { id: 'command', label: t('militaryTraining.tabs.command', 'Командование'), icon: '👨‍✈️' },
    { id: 'contacts', label: t('education.tabs.contacts', 'Контакты'), icon: '📞' }
  ];

  const toggleSpecialty = (index) => {
    setExpandedSpecialty(expandedSpecialty === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-3xl text-white">🎖️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {faculty.name || t('militaryTraining.name', 'Военная подготовка')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {faculty.fullDescription || t('militaryTraining.fullDescription', 'Профессиональная военная подготовка для будущих офицеров')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {faculty.stats?.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 text-center border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
              <div className="text-gray-800 text-sm font-medium">{stat.label}</div>
            </div>
          )) || (
            <>
              <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
                <div className="text-2xl mb-2">🎖️</div>
                <div className="text-2xl font-bold text-blue-600 mb-1">500+</div>
                <div className="text-gray-800 text-sm font-medium">Курсантов</div>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
                <div className="text-2xl mb-2">⚔️</div>
                <div className="text-2xl font-bold text-blue-600 mb-1">15+</div>
                <div className="text-gray-800 text-sm font-medium">Программ</div>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
                <div className="text-2xl mb-2">🏅</div>
                <div className="text-2xl font-bold text-blue-600 mb-1">25</div>
                <div className="text-gray-800 text-sm font-medium">Преподавателей</div>
              </div>
              <div className="bg-white rounded-2xl p-4 text-center border border-gray-200">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-blue-600 mb-1">10</div>
                <div className="text-gray-800 text-sm font-medium">Специальностей</div>
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 flex-shrink-0 px-6 py-4 font-medium transition-all duration-300 border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-white'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900">Военная подготовка</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {faculty.about?.description || 'Профессиональная военная подготовка, сочетающая теоретические знания с практическими навыками для подготовки квалифицированных офицеров.'}
                    </p>
                    <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Особенности подготовки</h4>
                      <ul className="space-y-3">
                        {(faculty.about?.features || [
                          'Современные методы обучения',
                          'Практические тренировки',
                          'Профессиональные преподаватели',
                          'Современное оборудование'
                        ]).map((feature, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <span className="text-green-500 mr-3 text-lg">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                      <h4 className="text-xl font-bold text-gray-900 mb-4">Воинские звания</h4>
                      <div className="space-y-3">
                        {(faculty.ranks || [
                          { name: 'Курсант', category: 'Начальная подготовка' },
                          { name: 'Младший лейтенант', category: 'Выпускное звание' },
                          { name: 'Лейтенант', category: 'Первое офицерское' }
                        ]).map((rank, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                            <span className="text-gray-900 font-medium">{rank.name}</span>
                            <span className="text-blue-600 text-sm font-medium">{rank.category}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Programs Tab */}
            {activeTab === 'programs' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {(faculty.programs || []).map((program, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedProgram(index)}
                      className={`text-left p-6 rounded-2xl transition-all duration-300 border ${
                        selectedProgram === index
                          ? 'bg-blue-600 text-white shadow-lg border-blue-600'
                          : 'bg-white text-gray-900 hover:bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-3">{program.icon || '⚔️'}</div>
                      <h4 className="font-bold text-lg mb-2">{program.name}</h4>
                      <p className="text-sm opacity-80">{program.duration}</p>
                    </button>
                  ))}
                </div>

                {/* Program Details */}
                {faculty.programs?.[selectedProgram] && (
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          {faculty.programs[selectedProgram].name}
                        </h3>
                        <p className="text-gray-600 mb-6">
                          {faculty.programs[selectedProgram].description}
                        </p>
                        <div className="space-y-4">
                          <div className="flex items-center text-gray-700">
                            <span className="text-blue-600 mr-3">⏱️</span>
                            Длительность: {faculty.programs[selectedProgram].duration}
                          </div>
                          <div className="flex items-center text-gray-700">
                            <span className="text-blue-600 mr-3">🎓</span>
                            Форма: {faculty.programs[selectedProgram].format}
                          </div>
                          <div className="flex items-center text-gray-700">
                            <span className="text-blue-600 mr-3">⚔️</span>
                            Специализация: {faculty.programs[selectedProgram].specialization}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">Дисциплины</h4>
                        <div className="grid gap-2">
                          {faculty.programs[selectedProgram].subjects.map((subject, index) => (
                            <div key={index} className="bg-white rounded-lg px-4 py-3 text-gray-700 border border-gray-300">
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

            {/* Specialties Tab */}
            {activeTab === 'specialties' && (
              <div className="space-y-6">
                <div className="grid gap-4">
                  {(faculty.specialties || []).map((specialty, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-2xl border border-gray-300 overflow-hidden hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => toggleSpecialty(index)}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                              <span className="text-blue-600 text-xl">{specialty.icon || '🎯'}</span>
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-gray-900">{specialty.name}</h4>
                              <p className="text-blue-600 font-medium">{specialty.category}</p>
                            </div>
                          </div>
                          <button className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <svg 
                              className={`w-4 h-4 transform transition-transform ${
                                expandedSpecialty === index ? 'rotate-180' : ''
                              }`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        
                        {expandedSpecialty === index && (
                          <div className="mt-6 space-y-4">
                            <p className="text-gray-600 leading-relaxed">
                              {specialty.description}
                            </p>
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-3">Ключевые навыки:</h5>
                              <div className="flex flex-wrap gap-2">
                                {specialty.skills.map((skill, i) => (
                                  <span key={i} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities Tab */}
            {activeTab === 'facilities' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Учебные объекты</h3>
                    <div className="space-y-4">
                      {(faculty.facilities || []).map((facility, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-300 hover:border-blue-300 transition-colors">
                          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="text-blue-600 text-lg">{facility.icon || '🏹'}</span>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">{facility.name}</h4>
                            <p className="text-gray-600 text-sm mb-2">{facility.description}</p>
                            <p className="text-blue-600 text-xs font-medium">{facility.equipment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Тренировочные программы</h3>
                    <div className="space-y-4">
                      {(faculty.trainingPrograms || []).map((program, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-300">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-900 font-medium">{program.name}</span>
                            <span className="text-blue-600 text-sm font-medium">{program.duration}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{program.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Command Tab */}
            {activeTab === 'command' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(faculty.command || []).map((officer, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 text-center border border-gray-300 hover:border-blue-300 transition-all duration-300">
                      <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                        {officer.avatar || '👨‍✈️'}
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">{officer.name}</h4>
                      <p className="text-blue-600 text-sm font-medium mb-2">{officer.rank}</p>
                      <p className="text-gray-700 text-sm mb-3">{officer.position}</p>
                      <p className="text-gray-600 text-xs mb-3">{officer.education}</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {officer.specializations.map((spec, i) => (
                          <span key={i} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900">Контакты</h3>
                  <div className="space-y-4">
                    {Object.entries(faculty.contacts || {
                      phone: '+7 (999) 123-45-67',
                      email: 'military@academy.edu',
                      address: 'ул. Военная, 123',
                      workingHours: 'Пн-Пт: 9:00-18:00'
                    }).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-300 hover:border-blue-300 transition-colors">
                        <span className="text-2xl text-blue-600">
                          {key === 'phone' && '📞'}
                          {key === 'email' && '📧'}
                          {key === 'address' && '🏢'}
                          {key === 'workingHours' && '🕒'}
                        </span>
                        <div>
                          <div className="text-gray-900 font-medium">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Начальник факультета</h3>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      {(faculty.dean?.avatar || '👨‍✈️')}
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{faculty.dean?.name || 'Иванов А.С.'}</h4>
                    <p className="text-blue-600 mb-2 font-medium">{faculty.dean?.rank || 'Полковник'}</p>
                    <p className="text-gray-700 text-sm mb-2">{faculty.dean?.position || 'Начальник факультета'}</p>
                    <p className="text-gray-600 text-sm mb-3">{faculty.dean?.education || 'Высшее военное образование'}</p>
                    <p className="text-gray-900">{faculty.dean?.email || 'dean@academy.edu'}</p>
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

export default MilitaryTraining;