import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const GeneralDepartmentsNew = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { 
      id: 'about', 
      title: t('generalDepartmentsNew.tabs.about'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      id: 'languages', 
      title: t('generalDepartmentsNew.tabs.languages'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
      )
    },
    { 
      id: 'humanities', 
      title: t('generalDepartmentsNew.tabs.humanities'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      id: 'natural', 
      title: t('generalDepartmentsNew.tabs.natural'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  ];

  const getCardsData = () => {
    switch(activeTab) {
      case 'languages':
        return [
          { id: 1, title: t('generalDepartmentsNew.cards.languages.foreign'), description: t('generalDepartmentsNew.cards.languages.foreignDesc') },
          { id: 2, title: t('generalDepartmentsNew.cards.languages.russian'), description: t('generalDepartmentsNew.cards.languages.russianDesc') },
          { id: 3, title: t('generalDepartmentsNew.cards.languages.communication'), description: t('generalDepartmentsNew.cards.languages.communicationDesc') },
        ];
      case 'humanities':
        return [
          { id: 1, title: t('generalDepartmentsNew.cards.humanities.philosophy'), description: t('generalDepartmentsNew.cards.humanities.philosophyDesc') },
          { id: 2, title: t('generalDepartmentsNew.cards.humanities.history'), description: t('generalDepartmentsNew.cards.humanities.historyDesc') },
          { id: 3, title: t('generalDepartmentsNew.cards.humanities.psychology'), description: t('generalDepartmentsNew.cards.humanities.psychologyDesc') },
          { id: 4, title: t('generalDepartmentsNew.cards.humanities.pedagogy'), description: t('generalDepartmentsNew.cards.humanities.pedagogyDesc') },
        ];
      case 'natural':
        return [
          { id: 1, title: t('generalDepartmentsNew.cards.natural.anatomy'), description: t('generalDepartmentsNew.cards.natural.anatomyDesc') },
          { id: 2, title: t('generalDepartmentsNew.cards.natural.physiology'), description: t('generalDepartmentsNew.cards.natural.physiologyDesc') },
          { id: 3, title: t('generalDepartmentsNew.cards.natural.biochemistry'), description: t('generalDepartmentsNew.cards.natural.biochemistryDesc') },
          { id: 4, title: t('generalDepartmentsNew.cards.natural.biomechanics'), description: t('generalDepartmentsNew.cards.natural.biomechanicsDesc') },
        ];
      case 'about':
        return [
          { id: 1, title: t('generalDepartmentsNew.cards.departments.languages'), description: t('generalDepartmentsNew.cards.departments.languagesDesc') },
          { id: 2, title: t('generalDepartmentsNew.cards.departments.humanities'), description: t('generalDepartmentsNew.cards.departments.humanitiesDesc') },
          { id: 3, title: t('generalDepartmentsNew.cards.departments.naturalSciences'), description: t('generalDepartmentsNew.cards.departments.naturalSciencesDesc') },
          { id: 4, title: t('generalDepartmentsNew.cards.departments.pedagogy'), description: t('generalDepartmentsNew.cards.departments.pedagogyDesc') },
        ];
      default:
        return [];
    }
  };

  const getHistoryTimeline = () => {
    return [
      { year: '1955', event: t('generalDepartmentsNew.history.1955') },
      { year: '1980', event: t('generalDepartmentsNew.history.1980') },
      { year: '2000', event: t('generalDepartmentsNew.history.2000') },
      { year: '2015', event: t('generalDepartmentsNew.history.2015') },
      { year: '2024', event: t('generalDepartmentsNew.history.2024') },
    ];
  };

  const getActiveTabTitle = () => {
    const tab = tabs.find(tab => tab.id === activeTab);
    return tab ? tab.title : tabs[0].title;
  };

  const renderContent = () => {
    if (activeTab === 'about') {
      return (
        <div className="space-y-8">
          <div className="mb-8 text-center">
            <p className="text-lg text-gray-700 max-w-4xl mx-auto">
              {t('generalDepartmentsNew.history.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {getCardsData().map((card) => (
              <div key={card.id} className="bg-white rounded-xl border border-indigo-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                  <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                </div>
                <h3 className="text-xl font-bold text-indigo-900 mb-3">{card.title}</h3>
                <p className="text-gray-700">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      const cards = getCardsData();
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl border border-indigo-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <div className="w-6 h-6 rounded-full bg-blue-500"></div>
              </div>
              <h3 className="text-xl font-bold text-indigo-900 mb-3">{card.title}</h3>
              <p className="text-gray-700">{card.description}</p>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Заголовок и описание */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-6">
            {t('generalDepartmentsNew.title')}
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-gray-700">
              {t('generalDepartmentsNew.description')}
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
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-indigo-900 hover:bg-indigo-50 border border-indigo-200'
              }`}
            >
              {tab.icon}
              <span>{tab.title}</span>
            </button>
          ))}
        </div>

        {/* Контент */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100 p-6 md:p-8">
          <div className="flex items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center mr-4">
              {tabs.find(t => t.id === activeTab)?.icon}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-900">
                {getActiveTabTitle()}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mt-2"></div>
            </div>
          </div>
          
          {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default GeneralDepartmentsNew;
