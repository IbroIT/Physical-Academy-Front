// components/SocialNetworks.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const SocialNetworks = () => {
  const { t } = useTranslation();
  const [activePlatform, setActivePlatform] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredNetwork, setHoveredNetwork] = useState(null);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const socialData = t('contact.social', { returnObjects: true });
  
  // Безопасное получение данных
  const networksData = socialData.networks || [];
  const latestPostsData = socialData.latestPosts || [];
  const highlightsData = socialData.highlights || [];

  const socialNetworks = Array.isArray(networksData) ? networksData : Object.values(networksData);
  const latestPosts = Array.isArray(latestPostsData) ? latestPostsData : Object.values(latestPostsData);
  const highlights = Array.isArray(highlightsData) ? highlightsData : Object.values(highlightsData);

  const platforms = [
    { id: 'all', name: t('contact.social.allPlatforms'), icon: '🌐', color: 'from-blue-500 to-green-500' },
    { id: 'news', name: t('contact.social.news'), icon: '📰', color: 'from-blue-500 to-blue-600' },
    { id: 'events', name: t('contact.social.events'), icon: '🎪', color: 'from-green-500 to-green-600' },
    { id: 'community', name: t('contact.social.community'), icon: '👥', color: 'from-blue-500 to-green-500' }
  ];

  const filteredNetworks = activePlatform === 'all' 
    ? socialNetworks
    : socialNetworks.filter(network => network.type === activePlatform);

  const communityStats = [
    { number: '50K+', label: t('contact.social.followers'), icon: '👥' },
    { number: '1.2M', label: t('contact.social.impressions'), icon: '👁️' },
    { number: '15K', label: t('contact.social.engagement'), icon: '💬' },
    { number: '95%', label: t('contact.social.satisfaction'), icon: '⭐' }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const getPlatformColor = (platformId) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform ? platform.color : 'from-blue-500 to-green-500';
  };

  return (
    <div ref={sectionRef} className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      {/* Header */}
      <div className={`text-center mb-16 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          <span className="text-blue-600 font-medium text-sm">
            {t('contact.social.badge')}
          </span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
          {t('contact.social.title')}
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-8"></div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          {t('contact.social.subtitle')}
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Social Networks Grid */}
          <div className={`transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            {/* Platform Filter */}
            <div className="flex flex-wrap gap-3 mb-8">
              {platforms.map((platform) => (
                <button
                  key={platform.id}
                  onClick={() => setActivePlatform(platform.id)}
                  className={`group flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-500 transform hover:scale-105 ${
                    activePlatform === platform.id
                      ? `bg-gradient-to-r ${platform.color} text-white shadow-xl scale-105`
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:shadow-lg'
                  }`}
                >
                  <span className={`text-xl transition-transform duration-300 ${
                    activePlatform === platform.id ? 'scale-110' : 'group-hover:scale-110'
                  }`}>
                    {platform.icon}
                  </span>
                  <span className="text-lg">{platform.name}</span>
                </button>
              ))}
            </div>

            {/* Networks Grid */}
            <div className="grid gap-6">
              {filteredNetworks.map((network, index) => (
                <a
                  key={index}
                  href={network.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHoveredNetwork(index)}
                  onMouseLeave={() => setHoveredNetwork(null)}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className={`text-4xl transition-all duration-500 group-hover:scale-110 ${
                          network.color || 'text-blue-500'
                        }`}>
                          {network.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-blue-600 transition-colors duration-300">
                            {network.name}
                          </h3>
                          <p className="text-gray-600 text-lg">{network.description}</p>
                        </div>
                      </div>
                      <div className={`text-2xl transform transition-all duration-500 ${
                        hoveredNetwork === index ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
                      }`}>
                        →
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6 text-lg text-gray-500">
                      <span className="flex items-center space-x-2">
                        <span>👥</span>
                        <span>{network.followers}</span>
                      </span>
                      <span className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <span>{t('contact.social.active')}</span>
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Updates & Community */}
          <div className="space-y-8">
            {/* Latest Posts */}
            <div className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                  📢
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('contact.social.latestUpdates')}
                </h3>
              </div>
              <div className="space-y-4">
                {latestPosts.map((post, index) => (
                  <div 
                    key={index}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                  >
                    <div className="flex-shrink-0 text-2xl group-hover:scale-110 transition-transform duration-300">
                      {post.platformIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-900 text-lg">{post.platform}</span>
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">{post.time}</span>
                      </div>
                      <p className="text-gray-700 text-lg mb-3 leading-relaxed">{post.content}</p>
                      <div className="flex items-center space-x-6 text-gray-500">
                        <span className="flex items-center space-x-1 hover:text-red-500 transition-colors duration-300 cursor-pointer">
                          <span>❤️</span>
                          <span className="text-sm font-medium">{post.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1 hover:text-green-500 transition-colors duration-300 cursor-pointer">
                          <span>🔄</span>
                          <span className="text-sm font-medium">{post.shares}</span>
                        </span>
                        <span className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-300 cursor-pointer">
                          <span>💬</span>
                          <span className="text-sm font-medium">{post.comments}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className={`bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white shadow-xl transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}>
              <h3 className="text-2xl font-bold mb-8 text-center">
                {t('contact.social.communityStats')}
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {communityStats.map((stat, index) => (
                  <div 
                    key={index}
                    className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all duration-500 group"
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.number}</div>
                    <div className="text-white/90 text-lg">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className={`bg-white rounded-2xl p-6 border border-gray-200 shadow-sm transition-all duration-1000 delay-900 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}>
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                  📬
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('contact.social.newsletter.title')}
                </h3>
              </div>
              
              {isSubscribed ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-2xl mb-4 mx-auto">
                    ✓
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">
                    {t('contact.social.newsletter.successTitle')}
                  </h4>
                  <p className="text-gray-600">
                    {t('contact.social.newsletter.successMessage')}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                    {t('contact.social.newsletter.description')}
                  </p>
                  <form onSubmit={handleSubscribe} className="space-y-4">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('contact.social.newsletter.placeholder')}
                        className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-300"
                        required
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                    >
                      <span>{t('contact.social.newsletter.subscribe')}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Social Media Highlights */}
        <div className={`transition-all duration-1000 delay-1100 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('contact.social.highlights')}
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 border border-gray-200 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden"
              >
                {/* Background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">
                    {highlight.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 text-xl mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {highlight.title}
                  </h4>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {highlight.description}
                  </p>
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-blue-700 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    {highlight.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialNetworks;