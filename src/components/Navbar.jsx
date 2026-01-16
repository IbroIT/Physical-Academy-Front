import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import DefaultLogo from "../assets/Logo.png";
import ScrolledLogo from "../assets/Logo.png";
import SearchButton from './SearchButton';

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

  // Функция для разделения текста на две части
  const splitText = (text) => {
    const words = text.split(' ');
    if (words.length <= 1) return [text, ''];
    
    const mid = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, mid).join(' ');
    const secondLine = words.slice(mid).join(' ');
    
    return [firstLine, secondLine];
  };

  // Данные меню для КГАФКиС
  const menuData = {
    academy: {
      title: t('nav.academy', 'Академия'),
      submenu: [
        { 
          title: t('nav.about_academyy', 'Об академии'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.about_academy', 'Об академии'), link: '/academy/about' },
            { title: t('nav.history', 'История'), link: '/academy/history' },
            { title: t('nav.mission_strategy', 'Миссия и стратегия'), link: '/academy/mission' },
            { title: t('nav.accreditation', 'Аккредитация'), link: '/academy/accreditation' },
            { title: t('nav.kgafkis_in_numbers', 'КГАФКиС в цифрах'), link: '/academy/numbers' },
          ]
        },
        { 
          title: t('nav.leadership', 'Руководство'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.board_of_trustees', 'Попечительский совет'), link: '/academy/leadership/board-of-trustees' },
            { title: t('nav.audit_commission', 'Ревизионная комиссия'), link: '/academy/leadership/audit-commission' },
            { title: t('nav.academic_council', 'Ученый совет'), link: '/academy/leadership/academic-council' },
            { title: t('nav.rectorate', 'Ректорат'), link: '/academy/leadership/rectorate' },
            { title: t('nav.trade_union', 'Профсоюз'), link: '/academy/leadership/trade-union' },
            { title: t('nav.commissions', 'Комиссии'), link: '/academy/leadership/commissions' },
            { title: t('nav.administrative_structure', 'Административная структура'), link: '/academy/structure/administrative' },
            { title: t('nav.administrative_units', 'Административные подразделения'), link: '/academy/structure/units' },
            { title: t('nav.documents', 'Документы'), link: '/academy/documents' },
          ]
        }
      ]
    },
    
    education: {
      title: t('nav.education', 'Образование'),
      submenu: [
        {
          title: t('nav.faculties', 'Факультеты'),
          hasNested: true,
          nestedItems: [
            { 
              title: t('nav.pedagogical_national_sports', 'Педагогический и национальные виды спорта'),
              link: '/education/faculties/pedagogical'
            },
            { 
              title: t('nav.coaching_faculty', 'Тренерский факультет'),
              link: '/education/faculties/coaching'
            },
            { 
              title: t('nav.military_training_physical_culture', 'Военная подготовка и физическая культура'),
              link: '/education/faculties/military-training'
            },
            { 
              title: t('nav.correspondence_advanced_training', 'Заочное обучение и повышение квалификации'),
              link: '/education/faculties/correspondence'
            },
            { 
              title: t('nav.general_faculty_departments', 'Общефакультетские кафедры'),
              link: '/education/departments'
            }
          ]
        },
        { title: t('nav.master_program', 'Магистратура'), link: '/education/faculties/master' },
        { title: t('nav.doctorate', 'Докторантура'), link: '/education/faculties/doctorate' },
        { 
          title: t('nav.college', 'Колледж'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.college_physical_culture_sports', 'Колледж физической культуры и спорта'), link: '/education/college/sports' },
          ]
        },
      ]
    },
    sport: {
      title: t('nav.sport', 'Спорт'),
      submenu: [
        { title: t('nav.sections', 'Секции'), link: '/sport/sections' },
        { title: t('nav.infrastructure', 'Инфраструктура'), link: '/sport/infrastructure' },
        { title: t('nav.achievements', 'Спортивные достижения'), link: '/sport/achievements' },
      ]
    },
    science: {
      title: t('nav.science', 'Наука'),
      submenu: [
        { title: t('nav.scientific_publications', 'Научные публикации'), link: '/science/publications' },
        { title: t('nav.vestnik', 'Вестник'), link: '/science/vestnik' },
        { title: t('nav.web_of_science', 'Web of Science'), link: '/science/web-of-science' },
        { title: t('nav.ipchain', 'IPChain'), link: '/science/ipchain' },
        // { title: t('nav.scopus', 'Scopus'), link: '/science/scopus' },
        { title: t('nav.research_and_technical_council', 'Научно-технический совет'), link: '/science/nts-committee' },
        { title: t('nav.student_scientific_society', 'Студенческое научное общество'), link: '/science/ssu' }
      ]
    },
    admissions: {
      title: t('nav.admissions', 'Поступление'),
      submenu: [
        { 
          title: t('nav.bachelor', 'Бакалавриат'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.general_info', 'Общая информация'), link: '/admissions/bachelor/info' },
            { title: t('nav.registration', 'Регистрация'), link: '/admissions/bachelor/registration' },
            { title: t('nav.international_applicants', 'Иностранные абитуриенты'), link: '/admissions/bachelor/international' },
            { title: t('nav.quotas', 'Квоты'), link: '/admissions/bachelor/quotas' },
            { title: t('nav.contacts', 'Контакты'), link: '/admissions/bachelor/contacts' },
          ]
        },
        { 
          title: t('nav.master_phd', 'Магистратура'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.general_info', 'Общая информация'), link: '/admissions/master/info' },
          ]
        },
        {
          title: t('nav.doctorate', 'Докторантура'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.general_info', 'Общая информация'), link: '/admissions/doctorate/info' },
          ]
        },
        { 
          title: t('nav.college', 'Колледж'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.general_info', 'Общая информация'), link: '/admissions/college/info' },
          ]
        },
      ]
    },
    students: {
      title: t('nav.students', 'Студентам'),
      submenu: [
        {
          title: t('nav.useful_information', 'Полезная информация'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.students_with_disabilities', 'Студенты с ограниченными возможностями'), link: '/students/disabilities' },
            { title: t('nav.student_council', 'Студенческий совет'), link: '/students/council' },
            { title: t('nav.exchange_programs', 'Программы обмена'), link: '/students/exchange' },
            { title: t('nav.instructions', 'Инструкции'), link: '/students/instructions' },
            { title: t('nav.scholarship', 'Стипендия'), link: '/students/scholarship' }
          ]
        },
        {
          title: t('nav.useful_links', 'Полезные ссылки'),
          hasNested: true,
          nestedItems: [
            { title: t('nav.visa_support', 'Визовая поддержка'), link: '/students/visa-support' }
          ]
        }
      ]
    },
    myEdu: {
      title: t('nav.my_edu', 'Моё образование'),
      link: 'https://myedu.kgafkis.kg/'
    },
    contacts: {
      title: t('nav.contacts', 'Контакты'),
      submenu: [
        { title: t('nav.address_map', 'Адрес и карта'), link: '/contacts/address' },
        { title: t('nav.phones_email', 'Телефоны и email'), link: '/contacts/contact-info' },
        { title: t('nav.social_networks', 'Социальные сети'), link: '/contacts/social' },
      ]
    }
  };

  // Разделяем текст для мобильной версии
  const [firstLine] = splitText(t('nav.kgafkis1', 'КГАФКиС'));
  const [secondLine] = splitText(t('nav.kgafkis2', 'КГАФКиС'));

  return (
    <nav
      className="sticky top-0 left-0 w-full z-50 transition-all duration-500 bg-white py-2 shadow-lg border-b border-blue-100"
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
                  src={DefaultLogo}
                  alt={t('nav.logo_alt', 'Логотип КГАФКиС')}
                  className="h-14 w-auto object-contain transition-opacity duration-300"
                />
                {/* Название для десктопной версии */}
                <h2 className="ml-3 text-xl font-bold text-blue-800 group-hover:text-teal-600 transition-colors duration-300 hidden sm:block">
                  {t('nav.kgafkis', 'КГАФКиС')}
                </h2>
                
                {/* Название для мобильной версии - разделено на две строки */}
                <div className="ml-2 xs:flex sm:hidden flex-col">
                  <span className="text-sm font-bold text-blue-800 leading-tight">{firstLine}</span>
                  <br/>
                  <span className="text-sm font-bold text-blue-800 leading-tight">{secondLine}</span>
                </div>
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
                      className="relative px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 group text-blue-800 hover:text-teal-600 hover:bg-blue-50 flex items-center"
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
                            : 'text-blue-800 hover:text-teal-600 hover:bg-blue-50'
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
            {/* Кнопка поиска */}
            <SearchButton isScrolled={true} />

            {/* Переключатель языка */}
            <div className="relative" ref={langRef}>
              <LanguageSwitcher
                variant="outline"
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
                className="inline-flex items-center justify-center p-3 rounded-xl transition-all duration-300 hover:scale-110 text-blue-700 hover:bg-teal-50 border border-blue-200 focus:outline-none backdrop-blur-sm"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">
                  {isMenuOpen 
                    ? t('nav.close_menu', 'Закрыть меню') 
                    : t('nav.open_menu', 'Открыть меню')
                  }
                </span>
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
        <div className="block min-[1475px]:hidden bg-white backdrop-blur-md shadow-xl border-t border-blue-100 transform transition-all duration-300 ease-out animate-in slide-in-from-top-2 fade-in">
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