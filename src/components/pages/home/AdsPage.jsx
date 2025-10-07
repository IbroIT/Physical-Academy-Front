import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const UniversityAnnouncementsPage = () => {
  const { t } = useTranslation();
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Данные объявлений через i18n
  const announcementsData = [
    {
      id: 1,
      title: t('announcements.items.0.title', 'Важное собрание студентов'),
      description: t('announcements.items.0.description', 'Общеуниверситетское собрание для всех студентов 1-3 курсов состоится 25 мая в актовом зале'),
      date: t('announcements.items.0.date', '20 мая 2024'),
      category: t('announcements.categories.events', 'Мероприятия'),
      department: t('announcements.departments.all', 'Все факультеты'),
      urgency: 'high',
      image: '/api/placeholder/600/400'
    },
    {
      id: 2,
      title: t('announcements.items.1.title', 'Запись на летнюю сессию'),
      description: t('announcements.items.1.description', 'Открыта запись на летнюю экзаменационную сессию. Сроки: с 1 по 15 июня'),
      date: t('announcements.items.1.date', '18 мая 2024'),
      category: t('announcements.categories.academic', 'Учебный процесс'),
      department: t('announcements.departments.registrar', 'Учебный отдел'),
      urgency: 'medium',
      image: '/api/placeholder/600/400'
    },
    {
      id: 3,
      title: t('announcements.items.2.title', 'Конкурс научных работ'),
      description: t('announcements.items.2.description', 'Объявляется конкурс на лучшую научную работу среди студентов. Прием работ до 30 мая'),
      date: t('announcements.items.2.date', '15 мая 2024'),
      category: t('announcements.categories.research', 'Научная работа'),
      department: t('announcements.departments.science', 'Научный отдел'),
      urgency: 'medium',
      image: '/api/placeholder/600/400'
    },
    {
      id: 4,
      title: t('announcements.items.3.title', 'Ремонт в корпусе Б'),
      description: t('announcements.items.3.description', 'С 25 мая по 10 июня в корпусе Б будут проводиться ремонтные работы. Занятия переносятся'),
      date: t('announcements.items.3.date', '12 мая 2024'),
      category: t('announcements.categories.infrastructure', 'Инфраструктура'),
      department: t('announcements.departments.facilities', 'Хозяйственный отдел'),
      urgency: 'high',
      image: '/api/placeholder/600/400'
    }
  ];

  const navigateAnnouncements = useCallback((direction) => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentAnnouncementIndex(prev => {
        if (direction === 'next') {
          return (prev + 1) % announcementsData.length;
        } else {
          return prev === 0 ? announcementsData.length - 1 : prev - 1;
        }
      });
      setIsVisible(true);
    }, 300);
  }, [announcementsData.length]);

  // Автоматическая смена объявлений
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      navigateAnnouncements('next');
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, navigateAnnouncements]);

  const currentAnnouncement = announcementsData[currentAnnouncementIndex];

  const getUrgencyBadge = (urgency) => {
    const styles = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-orange-100 text-orange-700 border-orange-200',
      low: 'bg-cyan-100 text-cyan-700 border-cyan-200'
    };
    return styles[urgency] || styles.low;
  };

  const getUrgencyText = (urgency) => {
    const texts = {
      high: t('announcements.urgency.high', 'Срочно'),
      medium: t('announcements.urgency.medium', 'Важно'),
      low: t('announcements.urgency.low', 'Информация')
    };
    return texts[urgency] || texts.low;
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-6">
              {t('announcements.title', 'Объявления Университета')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('announcements.subtitle', 'Актуальная информация о мероприятиях, учебном процессе и важных событиях')}
            </p>
          </div>
        </div>
      </div>
      {/* Featured Announcement Slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcementsData.map((announcement, index) => (
              <div
                key={announcement.id}
                className={`group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 cursor-pointer ${
                  index === currentAnnouncementIndex ? 'ring-2 ring-cyan-500 scale-105' : 'hover:scale-105'
                }`}
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => {
                    setCurrentAnnouncementIndex(index);
                    setIsVisible(true);
                  }, 300);
                }}
              >
                <div className="relative overflow-hidden h-48">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 z-10 group-hover:scale-110 transition-transform duration-700" />
                  <div 
                    className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(${announcement.image})` }}
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyBadge(announcement.urgency)}`}>
                      {getUrgencyText(announcement.urgency)}
                    </span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                      {announcement.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-400 text-xs flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {announcement.department}
                    </span>
                    <span className="text-gray-400 text-xs">{announcement.date}</span>
                  </div>
                  
                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                    {announcement.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {announcement.description}
                  </p>
                  
                  <div className="flex items-center text-cyan-600 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    {t('announcements.readMore', 'Читать далее')}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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

export default UniversityAnnouncementsPage;