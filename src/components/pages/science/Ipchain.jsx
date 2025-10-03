import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Ipchain = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  
  const data = t('science.sections.ipchain', { returnObjects: true });

  return (
    <div className="space-y-8">
      {/* Заголовок с анимацией */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl px-8 py-6 text-white shadow-2xl">
          <span className="text-4xl animate-pulse">⛓️</span>
          <div>
            <h2 className="text-3xl font-bold">IPChain</h2>
            <p className="text-purple-100">Блокчейн для интеллектуальной собственности</p>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          {['overview', 'patents', 'blockchain', 'benefits'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {data.tabs[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Контент */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {activeTab === 'overview' && <Overview data={data.overview} />}
        {activeTab === 'patents' && <Patents data={data.patents} />}
        {activeTab === 'blockchain' && <Blockchain data={data.blockchain} />}
        {activeTab === 'benefits' && <Benefits data={data.benefits} />}
      </div>
    </div>
  );
};

const Overview = ({ data }) => (
  <div className="p-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{data.title}</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">{data.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {data.stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="text-2xl font-bold text-purple-600 mb-1">{stat.value}</div>
              <div className="text-gray-700 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
        
        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 font-semibold">
          Подробнее на IPChain
        </button>
      </div>
      
      <div className="bg-gradient-to-br from-purple-400 to-blue-400 rounded-2xl p-8 text-white text-center">
        <div className="text-6xl mb-4">🔗</div>
        <h4 className="text-xl font-bold mb-2">Технология блокчейн</h4>
        <p className="text-purple-100">Надежная защита интеллектуальной собственности</p>
      </div>
    </div>
  </div>
);

const Patents = ({ data }) => (
  <div className="p-8">
    <h3 className="text-2xl font-bold text-gray-800 mb-6">Зарегистрированные патенты</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.items.map((patent, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                {patent.title}
              </h4>
              <p className="text-gray-500 text-sm mt-1">{patent.number}</p>
            </div>
            <span className="text-2xl opacity-60 group-hover:opacity-100">📜</span>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{patent.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
              {patent.status}
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
              {patent.year}
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">📅 {patent.date}</span>
            <button className="text-purple-600 hover:text-purple-700 font-medium">
              Подробнее
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Blockchain = ({ data }) => (
  <div className="p-8">
    <h3 className="text-2xl font-bold text-gray-800 mb-6">Блокчейн-технологии</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 className="font-bold text-gray-800 mb-4">Преимущества технологии</h4>
        <div className="space-y-4">
          {data.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="text-green-500 text-xl mt-1">✓</span>
              <div>
                <div className="font-semibold text-gray-800">{feature.title}</div>
                <div className="text-gray-600 text-sm">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-6 text-white">
        <h4 className="font-bold text-xl mb-4">Хеш-идентификаторы</h4>
        <div className="space-y-3 font-mono text-sm">
          {data.hashes.map((hash, index) => (
            <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3">
              <div className="text-purple-200 text-xs mb-1">{hash.label}</div>
              <div className="truncate">{hash.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Benefits = ({ data }) => (
  <div className="p-8">
    <h3 className="text-2xl font-bold text-gray-800 mb-6">Преимущества IPChain</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((benefit, index) => (
        <div key={index} className="text-center p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 group">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
            {benefit.icon}
          </div>
          <h4 className="font-bold text-gray-800 mb-2">{benefit.title}</h4>
          <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Ipchain;