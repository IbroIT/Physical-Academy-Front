// components/AcademyAccreditation.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const AcademyAccreditation = () => {
  const { t } = useTranslation();
  const [selectedAccreditation, setSelectedAccreditation] = useState(0);

  const accreditations = [
    {
      organization: t('academy.accreditation.national.organization'),
      logo: '/api/placeholder/120/60',
      validity: t('academy.accreditation.national.validity'),
      description: t('academy.accreditation.national.description'),
      benefits: [
        t('academy.accreditation.national.benefits.0'),
        t('academy.accreditation.national.benefits.1'),
        t('academy.accreditation.national.benefits.2')
      ]
    },
    {
      organization: t('academy.accreditation.international.organization'),
      logo: '/api/placeholder/120/60',
      validity: t('academy.accreditation.international.validity'),
      description: t('academy.accreditation.international.description'),
      benefits: [
        t('academy.accreditation.international.benefits.0'),
        t('academy.accreditation.international.benefits.1'),
        t('academy.accreditation.international.benefits.2')
      ]
    },
    {
      organization: t('academy.accreditation.professional.organization'),
      logo: '/api/placeholder/120/60',
      validity: t('academy.accreditation.professional.validity'),
      description: t('academy.accreditation.professional.description'),
      benefits: [
        t('academy.accreditation.professional.benefits.0'),
        t('academy.accreditation.professional.benefits.1'),
        t('academy.accreditation.professional.benefits.2')
      ]
    }
  ];

  const qualityStandards = [
    {
      area: t('academy.accreditation.standards.education.area'),
      compliance: '100%',
      status: t('academy.accreditation.standards.education.status'),
      icon: '🎓'
    },
    {
      area: t('academy.accreditation.standards.faculty.area'),
      compliance: '98%',
      status: t('academy.accreditation.standards.faculty.status'),
      icon: '👨‍🏫'
    },
    {
      area: t('academy.accreditation.standards.infrastructure.area'),
      compliance: '95%',
      status: t('academy.accreditation.standards.infrastructure.status'),
      icon: '🏛️'
    },
    {
      area: t('academy.accreditation.standards.research.area'),
      compliance: '92%',
      status: t('academy.accreditation.standards.research.status'),
      icon: '🔬'
    }
  ];

  const documents = [
    {
      name: t('academy.accreditation.documents.license.name'),
      size: '2.4 МБ',
      type: 'PDF',
      url: '/documents/license.pdf'
    },
    {
      name: t('academy.accreditation.documents.accreditation.name'),
      size: '3.1 МБ',
      type: 'PDF',
      url: '/documents/accreditation.pdf'
    },
    {
      name: t('academy.accreditation.documents.charter.name'),
      size: '1.8 МБ',
      type: 'PDF',
      url: '/documents/charter.pdf'
    },
    {
      name: t('academy.accreditation.documents.report.name'),
      size: '4.2 МБ',
      type: 'PDF',
      url: '/documents/report.pdf'
    }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {t('academy.accreditation.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('academy.accreditation.subtitle')}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Accreditation Selection */}
        <div className="lg:col-span-1">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {t('academy.accreditation.ourAccreditations')}
          </h3>
          <div className="space-y-4">
            {accreditations.map((accred, index) => (
              <button
                key={index}
                onClick={() => setSelectedAccreditation(index)}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                  selectedAccreditation === index
                    ? 'border-green-500 bg-green-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    <img src={accred.logo} alt={accred.organization} className="w-12 h-12 object-contain" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{accred.organization}</h4>
                    <p className="text-sm text-green-600 font-medium">{accred.validity}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Accreditation Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {accreditations[selectedAccreditation].organization}
                </h3>
                <p className="text-green-600 font-medium">
                  {accreditations[selectedAccreditation].validity}
                </p>
              </div>
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                <img 
                  src={accreditations[selectedAccreditation].logo} 
                  alt={accreditations[selectedAccreditation].organization}
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              {accreditations[selectedAccreditation].description}
            </p>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                💫 {t('academy.accreditation.benefits')}
              </h4>
              <ul className="space-y-3">
                {accreditations[selectedAccreditation].benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Standards */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {t('academy.accreditation.qualityStandards')}
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {qualityStandards.map((standard, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:shadow-lg transition-all duration-300">
              <div className="text-3xl mb-4">{standard.icon}</div>
              <h4 className="font-semibold text-gray-800 mb-2">{standard.area}</h4>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                {standard.compliance}
              </div>
              <div className="text-sm text-green-600 font-medium">{standard.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {t('academy.accreditation.documentsTitle')}
          </h3>
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <a
                key={index}
                href={doc.url}
                download
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{doc.name}</div>
                    <div className="text-sm text-gray-500">{doc.size} • {doc.type}</div>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Verification */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {t('academy.accreditation.verificationTitle')}
          </h3>
          <p className="text-gray-700 mb-6">
            {t('academy.accreditation.verificationDescription')}
          </p>
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t('academy.accreditation.verificationPlaceholder')}
              className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300">
              {t('academy.accreditation.verifyButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademyAccreditation;