// components/AddressMap.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AddressMap = () => {
  const { t } = useTranslation();
  const [activeTransport, setActiveTransport] = useState('metro');

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
    { id: 'metro', name: t('contact.map.transport.metro.title'), icon: '🚇' },
    { id: 'bus', name: t('contact.map.transport.bus.title'), icon: '🚌' },
    { id: 'car', name: t('contact.map.transport.car.title'), icon: '🚗' },
    { id: 'bike', name: t('contact.map.transport.bike.title'), icon: '🚲' }
  ];

  const getTransportDetails = (type) => {
    const details = transportData[type];
    return Array.isArray(details) ? details : (details ? [details] : []);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {t('contact.map.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('contact.map.subtitle')}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Interactive Map */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video relative">
              {/* Map Placeholder with Interactive Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-blue-400 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-2xl font-bold mb-2">{t('contact.map.interactiveMap')}</h3>
                  <p className="opacity-90">{mapData.address}</p>
                </div>
                
                {/* Interactive Markers */}
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute top-1/4 left-1/4 w-6 h-6 bg-red-500 rounded-full border-2 border-white"></div>
                
                <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="p-6 bg-white/10 backdrop-blur-sm">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h4 className="font-semibold">{t('contact.map.currentLocation')}</h4>
                  <p className="text-sm opacity-90">{mapData.address}</p>
                </div>
                <button className="bg-white text-green-600 px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                  {t('contact.map.getDirections')}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:border-green-300 hover:shadow-lg transition-all duration-300 group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📱</div>
              <div className="font-semibold text-gray-800 text-sm">{t('contact.map.saveLocation')}</div>
            </button>
            <button className="bg-white border border-gray-200 rounded-2xl p-4 text-center hover:border-green-300 hover:shadow-lg transition-all duration-300 group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">🖨️</div>
              <div className="font-semibold text-gray-800 text-sm">{t('contact.map.printDirections')}</div>
            </button>
          </div>
        </div>

        {/* Transport Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="text-3xl mr-3">🚦</span>
              {t('contact.map.howToGetHere')}
            </h3>

            {/* Transport Type Selector */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {transportTypes.map((transport) => (
                <button
                  key={transport.id}
                  onClick={() => setActiveTransport(transport.id)}
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    activeTransport === transport.id
                      ? 'bg-green-500 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-xl mb-1">{transport.icon}</div>
                  <div className="text-xs font-medium">{transport.name}</div>
                </button>
              ))}
            </div>

            {/* Transport Details */}
            <div className="space-y-4">
              {getTransportDetails(activeTransport).map((detail, index) => (
                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-lg mr-3 mt-1">{detail.icon}</span>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{detail.title}</h4>
                    <p className="text-gray-600 text-sm">{detail.description}</p>
                    {detail.duration && (
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span>⏱️ {detail.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Facilities */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-3">🏪</span>
              {t('contact.map.nearbyFacilities')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {nearbyFacilities.map((facility, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-xl border border-gray-200">
                  <span className="text-xl mr-3">{facility.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{facility.name}</div>
                    <div className="text-xs text-gray-500">{facility.distance}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campus Map */}
      <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {t('contact.map.campusLayout')}
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          {campusBuildings.map((building, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{building.icon}</div>
              <h4 className="font-semibold text-gray-800 mb-1">{building.name}</h4>
              <p className="text-gray-600 text-sm">{building.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddressMap;