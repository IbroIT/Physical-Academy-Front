// CollegeSports.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

// Импорт иконок (если нет Material UI, используем SVG иконки)
const InfoIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AssignmentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const PeopleIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13 0A5.971 5.971 0 0018 9a5.971 5.971 0 00-2.316-.463M15.34 15.34A5.971 5.971 0 0018 21" />
  </svg>
);

const SchoolIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CategoryIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const PhotoLibraryIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const PersonIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PictureAsPdfIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const CollegeSports = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');
  const [isVisible, setIsVisible] = useState(false);
  const [expandedStrategy, setExpandedStrategy] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    programs: [],
    loading: false,
    error: null
  });

  const [tabsData, setTabsData] = useState([]);
  const [cardsData, setCardsData] = useState({});
  const [loadingTabs, setLoadingTabs] = useState(false);
  const [errorTabs, setErrorTabs] = useState(null);
  const [generalInfoData, setGeneralInfoData] = useState([]);
  const [loadingGeneral, setLoadingGeneral] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);

  const sectionRef = useRef(null);

  // Маппинг табов и их иконок
  const tabIcons = {
    general: <InfoIcon />,
    mission: <AssignmentIcon />,
    management: <PeopleIcon />,
    teachers: <SchoolIcon />,
    specializations: <CategoryIcon />,
    gallery: <PhotoLibraryIcon />
  };

  // Демо-данные из i18n
  const getDemoData = useCallback(() => {
    const generalContent = t('collegeSports.demo.general.content', { returnObjects: true });
    const managementContent = t('collegeSports.demo.management', { returnObjects: true });
    const teachersContent = t('collegeSports.demo.teachers', { returnObjects: true });
    const specializationsContent = t('collegeSports.demo.specializations', { returnObjects: true });
    const galleryContent = t('collegeSports.demo.gallery', { returnObjects: true });
    
    return {
      general: [
        {
          id: 1,
          order: 1,
          content: `<div class="space-y-4">
            <p><strong>${t('collegeSports.demo.general.title')}</strong></p>
            <p>${t('collegeSports.demo.general.description')}</p>
            <p>${t('collegeSports.demo.general.advantages.title')}:</p>
            <ul class="list-disc pl-6 space-y-2">
              ${Array.isArray(generalContent.advantages) ? generalContent.advantages.map(item => 
                `<li><strong>${item.title}:</strong> ${item.description}</li>`
              ).join('') : ''}
            </ul>
            <p>${t('collegeSports.demo.general.statistics')}</p>
          </div>`
        }
      ],
      mission: [
        {
          id: 1,
          title: t('collegeSports.demo.mission.title'),
          text: t('collegeSports.demo.mission.text'),
          details: t('collegeSports.demo.mission.details')
        }
      ],
      management: Array.isArray(managementContent) ? managementContent.map((person, index) => ({
        id: index + 1,
        name: person.name,
        position: person.position,
        description: person.description,
        phone: person.phone || '+996 (312) 66-55-44',
        email: person.email || 'director@sports-college.edu.kg',
        experience: person.experience || '25 лет педагогического стажа'
      })) : [],
      teachers: Array.isArray(teachersContent) ? teachersContent.map((teacher, index) => ({
        id: index + 1,
        name: teacher.name,
        position: teacher.position,
        description: teacher.description,
        qualification: teacher.qualification || 'Высшая категория',
        subjects: teacher.subjects || 'Теория спорта, Методика преподавания'
      })) : [],
      specializations: Array.isArray(specializationsContent) ? specializationsContent.map((spec, index) => ({
        id: index + 1,
        title: spec.title,
        description: spec.description,
        duration: spec.duration || '7-9 лет',
        subjects: spec.subjects || 'Тактика, Техническая подготовка, Психология спорта'
      })) : [],
      gallery: Array.isArray(galleryContent) ? galleryContent.map((item, index) => ({
        id: index + 1,
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1549060279-7e168fce7090?w=800'
      })) : []
    };
  }, [t]);

  // Получение текущего языка для API
  const getApiLanguage = useCallback(() => {
    const langMap = {
      'en': 'en',
      'ru': 'ru',
      'kg': 'kg'
    };
    return langMap[i18n.language] || 'ru';
  }, [i18n.language]);

  // Функция для загрузки данных с бэкенда
  const fetchBackendData = useCallback(async () => {
    try {
      setBackendData(prev => ({ 
        ...prev, 
        loading: true, 
        error: null 
      }));
      
      const lang = getApiLanguage();
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/education/college-programs/?lang=${lang}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format');
      }
      
      const data = await response.json();
      
      setBackendData({
        programs: data.results || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error fetching college programs:', error);
      setBackendData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load programs data'
      }));
    }
  }, [getApiLanguage]);

  // Загрузка данных табов с бэкенда
  const fetchTabsData = useCallback(async () => {
    try {
      setLoadingTabs(true);
      setErrorTabs(null);
      
      const lang = getApiLanguage();
      const API_URL = import.meta.env.VITE_API_URL;
      
      // Загружаем данные табов
      const tabsResponse = await fetch(`${API_URL}/api/college/tabs/?lang=${lang}`);
      if (!tabsResponse.ok) throw new Error('Failed to fetch tabs data');
      
      const tabs = await tabsResponse.json();
      const sortedTabs = tabs.sort((a, b) => a.order - b.order);
      setTabsData(sortedTabs);

      // Загружаем данные для каждого таба
      const tabsToFetch = ['general', 'management', 'teachers', 'specializations', 'gallery'];
      const fetchPromises = tabsToFetch.map(tabKey => 
        fetch(`${API_URL}/api/college/${tabKey}/?lang=${lang}`)
          .then(res => res.ok ? res.json() : [])
          .then(data => ({ key: tabKey, data: data.sort((a, b) => a.order - b.order) }))
          .catch(() => ({ key: tabKey, data: [] }))
      );

      const results = await Promise.all(fetchPromises);
      const newCardsData = {};
      results.forEach(({ key, data }) => {
        newCardsData[key] = data;
      });
      setCardsData(newCardsData);

    } catch (err) {
      console.error('Error fetching tabs data:', err);
      setErrorTabs(err.message);
      
      // Используем демо-табы
      const demoTabs = [
        { key: 'general', title: t('collegeSports.tabs.general'), order: 1 },
        { key: 'mission', title: t('collegeSports.tabs.mission'), order: 2 },
        { key: 'management', title: t('collegeSports.tabs.management'), order: 3 },
        { key: 'teachers', title: t('collegeSports.tabs.teachers'), order: 4 },
        { key: 'specializations', title: t('collegeSports.tabs.specializations'), order: 5 },
        { key: 'gallery', title: t('collegeSports.tabs.gallery'), order: 6 }
      ];
      setTabsData(demoTabs);
      
      // Используем демо-данные из i18n
      setCardsData(getDemoData());
    } finally {
      setLoadingTabs(false);
    }
  }, [getApiLanguage, t, getDemoData]);

  // Загрузка общей информации
  const fetchGeneralInfo = useCallback(async () => {
    try {
      setLoadingGeneral(true);
      setErrorGeneral(null);
      
      const lang = getApiLanguage();
      const API_URL = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${API_URL}/api/college/general/?lang=${lang}`);
      if (!response.ok) throw new Error('Failed to fetch general info');
      
      const data = await response.json();
      setGeneralInfoData(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error('Error fetching general info:', err);
      setErrorGeneral(err.message);
      setGeneralInfoData(getDemoData().general);
    } finally {
      setLoadingGeneral(false);
    }
  }, [getApiLanguage, getDemoData]);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchBackendData();
    fetchTabsData();
    fetchGeneralInfo();
  }, []);

  // Перезагрузка данных при изменении языка
  useEffect(() => {
    fetchBackendData();
    fetchTabsData();
    fetchGeneralInfo();
  }, [i18n.language]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setExpandedStrategy(false);
    setSelectedImage(null);
  };

  const toggleStrategy = () => {
    setExpandedStrategy(!expandedStrategy);
  };

  const openImageModal = (imageData) => {
    setSelectedImage(imageData);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  // Рендер контента в зависимости от активного таба
  const renderTabContent = () => {
    const currentCards = cardsData[activeTab] || [];

    switch (activeTab) {
      case 'general':
        if (loadingGeneral) {
          return (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          );
        }
        
        return (
          <div className="prose prose-lg max-w-none">
            {generalInfoData.length > 0 ? (
              generalInfoData.map((item) => (
                <div 
                  key={item.id} 
                  className="text-blue-100 leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              ))
            ) : (
              <div className="text-blue-100 space-y-4">
                <p>{t('collegeSports.tabs.general.content')}</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>{t('collegeSports.tabs.general.list.1.title')}</strong>: {t('collegeSports.tabs.general.list.1.description')}</li>
                  <li><strong>{t('collegeSports.tabs.general.list.2.title')}</strong>: {t('collegeSports.tabs.general.list.2.description')}</li>
                  <li><strong>{t('collegeSports.tabs.general.list.3.title')}</strong>: {t('collegeSports.tabs.general.list.3.description')}</li>
                </ul>
              </div>
            )}
          </div>
        );

      case 'mission':
        return (
          <div className="space-y-8">
            {/* Миссия колледжа */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-2xl font-bold text-emerald-300 mb-4 flex items-center">
                <AssignmentIcon />
                <span className="ml-2">{t('collegeSports.tabs.mission.title')}</span>
              </h3>
              <div className="bg-emerald-500/10 border-l-4 border-emerald-400 pl-6 py-4 rounded-r-2xl">
                <p className="text-xl text-white font-medium italic">
                  {t('collegeSports.demo.mission.text')}
                </p>
              </div>
            </div>

            {/* Стратегия колледжа */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-blue-300 flex items-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="ml-2">{t('collegeSports.tabs.strategy.title')}</span>
                </h3>
                <button
                  onClick={toggleStrategy}
                  className="flex items-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors"
                >
                  <span>{expandedStrategy ? t('collegeSports.tabs.strategy.hide') : t('collegeSports.tabs.strategy.show')}</span>
                  <svg 
                    className={`w-5 h-5 transition-transform ${expandedStrategy ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              <div className="text-white mb-6 space-y-4">
                <p>{t('collegeSports.tabs.strategy.text')}</p>
                <p>{t('collegeSports.demo.mission.details')}</p>
              </div>

              <AnimatePresence>
                {expandedStrategy && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4">
                      <div className="bg-white/5 rounded-xl p-4">
                        <h4 className="font-bold text-emerald-300 mb-2">
                          {t('collegeSports.tabs.strategy.detailsTitle')}
                        </h4>
                        <p className="text-white">
                          {t('collegeSports.tabs.strategy.details')}
                        </p>
                      </div>

                      {/* PDF файл */}
                      <div className="bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                              <PictureAsPdfIcon />
                            </div>
                            <div>
                              <h4 className="font-bold text-white">
                                {t('collegeSports.tabs.strategy.pdfTitle')}
                              </h4>
                              <p className="text-blue-200 text-sm">
                                PDF • {t('collegeSports.tabs.strategy.pdfSize')}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => alert(t('collegeSports.tabs.strategy.pdfAlert'))}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <DownloadIcon />
                            <span>{t('collegeSports.tabs.strategy.download')}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );

      case 'management':
      case 'teachers':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCards.length > 0 ? (
              currentCards.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-2xl border border-white/10 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 hover:-translate-y-1 transform group"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 mx-auto border-4 border-emerald-500/30 group-hover:border-emerald-400 transition-colors">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                      <PersonIcon />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 text-center group-hover:text-emerald-300 transition-colors">
                    {person.name}
                  </h3>
                  <p className="text-emerald-300 mb-3 text-center font-medium">
                    {person.position}
                  </p>
                  <p className="text-blue-100 text-center mb-4">
                    {person.description}
                  </p>
                  {(person.phone || person.email) && (
                    <div className="space-y-2 mb-4">
                      {person.phone && (
                        <div className="flex items-center gap-2 text-sm text-blue-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{person.phone}</span>
                        </div>
                      )}
                      {person.email && (
                        <div className="flex items-center gap-2 text-sm text-blue-200">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span>{person.email}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <button className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 text-center">
                    {t('collegeSports.viewProfile')}
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-blue-200">
                {t('collegeSports.noContent')}
              </div>
            )}
          </div>
        );

      case 'specializations':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCards.length > 0 ? (
              currentCards.map((spec, index) => (
                <motion.div
                  key={spec.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-2xl border border-white/10 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                    <CategoryIcon />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors">
                    {spec.title}
                  </h3>
                  <p className="text-blue-100 mb-4">{spec.description}</p>
                  {spec.duration && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <span className="text-blue-200 text-sm">{t('collegeSports.duration')}</span>
                      <span className="text-emerald-300 font-semibold">{spec.duration}</span>
                    </div>
                  )}
                  {spec.subjects && (
                    <div className="mt-3">
                      <span className="text-blue-200 text-sm">{t('collegeSports.subjects')}: </span>
                      <span className="text-emerald-300 text-sm">{spec.subjects}</span>
                    </div>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-blue-200">
                {t('collegeSports.noContent')}
              </div>
            )}
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-8">
            {currentCards.length > 0 ? (
              currentCards.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden group hover:border-emerald-400/30 transition-colors duration-300"
                >
                  <div 
                    className="h-64 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 flex items-center justify-center cursor-pointer"
                    onClick={() => openImageModal(item)}
                  >
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-24 h-24 text-white/30">
                        <PhotoLibraryIcon />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-blue-100">{item.description}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 text-blue-200">
                {t('collegeSports.noContent')}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-12 text-blue-200">
            {t('collegeSports.noContent')}
          </div>
        );
    }
  };

  // Компонент загрузки
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white/10 rounded-2xl md:rounded-3xl p-6 border border-white/20">
            <div className="w-16 h-16 bg-white/20 rounded-2xl mb-4 mx-auto"></div>
            <div className="bg-white/20 rounded h-6 mb-3"></div>
            <div className="bg-white/20 rounded h-4 mb-4"></div>
            <div className="bg-white/20 rounded h-8 mb-4"></div>
            <div className="bg-white/20 rounded h-12"></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Компонент ошибки
  const ErrorMessage = ({ onRetry }) => (
    <div className="text-center py-12">
      <div className="text-red-400 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl text-white mb-4">
        {t('collegeSports.errorTitle', { defaultValue: 'Ошибка загрузки' })}
      </h2>
      <p className="text-blue-200 mb-6">
        {backendData.error}
      </p>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
      >
        {t('collegeSports.retry', { defaultValue: 'Попробовать снова' })}
      </button>
    </div>
  );

  // Получение заголовка активного таба
  const getActiveTabTitle = () => {
    const tab = tabsData.find(tab => tab.key === activeTab);
    return tab ? tab.title : tabsData[0]?.title || '';
  };

  return (
    <>
      <section 
        ref={sectionRef}
        className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-12 md:py-20 overflow-hidden"
      >
        {/* Анимированный фон */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Заголовок */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
              {t('collegeSports.title')}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-3 md:mb-4"></div>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4">
              {t('collegeSports.subtitle')}
            </p>
          </motion.div>

          {/* Навигация табов */}
          {loadingTabs ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
          ) : errorTabs ? (
            <div className="text-center py-12">
              <p className="text-red-400">Error loading tabs: {errorTabs}</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3 mb-12"
            >
              {tabsData.map((tab) => (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                      : 'bg-white/10 text-blue-200 hover:text-white hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {tabIcons[tab.key] || <InfoIcon />}
                  <span>{tab.title}</span>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Контент таба */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl"
          >
            <div className="flex items-center mb-8">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center mr-4">
                {tabIcons[activeTab] || <InfoIcon />}
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {getActiveTabTitle()}
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mt-2"></div>
              </div>
            </div>
            
            {renderTabContent()}
          </motion.div>

          {/* Демо-уведомление */}
          {Object.keys(cardsData).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center bg-yellow-500/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-yellow-500/20">
                <span className="text-yellow-300 mr-2">ℹ️</span>
                <p className="text-yellow-200 text-sm">
                  {t('collegeSports.demoNotification')}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Модальное окно для фотогалереи */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={closeImageModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-slate-900 to-emerald-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    {selectedImage.title}
                  </h2>
                  <button
                    onClick={closeImageModal}
                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                  >
                    ×
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="h-96 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-2xl overflow-hidden">
                    {selectedImage.imageUrl ? (
                      <img 
                        src={selectedImage.imageUrl} 
                        alt={selectedImage.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-32 h-32 text-white/20">
                          <PhotoLibraryIcon />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-blue-100 text-lg leading-relaxed">
                  {selectedImage.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CollegeSports;