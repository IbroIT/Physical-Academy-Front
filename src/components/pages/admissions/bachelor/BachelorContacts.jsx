// components/BachelorContacts.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorContacts = () => {
  const { t } = useTranslation();
  const [activeDepartment, setActiveDepartment] = useState('admission');

  const departments = [
    {
      id: 'admission',
      name: t('bachelor.contacts.departments.admission.name'),
      email: 'admission@academy.ru',
      phone: '+7 (999) 123-45-67',
      hours: t('bachelor.contacts.departments.admission.hours'),
      description: t('bachelor.contacts.departments.admission.description'),
      icon: '🎓'
    },
    {
      id: 'international',
      name: t('bachelor.contacts.departments.international.name'),
      email: 'international@academy.ru',
      phone: '+7 (999) 123-45-68',
      hours: t('bachelor.contacts.departments.international.hours'),
      description: t('bachelor.contacts.departments.international.description'),
      icon: '🌍'
    },
    {
      id: 'quotas',
      name: t('bachelor.contacts.departments.quotas.name'),
      email: 'quotas@academy.ru',
      phone: '+7 (999) 123-45-69',
      hours: t('bachelor.contacts.departments.quotas.hours'),
      description: t('bachelor.contacts.departments.quotas.description'),
      icon: '🎯'
    },
    {
      id: 'general',
      name: t('bachelor.contacts.departments.general.name'),
      email: 'info@academy.ru',
      phone: '+7 (999) 123-45-70',
      hours: t('bachelor.contacts.departments.general.hours'),
      description: t('bachelor.contacts.departments.general.description'),
      icon: '🏛️'
    }
  ];

  const faqs = [
    {
      question: t('bachelor.contacts.faqs.0.question'),
      answer: t('bachelor.contacts.faqs.0.answer')
    },
    {
      question: t('bachelor.contacts.faqs.1.question'),
      answer: t('bachelor.contacts.faqs.1.answer')
    },
    {
      question: t('bachelor.contacts.faqs.2.question'),
      answer: t('bachelor.contacts.faqs.2.answer')
    }
  ];

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
          {t('bachelor.contacts.title')}
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('bachelor.contacts.subtitle')}
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {t('bachelor.contacts.departmentsTitle')}
          </h3>
          
          {/* Department Cards */}
          <div className="space-y-4">
            {departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => setActiveDepartment(dept.id)}
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                  activeDepartment === dept.id
                    ? 'border-green-500 bg-green-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{dept.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-lg mb-2">{dept.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-700">
                        <span className="w-4 mr-3">📧</span>
                        <a href={`mailto:${dept.email}`} className="hover:text-green-600 transition-colors">
                          {dept.email}
                        </a>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="w-4 mr-3">📞</span>
                        <a href={`tel:${dept.phone}`} className="hover:text-green-600 transition-colors">
                          {dept.phone}
                        </a>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="w-4 mr-3">⏰</span>
                        {dept.hours}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {t('bachelor.contacts.faqTitle')}
          </h3>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-800 pr-4">{faq.question}</span>
                  <span className={`transform transition-transform duration-300 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Contact Form */}
          <div className="mt-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-4">
              {t('bachelor.contacts.quickContact')}
            </h4>
            <div className="space-y-4">
              <input
                type="email"
                placeholder={t('bachelor.contacts.form.email')}
                className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <textarea
                placeholder={t('bachelor.contacts.form.message')}
                rows={3}
                className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              ></textarea>
              <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300">
                {t('bachelor.contacts.form.send')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map & Location */}
      <div className="mt-12 bg-white rounded-2xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          {t('bachelor.contacts.locationTitle')}
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center text-gray-500">
              🗺️ {t('bachelor.contacts.mapPlaceholder')}
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-2xl">
              <div className="text-2xl">🏛️</div>
              <div>
                <div className="font-semibold text-gray-800">{t('bachelor.contacts.address.title')}</div>
                <div className="text-gray-600 text-sm">{t('bachelor.contacts.address.street')}</div>
                <div className="text-gray-600 text-sm">{t('bachelor.contacts.address.city')}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-2xl">
              <div className="text-2xl">🚇</div>
              <div>
                <div className="font-semibold text-gray-800">{t('bachelor.contacts.transport.title')}</div>
                <div className="text-gray-600 text-sm">{t('bachelor.contacts.transport.metro')}</div>
                <div className="text-gray-600 text-sm">{t('bachelor.contacts.transport.bus')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BachelorContacts;