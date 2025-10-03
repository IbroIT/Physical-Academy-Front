// components/AcademyMission.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AcademyMission = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('mission');

  const tabs = [
    { id: 'mission', label: t('academy.mission.tabs.mission'), icon: '🎯' },
    { id: 'vision', label: t('academy.mission.tabs.vision'), icon: '🔭' },
    { id: 'values', label: t('academy.mission.tabs.values'), icon: '💎' },
    { id: 'strategy', label: t('academy.mission.tabs.strategy'), icon: '📊' }
  ];

  const values = [
    {
      icon: '🎓',
      title: t('academy.mission.values.excellence.title'),
      description: t('academy.mission.values.excellence.description')
    },
    {
      icon: '🌍',
      title: t('academy.mission.values.innovation.title'),
      description: t('academy.mission.values.innovation.description')
    },
    {
      icon: '🤝',
      title: t('academy.mission.values.community.title'),
      description: t('academy.mission.values.community.description')
    },
    {
      icon: '🔬',
      title: t('academy.mission.values.research.title'),
      description: t('academy.mission.values.research.description')
    }
  ];

  const strategicGoals = [
    {
      goal: t('academy.mission.strategy.goals.0.goal'),
      timeline: '2024-2026',
      metrics: [
        t('academy.mission.strategy.goals.0.metrics.0'),
        t('academy.mission.strategy.goals.0.metrics.1')
      ]
    },
    {
      goal: t('academy.mission.strategy.goals.1.goal'),
      timeline: '2024-2028',
      metrics: [
        t('academy.mission.strategy.goals.1.metrics.0'),
        t('academy.mission.strategy.goals.1.metrics.1')
      ]
    },
    {
      goal: t('academy.mission.strategy.goals.2.goal'),
      timeline: '2024-2030',
      metrics: [
        t('academy.mission.strategy.goals.2.metrics.0'),
        t('academy.mission.strategy.goals.2.metrics.1')
      ]
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'mission':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {t('academy.mission.missionTitle')}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {t('academy.mission.missionStatement')}
              </p>
            </div>
          </div>
        );

      case 'vision':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {t('academy.mission.visionTitle')}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                {t('academy.mission.visionStatement')}
              </p>
            </div>
          </div>
        );

      case 'values':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {t('academy.mission.strategy.title')}
              </h3>
              <div className="space-y-6">
                {strategicGoals.map((goal, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <h4 className="font-semibold text-gray-800 text-lg">{goal.goal}</h4>
                        <span className="text-sm text-green-600 font-medium bg-green-100 px-3 py-1 rounded-full">
                          {goal.timeline}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {goal.metrics.map((metric, idx) => (
                          <li key={idx} className="flex items-center text-gray-600">
                            <span className="w-1 h-1 bg-green-500 rounded-full mr-3"></span>
                            {metric}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {t('academy.mission.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('academy.mission.subtitle')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center space-x-3 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:shadow-md'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        {renderContent()}
      </div>

      {/* Call to Action */}
      <div className="mt-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">
          {t('academy.mission.cta.title')}
        </h3>
        <p className="mb-6 opacity-90">
          {t('academy.mission.cta.description')}
        </p>
        <button className="bg-white text-green-600 px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300">
          {t('academy.mission.cta.button')}
        </button>
      </div>
    </div>
  );
};

export default AcademyMission;