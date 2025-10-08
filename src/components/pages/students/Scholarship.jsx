import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Scholarship = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const [expandedCard, setExpandedCard] = useState(null);
  const sectionRef = useRef(null);
  
  const data = t('students.scholarships', { returnObjects: true });
  const labels = t('students.scholarships.labels', { returnObjects: true });

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
    const targetValues = data.stats.map(stat => parseInt(stat.value.replace(/\D/g, '')));
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

  const types = ['all', ...new Set(data.types.map(scholarship => scholarship.type))];

  const filteredScholarships = data.types.filter(scholarship => {
    const matchesType = selectedType === 'all' || scholarship.type === selectedType;
    const matchesStatus = scholarship.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedStatus('active');
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
        
        {/* Академические символы */}
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🎓</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">💰</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">🏆</div>
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
            💰
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {data.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16"
        >
          {data.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white/5 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
            >
              <div className="text-3xl mb-4 text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 font-mono group-hover:scale-110 transition-transform duration-300">
                {stat.value.includes('%') 
                  ? `${Math.round(counterValues[index])}%`
                  : stat.value.includes('+')
                  ? `${Math.round(counterValues[index])}+`
                  : Math.round(counterValues[index])
                }
              </div>
              <div className="text-blue-200 text-sm lg:text-base">{stat.label}</div>
              <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500 mt-3 mx-auto"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Results count */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center">
            <p className="text-blue-200 text-lg">
              {labels.results.found}: <span className="font-semibold text-white">{filteredScholarships.length}</span>
            </p>
            {filteredScholarships.length > 0 && (
              <p className="text-blue-300 text-sm">
                {labels.results.status}: <span className="text-emerald-300">{labels.status[selectedStatus]}</span>
              </p>
            )}
          </div>

          {/* Scholarships */}
          <div className="space-y-6 mt-6">
            {filteredScholarships.map((scholarship, index) => (
              <ScholarshipCard 
                key={scholarship.id} 
                scholarship={scholarship} 
                index={index}
                isExpanded={expandedCard === index}
                onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
                labels={labels.card}
                statusLabels={labels.status}
              />
            ))}
          </div>

          {filteredScholarships.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/5 rounded-3xl border border-white/20 backdrop-blur-sm"
            >
              <div className="text-6xl mb-4 opacity-50">🔍</div>
              <h3 className="text-2xl font-semibold text-white mb-2">{labels.emptyState.title}</h3>
              <p className="text-blue-200 text-lg mb-6">{labels.emptyState.description}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetFilters}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-xl hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-lg"
              >
                {labels.emptyState.reset}
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Payment Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-8 backdrop-blur-lg border border-white/20 shadow-2xl mb-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
            <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">📅</span>
            {labels.paymentSchedule.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.paymentSchedule.map((payment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/30 transition-all duration-500 transform hover:-translate-y-2 group"
              >
                <div className="text-xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">{payment.date}</div>
                <div className="text-blue-100 text-lg mb-3">{payment.type}</div>
                <div className="text-emerald-300 text-lg font-semibold">{payment.amount}</div>
                <div className="w-0 group-hover:w-full h-1 bg-white/50 transition-all duration-500 mt-3 mx-auto"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const ScholarshipCard = ({ scholarship, index, isExpanded, onToggle, labels, statusLabels }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    // Simulate application submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsApplying(false);
    alert(`${labels.applySuccess} "${scholarship.name}"!`);
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-emerald-500/20 text-emerald-300',
      'upcoming': 'bg-blue-500/20 text-blue-300',
      'archived': 'bg-gray-500/20 text-gray-300'
    };
    return colors[status] || colors.active;
  };

  const getStatusLabel = (status) => {
    return statusLabels[status] || statusLabels.active;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-3xl border border-white/10 hover:border-emerald-400/30 transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden backdrop-blur-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
      
      <div className="p-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Main Information */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-300 transition-colors duration-300">
                  {scholarship.name}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-blue-200 mb-4">
                  <span className={`px-4 py-2 rounded-xl text-sm font-medium ${getStatusColor(scholarship.status)} backdrop-blur-sm`}>
                    {getStatusLabel(scholarship.status)}
                  </span>
                  <span className="flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm backdrop-blur-sm">
                    🎯 {scholarship.typeLabel}
                  </span>
                  <span className="flex items-center px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm backdrop-blur-sm">
                    ⏱️ {scholarship.duration}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-emerald-400 mb-1">{scholarship.amount}</div>
                <div className="text-blue-300 text-sm">{labels.perMonth}</div>
              </div>
            </div>

            <p className="text-blue-200 text-lg mb-6 leading-relaxed">{scholarship.description}</p>

            {/* Quick Info */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-500/10 rounded-2xl hover:bg-blue-500/20 transition-colors duration-300 group backdrop-blur-sm">
                <div className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">{scholarship.deadline}</div>
                <div className="text-blue-300 text-sm">{labels.deadline}</div>
              </div>
              <div className="text-center p-3 bg-emerald-500/10 rounded-2xl hover:bg-emerald-500/20 transition-colors duration-300 group backdrop-blur-sm">
                <div className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">{scholarship.availableSpots}</div>
                <div className="text-blue-300 text-sm">{labels.spots}</div>
              </div>
              <div className="text-center p-3 bg-blue-500/10 rounded-2xl hover:bg-blue-500/20 transition-colors duration-300 group backdrop-blur-sm">
                <div className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">{scholarship.minGPA}</div>
                <div className="text-blue-300 text-sm">{labels.minGPA}</div>
              </div>
              <div className="text-center p-3 bg-emerald-500/10 rounded-2xl hover:bg-emerald-500/20 transition-colors duration-300 group backdrop-blur-sm">
                <div className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors duration-300">{scholarship.paymentDate}</div>
                <div className="text-blue-300 text-sm">{labels.paymentDate}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="lg:w-48 flex flex-col space-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleApply}
              disabled={isApplying || scholarship.status !== 'active'}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                scholarship.status === 'active' && !isApplying
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white hover:shadow-lg'
                  : 'bg-white/10 text-blue-300 cursor-not-allowed'
              } backdrop-blur-sm`}
            >
              {isApplying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {labels.applying}
                </>
              ) : (
                <>
                  <span className="mr-2">📝</span>
                  {labels.apply}
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onToggle}
              className="w-full py-3 px-4 bg-white/10 text-blue-300 rounded-xl hover:bg-white/20 hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center backdrop-blur-sm"
            >
              <span className="mr-2">{isExpanded ? '📋' : '🔍'}</span>
              {isExpanded ? labels.collapse : labels.expand}
            </motion.button>

            {scholarship.guidelinesUrl && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={scholarship.guidelinesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 border border-blue-500 text-blue-300 rounded-xl hover:bg-blue-500/20 hover:shadow-lg transition-all duration-300 font-medium flex items-center justify-center backdrop-blur-sm"
              >
                <span className="mr-2">📖</span>
                {labels.guidelines}
              </motion.a>
            )}
          </div>
        </div>

        {/* Expanded Information */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
            >
              {/* Requirements */}
              <div className="bg-blue-500/10 rounded-2xl p-6 border border-blue-500/20 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                <h4 className="font-semibold text-white text-lg mb-4 flex items-center">
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">📋</span>
                  {labels.requirements}
                </h4>
                <ul className="space-y-3">
                  {scholarship.requirements.map((req, reqIndex) => (
                    <li key={reqIndex} className="flex items-start text-blue-200 group">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                      <span className="text-lg group-hover:text-white transition-colors duration-300">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20 hover:shadow-lg transition-all duration-300 backdrop-blur-sm">
                <h4 className="font-semibold text-white text-lg mb-4 flex items-center">
                  <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">⭐</span>
                  {labels.benefits}
                </h4>
                <ul className="space-y-3">
                  {scholarship.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-start text-blue-200 group">
                      <span className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></span>
                      <span className="text-lg group-hover:text-white transition-colors duration-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documents */}
              {scholarship.requiredDocuments && (
                <div className="lg:col-span-2">
                  <h4 className="font-semibold text-white text-lg mb-4 flex items-center">
                    <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white mr-3 text-sm">📎</span>
                    {labels.documents}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {scholarship.requiredDocuments.map((doc, docIndex) => (
                      <div key={docIndex} className="flex items-center text-lg text-blue-200 group hover:text-white transition-colors duration-300">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mr-4 group-hover:scale-150 transition-transform duration-300"></span>
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Scholarship;