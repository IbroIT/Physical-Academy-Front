import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import DefaultLogo from "../assets/Logo.png";
import ScrolledLogo from "../assets/Logo.png";

const Navbar = ({ currentLanguage, languages = [], changeLanguage }) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [nestedMenu, setNestedMenu] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const menuRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    if (currentLanguage && i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const handleLanguageChange = (langCode) => {
    if (changeLanguage) {
      changeLanguage(langCode);
    } else {
      i18n.changeLanguage(langCode);
    }
    setIsLangOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
        setNestedMenu(null);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Данные меню для КГАФКиС
  const menuData = {
    academy: {
      title: t('nav.academy'),
      submenu: [
        { 
          title: t('nav.about_academy'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.about_academy'), link: '/academy/about' },
            { title: t('nav.history'), link: '/academy/history' },
            { title: t('nav.mission_strategy'), link: '/academy/mission' },
            { title: t('nav.accreditation'), link: '/academy/accreditation' },
            { title: t('nav.kgafkis_in_numbers'), link: '/academy/numbers' },
          ]
        },
        { 
          title: t('nav.leadership'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.board_of_trustees'), link: '/academy/leadership/board-of-trustees' },
            { title: t('nav.audit_commission'), link: '/academy/leadership/audit-commission' },
            { title: t('nav.academic_council'), link: '/academy/leadership/academic-council' },
            { title: t('nav.rectorate'), link: '/academy/leadership/rectorate' },
            { title: t('nav.trade_union'), link: '/academy/leadership/trade-union' },
            { title: t('nav.commissions'), link: '/academy/leadership/commissions' },
            { title: t('nav.academic_structure'), link: '/academy/structure/academic' },
            { title: t('nav.administrative_structure'), link: '/academy/structure/administrative' },
            { title: t('nav.administrative_units'), link: '/academy/structure/units' },
            { title: t('nav.documents'), link: '/academy/documents' },
          ]
        }
      ]
    },
    admissions: {
      title: t('nav.admissions'),
      submenu: [
        { 
          title: t('nav.bachelor'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.general_info'), link: '/admissions/bachelor/info' },
            { title: t('nav.registration'), link: '/admissions/bachelor/registration' },
            { title: t('nav.international_applicants'), link: '/admissions/bachelor/international' },
            { title: t('nav.quotas'), link: '/admissions/bachelor/quotas' },
            { title: t('nav.contacts'), link: '/admissions/bachelor/contacts' },
          ]
        },
        { 
          title: t('nav.master_phd'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.general_info'), link: '/admissions/master/info' },
          ]
        },
        {
          title: t('nav.doctorate'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.general_info'), link: '/admissions/doctorate/info' },
          ]
        },
        { 
          title: t('nav.college'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.general_info'), link: '/admissions/college/info' },
          ]
        },
      ]
    },
    education: {
      title: t('nav.education'),
      submenu: [
        {
          title: t('nav.faculties'),
          hasNested: true,
          nestedItems: [
            { 
              title: t('nav.pedagogical_national_sports'),
              link: '/education/faculties/pedagogical'
            },
            { 
              title: t('nav.coaching_faculty'),
              link: '/education/faculties/coaching'
            },
            { 
              title: t('nav.military_training_physical_culture'),
              link: '/education/faculties/military-training'
            },
            { 
              title: t('nav.correspondence_advanced_training'),
              link: '/education/faculties/correspondence'
            },
            { 
              title: t('nav.general_faculty_departments'),
              link: '/education/departments'
            }
          ]
        },
        { title: t('nav.master_program'), link: '/education/faculties/master' },
        { title: t('nav.doctorate'), link: '/education/faculties/doctorate' },
        { 
          title: t('nav.college'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.college_physical_culture_sports'), link: '/education/college/sports' },
          ]
        },
      ]
    },
    science: {
      title: t('nav.science'),
      submenu: [
        { title: t('nav.scientific_publications'), link: '/science/publications' },
        { title: t('nav.vestnik'), link: '/science/vestnik' },
        { title: t('nav.web_of_science'), link: '/science/web-of-science' },
        { title: t('nav.scopus'), link: '/science/scopus' },
        { title: t('nav.research_and_technical_council'), link: '/science/nts-committee' },
        { title: t('nav.student_scientific_society'), link: '/science/ssu' }
      ]
    },
    students: {
      title: t('nav.students'),
      submenu: [
        {
          title: t('nav.useful_information'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.students_with_disabilities'), link: '/students/disabilities' },
            { title: t('nav.student_council'), link: '/students/council' },
            { title: t('nav.exchange_programs'), link: '/students/exchange' },
            { title: t('nav.instructions'), link: '/students/instructions' },
            { title: t('nav.scholarship'), link: '/students/scholarship' }
          ]
        },
        {
          title: t('nav.useful_links'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.ebilim_login'), link: '/students/ebilim' },
            { title: t('nav.visa_support'), link: '/students/visa-support' }
          ]
        }
      ]
    },
    contacts: {
      title: t('nav.contacts'),
      submenu: [
        { title: t('nav.address_map'), link: '/contacts/address' },
        { title: t('nav.phones_email'), link: '/contacts/contact-info' },
        { title: t('nav.social_networks'), link: '/contacts/social' },
      ]
    }
  };

  return (
    <nav
      className={`sticky top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white py-2 shadow-lg border-b border-blue-100'
          : 'bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 py-1'
      }`}
      ref={menuRef}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Логотип - левая часть */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center group">
              <div
                className="h-14 px-3 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
              >
                <img
                  src={isScrolled ? DefaultLogo : ScrolledLogo}
                  alt="Logo"
                  className="h-10 w-auto object-contain transition-opacity duration-300"
                />
              </div>
            </a>
          </div>

          {/* Центральное меню - скрыто на мобильных */}
          <div className="flex items-center space-x-6">
            <div className="hidden min-[1475px]:flex flex-1 justify-center">
              {Object.entries(menuData).map(([key, item]) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => {
                    setActiveMenu(key);
                    setHoveredMenu(key);
                  }}
                  onMouseLeave={() => {
                    setHoveredMenu(null);
                    setTimeout(() => {
                      if (hoveredMenu !== key) {
                        setActiveMenu(null);
                        setNestedMenu(null);
                      }
                    }, 200);
                  }}
                >
                  {item.link ? (
                    // Простая ссылка для главной страницы
                    <a
                      href={item.link}
                      className={`relative px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 group ${
                        isScrolled
                          ? 'text-blue-800 hover:text-teal-600 hover:bg-blue-50'
                          : 'text-white hover:text-white hover:bg-white/20'
                      }`}
                    >
                      <span className="relative z-10">{item.title}</span>
                      <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-3/4`}></div>
                    </a>
                  ) : (
                    // Кнопка с выпадающим меню для остальных пунктов
                    <>
                      <button
                        className={`relative px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 group ${
                          activeMenu === key
                            ? 'text-white bg-gradient-to-r from-teal-500 to-emerald-500 shadow-lg'
                            : isScrolled
                              ? 'text-blue-800 hover:text-teal-600 hover:bg-blue-50'
                              : 'text-white hover:text-white hover:bg-white/20'
                        }`}
                      >
                        <span className="relative z-10">{item.title}</span>
                        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-teal-400 transition-all duration-300 group-hover:w-3/4 ${
                          activeMenu === key ? 'w-3/4' : ''
                        }`}></div>
                      </button>

                      {/* Выпадающее меню с анимацией */}
                      {activeMenu === key && (
                        <div
                          className="absolute left-1/2 transform -translate-x-1/2 mt-2 min-w-[16rem] rounded-xl shadow-2xl bg-white/95 backdrop-blur-md ring-1 ring-blue-100 overflow-visible z-50 transition-all duration-300"
                          style={{ transformOrigin: 'top center' }}
                          onMouseEnter={() => setActiveMenu(key)}
                          onMouseLeave={() => {
                            setActiveMenu(null);
                            setNestedMenu(null);
                          }}
                        >
                          <div className="py-2">
                            {item.submenu.map((subItem, index) => (
                              <div
                                key={index}
                                className="relative"
                                onMouseEnter={() => {
                                  if (subItem.hasNested) setNestedMenu(`${key}-${index}`);
                                  else setNestedMenu(null);
                                }}
                                onMouseLeave={() => {
                                  setNestedMenu(prev => (prev === `${key}-${index}` ? null : prev));
                                }}
                              >
                                {subItem.hasNested ? (
                                  <>
                                    <button
                                      className="flex justify-between items-center w-full px-4 py-3 text-sm text-gray-800 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200 border-l-4 border-transparent hover:border-teal-400"
                                    >
                                      <span>{subItem.title}</span>
                                      <svg
                                        className="h-4 w-4 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </button>

                                    {/* Вложенное меню */}
                                    {subItem.hasNested && nestedMenu === `${key}-${index}` && (
                                      <div
                                        className="absolute left-full top-0 ml-[1px] w-56 rounded-xl shadow-2xl bg-white/95 backdrop-blur-md ring-1 ring-blue-100 z-50 transition-all duration-200"
                                        onMouseEnter={() => setNestedMenu(`${key}-${index}`)}
                                        onMouseLeave={() => setNestedMenu(null)}
                                      >
                                        <div className="py-2">
                                          {subItem.nestedItems.map((nestedItem, nestedIndex) => (
                                            <a
                                              key={nestedIndex}
                                              href={nestedItem.link}
                                              className="block px-4 py-3 text-sm text-gray-800 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200 border-l-4 border-transparent hover:border-emerald-400"
                                            >
                                              {nestedItem.title}
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <a
                                    href={subItem.link}
                                    className="flex justify-between items-center px-4 py-3 text-sm text-gray-800 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200 border-l-4 border-transparent hover:border-teal-400"
                                  >
                                    <span>{subItem.title}</span>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Правая часть: язык и мобильное меню */}
          <div className="flex items-center space-x-3">
            {/* Переключатель языка */}
            <div className="relative" ref={langRef}>
              <LanguageSwitcher
                variant={isScrolled ? 'outline' : 'default'}
                showText={true}
                onChange={handleLanguageChange}
                languages={languages}
                currentLanguage={currentLanguage}
              />
            </div>

            {/* Кнопка мобильного меню */}
            <div className="block min-[1475px]:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`inline-flex items-center justify-center p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                  isScrolled
                    ? 'text-blue-700 hover:bg-teal-50 border border-blue-200'
                    : 'text-white hover:bg-white/20 border border-white/30'
                } focus:outline-none backdrop-blur-sm`}
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Мобильное меню с анимацией */}
      {isMenuOpen && (
        <div className="block min-[1475px]:hidden bg-gradient-to-b from-white to-blue-50/80 backdrop-blur-md shadow-xl border-t border-blue-100 transform transition-all duration-300 ease-out animate-in slide-in-from-top-2 fade-in">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {Object.entries(menuData).map(([key, item]) => (
              <div key={key} className="relative">
                {item.link ? (
                  // Простая ссылка для главной страницы в мобильном меню
                  <a
                    href={item.link}
                    className="block w-full text-left px-4 py-4 rounded-xl text-base font-semibold text-blue-800 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200 border-l-4 border-transparent hover:border-teal-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </a>
                ) : (
                  // Кнопка с раскрывающимся меню для остальных пунктов
                  <>
                    <button
                      onClick={() => setActiveMenu(activeMenu === key ? null : key)}
                      className={`w-full text-left flex justify-between items-center px-4 py-4 rounded-xl text-base font-semibold transition-colors duration-200 border-l-4 ${
                        activeMenu === key
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg border-teal-400'
                          : 'text-blue-800 hover:bg-teal-50 hover:text-teal-700 border-transparent hover:border-teal-400'
                      }`}
                    >
                      {item.title}
                      <svg
                        className={`h-5 w-5 transition-transform duration-300 ${activeMenu === key ? 'rotate-180' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {activeMenu === key && (
                      <div className="pl-6 mt-2 space-y-2 transition-all duration-300">
                        {item.submenu.map((subItem, index) => (
                          <div key={index}>
                            {subItem.hasNested ? (
                              <div>
                                <button
                                  onClick={() => setNestedMenu(nestedMenu === `${key}-${index}` ? null : `${key}-${index}`)}
                                  className="w-full text-left flex justify-between items-center px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200 border-l-4 border-transparent hover:border-emerald-400"
                                >
                                  {subItem.title}
                                  <svg
                                    className={`h-4 w-4 transition-transform duration-300 ${nestedMenu === `${key}-${index}` ? 'rotate-90' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                  </svg>
                                </button>

                                {nestedMenu === `${key}-${index}` && (
                                  <div className="pl-4 mt-1 space-y-1">
                                    {subItem.nestedItems.map((nestedItem, nestedIndex) => (
                                      <a
                                        key={nestedIndex}
                                        href={nestedItem.link}
                                        className="block px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200 border-l-4 border-transparent hover:border-emerald-400"
                                        onClick={() => setIsMenuOpen(false)}
                                      >
                                        {nestedItem.title}
                                      </a>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <a
                                href={subItem.link}
                                className="block px-4 py-3 rounded-lg text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-200 border-l-4 border-transparent hover:border-teal-400"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subItem.title}
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;