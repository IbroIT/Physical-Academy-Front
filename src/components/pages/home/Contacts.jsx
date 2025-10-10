// src/components/Contacts/Contacts.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const Contacts = () => {
  const { t } = useTranslation();

  // Иконки как SVG компоненты
  const PhoneIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const MailIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.169-3.495-8.418"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

 const InstagramIcon = () => (
  <svg 
    className="w-4 h-4" 
    fill="currentColor" 
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

  const TelegramIcon = () => (
  <svg 
    className="w-4 h-4" 
    fill="currentColor" 
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>
  </svg>
);

  const contacts = t('contacts', { returnObjects: true });

  const socialLinks = Array.isArray(contacts?.socialLinks)
  ? contacts.socialLinks.map((social) => ({
      ...social,
      icon: (() => {
        switch (social.name) {
          case 'WhatsApp':
            return <WhatsAppIcon />;
          case 'Facebook':
            return <FacebookIcon />;
          case 'Instagram':
            return <InstagramIcon />;
          case 'Telegram':
            return <TelegramIcon />;
          default:
            return null;
        }
      })(),
    }))
  : [];


  const contactInfo = [
    {
      icon: <PhoneIcon />,
      title: contacts.contactInfo.phone.title,
      value: contacts.contactInfo.phone.value,
      link: `tel:${contacts.contactInfo.phone.value}`
    },
    {
      icon: <MailIcon />,
      title: contacts.contactInfo.email.title,
      value: contacts.contactInfo.email.value,
      link: `mailto:${contacts.contactInfo.email.value}`
    },
    {
      icon: <LocationIcon />,
      title: contacts.contactInfo.location.title,
      value: contacts.contactInfo.location.value,
      link: contacts.contactInfo.location.link
    }
  ];

  return (
    <footer className="bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 text-white relative overflow-hidden">
      {/* Анимированный фон для футера */}
      <div className="absolute inset-0">
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-10 right-20 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white/5 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-12 lg:py-16">
          {/* Основной контент футера */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Блок с лого и описанием */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                {contacts.title}
              </h3>
              <p className="text-white/90 text-sm leading-relaxed mb-6">
                {contacts.subtitle}
              </p>
              
              {/* Социальные сети */}
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-white transition-all duration-300 ${social.color} border border-white/30`}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Контактная информация */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-1"
            >
              <h4 className="text-lg font-semibold text-white mb-6">
                {contacts.quickContact.title}
              </h4>
              <div className="space-y-4">
                {contactInfo.map((contact, index) => (
                  <motion.a
                    key={index}
                    href={contact.link}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 text-white/90 hover:text-white transition-colors duration-300 group"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                      {contact.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{contact.title}</p>
                      <p className="text-sm text-white/90">{contact.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Быстрые ссылки */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <h4 className="text-lg font-semibold text-white mb-6">
                {contacts.links.title}
              </h4>
              <div className="space-y-3">
                {contacts.links.items.map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    whileHover={{ x: 5 }}
                    className="block text-white/90 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Часы работы */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <h4 className="text-lg font-semibold text-white mb-6">
                {contacts.hours.title}
              </h4>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/90">{contacts.hours.weekdays}</span>
                    <span className="text-white font-medium">{contacts.hours.weekdaysTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/90">{contacts.hours.saturday}</span>
                    <span className="text-white font-medium">{contacts.hours.saturdayTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/90">{contacts.hours.sunday}</span>
                    <span className="text-red-200 font-medium">{contacts.hours.closed}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Нижняя часть футера */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          >
            <p className="text-white/80 text-sm text-center md:text-left mb-4 md:mb-0">
              {contacts.footer.copyright}
            </p>
            <div className="flex space-x-6 text-sm">
              <a href={contacts.footer.privacy.url} className="text-white/80 hover:text-white transition-colors duration-300">
                {contacts.footer.privacy.name}
              </a>
              <a href={contacts.footer.terms.url} className="text-white/80 hover:text-white transition-colors duration-300">
                {contacts.footer.terms.name}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Contacts;