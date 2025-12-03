import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../../common/Loading";

const NTSCommittee = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("members");
  const [selectedMember, setSelectedMember] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Состояния для данных с бэкенда
  const [backendData, setBackendData] = useState({
    members: { results: [], loading: false, error: null },
    directions: { results: [], loading: false, error: null },
    roles: { results: [], loading: false, error: null },
    sections: { results: [], loading: false, error: null }
  });

  const sectionRef = useRef(null);

  // Получение текущего языка для API
  const getApiLanguage = useCallback(() => {
    const langMap = {
      'en': 'en',
      'ru': 'ru',
      'kg': 'kg'
    };
    return langMap[i18n.language] || 'ru';
  }, [i18n.language]);

  // Функция для загрузки данных с бэкенда
  const fetchBackendData = useCallback(async (type) => {
    try {
      setBackendData(prev => ({ 
        ...prev, 
        [type]: { ...prev[type], loading: true, error: null } 
      }));
      
      const lang = getApiLanguage();
      
      const API_URL = import.meta.env.VITE_API_URL;

      const endpoints = {
        members: `${API_URL}/api/science/nts-committee-members/?lang=${lang}`,
        directions: `${API_URL}/api/science/nts-research-directions/?lang=${lang}`,
        roles: `${API_URL}/api/science/nts-committee-roles/?lang=${lang}`,
        sections: `${API_URL}/api/science/nts-committee-sections/?lang=${lang}`
      };


      const response = await fetch(endpoints[type]);
      
      // Проверяем content-type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.warn(`Non-JSON response from ${endpoints[type]}:`, text.substring(0, 200));
        setBackendData(prev => ({
          ...prev,
          [type]: {
            results: [],
            loading: false,
            error: 'Invalid response format'
          }
        }));
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setBackendData(prev => ({
        ...prev,
        [type]: {
          results: data.results || [],
          loading: false,
          error: null
        }
      }));

    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      setBackendData(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          loading: false,
          error: 'Failed to load data'
        }
      }));
    }
  }, [getApiLanguage]);

  // Загрузка всех данных при монтировании
  useEffect(() => {
    fetchBackendData('members');
    fetchBackendData('directions');
    fetchBackendData('roles');
    fetchBackendData('sections');
  }, []);

  // Перезагрузка данных при изменении языка
  useEffect(() => {
    fetchBackendData('members');
    fetchBackendData('directions');
    fetchBackendData('roles');
    fetchBackendData('sections');
  }, [i18n.language, fetchBackendData]);

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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Вспомогательная функция для безопасного отображения данных
  const safeString = (value, fallback = "") => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    if (value && typeof value === 'object') {
      console.warn('Attempted to render object:', value);
      return JSON.stringify(value); // или fallback, в зависимости от требований
    }
    return fallback;
  };

  // Преобразование данных для компонента
  const getCommitteeMembers = () => {
    return backendData.members.results.map(member => ({
      id: member.id,
      name: safeString(member.name, t("science.sections.nts.defaultName")),
      position: safeString(member.position, t("science.sections.nts.defaultPosition")),
      credentials: safeString(member.bio, ""),
      specialization: safeString(member.role, ""),
      email: safeString(member.email),
      phone: safeString(member.phone),
      image: safeString(member.photo, "https://placehold.co/100"),
      achievements: member.bio ? [safeString(member.bio)] : [t("science.sections.nts.defaultBio")],
      icon: "👨‍🔬"
    }));
  };

  const getResearchDirections = () => {
    return backendData.directions.results.map(direction => ({
      id: direction.id,
      title: safeString(direction.name, t("science.sections.nts.defaultDirection")),
      description: safeString(direction.description, t("science.sections.nts.defaultDescription")),
      icon: "🔬",
      key_results: direction.description ? [safeString(direction.description)] : []
    }));
  };

  const getCommitteeSections = () => {
    if (backendData.sections.results.length > 0) {
      const mainSection = backendData.sections.results[0];
      return {
        title: safeString(mainSection.title, t("science.sections.nts.title")),
        description: safeString(mainSection.description, t("science.sections.nts.description"))
      };
    }
    
    return {
      title: t("science.sections.nts.title"),
      description: t("science.sections.nts.description")
    };
  };

  const committeeMembers = getCommitteeMembers();
  const researchDirections = getResearchDirections();
  const committeeSections = getCommitteeSections();

  // Проверка загрузки и ошибок
  const isLoading = backendData.members.loading || backendData.directions.loading;
  const hasError = backendData.members.error || backendData.directions.error;

  if (isLoading) {
    return <Loading />;
  }

  if (hasError) {
    return (
      <div className="flex justify-center items-center py-12 min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-8 rounded-2xl max-w-md">
          <p className="text-lg font-semibold mb-2">{t("common.errorLoading")}</p>
          <p className="text-sm mb-4">{backendData.members.error || backendData.directions.error}</p>
          <button
            onClick={() => {
              fetchBackendData('members');
              fetchBackendData('directions');
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            {t("common.retry")}
          </button>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const tabVariants = {
    inactive: {
      opacity: 0.7,
      y: 0,
      background: "rgba(255, 255, 255, 0.05)",
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
    active: {
      opacity: 1,
      y: -2,
      background: "rgba(59, 130, 246, 0.2)",
      borderColor: "rgba(59, 130, 246, 0.5)",
    },
  };

  const handleMemberClick = (index) => {
    setSelectedMember(index);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 py-16 lg:py-24 overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-56 h-56 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Scientific symbols */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🔬</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">📊</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🧪</div>
        <div className="absolute top-2/3 right-1/3 text-5xl opacity-5">📈</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="inline-flex flex-col items-center bg-white/5 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-2xl border border-white/10">
              <h2 className="text-3xl font-bold text-white mb-2">
                {committeeSections.title}
              </h2>
              <p className="text-indigo-200 max-w-2xl">{committeeSections.description}</p>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center space-x-4"
          >
            <motion.button
              variants={tabVariants}
              animate={activeTab === "members" ? "active" : "inactive"}
              whileHover={{ y: -2, opacity: 1 }}
              onClick={() => setActiveTab("members")}
              className="px-6 py-2 rounded-xl border transition-all duration-300 text-white font-medium"
            >
              {t("science.sections.nts.tabs.members")}
            </motion.button>
            <motion.button
              variants={tabVariants}
              animate={activeTab === "directions" ? "active" : "inactive"}
              whileHover={{ y: -2, opacity: 1 }}
              onClick={() => setActiveTab("directions")}
              className="px-6 py-2 rounded-xl border transition-all duration-300 text-white font-medium"
            >
              {t("science.sections.nts.tabs.directions")}
            </motion.button>
          </motion.div>

          {/* Content based on active tab */}
          <AnimatePresence mode="wait">
            {activeTab === "members" && (
              <motion.div
                key="members"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8"
              >
                {/* Member navigation */}
                <div className="space-y-4">
                  {committeeMembers.length > 0 ? (
                    committeeMembers.map((member, index) => (
                      <button
                        key={member.id}
                        onClick={() => handleMemberClick(index)}
                        className={`w-full text-left p-4 md:p-6 rounded-2xl transition-all duration-300 group ${
                          index === selectedMember
                            ? "bg-gradient-to-r from-blue-500 to-green-500 shadow-lg transform scale-105"
                            : "bg-white/10 hover:bg-white/20 hover:transform hover:scale-102"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl mr-4">
                            {member.icon || "👨‍🔬"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={`font-bold truncate ${
                                index === selectedMember
                                  ? "text-white"
                                  : "text-white group-hover:text-green-300"
                              }`}
                            >
                              {member.name}
                            </h3>
                            <p
                              className={`text-sm truncate ${
                                index === selectedMember
                                  ? "text-blue-100"
                                  : "text-blue-200"
                              }`}
                            >
                              {member.position}
                            </p>
                          </div>
                          {index === selectedMember && (
                            <div className="w-3 h-3 bg-green-300 rounded-full animate-ping ml-2"></div>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-blue-200 bg-white/5 rounded-2xl">
                      {t("science.sections.nts.noMembers")}
                    </div>
                  )}
                </div>

                {/* Member details */}
                {committeeMembers.length > 0 && (
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
                    <div className="flex flex-col sm:flex-row items-start mb-6">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-blue-400 to-green-400 p-1 mb-4 sm:mb-0 sm:mr-6">
                        <img
                          src={committeeMembers[selectedMember].image}
                          alt={committeeMembers[selectedMember].name}
                          className="w-full h-full rounded-2xl object-cover border-4 border-white"
                        />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                          {committeeMembers[selectedMember].name}
                        </h2>
                        <p className="text-green-300 font-semibold text-lg mb-1">
                          {committeeMembers[selectedMember].position}
                        </p>
                        <p className="text-blue-200 mb-2">
                          {committeeMembers[selectedMember].credentials}
                        </p>
                        <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm inline-block">
                          {committeeMembers[selectedMember].specialization}
                        </div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                        {t("science.sections.nts.achievements")}
                      </h3>
                      <div className="space-y-3">
                        {committeeMembers[selectedMember].achievements.map(
                          (achievement, index) => (
                            <div
                              key={index}
                              className="flex items-start bg-white/5 rounded-xl p-4 border border-white/10 hover:border-green-400/30 transition-all duration-300 group"
                            >
                              <div className="w-6 h-6 bg-green-400/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                <span className="text-green-300 text-sm">✓</span>
                              </div>
                              <p className="text-blue-100 group-hover:text-white transition-colors">
                                {achievement}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Contact info */}
                    <div className="bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
                        {t("science.sections.nts.contact")}
                      </h3>
                      <div className="flex items-center group hover:transform hover:translate-x-2 transition-transform duration-300">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-500/30 transition-colors">
                          <span className="text-blue-300">📧</span>
                        </div>
                        <div>
                          <p className="text-blue-200 text-sm">
                            {t("science.sections.nts.email")}
                          </p>
                          <p className="text-white font-semibold">
                            {committeeMembers[selectedMember].email || "contact@example.com"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "directions" && (
              <motion.div
                key="directions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {researchDirections.length > 0 ? (
                  researchDirections.map((direction, index) => (
                    <div
                      key={direction.id}
                      className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:border-blue-300/30 transition-all duration-300"
                    >
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl mr-4 flex-shrink-0">
                          {direction.icon || "🔬"}
                        </div>
                        <span>{direction.title}</span>
                      </h3>

                      <p className="text-blue-100 mb-6 pl-14">
                        {direction.description}
                      </p>

                      {direction.key_results && direction.key_results.length > 0 && (
                        <div className="pl-14 space-y-3">
                          <h4 className="text-lg font-semibold text-white mb-3">
                            {t("science.sections.nts.keyResults")}
                          </h4>
                          {direction.key_results.map((result, idx) => (
                            <div
                              key={idx}
                              className="flex items-start bg-white/5 rounded-xl p-4 border border-white/10 hover:border-blue-400/30 transition-all duration-300 group"
                            >
                              <div className="w-6 h-6 bg-blue-400/20 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                <span className="text-blue-300 text-sm">
                                  {idx + 1}
                                </span>
                              </div>
                              <p className="text-blue-100 group-hover:text-white transition-colors">
                                {result}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white/5 rounded-2xl">
                    <p className="text-blue-200 text-lg">
                      {t("science.sections.nts.noDirections")}
                    </p>
                  </div>
                )}

                {/* Committee vision */}
                <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl mt-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/30 flex items-center justify-center text-2xl mr-4">🌟</div>
                    <h3 className="text-2xl font-bold text-white">
                      {t("science.sections.nts.vision.title")}
                    </h3>
                  </div>
                  <p className="text-indigo-100 text-lg pl-16">
                    {t("science.sections.nts.vision.default")}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Additional info block */}
        <div
          className={`mt-12 md:mt-16 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {t("science.sections.nts.footer.title")}
                </h3>
                <p className="text-blue-100 text-lg mb-6">
                  {t("science.sections.nts.footer.description")}
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-pulse">🎯</div>
                <p className="text-green-300 font-semibold text-lg">
                  {t("science.sections.nts.footer.mission")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements for desktop */}
      {!isMobile && (
        <>
          <div className="absolute bottom-20 left-5 w-6 h-6 bg-green-400/20 rounded-full animate-bounce"></div>
          <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-10 w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
        </>
      )}
    </section>
  );
};

export default NTSCommittee;