import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Ipchain = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  const data = t('science.sections.ipchain', { returnObjects: true });

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-4 bg-blue-600 rounded-2xl px-6 py-4 text-white shadow-lg">
          <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center">
            <span className="text-2xl">⛓️</span>
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold">{data.title}</h2>
            <p className="text-blue-100 text-sm">{data.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          {Object.keys(data.tabs).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {data.tabs[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Контент */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {activeTab === 'overview' && <Overview data={data.overview} />}
        {activeTab === 'patents' && <Patents data={data.patents} />}
        {activeTab === 'blockchain' && <Blockchain data={data.blockchain} />}
        {activeTab === 'benefits' && <Benefits data={data.benefits} />}
      </div>
    </div>
  );
};

const Overview = ({ data }) => (
  <div className="p-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">{data.title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed text-sm">{data.description}</p>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          {data.stats.map((stat, index) => (
            <div key={index} className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-lg font-bold text-blue-600 mb-1">{stat.value}</div>
              <div className="text-gray-700 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm">
          {data.buttonText}
        </button>
      </div>
      
      <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
          {data.blockchainCard.icon}
        </div>
        <h4 className="text-lg font-bold text-gray-900 mb-2">{data.blockchainCard.title}</h4>
        <p className="text-gray-600 text-sm">{data.blockchainCard.description}</p>
      </div>
    </div>
  </div>
);

const Patents = ({ data }) => (
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-6">{data.title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.items.map((patent, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 group">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                {patent.title}
              </h4>
              <p className="text-gray-500 text-xs mt-1">{patent.number}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm">
              {patent.icon}
            </div>
          </div>
          
          <p className="text-gray-600 text-xs mb-3 leading-relaxed">{patent.description}</p>
          
          <div className="flex flex-wrap gap-1 mb-3">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
              {patent.status}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              {patent.year}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">{patent.dateLabel} {patent.date}</span>
            <button className="text-blue-600 hover:text-blue-700 font-medium">
              {data.buttonText}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Blockchain = ({ data }) => (
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-6">{data.title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h4 className="font-bold text-gray-900 mb-4 text-sm">{data.featuresTitle}</h4>
        <div className="space-y-3">
          {data.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xs mt-0.5 flex-shrink-0">
                ✓
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{feature.title}</div>
                <div className="text-gray-600 text-xs">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-bold text-gray-900 mb-3 text-sm">{data.hashesTitle}</h4>
        <div className="space-y-2 font-mono text-xs">
          {data.hashes.map((hash, index) => (
            <div key={index} className="bg-white rounded px-3 py-2 border border-blue-100">
              <div className="text-blue-600 text-xs mb-1 font-medium">{hash.label}</div>
              <div className="truncate text-gray-900">{hash.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Benefits = ({ data }) => (
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-6">{data.title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {data.items.map((benefit, index) => (
        <div key={index} className="text-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 group">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 text-xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
            {benefit.icon}
          </div>
          <h4 className="font-bold text-gray-900 mb-2 text-sm">{benefit.title}</h4>
          <p className="text-gray-600 text-xs leading-relaxed">{benefit.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Ipchain;