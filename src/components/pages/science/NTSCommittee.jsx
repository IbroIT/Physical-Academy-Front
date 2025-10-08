// NTSCommittee.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const NTSCommittee = () => {
  const { t } = useTranslation();
  const [activeMember, setActiveMember] = useState(0);
  const [activeTab, setActiveTab] = useState('members');
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const committeeMembers = [
    {
      id: 1,
      name: t('nts.members.0.name'),
      position: t('nts.members.0.position'),
      credentials: t('nts.members.0.credentials'),
      specialization: t('nts.members.0.specialization'),
      achievements: [
        t('nts.members.0.achievements.0'),
        t('nts.members.0.achievements.1'),
        t('nts.members.0.achievements.2')
      ],
      image: '/images/nts/chairman.jpg',
      email: 'chairman@nts-sport.ru',
      icon: '👑'
    },
    {
      id: 2,
      name: t('nts.members.1.name'),
      position: t('nts.members.1.position'),
      credentials: t('nts.members.1.credentials'),
      specialization: t('nts.members.1.specialization'),
      achievements: [
        t('nts.members.1.achievements.0'),
        t('nts.members.1.achievements.1'),
        t('nts.members.1.achievements.2')
      ],
      image: '/images/nts/science.jpg',
      email: 'science@nts-sport.ru',
      icon: '🔬'
    },
    {
      id: 3,
      name: t('nts.members.2.name'),
      position: t('nts.members.2.position'),
      credentials: t('nts.members.2.credentials'),
      specialization: t('nts.members.2.specialization'),
      achievements: [
        t('nts.members.2.achievements.0'),
        t('nts.members.2.achievements.1'),
        t('nts.members.2.achievements.2')
      ],
      image: '/images/nts/technology.jpg',
      email: 'tech@nts-sport.ru',
      icon: '💻'
    },
    {
      id: 4,
      name: t('nts.members.3.name'),
      position: t('nts.members.3.position'),
      credentials: t('nts.members.3.credentials'),
      specialization: t('nts.members.3.specialization'),
      achievements: [
        t('nts.members.3.achievements.0'),
        t('nts.members.3.achievements.1'),
        t('nts.members.3.achievements.2')
      ],
      image: '/images/nts/innovation.jpg',
      email: 'innovation@nts-sport.ru',
      icon: '🚀'
    }
  ];

  const committeeFunctions = [
    t('nts.functions.0'),
    t('nts.functions.1'),
    t('nts.functions.2'),
    t('nts.functions.3'),
    t('nts.functions.4'),
    t('nts.functions.5')
  ];

  const currentProjects = [
    {
      title: t('nts.projects.0.title'),
      description: t('nts.projects.0.description'),
      status: t('nts.projects.0.status'),
      progress: 75,
      icon: '🧪'
    },
    {
      title: t('nts.projects.1.title'),
      description: t('nts.projects.1.description'),
      status: t('nts.projects.1.status'),
      progress: 90,
      icon: '🏃‍♂️'
    },
    {
      title: t('nts.projects.2.title'),
      description: t('nts.projects.2.description'),
      status: t('nts.projects.2.status'),
      progress: 60,
      icon: '📊'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMemberClick = (index) => {
    setActiveMember(index);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
            {t('nts.title')}
          </h1>
          <div className="w-20 h-1 bg-green-400 mx-auto mb-3 md:mb-4"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4">
            {t('nts.subtitle')}
          </p>
        </div>

        {/* Навигация по вкладкам */}
        <div className={`flex flex-wrap justify-center mb-8 md:mb-12 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20 shadow-lg">
            <div className="flex flex-wrap gap-2">
              {['members', 'functions', 'projects'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg transform scale-105'
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {t(`nts.tabs.${tab}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Контент вкладок */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Вкладка членов комитета */}
          {activeTab === 'members' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {/* Навигация по членам */}
              <div className="space-y-4">
                {committeeMembers.map((member, index) => (
                  <button
                    key={member.id}
                    onClick={() => handleMemberClick(index)}
                    className={`w-full text-left p-4 md:p-6 rounded-2xl transition-all duration-300 group ${
                      index === activeMember
                        ? 'bg-gradient-to-r from-blue-500 to-green-500 shadow-lg transform scale-105'
                        : 'bg-white/10 hover:bg-white/20 hover:transform hover:scale-102'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-xl mr-4">
                        {member.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-bold truncate ${
                          index === activeMember ? 'text-white' : 'text-white group-hover:text-green-300'
                        }`}>
                          {member.name}
                        </h3>
                        <p className={`text-sm truncate ${
                          index === activeMember ? 'text-blue-100' : 'text-blue-200'
                        }`}>
                          {member.position}
                        </p>
                      </div>
                      {index === activeMember && (
                        <div className="w-3 h-3 bg-green-300 rounded-full animate-ping ml-2"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Детальная информация о члене */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start mb-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-blue-400 to-green-400 p-1 mb-4 sm:mb-0 sm:mr-6">
                    <img
                      src={committeeMembers[activeMember].image}
                      alt={committeeMembers[activeMember].name}
                      className="w-full h-full rounded-2xl object-cover border-4 border-white"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {committeeMembers[activeMember].name}
                    </h2>
                    <p className="text-green-300 font-semibold text-lg mb-1">
                      {committeeMembers[activeMember].position}
                    </p>
                    <p className="text-blue-200 mb-2">
                      {committeeMembers[activeMember].credentials}
                    </p>
                    <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm inline-block">
                      {committeeMembers[activeMember].specialization}
                    </div>
                  </div>
                </div>

                {/* Достижения */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                    {t('nts.achievements')}
                  </h3>
                  <div className="space-y-3">
                    {committeeMembers[activeMember].achievements.map((achievement, index) => (
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
                    ))}
                  </div>
                </div>

                {/* Контактная информация */}
                <div className="bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
                    {t('nts.contact')}
                  </h3>
                  <div className="flex items-center group hover:transform hover:translate-x-2 transition-transform duration-300">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 group-hover:bg-blue-500/30 transition-colors">
                      <span className="text-blue-300">📧</span>
                    </div>
                    <div>
                      <p className="text-blue-200 text-sm">{t('nts.email')}</p>
                      <p className="text-white font-semibold">{committeeMembers[activeMember].email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Вкладка функций комитета */}
          {activeTab === 'functions' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center">
                  <span className="w-4 h-4 bg-green-400 rounded-full mr-3"></span>
                  {t('nts.functionsTitle')}
                </h2>
                <div className="space-y-4">
                  {committeeFunctions.map((func, index) => (
                    <div
                      key={index}
                      className="flex items-start group hover:transform hover:translate-x-2 transition-all duration-300"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center text-white font-bold mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {index + 1}
                      </div>
                      <p className="text-blue-100 text-lg group-hover:text-white transition-colors pt-1">
                        {func}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {/* Статистика */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-6 text-center">
                    {t('nts.statsTitle')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center group hover:transform hover:scale-105 transition-transform duration-300">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-500/30 transition-colors">
                        <span className="text-2xl">📈</span>
                      </div>
                      <div className="text-2xl font-bold text-white">15+</div>
                      <div className="text-blue-200 text-sm">{t('nts.stats.projects')}</div>
                    </div>
                    <div className="text-center group hover:transform hover:scale-105 transition-transform duration-300">
                      <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500/30 transition-colors">
                        <span className="text-2xl">👥</span>
                      </div>
                      <div className="text-2xl font-bold text-white">25+</div>
                      <div className="text-blue-200 text-sm">{t('nts.stats.experts')}</div>
                    </div>
                    <div className="text-center group hover:transform hover:scale-105 transition-transform duration-300">
                      <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-500/30 transition-colors">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <div className="text-2xl font-bold text-white">8</div>
                      <div className="text-blue-200 text-sm">{t('nts.stats.patents')}</div>
                    </div>
                    <div className="text-center group hover:transform hover:scale-105 transition-transform duration-300">
                      <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:bg-green-500/30 transition-colors">
                        <span className="text-2xl">🌍</span>
                      </div>
                      <div className="text-2xl font-bold text-white">12</div>
                      <div className="text-blue-200 text-sm">{t('nts.stats.countries')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Вкладка проектов */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProjects.map((project, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl group hover:border-green-400/30 transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-green-400 rounded-xl flex items-center justify-center text-xl text-white mr-4">
                        {project.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-green-300 transition-colors">
                        {project.title}
                      </h3>
                    </div>
                    
                    <p className="text-blue-100 mb-4">
                      {project.description}
                    </p>

                    {/* Прогресс бар */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-green-300">{project.status}</span>
                        <span className="text-blue-300">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-all duration-300 border border-white/20 group-hover:border-green-400/30">
                      {t('nts.projectDetails')}
                    </button>
                  </div>
                ))}
              </div>

              {/* Дополнительная информация о проектах */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">
                  {t('nts.researchAreas')}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="bg-white/5 rounded-xl p-4 text-center group hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-500/30 transition-colors">
                        <span className="text-xl">
                          {item === 1 && '🤖'}
                          {item === 2 && '💊'}
                          {item === 3 && '📱'}
                          {item === 4 && '🔍'}
                        </span>
                      </div>
                      <h4 className="text-white font-semibold text-sm">
                        {t(`nts.researchAreasList.${item-1}`)}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Дополнительный информационный блок */}
        <div className={`mt-12 md:mt-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-blue-600/20 to-green-600/20 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {t('nts.footer.title')}
                </h3>
                <p className="text-blue-100 text-lg mb-6">
                  {t('nts.footer.description')}
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-green-400 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 animate-pulse">
                  🎯
                </div>
                <p className="text-green-300 font-semibold text-lg">
                  {t('nts.footer.mission')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Плавающие элементы для десктопа */}
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