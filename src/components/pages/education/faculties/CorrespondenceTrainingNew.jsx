import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../../../utils/imageUtils';

const CorrespondenceTrainingNew = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('history');
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabsData, setTabsData] = useState([]);
  const [loadingTabs, setLoadingTabs] = useState(false);
  const [errorTabs, setErrorTabs] = useState(null);
  const [cardsData, setCardsData] = useState({});
  const [aboutData, setAboutData] = useState([]);
  const [loadingAbout, setLoadingAbout] = useState(false);
  const [errorAbout, setErrorAbout] = useState(null);

  useEffect(() => {
    const fetchTabsAndCards = async () => {
      setLoadingTabs(true);
      setErrorTabs(null);
      try {
        const lang = i18n.language === 'ru' ? 'ru' : i18n.language === 'en' ? 'en' : 'kg';
        const tabsResponse = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/faculties/correspondence/tabs/?lang=${lang}`);
        if (!tabsResponse.ok) {
          throw new Error('Failed to fetch tabs data');
        }
        const tabs = await tabsResponse.json();
        setTabsData(tabs.sort((a, b) => a.order - b.order));

        // Fetch cards for each tab except history and about_faculty
        const cardsPromises = tabs
          .filter(tab => tab.key !== 'history' && tab.key !== 'about_faculty')
          .map(tab => fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/faculties/correspondence/cards/?tab=${tab.key}&lang=${lang}`)
            .then(res => res.ok ? res.json() : [])
            .then(data => ({ key: tab.key, data: data.sort((a, b) => a.order - b.order) })));

        const cardsResults = await Promise.all(cardsPromises);
        const newCardsData = {};
        cardsResults.forEach(({ key, data }) => {
          newCardsData[key] = data;
        });
        setCardsData(newCardsData);
      } catch (err) {
        setErrorTabs(err.message);
      } finally {
        setLoadingTabs(false);
      }
    };

    fetchTabsAndCards();
  }, [i18n.language]);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const lang = i18n.language === 'ru' ? 'ru' : i18n.language === 'en' ? 'en' : 'kg';
        const response = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/faculties/correspondence/history/?lang=${lang}`);
        if (!response.ok) {
          throw new Error('Failed to fetch history data');
        }
        const data = await response.json();
        setHistoryData(data.sort((a, b) => a.order - b.order));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [i18n.language]);

  useEffect(() => {
    const fetchAbout = async () => {
      setLoadingAbout(true);
      setErrorAbout(null);
      try {
        const lang = i18n.language === 'ru' ? 'ru' : i18n.language === 'en' ? 'en' : 'kg';
        const response = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/faculties/correspondence/about/?lang=${lang}`);
        if (!response.ok) {
          throw new Error('Failed to fetch about data');
        }
        const data = await response.json();
        setAboutData(data.sort((a, b) => a.order - b.order));
      } catch (err) {
        setErrorAbout(err.message);
      } finally {
        setLoadingAbout(false);
      }
    };

    fetchAbout();
  }, [i18n.language]);

  const getDefaultIcon = (key) => {
    switch (key) {
      case 'history':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'about':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'management':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'specializations':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'departments':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const tabs = tabsData.map(tab => ({
    ...tab,
    icon: tab.icon ? <img src={getImageUrl(tab.icon)} alt={tab.title} className="w-6 h-6" /> : getDefaultIcon(tab.key)
  }));

  const getCardsData = () => {
    return cardsData[activeTab] || [];
  };

  const getHistoryTimeline = () => {
    return historyData;
  };

  const getActiveTabTitle = () => {
    const tab = tabs.find(tab => tab.key === activeTab);
    return tab ? tab.title : tabs[0]?.title || '';
  };

  const renderContent = () => {
    if (activeTab === 'history') {
      if (loading) {
        return (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        );
      }
      if (error) {
        return (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading history: {error}</p>
          </div>
        );
      }
      const timeline = getHistoryTimeline();
      return (
        <div className="space-y-8">
          {timeline.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-6">
              <div className="w-full">
                <img 
                  src={getImageUrl(item.image)} 
                  alt={`История факультета ${index + 1}`} 
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                />
              </div>
              <div className="w-full">
                <p className="text-gray-700 text-lg leading-relaxed text-center">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      if (loadingTabs) {
        return (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        );
      }
      
      if (activeTab === 'about_faculty') {
        if (loadingAbout) {
          return (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          );
        }
        if (errorAbout) {
          return (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading about: {errorAbout}</p>
            </div>
          );
        }
        return (
          <div className="space-y-4">
            {aboutData.map((item) => (
              <p key={item.id} className="text-gray-700 text-lg leading-relaxed">{item.text}</p>
            ))}
          </div>
        );
      }
      
      const cards = getCardsData();
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl border border-purple-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <div className="w-6 h-6 rounded-full bg-pink-500"></div>
              </div>
              <h3 className="text-xl font-bold text-purple-900 mb-3">{card.title}</h3>
              <p className="text-gray-700">{card.description}</p>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Заголовок и описание */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-6">
            {t('correspondenceTrainingNew.title')}
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-gray-700">
              {t('correspondenceTrainingNew.description')}
            </p>
          </div>
        </div>

        {/* Табы */}
        {loadingTabs ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : errorTabs ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading tabs: {errorTabs}</p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white text-purple-900 hover:bg-purple-50 border border-purple-200'
                }`}
              >
                {tab.icon}
                <span>{tab.title}</span>
              </button>
            ))}
          </div>
        )}

        {/* Контент */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100 p-6 md:p-8">
          <div className="flex items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center mr-4">
              {tabs.find(t => t.key === activeTab)?.icon}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-purple-900">
                {getActiveTabTitle()}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2"></div>
            </div>
          </div>
          
          {renderContent()}
        </div>

      </div>
    </div>
  );
};

export default CorrespondenceTrainingNew;
