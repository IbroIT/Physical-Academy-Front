import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const SocialNetworks = () => {
  const { t } = useTranslation();
  const [activePlatform, setActivePlatform] = useState('all');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredNetwork, setHoveredNetwork] = useState(null);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(0);
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

  // Автопереключение хайлайтов
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHighlight((prev) => (prev + 1) % highlights.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const socialData = t('contact.social', { returnObjects: true });
  const labels = t('contact.social.labels', { returnObjects: true });
  
  // Безопасное получение данных
  const networksData = socialData.networks || [];
  const latestPostsData = socialData.latestPosts || [];
  const highlightsData = socialData.highlights || [];

  const socialNetworks = Array.isArray(networksData) ? networksData : Object.values(networksData);
  const latestPosts = Array.isArray(latestPostsData) ? latestPostsData : Object.values(latestPostsData);
  const highlights = Array.isArray(highlightsData) ? highlightsData : Object.values(highlightsData);

  const platforms = [
    { id: 'all', name: labels.platforms.all, icon: '🌐', color: 'from-blue-500 to-emerald-500' },
    { id: 'news', name: labels.platforms.news, icon: '📰', color: 'from-blue-500 to-blue-600' },
    { id: 'events', name: labels.platforms.events, icon: '🎪', color: 'from-emerald-500 to-emerald-600' },
    { id: 'community', name: labels.platforms.community, icon: '👥', color: 'from-blue-500 to-emerald-500' }
  ];

  const filteredNetworks = activePlatform === 'all' 
    ? socialNetworks
    : socialNetworks.filter(network => network.type === activePlatform);

  const communityStats = [
    { number: '50K+', label: labels.stats.followers, icon: '👥' },
    { number: '1.2M', label: labels.stats.impressions, icon: '👁️' },
    { number: '15K', label: labels.stats.engagement, icon: '💬' },
    { number: '95%', label: labels.stats.satisfaction, icon: '⭐' }
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
    return platform ? platform.color : 'from-blue-500 to-emerald-500';
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Социальные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">📱</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🌐</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">💬</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            🌐
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {socialData.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            {socialData.subtitle}
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Social Networks Grid */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              {/* Platform Filter */}
              <div className="bg-white/5 rounded-3xl p-6 backdrop-blur-lg border border-white/20 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-2xl">🎯</span>
                  {labels.filters.title}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <motion.button
                      key={platform.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActivePlatform(platform.id)}
                      className={`group flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-500 ${
                        activePlatform === platform.id
                          ? `bg-gradient-to-r ${platform.color} text-white shadow-xl`
                          : 'bg-white/10 text-blue-100 border border-white/20 hover:border-emerald-400/50 hover:shadow-lg'
                      } backdrop-blur-sm`}
                    >
                      <span className={`text-xl transition-transform duration-300 ${
                        activePlatform === platform.id ? 'scale-110' : 'group-hover:scale-110'
                      }`}>
                        {platform.icon}
                      </span>
                      <span className="text-lg">{platform.name}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Networks Grid */}
              <div className="space-y-6">
                {filteredNetworks.map((network, index) => (
                  <motion.a
                    key={network.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    href={network.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHoveredNetwork(index)}
                    onMouseLeave={() => setHoveredNetwork(null)}
                    className="block bg-white/5 rounded-3xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden backdrop-blur-sm"
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                          <div className={`text-4xl transition-all duration-500 group-hover:scale-110 ${
                            network.color || 'text-blue-500'
                          }`}>
                            {network.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-xl mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                              {network.name}
                            </h3>
                            <p className="text-blue-200 text-lg">{network.description}</p>
                          </div>
                        </div>
                        <div className={`text-2xl transform transition-all duration-500 ${
                          hoveredNetwork === index ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
                        }`}>
                          →
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-6 text-lg text-blue-300">
                        <span className="flex items-center space-x-2">
                          <span>👥</span>
                          <span>{network.followers}</span>
                        </span>
                        <span className="flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                          <span>{labels.status.active}</span>
                        </span>
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Updates & Community */}
            <div className="space-y-8">
              {/* Latest Posts */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white/5 rounded-3xl p-6 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                    📢
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {labels.latestUpdates}
                  </h3>
                </div>
                <div className="space-y-4">
                  {latestPosts.map((post, index) => (
                    <motion.div 
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 backdrop-blur-sm"
                    >
                      <div className="flex-shrink-0 text-2xl group-hover:scale-110 transition-transform duration-300">
                        {post.platformIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-white text-lg">{post.platform}</span>
                          <span className="text-sm text-blue-300 bg-white/10 px-2 py-1 rounded-full backdrop-blur-sm">{post.time}</span>
                        </div>
                        <p className="text-blue-200 text-lg mb-3 leading-relaxed">{post.content}</p>
                        <div className="flex items-center space-x-6 text-blue-300">
                          <span className="flex items-center space-x-1 hover:text-red-400 transition-colors duration-300 cursor-pointer">
                            <span>❤️</span>
                            <span className="text-sm font-medium">{post.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1 hover:text-emerald-400 transition-colors duration-300 cursor-pointer">
                            <span>🔄</span>
                            <span className="text-sm font-medium">{post.shares}</span>
                          </span>
                          <span className="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-300 cursor-pointer">
                            <span>💬</span>
                            <span className="text-sm font-medium">{post.comments}</span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Community Stats */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 backdrop-blur-lg border border-white/20 shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-8 text-center">
                  {labels.communityStats}
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {communityStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all duration-500 group"
                    >
                      <div className="text-3xl mb-3 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                        {stat.icon}
                      </div>
                      <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                      <div className="text-blue-100 text-lg">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Social Media Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="space-y-8"
          >
            {/* Активный хайлайт */}
            {highlights[activeHighlight] && (
              <motion.div
                key={activeHighlight}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 backdrop-blur-lg border border-white/20 shadow-2xl mb-8"
              >
                <div className="flex flex-col lg:flex-row items-center gap-6">
                  <div className="flex-shrink-0 text-6xl">
                    {highlights[activeHighlight].icon}
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {highlights[activeHighlight].title}
                    </h3>
                    <p className="text-blue-200 text-lg">
                      {highlights[activeHighlight].description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              {labels.highlights.title}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {highlights.map((highlight, index) => (
                <motion.div 
                  key={highlight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-3xl p-8 border border-white/10 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden backdrop-blur-sm"
                  onMouseEnter={() => setActiveHighlight(index)}
                >
                  {/* Background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-500">
                      {highlight.icon}
                    </div>
                    <h4 className="font-bold text-white text-xl mb-4 group-hover:text-emerald-300 transition-colors duration-300">
                      {highlight.title}
                    </h4>
                    <p className="text-blue-200 text-lg mb-6 leading-relaxed">
                      {highlight.description}
                    </p>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                      {highlight.action}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SocialNetworks;