// components/BachelorInternational.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorInternational = () => {
  const { t } = useTranslation();
  const [selectedCountry, setSelectedCountry] = useState('germany');

  const countries = {
    germany: {
      name: '🇩🇪 Германия',
      requirements: [
        t('bachelor.international.countries.germany.requirements.0'),
        t('bachelor.international.countries.germany.requirements.1'),
        t('bachelor.international.countries.germany.requirements.2')
      ],
      support: [
        t('bachelor.international.countries.germany.support.0'),
        t('bachelor.international.countries.germany.support.1'),
        t('bachelor.international.countries.germany.support.2')
      ]
    },
    usa: {
      name: '🇺🇸 США',
      requirements: [
        t('bachelor.international.countries.usa.requirements.0'),
        t('bachelor.international.countries.usa.requirements.1'),
        t('bachelor.international.countries.usa.requirements.2')
      ],
      support: [
        t('bachelor.international.countries.usa.support.0'),
        t('bachelor.international.countries.usa.support.1'),
        t('bachelor.international.countries.usa.support.2')
      ]
    },
    korea: {
      name: '🇰🇷 Южная Корея',
      requirements: [
        t('bachelor.international.countries.korea.requirements.0'),
        t('bachelor.international.countries.korea.requirements.1'),
        t('bachelor.international.countries.korea.requirements.2')
      ],
      support: [
        t('bachelor.international.countries.korea.support.0'),
        t('bachelor.international.countries.korea.support.1'),
        t('bachelor.international.countries.korea.support.2')
      ]
    }
  };

  const processSteps = [
    { step: 1, title: t('bachelor.international.process.apply'), duration: '1-2 месяца' },
    { step: 2, title: t('bachelor.international.process.documents'), duration: '2-3 недели' },
    { step: 3, title: t('bachelor.international.process.visa'), duration: '1-3 месяца' },
    { step: 4, title: t('bachelor.international.process.arrival'), duration: '2 недели' }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {t('bachelor.international.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {t('bachelor.international.subtitle')}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Country Selection */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {t('bachelor.international.chooseCountry')}
          </h3>
          <div className="space-y-4">
            {Object.entries(countries).map(([key, country]) => (
              <button
                key={key}
                onClick={() => setSelectedCountry(key)}
                className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                  selectedCountry === key
                    ? 'border-green-500 bg-green-50 shadow-lg transform scale-105'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold text-gray-800">{country.name}</span>
                  <span className={`w-6 h-6 rounded-full border-2 ${
                    selectedCountry === key ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}></span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Country Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              📋 {t('bachelor.international.requirements')}
            </h4>
            <ul className="space-y-3">
              {countries[selectedCountry].requirements.map((req, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span className="text-gray-700">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-4 flex items-center">
              🛠️ {t('bachelor.international.support')}
            </h4>
            <ul className="space-y-2">
              {countries[selectedCountry].support.map((sup, idx) => (
                <li key={idx} className="flex items-center text-blue-700">
                  <span className="w-1 h-1 bg-blue-500 rounded-full mr-3"></span>
                  {sup}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Process Timeline */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          {t('bachelor.international.processTitle')}
        </h3>
        <div className="grid md:grid-cols-4 gap-6">
          {processSteps.map((step, index) => (
            <div key={step.step} className="text-center group">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-green-500 to-blue-500 -z-10"></div>
                )}
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{step.title}</h4>
              <p className="text-sm text-gray-600">⏱️ {step.duration}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">
          {t('bachelor.international.cta.title')}
        </h3>
        <p className="mb-6 opacity-90">
          {t('bachelor.international.cta.description')}
        </p>
        <button className="bg-white text-green-600 px-8 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300">
          {t('bachelor.international.cta.button')}
        </button>
      </div>
    </div>
  );
};

export default BachelorInternational;