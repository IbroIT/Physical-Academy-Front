// components/ContactInfo.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ContactInfo = () => {
  const { t } = useTranslation();
  const [activeDepartment, setActiveDepartment] = useState(0);
  const [activeInfoTab, setActiveInfoTab] = useState('general');

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
      title: t('contact.info.address.title', 'Адрес'),
      content: contactInfo.address?.text || contactInfo.address || 'ул. Примерная, 123',
      color: 'green',
      description: t('contact.info.address.description', 'Наш главный кампус')
    },
    {
      icon: '📞',
      title: t('contact.info.phone.title', 'Телефоны'),
      content: contactInfo.phones?.numbers || contactInfo.phones || ['+7 (999) 123-45-67'],
      color: 'blue',
      description: t('contact.info.phone.description', 'Свяжитесь с нами')
    },
    {
      icon: '📧',
      title: t('contact.info.email.title', 'Email'),
      content: contactInfo.emails?.addresses || contactInfo.emails || ['info@academy.edu'],
      color: 'purple',
      description: t('contact.info.email.description', 'Напишите нам')
    },
    {
      icon: '🕒',
      title: t('contact.info.hours.title', 'Часы работы'),
      content: contactInfo.hours?.schedule || contactInfo.workingHours || ['Пн-Пт: 9:00-18:00'],
      color: 'orange',
      description: t('contact.info.hours.description', 'Время посещения')
    }
  ];

  const infoTabs = [
    { key: 'general', label: t('contact.info.tabs.general', 'Общая информация'), icon: '🏢' },
    { key: 'transport', label: t('contact.info.tabs.transport', 'Транспорт'), icon: '🚇' },
    { key: 'facilities', label: t('contact.info.tabs.facilities', 'Удобства'), icon: '🅿️' }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'green':
        return { 
          bg: 'bg-green-50', 
          border: 'border-green-200', 
          text: 'text-green-800',
          iconBg: 'bg-green-100',
          iconText: 'text-green-600'
        };
      case 'blue':
        return { 
          bg: 'bg-blue-50', 
          border: 'border-blue-200', 
          text: 'text-blue-800',
          iconBg: 'bg-blue-100',
          iconText: 'text-blue-600'
        };
      case 'purple':
        return { 
          bg: 'bg-purple-50', 
          border: 'border-purple-200', 
          text: 'text-purple-800',
          iconBg: 'bg-purple-100',
          iconText: 'text-purple-600'
        };
      case 'orange':
        return { 
          bg: 'bg-orange-50', 
          border: 'border-orange-200', 
          text: 'text-orange-800',
          iconBg: 'bg-orange-100',
          iconText: 'text-orange-600'
        };
      default:
        return { 
          bg: 'bg-gray-50', 
          border: 'border-gray-200', 
          text: 'text-gray-800',
          iconBg: 'bg-gray-100',
          iconText: 'text-gray-600'
        };
    }
  };

  const getContactItem = (item, color) => {
    const colors = getColorClasses(color);
    
    if (Array.isArray(item)) {
      return (
        <div className="space-y-2">
          {item.map((subItem, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
              {typeof subItem === 'object' ? (
                <>
                  <span className="font-medium text-gray-700">{subItem.label}:</span>
                  <a 
                    href={subItem.number ? `tel:${subItem.number}` : `mailto:${subItem.address}`}
                    className={`${colors.text} hover:underline font-medium`}
                  >
                    {subItem.number || subItem.address}
                  </a>
                </>
              ) : (
                <span className="text-gray-700">{subItem}</span>
              )}
            </div>
          ))}
        </div>
      );
    }
    return <div className="text-gray-700">{item}</div>;
  };

  const additionalInfo = {
    general: [
      { icon: '🏢', title: t('contact.info.general.campus', 'Главный кампус'), description: t('contact.info.general.campusDesc', 'Современное здание с оборудованными аудиториями') },
      { icon: '👥', title: t('contact.info.general.capacity', 'Вместимость'), description: t('contact.info.general.capacityDesc', 'Более 2000 студентов') },
      { icon: '🌐', title: t('contact.info.general.wifi', 'Wi-Fi'), description: t('contact.info.general.wifiDesc', 'Бесплатный Wi-Fi на всей территории') }
    ],
    transport: [
      { icon: '🚇', title: t('contact.info.transport.metro', 'Метро'), description: t('contact.info.transport.metroDesc', 'Станция "Центральная", 5 минут пешком') },
      { icon: '🚌', title: t('contact.info.transport.bus', 'Автобус'), description: t('contact.info.transport.busDesc', 'Остановка прямо у входа') },
      { icon: '🚗', title: t('contact.info.transport.parking', 'Парковка'), description: t('contact.info.transport.parkingDesc', 'Бесплатная парковка для студентов') }
    ],
    facilities: [
      { icon: '🍽️', title: t('contact.info.facilities.cafe', 'Кафе'), description: t('contact.info.facilities.cafeDesc', 'Студенческое кафе с горячим питанием') },
      { icon: '📚', title: t('contact.info.facilities.library', 'Библиотека'), description: t('contact.info.facilities.libraryDesc', 'Библиотека открыта до 20:00') },
      { icon: '💻', title: t('contact.info.facilities.computer', 'Компьютерные классы'), description: t('contact.info.facilities.computerDesc', '24/7 доступ к компьютерным классам') }
    ]
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('contact.info.title', 'Контактная информация')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('contact.info.subtitle', 'Свяжитесь с нами удобным для вас способом')}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
            <div className="text-blue-800 text-sm font-medium">Поддержка</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
            <div className="text-2xl font-bold text-green-600 mb-1">15+</div>
            <div className="text-green-800 text-sm font-medium">Отделов</div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">5min</div>
            <div className="text-blue-800 text-sm font-medium">Среднее время ответа</div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
            <div className="text-2xl font-bold text-gray-600 mb-1">100%</div>
            <div className="text-gray-800 text-sm font-medium">Довольных клиентов</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Cards */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {contactCards.map((card, index) => {
                const colors = getColorClasses(card.color);
                
                return (
                  <div
                    key={index}
                    className={`bg-white rounded-2xl border ${colors.border} p-6 hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 ${colors.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-xl ${colors.iconText}`}>{card.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
                        <p className="text-sm text-gray-600">{card.description}</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      {getContactItem(card.content, card.color)}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Information Tabs */}
            <div className="mt-8 bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {infoTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveInfoTab(tab.key)}
                      className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors flex-shrink-0 ${
                        activeInfoTab === tab.key
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-4">
                  {additionalInfo[activeInfoTab]?.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-lg">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Departments */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-green-600 text-lg">🏢</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t('contact.departments.title', 'Отделы и службы')}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {t('contact.departments.subtitle', 'Свяжитесь с нужным отделом')}
                  </p>
                </div>
              </div>

              {/* Department Navigation */}
              <div className="flex flex-col gap-2 mb-6">
                {departments.map((dept, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveDepartment(index)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-left ${
                      activeDepartment === index
                        ? 'bg-blue-50 border border-blue-200'
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activeDepartment === index ? 'bg-blue-100' : 'bg-gray-200'
                    }`}>
                      <span className={activeDepartment === index ? 'text-blue-600' : 'text-gray-600'}>
                        {dept.icon || '📞'}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 flex-1">{dept.name}</span>
                    <svg 
                      className={`w-4 h-4 transform transition-transform ${
                        activeDepartment === index ? 'rotate-90 text-blue-600' : 'text-gray-400'
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Department Details */}
              {departments[activeDepartment] && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">
                    {departments[activeDepartment].name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {departments[activeDepartment].description}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-sm">👤</span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">{t('contact.departments.contactPerson', 'Контактное лицо')}</div>
                        <div className="font-medium text-gray-900">{departments[activeDepartment].contactPerson}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-sm">📞</span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">{t('contact.departments.phone', 'Телефон')}</div>
                        <a 
                          href={`tel:${departments[activeDepartment].phone}`}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {departments[activeDepartment].phone}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 text-sm">📧</span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">{t('contact.departments.email', 'Email')}</div>
                        <a 
                          href={`mailto:${departments[activeDepartment].email}`}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors"
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
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;