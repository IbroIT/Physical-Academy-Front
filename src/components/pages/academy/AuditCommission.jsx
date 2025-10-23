// AuditCommission.jsx - Integrated with API
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../../services/api';

const AuditCommission = () => {
  const { t, i18n } = useTranslation();
  const [activeMember, setActiveMember] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const lang = i18n.language;

        console.log('🔍 Fetching AuditCommission data with lang:', lang);

        const [membersData, statisticsData] = await Promise.all([
          apiService.getAuditCommission(lang),
          apiService.getAuditCommissionStatistics(lang)
        ]);

        console.log('📊 AuditCommission data received:', {
          members: membersData?.length,
          statistics: statisticsData?.length
        });

        setMembers(membersData);
        setStatistics(statisticsData);
        setError(null);
        // Set visible immediately after data loads
        setIsVisible(true);
      } catch (err) {
        console.error('❌ Error fetching Audit Commission data:', err);
        setError(t('error.loadingData', 'Ошибка загрузки данных'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [i18n.language, t]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (members.length === 0) return;

    const interval = setInterval(() => {
      setActiveMember((prev) => (prev + 1) % members.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [members.length]);

  // Loading state
  if (loading) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-emerald-800 py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">{t('loading', 'Загрузка...')}</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-emerald-800 py-20 flex items-center justify-center">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 max-w-md">
          <p className="text-white text-center">{error}</p>
        </div>
      </section>
    );
  }

  // No data state
  if (members.length === 0) {
    return (
      <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-emerald-800 py-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl">{t('noData', 'Нет данных')}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-emerald-800 py-20 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-400 rounded-full mix-blend-screen filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-blue-300 rounded-full mix-blend-screen filter blur-xl animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
            {t('auditCommission.title', 'Ревизионная комиссия')}
          </h2>
          <div className="w-24 h-1 bg-emerald-400 mx-auto mb-6"></div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            {t('auditCommission.subtitle', 'Контроль финансовой деятельности и обеспечение прозрачности')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Карточки членов комиссии */}
          <div className="space-y-6">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -50 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`p-6 rounded-2xl backdrop-blur-lg border-2 transition-all duration-500 cursor-pointer ${activeMember === index
                  ? 'bg-white/20 border-emerald-400 shadow-2xl scale-105'
                  : 'bg-white/10 border-white/20 hover:bg-white/15'
                  }`}
                onMouseEnter={() => setActiveMember(index)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                    <p className="text-emerald-300 font-medium">{member.position}</p>
                    <p className="text-blue-200 text-sm">{member.department}</p>
                  </div>
                </div>

                <AnimatePresence>
                  {activeMember === index && member.achievements && member.achievements.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <ul className="space-y-2">
                        {member.achievements.map((achievement, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="text-blue-100 flex items-center"
                          >
                            <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
                            {achievement}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Визуализация */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 backdrop-blur-lg border border-white/20 shadow-2xl">
              <div className="aspect-square rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-500 flex items-center justify-center relative overflow-hidden">
                {/* Анимированные элементы */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-white/30 rounded-full animate-ping"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-white/20 rounded-full animate-pulse"></div>
                </div>

                <motion.div
                  key={activeMember}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center text-white z-10"
                >
                  <div className="text-6xl font-bold mb-4">
                    {members[activeMember]?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-2xl font-bold">{members[activeMember]?.name}</h3>
                  <p className="text-emerald-300 text-lg">{members[activeMember]?.position}</p>
                </motion.div>
              </div>

              {/* Статистика */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {statistics.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-400">{stat.value}</div>
                    <div className="text-blue-200 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AuditCommission;