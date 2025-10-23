import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const NewsHomePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка новостей с бэкенда
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const currentLanguage = i18n.language;
        const response = await axios.get(`http://localhost:8000/api/news/?lang=${currentLanguage}`);
        if (response.data.success) {
          setNewsData(response.data.news);
        }
      } catch (err) {
        setError('Ошибка загрузки новостей');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [i18n.language]);

  const navigateNews = useCallback(
    (direction) => {
      if (newsData.length === 0) return;
      
      setIsVisible(false);
      setTimeout(() => {
        setCurrentNewsIndex((prev) => {
          if (direction === 'next') {
            return (prev + 1) % newsData.length;
          } else {
            return prev === 0 ? newsData.length - 1 : prev - 1;
          }
        });
        setIsVisible(true);
      }, 300);
    },
    [newsData.length]
  );

  // Автоматическая смена новостей
  useEffect(() => {
    if (!isAutoPlaying || newsData.length === 0) return;

    const interval = setInterval(() => {
      navigateNews('next');
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, navigateNews, newsData.length]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyan-600 text-xl">Загрузка новостей...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  if (newsData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 text-xl">Нет доступных новостей</div>
      </div>
    );
  }

  const currentNews = newsData[currentNewsIndex];

  const handleReadMore = (newsId) => {
    navigate(`/details/${newsId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 bg-clip-text text-transparent mb-6"
            >
              {t('news.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            >
              {t('news.subtitle')}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Featured News Slider */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Navigation Arrows */}
          <button
            onClick={() => navigateNews('prev')}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 group"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => navigateNews('next')}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 group"
          >
            <svg className="w-6 h-6 text-gray-600 group-hover:text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Auto-play Toggle */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-all duration-300 group"
          >
            {isAutoPlaying ? (
              <svg className="w-5 h-5 text-gray-600 group-hover:text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600 group-hover:text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
            {/* Image Section */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 z-10" />
              <motion.div
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${isVisible ? 'scale-110' : 'scale-100'}`}
                style={{ backgroundImage: `url(http://localhost:8000${currentNews.image_url})` }}
                key={currentNews.id}
              />
            </div>

            {/* Content Section */}
            <div className="relative p-8 lg:p-12 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentNews.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-2 bg-gradient-to-r from-cyan-100 to-cyan-50 text-cyan-700 rounded-full text-sm font-semibold border border-cyan-200">
                      {currentNews.category}
                    </span>
                    <span className="text-gray-500 font-medium">
                      {new Date(currentNews.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                    {currentNews.title}
                  </h2>

                  <p className="text-lg text-gray-600 leading-relaxed">{currentNews.description}</p>

                  <div className="flex items-center gap-4 pt-4">
                    <button
                      onClick={() => handleReadMore(currentNews.id)}
                      className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-emerald-600 text-white rounded-xl hover:from-cyan-700 hover:to-emerald-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      {t('news.readMore')}
                    </button>

                    <button className="px-6 py-4 border border-gray-300 text-gray-600 rounded-xl hover:border-cyan-400 hover:text-cyan-600 transition-all duration-300 font-semibold">
                      {t('news.share')}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {newsData.map((news, index) => (
              <button
                key={news.id}
                onClick={() => {
                  setIsVisible(false);
                  setTimeout(() => {
                    setCurrentNewsIndex(index);
                    setIsVisible(true);
                  }, 300);
                }}
                className={`h-1 rounded-full transition-all duration-500 ${
                  index === currentNewsIndex
                    ? 'bg-gradient-to-r from-cyan-600 to-emerald-600 w-8'
                    : 'bg-gray-300 w-3 hover:bg-cyan-400'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* News Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{t('news.allNews')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 ${
                  index === currentNewsIndex ? 'ring-2 ring-cyan-500' : ''
                }`}
              >
                <div className="relative overflow-hidden h-48">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 z-10 group-hover:scale-110 transition-transform duration-700" />
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                    style={{ backgroundImage: `url(http://localhost:8000${news.image_url})` }}
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                      {news.category}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {new Date(news.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                    {news.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{news.description}</p>

                  <button
                    onClick={() => handleReadMore(news.id)}
                    className="flex items-center text-cyan-600 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300"
                  >
                    {t('news.readMore')}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NewsHomePage;