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
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      title: 'about.features.education.title',
      description: 'about.features.education.description',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: 'about.features.sports.title',
      description: 'about.features.sports.description',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'about.features.community.title',
      description: 'about.features.community.description',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
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

          {/* Основной контент с фоткой справа */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Текст контент слева */}
            <motion.div
              variants={itemVariants}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  {t('about.mission.title')}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {t('about.mission.description')}
                </p>
              </div>

              {/* Интерактивные фичи под текстом */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-gradient-to-br ${feature.color} rounded-xl p-4 text-white cursor-pointer transition-all duration-300 ${
                      activeFeature === index ? 'ring-4 ring-white ring-opacity-50' : 'opacity-80'
                    }`}
                    onClick={() => setActiveFeature(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.span
                        animate={{ 
                          rotate: activeFeature === index ? [0, -10, 10, 0] : 0,
                          scale: activeFeature === index ? [1, 1.2, 1] : 1
                        }}
                        transition={{ duration: 0.5 }}
                        className="text-white"
                      >
                        {feature.icon}
                      </motion.span>
                      <span className="font-semibold text-sm">
                        {t(feature.title)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Фотка справа с анимацией */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Замените этот div на вашу фотку */}
                <div className="w-full h-90 bg-gradient-to-br from-blue-400 to-green-500 relative">
                  {/* Пример фотки - замените на ваше изображение */}
                  <img src="https://cdn-1.aki.kg/cdn-st-0/qdd/9/md-3369.jpg" alt="" />
                  
                  {/* Декоративные элементы на фотке */}
                  <motion.div
                    animate={{ 
                      y: [0, -20, 0],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity 
                    }}
                    className="absolute top-4 right-4 w-16 h-16 bg-white/30 rounded-full"
                  ></motion.div>
                  <motion.div
                    animate={{ 
                      y: [0, 15, 0],
                      opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      delay: 1 
                    }}
                    className="absolute bottom-6 left-6 w-12 h-12 bg-yellow-300/40 rounded-lg"
                  ></motion.div>
                </div>

                {/* Плавающие элементы */}
                <motion.div
                  animate={{ 
                    y: [0, -30, 0],
                    x: [0, 10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity 
                  }}
                  className="absolute -top-4 -left-4 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                >
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </motion.div>
                <motion.div
                  animate={{ 
                    y: [0, 20, 0],
                    x: [0, -15, 0],
                    rotate: [0, -3, 0]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    delay: 2 
                  }}
                  className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-400/30 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Активная фича отображается рядом с фоткой */}
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`mt-6 bg-gradient-to-r ${features[activeFeature].color} rounded-2xl p-6 text-white shadow-xl`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-white">{features[activeFeature].icon}</span>
                  <h3 className="text-xl font-bold">
                    {t(features[activeFeature].title)}
                  </h3>
                </div>
                <p className="text-white/90">
                  {t(features[activeFeature].description)}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400"></div>
    </div>
  );
};

export default AboutAcademy;