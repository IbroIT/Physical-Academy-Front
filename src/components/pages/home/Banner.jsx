import { useState, useEffect } from 'react';
import axios from 'axios';
import { getImageUrl } from '../../../utils/imageUtils';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загрузка слайдов с бэкенда
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axios.get('https://physical-academy-backend-3dccb860f75a.herokuapp.com/api/banner/slides/');
        if (response.data.success) {
          setSlides(response.data.slides);
        }
      } catch (err) {
        setError('Ошибка загрузки слайдов');
        console.error('Error fetching slides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Автоматическая смена слайдов
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Переход к конкретному слайду
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Переход к следующему слайду
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Переход к предыдущему слайду
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (loading) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="text-green-600">Загрузка баннера...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center">
        <div className="text-gray-600">Нет доступных слайдов</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Слайды */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={getImageUrl(slide.image_url)}
              alt={slide.alt_text || slide.title}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Кнопки навигации */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-green-600 p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
        aria-label="Предыдущий слайд"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-green-600 p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
        aria-label="Следующий слайд"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Индикаторы слайдов */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white scale-125' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;