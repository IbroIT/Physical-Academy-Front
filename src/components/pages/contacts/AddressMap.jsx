import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const AddressMap = () => {
  const { t } = useTranslation();
  const [activeTransport, setActiveTransport] = useState('metro');
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [mapView, setMapView] = useState('standard');
  const sectionRef = useRef(null);

  const mapData = t('contact.map', { returnObjects: true }) || {};
  
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const transportTypes = [
    { 
      id: 'metro', 
      name: t('contact.map.transport.metro.title', 'Метро'), 
      icon: '🚇',
      color: 'from-red-500 to-pink-500'
    },
    { 
      id: 'bus', 
      name: t('contact.map.transport.bus.title', 'Автобус'), 
      icon: '🚌',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'car', 
      name: t('contact.map.transport.car.title', 'Автомобиль'), 
      icon: '🚗',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'bike', 
      name: t('contact.map.transport.bike.title', 'Велосипед'), 
      icon: '🚲',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const mapViews = [
    { id: 'standard', name: t('contact.map.views.standard', 'Стандартная'), icon: '🗺️' },
    { id: 'satellite', name: t('contact.map.views.satellite', 'Спутник'), icon: '🛰️' },
    { id: 'terrain', name: t('contact.map.views.terrain', 'Рельеф'), icon: '🏔️' }
  ];

  const getTransportDetails = (type) => {
    const details = transportData[type];
    return Array.isArray(details) ? details : (details ? [details] : []);
  };

  const handleGetDirections = () => {
    const address = encodeURIComponent(mapData.address || '');
    window.open(`https://maps.google.com/?q=${address}`, '_blank');
  };

  const handleSaveLocation = () => {
    // In a real app, this would save to device
    console.log('Save location functionality');
  };

  const handleShareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: t('contact.map.shareTitle', 'Местоположение академии'),
        text: t('contact.map.shareText', 'Посмотрите расположение нашей академии'),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(t('contact.map.linkCopied', 'Ссылка скопирована в буфер обмена'));
    }
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
        
        {/* Картографические символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🗺️</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">📍</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🧭</div>
        <div className="absolute top-2/3 right-1/3 text-5xl opacity-5">🚇</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
          >
            {t('contact.map.title', 'Как нас найти')}
          </motion.h1>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-8 rounded-full"
          ></motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed"
          >
            {t('contact.map.subtitle', 'Адрес академии и способы проезда')}
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Interactive Map */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden">
              {/* Map Header */}
              <div className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 p-6 border-b border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white mr-3">
                      🗺️
                    </span>
                    {t('contact.map.interactiveMap', 'Интерактивная карта')}
                  </h3>
                  
                  {/* Map View Controls */}
                  <div className="flex bg-white/10 rounded-xl p-1 backdrop-blur-sm">
                    {mapViews.map((view) => (
                      <button
                        key={view.id}
                        onClick={() => setMapView(view.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${
                          mapView === view.id
                            ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                            : 'text-blue-200 hover:text-white'
                        }`}
                      >
                        <span className="mr-2">{view.icon}</span>
                        {view.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Container */}
              <div className="aspect-video relative bg-gradient-to-br from-slate-800 to-blue-900/50">
                {/* Interactive Map Elements */}
                <div className="absolute inset-0">
                  {/* Main Building */}
                  <motion.div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative">
                      <div className="w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
                      <div className="absolute top-0 left-0 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                        <span className="text-white text-xs">🏛️</span>
                      </div>
                    </div>
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap backdrop-blur-sm">
                      {t('contact.map.mainBuilding', 'Главный корпус')}
                    </div>
                  </motion.div>

                  {/* Secondary Buildings */}
                  <motion.div 
                    className="absolute top-1/3 left-1/4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white text-xs">🏢</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="absolute bottom-1/3 right-1/4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white text-xs">🏟️</span>
                    </div>
                  </motion.div>

                  {/* Roads */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-600/30"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-600/30"></div>
                </div>
                
                {/* Map Overlay Info */}
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-xl p-4 text-white max-w-xs">
                  <h4 className="font-bold text-lg mb-2">{t('contact.map.currentLocation', 'Текущее местоположение')}</h4>
                  <p className="text-blue-100 text-sm">{mapData.address || t('contact.map.defaultAddress', 'Адрес не указан')}</p>
                </div>
              </div>
              
              {/* Map Actions */}
              <div className="p-6 bg-white/5 border-t border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-lg mb-2">
                      {t('contact.map.readyToVisit', 'Готовы посетить нас?')}
                    </h4>
                    <p className="text-blue-100 text-sm">
                      {t('contact.map.directionsHelp', 'Постройте маршрут или сохраните адрес')}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShareLocation}
                      className="bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-xl font-medium hover:bg-white/20 transition-all duration-300 border border-white/20 flex items-center justify-center text-sm"
                    >
                      <span className="mr-2">📤</span>
                      {t('contact.map.share', 'Поделиться')}
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleGetDirections}
                      className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 shadow-lg flex items-center justify-center text-sm"
                    >
                      <span className="mr-2">🧭</span>
                      {t('contact.map.getDirections', 'Построить маршрут')}
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveLocation}
                className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-blue-400/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">📍</span>
                </div>
                <div className="font-semibold text-white text-lg">
                  {t('contact.map.saveLocation', 'Сохранить адрес')}
                </div>
                <div className="text-blue-200 text-sm mt-2">
                  {t('contact.map.saveHint', 'В избранное')}
                </div>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-green-400/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-xl">🖨️</span>
                </div>
                <div className="font-semibold text-white text-lg">
                  {t('contact.map.printDirections', 'Распечатать схему')}
                </div>
                <div className="text-blue-200 text-sm mt-2">
                  {t('contact.map.printHint', 'PDF версия')}
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Transport Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 p-6 lg:p-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6 flex items-center">
                <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mr-4">
                  🚇
                </span>
                {t('contact.map.howToGetHere', 'Как добраться')}
              </h2>

              {/* Transport Type Selector */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {transportTypes.map((transport) => (
                  <motion.button
                    key={transport.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTransport(transport.id)}
                    className={`p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 flex flex-col items-center ${
                      activeTransport === transport.id
                        ? `bg-gradient-to-r ${transport.color} text-white shadow-2xl scale-105`
                        : 'bg-white/5 text-blue-200 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-2">{transport.icon}</div>
                    <div className="font-medium text-sm">{transport.name}</div>
                  </motion.button>
                ))}
              </div>

              {/* Transport Details */}
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {getTransportDetails(activeTransport).map((detail, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-start p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-xl mr-4 group-hover:scale-110 transition-transform duration-300">
                        {detail.icon || transportTypes.find(t => t.id === activeTransport)?.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-lg mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                          {detail.title}
                        </h4>
                        <p className="text-blue-100 text-base mb-3 leading-relaxed">
                          {detail.description}
                        </p>
                        {detail.duration && (
                          <div className="flex items-center text-blue-200 text-sm">
                            <span className="mr-2">⏱️</span>
                            {detail.duration}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Nearby Facilities */}
            <div className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 p-6 lg:p-8">
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white mr-3">
                  🏪
                </span>
                {t('contact.map.nearbyFacilitiess', 'Поблизости')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {nearbyFacilities.map((facility, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group backdrop-blur-sm"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-lg mr-3 group-hover:scale-110 transition-transform duration-300">
                      {facility.icon || '🏪'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-base group-hover:text-emerald-300 transition-colors duration-300">
                        {facility.name}
                      </div>
                      <div className="text-blue-200 text-sm">{facility.distance}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Campus Map */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 p-6 lg:p-8 mb-12"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8 text-center">
            {t('contact.map.campusLayout', 'Схема кампуса')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {campusBuildings.map((building, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => setSelectedBuilding(selectedBuilding === index ? null : index)}
                className={`text-center p-6 rounded-2xl backdrop-blur-sm border cursor-pointer transition-all duration-300 ${
                  selectedBuilding === index
                    ? 'bg-gradient-to-r from-blue-500/20 to-emerald-500/20 border-emerald-400/50 shadow-2xl'
                    : 'bg-white/5 border-white/10 hover:border-blue-400/30'
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                  {building.icon || '🏛️'}
                </div>
                <h4 className="font-bold text-white text-lg mb-2">{building.name}</h4>
                <p className="text-blue-100 text-sm mb-4">{building.description}</p>
                
                <AnimatePresence>
                  {selectedBuilding === index && building.details && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-emerald-400/30"
                    >
                      <p className="text-blue-200 text-sm leading-relaxed">{building.details}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: '📍',
              title: t('contact.map.visitUs', 'Посетите нас'),
              description: mapData.address || t('contact.map.defaultAddress', 'Адрес не указан'),
              color: 'from-blue-500 to-cyan-500'
            },
            {
              icon: '🕒',
              title: t('contact.map.workingHours', 'Часы работы'),
              description: t('contact.map.hours', 'Пн-Пт: 9:00-18:00'),
              color: 'from-green-500 to-emerald-500'
            },
            {
              icon: '📞',
              title: t('contact.map.contactPhone', 'Телефон'),
              description: t('contact.map.phoneNumber', '+7 (999) 123-45-67'),
              color: 'from-purple-500 to-indigo-500'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl shadow-lg`}>
                {item.icon}
              </div>
              <h4 className="font-bold text-white text-lg mb-3">{item.title}</h4>
              <p className="text-blue-100 text-base">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default AddressMap;