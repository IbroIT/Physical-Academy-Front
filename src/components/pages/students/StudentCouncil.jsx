import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const StudentCouncil = () => {
  const { t } = useTranslation();
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState('members');
  const [isVisible, setIsVisible] = useState(false);
  const [activeMemberIndex, setActiveMemberIndex] = useState(0);
  const sectionRef = useRef(null);

  const data = t('students.council', { returnObjects: true });
  const labels = t('students.council.labels', { returnObjects: true });

  const tabs = [
    { id: 'members', label: labels.tabs.members, icon: '👥' },
    { id: 'initiatives', label: labels.tabs.initiatives, icon: '🚀' },
    { id: 'events', label: labels.tabs.events, icon: '📅' }
  ];

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
    if (activeTab === 'members' && data?.members) {
      const interval = setInterval(() => {
        setActiveMemberIndex((prev) => (prev + 1) % data.members.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeTab, data?.members]);

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
        <div className="absolute top-1/4 right-1/4 text-6xl opacity-5">🏆</div>
        <div className="absolute bottom-1/3 left-1/4 text-5xl opacity-5">💪</div>
        <div className="absolute top-1/2 left-1/2 text-4xl opacity-5">⚽</div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Заголовок */}
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
            🏅
          </motion.div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {data.title}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg md:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Статистика */}
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
              <div className="text-3xl lg:text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-blue-200 text-sm lg:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center mb-8 lg:mb-12"
        >
          <div className="bg-white/5 rounded-2xl p-2 border border-white/20 backdrop-blur-lg">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                    : 'text-blue-100 hover:bg-white/10'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Основной контент */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'members' && (
                <motion.div
                  key="members"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Выделенный член */}
                  {data.members[activeMemberIndex] && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-3xl p-6 backdrop-blur-lg border border-white/20 shadow-2xl mb-8"
                    >
                      <div className="flex flex-col lg:flex-row items-center gap-6">
                        <div className="flex-shrink-0">
                          {data.members[activeMemberIndex].avatar ? (
                            <img 
                              src={data.members[activeMemberIndex].avatar} 
                              alt={data.members[activeMemberIndex].name}
                              className="w-24 h-24 rounded-2xl border-4 border-white/20 shadow-lg"
                            />
                          ) : (
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-2xl border-4 border-white/20 shadow-lg">
                              {data.members[activeMemberIndex].name.split(' ').map(w => w[0]).join('')}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-center lg:text-left">
                          <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                            <h3 className="text-2xl font-bold text-white">
                              {data.members[activeMemberIndex].name}
                            </h3>
                            {data.members[activeMemberIndex].role === 'president' && (
                              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                👑 {labels.roles.president}
                              </span>
                            )}
                          </div>
                          <p className="text-emerald-300 font-semibold text-lg mb-2">
                            {data.members[activeMemberIndex].position}
                          </p>
                          <p className="text-blue-200">
                            {data.members[activeMemberIndex].department}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Сетка членов */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.members.map((member, index) => (
                      <MemberCard 
                        key={member.id} 
                        member={member} 
                        index={index}
                        onSelect={setSelectedMember}
                        isSelected={selectedMember?.id === member.id}
                        isActive={activeMemberIndex === index}
                        labels={labels}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'initiatives' && (
                <motion.div
                  key="initiatives"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {data.initiatives.map((initiative, index) => (
                    <InitiativeCard 
                      key={initiative.id} 
                      initiative={initiative} 
                      index={index}
                      labels={labels}
                    />
                  ))}
                </motion.div>
              )}

              {activeTab === 'events' && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {data.events.map((event, index) => (
                    <EventCard 
                      key={event.id} 
                      event={event} 
                      index={index}
                      labels={labels}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Цели */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/5 rounded-3xl p-6 backdrop-blur-lg border border-white/20 shadow-2xl"
            >
              <h3 className="font-bold text-white mb-4 text-lg flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span>{labels.goals.title}</span>
              </h3>
              <ul className="space-y-3">
                {data.goals.map((goal, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-start text-blue-100"
                  >
                    <div className="w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 mr-3">
                      <span className="text-emerald-400 text-xs">✓</span>
                    </div>
                    {goal}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Контакты */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="bg-emerald-500/10 rounded-3xl p-6 backdrop-blur-lg border border-emerald-500/20 shadow-2xl"
            >
              <h3 className="font-bold text-white mb-4 text-lg flex items-center gap-3">
                <span className="text-2xl">📞</span>
                <span>{labels.contacts.title}</span>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-blue-100">
                  <span className="text-lg">📧</span>
                  <span>{labels.contacts.email}</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <span className="text-lg">🏢</span>
                  <span>{labels.contacts.office}</span>
                </div>
                <div className="flex items-center gap-3 text-blue-100">
                  <span className="text-lg">🕒</span>
                  <span>{labels.contacts.hours}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Модальное окно с деталями члена совета */}
      <AnimatePresence>
        {selectedMember && (
          <MemberModal 
            member={selectedMember} 
            onClose={() => setSelectedMember(null)}
            labels={labels}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const MemberCard = ({ member, index, onSelect, isSelected, isActive, labels }) => {
  const generateInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className={`bg-white/5 rounded-2xl p-6 border backdrop-blur-sm cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'border-emerald-400 shadow-2xl bg-emerald-500/20' 
          : isActive
          ? 'border-blue-400 shadow-lg bg-blue-500/10'
          : 'border-white/10 hover:border-emerald-400/50 hover:shadow-xl'
      }`}
      onClick={() => onSelect(member)}
    >
      <div className="text-center">
        <div className="relative inline-block mb-4">
          {member.avatar ? (
            <img 
              src={member.avatar} 
              alt={member.name}
              className="w-20 h-20 rounded-full mx-auto border-2 border-white/20 shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full mx-auto border-2 border-white/20 bg-gradient-to-r from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {generateInitials(member.name)}
            </div>
          )}
          <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white/20 shadow-lg ${
            member.role === 'president' ? 'bg-yellow-500 text-white' : 'bg-emerald-500 text-white'
          }`}>
            {member.role === 'president' ? '👑' : '⭐'}
          </div>
        </div>
        
        <h3 className="font-bold text-white text-lg mb-1">{member.name}</h3>
        <p className="text-emerald-300 font-semibold mb-1">{member.position}</p>
        <p className="text-blue-200 text-sm mb-3">{member.department}</p>
        
        <div className="flex flex-wrap gap-1 justify-center">
          {member.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="px-2 py-1 bg-white/10 text-blue-100 rounded-full text-xs backdrop-blur-sm">
              {tag}
            </span>
          ))}
          {member.tags.length > 2 && (
            <span className="px-2 py-1 bg-white/10 text-blue-100 rounded-full text-xs backdrop-blur-sm">
              +{member.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const InitiativeCard = ({ initiative, index, labels }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 backdrop-blur-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-emerald-400 text-xl">{initiative.icon}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{initiative.title}</h3>
            <p className="text-blue-200">{initiative.description}</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 text-blue-200 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm"
        >
          <svg 
            className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-blue-200">{initiative.progressText}</span>
          <span className="text-sm font-medium text-emerald-400">{initiative.progress}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 backdrop-blur-sm">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${initiative.progress}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full"
          ></motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/10 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-white mb-2">{labels.initiatives.tasks}</h4>
                <ul className="space-y-1 text-sm text-blue-200">
                  {initiative.tasks.map((task, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="text-emerald-400">•</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">{labels.initiatives.participants}</h4>
                <div className="flex flex-wrap gap-2">
                  {initiative.participants.map((participant, i) => (
                    <span key={i} className="px-2 py-1 bg-white/10 text-blue-200 rounded text-xs backdrop-blur-sm">
                      {participant}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 text-sm font-semibold"
            >
              {labels.initiatives.join}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EventCard = ({ event, index, labels }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-emerald-400/30 transition-all duration-300 backdrop-blur-lg"
    >
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
            <span className="text-emerald-400 text-xl">📅</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
            <p className="text-blue-200 mb-3">{event.description}</p>
            <div className="flex flex-wrap gap-4 text-sm text-blue-200">
              <span className="flex items-center gap-2">
                <span>📅</span>
                <span>{event.date}</span>
              </span>
              <span className="flex items-center gap-2">
                <span>🕒</span>
                <span>{event.time}</span>
              </span>
              <span className="flex items-center gap-2">
                <span>📍</span>
                <span>{event.location}</span>
              </span>
              <span className="flex items-center gap-2">
                <span>👥</span>
                <span>{event.participantsCount} {labels.events.participants}</span>
              </span>
            </div>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-500 to-emerald-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-emerald-600 transition-all duration-300 text-sm font-semibold whitespace-nowrap flex-shrink-0"
        >
          {labels.events.signUp}
        </motion.button>
      </div>
    </motion.div>
  );
};

const MemberModal = ({ member, onClose, labels }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-emerald-500 p-6 text-white rounded-t-3xl">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {member.avatar ? (
                  <img 
                    src={member.avatar} 
                    alt={member.name}
                    className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl border-2 border-white/20 bg-gradient-to-r from-blue-600 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {member.name.split(' ').map(w => w[0]).join('')}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  <p className="text-blue-100">{member.position}</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl bg-white/20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                ×
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span>📋</span>
                  <span>{labels.modal.information}</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200">{labels.modal.faculty}:</span>
                    <span className="font-medium text-white">{member.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">{labels.modal.course}:</span>
                    <span className="font-medium text-white">{member.course}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">{labels.modal.role}:</span>
                    <span className="font-medium text-emerald-400">{member.roleLabel}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span>📞</span>
                  <span>{labels.modal.contacts}</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center text-blue-200">
                    <span className="w-6">📧</span>
                    <a href={`mailto:${member.email}`} className="hover:text-emerald-400 transition-colors">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center text-blue-200">
                    <span className="w-6">📱</span>
                    <a href={`tel:${member.phone}`} className="hover:text-emerald-400 transition-colors">
                      {member.phone}
                    </a>
                  </div>
                  {member.telegram && (
                    <div className="flex items-center text-blue-200">
                      <span className="w-6">📢</span>
                      <a href={member.telegram} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                        {labels.modal.telegram}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <span>🎯</span>
                <span>{labels.modal.responsibilities}</span>
              </h4>
              <ul className="space-y-2">
                {member.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start text-blue-200">
                    <span className="text-emerald-400 mr-2 mt-1">•</span>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <span>🏆</span>
                <span>{labels.modal.achievements}</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {member.achievements.map((achievement, index) => (
                  <span key={index} className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm backdrop-blur-sm border border-emerald-500/30">
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentCouncil;