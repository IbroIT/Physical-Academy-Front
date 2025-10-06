import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const StudentsDisabilities = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('support');

  const data = t('students.disabilities', { returnObjects: true });

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {data.title}
        </h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-sm">
          {data.subtitle}
        </p>
      </div>

      {/* Навигация */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          {['support', 'contacts', 'resources'].map((tab) => (
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
      {activeTab === 'support' && <SupportServices data={data.support} />}
      {activeTab === 'contacts' && <Contacts data={data.contacts} />}
      {activeTab === 'resources' && <Resources data={data.resources} />}
    </div>
  );
};

const SupportServices = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {data.map((service, index) => (
      <div 
        key={index}
        className="bg-blue-50 rounded-xl p-4 border border-blue-200 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-start space-x-3 mb-3">
          <div className="w-10 h-10 bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center">
            {service.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-700 mb-1">{service.title}</h3>
            <p className="text-gray-700 text-sm leading-relaxed">{service.description}</p>
          </div>
        </div>
        
        {service.features && (
          <div className="bg-white rounded-lg p-3 border border-blue-100">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">Включает:</h4>
            <ul className="space-y-1">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-center text-gray-600 text-xs">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
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
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((contact, index) => (
        <div 
          key={index}
          className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
              👤
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{contact.name}</h3>
              <p className="text-gray-600 text-xs">{contact.position}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-gray-600 text-sm">
              <span className="w-4 text-center mr-2">📞</span>
              <a href={`tel:${contact.phone}`} className="hover:text-blue-600 transition-colors">
                {contact.phone}
              </a>
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <span className="w-4 text-center mr-2">📧</span>
              <a href={`mailto:${contact.email}`} className="hover:text-blue-600 transition-colors">
                {contact.email}
              </a>
            </div>
            {contact.hours && (
              <div className="flex items-center text-gray-600 text-sm">
                <span className="w-4 text-center mr-2">🕒</span>
                <span>{contact.hours}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
    
    <div className="bg-blue-600 rounded-xl p-4 text-white text-center">
      <h3 className="text-lg font-bold mb-2">Экстренная поддержка</h3>
      <p className="text-blue-100 text-sm mb-3">Круглосуточная психологическая помощь</p>
      <a href="tel:+78002000112" className="text-xl font-bold hover:underline block">
        📞 8-800-2000-112
      </a>
    </div>
  </div>
);

const Resources = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {data.map((resource, index) => (
      <a
        key={index}
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 group"
      >
        <div className="text-center mb-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-xl mx-auto mb-2 group-hover:scale-110 transition-transform duration-200">
            {resource.icon}
          </div>
          <h3 className="font-bold text-gray-900 text-sm mb-1">{resource.name}</h3>
          <p className="text-gray-600 text-xs leading-relaxed">{resource.description}</p>
        </div>
        
        <div className="flex justify-between items-center text-xs">
          <span className="text-blue-600 font-medium">{resource.type}</span>
          <span className="text-gray-500">{resource.format}</span>
        </div>
      </a>
    ))}
  </div>
);

export default StudentsDisabilities;