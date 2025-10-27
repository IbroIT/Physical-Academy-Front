import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { getImageUrl } from '../../../utils/imageUtils';

const QuotesBanner = () => {
  const { t, i18n } = useTranslation();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка цитат с бэкенда
  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const currentLanguage = i18n.language;
        const response = await axios.get(`https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/quotes/?lang=${currentLanguage}`);
        if (response.data.success) {
          setQuotes(response.data.quotes);
        }
      } catch (err) {
        setError('Ошибка загрузки цитат');
        console.error('Error fetching quotes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [i18n.language]);

  const nextQuote = useCallback(() => {
    if (quotes.length === 0) return;
    
    setIsVisible(false);
    setTimeout(() => {
      setCurrentQuoteIndex((prevIndex) => 
        prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
      );
      setIsVisible(true);
    }, 500);
  }, [quotes.length]);

  useEffect(() => {
    if (quotes.length === 0) return;
    
    const interval = setInterval(nextQuote, 5000);
    return () => clearInterval(interval);
  }, [nextQuote, quotes.length]);

  if (loading) {
    return (
      <div className="relative w-full bg-gradient-to-br from-cyan-50 via-white to-emerald-50 py-16 overflow-hidden border-b border-cyan-100">
        <div className="container mx-auto px-4">
          <div className="text-center text-cyan-600">Загрузка цитат...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full bg-gradient-to-br from-cyan-50 via-white to-emerald-50 py-16 overflow-hidden border-b border-cyan-100">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="relative w-full bg-gradient-to-br from-cyan-50 via-white to-emerald-50 py-16 overflow-hidden border-b border-cyan-100">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500">Нет доступных цитат</div>
        </div>
      </div>
    );
  }

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="relative w-full bg-gradient-to-br from-cyan-50 via-white to-emerald-50 py-16 overflow-hidden border-b border-cyan-100">
      {/* Анимированные фоновые элементы */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-16 w-24 h-24 bg-emerald-300 rounded-full opacity-30 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-cyan-400 rounded-full opacity-25 animate-pulse-slow"></div>
        
        {/* Волны */}
        <div className="absolute bottom-0 left-0 w-full opacity-10">
          <svg viewBox="0 0 1200 120" className="w-full h-20">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor" className="text-cyan-400"></path>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`transform transition-all duration-700 ease-in-out ${
          isVisible 
            ? 'translate-y-0 opacity-100 scale-100' 
            : 'translate-y-8 opacity-0 scale-98'
        }`}>
          
          {/* Карточка с цитатой */}
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-cyan-100/50 p-8 md:p-12">
            <div className="text-center">
              {/* Иконка цитаты и изображение автора */}
              <div className="mb-6 flex flex-col items-center">
                {currentQuote.image_url ? (
                  <div className="mb-4">
                    <img 
                      src={getImageUrl(currentQuote.image_url)}
                      alt={currentQuote.author}
                      className="w-20 h-20 rounded-full object-cover border-4 border-cyan-100 shadow-md"
                    />
                  </div>
                ) : (
                  <svg 
                    className="w-14 h-14 mx-auto text-cyan-500/30 mb-4" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
                  </svg>
                )}
              </div>
              
              {/* Текст цитаты */}
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-800 font-light italic leading-relaxed mb-8">
                "{currentQuote.text}"
              </p>
              
              {/* Разделитель */}
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-0.5 bg-gradient-to-r from-cyan-300 to-emerald-300 rounded-full"></div>
              </div>
              
              {/* Автор */}
              <div>
                <p className="text-lg md:text-xl text-cyan-700 font-semibold mb-1">
                  — {currentQuote.author}
                </p>
                {currentQuote.author_title && (
                  <p className="text-sm text-gray-600">
                    {currentQuote.author_title}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Индикаторы прогресса */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            {/* Стрелка назад */}
            <button
              onClick={() => {
                if (quotes.length === 0) return;
                setIsVisible(false);
                setTimeout(() => {
                  setCurrentQuoteIndex(prev => 
                    prev === 0 ? quotes.length - 1 : prev - 1
                  );
                  setIsVisible(true);
                }, 500);
              }}
              className="p-2 text-cyan-600 hover:text-cyan-700 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Точечные индикаторы */}
            <div className="flex space-x-3">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => {
                      setCurrentQuoteIndex(index);
                      setIsVisible(true);
                    }, 500);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentQuoteIndex 
                      ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 scale-125' 
                      : 'bg-cyan-200 hover:bg-cyan-300'
                  }`}
                />
              ))}
            </div>

            {/* Стрелка вперед */}
            <button
              onClick={nextQuote}
              className="p-2 text-cyan-600 hover:text-cyan-700 transition-colors duration-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Таймер прогресса */}
          <div className="mt-4">
            <div className="w-32 h-1 bg-cyan-100 rounded-full mx-auto overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-1000 ease-linear"
                style={{ 
                  width: '100%',
                  animation: 'progress 5s linear infinite'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Декоративный нижний бордер */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400"></div>

      {/* CSS анимации */}
      <style jsx>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.4; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default QuotesBanner;