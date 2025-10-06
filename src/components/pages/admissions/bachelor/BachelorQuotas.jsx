// components/BachelorQuotas.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorQuotas = () => {
  const { t } = useTranslation();
  const [selectedQuota, setSelectedQuota] = useState(0);
  const [expandedSection, setExpandedSection] = useState('requirements');

  const quotas = [
    {
      type: 'orphans',
      title: t('bachelor.quotas.types.orphans.title', 'Квота для сирот'),
      description: t('bachelor.quotas.types.orphans.description', 'Специальные условия для детей-сирот и детей, оставшихся без попечения родителей'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      requirements: [
        t('bachelor.quotas.types.orphans.requirements.0', 'Документ, подтверждающий статус сироты'),
        t('bachelor.quotas.types.orphans.requirements.1', 'Аттестат о среднем образовании'),
        t('bachelor.quotas.types.orphans.requirements.2', 'Медицинская справка 086/у')
      ],
      benefits: [
        t('bachelor.quotas.types.orphans.benefits.0', 'Бесплатное обучение'),
        t('bachelor.quotas.types.orphans.benefits.1', 'Проживание в общежитии'),
        t('bachelor.quotas.types.orphans.benefits.2', 'Социальная стипендия')
      ],
      spots: 25,
      deadline: '15 августа',
      color: 'blue'
    },
    {
      type: 'disabilities',
      title: t('bachelor.quotas.types.disabilities.title', 'Квота для лиц с инвалидностью'),
      description: t('bachelor.quotas.types.disabilities.description', 'Поддержка абитуриентов с ограниченными возможностями здоровья'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      requirements: [
        t('bachelor.quotas.types.disabilities.requirements.0', 'Медико-социальная экспертиза'),
        t('bachelor.quotas.types.disabilities.requirements.1', 'Индивидуальная программа реабилитации'),
        t('bachelor.quotas.types.disabilities.requirements.2', 'Аттестат с учетом особых условий')
      ],
      benefits: [
        t('bachelor.quotas.types.disabilities.benefits.0', 'Специальные условия обучения'),
        t('bachelor.quotas.types.disabilities.benefits.1', 'Доступная среда'),
        t('bachelor.quotas.types.disabilities.benefits.2', 'Персональный тьютор')
      ],
      spots: 20,
      deadline: '20 августа',
      color: 'green'
    },
    {
      type: 'target',
      title: t('bachelor.quotas.types.target.title', 'Целевая квота'),
      description: t('bachelor.quotas.types.target.description', 'Обучение по направлению от предприятий-партнеров'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      requirements: [
        t('bachelor.quotas.types.target.requirements.0', 'Направление от предприятия-партнера'),
        t('bachelor.quotas.types.target.requirements.1', 'Трехсторонний договор'),
        t('bachelor.quotas.types.target.requirements.2', 'Обязательство отработать 3 года')
      ],
      benefits: [
        t('bachelor.quotas.types.target.benefits.0', 'Гарантированное трудоустройство'),
        t('bachelor.quotas.types.target.benefits.1', 'Стажировка на предприятии'),
        t('bachelor.quotas.types.target.benefits.2', 'Дополнительная стипендия от предприятия')
      ],
      spots: 30,
      deadline: '10 августа',
      color: 'purple'
    }
  ];

  const quotaStats = [
    { 
      number: '15%', 
      label: t('bachelor.quotas.stats.totalQuotas', 'от общего количества мест'),
      description: t('bachelor.quotas.stats.totalQuotasDesc', 'Выделено по квотам')
    },
    { 
      number: '50+', 
      label: t('bachelor.quotas.stats.studentsYear', 'студентов ежегодно'),
      description: t('bachelor.quotas.stats.studentsYearDesc', 'Поступают по квотам')
    },
    { 
      number: '95%', 
      label: t('bachelor.quotas.stats.successRate', 'успешно зачисляются'),
      description: t('bachelor.quotas.stats.successRateDesc', 'Проходят конкурс')
    },
    { 
      number: '10', 
      label: t('bachelor.quotas.stats.partnerCompanies', 'компаний-партнеров'),
      description: t('bachelor.quotas.stats.partnerCompaniesDesc', 'Участвуют в целевых программах')
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700',
        light: 'bg-blue-100'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700',
        light: 'bg-green-100'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700',
        light: 'bg-purple-100'
      }
    };
    return colors[color] || colors.blue;
  };

  const currentQuota = quotas[selectedQuota];
  const colorClasses = getColorClasses(currentQuota.color);

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('bachelor.quotas.title', 'Образовательные квоты')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('bachelor.quotas.subtitle', 'Специальные программы поддержки для различных категорий абитуриентов')}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quotaStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {stat.number}
              </div>
              <div className="font-semibold text-gray-900 mb-2">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Quota Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {t('bachelor.quotas.availableQuotas', 'Доступные квоты')}
              </h2>
              <div className="space-y-3">
                {quotas.map((quota, index) => {
                  const quotaColor = getColorClasses(quota.color);
                  return (
                    <button
                      key={quota.type}
                      onClick={() => setSelectedQuota(index)}
                      className={`w-full p-4 rounded-lg border transition-all duration-200 text-left group ${
                        selectedQuota === index
                          ? `${quotaColor.border} ${quotaColor.bg} shadow-sm`
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedQuota === index ? quotaColor.light : 'bg-gray-100'
                        } ${selectedQuota === index ? quotaColor.text : 'text-gray-600'}`}>
                          {quota.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-sm ${
                            selectedQuota === index ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {quota.title}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {quota.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quota Details */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className={`${colorClasses.bg} ${colorClasses.border} p-6 border-b`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses.light} ${colorClasses.text}`}>
                      {currentQuota.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{currentQuota.title}</h2>
                      <p className="text-gray-600 mt-2">{currentQuota.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{t('bachelor.quotas.availableSpots', 'Доступно мест')}</div>
                    <div className="text-2xl font-bold text-gray-900">{currentQuota.spots}</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Navigation Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
                  <button
                    onClick={() => setExpandedSection('requirements')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      expandedSection === 'requirements'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {t('bachelor.quotas.requirements', 'Требования')}
                  </button>
                  <button
                    onClick={() => setExpandedSection('benefits')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      expandedSection === 'benefits'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {t('bachelor.quotas.benefits', 'Преимущества')}
                  </button>
                  <button
                    onClick={() => setExpandedSection('process')}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      expandedSection === 'process'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {t('bachelor.quotas.process', 'Процесс подачи')}
                  </button>
                </div>

                {/* Requirements Section */}
                {expandedSection === 'requirements' && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {t('bachelor.quotas.requiredDocuments', 'Необходимые документы')}
                        </h3>
                        <ul className="space-y-3">
                          {currentQuota.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {t('bachelor.quotas.deadlines', 'Сроки подачи')}
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700">{t('bachelor.quotas.applicationDeadline', 'Крайний срок подачи')}:</span>
                            <span className="font-semibold text-gray-900">{currentQuota.deadline}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {t('bachelor.quotas.recommendEarly', 'Рекомендуем подать документы заранее')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Benefits Section */}
                {expandedSection === 'benefits' && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          {t('bachelor.quotas.mainBenefits', 'Основные преимущества')}
                        </h3>
                        <ul className="space-y-3">
                          {currentQuota.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          {t('bachelor.quotas.additionalSupport', 'Дополнительная поддержка')}
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                          <div className="flex items-center text-sm text-gray-700">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                            {t('bachelor.quotas.support.mentoring', 'Персональный наставник')}
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                            {t('bachelor.quotas.support.career', 'Карьерное консультирование')}
                          </div>
                          <div className="flex items-center text-sm text-gray-700">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                            {t('bachelor.quotas.support.network', 'Доступ к профессиональной сети')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Process Section */}
                {expandedSection === 'process' && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">1</div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('bachelor.quotas.steps.consultation', 'Консультация')}</h4>
                        <p className="text-sm text-gray-600">{t('bachelor.quotas.steps.consultationDesc', 'Получите консультацию в приемной комиссии')}</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">2</div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('bachelor.quotas.steps.documents', 'Документы')}</h4>
                        <p className="text-sm text-gray-600">{t('bachelor.quotas.steps.documentsDesc', 'Подготовьте необходимый пакет документов')}</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">3</div>
                        <h4 className="font-semibold text-gray-900 mb-2">{t('bachelor.quotas.steps.submission', 'Подача')}</h4>
                        <p className="text-sm text-gray-600">{t('bachelor.quotas.steps.submissionDesc', 'Подайте заявление до установленного срока')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Application CTA */}
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {t('bachelor.quotas.readyToApply', 'Готовы подать заявление?')}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {t('bachelor.quotas.applicationDeadlineFull', 'Крайний срок подачи документов')}: <strong>{currentQuota.deadline}</strong>
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200">
                        {t('bachelor.quotas.downloadList', 'Скачать список документов')}
                      </button>
                      <button className={`px-6 py-3 text-white rounded-lg font-semibold transition-colors duration-200 ${colorClasses.button}`}>
                        {t('bachelor.quotas.applyNow', 'Подать заявление')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">
                    {t('bachelor.quotas.importantNotes', 'Важная информация')}
                  </h4>
                  <p className="text-yellow-700 text-sm">
                    {t('bachelor.quotas.notesDescription', 'Количество мест ограничено. Рекомендуем подавать документы заранее и уточнять актуальную информацию в приемной комиссии.')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BachelorQuotas;