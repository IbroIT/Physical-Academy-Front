// components/AddressMap.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AddressMap = () => {
  const { t } = useTranslation();
  const [activeTransport, setActiveTransport] = useState('metro');
  const [selectedBuilding, setSelectedBuilding] = useState(null);

  const mapData = t('contact.map', { returnObjects: true });
  
  // Безопасное получение данных
  const transportData = mapData.transport || {};
  const nearbyFacilitiesData = mapData.nearbyFacilities || [];
  const campusBuildingsData = mapData.campusBuildings || [];

  const nearbyFacilities = Array.isArray(nearbyFacilitiesData) 
    ? nearbyFacilitiesData 
    : Object.values(nearbyFacilitiesData);
  
  const campusBuildings = Array.isArray(campusBuildingsData)
    ? campusBuildingsData
    : Object.values(campusBuildingsData);

  const transportTypes = [
    { 
      id: 'metro', 
      name: t('contact.map.transport.metro.title', 'Метро'), 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      ) 
    },
    { 
      id: 'bus', 
      name: t('contact.map.transport.bus.title', 'Автобус'), 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ) 
    },
    { 
      id: 'car', 
      name: t('contact.map.transport.car.title', 'Автомобиль'), 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) 
    },
    { 
      id: 'bike', 
      name: t('contact.map.transport.bike.title', 'Велосипед'), 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ) 
    }
  ];

  const getTransportDetails = (type) => {
    const details = transportData[type];
    return Array.isArray(details) ? details : (details ? [details] : []);
  };

  const handleGetDirections = () => {
    // In a real app, this would open the native maps app
    const address = encodeURIComponent(mapData.address || '');
    window.open(`https://maps.google.com/?q=${address}`, '_blank');
  };

  const handleSaveLocation = () => {
    // In a real app, this would save to device
    console.log('Save location functionality');
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('contact.map.title', 'Как нас найти')}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('contact.map.subtitle', 'Адрес академии и способы проезда')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Interactive Map */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Map Header */}
              <div className="bg-blue-600 text-white p-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {t('contact.map.interactiveMap', 'Интерактивная карта')}
                </h3>
              </div>

              {/* Map Container */}
              <div className="aspect-video relative bg-gray-100">
                {/* Map Placeholder with Interactive Elements */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    <p className="text-lg font-medium mb-2">{t('contact.map.mapPlaceholder', 'Карта местоположения')}</p>
                    <p className="text-sm">{mapData.address}</p>
                  </div>
                </div>
                
                {/* Interactive Markers */}
                <div className="absolute top-1/4 left-1/4">
                  <div className="relative">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute top-0 left-0 w-4 h-4 bg-red-600 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-1/3 right-1/3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Map Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {t('contact.map.currentLocation', 'Текущее местоположение')}
                    </h4>
                    <p className="text-gray-600 text-sm">{mapData.address}</p>
                  </div>
                  <button 
                    onClick={handleGetDirections}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 text-sm flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {t('contact.map.getDirections', 'Построить маршрут')}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={handleSaveLocation}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-all duration-200 group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <div className="font-semibold text-gray-900 text-sm">
                  {t('contact.map.saveLocation', 'Сохранить адрес')}
                </div>
              </button>
              <button className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-all duration-200 group">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </div>
                <div className="font-semibold text-gray-900 text-sm">
                  {t('contact.map.printDirections', 'Распечатать схему')}
                </div>
              </button>
            </div>
          </div>

          {/* Transport Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('contact.map.howToGetHere', 'Как добраться')}
              </h2>

              {/* Transport Type Selector */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
                {transportTypes.map((transport) => (
                  <button
                    key={transport.id}
                    onClick={() => setActiveTransport(transport.id)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex flex-col items-center ${
                      activeTransport === transport.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className={`mb-1 ${activeTransport === transport.id ? 'text-blue-600' : 'text-gray-500'}`}>
                      {transport.icon}
                    </div>
                    <div>{transport.name}</div>
                  </button>
                ))}
              </div>

              {/* Transport Details */}
              <div className="space-y-4">
                {getTransportDetails(activeTransport).map((detail, index) => (
                  <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-3">
                      {detail.icon && (
                        <span className="text-sm">{detail.icon}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">{detail.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{detail.description}</p>
                      {detail.duration && (
                        <div className="flex items-center text-xs text-gray-500">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {detail.duration}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Facilities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('contact.map.nearbyFacilities', 'Поблизости')}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {nearbyFacilities.map((facility, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-200">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-3">
                      {facility.icon && (
                        <span className="text-sm">{facility.icon}</span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{facility.name}</div>
                      <div className="text-xs text-gray-500">{facility.distance}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Campus Map */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {t('contact.map.campusLayout', 'Схема кампуса')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {campusBuildings.map((building, index) => (
              <div 
                key={index}
                onClick={() => setSelectedBuilding(selectedBuilding === index ? null : index)}
                className={`text-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  selectedBuilding === index
                    ? 'bg-blue-50 border-blue-300 shadow-sm'
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 text-blue-600">
                  {building.icon && (
                    <span className="text-xl">{building.icon}</span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{building.name}</h4>
                <p className="text-gray-600 text-xs">{building.description}</p>
                
                {selectedBuilding === index && building.details && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-xs text-gray-600">{building.details}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{t('contact.map.visitUs', 'Посетите нас')}</h4>
            <p className="text-gray-600 text-sm">{mapData.address}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 text-green-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{t('contact.map.workingHours', 'Часы работы')}</h4>
            <p className="text-gray-600 text-sm">{t('contact.map.hours', 'Пн-Пт: 9:00-18:00')}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 text-blue-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{t('contact.map.contactPhone', 'Телефон')}</h4>
            <p className="text-gray-600 text-sm">{t('contact.map.phoneNumber', '+7 (999) 123-45-67')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressMap;