// components/ContactInfo.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ContactInfo = () => {
  const { t } = useTranslation();
  const [activeDepartment, setActiveDepartment] = useState(0);

  // Получаем данные как объекты и преобразуем в массивы если нужно
  const contactInfo = t('contact.info', { returnObjects: true });
  const departmentsData = t('contact.departments.list', { returnObjects: true });
  
  // Преобразуем departments в массив, если это объект
  const departments = Array.isArray(departmentsData) 
    ? departmentsData 
    : Object.values(departmentsData);

  const contactCards = [
    {
      icon: '📍',
      title: t('contact.info.address.title'),
      content: contactInfo.address?.text || contactInfo.address,
      color: 'from-green-500 to-green-600',
      bgColor: 'green'
    },
    {
      icon: '📞',
      title: t('contact.info.phone.title'),
      content: contactInfo.phones?.numbers || contactInfo.phones || [],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'blue'
    },
    {
      icon: '📧',
      title: t('contact.info.email.title'),
      content: contactInfo.emails?.addresses || contactInfo.emails || [],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'purple'
    },
    {
      icon: '🕒',
      title: t('contact.info.hours.title'),
      content: contactInfo.hours?.schedule || contactInfo.workingHours || [],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'orange'
    }
  ];

  const getContactItem = (item, index) => {
    if (Array.isArray(item)) {
      return item.map((subItem, idx) => (
        <div key={idx} className="flex items-center justify-between py-2 border-b border-white/20 last:border-b-0">
          {subItem.label && (
            <>
              <span className="font-medium">{subItem.label}:</span>
              <a 
                href={subItem.number ? `tel:${subItem.number}` : `mailto:${subItem.address}`}
                className="hover:underline"
              >
                {subItem.number || subItem.address}
              </a>
            </>
          )}
          {!subItem.label && <span>{subItem}</span>}
        </div>
      ));
    }
    return <div className="text-center">{item}</div>;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {t('contact.info.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('contact.info.subtitle')}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {contactCards.map((card, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.color} text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
            >
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="text-lg font-semibold mb-4">{card.title}</h3>
              <div className="text-sm opacity-90 space-y-1">
                {getContactItem(card.content)}
              </div>
            </div>
          ))}
        </div>

        {/* Departments */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="text-3xl text-green-600 mr-4">🏢</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {t('contact.departments.title')}
              </h2>
              <p className="text-gray-600">
                {t('contact.departments.subtitle')}
              </p>
            </div>
          </div>

          {/* Department Navigation */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
            {departments.map((dept, index) => (
              <button
                key={index}
                onClick={() => setActiveDepartment(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl transition-all duration-300 ${
                  activeDepartment === index
                    ? 'bg-green-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>

          {/* Department Details */}
          {departments[activeDepartment] && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {departments[activeDepartment].name}
              </h3>
              <p className="text-gray-600 mb-4">
                {departments[activeDepartment].description}
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600">👤</span>
                  </span>
                  <div>
                    <div className="text-sm text-gray-500">{t('contact.departments.contactPerson')}</div>
                    <div className="font-semibold text-gray-800">{departments[activeDepartment].contactPerson}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-600">📞</span>
                  </span>
                  <div>
                    <div className="text-sm text-gray-500">{t('contact.departments.phone')}</div>
                    <a 
                      href={`tel:${departments[activeDepartment].phone}`}
                      className="font-semibold text-gray-800 hover:text-green-600 transition-colors"
                    >
                      {departments[activeDepartment].phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600">📧</span>
                  </span>
                  <div>
                    <div className="text-sm text-gray-500">{t('contact.departments.email')}</div>
                    <a 
                      href={`mailto:${departments[activeDepartment].email}`}
                      className="font-semibold text-gray-800 hover:text-green-600 transition-colors"
                    >
                      {departments[activeDepartment].email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-lg transition-all duration-300">
          <div className="text-3xl mb-4">🚇</div>
          <h3 className="font-semibold text-gray-800 mb-2">{t('contact.info.transport.title')}</h3>
          <p className="text-gray-600 text-sm">{t('contact.info.transport.description')}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-lg transition-all duration-300">
          <div className="text-3xl mb-4">🅿️</div>
          <h3 className="font-semibold text-gray-800 mb-2">{t('contact.info.parking.title')}</h3>
          <p className="text-gray-600 text-sm">{t('contact.info.parking.description')}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-lg transition-all duration-300">
          <div className="text-3xl mb-4">♿</div>
          <h3 className="font-semibold text-gray-800 mb-2">{t('contact.info.accessibility.title')}</h3>
          <p className="text-gray-600 text-sm">{t('contact.info.accessibility.description')}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;