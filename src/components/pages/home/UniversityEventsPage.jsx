import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const UniversityEventsPage = () => {
  const { t } = useTranslation();
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Данные мероприятий через i18n
  const eventsData = [
    {
      id: 1,
      title: t('events.items.0.title', 'Международная научная конференция'),
      description: t('events.items.0.description', 'Ежегодная конференция по инновациям в области компьютерных наук и искусственного интеллекта'),
      date: t('events.items.0.date', '15 мая 2024'),
      time: t('events.items.0.time', '10:00 - 18:00'),
      location: t('events.items.0.location', 'Главный корпус, актовый зал'),
      category: t('events.categories.conference', 'Конференция'),
      image: '/api/placeholder/600/400',
      department: t('events.departments.cs', 'Факультет компьютерных наук'),
      registrationRequired: true,
      seats: 150,
      registered: 124,
      deadline: '14 мая 2024'
    },
    {
      id: 2,
      title: t('events.items.1.title', 'День открытых дверей'),
      description: t('events.items.1.description', 'Знакомство с университетом, факультетами и программами обучения для абитуриентов'),
      date: t('events.items.1.date', '20 мая 2024'),
      time: t('events.items.1.time', '12:00 - 16:00'),
      location: t('events.items.1.location', 'Центральный холл'),
      category: t('events.categories.open_day', 'День открытых дверей'),
      image: '/api/placeholder/600/400',
      department: t('events.departments.all', 'Все факультеты'),
      registrationRequired: true,
      seats: 300,
      registered: 287,
      deadline: '19 мая 2024'
    },
    {
      id: 3,
      title: t('events.items.2.title', 'Студенческий хакатон'),
      description: t('events.items.2.description', '48-часовой марафон программирования с призовым фондом для студентов'),
      date: t('events.items.2.date', '25-26 мая 2024'),
      time: t('events.items.2.time', '09:00 - 21:00'),
      location: t('events.items.2.location', 'Инновационный центр'),
      category: t('events.categories.hackathon', 'Хакатон'),
      image: '/api/placeholder/600/400',
      department: t('events.departments.cs', 'Факультет компьютерных наук'),
      registrationRequired: true,
      seats: 100,
      registered: 95,
      deadline: '24 мая 2024',
      prize: '50,000 руб.'
    },
    {
      id: 4,
      title: t('events.items.3.title', 'Спортивный турнир по баскетболу'),
      description: t('events.items.3.description', 'Ежегодные межфакультетские соревнования по баскетболу'),
      date: t('events.items.3.date', '18 мая 2024'),
      time: t('events.items.3.time', '15:00 - 19:00'),
      location: t('events.items.3.location', 'Спортивный комплекс'),
      category: t('events.categories.sports', 'Спорт'),
      image: '/api/placeholder/600/400',
      department: t('events.departments.sports', 'Спортивный клуб'),
      registrationRequired: false,
      seats: null,
      registered: null
    },
    {
      id: 5,
      title: t('events.items.4.title', 'Мастер-класс по публичным выступлениям'),
      description: t('events.items.4.description', 'Практический workshop от профессионального тренера по ораторскому искусству'),
      date: t('events.items.4.date', '22 мая 2024'),
      time: t('events.items.4.time', '14:00 - 17:00'),
      location: t('events.items.4.location', 'Аудитория 301'),
      category: t('events.categories.workshop', 'Мастер-класс'),
      image: '/api/placeholder/600/400',
      department: t('events.departments.communication', 'Факультет коммуникаций'),
      registrationRequired: true,
      seats: 40,
      registered: 32,
      deadline: '21 мая 2024'
    },
    {
      id: 6,
      title: t('events.items.5.title', 'Выставка студенческих проектов'),
      description: t('events.items.5.description', 'Демонстрация лучших дипломных работ и научных проектов студентов'),
      date: t('events.items.5.date', '28 мая 2024'),
      time: t('events.items.5.time', '11:00 - 16:00'),
      location: t('events.items.5.location', 'Выставочный зал'),
      category: t('events.categories.exhibition', 'Выставка'),
      image: '/api/placeholder/600/400',
      department: t('events.departments.art', 'Факультет искусств'),
      registrationRequired: false,
      seats: null,
      registered: null
    }
  ];

  const categories = [
    { id: 'all', name: t('events.categories.all', 'Все мероприятия') },
    { id: 'conference', name: t('events.categories.conference', 'Конференции') },
    { id: 'workshop', name: t('events.categories.workshop', 'Мастер-классы') },
    { id: 'hackathon', name: t('events.categories.hackathon', 'Хакатоны') },
    { id: 'sports', name: t('events.categories.sports', 'Спорт') },
    { id: 'exhibition', name: t('events.categories.exhibition', 'Выставки') },
    { id: 'open_day', name: t('events.categories.open_day', 'Дни открытых дверей') }
  ];

  const filteredEvents = selectedCategory === 'all' 
    ? eventsData 
    : eventsData.filter(event => event.category === categories.find(cat => cat.id === selectedCategory)?.name);

  const navigateEvents = useCallback((direction) => {
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
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      navigateEvents('next');
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, navigateEvents]);

  const currentEvent = filteredEvents[currentEventIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-emerald-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              {t('events.title', 'Мероприятия Университета')}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('events.subtitle', 'Участвуйте в конференциях, мастер-классах, спортивных и культурных событиях нашего университета')}
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
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
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Event Slider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredEvents.length > 0 ? (
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

            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
              {/* Image Section */}
              <div className="relative overflow-hidden bg-gray-100">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 z-10" />
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${isVisible ? 'scale-110' : 'scale-100'}`}
                  style={{ backgroundImage: `url(${currentEvent.image})` }}
                />
                
                {/* Event Badges */}
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold">
                    {currentEvent.category}
                  </span>
                  {currentEvent.registrationRequired && (
                    <span className="px-3 py-1 bg-emerald-500 text-white rounded-full text-sm font-semibold">
                      {t('events.registrationRequired', 'Регистрация')}
                    </span>
                  )}
                </div>
              </div>

              {/* Content Section */}
              <div className="relative p-6 lg:p-8 flex flex-col justify-center">
                <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  {/* Department */}
                  <div className="mb-4">
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                      {currentEvent.department}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 leading-tight">
                    {currentEvent.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {currentEvent.description}
                  </p>
                  
                  {/* Event Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium w-16">{t('events.date', 'Дата:')}</span>
                      <span>{currentEvent.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium w-16">{t('events.time', 'Время:')}</span>
                      <span>{currentEvent.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium w-16">{t('events.location', 'Место:')}</span>
                      <span>{currentEvent.location}</span>
                    </div>
                    
                    {/* Registration Info */}
                    {currentEvent.registrationRequired && (
                      <>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="font-medium w-16">{t('events.seats', 'Места:')}</span>
                          <span>{currentEvent.registered}/{currentEvent.seats}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium w-16">{t('events.deadline', 'До:')}</span>
                          <span>{currentEvent.deadline}</span>
                        </div>
                        {currentEvent.prize && (
                          <div className="flex items-center text-sm text-emerald-600 font-semibold">
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span>Призовой фонд: {currentEvent.prize}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Progress Bar for Registration */}
                  {currentEvent.registrationRequired && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>{t('events.registrationProgress', 'Заполняемость:')}</span>
                        <span>{Math.round((currentEvent.registered / currentEvent.seats) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(currentEvent.registered / currentEvent.seats) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* CTA Buttons */}
                  <div className="flex items-center gap-3">
                    {currentEvent.registrationRequired ? (
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm">
                        {t('events.registerNow', 'Зарегистрироваться')}
                      </button>
                    ) : (
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm">
                        {t('events.moreDetails', 'Подробнее')}
                      </button>
                    )}
                    
                    <button className="px-5 py-3 border border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-all duration-300 font-semibold text-sm">
                      {t('events.addToCalendar', 'В календарь')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Indicators */}
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
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('events.noEvents', 'Мероприятия не найдены')}</p>
          </div>
        )}

        {/* All Events Grid */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {t('events.allEvents', 'Все мероприятия')} 
              <span className="text-gray-500 text-lg ml-2">({filteredEvents.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
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
                      {event.category}
                    </span>
                    {event.registrationRequired && (
                      <span className="px-2 py-1 bg-emerald-500 text-white rounded text-xs font-semibold">
                        {t('events.registration', 'Регистрация')}
                      </span>
                    )}
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
                      {event.department}
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
                  
                  {/* Registration Info */}
                  {event.registrationRequired && (
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                      <span>
                        {t('events.registered', 'Зарегистрировано:')} {event.registered}/{event.seats}
                      </span>
                      <span className="font-semibold text-blue-600">
                        {Math.round((event.registered / event.seats) * 100)}%
                      </span>
                    </div>
                  )}
                  
                  {/* CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-blue-600 text-sm font-semibold group-hover:translate-x-1 transition-transform duration-300">
                      {event.registrationRequired ? t('events.register', 'Зарегистрироваться') : t('events.view', 'Подробнее')}
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    
                    {event.prize && (
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-semibold">
                        🏆 {event.prize}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityEventsPage;