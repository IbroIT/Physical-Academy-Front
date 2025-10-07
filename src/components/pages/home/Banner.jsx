import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const Banner = () => {
  const { t } = useTranslation('banner');
  const [currentNews, setCurrentNews] = useState(0);
  
  // Получаем новости из переводов
  const newsItems = t('newsItems', { returnObjects: true });

  // Автопереключение новостей
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % newsItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [newsItems.length]);

  const nextNews = useCallback(() => {
    setCurrentNews((prev) => (prev + 1) % newsItems.length);
  }, [newsItems.length]);

  const prevNews = useCallback(() => {
    setCurrentNews((prev) => (prev - 1 + newsItems.length) % newsItems.length);
  }, [newsItems.length]);

const goToNews = useCallback((index) => {
    setCurrentNews(index);
}, []);

  // Если newsItems не загружены или пустые
  if (!newsItems || !Array.isArray(newsItems) || newsItems.length === 0) {
    return (
      <div className="relative h-screen w-full bg-gray-800 flex items-center justify-center">
        <div className="text-white text-xl">{t('loading')}</div>
      </div>
    );
  }

  const currentItem = newsItems[currentNews];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Фоновые изображения с анимацией */}
      {newsItems.map((news, index) => (
        <div
          key={news.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentNews ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${news.backgroundImage})` }}
          />
          {/* Градиентный оверлей для лучшей читаемости текста */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
      ))}

      {/* Контент */}
      <div className="relative z-10 flex h-full items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl">
            <div className="mb-6">
              <span className="inline-block bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 animate-pulse">
                {t('newsLabel')}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {currentItem.title}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-lg">
              {currentItem.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                {currentItem.ctaText}
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                {t('consultation')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Навигационные точки */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {newsItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToNews(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentNews 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={t('goToNews', { index: index + 1 })}
          />
        ))}
      </div>

      {/* Кнопки навигации */}
      <button
        onClick={prevNews}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300"
        aria-label={t('previous')}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextNews}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300"
        aria-label={t('next')}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Индикатор прогресса */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20">
        <div 
          className="h-full bg-white transition-all duration-5000 ease-linear"
          style={{ 
            width: `${(currentNews / newsItems.length) * 100}%`
          }}
        />
      </div>
    </div>
  );
};

export default Banner;