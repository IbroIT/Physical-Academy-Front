// components/AcademyAbout.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AcademyAbout = () => {
  const { t } = useTranslation();
  const [activeMedia, setActiveMedia] = useState(0);

  const stats = [
    { number: '15+', label: t('academy.about.stats.years'), icon: '📅' },
    { number: '10,000+', label: t('academy.about.stats.graduates'), icon: '🎓' },
    { number: '50+', label: t('academy.about.stats.programs'), icon: '📚' },
    { number: '98%', label: t('academy.about.stats.employment'), icon: '💼' }
  ];

  const mediaItems = [
    {
      type: 'image',
      url: '/api/placeholder/800/500',
      title: t('academy.about.media.campus'),
      description: t('academy.about.media.campusDesc')
    },
    {
      type: 'video',
      url: 'https://example.com/video.mp4',
      title: t('academy.about.media.virtualTour'),
      description: t('academy.about.media.virtualTourDesc')
    },
    {
      type: 'image',
      url: '/api/placeholder/800/500',
      title: t('academy.about.media.labs'),
      description: t('academy.about.media.labsDesc')
    }
  ];

  const features = [
    {
      icon: '🚀',
      title: t('academy.about.features.innovation.title'),
      description: t('academy.about.features.innovation.description')
    },
    {
      icon: '🌍',
      title: t('academy.about.features.global.title'),
      description: t('academy.about.features.global.description')
    },
    {
      icon: '🤝',
      title: t('academy.about.features.community.title'),
      description: t('academy.about.features.community.description')
    }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {t('academy.about.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t('academy.about.subtitle')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-6 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {stat.number}
            </div>
            <div className="text-gray-600 font-medium mt-2 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Main Content */}
        <div className="space-y-6">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              {t('academy.about.content.paragraph1')}
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              {t('academy.about.content.paragraph2')}
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-300 transition-all duration-300">
                <div className="text-2xl flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Gallery */}
        <div>
          <div className="bg-gray-100 rounded-2xl overflow-hidden mb-4">
            <div className="aspect-video bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center">
              {mediaItems[activeMedia].type === 'image' ? (
                <img
                  src={mediaItems[activeMedia].url}
                  alt={mediaItems[activeMedia].title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{mediaItems[activeMedia].title}</h3>
                  <p className="text-gray-600">{mediaItems[activeMedia].description}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Media Navigation */}
          <div className="flex space-x-2">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveMedia(index)}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  activeMedia === index
                    ? 'bg-gradient-to-r from-green-500 to-blue-500'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">
          {t('academy.about.cta.title')}
        </h3>
        <p className="mb-6 opacity-90 text-lg">
          {t('academy.about.cta.description')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-green-600 px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300">
            {t('academy.about.cta.visit')}
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-2xl font-semibold hover:bg-white hover:text-green-600 transition-all duration-300">
            {t('academy.about.cta.contact')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcademyAbout;