import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const ContactInfo = () => {
  const { t } = useTranslation();
  const [activeDepartment, setActiveDepartment] = useState(0);
  const [activeInfoTab, setActiveInfoTab] = useState('general');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const contactInfo = t('contact.info', { returnObjects: true });
  const departmentsData = t('contact.departments.list', { returnObjects: true });
  
  const departments = Array.isArray(departmentsData) 
    ? departmentsData 
    : Object.values(departmentsData);

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

  const contactCards = [
    {
      icon: '📍',
      title: t('contact.info.address.title', 'Адрес'),
      content: contactInfo.address?.text || contactInfo.address || 'ул. Спортивная, 123',
      color: 'emerald',
      description: t('contact.info.address.description', 'Главный кампус академии')
    },
    {
      icon: '📞',
      title: t('contact.info.phone.title', 'Телефоны'),
      content: contactInfo.phones?.numbers || contactInfo.phones || ['+7 (999) 123-45-67'],
      color: 'blue',
      description: t('contact.info.phone.description', 'Круглосуточная поддержка')
    },
    {
      icon: '📧',
      title: t('contact.info.email.title', 'Email'),
      content: contactInfo.emails?.addresses || contactInfo.emails || ['info@sports-academy.edu'],
      color: 'cyan',
      description: t('contact.info.email.description', 'Быстрый ответ в течение 2 часов')
    },
    {
      icon: '🕒',
      title: t('contact.info.hours.title', 'Часы работы'),
      content: contactInfo.hours?.schedule || contactInfo.workingHours || ['Пн-Пт: 8:00-22:00', 'Сб-Вс: 9:00-20:00'],
      color: 'orange',
      description: t('contact.info.hours.description', 'Тренажерные залы 24/7')
    }
  ];

  const infoTabs = [
    { key: 'general', label: t('contact.info.tabs.general', 'Общая информация'), icon: '🏢' },
    { key: 'transport', label: t('contact.info.tabs.transport', 'Транспорт'), icon: '🚇' },
    { key: 'facilities', label: t('contact.info.tabs.facilities', 'Спорт объекты'), icon: '⚽' }
  ];

  const getContactItem = (item, color) => {
    if (Array.isArray(item)) {
      return (
        <div className="space-y-3">
          {item.map((subItem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0"
            >
              {typeof subItem === 'object' ? (
                <>
                  <span className="font-medium text-blue-100">{subItem.label}:</span>
                  <a 
                    href={subItem.number ? `tel:${subItem.number}` : `mailto:${subItem.address}`}
                    className="text-emerald-300 hover:text-emerald-200 hover:underline font-medium transition-colors"
                  >
                    {subItem.number || subItem.address}
                  </a>
                </>
              ) : (
                <span className="text-blue-100">{subItem}</span>
              )}
            </motion.div>
          ))}
        </div>
      );
    }
    return <div className="text-blue-100">{item}</div>;
  };

  const additionalInfo = {
    general: [
      { 
        icon: '🏢', 
        title: t('contact.info.general.campus', 'Спортивный кампус'), 
        description: t('contact.info.general.campusDesc', 'Современный комплекс с 20+ спортивными залами') 
      },
      { 
        icon: '👥', 
        title: t('contact.info.general.capacity', 'Вместимость'), 
        description: t('contact.info.general.capacityDesc', 'Более 3000 студентов и спортсменов') 
      },
      { 
        icon: '🌐', 
        title: t('contact.info.general.wifi', 'Wi-Fi Pro'), 
        description: t('contact.info.general.wifiDesc', 'Высокоскоростной Wi-Fi по всему кампусу') 
      }
    ],
    transport: [
      { 
        icon: '🚇', 
        title: t('contact.info.transport.metro', 'Метро'), 
        description: t('contact.info.transport.metroDesc', 'Станция "Спортивная", 3 минуты пешком') 
      },
      { 
        icon: '🚌', 
        title: t('contact.info.transport.bus', 'Автобусы'), 
        description: t('contact.info.transport.busDesc', '10 маршрутов до академии') 
      },
      { 
        icon: '🚗', 
        title: t('contact.info.transport.parking', 'Парковка'), 
        description: t('contact.info.transport.parkingDesc', 'Бесплатная парковка на 500 мест') 
      }
    ],
    facilities: [
      { 
        icon: '🏊‍♂️', 
        title: t('contact.info.facilities.pool', 'Бассейн'), 
        description: t('contact.info.facilities.poolDesc', 'Олимпийский бассейн 50м') 
      },
      { 
        icon: '🏃‍♂️', 
        title: t('contact.info.facilities.track', 'Беговые дорожки'), 
        description: t('contact.info.facilities.trackDesc', '8 профессиональных дорожек') 
      },
      { 
        icon: '💪', 
        title: t('contact.info.facilities.gym', 'Тренажерные залы'), 
        description: t('contact.info.facilities.gymDesc', '5 залов с современным оборудованием') 
      }
    ]
  };

  const stats = [
    { value: '24/7', label: 'Поддержка', icon: '🛡️' },
    { value: '15+', label: 'Спорт отделов', icon: '🏃‍♂️' },
    { value: '5min', label: 'Среднее время ответа', icon: '⚡' },
    { value: '100%', label: 'Довольных спортсменов', icon: '🏆' }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-8 lg:py-16 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Спортивные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏅</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">⚽</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🏃‍♀️</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            📞
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('contact.info.title', 'Контактная информация')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            {t('contact.info.subtitle', 'Свяжитесь с нами - мы всегда на связи для будущих чемпионов!')}
          </p>
        </motion.div>

        {/* Статистика */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
            >
              <div className="text-2xl mb-3 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                {stat.value}
              </div>
              <div className="text-blue-200 text-sm lg:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Левая колонка - Контактные карточки */}
          <div className="lg:col-span-2 space-y-8">
            {/* Контактные карточки */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {contactCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white/5 rounded-2xl p-6 backdrop-blur-lg border border-white/20 hover:border-emerald-400/50 shadow-2xl transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-xl">{card.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-blue-200 text-sm">{card.description}</p>
                    </div>
                  </div>
                  <div className="text-sm">
                    {getContactItem(card.content, card.color)}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Дополнительная информация */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/5 rounded-2xl backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden"
            >
              {/* Табы */}
              <div className="border-b border-white/10">
                <div className="flex overflow-x-auto">
                  {infoTabs.map((tab) => (
                    <motion.button
                      key={tab.key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveInfoTab(tab.key)}
                      className={`flex items-center gap-3 px-6 py-4 text-sm font-medium border-b-2 transition-all duration-300 flex-shrink-0 ${
                        activeInfoTab === tab.key
                          ? 'border-emerald-400 text-emerald-400 bg-emerald-400/10'
                          : 'border-transparent text-blue-200 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="text-lg">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Контент табов */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeInfoTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid gap-4"
                  >
                    {additionalInfo[activeInfoTab]?.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-lg">{item.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-blue-200 text-sm">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Правая колонка - Отделы */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/5 rounded-2xl backdrop-blur-lg border border-white/20 shadow-2xl p-6 sticky top-6">
              {/* Заголовок отделов */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🏢</span>
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-white">
                    {t('contact.departments.title', 'Отделы академии')}
                  </h2>
                  <p className="text-blue-200 text-sm">
                    {t('contact.departments.subtitle', 'Свяжитесь с нужным отделом')}
                  </p>
                </div>
              </div>

              {/* Навигация по отделам */}
              <div className="flex flex-col gap-3 mb-6">
                {departments.map((dept, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveDepartment(index)}
                    className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 text-left backdrop-blur-sm border ${
                      activeDepartment === index
                        ? 'bg-emerald-500/20 border-emerald-400/50 shadow-lg'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      activeDepartment === index 
                        ? 'bg-emerald-400 shadow-lg' 
                        : 'bg-white/10'
                    }`}>
                      <span className={activeDepartment === index ? 'text-white' : 'text-blue-200'}>
                        {dept.icon || '👥'}
                      </span>
                    </div>
                    <span className="font-medium text-white flex-1 text-sm lg:text-base">
                      {dept.name}
                    </span>
                    <motion.div
                      animate={{ rotate: activeDepartment === index ? 90 : 0 }}
                      className="text-blue-200"
                    >
                      ▶
                    </motion.div>
                  </motion.button>
                ))}
              </div>

              {/* Детали отдела */}
              <AnimatePresence mode="wait">
                {departments[activeDepartment] && (
                  <motion.div
                    key={activeDepartment}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-xl p-5 backdrop-blur-sm border border-white/20"
                  >
                    <h3 className="font-bold text-white text-lg mb-3">
                      {departments[activeDepartment].name}
                    </h3>
                    <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                      {departments[activeDepartment].description}
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                          <span className="text-emerald-400 text-sm">👤</span>
                        </div>
                        <div>
                          <div className="text-xs text-blue-300">{t('contact.departments.contactPerson', 'Контактное лицо')}</div>
                          <div className="font-medium text-white">{departments[activeDepartment].contactPerson}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                          <span className="text-emerald-400 text-sm">📞</span>
                        </div>
                        <div>
                          <div className="text-xs text-blue-300">{t('contact.departments.phone', 'Телефон')}</div>
                          <a 
                            href={`tel:${departments[activeDepartment].phone}`}
                            className="font-medium text-white hover:text-emerald-300 transition-colors"
                          >
                            {departments[activeDepartment].phone}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                          <span className="text-emerald-400 text-sm">📧</span>
                        </div>
                        <div>
                          <div className="text-xs text-blue-300">{t('contact.departments.email', 'Email')}</div>
                          <a 
                            href={`mailto:${departments[activeDepartment].email}`}
                            className="font-medium text-white hover:text-emerald-300 transition-colors break-all"
                          >
                            {departments[activeDepartment].email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;