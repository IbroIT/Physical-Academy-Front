import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sectionRef = useRef(null);

  // Получаем все данные через i18n
  const announcementsData = t('announcements.items', { returnObjects: true });
  const detailData = t('announcements.detail', { returnObjects: true });
  const infoLabels = t('announcements.detail.infoLabels', { returnObjects: true });

  const currentAnnouncement = announcementsData.find(announcement => announcement.id === parseInt(id)) || announcementsData[0];

  // Прокрутка к верху при загрузке
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Отслеживание прокрутки для кнопки "Наверх"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Прокрутка к верху
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Функция для поделиться
  const handleShare = async () => {
    const shareData = {
      title: currentAnnouncement.title,
      text: currentAnnouncement.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback - копирование ссылки в буфер обмена
        await navigator.clipboard.writeText(window.location.href);
        alert(t('announcements.detail.shareCopied'));
      }
    } catch (error) {
      console.log(t('announcements.detail.shareError'), error);
    }
  };

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

  const getUrgencyBadge = (urgency) => {
    const styles = {
      high: 'bg-red-100 text-red-700 border-red-200',
      medium: 'bg-orange-100 text-orange-700 border-orange-200',
      low: 'bg-cyan-100 text-cyan-700 border-cyan-200'
    };
    return styles[urgency] || styles.low;
  };

  if (!currentAnnouncement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {detailData.notFound}
          </h1>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-lg hover:from-cyan-700 hover:to-emerald-700 transition-all duration-300"
          >
            {detailData.backToAnnouncements}
          </button>
        </div>
      </div>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 py-8 lg:py-12 overflow-hidden"
    >
      {/* Кнопка "Наверх" */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:from-cyan-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-bounce delay-1500"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Хлебные крошки */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 text-sm text-gray-600 mb-8"
        >
          <button 
            onClick={() => navigate('/')}
            className="hover:text-cyan-600 transition-colors duration-300"
          >
            {t('announcements.title')}
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-800 font-medium">{currentAnnouncement.title}</span>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Основной контент */}
          <div className="lg:col-span-3">
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
            >
              {/* Заголовочное изображение */}
              <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
                <motion.img
                  initial={{ scale: 1.1 }}
                  animate={isVisible ? { scale: 1 } : {}}
                  transition={{ duration: 1.2 }}
                  src={currentAnnouncement.image}
                  alt={currentAnnouncement.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Категория и дата */}
                <div className="absolute top-6 left-6 z-20 flex flex-wrap gap-2">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-cyan-700 rounded-full text-sm font-semibold">
                    {currentAnnouncement.category}
                  </span>
                  <span className="px-3 py-2 bg-black/50 backdrop-blur-sm text-white rounded-lg text-sm">
                    {currentAnnouncement.date}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getUrgencyBadge(currentAnnouncement.urgency)}`}>
                    {t(`announcements.urgency.${currentAnnouncement.urgency}`)}
                  </span>
                </div>
              </div>

              {/* Контент объявления */}
              <div className="p-6 lg:p-8">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-6 leading-tight"
                >
                  {currentAnnouncement.title}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="prose prose-lg max-w-none text-gray-600 mb-8"
                >
                  <p className="text-xl leading-relaxed mb-6">
                    {currentAnnouncement.description}
                  </p>
                  
                  {/* Полный текст объявления */}
                  <div className="space-y-4 text-gray-700">
                    {detailData.content.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                    
                    <blockquote className="border-l-4 border-cyan-500 pl-6 italic text-gray-600 my-6">
                      {detailData.quote}
                    </blockquote>
                  </div>
                </motion.div>

                {/* Дополнительные детали */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="grid md:grid-cols-2 gap-6 mb-8"
                >
                  {detailData.features.map((feature, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-br from-cyan-50 to-emerald-50 rounded-2xl p-6 border border-cyan-100"
                    >
                      <h3 className="font-semibold text-cyan-800 mb-3 flex items-center gap-2">
                        <span>{feature.icon}</span>
                        {feature.title}
                      </h3>
                      <p className="text-cyan-700">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </motion.div>

                {/* Кнопки действий */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="flex flex-wrap gap-4 pt-6 border-t border-gray-200"
                >
                  <button 
                    onClick={handleShare}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-xl hover:from-cyan-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-2"
                  >
                    <span>📤</span>
                    {t('announcements.share')}
                  </button>
                  
                  <button 
                    onClick={() => navigate('/')}
                    className="px-8 py-4 border border-gray-300 text-gray-600 rounded-xl hover:border-cyan-400 hover:text-cyan-600 transition-all duration-300 font-semibold flex items-center gap-2"
                  >
                    <span>←</span>
                    {detailData.backToAnnouncements}
                  </button>
                </motion.div>
              </div>
            </motion.article>
          </div>

          {/* Боковая панель */}
          <div className="space-y-8">
            {/* Статистика */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📈</span>
                {detailData.stats.title}
              </h3>
              
              <div className="space-y-3">
                {detailData.stats.items.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-600">{stat.label}:</span>
                    <span className="font-semibold text-cyan-600">{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Информация о объявлении */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>ℹ️</span>
                {detailData.info.title}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{infoLabels.department}:</span>
                  <span className="font-medium text-gray-800">{currentAnnouncement.department}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{infoLabels.category}:</span>
                  <span className="font-medium text-gray-800">{currentAnnouncement.category}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">{infoLabels.urgency}:</span>
                  <span className="font-medium text-gray-800">
                    {t(`announcements.urgency.${currentAnnouncement.urgency}`)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">{infoLabels.publicationDate}:</span>
                  <span className="font-medium text-gray-800">{currentAnnouncement.date}</span>
                </div>
              </div>
            </motion.div>

            {/* Теги */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🏷️</span>
                {detailData.tags.title}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {detailData.tags.items.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium hover:bg-cyan-200 transition-colors duration-300 cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementDetailPage;