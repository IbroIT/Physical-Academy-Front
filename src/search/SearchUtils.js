// search/SearchUtils.js
import ruTranslations from '../locales/ru/translation.json';
import enTranslations from '../locales/en/translation.json'; // Исправлено: было ru
import kgTranslations from '../locales/kg/translation.json'; // Исправлено: было ru

const locales = {
  ru: ruTranslations,
  en: enTranslations,
  kg: kgTranslations
};

// Карта маршрутов на основе ваших переводов и структуры приложения
const keyToRouteMap = {
  // Главная страница
  'nav.academy': '/academy/about',
  'nav.about_academy': '/academy/about',
  'nav.history': '/academy/history',
  'nav.mission_strategy': '/academy/mission',
  'nav.accreditation': '/academy/accreditation',
  'nav.kgafkis_in_numbers': '/academy/numbers',
  'nav.leadership': '/academy/leadership/rectorate',
  'nav.board_of_trustees': '/academy/leadership/board-of-trustees',
  'nav.audit_commission': '/academy/leadership/audit-commission',
  'nav.academic_council': '/academy/leadership/academic-council',
  'nav.rectorate': '/academy/leadership/rectorate',
  'nav.trade_union': '/academy/leadership/trade-union',
  'nav.commissions': '/academy/leadership/commissions',
  'nav.academic_structure': '/academy/structure/academic',
  'nav.administrative_structure': '/academy/structure/administrative',
  'nav.administrative_units': '/academy/structure/units',
  'nav.documents': '/academy/documents',

  // Поступление
  'nav.admissions': '/admissions/bachelor/info',
  'nav.bachelor': '/admissions/bachelor/info',
  'nav.general_info': '/admissions/bachelor/info',
  'nav.registration': '/admissions/bachelor/registration',
  'nav.international_applicants': '/admissions/bachelor/international',
  'nav.quotas': '/admissions/bachelor/quotas',
  'nav.contacts': '/admissions/bachelor/contacts',
  'nav.master_phd': '/admissions/master/info',
  'nav.doctorate': '/admissions/doctorate/info',
  'nav.college': '/admissions/college/info',

  // Образование
  'nav.education': '/education/faculties/pedagogical',
  'nav.faculties': '/education/faculties/pedagogical',
  'nav.pedagogical_national_sports': '/education/faculties/pedagogical',
  'nav.coaching_faculty': '/education/faculties/coaching',
  'nav.military_training_physical_culture': '/education/faculties/military-training',
  'nav.correspondence_advanced_training': '/education/faculties/correspondence',
  'nav.general_faculty_departments': '/education/departments',
  'nav.master_program': '/education/faculties/master',
  'nav.college_physical_culture_sports': '/education/college/sports',

  // Наука
  'nav.science': '/science/publications',
  'nav.scientific_publications': '/science/publications',
  'nav.vestnik': '/science/vestnik',
  'nav.web_of_science': '/science/web-of-science',
  'nav.scopus': '/science/scopus',
  'nav.research_and_technical_council': '/science/nts',
  'nav.student_scientific_society': '/science/ssu',

  // Студентам
  'nav.students': '/students/info',
  'nav.useful_information': '/students/info',
  'nav.students_with_disabilities': '/students/disabilities',
  'nav.student_council': '/students/council',
  'nav.exchange_programs': '/students/exchange',
  'nav.instructions': '/students/instructions',
  'nav.scholarship': '/students/scholarship',
  'nav.useful_links': '/students/links',
  'nav.ebilim_login': '/students/ebilim',
  'nav.visa_support': '/students/visa-support',

  // Контакты
  'nav.address_map': '/contacts/address',
  'nav.phones_email': '/contacts/contact-info',
  'nav.social_networks': '/contacts/social',

  // Академия - дополнительные ключи
  'academy.about.title': '/academy/about',
  'academy.history.title': '/academy/history',
  'academy.mission.title': '/academy/mission',
  'academy.accreditation.title': '/academy/accreditation',
  'academy.numbers.title': '/academy/numbers',

  // Поступление - дополнительные ключи
  'bachelor.info.title': '/admissions/bachelor/info',
  'bachelor.admission.title': '/admissions/bachelor/registration',
  'bachelorInternational.title': '/admissions/bachelor/international',
  'bachelorQuotas.title': '/admissions/bachelor/quotas',
  'bachelor.contacts.title': '/admissions/bachelor/contacts',
  'graduateStudies.title': '/admissions/master/info',
  'doctorate.title': '/admissions/doctorate/info',
  'collegeInfo.title': '/admissions/college/info',

  // Образование - дополнительные ключи
  'pedagogicalSports.name': '/education/faculties/pedagogical',
  'coachingFaculty.name': '/education/faculties/coaching',
  'militaryTraining.name': '/education/faculties/military-training',
  'correspondenceTraining.name': '/education/faculties/correspondence',
  'generalDepartments.title': '/education/departments',
  'collegeSports.title': '/education/college/sports',
  'master.title': '/education/faculties/master',
  'doctorateProgram.title': '/education/faculties/doctorate',

  // Наука - дополнительные ключи
  'science.sections.publications.title': '/science/publications',
  'vestnik.title': '/science/vestnik',
  'science.sections.webofscience.title': '/science/web-of-science',
  'science.sections.scopus.title': '/science/scopus',
  'science.sections.ipchain.title': '/science/ipchain',
  'nts.title': '/science/nts',
  'studentScientificSociety.title': '/science/ssu',

  // Студентам - дополнительные ключи
  'students.info.title': '/students/info',
  'students.disabilities.title': '/students/disabilities',
  'students.council.title': '/students/council',
  'students.clubs.title': '/students/clubs',
  'students.exchange.title': '/students/exchange',
  'students.instructions.title': '/students/instructions',
  'students.scholarships.title': '/students/scholarship',
  'students.links.title': '/students/links',
  'students.ebilim.title': '/students/ebilim',
  'visaSupport.title': '/students/visa-support',

  // Контакты - дополнительные ключи
  'contact.info.title': '/contacts/contact-info',
  'contact.map.title': '/contacts/address',
  'contact.social.title': '/contacts/social'
};

// Категории для фильтрации
const routeCategories = {
  '/': 'home',
  '/academy/*': 'academy',
  '/admissions/*': 'admissions',
  '/education/*': 'education',
  '/science/*': 'science',
  '/students/*': 'students',
  '/contacts/*': 'contacts',
  '/privacy': 'legal',
  '/terms': 'legal'
};

let searchIndex = null;

export const buildSearchIndex = () => {
  if (searchIndex) return searchIndex;

  const index = [];

  const flattenTranslations = (obj, path = '', language) => {
    Object.keys(obj).forEach(key => {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        flattenTranslations(obj[key], currentPath, language);
      } else if (typeof obj[key] === 'string') {
        const value = obj[key];
        if (value && typeof value === 'string') {
          const routeInfo = getRouteInfo(currentPath);
          
          index.push({
            id: `${currentPath}_${language}`,
            key: currentPath,
            value: value,
            language: language,
            route: routeInfo.route,
            category: routeInfo.category,
            component: routeInfo.component,
            priority: routeInfo.priority,
            title: routeInfo.title
          });
        }
      }
    });
  };

  // Строим индекс для каждого языка отдельно
  Object.keys(locales).forEach(lang => {
    flattenTranslations(locales[lang], '', lang);
  });

  searchIndex = Array.from(new Set(index.map(item => item.id)))
    .map(id => index.find(item => item.id === id));

  console.log(`🔍 Построен индекс для ${searchIndex.length} записей`);
  console.log(`🌍 Распределение по языкам:`);
  Object.keys(locales).forEach(lang => {
    const count = searchIndex.filter(item => item.language === lang).length;
    console.log(`   ${lang.toUpperCase()}: ${count} записей`);
  });
  
  return searchIndex;
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

const getRouteInfo = (key) => {
  // Ищем точное совпадение
  if (keyToRouteMap[key]) {
    const route = keyToRouteMap[key];
    return {
      route: route,
      category: getCategoryFromRoute(route),
      component: getComponentFromRoute(route),
      priority: getPriority(key),
      title: getTitleFromKey(key)
    };
  }
  
  // Ищем по префиксу
  const prefix = Object.keys(keyToRouteMap)
    .sort((a, b) => b.length - a.length)
    .find(prefix => key.startsWith(prefix));
  
  if (prefix) {
    const route = keyToRouteMap[prefix];
    return {
      route: route,
      category: getCategoryFromRoute(route),
      component: getComponentFromRoute(route),
      priority: getPriority(prefix),
      title: getTitleFromKey(prefix)
    };
  }
  
  // По умолчанию - на главную
  return {
    route: '/',
    category: 'home',
    component: 'Home',
    priority: 1,
    title: 'Главная'
  };
};

const getCategoryFromRoute = (route) => {
  for (const [pattern, category] of Object.entries(routeCategories)) {
    if (pattern.endsWith('*') && route.startsWith(pattern.replace('*', ''))) {
      return category;
    }
    if (route === pattern) {
      return category;
    }
  }
  return 'other';
};

const getComponentFromRoute = (route) => {
  const componentMap = {
    '/': 'Home',
    '/academy/about': 'AcademyAbout',
    '/academy/history': 'AcademyHistory',
    '/academy/mission': 'AcademyMission',
    '/academy/accreditation': 'AcademyAccreditation',
    '/academy/numbers': 'AcademyNumbers',
    '/academy/documents': 'AcademyDocuments',
    '/academy/leadership/rectorate': 'AcademyLeadership',
    '/academy/structure/academic': 'AcademyStructure',
    '/academy/leadership/board-of-trustees': 'BoardOfTrustees',
    '/academy/leadership/audit-commission': 'AuditCommission',
    '/academy/leadership/academic-council': 'AcademicCouncil',
    '/academy/leadership/trade-union': 'TradeUnion',
    '/academy/leadership/commissions': 'Commissions',
    '/academy/structure/administrative': 'AdministrativeStructure',
    '/academy/structure/units': 'AdministrativeUnits',
    
    '/admissions/bachelor/info': 'BachelorInfo',
    '/admissions/bachelor/registration': 'BachelorRegistration',
    '/admissions/bachelor/international': 'BachelorInternational',
    '/admissions/bachelor/quotas': 'BachelorQuotasFull',
    '/admissions/bachelor/contacts': 'BachelorContacts',
    '/admissions/master/info': 'MasterInfo',
    '/admissions/college/info': 'CollegeInfo',
    '/admissions/doctorate/info': 'DoctorateInfo',
    
    '/education/faculties/pedagogical': 'PedagogicalSports',
    '/education/faculties/coaching': 'CoachingFaculty',
    '/education/faculties/military-training': 'MilitaryTraining',
    '/education/faculties/correspondence': 'CorrespondenceTraining',
    '/education/departments': 'GeneralDepartments',
    '/education/college/sports': 'CollegeSports',
    '/education/faculties/master': 'MasterProgram',
    '/education/faculties/doctorate': 'DoctorateProgram',
    
    '/science/publications': 'ScientificPublications',
    '/science/vestnik': 'Vestnik',
    '/science/web-of-science': 'WebOfScience',
    '/science/scopus': 'Scopus',
    '/science/ipchain': 'Ipchain',
    '/science/nts': 'ScientificCouncil',
    '/science/nts-committee': 'NTSCommittee',
    '/science/ssu': 'StudentScientificSociety',
    
    '/students/info': 'UsefulInfo',
    '/students/disabilities': 'StudentsDisabilities',
    '/students/council': 'StudentCouncil',
    '/students/clubs': 'StudentClubs',
    '/students/exchange': 'ExchangePrograms',
    '/students/instructions': 'Instructions',
    '/students/scholarship': 'Scholarship',
    '/students/links': 'UsefulLinks',
    '/students/ebilim': 'EbilimLogin',
    '/students/visa-support': 'VisaSupport',
    '/students/contact-info': 'StudentContactInfo',
    '/students/social': 'StudentSocial',
    
    '/contacts/address': 'AddressMap',
    '/contacts/contact-info': 'ContactInfo',
    '/contacts/social': 'SocialNetworks',
    
    '/privacy': 'PrivacyPolicy',
    '/terms': 'TermsOfService'
  };
  
  return componentMap[route] || 'Page';
};

const getTitleFromKey = (key) => {
  // Извлекаем заголовок из ключа перевода
  const titleKeys = {
    'nav.about_academy': 'Об академии',
    'nav.history': 'История',
    'nav.mission_strategy': 'Миссия и стратегия',
    'nav.accreditation': 'Аккредитация',
    'nav.kgafkis_in_numbers': 'КГАФКиС в цифрах',
    'nav.leadership': 'Руководство',
    'nav.documents': 'Документы',
    'nav.bachelor': 'Бакалавриат',
    'nav.master_phd': 'Магистратура',
    'nav.doctorate': 'Докторантура',
    'nav.college': 'Колледж',
    'nav.faculties': 'Факультеты',
    'nav.science': 'Наука',
    'nav.students': 'Студентам',
    'nav.contacts': 'Контакты'
  };
  
  return titleKeys[key] || key.split('.').pop();
};

const getPriority = (key) => {
  const priorityMap = {
    'nav.': 10,
    'academy.': 9,
    'bachelor.': 8,
    'education.': 7,
    'science.': 6,
    'students.': 5,
    'contact.': 4
  };
  
  for (const [prefix, priority] of Object.entries(priorityMap)) {
    if (key.startsWith(prefix)) {
      return priority;
    }
  }
  return 1;
};

export const searchInLocales = (query, currentLanguage, category = 'all') => {
  const index = buildSearchIndex();
  const lowerQuery = query.toLowerCase().trim();
  
  if (!lowerQuery) {
    return [];
  }

  const results = [];

  // Ищем только в текущем языке
  index.forEach(item => {
    // Фильтруем по языку - показываем только результаты на текущем языке
    if (item.language !== currentLanguage) {
      return;
    }

    if (item.value.toLowerCase().includes(lowerQuery)) {
      // Фильтрация по категории
      if (category !== 'all' && item.category !== category) {
        return;
      }
      
      const score = calculateScore(item, lowerQuery, currentLanguage);
      results.push({
        ...item,
        score,
        type: 'translation',
        query: query
      });
    }
  });

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 25);
};

const calculateScore = (item, query, currentLanguage) => {
  let score = 0;
  const lowerText = item.value.toLowerCase();
  
  // Высокий приоритет текущему языку (уже отфильтровано выше)
  score += 50;
  
  // Приоритет контента
  score += item.priority * 2;
  
  // Типы совпадений
  if (lowerText.startsWith(query)) score += 30; // Увеличил приоритет начала слова
  if (lowerText === query) score += 50; // Точное совпадение - максимальный приоритет
  else if (lowerText.includes(` ${query} `)) score += 20; // Отдельное слово
  else if (lowerText.includes(query)) score += 10; // Любое вхождение
  
  // Длина совпадения - более длинные запросы имеют больший вес
  score += Math.min(query.length * 2, 20);
  
  // Приоритет для навигационных элементов
  if (item.key.startsWith('nav.')) {
    score += 15;
  }
  
  return Math.min(score, 100); // Ограничиваем максимальный score 100
};

export const getTranslation = (key, language) => {
  return getNestedValue(locales[language] || locales.ru, key) || key;
};

// Функция для навигации к результату
export const navigateToResult = (result) => {
  if (result.route) {
    // Используем History API для навигации
    window.history.pushState({}, '', result.route);
    
    // Диспатчим событие для роутера React
    window.dispatchEvent(new PopStateEvent('popstate'));
    
    // Закрываем поиск
    window.dispatchEvent(new CustomEvent('closeSearch'));
    
    return true;
  }
  return false;
};

// Получить все категории для фильтров
export const getSearchCategories = () => {
  return [
    { value: 'all', label: { ru: 'Все', en: 'All', kg: 'Баары' } },
    { value: 'home', label: { ru: 'Главная', en: 'Home', kg: 'Башкы' } },
    { value: 'academy', label: { ru: 'Академия', en: 'Academy', kg: 'Академия' } },
    { value: 'admissions', label: { ru: 'Поступление', en: 'Admissions', kg: 'Кабыл алуу' } },
    { value: 'education', label: { ru: 'Образование', en: 'Education', kg: 'Билим берүү' } },
    { value: 'science', label: { ru: 'Наука', en: 'Science', kg: 'Илим' } },
    { value: 'students', label: { ru: 'Студентам', en: 'Students', kg: 'Студенттер үчүн' } },
    { value: 'contacts', label: { ru: 'Контакты', en: 'Contacts', kg: 'Байланыш' } }
  ];
};