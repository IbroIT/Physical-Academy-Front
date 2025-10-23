// components/AcademyAbout.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const AcademyAbout = () => {
  const { t, i18n } = useTranslation();
  const [activeMedia, setActiveMedia] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    photos: [],
    stats: [],
    features: [],
    loading: false,
    error: null
  });

  // Получение текущего языка для API
  const getApiLanguage = useCallback(() => {
    const langMap = {
      'en': 'en',
      'ru': 'ru',
      'kg': 'kg'
    };
    return langMap[i18n.language] || 'ru';
  }, [i18n.language]);

  // Улучшенная функция для загрузки данных с бэкенда
  const fetchBackendData = useCallback(async () => {
    try {
      setBackendData(prev => ({ 
        ...prev, 
        loading: true, 
        error: null 
      }));
      
      const lang = getApiLanguage();
      
      // Попытка загрузки фото с бэкенда
      let photosData = { results: [] };
      try {
        const photosResponse = await fetch(`/api/about/about-photos/?lang=${lang}`);
        if (photosResponse.ok) {
          photosData = await photosResponse.json();
          console.log('Photos loaded from backend:', photosData);
        } else {
          console.warn('Photos endpoint not available, using demo data');
        }
      } catch (photosError) {
        console.warn('Failed to fetch photos, using demo data:', photosError);
      }

      // Попытка загрузки статистики
      let statsData = { results: [] };
      try {
        const statsResponse = await fetch(`/api/about/stats/?lang=${lang}`);
        if (statsResponse.ok) {
          statsData = await statsResponse.json();
        }
      } catch (statsError) {
        console.warn('Failed to fetch stats, using demo data:', statsError);
      }

      // Попытка загрузки особенностей
      let featuresData = { results: [] };
      try {
        const featuresResponse = await fetch(`/api/about/features/?lang=${lang}`);
        if (featuresResponse.ok) {
          featuresData = await featuresResponse.json();
        }
      } catch (featuresError) {
        console.warn('Failed to fetch features, using demo data:', featuresError);
      }

      setBackendData({
        photos: photosData.results || [],
        stats: statsData.results || [],
        features: featuresData.results || [],
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('Error in fetchBackendData:', error);
      setBackendData(prev => ({
        ...prev,
        loading: false,
        error: 'Используются демонстрационные данные'
      }));
    }
  }, [getApiLanguage]);

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchBackendData();
  }, []);

  // Перезагрузка данных при изменении языка
  useEffect(() => {
    fetchBackendData();
  }, [i18n.language]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
          startCounters();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const startCounters = () => {
    // Используем данные с бэкенда или дефолтные значения
    const targetValues = backendData.stats.length > 0 
      ? backendData.stats.map(stat => stat.value)
      : [15, 10000, 50, 98];
    
    const duration = 2500;
    
    targetValues.forEach((target, index) => {
      const startTime = performance.now();
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(easeOutQuart * target);
        
        setCounterValues(prev => {
          const newValues = [...prev];
          newValues[index] = currentValue;
          return newValues;
        });
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };
      requestAnimationFrame(updateCounter);
    });
  };

  // Преобразование данных с бэкенда в формат компонента
  const getStatsData = () => {
    if (backendData.stats.length > 0) {
      return backendData.stats.map((stat, index) => ({
        number: counterValues[index] || 0,
        label: stat.label || t(`academy.about.stats.${['years', 'graduates', 'programs', 'employment'][index]}`),
        icon: stat.icon || ['🏛️', '🎓', '📚', '💼'][index],
        suffix: stat.suffix || (index === 3 ? '%' : '+'),
        color: stat.color || ['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-blue-500 to-green-500', 'from-green-500 to-blue-500'][index]
      }));
    }

    // Дефолтные данные если с бэкенда ничего не пришло
    return [
      { 
        number: counterValues[0], 
        label: t('academy.about.stats.years'), 
        icon: '🏛️',
        suffix: '+',
        color: 'from-blue-500 to-blue-600'
      },
      { 
        number: counterValues[1], 
        label: t('academy.about.stats.graduates'), 
        icon: '🎓',
        suffix: '+',
        color: 'from-green-500 to-green-600'
      },
      { 
        number: counterValues[2], 
        label: t('academy.about.stats.programs'), 
        icon: '📚',
        suffix: '+',
        color: 'from-blue-500 to-green-500'
      },
      { 
        number: counterValues[3], 
        label: t('academy.about.stats.employment'), 
        icon: '💼',
        suffix: '%',
        color: 'from-green-500 to-blue-500'
      }
    ];
  };

  const getMediaData = () => {
    if (backendData.photos.length > 0) {
      return backendData.photos.map(photo => ({
        type: 'image',
        url: photo.photo,
        title: photo.description,
        description: photo.description,
        thumbnail: photo.photo
      }));
    }

    // Дефолтные данные если с бэкенда ничего не пришло
    return [
      {
        type: 'image',
        url: '/images/academy/campus.jpg',
        title: t('academy.about.media.campus'),
        description: t('academy.about.media.campusDesc'),
        thumbnail: '/images/academy/campus-thumb.jpg'
      },
      {
        type: 'video',
        url: 'https://example.com/video.mp4',
        title: t('academy.about.media.virtualTour'),
        description: t('academy.about.media.virtualTourDesc'),
        thumbnail: '/images/academy/tour-thumb.jpg'
      },
      {
        type: 'image',
        url: '/images/academy/labs.jpg',
        title: t('academy.about.media.labs'),
        description: t('academy.about.media.labsDesc'),
        thumbnail: '/images/academy/labs-thumb.jpg'
      },
      {
        type: 'image',
        url: '/images/academy/students.jpg',
        title: t('academy.about.media.students'),
        description: t('academy.about.media.studentsDesc'),
        thumbnail: '/images/academy/students-thumb.jpg'
      }
    ];
  };

  const getFeaturesData = () => {
    if (backendData.features.length > 0) {
      return backendData.features.map(feature => ({
        icon: feature.icon || '⭐',
        title: feature.title,
        description: feature.description,
        color: feature.color || 'from-blue-500 to-blue-600',
        gradient: `bg-gradient-to-r ${feature.color || 'from-blue-500 to-blue-600'}`
      }));
    }

    // Дефолтные данные если с бэкенда ничего не пришло
    return [
      {
        icon: '⚡',
        title: t('academy.about.features.innovation.title'),
        description: t('academy.about.features.innovation.description'),
        color: 'from-blue-500 to-blue-600',
        gradient: 'bg-gradient-to-r from-blue-500 to-blue-600'
      },
      {
        icon: '🌐',
        title: t('academy.about.features.global.title'),
        description: t('academy.about.features.global.description'),
        color: 'from-green-500 to-green-600',
        gradient: 'bg-gradient-to-r from-green-500 to-green-600'
      },
      {
        icon: '👥',
        title: t('academy.about.features.community.title'),
        description: t('academy.about.features.community.description'),
        color: 'from-blue-500 to-green-500',
        gradient: 'bg-gradient-to-r from-blue-500 to-green-500'
      }
    ];
  };

  const stats = getStatsData();
  const mediaItems = getMediaData();
  const features = getFeaturesData();

  // Автопереключение медиа - ПЕРЕМЕЩЕНО ПОСЛЕ ОПРЕДЕЛЕНИЯ mediaItems
  useEffect(() => {
    if (mediaItems.length > 0) {
      const interval = setInterval(() => {
        setActiveMedia((prev) => (prev + 1) % mediaItems.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [mediaItems.length]);

  const nextMedia = () => {
    setActiveMedia((prev) => (prev + 1) % mediaItems.length);
  };

  const prevMedia = () => {
    setActiveMedia((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  // Компонент загрузки
  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="bg-white/10 rounded-2xl h-8 mb-4"></div>
      <div className="bg-white/10 rounded-2xl h-4 mb-2"></div>
      <div className="bg-white/10 rounded-2xl h-4 w-3/4"></div>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white/10 rounded-2xl h-20"></div>
        <div className="bg-white/10 rounded-2xl h-20"></div>
      </div>
    </div>
  );

  // Компонент уведомления (вместо ошибки)
  const DemoDataNotice = ({ onRetry }) => (
    <div className="text-center py-4 mb-4">
      <div className="inline-flex items-center px-4 py-2 bg-yellow-500/20 backdrop-blur-lg rounded-2xl border border-yellow-400/30">
        <span className="text-yellow-400 text-sm">
          ⚠️ {t('academy.about.usingDemoData')}
        </span>
        <button
          onClick={onRetry}
          className="ml-3 px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
        >
          {t('academy.about.retry')}
        </button>
      </div>
    </div>
  );

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 mb-6 group hover:bg-white/20 transition-all duration-300">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-green-300 font-medium text-sm md:text-base">
              {t('academy.about.badge')}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('academy.about.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4 leading-relaxed">
            {t('academy.about.subtitle')}
          </p>
        </div>

        {/* Уведомление о демо-данных */}
        {backendData.error && <DemoDataNotice onRetry={fetchBackendData} />}

        {/* Stats Grid */}
        {backendData.loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="group relative bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 border border-white/20 shadow-2xl transition-all duration-500 hover:scale-105 hover:border-green-400/30 text-center"
                >
                  {/* Иконка */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                  </div>

                  {/* Число с анимацией */}
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono">
                    {stat.number}
                    <span className="text-green-300">{stat.suffix}</span>
                  </div>

                  {/* Описание */}
                  <div className="text-blue-100 font-medium text-sm md:text-base">{stat.label}</div>

                  {/* Анимированная полоска прогресса */}
                  <div className="mt-4">
                    <div className="w-full bg-white/20 rounded-full h-1">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-500 h-1 rounded-full transition-all duration-2000"
                        style={{ 
                          width: isVisible ? `${(stat.number / (backendData.stats[index]?.value || [15, 10000, 50, 98][index])) * 100}%` : '0%'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Декоративные элементы */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
                </div>
              ))}
            </div>

            {/* Основной контент */}
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
              {/* Текстовый контент и фичи */}
              <div className={`space-y-8 transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}>
                {/* Основной текст */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
                  <p className="text-blue-100 leading-relaxed text-lg md:text-xl mb-6 pb-6 border-b border-white/10">
                    {t('academy.about.content.paragraph1')}
                  </p>
                  <p className="text-blue-100 leading-relaxed text-lg md:text-xl">
                    {t('academy.about.content.paragraph2')}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div 
                      key={index}
                      className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-green-400/30 shadow-2xl transition-all duration-500 hover:scale-102"
                    >
                      <div className="flex items-start space-x-4 md:space-x-6">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-xl mb-3 group-hover:text-green-300 transition-colors duration-300">
                            {feature.title}
                          </h3>
                          <p className="text-blue-100 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Медиа галерея */}
              <div className={`transition-all duration-1000 delay-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}>
                {mediaItems.length > 0 ? (
                  <>
                    <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl overflow-hidden border border-white/20 shadow-2xl group">
                      <div className="aspect-video relative">
                        {mediaItems[activeMedia].type === 'image' ? (
                          <img
                            src={mediaItems[activeMedia].url}
                            alt={mediaItems[activeMedia].title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              // Если изображение не загружается, показываем заглушку
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzFlNzJhZCIvPjx0ZXh0IHg9IjQwMCIgeT0iMzAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFjYWRlbXkgSW1hZ2U8L3RleHQ+PC9zdmc+';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500/10 to-green-500/10 flex items-center justify-center">
                            <div className="text-center p-6 md:p-8">
                              <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 md:w-12 md:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{mediaItems[activeMedia].title}</h3>
                              <p className="text-blue-100 text-lg">{mediaItems[activeMedia].description}</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                          <div>
                            <h3 className="text-white text-xl font-bold mb-2">{mediaItems[activeMedia].title}</h3>
                            <p className="text-blue-100 text-sm">{mediaItems[activeMedia].description}</p>
                          </div>
                        </div>
                        
                        {/* Navigation Arrows */}
                        {!isMobile && (
                          <>
                            <button
                              onClick={prevMedia}
                              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={nextMedia}
                              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
                            >
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Media Thumbnails */}
                    <div className="grid grid-cols-4 gap-3 mt-4">
                      {mediaItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveMedia(index)}
                          className={`aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 group ${
                            activeMedia === index
                              ? 'border-green-400 shadow-lg scale-105'
                              : 'border-white/20 hover:border-green-400/50 hover:shadow-md'
                          }`}
                        >
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzFlNzJhZCIvPjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZmZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SW1hZ2U8L3RleHQ+PC9zdmc+';
                            }}
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2 transition-all duration-300 ${
                            activeMedia === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}>
                            <span className="text-white text-xs font-medium truncate">{item.title}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Mobile Navigation Dots */}
                    {isMobile && (
                      <div className="flex justify-center space-x-3 mt-6">
                        {mediaItems.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveMedia(index)}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              activeMedia === index
                                ? 'bg-green-400 scale-125'
                                : 'bg-white/30 hover:bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12 text-blue-200">
                    {t('academy.about.noMedia')}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Плавающие элементы для десктопа */}
      {!isMobile && (
        <>
          <div className="absolute bottom-20 left-5 w-6 h-6 bg-green-400/20 rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping"></div>
        </>
      )}
    </section>
  );
};

export default AcademyAbout;