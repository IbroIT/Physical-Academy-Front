import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CorrespondenceTraining = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [expandedStep, setExpandedStep] = useState(null);

  const faculty = t('correspondenceTraining', { returnObjects: true });

  const tabs = [
    { id: 'about', label: t('education.tabs.about', 'О факультете'), icon: '🌐' },
    { id: 'programs', label: t('education.tabs.programs', 'Программы'), icon: '📱' },
    { id: 'technology', label: t('correspondenceTraining.tabs.technology', 'Технологии'), icon: '💻' },
    { id: 'process', label: t('correspondenceTraining.tabs.process', 'Процесс обучения'), icon: '🔄' },
    { id: 'contacts', label: t('education.tabs.contacts', 'Контакты'), icon: '📞' }
  ];

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-6 shadow-lg">
            <span className="text-3xl text-white">🌐</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {faculty.name}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {faculty.fullDescription}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {faculty.features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 group"
            >
              <div className="text-3xl mb-4 text-blue-600 group-hover:scale-110 transition-transform duration-200">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
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
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                        🎯
                      </div>
                      Миссия факультета
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {faculty.about.mission}
                    </p>
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-2">
                          ✨
                        </div>
                        Преимущества
                      </h4>
                      <ul className="space-y-3">
                        {faculty.about.advantages.map((advantage, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-2">
                        📊
                      </div>
                      Статистика
                    </h4>
                    <div className="space-y-4">
                      {faculty?.stats?.map((stat, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <span className="text-gray-700">{stat.label}</span>
                          <span className="text-gray-900 font-bold text-lg">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Programs Tab */}
            {activeTab === 'programs' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {faculty.programs.map((program, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-200 group">
                      <div className="text-2xl mb-4 text-blue-600 group-hover:scale-110 transition-transform duration-200">
                        {program.icon}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-3">{program.name}</h4>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{program.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Длительность:</span>
                          <span className="text-gray-900 font-medium">{program.duration}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Стоимость:</span>
                          <span className="text-green-600 font-medium">{program.cost}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technology Tab */}
            {activeTab === 'technology' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                        🛠️
                      </div>
                      Технологии обучения
                    </h3>
                    <div className="space-y-4">
                      {faculty.technologies.map((tech, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                            {tech.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">{tech.name}</h4>
                            <p className="text-gray-600 text-sm">{tech.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-3">
                        📱
                      </div>
                      Платформы
                    </h3>
                    <div className="grid gap-4">
                      {faculty.platforms.map((platform, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl text-blue-600">{platform.icon}</span>
                            <span className="text-gray-900 font-medium">{platform.name}</span>
                          </div>
                          <a 
                            href={platform.link} 
                            className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
                          >
                            Перейти →
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Process Tab */}
            {activeTab === 'process' && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                    🔄
                  </div>
                  Процесс обучения
                </h3>
                
                <div className="space-y-6">
                  {faculty.learningProcess.map((step, index) => (
                    <div 
                      key={index}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      <button
                        onClick={() => setExpandedStep(expandedStep === index ? null : index)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg">
                            {step.step}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{step.title}</h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center text-gray-600 text-sm">
                                <span className="text-lg mr-1">{step.icon}</span>
                                <span>{step.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <svg 
                          className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
                            expandedStep === index ? 'rotate-180' : ''
                          }`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {expandedStep === index && (
                        <div className="px-6 pb-6 border-t border-gray-200 pt-4">
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
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
                    Контактная информация
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(faculty.contacts).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          {key === 'phone' && '📞'}
                          {key === 'email' && '📧'}
                          {key === 'address' && '🏢'}
                          {key === 'workingHours' && '🕒'}
                          {key === 'support' && '💬'}
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
                    Руководство
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

export default CorrespondenceTraining;