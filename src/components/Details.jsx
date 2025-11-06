import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Дополнительные демо фотографии (только для галереи, основное фото остается с бэкенда)
  const additionalGalleryImages = [
    'https://www.radionetplus.ru/uploads/posts/2013-12/1387478932_krasivye-fotki-1.jpg'
  ];

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
  
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

  // Загрузка данных с бэкенда
  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching news with ID:', id);
        
        const response = await axios.get(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/news/${id}/`);
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          const newsItem = response.data.news;
          
          // Сохраняем основное фото с бэкенда и добавляем дополнительные для галереи
          if (newsItem.image_url) {
            // Создаем массив изображений: основное фото + дополнительные
            newsItem.images_url = [newsItem.image_url, ...additionalGalleryImages];
          } else {
            // Если основного фото нет, используем только дополнительные
            newsItem.images_url = additionalGalleryImages;
          }
          
          setNewsData(newsItem);
        } else {
          setError(t('newsDetail.errors.notFound'));
        }
      } catch (err) {
        console.error('API Error:', err);
        setError(`${t('newsDetail.errors.loading')}: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsDetail();
    } else {
      setError(t('newsDetail.errors.noId'));
      setLoading(false);
    }
  }, [id, t]);

  const handleShare = async () => {
    if (!newsData) return;

    const shareData = {
      title: newsData.title,
      text: newsData.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(t('newsDetail.share.copied'));
      }
    } catch (err) {
      console.log(t('newsDetail.share.error'), err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Функция для получения полного URL изображения
  const getImageUrl = (imagePath) => {
    if (!imagePath) return additionalGalleryImages[0];
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    return `https://physical-academy-backend-3dccb860f75a.herokuapp.com${imagePath}`;
  };

  // Получение массива изображений из данных новости
  const getImagesArray = (data) => {
    if (!data) return [];
    
    // Используем images_url если он есть, иначе создаем из image_url + дополнительные
    if (data.images_url && Array.isArray(data.images_url) && data.images_url.length > 0) {
      return data.images_url;
    }
    
    // Если есть основное изображение, используем его + дополнительные
    if (data.image_url) {
      return [data.image_url, ...additionalGalleryImages];
    }
    
    // Только дополнительные изображения
    return additionalGalleryImages;
  };

  const handleImageLoad = (index) => {
    setImageLoaded(prev => ({ ...prev, [index]: true }));
  };

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextImage = () => {
    const images = getImagesArray(newsData);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getImagesArray(newsData);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Обработка клавиатуры для lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, currentImageIndex]);

  // Резервные данные на случай ошибки API
  const getFallbackData = () => ({
    id: parseInt(id),
    title: t('newsDetail.fallback.title'),
    description: t('newsDetail.fallback.description'),
    full_content: t('newsDetail.fallback.fullContent'),
    image_url: additionalGalleryImages[0],
    images_url: [additionalGalleryImages[0], ...additionalGalleryImages],
    category: t('newsDetail.fallback.category'),
    author: t('newsDetail.fallback.author'),
    created_at: new Date().toISOString(),
    tags: t('newsDetail.fallback.tags', { returnObjects: true }),
    read_time: t('newsDetail.fallback.readTime'),
    views: 0
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p
            initial={{ y: 10 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-cyan-600 text-lg font-medium"
          >
            {t('newsDetail.loading')}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error || !newsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md w-full"
        >
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {t('newsDetail.error.title')}
          </h1>
          <p className="text-gray-600 mb-6">{error || t('newsDetail.error.notFound')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-semibold flex-1 sm:flex-none"
            >
              {t('newsDetail.error.homeButton')}
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 border border-gray-300 text-gray-600 rounded-xl hover:border-cyan-400 hover:text-cyan-600 transition-all duration-300 font-semibold flex-1 sm:flex-none"
            >
              {t('newsDetail.error.retryButton')}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Используем данные с бэкенда или резервные данные
  const data = newsData || getFallbackData();
  const images = getImagesArray(data);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50"
      >
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-cyan-600 transition-colors duration-300 group"
            >
              <motion.svg 
                whileHover={{ x: -2 }}
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </motion.svg>
              <span className="hidden xs:inline">{t('newsDetail.header.back')}</span>
            </button>
            
            <div className="flex items-center gap-2 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg hover:border-cyan-400 hover:text-cyan-600 transition-all duration-300 text-sm sm:text-base"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="hidden sm:inline">{t('newsDetail.header.share')}</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero Section with Main Image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-6 sm:mb-8 shadow-xl sm:shadow-2xl cursor-pointer"
            onClick={() => openLightbox(0)}
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img
                src={getImageUrl(images[0])}
                alt={data.title}
                className={`w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover transition-all duration-500 hover:scale-105 ${
                  imageLoaded[0] ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(0)}
                onError={(e) => {
                  console.error('Image failed to load:', e);
                  e.target.src = additionalGalleryImages[0];
                }}
              />
            </div>
            {!imageLoaded[0] && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-white"
                >
                  <span className="inline-block px-2 py-1 sm:px-3 sm:py-1 bg-cyan-500 rounded-full text-xs sm:text-sm font-semibold mb-2">
                    {data.category || t('newsDetail.defaultCategory')}
                  </span>
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-2">
                    {data.title}
                  </h1>
                  <p className="text-blue-100 text-sm sm:text-lg opacity-90">
                    {t('newsDetail.photoCounter', { count: images.length })}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Image Gallery */}
          {images.length > 1 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6 sm:mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  {t('newsDetail.gallery.title')}
                </h3>
                <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 sm:px-3 sm:py-1 rounded-full self-start sm:self-auto">
                  {t('newsDetail.gallery.photoCount', { count: images.length })}
                </span>
              </div>
              
              {/* Адаптивная сетка галереи */}
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {images.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className={`
                      relative rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg cursor-pointer group
                      ${index === 0 ? 
                        'col-span-2 xs:col-span-3 sm:col-span-2 md:col-span-2 row-span-2 aspect-square sm:aspect-auto' : 
                        'aspect-square'
                      }
                    `}
                    onClick={() => openLightbox(index)}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${data.title} ${index + 1}`}
                      className={`
                        w-full h-full object-cover transition-all duration-500 group-hover:scale-110
                        ${imageLoaded[index] ? 'opacity-100' : 'opacity-0'}
                        ${index === 0 ? 'sm:min-h-[200px] md:min-h-[250px]' : ''}
                      `}
                      onLoad={() => handleImageLoad(index)}
                      onError={(e) => {
                        console.error('Gallery image failed to load:', e);
                        e.target.src = additionalGalleryImages[index % additionalGalleryImages.length];
                      }}
                    />
                    {!imageLoaded[index] && (
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                      <div className="transform translate-y-2 sm:translate-y-4 group-hover:translate-y-0 transition-transform duration-300 text-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 mx-auto mb-1 sm:mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3-3H7" />
                        </svg>
                        <span className="text-white text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden xs:block">
                          {t('newsDetail.gallery.photoNumber', { number: index + 1 })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Article Meta */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 text-gray-600 bg-white/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm sm:text-base">{formatDate(data.created_at)}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm sm:text-base">{data.read_time || t('newsDetail.meta.readTime')}</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="text-sm sm:text-base">{t('newsDetail.meta.views', { count: data.views || 0 })}</span>
            </div>
          </motion.div>

          {/* Tags */}
          {data.tags && data.tags.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 mb-6 sm:mb-8"
            >
              {data.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-xs sm:text-sm font-medium border border-cyan-600 hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 cursor-pointer shadow-lg"
                >
                  #{tag}
                </motion.span>
              ))}
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="prose prose-sm sm:prose-lg max-w-none bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg sm:shadow-xl"
          >
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-4 sm:mb-6 md:mb-8 font-medium border-l-4 border-cyan-500 pl-3 sm:pl-4 bg-blue-50 py-3 sm:py-4 rounded-r-lg">
              {data.description}
            </p>
            
            <div className="space-y-4 sm:space-y-6 text-gray-600 leading-7 sm:leading-8 text-base sm:text-lg">
              {data.full_content ? (
                data.full_content.split('\n\n').map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="text-gray-700"
                  >
                    {paragraph}
                  </motion.p>
                ))
              ) : (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-gray-700"
                >
                  {data.content || t('newsDetail.content.soon')}
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.article>
      </div>

      {/* Lightbox Modal */}
<AnimatePresence>
  {isLightboxOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={closeLightbox}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative max-w-4xl lg:max-w-6xl xl:max-w-7xl max-h-full w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeLightbox}
          className="absolute -top-10 sm:-top-12 right-0 text-white hover:text-cyan-400 transition-colors duration-300 z-10 bg-black/50 rounded-full p-1 sm:p-2"
        >
          <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative bg-black rounded-lg sm:rounded-2xl overflow-hidden mb-16 sm:mb-20 md:mb-24">
          <motion.img
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={getImageUrl(images[currentImageIndex])}
            alt={`${data.title} ${currentImageIndex + 1}`}
            className="w-full max-h-[60vh] sm:max-h-[70vh] md:max-h-[80vh] object-contain"
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 sm:p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 sm:p-3 md:p-4 rounded-full transition-all duration-300 hover:scale-110"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip - ПЕРЕНЕСЕНО ВВЕРХ */}
        {images.length > 1 && (
          <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2 max-w-full overflow-x-auto py-1 sm:py-2 px-2 sm:px-4">
            {images.map((image, index) => (
              <motion.img
                key={index}
                src={getImageUrl(image)}
                alt={t('newsDetail.lightbox.thumbnailAlt', { number: index + 1 })}
                className={`
                  object-cover rounded cursor-pointer transition-all duration-300
                  ${index === currentImageIndex 
                    ? 'ring-2 sm:ring-4 ring-cyan-500 scale-105' 
                    : 'opacity-60 hover:opacity-100 hover:scale-105'
                  }
                  w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                `}
                onClick={() => setCurrentImageIndex(index)}
                whileHover={{ scale: 1.05 }}
              />
            ))}
          </div>
        )}

        {/* Image Counter and Info - ПЕРЕНЕСЕНО ВНИЗ, под миниатюрами */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col sm:flex-row items-center gap-1 sm:gap-2 md:gap-4 w-full px-2 sm:px-0">
          <div className="bg-black/70 text-white px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm text-center">
            {t('newsDetail.lightbox.counter', { current: currentImageIndex + 1, total: images.length })}
          </div>
          <div className="bg-black/70 text-white px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm text-center max-w-[90vw] sm:max-w-none truncate">
            {t('newsDetail.lightbox.photoInfo', { title: data.title, number: currentImageIndex + 1 })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
};

export default NewsDetailPage;