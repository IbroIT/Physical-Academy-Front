// AcademyNumbers.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const AcademyNumbers = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    students: 0,
    graduates: 0,
    professors: 0,
    programs: 0,
    sports: 0,
    research: 0,
    champions: 0,
    international: 0
  });
  
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  const statsData = [
    {
      id: 1,
      value: counters.students,
      suffix: '+',
      title: t('numbers.stats.0.title'),
      description: t('numbers.stats.0.description'),
      icon: '👨‍🎓',
      color: 'from-blue-500 to-blue-600',
      duration: 2000
    },
    {
      id: 2,
      value: counters.graduates,
      suffix: '+',
      title: t('numbers.stats.1.title'),
      description: t('numbers.stats.1.description'),
      icon: '🎓',
      color: 'from-green-500 to-green-600',
      duration: 2500
    },
    {
      id: 3,
      value: counters.professors,
      suffix: '+',
      title: t('numbers.stats.2.title'),
      description: t('numbers.stats.2.description'),
      icon: '👨‍🏫',
      color: 'from-blue-500 to-green-500',
      duration: 1800
    },
    {
      id: 4,
      value: counters.programs,
      suffix: '',
      title: t('numbers.stats.3.title'),
      description: t('numbers.stats.3.description'),
      icon: '📚',
      color: 'from-green-500 to-blue-500',
      duration: 2200
    },
    {
      id: 5,
      value: counters.sports,
      suffix: '+',
      title: t('numbers.stats.4.title'),
      description: t('numbers.stats.4.description'),
      icon: '⚽',
      color: 'from-blue-600 to-blue-700',
      duration: 2000
    },
    {
      id: 6,
      value: counters.research,
      suffix: '+',
      title: t('numbers.stats.5.title'),
      description: t('numbers.stats.5.description'),
      icon: '🔬',
      color: 'from-green-600 to-green-700',
      duration: 2800
    },
    {
      id: 7,
      value: counters.champions,
      suffix: '+',
      title: t('numbers.stats.6.title'),
      description: t('numbers.stats.6.description'),
      icon: '🏆',
      color: 'from-blue-500 to-green-600',
      duration: 2300
    },
    {
      id: 8,
      value: counters.international,
      suffix: '+',
      title: t('numbers.stats.7.title'),
      description: t('numbers.stats.7.description'),
      icon: '🌍',
      color: 'from-green-500 to-blue-600',
      duration: 2600
    }
  ];

  const achievements = [
    {
      year: t('numbers.achievements.0.year'),
      title: t('numbers.achievements.0.title'),
      description: t('numbers.achievements.0.description'),
      icon: '🥇'
    },
    {
      year: t('numbers.achievements.1.year'),
      title: t('numbers.achievements.1.title'),
      description: t('numbers.achievements.1.description'),
      icon: '🏅'
    },
    {
      year: t('numbers.achievements.2.year'),
      title: t('numbers.achievements.2.title'),
      description: t('numbers.achievements.2.description'),
      icon: '🚀'
    }
  ];

  const finalValues = {
    students: 12500,
    graduates: 8500,
    professors: 250,
    programs: 45,
    sports: 28,
    research: 120,
    champions: 350,
    international: 65
  };

  const animateCounter = (start, end, duration, setter, key) => {
    const startTime = performance.now();
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(start + easeOutQuart * (end - start));
      
      setter(prev => ({ ...prev, [key]: currentValue }));
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    requestAnimationFrame(updateCounter);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
          
          // Start counter animations with slight delays for visual effect
          Object.keys(finalValues).forEach((key, index) => {
            setTimeout(() => {
              animateCounter(0, finalValues[key], 2000, setCounters, key);
            }, index * 150);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden"
    >
      {/* Анимированный фон с частицами */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        {/* Анимированные частицы */}
        <div className="absolute top-1/5 left-1/5 w-4 h-4 bg-green-300 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-blue-300 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-white rounded-full animate-ping delay-300"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6">
            {t('numbers.title')}
          </h1>
          <div className="w-24 h-1 bg-green-400 mx-auto mb-4"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4">
            {t('numbers.subtitle')}
          </p>
        </div>

        {/* Основные статистические карточки */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {statsData.map((stat, index) => (
            <div
              key={stat.id}
              className="group relative"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/20 shadow-2xl transition-all duration-500 transform hover:scale-105 hover:border-green-400/30 h-full">
                {/* Иконка */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>

                {/* Число с анимацией */}
                <div className="text-center mb-2">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    {stat.value}
                    <span className="text-green-300">{stat.suffix}</span>
                  </span>
                </div>

                {/* Заголовок и описание */}
                <h3 className="text-lg md:text-xl font-bold text-white text-center mb-2">
                  {stat.title}
                </h3>
                <p className="text-blue-100 text-sm text-center">
                  {stat.description}
                </p>

                {/* Анимированная полоска прогресса */}
                <div className="mt-4">
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-500 h-1 rounded-full transition-all duration-2000"
                      style={{ 
                        width: isVisible ? `${(stat.value / finalValues[Object.keys(finalValues)[stat.id - 1]]) * 100}%` : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Декоративные элементы */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
              <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150"></div>
            </div>
          ))}
        </div>

        {/* Достижения и история */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Блок достижений */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center">
              <span className="w-4 h-4 bg-green-400 rounded-full mr-3"></span>
              {t('numbers.achievementsTitle')}
            </h2>
            <div className="space-y-6">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-start group hover:transform hover:translate-x-2 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-xl text-white mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-green-300 font-bold text-lg mr-3">
                        {achievement.year}
                      </span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-blue-100">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Инфографика и дополнительные показатели */}
          <div className="space-y-6">
            {/* Годовой рост */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">
                {t('numbers.growthTitle')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center group hover:transform hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500/30 transition-colors">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div className="text-3xl font-bold text-green-300">25%</div>
                  <div className="text-blue-200 text-sm">{t('numbers.growth.students')}</div>
                </div>
                <div className="text-center group hover:transform hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500/30 transition-colors">
                    <span className="text-2xl">🔬</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-300">40%</div>
                  <div className="text-blue-200 text-sm">{t('numbers.growth.research')}</div>
                </div>
                <div className="text-center group hover:transform hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500/30 transition-colors">
                    <span className="text-2xl">🌍</span>
                  </div>
                  <div className="text-3xl font-bold text-green-300">35%</div>
                  <div className="text-blue-200 text-sm">{t('numbers.growth.international')}</div>
                </div>
                <div className="text-center group hover:transform hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500/30 transition-colors">
                    <span className="text-2xl">💼</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-300">92%</div>
                  <div className="text-blue-200 text-sm">{t('numbers.growth.employment')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Дополнительная статистика */}
        <div className={`mt-12 md:mt-16 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
              {t('numbers.facilitiesTitle')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { icon: '🏟️', value: '12', label: t('numbers.facilities.sportsHalls') },
                { icon: '🏊', value: '8', label: t('numbers.facilities.pools') },
                { icon: '💪', value: '25', label: t('numbers.facilities.gyms') },
                { icon: '🔬', value: '15', label: t('numbers.facilities.labs') }
              ].map((facility, index) => (
                <div
                  key={index}
                  className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:from-blue-500/30 group-hover:to-green-500/30 transition-colors">
                    <span className="text-2xl">{facility.icon}</span>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {facility.value}
                  </div>
                  <div className="text-blue-200 text-sm">
                    {facility.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Плавающие декоративные элементы */}
      <div className="absolute bottom-10 left-10 w-8 h-8 bg-green-400/20 rounded-full animate-bounce hidden md:block"></div>
      <div className="absolute top-10 right-10 w-6 h-6 bg-blue-400/20 rounded-full animate-ping hidden md:block"></div>
      <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-white/30 rounded-full animate-pulse hidden md:block"></div>
    </section>
  );
};

export default AcademyNumbers;