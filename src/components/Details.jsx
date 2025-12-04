import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const NewsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

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
          setNewsData(response.data.news);
        } else {
          setError('Новость не найдена на сервере');
        }
      } catch (err) {
        console.error('API Error:', err);
        setError(`Ошибка загрузки: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNewsDetail();
    } else {
      setError('ID новости не указан');
      setLoading(false);
    }
  }, [id]);

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
        alert('Ссылка скопирована в буфер обмена!');
      }
    } catch (err) {
      console.log('Ошибка при попытке поделиться:', err);
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
    if (!imagePath) return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    return `https://physical-academy-backend-3dccb860f75a.herokuapp.com${imagePath}`;
  };

  // Резервные данные на случай ошибки API
  const getFallbackData = () => ({
    id: parseInt(id),
    title: "Интересная новость",
    description: "Узнайте больше об этой захватывающей новости.",
    full_content: "Это резервный контент, который показывается когда данные с сервера недоступны. Пожалуйста, проверьте подключение к интернету и попробуйте снова.",
    image_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    category: 'Общее',
    author: 'Редакция',
    created_at: new Date().toISOString(),
    tags: ['новости', 'информация'],
    read_time: '2 мин чтения'
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
            Загружаем новость...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error || !newsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-4"
        >
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Что-то пошло не так</h1>
          <p className="text-gray-600 mb-6">{error || 'Новость не найдена'}</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 font-semibold"
            >
              На главную
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 border border-gray-300 text-gray-600 rounded-xl hover:border-cyan-400 hover:text-cyan-600 transition-all duration-300 font-semibold"
            >
              Попробовать снова
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Используем данные с бэкенда или резервные данные
  const data = newsData || getFallbackData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0  bg-white/80 backdrop-blur-md border-b border-gray-200"
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
              Назад к новостям
            </button>
            
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-cyan-400 hover:text-cyan-600 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Поделиться
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img
                src={getImageUrl(data.image_url)}
                alt={data.title}
                className={`w-full h-64 sm:h-80 md:h-96 object-cover transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  console.error('Image failed to load:', e);
                  e.target.src = 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80';
                }}
              />
            </div>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white"
              >
                <span className="inline-block px-3 py-1 bg-cyan-500 rounded-full text-sm font-semibold mb-2">
                  {data.category || 'Общее'}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                  {data.title}
                </h1>
              </motion.div>
            </div>
          </motion.div>

          {/* Article Meta */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-4 mb-8 text-gray-600"
          >
            <div className="w-px h-4 bg-gray-300" />
            <span>{formatDate(data.created_at)}</span>
            <div className="w-px h-4 bg-gray-300" />
          </motion.div>

          {/* Tags */}
          {data.tags && data.tags.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {data.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="px-3 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-sm font-medium border border-cyan-200 hover:border-cyan-300 transition-colors duration-300 cursor-pointer"
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
            className="prose prose-lg max-w-none"
          >
            <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium">
              {data.description}
            </p>
            
            <div className="space-y-6 text-gray-600 leading-8">
              {data.full_content ? (
                data.full_content.split('\n\n').map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="text-lg"
                  >
                    {paragraph}
                  </motion.p>
                ))
              ) : (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-lg"
                >
                  {data.content || 'Полное содержание новости скоро будет доступно...'}
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.article>
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all duration-300 z-40"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
};

export default NewsDetailPage;