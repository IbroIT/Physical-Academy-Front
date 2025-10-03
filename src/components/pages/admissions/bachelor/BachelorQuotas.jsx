// components/BachelorQuotas.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorQuotas = () => {
  const { t } = useTranslation();
  const [selectedQuota, setSelectedQuota] = useState(0);

  const quotas = [
    {
      type: 'orphans',
      title: t('bachelor.quotas.types.orphans.title'),
      description: t('bachelor.quotas.types.orphans.description'),
      icon: '👨‍👩‍👧‍👦',
      requirements: [
        t('bachelor.quotas.types.orphans.requirements.0'),
        t('bachelor.quotas.types.orphans.requirements.1'),
        t('bachelor.quotas.types.orphans.requirements.2')
      ],
      benefits: [
        t('bachelor.quotas.types.orphans.benefits.0'),
        t('bachelor.quotas.types.orphans.benefits.1'),
        t('bachelor.quotas.types.orphans.benefits.2')
      ]
    },
    {
      type: 'disabilities',
      title: t('bachelor.quotas.types.disabilities.title'),
      description: t('bachelor.quotas.types.disabilities.description'),
      icon: '♿',
      requirements: [
        t('bachelor.quotas.types.disabilities.requirements.0'),
        t('bachelor.quotas.types.disabilities.requirements.1'),
        t('bachelor.quotas.types.disabilities.requirements.2')
      ],
      benefits: [
        t('bachelor.quotas.types.disabilities.benefits.0'),
        t('bachelor.quotas.types.disabilities.benefits.1'),
        t('bachelor.quotas.types.disabilities.benefits.2')
      ]
    },
    {
      type: 'target',
      title: t('bachelor.quotas.types.target.title'),
      description: t('bachelor.quotas.types.target.description'),
      icon: '🎯',
      requirements: [
        t('bachelor.quotas.types.target.requirements.0'),
        t('bachelor.quotas.types.target.requirements.1'),
        t('bachelor.quotas.types.target.requirements.2')
      ],
      benefits: [
        t('bachelor.quotas.types.target.benefits.0'),
        t('bachelor.quotas.types.target.benefits.1'),
        t('bachelor.quotas.types.target.benefits.2')
      ]
    }
  ];

  const quotaStats = [
    { number: '15%', label: t('bachelor.quotas.stats.totalQuotas') },
    { number: '50+', label: t('bachelor.quotas.stats.studentsYear') },
    { number: '95%', label: t('bachelor.quotas.stats.successRate') },
    { number: '10', label: t('bachelor.quotas.stats.partnerCompanies') }
  ];

  return (
    <div className="p-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {quotaStats.map((stat, index) => (
          <div key={index} className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl border border-green-100">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {stat.number}
            </div>
            <div className="text-gray-600 font-medium mt-2 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quota Selection */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {t('bachelor.quotas.availableQuotas')}
          </h3>
          {quotas.map((quota, index) => (
            <button
              key={quota.type}
              onClick={() => setSelectedQuota(index)}
              className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                selectedQuota === index
                  ? 'border-green-500 bg-green-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`text-3xl transition-transform duration-300 ${
                  selectedQuota === index ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  {quota.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{quota.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{quota.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quota Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="text-4xl">{quotas[selectedQuota].icon}</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{quotas[selectedQuota].title}</h2>
                <p className="text-gray-600 mt-2">{quotas[selectedQuota].description}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Requirements */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  📋 {t('bachelor.quotas.requirements')}
                </h3>
                <ul className="space-y-3">
                  {quotas[selectedQuota].requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  💫 {t('bachelor.quotas.benefits')}
                </h3>
                <ul className="space-y-3">
                  {quotas[selectedQuota].benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Application CTA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {t('bachelor.quotas.readyToApply')}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {t('bachelor.quotas.applicationDeadline')}
                  </p>
                </div>
                <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300">
                  {t('bachelor.quotas.applyNow')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
        <h3 className="font-semibold text-yellow-800 mb-4 flex items-center">
          ⚠️ {t('bachelor.quotas.importantNotes')}
        </h3>
        <p className="text-yellow-700">
          {t('bachelor.quotas.notesDescription')}
        </p>
      </div>
    </div>
  );
};

export default BachelorQuotas;