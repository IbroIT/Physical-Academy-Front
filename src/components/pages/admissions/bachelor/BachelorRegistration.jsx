// components/BachelorRegistration.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorRegistration = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const admissionSteps = [
    { 
      number: 1, 
      title: t('bachelor.admission.steps.consultation.title'), 
      icon: '👤',
      description: t('bachelor.admission.steps.consultation.description'),
      colorClass: 'from-blue-500 to-blue-600'
    },
    { 
      number: 2, 
      title: t('bachelor.admission.steps.documents.title'), 
      icon: '📄',
      description: t('bachelor.admission.steps.documents.description'),
      colorClass: 'from-green-500 to-green-600'
    },
    { 
      number: 3, 
      title: t('bachelor.admission.steps.exams.title'), 
      icon: '✍️',
      description: t('bachelor.admission.steps.exams.description'),
      colorClass: 'from-blue-500 to-green-500'
    },
    { 
      number: 4, 
      title: t('bachelor.admission.steps.enrollment.title'), 
      icon: '✅',
      description: t('bachelor.admission.steps.enrollment.description'),
      colorClass: 'from-green-500 to-blue-500'
    }
  ];

  const programs = [
    { id: 'sports_science', name: t('bachelor.admission.programs.sports_science'), duration: '4 года' },
    { id: 'physical_education', name: t('bachelor.admission.programs.physical_education'), duration: '4 года' },
    { id: 'sports_management', name: t('bachelor.admission.programs.sports_management'), duration: '4 года' },
    { id: 'rehabilitation', name: t('bachelor.admission.programs.rehabilitation'), duration: '4 года' },
    { id: 'coaching', name: t('bachelor.admission.programs.coaching'), duration: '4 года' }
  ];

  const deadlines = [
    { 
      period: t('bachelor.admission.deadlines.main.period'), 
      date: t('bachelor.admission.deadlines.main.date'),
      status: 'active'
    },
    { 
      period: t('bachelor.admission.deadlines.additional.period'), 
      date: t('bachelor.admission.deadlines.additional.date'),
      status: 'upcoming'
    }
  ];

  const requirements = [
    t('bachelor.admission.requirements.age'),
    t('bachelor.admission.requirements.education'),
    t('bachelor.admission.requirements.exams'),
    t('bachelor.admission.requirements.language'),
    t('bachelor.admission.requirements.health')
  ];

  const documents = [
    { name: t('bachelor.admission.documents.passport'), required: true },
    { name: t('bachelor.admission.documents.diploma'), required: true },
    { name: t('bachelor.admission.documents.photos'), required: true },
    { name: t('bachelor.admission.documents.medical'), required: true },
    { name: t('bachelor.admission.documents.military'), required: false }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 mb-6 group hover:bg-white/20 transition-all duration-300">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-green-300 font-medium text-sm md:text-base">
              {t('bachelor.admission.badge')}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('bachelor.admission.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto px-4 leading-relaxed">
            {t('bachelor.admission.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          {/* Основной контент */}
          <div className="lg:col-span-2 space-y-8">
            {/* Процесс поступления */}
            <div className={`bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 p-6 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-blue-400">🎯</span>
                {t('bachelor.admission.process.title')}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {admissionSteps.map((step, index) => (
                  <div
                    key={step.number}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 group ${
                      `bg-gradient-to-br ${step.colorClass} border-white/30 text-white shadow-2xl`
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-semibold text-lg bg-white/20`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-lg font-semibold text-white mb-2">
                        {step.title}
                      </div>
                      <div className="text-white/90 text-sm">
                        {step.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Программы обучения */}
            <div className={`bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 p-6 transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-green-400">🎓</span>
                {t('bachelor.admission.programs.title')}
              </h3>
              <div className="space-y-4">
                {programs.map((program) => (
                  <div key={program.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/20 hover:border-blue-400 transition-colors group">
                    <div>
                      <div className="font-semibold text-white group-hover:text-green-300 transition-colors">
                        {program.name}
                      </div>
                      <div className="text-blue-200 text-sm">
                        {t('bachelor.admission.programs.duration')}: {program.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Боковая панель */}
          <div className="space-y-8">
            {/* Требования */}
            <div className={`bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 p-6 transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h3 className="font-semibold text-white mb-4 text-lg flex items-center gap-2">
                <span className="text-blue-400">📋</span>
                <span>{t('bachelor.admission.requirementsTitle')}</span>
              </h3>
              <ul className="space-y-3">
                {requirements.map((requirement, idx) => (
                  <li key={idx} className="flex items-start gap-3 group">
                    <div className="w-5 h-5 bg-blue-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-green-400/30 transition-colors duration-300">
                      <div className="w-2 h-2 bg-blue-400 rounded-full group-hover:bg-green-400 transition-colors duration-300"></div>
                    </div>
                    <span className="text-blue-100 text-sm group-hover:text-white transition-colors duration-300">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Сроки подачи */}
            <div className={`bg-orange-500/20 backdrop-blur-lg border border-orange-400/30 rounded-2xl md:rounded-3xl p-6 transition-all duration-1000 delay-900 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h3 className="font-semibold text-orange-300 mb-4 flex items-center gap-2">
                <span className="text-orange-400">⏰</span>
                <span>{t('bachelor.admission.deadlinesTitle')}</span>
              </h3>
              <div className="space-y-4">
                {deadlines.map((deadline, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border backdrop-blur-sm ${
                    deadline.status === 'active' 
                      ? 'bg-orange-500/10 border-orange-400/50' 
                      : 'bg-orange-500/5 border-orange-400/30'
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-orange-300 font-medium">{deadline.period}</span>
                      {deadline.status === 'active' && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full border border-orange-400/50">
                          {t('bachelor.admission.deadlines.active')}
                        </span>
                      )}
                    </div>
                    <div className="text-orange-200 font-bold">{deadline.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Необходимые документы */}
            <div className={`bg-purple-500/20 backdrop-blur-lg border border-purple-400/30 rounded-2xl md:rounded-3xl p-6 transition-all duration-1000 delay-1100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h3 className="font-semibold text-purple-300 mb-4 flex items-center gap-2">
                <span className="text-purple-400">📁</span>
                <span>{t('bachelor.admission.documents.title')}</span>
              </h3>
              <ul className="space-y-3">
                {documents.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-3 group">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      doc.required 
                        ? 'bg-purple-400/20 group-hover:bg-green-400/30' 
                        : 'bg-gray-400/20'
                    } transition-colors duration-300`}>
                      <div className={`w-2 h-2 rounded-full ${
                        doc.required ? 'text-purple-400 group-hover:text-green-400' : 'text-gray-400'
                      }`}>
                        {doc.required ? '✓' : '○'}
                      </div>
                    </div>
                    <span className={`text-sm ${
                      doc.required ? 'text-purple-100 group-hover:text-white' : 'text-gray-400'
                    } transition-colors duration-300`}>
                      {doc.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Контакты */}
            <div className={`bg-blue-500/20 backdrop-blur-lg border border-blue-400/30 rounded-2xl md:rounded-3xl p-6 transition-all duration-1000 delay-1300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h3 className="font-semibold text-blue-300 mb-4 flex items-center gap-2">
                <span className="text-blue-400">📞</span>
                <span>{t('bachelor.admission.contacts.title')}</span>
              </h3>
              <div className="space-y-3 text-blue-200 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">📧</span>
                  <span>{t('bachelor.admission.contacts.email')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">📱</span>
                  <span>{t('bachelor.admission.contacts.phone')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">🏛️</span>
                  <span>{t('bachelor.admission.contacts.address')}</span>
                </div>
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
        </>
      )}
    </section>
  );
};

export default BachelorRegistration;