// CollegeSports.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const CollegeSports = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('about');
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredProgram, setHoveredProgram] = useState(null);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startCounters();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const startCounters = () => {
    const targetValues = [500, 15, 95, 10];
    const duration = 2000;
    const steps = 60;
    const stepValues = targetValues.map(target => target / steps);

    let currentStep = 0;
    const counterInterval = setInterval(() => {
      currentStep++;
      setCounterValues(prev => 
        prev.map((value, index) => {
          if (currentStep <= steps) {
            return Math.min(value + stepValues[index], targetValues[index]);
          }
          return value;
        })
      );

      if (currentStep >= steps) {
        clearInterval(counterInterval);
      }
    }, duration / steps);
  };

  const sections = [
    { id: 'about', label: t('collegeSports.sections.about'), icon: '🏫', color: 'from-blue-500 to-cyan-500' },
    { id: 'programs', label: t('collegeSports.sections.programs'), icon: '🎓', color: 'from-green-500 to-emerald-500' },
    { id: 'admissions', label: t('collegeSports.sections.admissions'), icon: '📝', color: 'from-blue-500 to-green-500' },
    { id: 'campus', label: t('collegeSports.sections.campus'), icon: '🏛️', color: 'from-green-500 to-blue-500' },
    { id: 'sports', label: t('collegeSports.sections.sports'), icon: '⚽', color: 'from-cyan-500 to-blue-500' }
  ];

  const stats = [
    { 
      number: `${Math.round(counterValues[0])}+`, 
      label: t('collegeSports.stats.students'), 
      icon: '👨‍🎓',
      delay: 0
    },
    { 
      number: `${Math.round(counterValues[1])}+`, 
      label: t('collegeSports.stats.programs'), 
      icon: '📚',
      delay: 200
    },
    { 
      number: `${Math.round(counterValues[2])}%`, 
      label: t('collegeSports.stats.employment'), 
      icon: '💼',
      delay: 400
    },
    { 
      number: `${Math.round(counterValues[3])}`, 
      label: t('collegeSports.stats.sports'), 
      icon: '🏆',
      delay: 600
    }
  ];

  const programs = t('collegeSports.programs.list', { returnObjects: true });
  const sportsFacilities = t('collegeSports.facilities.list', { returnObjects: true });
  const admissionSteps = t('collegeSports.admission.steps', { returnObjects: true });

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'about':
        return (
          <motion.div
            key="about"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-3xl font-bold text-white mb-6">
                  {t('collegeSports.about.title')}
                </h3>
                <div className="space-y-6">
                  <p className="text-lg text-blue-100 leading-relaxed border-l-4 border-blue-500 pl-6 py-4 bg-blue-500/10 rounded-r-2xl backdrop-blur-sm">
                    {t('collegeSports.about.description1')}
                  </p>
                  <p className="text-lg text-blue-100 leading-relaxed">
                    {t('collegeSports.about.description2')}
                  </p>
                  <p className="text-lg text-blue-100 leading-relaxed">
                    {t('collegeSports.about.description3')}
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-blue-500 to-emerald-500 rounded-3xl p-8 text-white text-center shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
                <div className="relative z-10">
                  <motion.div 
                    className="text-6xl mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    🏆
                  </motion.div>
                  <h4 className="text-2xl font-bold mb-4">{t('collegeSports.about.missionTitle')}</h4>
                  <p className="text-lg opacity-90 leading-relaxed">{t('collegeSports.about.mission')}</p>
                </div>
              </motion.div>
            </div>

            {/* Features */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-3 gap-6 mt-12"
            >
              {t('collegeSports.about.features', { returnObjects: true }).map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden backdrop-blur-sm"
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${
                    feature.color === 'blue' ? 'bg-blue-500' : 'bg-emerald-500'
                  }`}></div>
                  
                  <div className="relative z-10">
                    <motion.div 
                      className={`text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 ${
                        feature.color === 'blue' ? 'text-blue-400' : 'text-emerald-400'
                      }`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h4 className="font-bold text-white text-lg mb-3 group-hover:text-blue-400 transition-colors duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-blue-100 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        );

      case 'programs':
        return (
          <motion.div
            key="programs"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <h3 className="text-3xl font-bold text-white mb-8">
              {t('collegeSports.programs.title')}
            </h3>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredProgram(index)}
                  onMouseLeave={() => setHoveredProgram(null)}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden backdrop-blur-sm"
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 ${
                    program.color.includes('blue') ? 'bg-blue-500' : 'bg-emerald-500'
                  }`}></div>
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {program.icon}
                    </motion.div>
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                      {program.title}
                    </h4>
                    <p className="text-blue-100 mb-4 leading-relaxed text-lg">{program.description}</p>
                    
                    <div className="flex items-center text-lg text-blue-200 mb-4">
                      <span className="mr-3">⏱️</span>
                      {program.duration}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h5 className="font-semibold text-white mb-3 flex items-center text-lg">
                          <span className="mr-3">📚</span>
                          {t('collegeSports.programs.keySubjects')}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {program.subjects.map((subject, idx) => (
                            <motion.span 
                              key={idx}
                              className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded-2xl text-sm font-medium hover:bg-blue-500/30 hover:scale-105 transition-all duration-300 cursor-default border border-blue-400/30"
                              whileHover={{ scale: 1.05 }}
                            >
                              {subject}
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-white mb-3 flex items-center text-lg">
                          <span className="mr-3">💼</span>
                          {t('collegeSports.programs.careerPaths')}
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {program.careers.map((career, idx) => (
                            <motion.span 
                              key={idx}
                              className="bg-emerald-500/20 text-emerald-300 px-3 py-2 rounded-2xl text-sm font-medium hover:bg-emerald-500/30 hover:scale-105 transition-all duration-300 cursor-default border border-emerald-400/30"
                              whileHover={{ scale: 1.05 }}
                            >
                              {career}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <motion.button 
                      className="w-full mt-6 bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {t('collegeSports.programs.learnMore')}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'admissions':
        return (
          <motion.div
            key="admissions"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <h3 className="text-3xl font-bold text-white mb-8">
              {t('collegeSports.admission.title')}
            </h3>

            {/* Admission Timeline */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-emerald-500 -z-10 rounded-full"></div>
              <div className="space-y-8">
                {admissionSteps.map((step, index) => (
                  <motion.div 
                    key={step.step} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-6 group"
                  >
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-all duration-500 group-hover:scale-110 ${
                      step.color === 'blue' 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                        : 'bg-gradient-to-r from-emerald-500 to-green-500'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/10 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                          {step.title}
                        </h4>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          step.color === 'blue' 
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30' 
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        }`}>
                          {t('collegeSports.admission.step')} {step.step}
                        </span>
                      </div>
                      <p className="text-blue-100 leading-relaxed text-lg">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid md:grid-cols-2 gap-8 mt-12"
            >
              <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-400/20 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-sm">
                <h4 className="font-bold text-blue-300 text-xl mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white mr-3 text-sm shadow-md">📋</span>
                  {t('collegeSports.admission.requirements.title')}
                </h4>
                <ul className="space-y-4">
                  {t('collegeSports.admission.requirements.list', { returnObjects: true }).map((req, idx) => (
                    <motion.li 
                      key={idx} 
                      className="flex items-start group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                    >
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                      <span className="text-blue-200 text-lg group-hover:text-blue-300 transition-colors duration-300">{req}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-400/20 hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 backdrop-blur-sm">
                <h4 className="font-bold text-emerald-300 text-xl mb-6 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center text-white mr-3 text-sm shadow-md">📅</span>
                  {t('collegeSports.admission.deadlines.title')}
                </h4>
                <div className="space-y-4">
                  {t('collegeSports.admission.deadlines.list', { returnObjects: true }).map((deadline, idx) => (
                    <motion.div 
                      key={idx} 
                      className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-emerald-400/20 hover:shadow-md transition-all duration-300 group backdrop-blur-sm"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                    >
                      <span className="text-emerald-300 font-medium text-lg group-hover:text-emerald-200 transition-colors duration-300">
                        {deadline.period}
                      </span>
                      <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold group-hover:scale-105 transition-transform duration-300 shadow-sm">
                        {deadline.date}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        );

      case 'campus':
        return (
          <motion.div
            key="campus"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <h3 className="text-3xl font-bold text-white mb-8">
              {t('collegeSports.campus.title')}
            </h3>

            {/* Sports Facilities */}
            <div className="grid md:grid-cols-2 gap-8">
              {sportsFacilities.map((facility, index) => (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group backdrop-blur-sm"
                >
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-emerald-500 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-6xl group-hover:scale-110 transition-transform duration-500">
                      {facility.icon}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                      {facility.name}
                    </h4>
                    <p className="text-blue-100 mb-4 leading-relaxed text-lg">{facility.description}</p>
                    <button className="text-blue-400 font-semibold hover:text-blue-300 transition-colors flex items-center group-hover:translate-x-2 transition-transform duration-300 text-lg">
                      {t('collegeSports.campus.viewDetails')}
                      <span className="ml-2">→</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Campus Life */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <h4 className="text-2xl font-bold mb-8 text-center">
                  {t('collegeSports.campus.life.title')}
                </h4>
                <div className="grid md:grid-cols-3 gap-8">
                  {t('collegeSports.campus.life.features', { returnObjects: true }).map((feature, index) => (
                    <motion.div 
                      key={index} 
                      className="text-center group"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {feature.icon}
                      </div>
                      <h5 className="font-semibold mb-3 text-lg">{feature.title}</h5>
                      <p className="text-white/90 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        );

      case 'sports':
        return (
          <motion.div
            key="sports"
            variants={tabContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <h3 className="text-3xl font-bold text-white mb-8">
              {t('collegeSports.sports.title')}
            </h3>

            {/* Sports Teams */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            >
              {t('collegeSports.sports.teams', { returnObjects: true }).map((team, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white/5 rounded-2xl p-6 border border-white/10 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group backdrop-blur-sm"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {team.icon}
                  </div>
                  <h4 className="font-semibold text-white text-lg mb-3 group-hover:text-blue-400 transition-colors duration-300">
                    {team.name}
                  </h4>
                  <p className="text-blue-200 mb-4">{team.coach}</p>
                  <div className="bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium inline-block group-hover:bg-emerald-500/30 group-hover:scale-105 transition-all duration-300 border border-emerald-400/30">
                    {team.status}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-2xl p-8 border border-blue-400/20 shadow-sm hover:shadow-xl transition-all duration-500 backdrop-blur-sm"
            >
              <h4 className="text-2xl font-bold text-white mb-8 text-center">
                {t('collegeSports.sports.achievements.title')}
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {t('collegeSports.sports.achievements.list', { returnObjects: true }).map((achievement, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-3xl text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                      {achievement.icon}
                    </div>
                    <div className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {achievement.number}
                    </div>
                    <div className="text-blue-200 text-lg">{achievement.description}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Training Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12"
            >
              <h4 className="text-2xl font-bold text-white mb-6">
                {t('collegeSports.sports.schedule.title')}
              </h4>
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 shadow-sm hover:shadow-xl transition-all duration-500 backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-4 font-semibold text-white text-lg">
                          {t('collegeSports.sports.schedule.team')}
                        </th>
                        <th className="text-left py-4 font-semibold text-white text-lg">
                          {t('collegeSports.sports.schedule.days')}
                        </th>
                        <th className="text-left py-4 font-semibold text-white text-lg">
                          {t('collegeSports.sports.schedule.time')}
                        </th>
                        <th className="text-left py-4 font-semibold text-white text-lg">
                          {t('collegeSports.sports.schedule.location')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {t('collegeSports.sports.schedule.list', { returnObjects: true }).map((schedule, index) => (
                        <motion.tr 
                          key={index} 
                          className="border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors duration-300"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                        >
                          <td className="py-4 text-blue-100 text-lg">{schedule.team}</td>
                          <td className="py-4 text-blue-100 text-lg">{schedule.days}</td>
                          <td className="py-4 text-blue-100 text-lg">{schedule.time}</td>
                          <td className="py-4 text-blue-100 text-lg">{schedule.location}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
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
        
        {/* Спортивные символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">⚽</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">🏃‍♂️</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🎯</div>
        <div className="absolute top-2/3 right-1/3 text-5xl opacity-5">🏆</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isVisible ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-2xl"
          >
            🏫
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {t('collegeSports.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {t('collegeSports.subtitle')}
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 lg:mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/5 rounded-2xl p-8 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
            >
              <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-blue-200 text-sm lg:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4">
            {sections.map((section) => (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection(section.id)}
                className={`p-6 rounded-2xl transition-all duration-500 transform group ${
                  activeSection === section.id
                    ? `bg-gradient-to-r ${section.color} text-white shadow-2xl scale-105 border border-white/20`
                    : 'bg-white/5 text-blue-200 border border-white/10 hover:bg-white/10 hover:text-white'
                }`}
              >
                <motion.div 
                  className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300"
                  animate={activeSection === section.id ? { scale: 1.1 } : { scale: 1 }}
                >
                  {section.icon}
                </motion.div>
                <div className="font-semibold text-lg">{section.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="bg-white/5 rounded-3xl backdrop-blur-lg border border-white/20 shadow-2xl overflow-hidden"
        >
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CollegeSports;