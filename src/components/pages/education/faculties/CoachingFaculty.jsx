import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CoachingFaculty = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');
  const [selectedProgram, setSelectedProgram] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const faculty = t('coachingFaculty', { returnObjects: true });

  const tabs = [
    { id: 'about', label: t('education.tabs.about'), icon: '🏛️' },
    { id: 'programs', label: t('education.tabs.programs'), icon: '📚' },
    { id: 'departments', label: t('education.tabs.departments'), icon: '🏢' },
    { id: 'coaches', label: t('coachingFaculty.tabs.coaches'), icon: '👨‍🏫' },
    { id: 'achievements', label: t('coachingFaculty.tabs.achievements'), icon: '🏆' },
    { id: 'contacts', label: t('education.tabs.contacts'), icon: '📞' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-8 px-4">
      {/* Анимированный фон */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl mb-6 shadow-2xl">
            <span className="text-3xl">🏅</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
            {faculty.name}
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            {faculty.fullDescription}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {faculty.stats.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-blue-200 text-sm">{stat.label}</div>
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
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                      : 'text-blue-200 hover:text-white hover:bg-white/10'
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
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-3xl font-bold text-white">🎯 {faculty.about.missionTitle}</h3>
                    <p className="text-blue-200 text-lg leading-relaxed">{faculty.about.mission}</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30">
                    <h4 className="text-xl font-bold text-white mb-4">✨ Особенности</h4>
                    <ul className="space-y-3">
                      {faculty.about.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-blue-200">
                          <span className="text-yellow-400 mr-3 text-xl">⚡</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">🎯 Основные специализации</h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {faculty.specializations.map((spec, index) => (
                      <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 group">
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">{spec.icon}</div>
                        <h4 className="font-bold text-white mb-1">{spec.name}</h4>
                        <p className="text-blue-200 text-sm">{spec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Programs Tab */}
            {activeTab === 'programs' && (
              <div className="space-y-8">
                <div className="grid lg:grid-cols-4 gap-6 mb-8">
                  {faculty.educationPrograms.map((program, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedProgram(index)}
                      className={`text-left p-6 rounded-2xl transition-all duration-500 ${
                        selectedProgram === index
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-2xl transform scale-105'
                          : 'bg-white/5 text-blue-200 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <div className="text-2xl mb-3">{program.icon}</div>
                      <h4 className="font-bold text-lg mb-2">{program.name}</h4>
                      <p className="text-sm opacity-80">{program.level}</p>
                    </button>
                  ))}
                </div>

                {/* Program Details */}
                {faculty.educationPrograms[selectedProgram] && (
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-8 border border-yellow-400/30">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                          {faculty.educationPrograms[selectedProgram].name}
                        </h3>
                        <p className="text-blue-200 mb-6">
                          {faculty.educationPrograms[selectedProgram].description}
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-center text-white">
                            <span className="text-yellow-400 mr-3">⏱️</span>
                            Длительность: {faculty.educationPrograms[selectedProgram].duration}
                          </div>
                          <div className="flex items-center text-white">
                            <span className="text-yellow-400 mr-3">🎓</span>
                            Форма: {faculty.educationPrograms[selectedProgram].format}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white mb-4">Основные дисциплины</h4>
                        <div className="grid gap-2">
                          {faculty.educationPrograms[selectedProgram].subjects.map((subject, index) => (
                            <div key={index} className="bg-white/5 rounded-lg px-4 py-3 text-blue-200 border border-white/10">
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
                  <div key={index} className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 border border-white/10 hover:border-yellow-400/50 transition-all duration-500 group">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-yellow-300 transition-colors">
                          {department.name}
                        </h3>
                        <p className="text-blue-200 text-sm mt-1">{department.field}</p>
                      </div>
                      <span className="text-3xl opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        {department.icon}
                      </span>
                    </div>
                    <p className="text-blue-200 mb-4 text-sm leading-relaxed">{department.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-blue-200">
                        <span className="text-yellow-400 mr-2">👤</span>
                        {department.head}
                      </div>
                      <div className="flex items-center text-blue-200">
                        <span className="text-yellow-400 mr-2">📧</span>
                        {department.email}
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
                    <div key={index} className="bg-gradient-to-br from-white/5 to-transparent rounded-2xl p-6 text-center border border-white/10 hover:border-yellow-400/50 transition-all duration-500 group hover:scale-105">
                      <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform">
                        {coach.avatar}
                      </div>
                      <h4 className="font-bold text-white text-lg mb-2">{coach.name}</h4>
                      <p className="text-yellow-400 text-sm font-medium mb-2">{coach.position}</p>
                      <p className="text-blue-200 text-xs mb-3">{coach.qualification}</p>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {coach.specializations.map((spec, i) => (
                          <span key={i} className="px-2 py-1 bg-white/10 rounded-full text-blue-200 text-xs">
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
                  <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30">
                    <h3 className="text-2xl font-bold text-white mb-6">🏆 Достижения выпускников</h3>
                    <div className="space-y-4">
                      {faculty.achievements.graduates.map((achievement, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center text-white text-lg">
                            {achievement.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-white">{achievement.title}</h4>
                            <p className="text-blue-200 text-sm">{achievement.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 border border-cyan-400/30">
                    <h3 className="text-2xl font-bold text-white mb-6">⭐ Спортивные успехи</h3>
                    <div className="space-y-4">
                      {faculty.achievements.sports.map((sport, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                          <span className="text-white font-medium">{sport.discipline}</span>
                          <span className="text-yellow-400 font-bold">{sport.medals}</span>
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
                  <h3 className="text-2xl font-bold text-white">📞 Контакты</h3>
                  <div className="space-y-4">
                    {Object.entries(faculty.contacts).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-2xl text-yellow-400">
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
                <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 border border-yellow-400/30">
                  <h3 className="text-2xl font-bold text-white mb-4">👨‍💼 Декан факультета</h3>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                      {faculty.dean.avatar}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{faculty.dean.name}</h4>
                    <p className="text-yellow-400 mb-2">{faculty.dean.position}</p>
                    <p className="text-blue-200 text-sm mb-3">{faculty.dean.degree}</p>
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

export default CoachingFaculty;