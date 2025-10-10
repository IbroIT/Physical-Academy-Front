// components/AcademyAccreditation.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccreditations } from '../../../hooks/useApi';
import { PageLoading, ErrorDisplay, EmptyState } from '../../common/Loading';

const AcademyAccreditation = () => {
  const { t, i18n } = useTranslation();
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [expandedAccreditation, setExpandedAccreditation] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  const { accreditations: apiAccreditations, loading, error, refetch } = useAccreditations(showActiveOnly);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
          startCounters();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const startCounters = () => {
    const targetValues = [
      apiAccreditations?.filter(acc => acc.is_valid).length || 3,
      apiAccreditations?.filter(acc => acc.accreditation_type === 'international').length || 1,
      apiAccreditations?.filter(acc => acc.accreditation_type === 'national').length || 1,
      apiAccreditations?.length || 3
    ];
    
    const duration = 2000;
    
    targetValues.forEach((target, index) => {
      const startTime = performance.now();
      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(easeOutQuart * target);
        
        setCounterValues(prev => {
          const newValues = [...prev];
          newValues[index] = currentValue;
          return newValues;
        });
        
        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        }
      };
      requestAnimationFrame(updateCounter);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 flex items-center justify-center">
        <PageLoading message={t('accreditation.loading', 'Загрузка аккредитаций...')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ErrorDisplay
            error={error}
            onRetry={refetch}
            className="max-w-md mx-auto"
          />
        </div>
      </div>
    );
  }

  // Use API data if available, otherwise fallback to static data
  const accreditations = apiAccreditations && apiAccreditations.length > 0 ? apiAccreditations : [
    {
      id: 1,
      organization: t('academy.accreditation.national.organization', 'Национальное агентство по аккредитации'),
      logo: '/images/accreditation/national.jpg',
      validity: t('academy.accreditation.national.validity', 'Действительна до 2025 года'),
      description: t('academy.accreditation.national.description', 'Государственная аккредитация образовательных программ'),
      benefits: [
        t('academy.accreditation.national.benefits.0', 'Признание дипломов государством'),
        t('academy.accreditation.national.benefits.1', 'Возможность трудоустройства в государственных организациях'),
        t('academy.accreditation.national.benefits.2', 'Соответствие государственным стандартам образования')
      ],
      is_active: true,
      accreditation_type: 'national',
      certificate_number: 'GOS-2023-001',
      issue_date: '2023-01-15',
      expiry_date: '2025-01-15'
    },
    {
      id: 2,
      organization: t('academy.accreditation.international.organization', 'Международная ассоциация качества образования'),
      logo: '/images/accreditation/international.jpg',
      validity: t('academy.accreditation.international.validity', 'Действительна до 2026 года'),
      description: t('academy.accreditation.international.description', 'Международное признание качества образования'),
      benefits: [
        t('academy.accreditation.international.benefits.0', 'Международное признание дипломов'),
        t('academy.accreditation.international.benefits.1', 'Возможность обучения за рубежом'),
        t('academy.accreditation.international.benefits.2', 'Участие в международных программах обмена')
      ],
      is_active: true,
      accreditation_type: 'international',
      certificate_number: 'INT-2023-045',
      issue_date: '2023-03-20',
      expiry_date: '2026-03-20'
    },
    {
      id: 3,
      organization: t('academy.accreditation.professional.organization', 'Профессиональная ассоциация тренеров'),
      logo: '/images/accreditation/professional.jpg',
      validity: t('academy.accreditation.professional.validity', 'Действительна до 2024 года'),
      description: t('academy.accreditation.professional.description', 'Профессиональная аккредитация специализированных программ'),
      benefits: [
        t('academy.accreditation.professional.benefits.0', 'Профессиональная сертификация'),
        t('academy.accreditation.professional.benefits.1', 'Членство в профессиональных ассоциациях'),
        t('academy.accreditation.professional.benefits.2', 'Повышенные карьерные возможности')
      ],
      is_active: true,
      accreditation_type: 'professional',
      certificate_number: 'PRO-2023-089',
      issue_date: '2023-02-10',
      expiry_date: '2024-02-10'
    }
  ];

  const toggleAccreditation = (id) => {
    setExpandedAccreditation(expandedAccreditation === id ? null : id);
  };

  const getStatusColor = (accreditation) => {
    if (!accreditation.is_valid) return 'bg-red-500/20 text-red-300 border-red-400/30';
    if (!accreditation.is_active) return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    return 'bg-green-500/20 text-green-300 border-green-400/30';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'national': return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'international': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'professional': return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'national': return '🏛️';
      case 'international': return '🌍';
      case 'professional': return '💼';
      default: return '📋';
    }
  };

  const stats = [
    {
      value: counterValues[0],
      label: t('accreditation.stats.active', 'Активных аккредитаций'),
      color: 'from-blue-500 to-blue-600',
      icon: '✅'
    },
    {
      value: counterValues[1],
      label: t('accreditation.stats.international', 'Международных'),
      color: 'from-green-500 to-green-600',
      icon: '🌍'
    },
    {
      value: counterValues[2],
      label: t('accreditation.stats.national', 'Национальных'),
      color: 'from-blue-500 to-green-500',
      icon: '🇷🇺'
    },
    {
      value: counterValues[3],
      label: t('accreditation.stats.total', 'Всего'),
      color: 'from-green-500 to-blue-500',
      icon: '🏆'
    }
  ];

  const standards = [
    {
      area: t('accreditation.standards.education.area', 'Качество образования'),
      compliance: '100%',
      status: t('accreditation.standards.education.status', 'Полное соответствие'),
      icon: '🎓',
      color: 'from-blue-500 to-blue-600'
    },
    {
      area: t('accreditation.standards.faculty.area', 'Квалификация преподавателей'),
      compliance: '98%',
      status: t('accreditation.standards.faculty.status', 'Высокий уровень'),
      icon: '👨‍🏫',
      color: 'from-green-500 to-green-600'
    },
    {
      area: t('accreditation.standards.infrastructure.area', 'Инфраструктура'),
      compliance: '95%',
      status: t('accreditation.standards.infrastructure.status', 'Современное оснащение'),
      icon: '🏛️',
      color: 'from-blue-500 to-green-500'
    },
    {
      area: t('accreditation.standards.research.area', 'Научная деятельность'),
      compliance: '92%',
      status: t('accreditation.standards.research.status', 'Активные исследования'),
      icon: '🔬',
      color: 'from-green-500 to-blue-500'
    }
  ];

  // Helper function to format dates according to current language
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 mb-6 group hover:bg-white/20 transition-all duration-300">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-green-300 font-medium text-sm md:text-base">
              {t('accreditation.badge', 'Аккредитация')}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('accreditation.title', 'АККРЕДИТАЦИЯ АКАДЕМИИ')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4 leading-relaxed">
            {t('accreditation.subtitle', 'Официальные аккредитации и сертификаты, подтверждающие высокое качество образования и соответствие международным стандартам')}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group relative bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 border border-white/20 shadow-2xl transition-all duration-500 hover:scale-105 hover:border-green-400/30 text-center"
            >
              {/* Иконка */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                {stat.icon}
              </div>

              {/* Число с анимацией */}
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 font-mono">
                {stat.value}
              </div>

              {/* Описание */}
              <div className="text-blue-100 font-medium text-sm md:text-base">{stat.label}</div>

              {/* Декоративные элементы */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-ping"></div>
            </div>
          ))}
        </div>

        {/* Filter Toggle */}
        <div className={`flex justify-center mb-12 transition-all duration-1000 delay-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 border border-white/20 shadow-lg">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setShowActiveOnly(true)}
                className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                  showActiveOnly
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg transform scale-105'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {t('accreditation.filters.active', 'Активные аккредитации')}
              </button>
              <button
                onClick={() => setShowActiveOnly(false)}
                className={`px-6 py-3 rounded-xl transition-all duration-300 font-medium ${
                  !showActiveOnly
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg transform scale-105'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {t('accreditation.filters.all', 'Все аккредитации')}
              </button>
            </div>
          </div>
        </div>

        {/* Accreditations Grid */}
        <div className={`transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {accreditations.length > 0 ? (
            <div className="space-y-6 mb-16">
              {accreditations.map((accreditation, index) => (
                <div
                  key={accreditation.id}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 hover:border-green-400/30 transition-all duration-500 overflow-hidden group hover:scale-102"
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div 
                    className="p-6 md:p-8 cursor-pointer"
                    onClick={() => toggleAccreditation(accreditation.id)}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-center gap-4 md:gap-6 flex-1">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500/20 to-green-500/20 border border-white/20 flex items-center justify-center p-4 group-hover:scale-110 transition-transform duration-300">
                            {accreditation.organization_logo_url ? (
                              <img
                                src={accreditation.organization_logo_url}
                                alt={accreditation.organization}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-3xl">{getTypeIcon(accreditation.accreditation_type)}</span>
                            )}
                          </div>
                        </div>

                        {/* Main Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-green-300 transition-colors">
                            {accreditation.name || accreditation.organization}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(accreditation.accreditation_type)}`}>
                              {getTypeIcon(accreditation.accreditation_type)} {t(`accreditation.type.${accreditation.accreditation_type}`, accreditation.accreditation_type)}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(accreditation)}`}>
                              {accreditation.is_valid ? 
                                t('accreditation.status.active', '✅ Действующая') : 
                                t('accreditation.status.inactive', '❌ Недействующая')}
                            </span>
                          </div>
                          {accreditation.description && (
                            <p className="text-blue-100 line-clamp-2">
                              {accreditation.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Area */}
                      <div className="flex items-center gap-4 md:gap-6">
                        {/* Dates */}
                        <div className="text-right">
                          {accreditation.issue_date && (
                            <div className="text-sm text-blue-200">
                              {t('accreditation.issued', 'Выдан')}: {formatDate(accreditation.issue_date)}
                            </div>
                          )}
                          {accreditation.expiry_date && (
                            <div className="text-sm font-medium text-green-300">
                              {t('accreditation.validUntil', 'Действует до')}: {formatDate(accreditation.expiry_date)}
                            </div>
                          )}
                        </div>

                        {/* Expand Button */}
                        <button className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors group-hover:scale-110">
                          <svg 
                            className={`w-6 h-6 transform transition-transform ${
                              expandedAccreditation === accreditation.id ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedAccreditation === accreditation.id && (
                    <div className="px-6 md:px-8 pb-6 md:pb-8 border-t border-white/10 pt-6 md:pt-8 animate-fadeIn">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Details */}
                        <div className="space-y-6">
                          <h4 className="font-bold text-white text-xl flex items-center">
                            <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                            {t('accreditation.details.title', 'Детали аккредитации')}
                          </h4>
                          
                          {accreditation.certificate_number && (
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-green-400/30 transition-colors">
                              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
                                <span className="text-blue-300 text-xl">🆔</span>
                              </div>
                              <div>
                                <div className="text-blue-300 font-medium">
                                  {t('accreditation.certificateNumber', 'Номер сертификата')}
                                </div>
                                <div className="text-white text-lg">{accreditation.certificate_number}</div>
                              </div>
                            </div>
                          )}

                          {/* Benefits */}
                          {(accreditation.benefits || accreditation.description) && (
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                              <h5 className="font-semibold text-white mb-4 flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                                {t('accreditation.benefits.title', 'Преимущества')}
                              </h5>
                              <ul className="space-y-3">
                                {accreditation.benefits ? (
                                  accreditation.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-3 text-blue-100 group hover:text-white transition-colors">
                                      <span className="text-green-400 mt-1 text-lg flex-shrink-0">✓</span>
                                      <span>{benefit}</span>
                                    </li>
                                  ))
                                ) : (
                                  <li className="text-blue-100">{accreditation.description}</li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-6">
                          <h4 className="font-bold text-white text-xl flex items-center">
                            <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
                            {t('accreditation.documents.title', 'Документы')}
                          </h4>
                          
                          {accreditation.certificate_image_url && (
                            <a
                              href={accreditation.certificate_image_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-4 p-6 bg-white/5 border border-green-400/30 rounded-2xl hover:border-green-400/50 transition-all duration-300 group hover:scale-102"
                            >
                              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                                <span className="text-green-300 text-2xl">📄</span>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-white">
                                  {t('accreditation.certificate.title', 'Сертификат аккредитации')}
                                </div>
                                <div className="text-blue-200 text-sm">
                                  {t('accreditation.certificate.format', 'PDF документ')}
                                </div>
                              </div>
                              <div className="text-green-300 group-hover:text-green-400 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                            </a>
                          )}

                          {/* Info Box */}
                          <div className="p-6 bg-blue-500/10 rounded-2xl border border-blue-400/30">
                            <p className="text-blue-100 text-center">
                              <span className="text-green-300 mr-2">💡</span>
                              {t('accreditation.info', 'Аккредитация подтверждает соответствие образовательных программ международным стандартам качества')}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              message={showActiveOnly ?
                t('accreditation.empty.active', 'Активные аккредитации не найдены') :
                t('accreditation.empty.all', 'Аккредитации не найдены')
              }
              icon={<div className="text-6xl mb-4">🏆</div>}
            />
          )}
        </div>

        {/* Quality Standards Section */}
        <div className={`bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl p-8 md:p-12 mb-12 border border-white/20 shadow-2xl transition-all duration-1000 delay-900 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h3 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 md:mb-16">
            {t('accreditation.standards.title', 'Стандарты качества образования')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((standard, index) => (
              <div 
                key={index}
                className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 hover:border-green-400/30 transition-all duration-500 hover:scale-105"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${standard.color} flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {standard.icon}
                </div>
                <h4 className="font-bold text-white mb-3 text-lg">{standard.area}</h4>
                <div className="text-3xl font-bold text-green-300 mb-2">{standard.compliance}</div>
                <div className="text-blue-200 font-medium">{standard.status}</div>
                
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-2000"
                      style={{ width: standard.compliance }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Плавающие элементы для десктопа */}
      <div className="absolute bottom-20 left-5 w-6 h-6 bg-green-400/20 rounded-full animate-bounce hidden md:block"></div>
      <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping hidden md:block"></div>
    </section>
  );
};

export default AcademyAccreditation;