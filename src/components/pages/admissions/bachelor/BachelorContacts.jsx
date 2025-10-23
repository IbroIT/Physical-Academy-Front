// components/BachelorContacts.jsx
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const BachelorContacts = () => {
  const { t } = useTranslation();
  const [activeDepartment, setActiveDepartment] = useState('admission');
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const departments = [
    {
      id: 'admission',
      name: t('bachelor.contacts.departments.admission.name', 'Приемная комиссия'),
      email: 'admission@academy.ru',
      phone: '+7 (999) 123-45-67',
      hours: t('bachelor.contacts.departments.admission.hours', 'Пн-Пт: 9:00-18:00'),
      description: t('bachelor.contacts.departments.admission.description', 'Вопросы поступления, документы, вступительные испытания'),
      icon: '📝',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'international',
      name: t('bachelor.contacts.departments.international.name', 'Международный отдел'),
      email: 'international@academy.ru',
      phone: '+7 (999) 123-45-68',
      hours: t('bachelor.contacts.departments.international.hours', 'Пн-Пт: 10:00-17:00'),
      description: t('bachelor.contacts.departments.international.description', 'Иностранным абитуриентам, визовая поддержка'),
      icon: '🌍',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'quotas',
      name: t('bachelor.contacts.departments.quotas.name', 'Отдел квот и грантов'),
      email: 'quotas@academy.ru',
      phone: '+7 (999) 123-45-69',
      hours: t('bachelor.contacts.departments.quotas.hours', 'Пн-Чт: 9:00-17:00, Пт: 9:00-16:00'),
      description: t('bachelor.contacts.departments.quotas.description', 'Бюджетные места, стипендии, образовательные гранты'),
      icon: '🎓',
      color: 'from-blue-500 to-green-500'
    },
    {
      id: 'general',
      name: t('bachelor.contacts.departments.general.name', 'Общий отдел'),
      email: 'info@academy.ru',
      phone: '+7 (999) 123-45-70',
      hours: t('bachelor.contacts.departments.general.hours', 'Пн-Пт: 8:00-19:00'),
      description: t('bachelor.contacts.departments.general.description', 'Общие вопросы, административные вопросы'),
      icon: '🏛️',
      color: 'from-green-500 to-blue-500'
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
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-900 py-12 md:py-20 overflow-hidden"
    >
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 mb-6 group hover:bg-white/20 transition-all duration-300">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></span>
            <span className="text-green-300 font-medium text-sm md:text-base">
              {t('bachelor.contacts.badge', 'Контакты')}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            {t('bachelor.contacts.title', 'КОНТАКТЫ ДЛЯ ПОСТУПЛЕНИЯ')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-green-400 mx-auto mb-6 md:mb-8"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto px-4 leading-relaxed">
            {t('bachelor.contacts.subtitle', 'Свяжитесь с нами для получения консультации по вопросам поступления')}
          </p>
        </div>

        <div className={`grid lg:grid-cols-2 gap-6 md:gap-8 mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center">
                <span className="w-3 h-3 bg-blue-400 rounded-full mr-3"></span>
                {t('bachelor.contacts.departmentsTitle', 'Отделы и контакты')}
              </h2>
              
              {/* Department Navigation */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-1 mb-6 border border-white/20">
                <div className="grid grid-cols-2 gap-1">
                  {departments.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => setActiveDepartment(dept.id)}
                      className={`flex items-center justify-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-300 group ${
                        activeDepartment === dept.id
                          ? `bg-gradient-to-r ${dept.color} text-white shadow-lg scale-105`
                          : 'text-blue-100 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="text-lg mr-2">{dept.icon}</span>
                      <span className="hidden sm:block">{dept.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Department Details */}
              {departments.map((dept) => (
                <div
                  key={dept.id}
                  className={`transition-all duration-500 ${
                    activeDepartment === dept.id ? 'block animate-fadeIn' : 'hidden'
                  }`}
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${dept.color} flex items-center justify-center text-white text-2xl shadow-lg`}>
                      {dept.icon}
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{dept.name}</h3>
                      <p className="text-blue-100 mb-4">{dept.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-green-400/30 transition-all duration-300 group">
                      <span className="text-blue-100 font-medium flex items-center">
                        <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-300">
                          📧
                        </span>
                        {t('bachelor.contacts.email', 'Email')}
                      </span>
                      <a 
                        href={`mailto:${dept.email}`}
                        className="text-green-300 hover:text-green-400 font-medium transition-colors group-hover:scale-105"
                      >
                        {dept.email}
                      </a>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-green-400/30 transition-all duration-300 group">
                      <span className="text-blue-100 font-medium flex items-center">
                        <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-3 text-green-300">
                          📞
                        </span>
                        {t('bachelor.contacts.phone', 'Телефон')}
                      </span>
                      <a 
                        href={`tel:${dept.phone}`}
                        className="text-green-300 hover:text-green-400 font-medium transition-colors group-hover:scale-105"
                      >
                        {dept.phone}
                      </a>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-green-400/30 transition-all duration-300 group">
                      <span className="text-blue-100 font-medium flex items-center">
                        <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3 text-blue-300">
                          ⏰
                        </span>
                        {t('bachelor.contacts.hours', 'Часы работы')}
                      </span>
                      <span className="text-green-300">{dept.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="tel:+79991234567"
                className="group bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:border-green-400/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">📞</span>
                </div>
                <span className="font-bold text-white text-lg">
                  {t('bachelor.actions.call', 'Позвонить')}
                </span>
              </a>
              
              <a
                href="mailto:info@academy.ru"
                className="group bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-center hover:border-green-400/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl">✉️</span>
                </div>
                <span className="font-bold text-white text-lg">
                  {t('bachelor.actions.email', 'Написать')}
                </span>
              </a>
            </div>
          </div>

          {/* FAQ & Contact Form */}
          <div className="space-y-6">
            {/* FAQ Section */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl md:rounded-3xl border border-white/20 shadow-2xl p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center">
                <span className="w-3 h-3 bg-green-400 rounded-full mr-3"></span>
                {t('bachelor.contacts.faqTitle', 'Частые вопросы')}
              </h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 rounded-xl hover:border-green-400/30 transition-all duration-300 group"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors rounded-xl"
                    >
                      <span className="font-bold text-white pr-4 flex-1 text-lg group-hover:text-green-300 transition-colors">
                        {faq.question}
                      </span>
                      <div className={`w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:bg-green-500/20 ${
                        openFaq === index ? 'bg-green-500/20 rotate-180' : ''
                      }`}>
                        <svg 
                          className={`w-5 h-5 text-white transition-transform duration-300 ${
                            openFaq === index ? 'rotate-180' : ''
                          }`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    {openFaq === index && (
                      <div className="px-4 pb-4 animate-fadeIn">
                        <div className="border-t border-white/10 pt-4">
                          <p className="text-blue-100 leading-relaxed text-lg">{faq.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Плавающие элементы для десктопа */}
      <div className="absolute bottom-20 left-5 w-6 h-6 bg-green-400/20 rounded-full animate-bounce hidden md:block"></div>
      <div className="absolute top-20 right-5 w-4 h-4 bg-blue-400/20 rounded-full animate-ping hidden md:block"></div>
    </section>
  );
};

export default BachelorContacts;