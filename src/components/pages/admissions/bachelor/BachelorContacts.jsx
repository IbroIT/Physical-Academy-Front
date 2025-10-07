// components/BachelorContacts.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorContacts = () => {
  const { t } = useTranslation();
  const [activeDepartment, setActiveDepartment] = useState('admission');
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });

  const departments = [
    {
      id: 'admission',
      name: t('bachelor.contacts.departments.admission.name', 'Приемная комиссия'),
      email: 'admission@academy.ru',
      phone: '+7 (999) 123-45-67',
      hours: t('bachelor.contacts.departments.admission.hours', 'Пн-Пт: 9:00-18:00'),
      description: t('bachelor.contacts.departments.admission.description', 'Вопросы поступления, документы, вступительные испытания'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6l9-5-9-5-9 5 9 5z" />
        </svg>
      )
    },
    {
      id: 'international',
      name: t('bachelor.contacts.departments.international.name', 'Международный отдел'),
      email: 'international@academy.ru',
      phone: '+7 (999) 123-45-68',
      hours: t('bachelor.contacts.departments.international.hours', 'Пн-Пт: 10:00-17:00'),
      description: t('bachelor.contacts.departments.international.description', 'Иностранным абитуриентам, визовая поддержка'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'quotas',
      name: t('bachelor.contacts.departments.quotas.name', 'Отдел квот и грантов'),
      email: 'quotas@academy.ru',
      phone: '+7 (999) 123-45-69',
      hours: t('bachelor.contacts.departments.quotas.hours', 'Пн-Чт: 9:00-17:00, Пт: 9:00-16:00'),
      description: t('bachelor.contacts.departments.quotas.description', 'Бюджетные места, стипендии, образовательные гранты'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'general',
      name: t('bachelor.contacts.departments.general.name', 'Общий отдел'),
      email: 'info@academy.ru',
      phone: '+7 (999) 123-45-70',
      hours: t('bachelor.contacts.departments.general.hours', 'Пн-Пт: 8:00-19:00'),
      description: t('bachelor.contacts.departments.general.description', 'Общие вопросы, административные вопросы'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  const faqs = [
    {
      question: t('bachelor.contacts.faqs.0.question', 'Какие документы нужны для поступления?'),
      answer: t('bachelor.contacts.faqs.0.answer', 'Для поступления необходимы: паспорт, документ об образовании, фотографии 3x4, медицинская справка. Полный список документов уточняйте в приемной комиссии.')
    },
    {
      question: t('bachelor.contacts.faqs.1.question', 'Есть ли бюджетные места?'),
      answer: t('bachelor.contacts.faqs.1.answer', 'Да, мы предоставляем бюджетные места по различным направлениям. Количество мест ограничено и распределяется по результатам вступительных испытаний.')
    },
    {
      question: t('bachelor.contacts.faqs.2.question', 'Какой срок подачи документов?'),
      answer: t('bachelor.contacts.faqs.2.answer', 'Прием документов начинается 20 июня и продолжается до 10 августа для бакалавриата. Рекомендуем подавать документы заранее.')
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here would be form submission logic
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('bachelor.contacts.title', 'Контакты для поступления')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('bachelor.contacts.subtitle', 'Свяжитесь с нами для получения консультации по вопросам поступления')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('bachelor.contacts.departmentsTitle', 'Отделы и контакты')}
              </h2>
              
              {/* Department Navigation */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => setActiveDepartment(dept.id)}
                    className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      activeDepartment === dept.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {dept.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Active Department Details */}
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className={`transition-all duration-300 ${
                    activeDepartment === dept.id ? 'block' : 'hidden'
                  }`}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      {dept.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{dept.name}</h3>
                      <p className="text-gray-600 mb-4">{dept.description}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">
                        {t('bachelor.contacts.email', 'Email')}
                      </span>
                      <a 
                        href={`mailto:${dept.email}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {dept.email}
                      </a>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">
                        {t('bachelor.contacts.phone', 'Телефон')}
                      </span>
                      <a 
                        href={`tel:${dept.phone}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {dept.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">
                        {t('bachelor.contacts.hours', 'Часы работы')}
                      </span>
                      <span className="text-gray-600">{dept.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="tel:+79991234567"
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">
                  {t('bachelor.actions.call', 'Позвонить')}
                </span>
              </a>
              
              <a
                href="mailto:info@academy.ru"
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">
                  {t('bachelor.actions.email', 'Написать')}
                </span>
              </a>
            </div>
          </div>

          {/* FAQ & Contact Form */}
          <div className="space-y-6">
            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('bachelor.contacts.faqTitle', 'Частые вопросы')}
              </h2>
              
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors rounded-lg"
                    >
                      <span className="font-medium text-gray-900 pr-4 flex-1">
                        {faq.question}
                      </span>
                      <svg 
                        className={`w-5 h-5 text-gray-400 transform transition-transform duration-300 ${
                          openFaq === index ? 'rotate-180' : ''
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === index && (
                      <div className="px-4 pb-4">
                        <div className="border-t border-gray-200 pt-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('bachelor.contacts.quickContact', 'Быстрая связь')}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('bachelor.contacts.form.email', 'Email для ответа')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('bachelor.contacts.form.message', 'Ваш вопрос')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder={t('bachelor.contacts.form.messagePlaceholder', 'Опишите ваш вопрос подробно...')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {t('bachelor.contacts.form.send', 'Отправить вопрос')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('bachelor.contacts.locationTitle', 'Мы находимся')}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p>{t('bachelor.contacts.mapPlaceholder', 'Интерактивная карта')}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {t('bachelor.contacts.address.title', 'Адрес академии')}
                  </h4>
                  <p className="text-gray-600 mb-1">
                    {t('bachelor.contacts.address.street', 'ул. Примерная, 123')}
                  </p>
                  <p className="text-gray-600">
                    {t('bachelor.contacts.address.city', 'г. Москва, 123456')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {t('bachelor.contacts.hours.title', 'Часы работы')}
                  </h4>
                  <p className="text-gray-600 mb-1">
                    {t('bachelor.contacts.hours.weekdays', 'Понедельник - Пятница: 9:00 - 18:00')}
                  </p>
                  <p className="text-gray-600">
                    {t('bachelor.contacts.hours.weekend', 'Суббота: 10:00 - 16:00')}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {t('bachelor.contacts.transport.title', 'Как добраться')}
                  </h4>
                  <p className="text-gray-600 mb-1">
                    {t('bachelor.contacts.transport.metro', 'Метро: Станция "Примерная"')}
                  </p>
                  <p className="text-gray-600">
                    {t('bachelor.contacts.transport.bus', 'Автобусы: 123, 456, 789')}
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

export default BachelorContacts;