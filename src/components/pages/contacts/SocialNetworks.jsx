// components/SocialNetworks.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const SocialNetworks = () => {
  const { t } = useTranslation();
  const [activePlatform, setActivePlatform] = useState('all');

  const socialData = t('contact.social', { returnObjects: true });
  
  // Безопасное получение данных
  const networksData = socialData.networks || [];
  const latestPostsData = socialData.latestPosts || [];
  const highlightsData = socialData.highlights || [];

  const socialNetworks = Array.isArray(networksData) ? networksData : Object.values(networksData);
  const latestPosts = Array.isArray(latestPostsData) ? latestPostsData : Object.values(latestPostsData);
  const highlights = Array.isArray(highlightsData) ? highlightsData : Object.values(highlightsData);

  const platforms = [
    { id: 'all', name: t('contact.social.allPlatforms'), icon: '🌐' },
    { id: 'news', name: t('contact.social.news'), icon: '📰' },
    { id: 'events', name: t('contact.social.events'), icon: '🎪' },
    { id: 'community', name: t('contact.social.community'), icon: '👥' }
  ];

  const filteredNetworks = activePlatform === 'all' 
    ? socialNetworks
    : socialNetworks.filter(network => network.type === activePlatform);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {t('contact.social.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('contact.social.subtitle')}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Social Networks Grid */}
        <div>
          <div className="flex space-x-4 mb-6 overflow-x-auto pb-2">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => setActivePlatform(platform.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2 ${
                  activePlatform === platform.id
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{platform.icon}</span>
                <span>{platform.name}</span>
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {filteredNetworks.map((network, index) => (
              <a
                key={index}
                href={network.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`text-3xl transition-transform duration-300 group-hover:scale-110 ${network.color || 'text-blue-500'}`}>
                      {network.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{network.name}</h3>
                      <p className="text-gray-600 text-sm">{network.description}</p>
                    </div>
                  </div>
                  <div className="text-2xl opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    →
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                  <span>👥 {network.followers}</span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    {t('contact.social.active')}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Latest Updates & Community */}
        <div className="space-y-6">
          {/* Latest Posts */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">📢</span>
              {t('contact.social.latestUpdates')}
            </h3>
            <div className="space-y-4">
              {latestPosts.map((post, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300">
                  <div className="flex-shrink-0 text-2xl">{post.platformIcon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">{post.platform}</span>
                      <span className="text-xs text-gray-500">{post.time}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{post.content}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>❤️ {post.likes}</span>
                      <span>🔄 {post.shares}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white">
            <h3 className="text-xl font-bold mb-4 text-center">
              {t('contact.social.communityStats')}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm opacity-90">{t('contact.social.followers')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">1.2M</div>
                <div className="text-sm opacity-90">{t('contact.social.impressions')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">15K</div>
                <div className="text-sm opacity-90">{t('contact.social.engagement')}</div>
              </div>
              <div>
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm opacity-90">{t('contact.social.satisfaction')}</div>
              </div>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-3">📬</span>
              {t('contact.social.newsletter.title')}
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              {t('contact.social.newsletter.description')}
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder={t('contact.social.newsletter.placeholder')}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                {t('contact.social.newsletter.subscribe')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Highlights */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {t('contact.social.highlights')}
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {highlights.map((highlight, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-xl transition-all duration-300 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {highlight.icon}
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{highlight.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{highlight.description}</p>
              <button className="bg-green-500 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors">
                {highlight.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialNetworks;