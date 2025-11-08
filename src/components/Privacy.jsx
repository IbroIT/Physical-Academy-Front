import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.1 });

  const sections = [
    {
      key: 'dataCollection',
      icon: '📊',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      key: 'dataUsage',
      icon: '🔍',
      color: 'from-green-500 to-emerald-500'
    },
    {
      key: 'dataProtection',
      icon: '🛡️',
      color: 'from-purple-500 to-pink-500'
    },
    {
      key: 'yourRights',
      icon: '👤',
      color: 'from-orange-500 to-red-500'
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-10 left-20 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>
      <div ref={ref} className="relative z-10 py-20 px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          {/* Заголовок */}
          <motion.div
            variants={itemVariants}
            className="text-center mb-16"
          >
            <motion.h1
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
            >
              {t('privacy.title')}
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 100 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full"
            ></motion.div>
            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-600"
            >
              {t('privacy.lastUpdated')}
            </motion.p>
          </motion.div>

          {/* Секции */}
          <motion.div
            variants={containerVariants}
            className="space-y-8"
          >
            {sections.map((section, index) => (
              <motion.div
                key={section.key}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className={`bg-gradient-to-r ${section.color} rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300`}
              >
                <div className="flex items-start space-x-4">
                  <motion.div
                    animate={{ 
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: index * 0.5
                    }}
                    className="text-3xl flex-shrink-0"
                  >
                    {section.icon}
                  </motion.div>
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="text-2xl font-bold mb-4"
                    >
                      {t(`privacy.sections.${section.key}.title`)}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="text-white/90 leading-relaxed"
                    >
                      {t(`privacy.sections.${section.key}.content`)}
                    </motion.p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;