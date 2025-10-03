import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const StudentsDisabilities = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('support');

  const data = t('students.disabilities', { returnObjects: true });

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {data.title}
        </h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          {data.subtitle}
        </p>
      </div>

      {/* Навигация */}
      <div className="flex justify-center">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          {['support', 'contacts', 'resources'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {data.tabs[tab]}
            </button>
          ))}
        </div>
      </div>

      {/* Контент */}
      {activeTab === 'support' && <SupportServices data={data.support} />}
      {activeTab === 'contacts' && <Contacts data={data.contacts} />}
      {activeTab === 'resources' && <Resources data={data.resources} />}
    </div>
  );
};

const SupportServices = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {data.map((service, index) => (
      <div 
        key={index}
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
      >
        <div className="flex items-start space-x-4 mb-4">
          <div className="text-3xl bg-blue-500 text-white p-3 rounded-xl">
            {service.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-700 mb-2">{service.title}</h3>
            <p className="text-gray-700 leading-relaxed">{service.description}</p>
          </div>
        </div>
        
        {service.features && (
          <div className="bg-white rounded-xl p-4 border border-blue-100">
            <h4 className="font-semibold text-gray-800 mb-2">Включает:</h4>
            <ul className="space-y-1">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-600 text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    ))}
  </div>
);

const Contacts = ({ data }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((contact, index) => (
        <div 
          key={index}
          className="bg-white rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 text-xl">
              👤
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{contact.name}</h3>
              <p className="text-gray-600">{contact.position}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-gray-600">
              <span className="w-5 text-center mr-3">📞</span>
              <a href={`tel:${contact.phone}`} className="hover:text-green-600 transition-colors">
                {contact.phone}
              </a>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-5 text-center mr-3">📧</span>
              <a href={`mailto:${contact.email}`} className="hover:text-green-600 transition-colors">
                {contact.email}
              </a>
            </div>
            {contact.hours && (
              <div className="flex items-center text-gray-600">
                <span className="w-5 text-center mr-3">🕒</span>
                <span>{contact.hours}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
    
    <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white text-center">
      <h3 className="text-xl font-bold mb-2">Экстренная поддержка</h3>
      <p className="opacity-90 mb-4">Круглосуточная психологическая помощь</p>
      <a href="tel:+78002000112" className="text-2xl font-bold hover:underline">
        📞 8-800-2000-112
      </a>
    </div>
  </div>
);

const Resources = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {data.map((resource, index) => (
      <a
        key={index}
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white rounded-2xl p-6 border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
      >
        <div className="text-center mb-4">
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
            {resource.icon}
          </div>
          <h3 className="font-bold text-gray-800 text-lg mb-2">{resource.name}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{resource.description}</p>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-purple-600 font-medium">{resource.type}</span>
          <span className="text-gray-500">{resource.format}</span>
        </div>
      </a>
    ))}
  </div>
);

export default StudentsDisabilities;