import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { getDisabilitiesPageData } from "../../../services/api";
import Loading from "../../common/Loading";

const StudentsDisabilities = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("support");
  const [isVisible, setIsVisible] = useState(false);
  const [activeService, setActiveService] = useState(0);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  // Translation data for UI elements only, not content
  const uiTranslations = t("students.disabilities", { returnObjects: true });

  // Get current language
  const currentLanguage = i18n.language || "ru";

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

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getDisabilitiesPageData(currentLanguage);
        setApiData(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch disabilities data:", err);
        setError(t("common.errors.apiError"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentLanguage, t]);

  // Reset active service when data changes
  useEffect(() => {
    setActiveService(0);
  }, [apiData, currentLanguage]);

  // Auto-switching services
  useEffect(() => {
    if (
      apiData &&
      apiData.support_services &&
      apiData.support_services.length > 0
    ) {
      const interval = setInterval(() => {
        setActiveService(
          (prev) => (prev + 1) % apiData.support_services.length
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [apiData]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Анимированный фон с символами инклюзивности */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Символы инклюзивности */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">♿</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">
          🤝
        </div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">❤️</div>
        <div className="absolute top-1/3 left-1/3 text-5xl opacity-5">🌍</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            {uiTranslations.headerIcon || "♿"}
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {apiData?.title || uiTranslations.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {apiData?.subtitle || uiTranslations.subtitle}
          </p>
          {error && (
            <div className="bg-red-500/20 text-red-100 p-3 rounded-lg mt-4 inline-block">
              {error}
            </div>
          )}
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mb-12 lg:mb-16"
        >
          <div className="bg-white/5 rounded-2xl p-2 backdrop-blur-lg border border-white/20 shadow-2xl">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("support")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-500 ${
                activeTab === "support"
                  ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg"
                  : "text-blue-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {uiTranslations.tabs.support}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("contacts")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-500 ${
                activeTab === "contacts"
                  ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg"
                  : "text-blue-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {uiTranslations.tabs.contacts}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("resources")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-500 ${
                activeTab === "resources"
                  ? "bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg"
                  : "text-blue-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {uiTranslations.tabs.resources}
            </motion.button>
          </div>
        </motion.div>

        {/* Контент */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden"
        >
          <div className="p-6 lg:p-8">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loading />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {activeTab === "support" && (
                  <SupportServices
                    key="support"
                    data={apiData?.support_services || []}
                    activeService={activeService}
                    onServiceChange={setActiveService}
                    uiTexts={uiTranslations.uiTexts}
                  />
                )}
                {activeTab === "contacts" && (
                  <Contacts
                    key="contacts"
                    data={{
                      contacts: apiData?.contacts || [],
                      emergency: apiData?.emergency || null,
                    }}
                    uiTexts={uiTranslations.uiTexts}
                  />
                )}
                {activeTab === "resources" && (
                  <Resources
                    key="resources"
                    data={apiData?.resources || []}
                    uiTexts={uiTranslations.uiTexts}
                  />
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SupportServices = ({ data, activeService, onServiceChange, uiTexts }) => (
  <div className="space-y-8">
    {/* Активная услуга */}
    {data[activeService] && (
      <motion.div
        key={activeService}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 backdrop-blur-lg border border-white/20 shadow-2xl mb-8"
      >
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
            {data[activeService].icon}
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
              {data[activeService].title}
            </h3>
            <p className="text-blue-100 text-lg leading-relaxed mb-4">
              {data[activeService].description}
            </p>
            {data[activeService].features && (
              <div className="grid md:grid-cols-2 gap-3">
                {data[activeService].features.map((feature, i) => (
                  <div key={i} className="flex items-center text-blue-200">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></div>
                    {feature}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    )}

    {/* Все услуги */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((service, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`bg-white/5 rounded-2xl p-6 border backdrop-blur-sm transition-all duration-300 cursor-pointer ${
            activeService === index
              ? "border-emerald-400/50 bg-white/10 shadow-lg"
              : "border-white/10 hover:border-emerald-400/30"
          }`}
          onClick={() => onServiceChange(index)}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0">
              {service.icon}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                {service.title}
              </h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>

          {service.features && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="font-semibold text-white text-sm mb-3">
                {service.featuresTitle || uiTexts.includes}
              </h4>
              <ul className="space-y-2">
                {service.features.slice(0, 3).map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center text-blue-200 text-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
                {service.features.length > 3 && (
                  <li className="text-blue-300 text-sm">
                    {uiTexts.moreServices.replace(
                      "{count}",
                      service.features.length - 3
                    )}
                  </li>
                )}
              </ul>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

const Contacts = ({ data, uiTexts }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.contacts.map((contact, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 backdrop-blur-sm"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
              {contact.icon}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{contact.name}</h3>
              <p className="text-blue-200 text-sm">{contact.position}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-blue-200 text-sm">
              <span className="w-8 text-center mr-3 text-lg">
                {uiTexts.phoneIcon}
              </span>
              <a
                href={`tel:${contact.phone}`}
                className="hover:text-emerald-300 transition-colors duration-300"
              >
                {contact.phone}
              </a>
            </div>
            <div className="flex items-center text-blue-200 text-sm">
              <span className="w-8 text-center mr-3 text-lg">
                {uiTexts.emailIcon}
              </span>
              <a
                href={`mailto:${contact.email}`}
                className="hover:text-emerald-300 transition-colors duration-300"
              >
                {contact.email}
              </a>
            </div>
            {contact.hours && (
              <div className="flex items-center text-blue-200 text-sm">
                <span className="w-8 text-center mr-3 text-lg">
                  {uiTexts.hoursIcon}
                </span>
                <span>{contact.hours}</span>
              </div>
            )}
            {contact.location && (
              <div className="flex items-center text-blue-200 text-sm">
                <span className="w-8 text-center mr-3 text-lg">
                  {uiTexts.locationIcon}
                </span>
                <span>{contact.location}</span>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>

    {/* Экстренная поддержка */}
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 text-center border border-white/20 backdrop-blur-lg shadow-2xl"
    >
      <h3 className="text-2xl font-bold text-white mb-3">
        {data.emergency.title}
      </h3>
      <p className="text-blue-100 text-lg mb-4">{data.emergency.description}</p>
      <motion.a
        href={data.emergency.phoneLink}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:from-emerald-600 hover:to-green-600 transition-all duration-300 shadow-lg"
      >
        <span className="text-2xl">{uiTexts.emergencyIcon}</span>
        <span>{data.emergency.phone}</span>
      </motion.a>
    </motion.div>
  </div>
);

const Resources = ({ data, uiTexts }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {data.map((resource, index) => (
      <motion.a
        key={index}
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group backdrop-blur-sm block"
        whileHover={{ scale: 1.05 }}
      >
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
            {resource.icon}
          </div>
          <h3 className="font-bold text-white text-lg mb-2">{resource.name}</h3>
          <p className="text-blue-200 text-sm leading-relaxed">
            {resource.description}
          </p>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-emerald-400 font-medium bg-emerald-500/20 px-3 py-1 rounded-full">
            {resource.type}
          </span>
          <span className="text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full">
            {resource.format}
          </span>
        </div>
      </motion.a>
    ))}
  </div>
);

export default StudentsDisabilities;
