import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// Компонент для детального просмотра мероприятия
const EventDetailsModal = ({ event, isOpen, onClose }) => {
  const { t, i18n } = useTranslation();

  if (!isOpen || !event) return null;

  // Функция для поделиться
  const handleShare = async () => {
    const shareData = {
      title: event.title,
      text: event.description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Ошибка при использовании Web Share API:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert(t('events.actions.shareSuccess'));
      }).catch(() => {
        prompt(t('events.actions.copyLink'), window.location.href);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <div 
            className="h-64 bg-cover bg-center rounded-t-2xl"
            style={{ backgroundImage: `url(${event.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-t-2xl" />
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 text-white group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Event Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                {event.category_display || event.category}
              </span>
            </div>

            {/* Event Title */}
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                {event.title}
              </h1>
              <div className="flex items-center text-white/90">
                <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg">
                  {event.department_display || event.department}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-8">
          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t('events.details.aboutEvent')}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {event.full_description || event.description}
            </p>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {t('events.details.basicInfo')}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="font-medium">{t('events.labels.date')}</div>
                    <div>{event.date}</div>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-medium">{t('events.labels.time')}</div>
                    <div>{event.time}</div>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <div>
                    <div className="font-medium">{t('events.labels.location')}</div>
                    <div>{event.location}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {t('events.details.additionalInfo')}
              </h3>
              
              <div className="space-y-3">
                {event.audience && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <div className="font-medium">{t('events.labels.audience')}</div>
                      <div>{event.audience}</div>
                    </div>
                  </div>
                )}

                {event.format && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <div className="font-medium">{t('events.labels.format')}</div>
                      <div>{event.format}</div>
                    </div>
                  </div>
                )}

                {event.duration && (
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="font-medium">{t('events.labels.duration')}</div>
                      <div>{event.duration}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Organizer Information */}
          {event.organizer && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {t('events.details.organizer')}
              </h3>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                  {event.organizer.name?.charAt(0) || 'O'}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">
                    {event.organizer.name}
                  </div>
                  {event.organizer.contact && (
                    <div className="text-sm text-gray-600">
                      {event.organizer.contact}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button 
              onClick={handleShare}
              className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {t('events.actions.share')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const UniversityEventsPage = () => {
  const { t, i18n } = useTranslation();
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventsData, setEventsData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка мероприятий с бэкенда
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/events/`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        
        // Обработка разных форматов ответа
        let eventsArray = [];
        if (Array.isArray(data)) {
          // Если API возвращает просто массив
          eventsArray = data;
        } else if (data.results && Array.isArray(data.results)) {
          // Если API возвращает объект с пагинацией (results)
          eventsArray = data.results;
        } else if (data.data && Array.isArray(data.data)) {
          // Если API возвращает объект с data
          eventsArray = data.data;
        } else {
          // Если формат неизвестен, используем сам объект как массив
          console.warn('Unknown API response format:', data);
          eventsArray = Object.values(data).filter(item => typeof item === 'object');
        }
        
        setEventsData(eventsArray);
        
        // Загрузка категорий
        const categoriesResponse = await fetch('/api/events/events/categories/');
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
        
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
        // Fallback на локальные данные
        const localEvents = t('events.items', { returnObjects: true }) || [];
        setEventsData(Array.isArray(localEvents) ? localEvents : []);
        const localCategories = t('events.categories.list', { returnObjects: true }) || [];
        setCategories(Array.isArray(localCategories) ? localCategories : []);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [i18n.language, t]);

  // Убедимся, что filteredEvents всегда массив
  const filteredEvents = (selectedCategory === 'all' 
    ? eventsData 
    : eventsData.filter(event => event && event.category === selectedCategory)
  ).filter(event => event != null); // Фильтруем null/undefined

  const navigateEvents = useCallback((direction) => {
    if (!Array.isArray(filteredEvents) || filteredEvents.length === 0) return;
    
    setIsVisible(false);
    setTimeout(() => {
      setCurrentEventIndex(prev => {
        if (direction === 'next') {
          return (prev + 1) % filteredEvents.length;
        } else {
          return prev === 0 ? filteredEvents.length - 1 : prev - 1;
        }
      });
      setIsVisible(true);
    }, 300);
  }, [filteredEvents.length]);

  // Автоматическая смена мероприятий
  useEffect(() => {
    if (!isAutoPlaying || !Array.isArray(filteredEvents) || filteredEvents.length <= 1) return;

    const interval = setInterval(() => {
      navigateEvents('next');
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, navigateEvents, filteredEvents.length]);

  const currentEvent = Array.isArray(filteredEvents) && filteredEvents.length > 0 
    ? filteredEvents[currentEventIndex] 
    : null;

  // Функция для открытия деталей мероприятия
  const handleEventDetails = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // Функция для закрытия модального окна
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Ошибка загрузки мероприятий</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              {t('events.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('events.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentEventIndex(0);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {t('events.categories.all')}
          </button>
          {Array.isArray(categories) && categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentEventIndex(0);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category[`name_${i18n.language}`] || category.name || category.id}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Event Slider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {Array.isArray(filteredEvents) && filteredEvents.length > 0 ? (
          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {/* Navigation Arrows */}
            <button
              onClick={() => navigateEvents('prev')}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => navigateEvents('next')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 group"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Auto-play Toggle */}
            {filteredEvents.length > 1 && (
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 group"
              >
                {isAutoPlaying ? (
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
              {/* Image Section */}
              <div className="relative overflow-hidden bg-gray-100">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 z-10" />
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${isVisible ? 'scale-110' : 'scale-100'}`}
                  style={{ backgroundImage: `url(${currentEvent?.image || ''})` }}
                />
                
                {/* Event Badges */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                    {currentEvent?.category_display || currentEvent?.category || 'Event'}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="relative p-6 lg:p-8 flex flex-col justify-center">
                <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  {/* Department */}
                  <div className="mb-4">
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                      {currentEvent?.department_display || currentEvent?.department || 'Department'}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 leading-tight">
                    {currentEvent?.title || 'Event Title'}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {currentEvent?.description || 'Event description'}
                  </p>
                  
                  {/* Event Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium w-16">{t('events.labels.date')}</span>
                      <span>{currentEvent?.date || 'Date'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium w-16">{t('events.labels.time')}</span>
                      <span>{currentEvent?.time || 'Time'}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span className="font-medium w-16">{t('events.labels.location')}</span>
                      <span>{currentEvent?.location || 'Location'}</span>
                    </div>
                  </div>

                  {/* Кнопка Подробнее */}
                  <button
                    onClick={() => handleEventDetails(currentEvent)}
                    className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                  >
                    {t('events.actions.details')}
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Indicators */}
            {filteredEvents.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1">
                {filteredEvents.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsVisible(false);
                      setTimeout(() => {
                        setCurrentEventIndex(index);
                        setIsVisible(true);
                      }, 300);
                    }}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      index === currentEventIndex 
                        ? 'bg-gradient-to-r from-blue-600 to-emerald-600 w-6' 
                        : 'bg-gray-300 w-2 hover:bg-blue-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('events.noEvents')}</p>
          </div>
        )}

        {/* All Events Grid */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {t('events.allEvents')} 
              <span className="text-gray-500 text-lg ml-2">
                ({Array.isArray(filteredEvents) ? filteredEvents.length : 0})
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(filteredEvents) && filteredEvents.map((event, index) => (
              <div
                key={event.id || index}
                className={`group bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  index === currentEventIndex ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'
                }`}
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => {
                    setCurrentEventIndex(index);
                    setIsVisible(true);
                  }, 300);
                }}
              >
                {/* Event Image */}
                <div className="relative h-40 overflow-hidden">
                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${event.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* Event Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 bg-blue-600 text-white rounded text-xs font-semibold">
                      {event.category_display || event.category}
                    </span>
                  </div>
                  
                  {/* Date Badge */}
                  <div className="absolute bottom-3 left-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
                      <div className="text-sm font-bold text-gray-800">{event.date}</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Department */}
                  <div className="mb-2">
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {event.department_display || event.department}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {event.description}
                  </p>
                  
                  {/* Event Details */}
                  <div className="space-y-1 text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {event.time}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {event.location}
                    </div>
                  </div>

                  {/* Кнопка Подробнее в карточке */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventDetails(event);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 px-4 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {t('events.actions.details')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Модальное окно с деталями мероприятия */}
      <EventDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default UniversityEventsPage;