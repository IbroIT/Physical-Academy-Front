// components/AcademyAccreditation.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccreditations } from '../../../hooks/useApi';
import { PageLoading, ErrorDisplay, EmptyState } from '../../common/Loading';

const AcademyAccreditation = () => {
  const { t } = useTranslation();
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [expandedAccreditation, setExpandedAccreditation] = useState(null);

  const { accreditations: apiAccreditations, loading, error, refetch } = useAccreditations(showActiveOnly);

  if (loading) {
    return <PageLoading message={t('accreditation.loading', 'Загрузка аккредитаций...')} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
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
      logo: '/api/placeholder/120/60',
      validity: t('academy.accreditation.national.validity', 'Действительна до 2025 года'),
      description: t('academy.accreditation.national.description', 'Государственная аккредитация образовательных программ'),
      benefits: [
        t('academy.accreditation.national.benefits.0', 'Признание дипломов государством'),
        t('academy.accreditation.national.benefits.1', 'Возможность трудоустройства в государственных организациях'),
        t('academy.accreditation.national.benefits.2', 'Соответствие государственным стандартам образования')
      ],
      is_active: true,
      accreditation_type: 'national'
    },
    {
      id: 2,
      organization: t('academy.accreditation.international.organization', 'Международная ассоциация качества образования'),
      logo: '/api/placeholder/120/60',
      validity: t('academy.accreditation.international.validity', 'Действительна до 2026 года'),
      description: t('academy.accreditation.international.description', 'Международное признание качества образования'),
      benefits: [
        t('academy.accreditation.international.benefits.0', 'Международное признание дипломов'),
        t('academy.accreditation.international.benefits.1', 'Возможность обучения за рубежом'),
        t('academy.accreditation.international.benefits.2', 'Участие в международных программах обмена')
      ],
      is_active: true,
      accreditation_type: 'international'
    },
    {
      id: 3,
      organization: t('academy.accreditation.professional.organization', 'Профессиональная ассоциация тренеров'),
      logo: '/api/placeholder/120/60',
      validity: t('academy.accreditation.professional.validity', 'Действительна до 2024 года'),
      description: t('academy.accreditation.professional.description', 'Профессиональная аккредитация специализированных программ'),
      benefits: [
        t('academy.accreditation.professional.benefits.0', 'Профессиональная сертификация'),
        t('academy.accreditation.professional.benefits.1', 'Членство в профессиональных ассоциациях'),
        t('academy.accreditation.professional.benefits.2', 'Повышенные карьерные возможности')
      ],
      is_active: true,
      accreditation_type: 'professional'
    }
  ];

  const toggleAccreditation = (id) => {
    setExpandedAccreditation(expandedAccreditation === id ? null : id);
  };

  const getStatusColor = (accreditation) => {
    if (!accreditation.is_valid) return 'bg-red-100 text-red-800 border-red-200';
    if (!accreditation.is_active) return 'bg-gray-100 text-gray-800 border-gray-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'national': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'international': return 'bg-green-100 text-green-800 border-green-200';
      case 'professional': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('academy.accreditation.title', 'Аккредитация академии')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('academy.accreditation.subtitle', 'Официальные аккредитации и сертификаты, подтверждающие высокое качество образования и соответствие международным стандартам')}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-blue-50 rounded-2xl p-6 text-center border border-blue-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {accreditations.filter(acc => acc.is_valid).length}
            </div>
            <div className="text-blue-800 font-medium">
              {t('accreditation.stats.active', 'Активных аккредитаций')}
            </div>
          </div>
          <div className="bg-green-50 rounded-2xl p-6 text-center border border-green-100">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {accreditations.filter(acc => acc.accreditation_type === 'international').length}
            </div>
            <div className="text-green-800 font-medium">
              {t('accreditation.stats.international', 'Международных')}
            </div>
          </div>
          <div className="bg-blue-50 rounded-2xl p-6 text-center border border-blue-100">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {accreditations.filter(acc => acc.accreditation_type === 'national').length}
            </div>
            <div className="text-blue-800 font-medium">
              {t('accreditation.stats.national', 'Национальных')}
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
            <div className="text-3xl font-bold text-gray-600 mb-2">
              {accreditations.length}
            </div>
            <div className="text-gray-800 font-medium">
              {t('accreditation.stats.total', 'Всего')}
            </div>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-2xl p-2 flex">
            <button
              onClick={() => setShowActiveOnly(true)}
              className={`px-8 py-3 rounded-xl transition-all duration-300 font-medium ${
                showActiveOnly
                  ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {t('accreditation.filters.active', 'Активные аккредитации')}
            </button>
            <button
              onClick={() => setShowActiveOnly(false)}
              className={`px-8 py-3 rounded-xl transition-all duration-300 font-medium ${
                !showActiveOnly
                  ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {t('accreditation.filters.all', 'Все аккредитации')}
            </button>
          </div>
        </div>

        {/* Accreditations Grid */}
        {accreditations.length > 0 ? (
          <div className="space-y-6 mb-16">
            {accreditations.map((accreditation) => (
              <div
                key={accreditation.id}
                className="bg-white rounded-2xl border border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden"
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleAccreditation(accreditation.id)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Logo */}
                      <div className="flex-shrink-0">
                        {accreditation.organization_logo_url ? (
                          <img
                            src={accreditation.organization_logo_url}
                            alt={accreditation.organization}
                            className="h-16 w-16 object-contain rounded-lg bg-gray-50 p-2"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                            <span className="text-2xl">🏆</span>
                          </div>
                        )}
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {accreditation.name || accreditation.organization}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(accreditation.accreditation_type)}`}>
                            {getTypeIcon(accreditation.accreditation_type)} {accreditation.accreditation_type_display || accreditation.accreditation_type}
                          </span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(accreditation)}`}>
                            {accreditation.is_valid ? '✅ Действующая' : '❌ Недействующая'}
                          </span>
                        </div>
                        {accreditation.description && (
                          <p className="text-gray-600 line-clamp-2">
                            {accreditation.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex items-center gap-4">
                      {/* Dates */}
                      <div className="text-right">
                        {accreditation.issue_date && (
                          <div className="text-sm text-gray-500">
                            Выдан: {new Date(accreditation.issue_date).toLocaleDateString('ru-RU')}
                          </div>
                        )}
                        {accreditation.expiry_date && (
                          <div className="text-sm font-medium text-gray-900">
                            Действует до: {new Date(accreditation.expiry_date).toLocaleDateString('ru-RU')}
                          </div>
                        )}
                      </div>

                      {/* Expand Button */}
                      <button className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                        <svg 
                          className={`w-5 h-5 transform transition-transform ${
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
                  <div className="px-6 pb-6 border-t border-gray-100 pt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Details */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 text-lg">Детали аккредитации</h4>
                        
                        {accreditation.certificate_number && (
                          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600">🆔</span>
                            </div>
                            <div>
                              <div className="text-sm text-blue-600 font-medium">Номер сертификата</div>
                              <div className="text-gray-900">{accreditation.certificate_number}</div>
                            </div>
                          </div>
                        )}

                        {/* Benefits */}
                        {(accreditation.benefits || accreditation.description) && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h5 className="font-semibold text-gray-900 mb-3">Преимущества</h5>
                            <ul className="space-y-2">
                              {accreditation.benefits ? (
                                accreditation.benefits.map((benefit, index) => (
                                  <li key={index} className="flex items-start gap-2 text-gray-700">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span>{benefit}</span>
                                  </li>
                                ))
                              ) : (
                                <li className="text-gray-700">{accreditation.description}</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 text-lg">Документы</h4>
                        
                        {accreditation.certificate_image_url && (
                          <a
                            href={accreditation.certificate_image_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-4 bg-white border border-green-200 rounded-lg hover:border-green-300 transition-colors group"
                          >
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                              <span className="text-green-600 text-xl">📄</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">Сертификат аккредитации</div>
                              <div className="text-sm text-gray-500">PDF документ</div>
                            </div>
                            <div className="text-green-600 group-hover:text-green-700">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </a>
                        )}

                        {/* Additional documents can be added here */}
                        <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-blue-800 text-sm">
                            💡 Аккредитация подтверждает соответствие образовательных программ международным стандартам качества
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

        {/* Quality Standards Section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t('accreditation.standards.title', 'Стандарты качества образования')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                area: t('academy.accreditation.standards.education.area', 'Качество образования'),
                compliance: '100%',
                status: t('academy.accreditation.standards.education.status', 'Полное соответствие'),
                icon: '🎓'
              },
              {
                area: t('academy.accreditation.standards.faculty.area', 'Квалификация преподавателей'),
                compliance: '98%',
                status: t('academy.accreditation.standards.faculty.status', 'Высокий уровень'),
                icon: '👨‍🏫'
              },
              {
                area: t('academy.accreditation.standards.infrastructure.area', 'Инфраструктура'),
                compliance: '95%',
                status: t('academy.accreditation.standards.infrastructure.status', 'Современное оснащение'),
                icon: '🏛️'
              },
              {
                area: t('academy.accreditation.standards.research.area', 'Научная деятельность'),
                compliance: '92%',
                status: t('academy.accreditation.standards.research.status', 'Активные исследования'),
                icon: '🔬'
              }
            ].map((standard, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center border border-gray-200 hover:border-blue-300 transition-colors">
                <div className="text-4xl mb-4">{standard.icon}</div>
                <h4 className="font-bold text-gray-900 mb-2">{standard.area}</h4>
                <div className="text-2xl font-bold text-blue-600 mb-2">{standard.compliance}</div>
                <div className="text-green-600 font-medium">{standard.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="text-center">
          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('accreditation.additional.title', 'Нужна дополнительная информация?')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {t('accreditation.additional.description', 'Свяжитесь с нами для получения полной информации об аккредитациях и сертификатах качества')}
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
              {t('accreditation.additional.contact', 'Связаться с нами')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyAccreditation;