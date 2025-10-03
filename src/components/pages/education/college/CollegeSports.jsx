// CollegeSports.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CollegeSports = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('about');

  const sections = [
    { id: 'about', label: t('collegeSports.sections.about'), icon: '🏫' },
    { id: 'programs', label: t('collegeSports.sections.programs'), icon: '🎓' },
    { id: 'admissions', label: t('collegeSports.sections.admissions'), icon: '📝' },
    { id: 'campus', label: t('collegeSports.sections.campus'), icon: '🏛️' },
    { id: 'sports', label: t('collegeSports.sections.sports'), icon: '⚽' }
  ];

  const stats = [
    { number: '500+', label: t('collegeSports.stats.students'), icon: '👨‍🎓' },
    { number: '15+', label: t('collegeSports.stats.programs'), icon: '📚' },
    { number: '95%', label: t('collegeSports.stats.employment'), icon: '💼' },
    { number: '10', label: t('collegeSports.stats.sports'), icon: '🏆' }
  ];

  const programs = [
    {
      id: 'physical-education',
      title: t('collegeSports.programs.physicalEducation.title'),
      duration: '2 года 10 месяцев',
      description: t('collegeSports.programs.physicalEducation.description'),
      subjects: [
        t('collegeSports.programs.physicalEducation.subjects.0'),
        t('collegeSports.programs.physicalEducation.subjects.1'),
        t('collegeSports.programs.physicalEducation.subjects.2'),
        t('collegeSports.programs.physicalEducation.subjects.3')
      ],
      careers: [
        t('collegeSports.programs.physicalEducation.careers.0'),
        t('collegeSports.programs.physicalEducation.careers.1'),
        t('collegeSports.programs.physicalEducation.careers.2')
      ]
    },
    {
      id: 'sports-coaching',
      title: t('collegeSports.programs.sportsCoaching.title'),
      duration: '2 года 10 месяцев',
      description: t('collegeSports.programs.sportsCoaching.description'),
      subjects: [
        t('collegeSports.programs.sportsCoaching.subjects.0'),
        t('collegeSports.programs.sportsCoaching.subjects.1'),
        t('collegeSports.programs.sportsCoaching.subjects.2'),
        t('collegeSports.programs.sportsCoaching.subjects.3')
      ],
      careers: [
        t('collegeSports.programs.sportsCoaching.careers.0'),
        t('collegeSports.programs.sportsCoaching.careers.1'),
        t('collegeSports.programs.sportsCoaching.careers.2')
      ]
    },
    {
      id: 'fitness-training',
      title: t('collegeSports.programs.fitnessTraining.title'),
      duration: '2 года 10 месяцев',
      description: t('collegeSports.programs.fitnessTraining.description'),
      subjects: [
        t('collegeSports.programs.fitnessTraining.subjects.0'),
        t('collegeSports.programs.fitnessTraining.subjects.1'),
        t('collegeSports.programs.fitnessTraining.subjects.2'),
        t('collegeSports.programs.fitnessTraining.subjects.3')
      ],
      careers: [
        t('collegeSports.programs.fitnessTraining.careers.0'),
        t('collegeSports.programs.fitnessTraining.careers.1'),
        t('collegeSports.programs.fitnessTraining.careers.2')
      ]
    }
  ];

  const sportsFacilities = [
    {
      name: t('collegeSports.facilities.gym.name'),
      description: t('collegeSports.facilities.gym.description'),
      icon: '🏋️',
      image: '/api/placeholder/400/300'
    },
    {
      name: t('collegeSports.facilities.stadium.name'),
      description: t('collegeSports.facilities.stadium.description'),
      icon: '🏟️',
      image: '/api/placeholder/400/300'
    },
    {
      name: t('collegeSports.facilities.pool.name'),
      description: t('collegeSports.facilities.pool.description'),
      icon: '🏊',
      image: '/api/placeholder/400/300'
    },
    {
      name: t('collegeSports.facilities.courts.name'),
      description: t('collegeSports.facilities.courts.description'),
      icon: '🎾',
      image: '/api/placeholder/400/300'
    }
  ];

  const admissionSteps = [
    {
      step: 1,
      title: t('collegeSports.admission.steps.0.title'),
      description: t('collegeSports.admission.steps.0.description'),
      icon: '📋'
    },
    {
      step: 2,
      title: t('collegeSports.admission.steps.1.title'),
      description: t('collegeSports.admission.steps.1.description'),
      icon: '📚'
    },
    {
      step: 3,
      title: t('collegeSports.admission.steps.2.title'),
      description: t('collegeSports.admission.steps.2.description'),
      icon: '🎯'
    },
    {
      step: 4,
      title: t('collegeSports.admission.steps.3.title'),
      description: t('collegeSports.admission.steps.3.description'),
      icon: '✅'
    }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  {t('collegeSports.about.title')}
                </h3>
                <div className="prose prose-lg text-gray-600 space-y-4">
                  <p>{t('collegeSports.about.description1')}</p>
                  <p>{t('collegeSports.about.description2')}</p>
                  <p>{t('collegeSports.about.description3')}</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-cyan-500 rounded-3xl p-8 text-white text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h4 className="text-2xl font-bold mb-4">{t('collegeSports.about.missionTitle')}</h4>
                <p className="text-lg opacity-90">{t('collegeSports.about.mission')}</p>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              {[
                {
                  icon: '👨‍🏫',
                  title: t('collegeSports.about.features.teachers.title'),
                  description: t('collegeSports.about.features.teachers.description')
                },
                {
                  icon: '🔬',
                  title: t('collegeSports.about.features.equipment.title'),
                  description: t('collegeSports.about.features.equipment.description')
                },
                {
                  icon: '🤝',
                  title: t('collegeSports.about.features.partnerships.title'),
                  description: t('collegeSports.about.features.partnerships.description')
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-lg transition-all duration-300">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h4 className="font-semibold text-gray-800 mb-3">{feature.title}</h4>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'programs':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">
              {t('collegeSports.programs.title')}
            </h3>
            
            <div className="grid lg:grid-cols-3 gap-6">
              {programs.map((program, index) => (
                <div key={program.id} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 group">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {program.id === 'physical-education' ? '🏃‍♂️' : 
                     program.id === 'sports-coaching' ? '👨‍🏫' : '💪'}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">{program.title}</h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">{program.description}</p>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-2">⏱️</span>
                    {program.duration}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <span className="mr-2">📚</span>
                        {t('collegeSports.programs.keySubjects')}
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {program.subjects.map((subject, idx) => (
                          <span key={idx} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <span className="mr-2">💼</span>
                        {t('collegeSports.programs.careerPaths')}
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {program.careers.map((career, idx) => (
                          <span key={idx} className="bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs">
                            {career}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-6 bg-gradient-to-r from-green-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                    {t('collegeSports.programs.learnMore')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'admissions':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">
              {t('collegeSports.admission.title')}
            </h3>

            {/* Admission Timeline */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-400 to-cyan-500 -z-10"></div>
              <div className="space-y-8">
                {admissionSteps.map((step, index) => (
                  <div key={step.step} className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {step.icon}
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xl font-semibold text-gray-800">{step.title}</h4>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          {t('collegeSports.admission.step')} {step.step}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-4 flex items-center">
                  <span className="text-xl mr-3">📋</span>
                  {t('collegeSports.admission.requirements.title')}
                </h4>
                <ul className="space-y-3">
                  {t('collegeSports.admission.requirements.list', { returnObjects: true }).map((req, idx) => (
                    <li key={idx} className="flex items-start text-green-700">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
                <h4 className="font-semibold text-cyan-800 mb-4 flex items-center">
                  <span className="text-xl mr-3">📅</span>
                  {t('collegeSports.admission.deadlines.title')}
                </h4>
                <div className="space-y-4">
                  {t('collegeSports.admission.deadlines.list', { returnObjects: true }).map((deadline, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-white rounded-xl border border-cyan-200">
                      <span className="text-cyan-700 font-medium">{deadline.period}</span>
                      <span className="bg-cyan-500 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                        {deadline.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'campus':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">
              {t('collegeSports.campus.title')}
            </h3>

            {/* Sports Facilities */}
            <div className="grid md:grid-cols-2 gap-6">
              {sportsFacilities.map((facility, index) => (
                <div key={index} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group">
                  <div className="aspect-video bg-gradient-to-br from-green-400 to-cyan-500 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl">
                      {facility.icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">{facility.name}</h4>
                    <p className="text-gray-600 mb-4 leading-relaxed">{facility.description}</p>
                    <button className="text-green-600 font-semibold hover:text-green-700 transition-colors flex items-center group-hover:translate-x-1 transition-transform duration-300">
                      {t('collegeSports.campus.viewDetails')}
                      <span className="ml-2">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Campus Life */}
            <div className="mt-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-3xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-6 text-center">
                {t('collegeSports.campus.life.title')}
              </h4>
              <div className="grid md:grid-cols-3 gap-6">
                {t('collegeSports.campus.life.features', { returnObjects: true }).map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl mb-3">{feature.icon}</div>
                    <h5 className="font-semibold mb-2">{feature.title}</h5>
                    <p className="text-sm opacity-90">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'sports':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-8">
              {t('collegeSports.sports.title')}
            </h3>

            {/* Sports Teams */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {t('collegeSports.sports.teams', { returnObjects: true }).map((team, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-lg transition-all duration-300 group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {team.icon}
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">{team.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{team.coach}</p>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium inline-block">
                    {team.status}
                  </div>
                </div>
              ))}
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-r from-green-50 to-cyan-50 rounded-2xl p-8 border border-green-200">
              <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                {t('collegeSports.sports.achievements.title')}
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {t('collegeSports.sports.achievements.list', { returnObjects: true }).map((achievement, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl text-green-600 mb-3">{achievement.icon}</div>
                    <div className="text-2xl font-bold text-gray-800 mb-1">{achievement.number}</div>
                    <div className="text-gray-600 text-sm">{achievement.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Training Schedule */}
            <div className="mt-12">
              <h4 className="text-2xl font-bold text-gray-800 mb-6">
                {t('collegeSports.sports.schedule.title')}
              </h4>
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 font-semibold text-gray-800">
                          {t('collegeSports.sports.schedule.team')}
                        </th>
                        <th className="text-left py-3 font-semibold text-gray-800">
                          {t('collegeSports.sports.schedule.days')}
                        </th>
                        <th className="text-left py-3 font-semibold text-gray-800">
                          {t('collegeSports.sports.schedule.time')}
                        </th>
                        <th className="text-left py-3 font-semibold text-gray-800">
                          {t('collegeSports.sports.schedule.location')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {t('collegeSports.sports.schedule.list', { returnObjects: true }).map((schedule, index) => (
                        <tr key={index} className="border-b border-gray-100 last:border-b-0">
                          <td className="py-3 text-gray-700">{schedule.team}</td>
                          <td className="py-3 text-gray-700">{schedule.days}</td>
                          <td className="py-3 text-gray-700">{schedule.time}</td>
                          <td className="py-3 text-gray-700">{schedule.location}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-cyan-600 to-green-600 bg-clip-text text-transparent mb-4">
              {t('collegeSports.title')}
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6 leading-relaxed">
            {t('collegeSports.subtitle')}
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

        {/* Navigation */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`p-4 rounded-2xl transition-all duration-500 transform hover:scale-105 group ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-2xl scale-105'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300 hover:shadow-lg'
                }`}
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {section.icon}
                </div>
                <div className="font-semibold text-sm">{section.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-green-500 to-cyan-500 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              {t('collegeSports.cta.title')}
            </h3>
            <p className="text-lg mb-6 opacity-90">
              {t('collegeSports.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300">
                {t('collegeSports.cta.applyNow')}
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-2xl font-semibold hover:bg-white hover:text-green-600 transition-all duration-300">
                {t('collegeSports.cta.contactUs')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeSports;