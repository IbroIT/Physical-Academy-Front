import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const MilitaryTrainingNew = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('history');

  const tabs = [
    { 
      id: 'history', 
      title: t('militaryTrainingNew.tabs.history'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      id: 'about', 
      title: t('militaryTrainingNew.tabs.about'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 'management', 
      title: t('militaryTrainingNew.tabs.management'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      id: 'specializations', 
      title: t('militaryTrainingNew.tabs.specializations'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    { 
      id: 'departments', 
      title: t('militaryTrainingNew.tabs.departments'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
  ];

  const getCardsData = () => {
    switch(activeTab) {
      case 'about':
        return [
          { id: 1, title: t('militaryTrainingNew.cards.about.mission'), description: t('militaryTrainingNew.cards.about.missionDesc') },
          { id: 2, title: t('militaryTrainingNew.cards.about.training'), description: t('militaryTrainingNew.cards.about.trainingDesc') },
          { id: 3, title: t('militaryTrainingNew.cards.about.patriotic'), description: t('militaryTrainingNew.cards.about.patrioticDesc') },
        ];
      case 'management':
        return [
          { id: 1, title: t('militaryTrainingNew.cards.management.dean'), description: t('militaryTrainingNew.cards.management.deanDesc') },
          { id: 2, title: t('militaryTrainingNew.cards.management.deputies'), description: t('militaryTrainingNew.cards.management.deputiesDesc') },
          { id: 3, title: t('militaryTrainingNew.cards.management.staff'), description: t('militaryTrainingNew.cards.management.staffDesc') },
        ];
      case 'specializations':
        return [
          { id: 1, title: t('militaryTrainingNew.cards.specializations.physical'), description: t('militaryTrainingNew.cards.specializations.physicalDesc') },
          { id: 2, title: t('militaryTrainingNew.cards.specializations.tactical'), description: t('militaryTrainingNew.cards.specializations.tacticalDesc') },
          { id: 3, title: t('militaryTrainingNew.cards.specializations.shooting'), description: t('militaryTrainingNew.cards.specializations.shootingDesc') },
          { id: 4, title: t('militaryTrainingNew.cards.specializations.survival'), description: t('militaryTrainingNew.cards.specializations.survivalDesc') },
        ];
      case 'departments':
        return [
          { id: 1, title: t('militaryTrainingNew.cards.departments.physical'), description: t('militaryTrainingNew.cards.departments.physicalDesc') },
          { id: 2, title: t('militaryTrainingNew.cards.departments.tactical'), description: t('militaryTrainingNew.cards.departments.tacticalDesc') },
          { id: 3, title: t('militaryTrainingNew.cards.departments.safety'), description: t('militaryTrainingNew.cards.departments.safetyDesc') },
          { id: 4, title: t('militaryTrainingNew.cards.departments.patriotic'), description: t('militaryTrainingNew.cards.departments.patrioticDesc') },
        ];
      default:
        return [];
    }
  };

  const getHistoryTimeline = () => {
    return [
      { year: '1960', event: t('militaryTrainingNew.history.1960') },
      { year: '1985', event: t('militaryTrainingNew.history.1985') },
      { year: '2000', event: t('militaryTrainingNew.history.2000') },
      { year: '2010', event: t('militaryTrainingNew.history.2010') },
      { year: '2023', event: t('militaryTrainingNew.history.2023') },
    ];
  };

  const getActiveTabTitle = () => {
    const tab = tabs.find(tab => tab.id === activeTab);
    return tab ? tab.title : tabs[0].title;
  };

  const renderContent = () => {
    if (activeTab === 'history') {
      const timeline = getHistoryTimeline();
      return (
        <div className="relative">
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              {t('militaryTrainingNew.history.description')}
            </p>
          </div>
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-600 to-teal-600"></div>
          
          {timeline.map((item, index) => (
            <div key={index} className={`relative mb-12 flex items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                <div className="inline-block">
                  <div className="text-2xl font-bold text-green-900 mb-2">{item.year}</div>
                  <div className="bg-white p-4 rounded-xl border border-green-200 shadow-sm">
                    <p className="text-gray-700">{item.event}</p>
                  </div>
                </div>
              </div>
              <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-teal-500 border-4 border-white z-10"></div>
            </div>
          ))}
        </div>
      );
    } else {
      const cards = getCardsData();
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl border border-green-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <div className="w-6 h-6 rounded-full bg-teal-500"></div>
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-3">{card.title}</h3>
              <p className="text-gray-700">{card.description}</p>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Заголовок и описание */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
            {t('militaryTrainingNew.title')}
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-gray-700">
              {t('militaryTrainingNew.description')}
            </p>
          </div>
        </div>

        {/* Табы */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                  : 'bg-white text-green-900 hover:bg-green-50 border border-green-200'
              }`}
            >
              {tab.icon}
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Контент */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100 p-6 md:p-8">
          <div className="flex items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-600 to-teal-600 flex items-center justify-center mr-4">
              {tabs.find(t => t.id === activeTab)?.icon}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-green-900">
                {getActiveTabTitle()}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-teal-600 rounded-full mt-2"></div>
            </div>
          </div>
          
          {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default MilitaryTrainingNew;