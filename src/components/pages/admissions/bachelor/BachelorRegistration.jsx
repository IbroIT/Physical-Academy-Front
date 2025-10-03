// components/BachelorRegistration.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorRegistration = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: {},
    education: {},
    documents: {}
  });

  const steps = [
    { number: 1, title: t('bachelor.registration.steps.personal.title'), icon: '👤' },
    { number: 2, title: t('bachelor.registration.steps.education.title'), icon: '🎓' },
    { number: 3, title: t('bachelor.registration.steps.documents.title'), icon: '📄' },
    { number: 4, title: t('bachelor.registration.steps.review.title'), icon: '✅' }
  ];

  const deadlines = [
    { period: t('bachelor.registration.deadlines.main.period'), date: '20 июня - 25 июля' },
    { period: t('bachelor.registration.deadlines.additional.period'), date: '1-15 августа' }
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="p-8">
      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 -z-10">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-500 ${
                index <= currentStep
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-110'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {index <= currentStep ? step.icon : step.number}
              </div>
              <span className={`mt-2 text-sm font-medium text-center ${
                index <= currentStep ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('bachelor.registration.stepDescription', { step: currentStep + 1, total: steps.length })}
            </p>

            {/* Step Content */}
            <div className="space-y-6">
              {currentStep === 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <input type="text" placeholder={t('bachelor.registration.form.firstName')} className="p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  <input type="text" placeholder={t('bachelor.registration.form.lastName')} className="p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  <input type="email" placeholder={t('bachelor.registration.form.email')} className="p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                  <input type="tel" placeholder={t('bachelor.registration.form.phone')} className="p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6">
                  <select className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>{t('bachelor.registration.form.selectProgram')}</option>
                    <option>Computer Science</option>
                    <option>Software Engineering</option>
                    <option>Cybersecurity</option>
                  </select>
                  <textarea placeholder={t('bachelor.registration.form.motivation')} rows={4} className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent"></textarea>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  {[t('bachelor.registration.documents.passport'), t('bachelor.registration.documents.diploma'), t('bachelor.registration.documents.photos')].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-300 rounded-2xl">
                      <span>{doc}</span>
                      <button className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-colors">
                        {t('bachelor.registration.upload')}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    {t('bachelor.registration.completeTitle')}
                  </h3>
                  <p className="text-gray-600">
                    {t('bachelor.registration.completeDescription')}
                  </p>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-6 py-3 border border-gray-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed hover:border-green-500 transition-colors"
              >
                {t('bachelor.registration.previous')}
              </button>
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                {currentStep === steps.length - 1 
                  ? t('bachelor.registration.submit')
                  : t('bachelor.registration.next')
                }
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Deadlines */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
            <h3 className="font-semibold text-orange-800 mb-4 flex items-center">
              ⏰ {t('bachelor.registration.deadlinesTitle')}
            </h3>
            <div className="space-y-3">
              {deadlines.map((deadline, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-orange-700">{deadline.period}</span>
                  <span className="font-semibold text-orange-800">{deadline.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="font-semibold text-blue-800 mb-4">
              {t('bachelor.registration.requirementsTitle')}
            </h3>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {t('bachelor.registration.requirements.age')}
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {t('bachelor.registration.requirements.education')}
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                {t('bachelor.registration.requirements.exams')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BachelorRegistration;