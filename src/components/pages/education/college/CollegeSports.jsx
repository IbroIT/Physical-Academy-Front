import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getImageUrl } from '../../../../utils/imageUtils';

const DepartmentTabs = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departmentDetails, setDepartmentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  
  // Состояния для новых вкладок
  const [tabsData, setTabsData] = useState([]);
  const [cardsData, setCardsData] = useState({});
  const [loadingTabs, setLoadingTabs] = useState(false);
  const [errorTabs, setErrorTabs] = useState(null);
  const [aboutData, setAboutData] = useState([]);
  const [loadingAbout, setLoadingAbout] = useState(false);
  const [errorAbout, setErrorAbout] = useState(null);
  const [missionStrategyData, setMissionStrategyData] = useState([]);
  const [loadingMissionStrategy, setLoadingMissionStrategy] = useState(false);
  const [errorMissionStrategy, setErrorMissionStrategy] = useState(null);
  const [leadershipData, setLeadershipData] = useState([]);
  const [loadingLeadership, setLoadingLeadership] = useState(false);
  const [errorLeadership, setErrorLeadership] = useState(null);
  const [teachersData, setTeachersData] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);
  const [errorTeachers, setErrorTeachers] = useState(null);
  const [specializationsData, setSpecializationsData] = useState([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [errorSpecializations, setErrorSpecializations] = useState(null);
  const [photoGalleryData, setPhotoGalleryData] = useState([]);
  const [loadingPhotoGallery, setLoadingPhotoGallery] = useState(false);
  const [errorPhotoGallery, setErrorPhotoGallery] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  // Состояние для выпадающей кнопки PDF в миссии
  const [showPdfButton, setShowPdfButton] = useState(false);

  // Массив случайных PDF файлов для демонстрации
  const randomPdfFiles = [
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    "https://www.africau.edu/images/default/sample.pdf",
    "https://www.orimi.com/pdf-test.pdf",
    "https://www.clickdimensions.com/links/TestPDFfile.pdf"
  ];
  
  // Статические вкладки
  const staticTabs = [
    { key: 'general_info', title: t('departmentTabs.tabs.general_info'), order: 1 },
    { key: 'mission_strategy', title: t('departmentTabs.tabs.mission_strategy'), order: 2 },
    { key: 'leadership', title: t('departmentTabs.tabs.leadership'), order: 3 },
    { key: 'teachers', title: t('departmentTabs.tabs.teachers'), order: 4 },
    { key: 'specializations', title: t('departmentTabs.tabs.specializations'), order: 5 },
    { key: 'photo_gallery', title: t('departmentTabs.tabs.photo_gallery'), order: 6 }
  ];

  const openPdfModal = () => {
    const randomPdf = randomPdfFiles[Math.floor(Math.random() * randomPdfFiles.length)];
    setPdfUrl(randomPdf);
    setShowPdfModal(true);
  };

  // Получаем список всех кафедр (старый API)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/education/college-categories/?lang=${i18n.language}`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        
        // Обработка различных форматов ответа API
        let categoriesArray = [];
        if (Array.isArray(data)) {
          categoriesArray = data;
        } else if (data && Array.isArray(data.results)) {
          categoriesArray = data.results;
        } else if (data && Array.isArray(data.data)) {
          categoriesArray = data.data;
        }
        
        setCategories(categoriesArray);
        
        // Если есть категории, устанавливаем первую как активную
        if (categoriesArray.length > 0) {
          setActiveTab(categoriesArray[0].id);
        } else {
          // Если категорий нет, используем статические вкладки
          setTabsData(staticTabs);
          if (staticTabs.length > 0) {
            setActiveTab(staticTabs[0].key);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err.message);
        // В случае ошибки используем статические вкладки
        setTabsData(staticTabs);
        if (staticTabs.length > 0) {
          setActiveTab(staticTabs[0].key);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [i18n.language]);

  // Загрузка данных для статических вкладок
  useEffect(() => {
    const fetchStaticTabsData = async () => {
      setLoadingTabs(true);
      setErrorTabs(null);
      try {
        const lang = i18n.language === 'ru' ? 'ru' : i18n.language === 'en' ? 'en' : 'kg';
        
        // Если есть статические вкладки и нет данных, устанавливаем их
        if (tabsData.length === 0 && staticTabs.length > 0) {
          setTabsData(staticTabs);
          if (!activeTab) {
            setActiveTab(staticTabs[0].key);
          }
        }
        
        // Загружаем данные для каждой статической вкладки
        const allTabsData = staticTabs;
        setTabsData(allTabsData);
        
        // Загружаем данные для "Общая информация"
        const aboutResponse = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/faculties/pedagogical/about/?lang=${lang}`);
        if (aboutResponse.ok) {
          const aboutData = await aboutResponse.json();
          setAboutData(aboutData.sort((a, b) => a.order - b.order));
        }
        
        // Загружаем данные для "Миссия и стратегия"
        const missionResponse = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/faculties/pedagogical/mission-strategy/?lang=${lang}`);
        if (missionResponse.ok) {
          const missionData = await missionResponse.json();
          setMissionStrategyData(missionData.sort((a, b) => a.order - b.order));
        }
        
        // Загружаем данные для "Руководство" - используем тот же API что и в FacultyInfoComponent
        const leadershipResponse = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/faculties/pedagogical/management/?lang=${lang}`);
        if (leadershipResponse.ok) {
          const leadershipData = await leadershipResponse.json();
          setLeadershipData(leadershipData.sort((a, b) => a.order - b.order));
        }
        
        // Загружаем данные для "Преподаватели" - используем тот же API что и в FacultyInfoComponent
        const teachersResponse = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/faculties/pedagogical/teachers/?lang=${lang}`);
        if (teachersResponse.ok) {
          const teachersData = await teachersResponse.json();
          setTeachersData(teachersData.sort((a, b) => a.order - b.order));
        }
        
        // Загружаем данные для "Специализации"
        const specializationsResponse = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/faculties/pedagogical/specializations/?lang=${lang}`);
        if (specializationsResponse.ok) {
          const specializationsData = await specializationsResponse.json();
          setSpecializationsData(specializationsData.sort((a, b) => a.order - b.order));
        }
        
        // Загружаем данные для "Фотогалерея"
        const galleryResponse = await fetch(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/faculties/pedagogical/gallery-cards/?lang=${lang}`);
        if (galleryResponse.ok) {
          const galleryData = await galleryResponse.json();
          setPhotoGalleryData(galleryData.results || galleryData);
        }
        
      } catch (err) {
        console.error('Error fetching static tabs data:', err);
        setErrorTabs(err.message);
      } finally {
        setLoadingTabs(false);
      }
    };

    // Если активна статическая вкладка, загружаем данные
    if (activeTab && staticTabs.some(tab => tab.key === activeTab)) {
      fetchStaticTabsData();
    }
  }, [i18n.language, activeTab, t]);

  // Получаем детали конкретной кафедры по ID (старый API)
  useEffect(() => {
    if (!activeTab || typeof activeTab !== 'number') return;

    const fetchDepartmentDetails = async () => {
      setLoadingDetails(true);
      setErrorDetails(null);
      try {
        const url = `https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/education/college-categories/${activeTab}/?lang=${i18n.language}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch department details: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        // Обработка различных форматов ответа API
        let departmentData = data;
        if (data && typeof data === 'object' && !data.description && !data.staff) {
          if (data.data) departmentData = data.data;
          else if (data.result) departmentData = data.result;
          else if (data.department) departmentData = data.department;
          
          if (departmentData.info && !departmentData.description) {
            departmentData.description = departmentData.info.description;
          }
          if (departmentData.management && !departmentData.staff) {
            departmentData.staff = departmentData.management;
          }
        }
        
        setDepartmentDetails(departmentData);
      } catch (err) {
        console.error('Error fetching department details:', err);
        setErrorDetails(err.message);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDepartmentDetails();
  }, [activeTab, i18n.language]);

  const getDefaultIcon = (key) => {
    switch (key) {
      case 'general_info':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'mission_strategy':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'leadership':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'teachers':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
          </svg>
        );
      case 'specializations':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'photo_gallery':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

  const getColorStyles = (color) => {
    const colorMap = {
      blue: {
        border: 'border-blue-500',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        accent: 'bg-blue-500'
      },
      green: {
        border: 'border-green-500',
        bg: 'bg-green-50',
        text: 'text-green-700',
        accent: 'bg-green-500'
      },
      'blue-600': {
        border: 'border-blue-600',
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        accent: 'bg-blue-600'
      },
      'green-600': {
        border: 'border-green-600',
        bg: 'bg-green-100',
        text: 'text-green-800',
        accent: 'bg-green-600'
      },
      'blue-700': {
        border: 'border-blue-700',
        bg: 'bg-blue-50',
        text: 'text-blue-900',
        accent: 'bg-blue-700'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  const getActiveTabStyle = (tabId) => {
    if (!Array.isArray(categories)) return '';
    const category = categories.find(cat => cat.id === tabId);
    if (!category) return '';
    const styles = getColorStyles(category.color);
    return `${styles.border} ${styles.bg} ${styles.text}`;
  };

  const getActiveCategory = () => {
    if (!Array.isArray(categories) || !activeTab || typeof activeTab !== 'number') return null;
    return categories.find(cat => cat.id === activeTab);
  };

  const getActiveTabTitle = () => {
    if (typeof activeTab === 'number') {
      const category = categories.find(cat => cat.id === activeTab);
      return category ? category.name : '';
    } else {
      const tab = staticTabs.find(tab => tab.key === activeTab);
      return tab ? tab.title : '';
    }
  };

  // Функция для рендеринга контента статических вкладок
  const renderStaticTabContent = () => {
    if (loadingTabs) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'general_info':
        if (loadingAbout) {
          return (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          );
        }
        if (errorAbout) {
          return (
            <div className="text-center py-12">
              <p className="text-red-500">{t('departmentTabs.messages.error')}: {errorAbout}</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            {aboutData.length > 0 ? (
              aboutData.map((item) => (
                <div key={item.id} className="prose prose-lg max-w-none">
                  <div 
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 italic">{t('departmentTabs.messages.no_info')}</p>
              </div>
            )}
          </div>
        );

      case 'mission_strategy':
        if (loadingMissionStrategy) {
          return (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          );
        }
        if (errorMissionStrategy) {
          return (
            <div className="text-center py-12">
              <p className="text-red-500">{t('departmentTabs.messages.error')}: {errorMissionStrategy}</p>
            </div>
          );
        }

        return (
          <div className="space-y-8">
            {missionStrategyData.length > 0 ? (
              missionStrategyData.map((item) => {
                const [itemShowPdf, setItemShowPdf] = useState(false);
                
                return (
                  <div key={item.id} className="relative">
                    <div 
                      className="bg-white rounded-xl border border-blue-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-blue-300"
                      onClick={() => setItemShowPdf(!itemShowPdf)}
                    >
                      <div className="prose prose-lg max-w-none">
                        <div 
                          className="text-gray-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: item.text }}
                        />
                      </div>
                      
                      {/* Стрелочка для индикации */}
                      <div className="absolute top-4 right-4">
                        <svg 
                          className={`w-5 h-5 text-blue-500 transform transition-transform duration-300 ${itemShowPdf ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Выпадающая кнопка PDF */}
                    {itemShowPdf && (
                      <div className="mt-2 animate-[slideDown_0.3s_ease-out]">
                        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                          <button
                            onClick={openPdfModal}
                            className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-300 transform hover:scale-[1.02]"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {t('departmentTabs.messages.view_pdf')}
                            <span className="text-blue-200 ml-auto text-sm">
                              {t('departmentTabs.messages.open_new_tab')}
                            </span>
                          </button>
                          <p className="text-sm text-gray-500 mt-2 text-center">
                            {t('departmentTabs.messages.click_to_view')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="bg-white rounded-xl border border-blue-200 p-8 shadow-lg max-w-2xl mx-auto">
                  <div 
                    className="cursor-pointer"
                    onClick={() => setShowPdfButton(!showPdfButton)}
                  >
                    <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center justify-center gap-2">
                      {t('departmentTabs.mission.title')}
                      <svg 
                        className={`w-5 h-5 text-blue-500 transform transition-transform duration-300 ${showPdfButton ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </h3>
                    
                    <div className="prose prose-lg max-w-none text-left mb-6">
                      <div className="text-gray-700 leading-relaxed space-y-4">
                        <p>
                          <strong>{t('departmentTabs.content.mission')}:</strong> {t('departmentTabs.mission.mission_text')}
                        </p>
                        <p>
                          <strong>{t('departmentTabs.mission.strategy_title')}:</strong>
                        </p>
                        <ul className="list-disc pl-5 space-y-2">
                          {t('departmentTabs.mission.goals', { returnObjects: true }).map((goal, index) => (
                            <li key={index}>{goal}</li>
                          ))}
                        </ul>
                        <p>
                          {t('departmentTabs.mission.strategy_text')}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 italic mt-4">
                      {t('departmentTabs.messages.click_to_view')} PDF ↓
                    </p>
                  </div>
                  
                  {/* Выпадающая кнопка PDF для демо данных */}
                  {showPdfButton && (
                    <div className="mt-6 pt-6 border-t border-blue-100 animate-[slideDown_0.3s_ease-out]">
                      <button
                        onClick={openPdfModal}
                        className="w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {t('departmentTabs.messages.view_pdf')}
                        <span className="text-blue-200 ml-auto text-sm">
                          {t('departmentTabs.messages.open_new_tab')}
                        </span>
                      </button>
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        {t('departmentTabs.messages.updated_annually')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'leadership':
        if (loadingLeadership) {
          return (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          );
        }
        if (errorLeadership) {
          return (
            <div className="text-center py-12">
              <p className="text-red-500">{t('departmentTabs.messages.error')}: {errorLeadership}</p>
            </div>
          );
        }

        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-blue-900">{t('departmentTabs.leadership.title')}</h3>
              <p className="text-gray-600 mt-2">{t('departmentTabs.leadership.description')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadershipData.map((person) => (
                <div key={person.id} className="bg-white rounded-xl border border-blue-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 mx-auto border-4 border-blue-100">
                    <img 
                      src={getImageUrl(person.photo)} 
                      alt={person.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2 text-center">{person.name}</h3>
                  <p className="text-gray-600 mb-3 text-center font-medium">{person.role}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{person.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{person.email}</span>
                    </div>
                  </div>
                  {person.resume && (
                    <a
                      href={person.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-300 text-center block"
                    >
                      {t('departmentTabs.messages.view_resume')}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
 case 'teachers':
        if (loadingLeadership) {
          return (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          );
        }
        if (errorLeadership) {
          return (
            <div className="text-center py-12">
              <p className="text-red-500">{t('departmentTabs.messages.error')}: {errorLeadership}</p>
            </div>
          );
        }

        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-blue-900">{t('departmentTabs.leadership.title')}</h3>
              <p className="text-gray-600 mt-2">{t('departmentTabs.leadership.description')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leadershipData.map((person) => (
                <div key={person.id} className="bg-white rounded-xl border border-blue-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 mx-auto border-4 border-blue-100">
                    <img 
                      src={getImageUrl(person.photo)} 
                      alt={person.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2 text-center">{person.name}</h3>
                  <p className="text-gray-600 mb-3 text-center font-medium">{person.role}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{person.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{person.email}</span>
                    </div>
                  </div>
                  {person.resume && (
                    <a
                      href={person.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-300 text-center block"
                    >
                      {t('departmentTabs.messages.view_resume')}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'specializations':
        if (loadingSpecializations) {
          return (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          );
        }
        if (errorSpecializations) {
          return (
            <div className="text-center py-12">
              <p className="text-red-500">{t('departmentTabs.messages.error')}: {errorSpecializations}</p>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {specializationsData.length > 0 ? (
              specializationsData.map((spec) => (
                <div key={spec.id} className="bg-white rounded-lg border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-900">{spec.title}</h3>
                      {spec.description && <p className="text-gray-700 mt-2">{spec.description}</p>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 italic">{t('departmentTabs.messages.no_info')}</p>
              </div>
            )}
          </div>
        );

      case 'photo_gallery':
        if (loadingPhotoGallery) {
          return (
            <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          );
        }
        if (errorPhotoGallery) {
          return (
            <div className="text-center py-12">
              <p className="text-red-500">{t('departmentTabs.messages.error')}: {errorPhotoGallery}</p>
            </div>
          );
        }

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photoGalleryData.length > 0 ? (
              photoGalleryData.map((photo) => (
                <div key={photo.id} className="bg-white rounded-xl border border-blue-200 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform">
                  <div className="aspect-w-16 aspect-h-12">
                    <img 
                      src={photo.photo} 
                      alt={photo.title} 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-blue-900 mb-2">{photo.title}</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">{photo.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 italic">{t('departmentTabs.messages.no_info')}</p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('departmentTabs.messages.select_section')}</p>
          </div>
        );
    }
  };

  // Функция для рендеринга контента старых категорий
  const renderCategoryContent = () => {
    if (loadingDetails) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600">{t('departmentTabs.messages.loading_department')}</p>
        </div>
      );
    }

    if (errorDetails) {
      return (
        <div className="text-center py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-semibold mb-2">{t('departmentTabs.messages.error')}</h3>
            <p className="text-red-600">{errorDetails}</p>
          </div>
        </div>
      );
    }

    if (departmentDetails && (departmentDetails.description || departmentDetails.info?.description || 
        (departmentDetails.staff && departmentDetails.staff.length > 0) || 
        (departmentDetails.management && departmentDetails.management.length > 0))) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {t('departmentTabs.content.about')}
            </h3>
            <div className="prose prose-lg max-w-none">
              {(departmentDetails.description || departmentDetails.info?.description) ? (
                <div 
                  className="text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: departmentDetails.description || departmentDetails.info?.description }}
                />
              ) : (
                <p className="text-gray-500 italic">{t('departmentTabs.messages.no_data')}</p>
              )}
            </div>
          </div>
          
          <div>
            {(departmentDetails.staff && Array.isArray(departmentDetails.staff) && departmentDetails.staff.length > 0) || 
              (departmentDetails.management && Array.isArray(departmentDetails.management) && departmentDetails.management.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(departmentDetails.staff || departmentDetails.management).map((teacher, index) => (
                  <div key={teacher.id || teacher.name || index} className="bg-white rounded-xl border border-blue-200 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 mx-auto border-4 border-blue-100">
                      <img 
                        src={teacher.photo || teacher.image || '/default-avatar.png'} 
                        alt={teacher.name || teacher.full_name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900 mb-2 text-center">
                      {teacher.name || teacher.full_name || teacher.title}
                    </h3>
                    <p className="text-gray-600 mb-3 text-center font-medium">
                      {teacher.role || teacher.position || teacher.job_title}
                    </p>
                    <div className="space-y-2">
                      {(teacher.phone || teacher.phone_number) && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{teacher.phone || teacher.phone_number}</span>
                        </div>
                      )}
                      {(teacher.email || teacher.email_address) && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{teacher.email || teacher.email_address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">{t('departmentTabs.messages.no_data')}</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="text-center py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <h3 className="text-yellow-800 font-semibold mb-2">{t('departmentTabs.messages.no_data')}</h3>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('departmentTabs.messages.loading_departments')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-red-500">{t('departmentTabs.messages.error')}: {error}</p>
        </div>
      </div>
    );
  }

  const activeCategory = getActiveCategory();
  const isStaticTab = activeTab && staticTabs.some(tab => tab.key === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Заголовок и описание */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            {t('collegeSports.title')}
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg md:text-xl text-gray-700">
              {t('collegeSports.description')}
            </p>
          </div>
        </div>

        {/* Табы - показываем либо старые категории, либо статические вкладки */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.length > 0 ? (
            // Показываем старые категории
            categories.map((category) => {
              const styles = getColorStyles(category.color);
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105
                    ${activeTab === category.id 
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg' 
                      : 'bg-white text-blue-900 hover:bg-blue-50 border border-blue-200'
                    }
                  `}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{category.name}</span>
                </button>
              );
            })
          ) : (
            // Показываем статические вкладки
            staticTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105
                  ${activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg'
                    : 'bg-white text-blue-900 hover:bg-blue-50 border border-blue-200'
                  }
                `}
              >
                {getDefaultIcon(tab.key)}
                <span>{tab.title}</span>
              </button>
            ))
          )}
        </div>

        {/* Контент */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100 p-6 md:p-8">
          <div className="flex items-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center mr-4">
              {isStaticTab ? getDefaultIcon(activeTab) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
                {getActiveTabTitle()}
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full mt-2"></div>
            </div>
          </div>
          
          {isStaticTab ? renderStaticTabContent() : renderCategoryContent()}
        </div>

      </div>

      {/* Модальное окно PDF с анимацией снизу */}
      {showPdfModal && (
        <>
          {/* Затемнение фона */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
            onClick={() => setShowPdfModal(false)}
          ></div>
          
          {/* Модальное окно */}
          <div className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ${
            showPdfModal ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <div className="bg-white rounded-t-2xl shadow-2xl max-w-6xl mx-auto h-[85vh]">
              {/* Заголовок модального окна */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-xl font-bold text-blue-900">{t('departmentTabs.pdf_modal.title')}</h3>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* PDF контейнер */}
              <div className="h-[calc(85vh-64px)]">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="PDF document"
                />
              </div>
              
              {/* Кнопка скачивания */}
              <div className="absolute bottom-4 right-4">
                <a
                  href={pdfUrl}
                  download
                  className="inline-flex items-center gap-2 bg-white text-blue-600 border border-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-all duration-200 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {t('departmentTabs.messages.download_pdf')}
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DepartmentTabs;