// components/AcademyHistory.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AcademyHistory = () => {
  const { t } = useTranslation();
  const [activeEra, setActiveEra] = useState(0);

  const timeline = [
    {
      year: '2005',
      title: t('academy.history.era.foundation.title'),
      description: t('academy.history.era.foundation.description'),
      achievements: [
        t('academy.history.era.foundation.achievements.0'),
        t('academy.history.era.foundation.achievements.1'),
        t('academy.history.era.foundation.achievements.2')
      ],
      icon: '🏛️'
    },
    {
      year: '2010',
      title: t('academy.history.era.growth.title'),
      description: t('academy.history.era.growth.description'),
      achievements: [
        t('academy.history.era.growth.achievements.0'),
        t('academy.history.era.growth.achievements.1'),
        t('academy.history.era.growth.achievements.2')
      ],
      icon: '📈'
    },
    {
      year: '2015',
      title: t('academy.history.era.innovation.title'),
      description: t('academy.history.era.innovation.description'),
      achievements: [
        t('academy.history.era.innovation.achievements.0'),
        t('academy.history.era.innovation.achievements.1'),
        t('academy.history.era.innovation.achievements.2')
      ],
      icon: '💡'
    },
    {
      year: '2020',
      title: t('academy.history.era.modern.title'),
      description: t('academy.history.era.modern.description'),
      achievements: [
        t('academy.history.era.modern.achievements.0'),
        t('academy.history.era.modern.achievements.1'),
        t('academy.history.era.modern.achievements.2')
      ],
      icon: '🚀'
    }
  ];

  const milestones = [
    { number: '1,000', label: t('academy.history.milestones.firstGraduates'), year: '2008' },
    { number: '10+', label: t('academy.history.milestones.internationalPrograms'), year: '2012' },
    { number: '5,000', label: t('academy.history.milestones.totalGraduates'), year: '2018' },
    { number: '50+', label: t('academy.history.milestones.partnerCompanies'), year: '2023' }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {t('academy.history.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('academy.history.subtitle')}
        </p>
      </div>

      {/* Timeline Navigation */}
      <div className="flex overflow-x-auto pb-4 mb-8 space-x-4">
        {timeline.map((era, index) => (
          <button
            key={index}
            onClick={() => setActiveEra(index)}
            className={`flex-shrink-0 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
              activeEra === index
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="text-2xl mb-2">{era.icon}</div>
            <div className="font-semibold">{era.year}</div>
            <div className="text-sm opacity-90">{era.title}</div>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Timeline Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-4xl">{timeline[activeEra].icon}</div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800">{timeline[activeEra].year}</h3>
                <h4 className="text-xl font-semibold text-green-600">{timeline[activeEra].title}</h4>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {timeline[activeEra].description}
            </p>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
              <h5 className="font-semibold text-gray-800 mb-4 flex items-center">
                🏆 {t('academy.history.achievements')}
              </h5>
              <ul className="space-y-3">
                {timeline[activeEra].achievements.map((achievement, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {t('academy.history.keyMilestones')}
          </h3>
          {milestones.map((milestone, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                {milestone.number}
              </div>
              <div className="text-gray-800 font-medium mb-2">{milestone.label}</div>
              <div className="text-sm text-gray-500">{milestone.year}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Timeline */}
      <div className="mt-12 relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-green-500 to-blue-500"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {timeline.map((era, index) => (
            <div
              key={index}
              className={`relative ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12 md:col-start-2'}`}
            >
              <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="absolute top-6 -left-4 md:left-auto md:-right-4 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full border-4 border-white"></div>
                <div className="text-sm text-green-600 font-semibold mb-2">{era.year}</div>
                <h4 className="font-bold text-gray-800 mb-2">{era.title}</h4>
                <p className="text-gray-600 text-sm">{era.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademyHistory;