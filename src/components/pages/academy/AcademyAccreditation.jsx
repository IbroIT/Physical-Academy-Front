// components/AcademyAccreditation.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccreditations } from '../../../hooks/useApi';
import { PageLoading, ErrorDisplay, EmptyState, CardSkeleton } from '../../common/Loading';

const AcademyAccreditation = () => {
  const { t } = useTranslation();
  const [selectedAccreditation, setSelectedAccreditation] = useState(0);
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  // API integration
  const { accreditations: apiAccreditations, loading, error, refetch } = useAccreditations(showActiveOnly);

  // Early returns AFTER all hooks are called
  if (loading) {
    return <PageLoading message={t('accreditation.loading', 'Загрузка аккредитаций...')} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
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
      is_active: true
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
      is_active: true
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
      is_active: true
    }
  ];

  const qualityStandards = [
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
  ];

  const documents = [
    {
      name: t('academy.accreditation.documents.license.name', 'Лицензия на образовательную деятельность'),
      size: '2.4 МБ',
      type: 'PDF',
      url: '/documents/license.pdf'
    },
    {
      name: t('academy.accreditation.documents.accreditation.name', 'Свидетельство об аккредитации'),
      size: '3.1 МБ',
      type: 'PDF',
      url: '/documents/accreditation.pdf'
    },
    {
      name: t('academy.accreditation.documents.charter.name', 'Устав академии'),
      size: '1.8 МБ',
      type: 'PDF',
      url: '/documents/charter.pdf'
    },
    {
      name: t('academy.accreditation.documents.report.name', 'Отчет о самообследовании'),
      size: '4.2 МБ',
      type: 'PDF',
      url: '/documents/report.pdf'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
            {t('academy.accreditation.title', 'Аккредитация академии')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('academy.accreditation.subtitle', 'Официальные аккредитации и сертификаты качества образования')}
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setShowActiveOnly(true)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${showActiveOnly
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:text-green-600'
                }`}
            >
              {t('accreditation.filters.active', 'Активные аккредитации')}
            </button>
            <button
              onClick={() => setShowActiveOnly(false)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${!showActiveOnly
                ? 'bg-green-600 text-white shadow-md'
                : 'text-gray-600 hover:text-green-600'
                }`}
            >
              {t('accreditation.filters.all', 'Все аккредитации')}
            </button>
          </div>
        </div>

        {/* Accreditations Grid */}
        {apiAccreditations && apiAccreditations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {apiAccreditations.map((accreditation) => (
              <div
                key={accreditation.id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-green-300"
              >
                {/* Organization Logo */}
                <div className="flex items-center justify-center mb-6">
                  {accreditation.organization_logo_url ? (
                    <img
                      src={accreditation.organization_logo_url}
                      alt={accreditation.organization}
                      className="h-16 w-auto object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-16 h-16 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center ${accreditation.organization_logo_url ? 'hidden' : 'flex'}`}
                  >
                    <span className="text-2xl">🏆</span>
                  </div>
                </div>

                {/* Accreditation Info */}
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {accreditation.name}
                  </h3>

                  <div className="bg-green-50 rounded-lg py-2 px-4 border border-green-200">
                    <p className="text-blue-700 font-semibold text-sm">
                      🏛️ {accreditation.organization}
                    </p>
                  </div>

                  {/* Accreditation Type */}
                  {accreditation.accreditation_type_display && (
                    <div className="inline-block bg-blue-50 rounded-full px-3 py-1">
                      <span className="text-xs text-blue-600 font-medium">
                        📋 {accreditation.accreditation_type_display}
                      </span>
                    </div>
                  )}

                  {/* Raw accreditation type for developers */}
                  {accreditation.accreditation_type && (
                    <div className="inline-block bg-gray-50 rounded-full px-3 py-1 ml-2">
                      <span className="text-xs text-gray-600 font-medium">
                        🔧 Type: {accreditation.accreditation_type}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {accreditation.description && (
                    <div className="bg-gray-50 rounded-lg p-3 text-left">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        <strong>📝 Описание:</strong> {accreditation.description}
                      </p>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="space-y-2 text-xs text-gray-500 bg-blue-50 rounded-lg p-3">
                    <p className="font-semibold text-gray-700 mb-2">📅 Даты:</p>
                    {accreditation.issue_date && (
                      <p className="flex items-center justify-between">
                        <span>Выдан:</span>
                        <span className="font-medium">{new Date(accreditation.issue_date).toLocaleDateString('ru-RU')}</span>
                      </p>
                    )}
                    {accreditation.expiry_date && (
                      <p className="flex items-center justify-between">
                        <span>Действителен до:</span>
                        <span className="font-medium">{new Date(accreditation.expiry_date).toLocaleDateString('ru-RU')}</span>
                      </p>
                    )}
                    {accreditation.created_at && (
                      <p className="flex items-center justify-between">
                        <span>Создан:</span>
                        <span className="font-medium">{new Date(accreditation.created_at).toLocaleDateString('ru-RU')}</span>
                      </p>
                    )}
                    {accreditation.updated_at && (
                      <p className="flex items-center justify-between">
                        <span>Обновлен:</span>
                        <span className="font-medium">{new Date(accreditation.updated_at).toLocaleDateString('ru-RU')}</span>
                      </p>
                    )}
                  </div>

                  {/* Certificate Number */}
                  {accreditation.certificate_number && (
                    <div className="bg-yellow-50 rounded-lg p-2">
                      <p className="text-sm font-semibold text-yellow-800">
                        🆔 Номер сертификата: {accreditation.certificate_number}
                      </p>
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${accreditation.is_valid
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      <div className={`w-2 h-2 rounded-full mr-1 ${accreditation.is_valid ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                      {accreditation.is_valid ? '✅ Действующая' : '❌ Недействующая'}
                    </span>

                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${accreditation.is_active
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {accreditation.is_active ? '🟢 Активная' : '🔴 Неактивная'}
                    </span>

                    {accreditation.order && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        #️⃣ Порядок: {accreditation.order}
                      </span>
                    )}
                  </div>

                  {/* Certificate Link */}
                  {accreditation.certificate_image_url && (
                    <div className="pt-4">
                      <a
                        href={accreditation.certificate_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        📄 Скачать сертификат
                      </a>
                    </div>
                  )}

                  {/* API ID for developers */}
                  <div className="text-xs text-gray-400 mt-2 border-t pt-2">
                    <p>🔧 ID: {accreditation.id}</p>
                    {accreditation.organization_logo && (
                      <p>🖼️ Logo path: {accreditation.organization_logo}</p>
                    )}
                    {accreditation.certificate_image && (
                      <p>📄 Certificate path: {accreditation.certificate_image}</p>
                    )}
                  </div>
                </div>
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

        {/* Statistics */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Статистика аккредитаций
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {apiAccreditations?.filter(acc => acc.is_valid).length || 0}
              </div>
              <div className="text-gray-600">Активных аккредитаций</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {apiAccreditations?.filter(acc => acc.accreditation_type === 'international').length || 0}
              </div>
              <div className="text-gray-600">Международных</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {apiAccreditations?.filter(acc => acc.accreditation_type === 'national').length || 0}
              </div>
              <div className="text-gray-600">Национальных</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {apiAccreditations?.length || 0}
              </div>
              <div className="text-gray-600">Всего</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyAccreditation;