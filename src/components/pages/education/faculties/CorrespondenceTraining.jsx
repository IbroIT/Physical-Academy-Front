import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CorrespondenceTraining = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const faculty = t('correspondenceTraining', { returnObjects: true });

  const tabs = [
    { id: 'about', label: t('education.tabs.about'), icon: '🌐' },
    { id: 'programs', label: t('education.tabs.programs'), icon: '📱' },
    { id: 'technology', label: t('correspondenceTraining.tabs.technology'), icon: '💻' },
    { id: 'process', label: t('correspondenceTraining.tabs.process'), icon: '🔄' },
    { id: 'contacts', label: t('education.tabs.contacts'), icon: '📞' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 py-8 px-4">
      {/* Анимированные элементы фона */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-4 h-4 bg-cyan-400 rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-3/4 right-20 w-6 h-6 bg-blue-400 rounded-full opacity-40 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/4 w-8 h-8 bg-indigo-400 rounded-full opacity-30 animate-bounce animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl mb-6 shadow-2xl animate-float">
            <span className="text-4xl">🌐</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
            {faculty.name}
          </h1>
          <p className="text-xl text-cyan-200 max-w-3xl mx-auto leading-relaxed">
            {faculty.fullDescription}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {faculty.features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 group cursor-pointer"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className={`text-4xl mb-4 transition-transform duration-500 ${
                hoveredFeature === index ? 'scale-110 rotate-12' : ''
              }`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-cyan-200 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-white/20">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 flex-shrink-0 px-8 py-6 font-bold text-lg transition-all duration-500 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                      : 'text-cyan-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-6">🎯 Миссия факультета</h3>
                    <p className="text-cyan-200 text-lg leading-relaxed mb-6">
                      {faculty.about.mission}
                    </p>
                    <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-6 border border-cyan-400/30">
                      <h4 className="text-xl font-bold text-white mb-4">✨ Преимущества</h4>
                      <ul className="space-y-3">
                        {faculty.about.advantages.map((advantage, index) => (
                          <li key={index} className="flex items-center text-cyan-200">
                            <span className="text-cyan-400 mr-3 text-xl">✓</span>
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl p-6 border border-blue-400/30">
                    <h4 className="text-xl font-bold text-white mb-4">📊 Статистика</h4>
                    <div className="space-y-4">
                      {faculty?.stats?.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-cyan-200">{stat.label}</span>
                        <span className="text-white font-bold text-lg">{stat.value}</span>
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
                    <div key={index} className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 border border-white/10 hover:border-cyan-400/50 transition-all duration-500 group hover:scale-105">
                      <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {program.icon}
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3">{program.name}</h4>
                      <p className="text-cyan-200 text-sm mb-4 leading-relaxed">{program.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-cyan-200">Длительность:</span>
                          <span className="text-white font-medium">{program.duration}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-cyan-200">Стоимость:</span>
                          <span className="text-white font-medium">{program.cost}</span>
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
                    <h3 className="text-2xl font-bold text-white mb-6">🛠️ Технологии обучения</h3>
                    <div className="space-y-4">
                      {faculty.technologies.map((tech, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-colors">
                          <div className="flex-shrink-0 w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-white text-lg">
                            {tech.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-white mb-1">{tech.name}</h4>
                            <p className="text-cyan-200 text-sm">{tech.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-400/30">
                    <h3 className="text-2xl font-bold text-white mb-6">📱 Платформы</h3>
                    <div className="grid gap-4">
                      {faculty.platforms.map((platform, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{platform.icon}</span>
                            <span className="text-white font-medium">{platform.name}</span>
                          </div>
                          <a href={platform.link} className="text-cyan-400 hover:text-cyan-300 transition-colors">
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
                <h3 className="text-2xl font-bold text-white text-center mb-8">🔄 Процесс обучения</h3>
                <div className="relative">
                  {/* Timeline */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-cyan-500/30"></div>
                  
                  <div className="space-y-12">
                    {faculty.learningProcess.map((step, index) => (
                      <div key={index} className={`flex items-center ${
                        index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                      }`}>
                        <div className="w-1/2 pr-8 pl-8">
                          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-400/30">
                            <div className="flex items-center mb-3">
                              <div className="w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4">
                                {step.step}
                              </div>
                              <h4 className="text-xl font-bold text-white">{step.title}</h4>
                            </div>
                            <p className="text-cyan-200">{step.description}</p>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-cyan-500 rounded-full border-4 border-cyan-900 z-10"></div>
                        <div className="w-1/2 pl-8 pr-8">
                          <div className="text-center">
                            <div className="text-4xl mb-2">{step.icon}</div>
                            <p className="text-cyan-200 text-sm">{step.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white">📞 Контактная информация</h3>
                  <div className="space-y-4">
                    {Object.entries(faculty.contacts).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-400/30 transition-colors">
                        <span className="text-2xl text-cyan-400">
                          {key === 'phone' && '📞'}
                          {key === 'email' && '📧'}
                          {key === 'address' && '🏢'}
                          {key === 'workingHours' && '🕒'}
                          {key === 'support' && '💬'}
                        </span>
                        <div>
                          <div className="text-white font-medium">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-400/30">
                  <h3 className="text-2xl font-bold text-white mb-4">👨‍💼 Руководство</h3>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      {faculty.dean.avatar}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{faculty.dean.name}</h4>
                    <p className="text-cyan-400 mb-2">{faculty.dean.position}</p>
                    <p className="text-cyan-200 text-sm mb-3">{faculty.dean.degree}</p>
                    <p className="text-white">{faculty.dean.email}</p>
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