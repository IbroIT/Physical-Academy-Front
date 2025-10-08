// AcademicCouncil.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const AcademicCouncil = () => {
  const { t } = useTranslation();
  const [activeMember, setActiveMember] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const councilMembers = [
    {
      id: 1,
      name: t('council.members.0.name'),
      position: t('council.members.0.position'),
      department: t('council.members.0.department'),
      achievements: [
        t('council.members.0.achievements.0'),
        t('council.members.0.achievements.1'),
        t('council.members.0.achievements.2')
      ],
      image: '/images/council/member1.jpg'
    },
    {
      id: 2,
      name: t('council.members.1.name'),
      position: t('council.members.1.position'),
      department: t('council.members.1.department'),
      achievements: [
        t('council.members.1.achievements.0'),
        t('council.members.1.achievements.1'),
        t('council.members.1.achievements.2')
      ],
      image: '/images/council/member2.jpg'
    },
    {
      id: 3,
      name: t('council.members.2.name'),
      position: t('council.members.2.position'),
      department: t('council.members.2.department'),
      achievements: [
        t('council.members.2.achievements.0'),
        t('council.members.2.achievements.1'),
        t('council.members.2.achievements.2')
      ],
      image: '/images/council/member3.jpg'
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveMember(prev => (prev + 1) % councilMembers.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setActiveMember(index);
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-green-800 py-20 overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Заголовок */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            {t('council.title')}
          </h1>
          <div className="w-24 h-1 bg-green-400 mx-auto mb-4"></div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            {t('council.subtitle')}
          </p>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Карточка члена совета */}
          <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="flex items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-green-400 p-1">
                  <img
                    src={councilMembers[activeMember].image}
                    alt={councilMembers[activeMember].name}
                    className="w-full h-full rounded-full object-cover border-4 border-white"
                  />
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-white">
                    {councilMembers[activeMember].name}
                  </h3>
                  <p className="text-green-300 font-semibold">
                    {councilMembers[activeMember].position}
                  </p>
                  <p className="text-blue-200">
                    {councilMembers[activeMember].department}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white mb-3">
                  {t('council.achievements')}:
                </h4>
                {councilMembers[activeMember].achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-start group hover:transform hover:translate-x-2 transition-transform duration-300"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p className="text-blue-100 group-hover:text-white transition-colors">
                      {achievement}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Декоративные элементы */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
          </div>

          {/* Информация о совете */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-green-400/30 transition-all duration-500 group">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="w-3 h-3 bg-green-400 rounded-full mr-3 group-hover:animate-pulse"></span>
                {t('council.mission.title')}
              </h3>
              <p className="text-blue-100 leading-relaxed">
                {t('council.mission.description')}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-500 group">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="w-3 h-3 bg-blue-400 rounded-full mr-3 group-hover:animate-pulse"></span>
                {t('council.responsibilities.title')}
              </h3>
              <ul className="space-y-2 text-blue-100">
                {[1, 2, 3, 4].map((item) => (
                  <li key={item} className="flex items-center hover:text-white transition-colors">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                    {t(`council.responsibilities.item${item}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Навигационные точки */}
        <div className="flex justify-center mt-12 space-x-4">
          {councilMembers.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === activeMember
                  ? 'bg-green-400 scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Плавающие элементы */}
      <div className="absolute bottom-10 left-10 w-8 h-8 bg-green-400/20 rounded-full animate-bounce"></div>
      <div className="absolute top-10 right-10 w-6 h-6 bg-blue-400/20 rounded-full animate-ping"></div>
    </section>
  );
};

export default AcademicCouncil;