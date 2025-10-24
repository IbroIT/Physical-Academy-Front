import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const AddressMap = () => {
  const { t } = useTranslation();
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const mapInitializedRef = useRef(false);

  const mapData = t('contact.map', { returnObjects: true }) || {};
  
  // Безопасное получение данных
  const campusBuildingsData = mapData.campusBuildings || [];

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

  // Корректные координаты для улицы Жукеева-Пудовкина 114, Бишкек
  const academyLocation = {
    lat: 42.8539,
    lng: 74.5829,
    address: 'ул. Жукеева-Пудовкина 114, Бишкек, Кыргызстан'
  };

  const handleGetDirections = () => {
    const address = encodeURIComponent(academyLocation.address);
    window.open(`https://maps.google.com/?q=${address}`, '_blank');
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

  // Исправленная функция для получения корректного iframe src
  const getMapSrc = () => {
    const { lat, lng, address } = academyLocation;
    // Корректный формат для Google Maps Embed API
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(address)}&center=${lat},${lng}&zoom=16&language=ru`;
  };

  // Альтернативный вариант - использовать поиск по адресу
  const getMapSrcAlternative = () => {
    const { address } = academyLocation;
    return `https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(address)}&zoom=16&language=ru`;
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

        <div className="grid grid-cols-1 gap-8 mb-12">
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
                    {t('contact.map.interactiveMap', 'Наше местоположение')}
                  </h3>
                </div>
              </div>
              
              {/* Real Map Container */}
              <div className="aspect-video relative bg-gradient-to-br from-slate-800 to-blue-900/50 rounded-lg overflow-hidden">
                {/* Google Maps Iframe */}
                <iframe
                  src={getMapSrc()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Местоположение академии на карте"
                  className="rounded-lg"
                ></iframe>
                
                {/* Map Overlay Info */}
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm rounded-xl p-4 text-white max-w-xs border border-white/20">
                  <h4 className="font-bold text-lg mb-2 flex items-center">
                    <span className="text-red-400 mr-2">📍</span>
                    {t('contact.map.currentLocation', 'Наша академия')}
                  </h4>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    {t('contact.map.address')}
                    <br/>
                    {t('contact.map.bishkekKyrgyzstan')}
                  </p>
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
                      {t('contact.map.directionsHelp', 'Постройте маршрут или поделитесь местоположением')}
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
            {t('contact.map.campusLayout', 'Инфраструктура кампуса')}
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
              description: academyLocation.address,
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
              description: t('contact.map.phoneNumber', '+996 (312) 54-19-41'),
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