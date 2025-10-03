import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const PedagogicalSports = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [hoveredCard, setHoveredCard] = useState(null);

  const faculty = t('pedagogicalSports', { returnObjects: true });

  const tabs = [
    { id: 'about', label: t('education.tabs.about'), icon: '🏃‍♂️' },
    { id: 'programs', label: t('education.tabs.programs'), icon: '📚' },
    { id: 'specializations', label: t('pedagogicalSports.tabs.specializations'), icon: '🎯' },
    { id: 'sports', label: t('pedagogicalSports.tabs.sports'), icon: '⚽' },
    { id: 'teachers', label: t('pedagogicalSports.tabs.teachers'), icon: '👨‍🏫' },
    { id: 'contacts', label: t('education.tabs.contacts'), icon: '📞' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-900 to-lime-900 py-8 px-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-lime-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-green-400 rounded-full opacity-30 animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-emerald-400 to-green-500 rounded-3xl mb-6 shadow-2xl animate-float">
            <span className="text-4xl">🏃‍♂️</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 bg-gradient-to-r from-emerald-300 via-green-300 to-lime-300 bg-clip-text text-transparent">
            {faculty.name}
          </h1>
          <p className="text-xl text-emerald-200 max-w-3xl mx-auto leading-relaxed">
            {faculty.fullDescription}
          </p>
        </div>

        {/* Dynamic Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {faculty.stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`text-3xl mb-2 transition-transform duration-500 ${
                hoveredCard === index ? 'scale-125 rotate-12' : ''
              }`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-emerald-200 text-sm">{stat.label}</div>
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
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg'
                      : 'text-emerald-200 hover:text-white hover:bg-white/10'
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
                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold text-white">🎯 Миссия факультета</h3>
                    <p className="text-emerald-200 text-lg leading-relaxed">
                      {faculty.about.mission}
                    </p>
                    <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl p-6 border border-emerald-400/30">
                      <h4 className="text-xl font-bold text-white mb-4">✨ Ключевые преимущества</h4>
                      <ul className="space-y-3">
                        {faculty.about.advantages.map((advantage, index) => (
                          <li key={index} className="flex items-center text-emerald-200">
                            <span className="text-emerald-400 mr-3 text-xl">⭐</span>
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-green-500/10 to-lime-500/10 rounded-2xl p-6 border border-green-400/30">
                      <h4 className="text-xl font-bold text-white mb-4">🏆 Наши достижения</h4>
                      <div className="space-y-4">
                        {faculty.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                            <span className="text-2xl text-emerald-400">{achievement.icon}</span>
                            <div>
                              <div className="text-white font-medium">{achievement.value}</div>
                              <div className="text-emerald-200 text-sm">{achievement.label}</div>
                            </div>
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {faculty.programs.map((program, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 border border-white/10 hover:border-emerald-400/50 transition-all duration-500 group hover:scale-105 cursor-pointer"
                      onMouseEnter={() => setHoveredCard(`program-${index}`)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className={`text-4xl mb-4 transition-transform duration-500 ${
                        hoveredCard === `program-${index}` ? 'scale-110 rotate-6' : ''
                      }`}>
                        {program.icon}
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3">{program.name}</h4>
                      <p className="text-emerald-200 text-sm mb-4 leading-relaxed">{program.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-emerald-200">Уровень:</span>
                          <span className="text-white font-medium">{program.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-200">Длительность:</span>
                          <span className="text-white font-medium">{program.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-200">Форма:</span>
                          <span className="text-white font-medium">{program.format}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specializations Tab */}
            {activeTab === 'specializations' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">🎯 Педагогические специализации</h3>
                    <div className="space-y-4">
                      {faculty.pedagogicalSpecializations.map((spec, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-colors">
                          <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-lg">
                            {spec.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-white mb-1">{spec.name}</h4>
                            <p className="text-emerald-200 text-sm">{spec.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {spec.competencies.map((comp, i) => (
                                <span key={i} className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-200 text-xs">
                                  {comp}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-6">⚽ Спортивные направления</h3>
                    <div className="space-y-4">
                      {faculty.sportsSpecializations.map((sport, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-colors">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{sport.icon}</span>
                            <div>
                              <div className="text-white font-medium">{sport.name}</div>
                              <div className="text-emerald-200 text-sm">{sport.category}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-white font-bold">{sport.coaches}</div>
                            <div className="text-emerald-200 text-xs">тренеров</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sports Tab */}
            {activeTab === 'sports' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {faculty.sports.map((sport, index) => (
                    <div key={index} className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 text-center border border-white/10 hover:border-emerald-400/50 transition-all duration-500 group hover:scale-105">
                      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {sport.icon}
                      </div>
                      <h4 className="font-bold text-white text-lg mb-2">{sport.name}</h4>
                      <p className="text-emerald-200 text-sm mb-3">{sport.category}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-emerald-200">Группы:</span>
                          <span className="text-white">{sport.groups}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-emerald-200">Тренеры:</span>
                          <span className="text-white">{sport.coaches}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sports Infrastructure */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl p-6 border border-emerald-400/30">
                  <h3 className="text-2xl font-bold text-white mb-6">🏟️ Спортивная инфраструктура</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {faculty.infrastructure.map((item, index) => (
                      <div key={index} className="bg-white/5 rounded-xl p-4 text-center">
                        <div className="text-3xl mb-2">{item.icon}</div>
                        <div className="text-white font-medium mb-1">{item.name}</div>
                        <div className="text-emerald-200 text-sm">{item.capacity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Teachers Tab */}
            {activeTab === 'teachers' && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {faculty.teachers.map((teacher, index) => (
                    <div key={index} className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 text-center border border-white/10 hover:border-emerald-400/50 transition-all duration-500 group hover:scale-105">
                      <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform">
                        {teacher.avatar}
                      </div>
                      <h4 className="font-bold text-white text-lg mb-2">{teacher.name}</h4>
                      <p className="text-emerald-400 text-sm font-medium mb-2">{teacher.position}</p>
                      <p className="text-white text-sm mb-3">{teacher.sport}</p>
                      <p className="text-emerald-200 text-xs mb-3">{teacher.qualification}</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {teacher.specializations.map((spec, i) => (
                          <span key={i} className="px-2 py-1 bg-emerald-500/20 rounded-full text-emerald-200 text-xs">
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
                  <h3 className="text-2xl font-bold text-white">📞 Контакты</h3>
                  <div className="space-y-4">
                    {Object.entries(faculty.contacts).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-colors">
                        <span className="text-2xl text-emerald-400">
                          {key === 'phone' && '📞'}
                          {key === 'email' && '📧'}
                          {key === 'address' && '🏢'}
                          {key === 'workingHours' && '🕒'}
                        </span>
                        <div>
                          <div className="text-white font-medium">{value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl p-6 border border-emerald-400/30">
                  <h3 className="text-2xl font-bold text-white mb-4">👨‍💼 Декан факультета</h3>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      {faculty.dean.avatar}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{faculty.dean.name}</h4>
                    <p className="text-emerald-400 mb-2">{faculty.dean.position}</p>
                    <p className="text-emerald-200 text-sm mb-3">{faculty.dean.degree}</p>
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

export default PedagogicalSports;