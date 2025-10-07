// components/AcademyAbout.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const AcademyAbout = () => {
  const { t } = useTranslation();
  const [activeMedia, setActiveMedia] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startCounters();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMedia((prev) => (prev + 1) % mediaItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const startCounters = () => {
    const targetValues = [15, 10000, 50, 98];
    const duration = 2000;
    const steps = 60;
    const stepValues = targetValues.map(target => target / steps);

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      setCounterValues(prev => 
        prev.map((value, index) => {
          if (currentStep <= steps) {
            return Math.min(value + stepValues[index], targetValues[index]);
          }
          return value;
        })
      );

      if (currentStep >= steps) {
        clearInterval(counterInterval);
      }
    }, duration / steps);
  };

  const stats = [
    { 
      number: `${Math.round(counterValues[0])}+`, 
      label: t('academy.about.stats.years'), 
      icon: '🏛️',
      suffix: '+'
    },
    { 
      number: `${Math.round(counterValues[1]).toLocaleString()}+`, 
      label: t('academy.about.stats.graduates'), 
      icon: '🎓',
      suffix: '+'
    },
    { 
      number: `${Math.round(counterValues[2])}+`, 
      label: t('academy.about.stats.programs'), 
      icon: '📚',
      suffix: '+'
    },
    { 
      number: `${Math.round(counterValues[3])}%`, 
      label: t('academy.about.stats.employment'), 
      icon: '💼',
      suffix: '%'
    }
  ];

  const mediaItems = [
    {
      type: 'image',
      url: '/api/placeholder/800/500',
      title: t('academy.about.media.campus'),
      description: t('academy.about.media.campusDesc'),
      thumbnail: '/api/placeholder/100/60'
    },
    {
      type: 'video',
      url: 'https://example.com/video.mp4',
      title: t('academy.about.media.virtualTour'),
      description: t('academy.about.media.virtualTourDesc'),
      thumbnail: '/api/placeholder/100/60'
    },
    {
      type: 'image',
      url: '/api/placeholder/800/500',
      title: t('academy.about.media.labs'),
      description: t('academy.about.media.labsDesc'),
      thumbnail: '/api/placeholder/100/60'
    },
    {
      type: 'image',
      url: '/api/placeholder/800/500',
      title: t('academy.about.media.students'),
      description: t('academy.about.media.studentsDesc'),
      thumbnail: '/api/placeholder/100/60'
    }
  ];

  const features = [
    {
      icon: '⚡',
      title: t('academy.about.features.innovation.title'),
      description: t('academy.about.features.innovation.description'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '🌐',
      title: t('academy.about.features.global.title'),
      description: t('academy.about.features.global.description'),
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '👥',
      title: t('academy.about.features.community.title'),
      description: t('academy.about.features.community.description'),
      color: 'from-blue-500 to-green-500'
    }
  ];

  const nextMedia = () => {
    setActiveMedia((prev) => (prev + 1) % mediaItems.length);
  };

  const prevMedia = () => {
    setActiveMedia((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  return (
    <div ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      {/* Header */}
      <div className={`text-center mb-16 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-blue-600 font-medium text-sm">
            {t('academy.about.badge')}
          </span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          {t('academy.about.title')}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-8"></div>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          {t('academy.about.subtitle')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 transition-all duration-1000 delay-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="text-center group p-8 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2 font-mono">
              {stat.number}
            </div>
            <div className="text-gray-600 font-medium text-lg">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-16 mb-20">
        {/* Main Content */}
        <div className={`space-y-8 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg mb-8 pb-4 border-b border-gray-200">
              {t('academy.about.content.paragraph1')}
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              {t('academy.about.content.paragraph2')}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-start space-x-6 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-500 group"
              >
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-xl mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Gallery */}
        <div className={`transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
        }`}>
          <div className="relative bg-gray-100 rounded-2xl overflow-hidden mb-6 group">
            <div className="aspect-video relative">
              {mediaItems[activeMedia].type === 'image' ? (
                <img
                  src={mediaItems[activeMedia].url}
                  alt={mediaItems[activeMedia].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{mediaItems[activeMedia].title}</h3>
                    <p className="text-gray-600 text-lg">{mediaItems[activeMedia].description}</p>
                  </div>
                </div>
              )}
              
              {/* Navigation Arrows */}
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white hover:text-blue-600 transition-all duration-300 opacity-0 group-hover:opacity-100 shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Media Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {mediaItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveMedia(index)}
                className={`aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                  activeMedia === index
                    ? 'border-blue-500 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-green-400 hover:shadow-md'
                }`}
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2 transition-opacity duration-300 ${
                  activeMedia === index ? 'opacity-100' : 'opacity-0'
                }`}>
                  <span className="text-white text-xs font-medium truncate">{item.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyAbout;