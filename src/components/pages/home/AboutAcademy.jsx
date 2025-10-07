import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';

const AboutAcademy = () => {
  const { t } = useTranslation();
  const [activeFeature, setActiveFeature] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const features = [
    {
      icon: '🎓',
      title: 'about.features.education.title',
      description: 'about.features.education.description',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: '🏃‍♂️',
      title: 'about.features.sports.title',
      description: 'about.features.sports.description',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: '👥',
      title: 'about.features.community.title',
      description: 'about.features.community.description',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: '🏆',
      title: 'about.features.achievements.title',
      description: 'about.features.achievements.description',
      color: 'from-emerald-500 to-green-500'
    }
  ];

  const stats = [
    { number: '25+', label: 'about.stats.years', delay: 0 },
    { number: '5000+', label: 'about.stats.students', delay: 0.1 },
    { number: '15+', label: 'about.stats.programs', delay: 0.2 },
    { number: '100+', label: 'about.stats.champions', delay: 0.3 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div ref={ref} className="relative z-10 py-20 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          {/* Заголовок */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-20"
          >
            <motion.h1
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6"
            >
              {t('about.title')}
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-8 rounded-full"
            ></motion.div>
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
            >
              {t('about.subtitle')}
            </motion.p>
          </motion.div>

          {/* Статистика */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: stat.delay, type: "spring", stiffness: 100 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.5
                  }}
                  className="text-4xl mb-4"
                >
                  {stat.icon}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: stat.delay + 0.3 }}
                  className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600 font-medium">
                  {t(stat.label)}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Основной контент с интерактивными фичами */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Текст контент */}
            <motion.div
              variants={itemVariants}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                {t('about.mission.title')}
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('about.mission.description')}
              </p>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white mt-8"
              >
                <h3 className="text-2xl font-bold mb-4">
                  {t('about.vision.title')}
                </h3>
                <p className="text-blue-100">
                  {t('about.vision.description')}
                </p>
              </motion.div>
            </motion.div>

            {/* Интерактивные фичи */}
            <motion.div
              variants={itemVariants}
              className="relative h-96"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ 
                    opacity: activeFeature === index ? 1 : 0.3,
                    x: activeFeature === index ? 0 : 50,
                    scale: activeFeature === index ? 1 : 0.9
                  }}
                  transition={{ duration: 0.6 }}
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl p-8 text-white shadow-2xl cursor-pointer`}
                  onClick={() => setActiveFeature(index)}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="text-6xl mb-6"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">
                    {t(feature.title)}
                  </h3>
                  <p className="text-lg opacity-90">
                    {t(feature.description)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400"></div>
    </div>
  );
};

export default AboutAcademy;