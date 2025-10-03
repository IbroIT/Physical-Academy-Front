import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MilitaryTraining = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [selectedProgram, setSelectedProgram] = useState(0);

  const faculty = t('militaryTraining', { returnObjects: true });

  const tabs = [
    { id: 'about', label: t('education.tabs.about'), icon: '🎖️' },
    { id: 'programs', label: t('education.tabs.programs'), icon: '⚔️' },
    { id: 'specialties', label: t('militaryTraining.tabs.specialties'), icon: '🎯' },
    { id: 'facilities', label: t('militaryTraining.tabs.facilities'), icon: '🏹' },
    { id: 'command', label: t('militaryTraining.tabs.command'), icon: '👨‍✈️' },
    { id: 'contacts', label: t('education.tabs.contacts'), icon: '📞' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-amber-900 py-8 px-4">
      {/* Military-themed background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-32 h-32 border-2 border-amber-400/20 rounded-full"></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 border-2 border-red-400/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-amber-500/10 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-amber-400 to-red-500 rounded-3xl mb-6 shadow-2xl border-2 border-amber-300">
            <span className="text-4xl">🎖️</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 bg-gradient-to-r from-amber-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
            {faculty.name}
          </h1>
          <p className="text-xl text-amber-200 max-w-3xl mx-auto leading-relaxed">
            {faculty.fullDescription}
          </p>
        </div>

        {/* Military Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {faculty.stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-amber-200 text-sm">{stat.label}</div>
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
                      ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-lg'
                      : 'text-amber-200 hover:text-white hover:bg-white/10'
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
                    <h3 className="text-3xl font-bold text-white">🎯 Военная подготовка</h3>
                    <p className="text-amber-200 text-lg leading-relaxed">
                      {faculty.about.description}
                    </p>
                    <div className="bg-gradient-to-br from-amber-500/20 to-red-500/20 rounded-2xl p-6 border border-amber-400/30">
                      <h4 className="text-xl font-bold text-white mb-4">⭐ Особенности подготовки</h4>
                      <ul className="space-y-3">
                        {faculty.about.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-amber-200">
                            <span className="text-amber-400 mr-3 text-xl">⚡</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-red-500/10 to-amber-500/10 rounded-2xl p-6 border border-red-400/30">
                      <h4 className="text-xl font-bold text-white mb-4">🏅 Воинские звания</h4>
                      <div className="space-y-3">
                        {faculty.ranks.map((rank, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-amber-200">{rank.name}</span>
                            <span className="text-white font-bold">{rank.category}</span>
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
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                  {faculty.programs.map((program, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedProgram(index)}
                      className={`text-left p-6 rounded-2xl transition-all duration-500 border ${
                        selectedProgram === index
                          ? 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-2xl transform scale-105 border-transparent'
                          : 'bg-white/5 text-amber-200 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="text-2xl mb-3">{program.icon}</div>
                      <h4 className="font-bold text-lg mb-2">{program.name}</h4>
                      <p className="text-sm opacity-80">{program.duration}</p>
                    </button>
                  ))}
                </div>

                {/* Program Details */}
                {faculty.programs[selectedProgram] && (
                  <div className="bg-gradient-to-br from-amber-500/10 to-red-500/10 rounded-2xl p-8 border border-amber-400/30">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                          {faculty.programs[selectedProgram].name}
                        </h3>
                        <p className="text-amber-200 mb-6">
                          {faculty.programs[selectedProgram].description}
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center text-white">
                            <span className="text-amber-400 mr-3">⏱️</span>
                            Длительность: {faculty.programs[selectedProgram].duration}
                          </div>
                          <div className="flex items-center text-white">
                            <span className="text-amber-400 mr-3">🎓</span>
                            Форма: {faculty.programs[selectedProgram].format}
                          </div>
                          <div className="flex items-center text-white">
                            <span className="text-amber-400 mr-3">⚔️</span>
                            Специализация: {faculty.programs[selectedProgram].specialization}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-4">Дисциплины</h4>
                        <div className="grid gap-2">
                          {faculty.programs[selectedProgram].subjects.map((subject, index) => (
                            <div key={index} className="bg-white/5 rounded-lg px-4 py-3 text-amber-200 border border-white/10">
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
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {faculty.specialties.map((specialty, index) => (
                    <div key={index} className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 border border-white/10 hover:border-amber-400/50 transition-all duration-500 group hover:scale-105">
                      <div className="text-center mb-4">
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                          {specialty.icon}
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">{specialty.name}</h4>
                        <p className="text-amber-200 text-sm">{specialty.category}</p>
                      </div>
                      <p className="text-amber-200 text-sm text-center mb-4 leading-relaxed">
                        {specialty.description}
                      </p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {specialty.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-amber-500/20 rounded-full text-amber-200 text-xs">
                            {skill}
                          </span>
                        ))}
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
                    <h3 className="text-2xl font-bold text-white mb-6">🏹 Учебные объекты</h3>
                    <div className="space-y-4">
                      {faculty.facilities.map((facility, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-amber-400/30 transition-colors">
                          <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-white text-lg">
                            {facility.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-white mb-1">{facility.name}</h4>
                            <p className="text-amber-200 text-sm">{facility.description}</p>
                            <p className="text-amber-400 text-xs mt-1">{facility.equipment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500/10 to-red-500/10 rounded-2xl p-6 border border-amber-400/30">
                    <h3 className="text-2xl font-bold text-white mb-6">🎯 Тренировочные программы</h3>
                    <div className="space-y-4">
                      {faculty.trainingPrograms.map((program, index) => (
                        <div key={index} className="bg-white/5 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">{program.name}</span>
                            <span className="text-amber-400 text-sm">{program.duration}</span>
                          </div>
                          <p className="text-amber-200 text-sm">{program.description}</p>
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
                  {faculty.command.map((officer, index) => (
                    <div key={index} className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 text-center border border-white/10 hover:border-amber-400/50 transition-all duration-500 group hover:scale-105">
                      <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform border-2 border-amber-300">
                        {officer.avatar}
                      </div>
                      <h4 className="font-bold text-white text-lg mb-2">{officer.name}</h4>
                      <p className="text-amber-400 text-sm font-medium mb-2">{officer.rank}</p>
                      <p className="text-white text-sm mb-3">{officer.position}</p>
                      <p className="text-amber-200 text-xs mb-3">{officer.education}</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {officer.specializations.map((spec, i) => (
                          <span key={i} className="px-2 py-1 bg-amber-500/20 rounded-full text-amber-200 text-xs">
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
                      <div key={key} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-amber-400/30 transition-colors">
                        <span className="text-2xl text-amber-400">
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
                <div className="bg-gradient-to-br from-amber-500/10 to-red-500/10 rounded-2xl p-6 border border-amber-400/30">
                  <h3 className="text-2xl font-bold text-white mb-4">👨‍✈️ Начальник факультета</h3>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-amber-400 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 border-2 border-amber-300">
                      {faculty.dean.avatar}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{faculty.dean.name}</h4>
                    <p className="text-amber-400 mb-2">{faculty.dean.rank}</p>
                    <p className="text-white text-sm mb-2">{faculty.dean.position}</p>
                    <p className="text-amber-200 text-sm mb-3">{faculty.dean.education}</p>
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

export default MilitaryTraining;