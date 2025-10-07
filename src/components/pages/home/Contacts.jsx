// src/components/Contacts/Contacts.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Contacts = () => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  // Иконки как SVG компоненты
  const PhoneIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const MailIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.169-3.495-8.418"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const InstagramIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.338 14.884 3.8 13.601 3.8 12.191c0-1.409.538-2.693 1.413-3.5c.875-.807 2.026-1.297 3.323-1.297c1.298 0 2.449.49 3.324 1.297c.875.807 1.413 2.091 1.413 3.5c0 1.41-.538 2.693-1.413 3.5c-.875.807-2.026 1.297-3.324 1.297zm7.716 1.856c-1.165.538-2.449.807-3.796.807-1.346 0-2.631-.269-3.796-.807l-.048-.024c-.356-.178-.538-.594-.538-1.013v-1.38c0-.42.182-.835.538-1.013l.048-.024c1.165-.538 2.449-.807 3.796-.807c1.346 0 2.631.269 3.796.807l.048.024c.356.178.538.594.538 1.013v1.38c0 .42-.182.835-.538 1.013l-.048.024zm1.38-7.562c0 .807-.654 1.46-1.46 1.46s-1.46-.653-1.46-1.46c0-.806.653-1.46 1.46-1.46s1.46.654 1.46 1.46z"/>
    </svg>
  );

  const TelegramIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.155c-.178-.08-.393-.05-.54.08-1.716 1.336-3.558 2.673-5.327 4.01-.41.308-.99.57-1.382.308-.393-.26-.212-.88-.103-1.336.108-.457.54-2.35.625-2.865.085-.515-.295-.67-.632-.515-2.126.978-3.98 1.88-5.835 2.837-.51.248-.907.67-.833 1.235.073.565.54.88 1.03 1.05.692.235 1.382.463 2.073.692.295.103.57.248.833.393.295.18.393.463.343.75-.05.288-.295.515-.57.618-.54.205-1.03.463-1.547.67-.54.218-1.03.67-.907 1.31.123.64.692.978 1.307 1.13.907.218 1.815.343 2.74.343 1.382 0 2.74-.235 4.085-.67 1.03-.33 2.032-.833 2.865-1.57 1.03-.92 1.73-2.073 2.073-3.38.178-.67.285-1.363.285-2.043 0-1.13-.248-2.223-.692-3.265-.178-.413-.57-.67-1.03-.75z"/>
    </svg>
  );

  const ChevronDownIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const ChevronUpIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
  );

  const socialLinks = [
    {
      name: 'WhatsApp',
      url: '#',
      icon: <WhatsAppIcon />,
      color: 'hover:bg-green-500'
    },
    {
      name: 'Facebook',
      url: '#',
      icon: <FacebookIcon />,
      color: 'hover:bg-blue-600'
    },
    {
      name: 'Instagram',
      url: '#',
      icon: <InstagramIcon />,
      color: 'hover:bg-pink-600'
    },
    {
      name: 'Telegram',
      url: '#',
      icon: <TelegramIcon />,
      color: 'hover:bg-blue-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-emerald-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-cyan-800 mb-4">
            {t('contacts.title')}
          </h1>
          <p className="text-lg text-emerald-700 max-w-2xl mx-auto">
            {t('contacts.subtitle')}
          </p>
        </div>

        {/* Main Contact Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
            {/* Phone Section */}
            <div className="flex items-center space-x-4 flex-1 w-full">
              <div className="bg-cyan-100 p-3 md:p-4 rounded-full">
                <PhoneIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-700">
                  {t('contacts.phone.title')}
                </h3>
                <a 
                  href="tel:+79991234567"
                  className="text-xl md:text-2xl font-bold text-cyan-600 hover:text-cyan-700 transition-colors block"
                >
                  +7 (999) 123-45-67
                </a>
                <p className="text-sm text-emerald-600 mt-1">
                  {t('contacts.phone.availability')}
                </p>
              </div>
            </div>

            {/* Email Section */}
            <div className="flex items-center space-x-4 flex-1 w-full">
              <div className="bg-emerald-100 p-3 md:p-4 rounded-full">
                <MailIcon />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-700">
                  {t('contacts.email.title')}
                </h3>
                <a 
                  href="mailto:info@example.com"
                  className="text-lg md:text-xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors block"
                >
                  info@example.com
                </a>
                <p className="text-sm text-cyan-600 mt-1">
                  {t('contacts.email.response')}
                </p>
              </div>
            </div>
          </div>

          {/* Expandable Social Media Section */}
          <div className="mt-8 border-t pt-6 md:pt-8">
                <h2 className="text-center text-lg font-semibold text-gray-700 py-2">
                    {t('contacts.social.title')}
                </h2>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {socialLinks.map((social, index) => (
                    <a
                        key={index}
                        href={social.url}
                        className={`
                        flex items-center justify-center p-3 md:p-4 rounded-xl 
                        bg-gray-50 text-gray-700 
                        ${social.color} border-2 border-transparent
                        `}
                    >
                        <div className="flex items-center space-x-2">
                        {social.icon}
                        <span className="font-medium text-sm md:text-base">{social.name}</span>
                        </div>
                    </a>
                    ))}
                </div>
                </div>


        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-cyan-500 text-white p-4 md:p-6 rounded-xl transform transition-all duration-300 hover:scale-105 shadow-lg">
            <h4 className="font-bold text-lg mb-2">
              {t('contacts.info.support.title')}
            </h4>
            <p className="text-cyan-100 text-sm md:text-base">
              {t('contacts.info.support.description')}
            </p>
          </div>
          
          <div className="bg-emerald-500 text-white p-4 md:p-6 rounded-xl transform transition-all duration-300 hover:scale-105 shadow-lg">
            <h4 className="font-bold text-lg mb-2">
              {t('contacts.info.hours.title')}
            </h4>
            <p className="text-emerald-100 text-sm md:text-base">
              {t('contacts.info.hours.description')}
            </p>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 border-2 border-cyan-200">
            <h4 className="font-bold text-lg text-cyan-800 mb-2">
              {t('contacts.info.location.title')}
            </h4>
            <p className="text-emerald-700 text-sm md:text-base">
              {t('contacts.info.location.description')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacts;