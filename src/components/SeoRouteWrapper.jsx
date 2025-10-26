import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSeoManager } from '../hooks/useSeoManager';

// Полное сопоставление всех путей с pageKey
const pathToPageKey = {
  // Основные страницы
  '/': 'home',
  '/privacy': 'privacy',
  '/terms': 'terms',
  '/news/:id': 'news_detail',
  '/announcement/:id': 'announcement_detail',

  // Academy routes
  '/academy/about': 'about',
  '/academy/history': 'history',
  '/academy/mission': 'mission',
  '/academy/accreditation': 'accreditation',
  '/academy/numbers': 'numbers',
  '/academy/documents': 'documents',
  '/academy/leadership/rectorate': 'leadership',
  '/academy/structure/academic': 'structure',
  '/academy/leadership/board-of-trustees': 'board_of_trustees',
  '/academy/leadership/audit-commission': 'audit_commission',
  '/academy/leadership/academic-council': 'academic_council',
  '/academy/leadership/trade-union': 'trade_union',
  '/academy/leadership/commissions': 'commissions',
  '/academy/structure/administrative': 'administrative_structure',
  '/academy/structure/units': 'administrative_units',

  // Admissions routes
  '/admissions/bachelor/info': 'bachelor',
  '/admissions/bachelor/registration': 'bachelor_registration',
  '/admissions/bachelor/international': 'bachelor_international',
  '/admissions/bachelor/quotas': 'bachelor_quotas',
  '/admissions/bachelor/contacts': 'bachelor_contacts',
  '/admissions/master/info': 'master',
  '/admissions/college/info': 'college',
  '/admissions/doctorate/info': 'doctorate',

  // Education routes
  '/education/faculties/pedagogical': 'pedagogical',
  '/education/faculties/coaching': 'coaching',
  '/education/faculties/military-training': 'military',
  '/education/faculties/correspondence': 'correspondence',
  '/education/departments': 'departments',
  '/education/college/sports': 'college_sports',
  '/education/faculties/master': 'master_program',
  '/education/faculties/doctorate': 'doctorate_program',

  // Science routes
  '/science/publications': 'publications',
  '/science/vestnik': 'vestnik',
  '/science/web-of-science': 'web_of_science',
  '/science/scopus': 'scopus',
  '/science/ipchain': 'ipchain',
  '/science/nts': 'scientific_council',
  '/science/nts-committee': 'nts_committee',
  '/science/ssu': 'student_scientific_society',

  // Students routes
  '/students/info': 'student_info',
  '/students/disabilities': 'students_disabilities',
  '/students/council': 'student_council',
  '/students/clubs': 'student_clubs',
  '/students/exchange': 'exchange',
  '/students/instructions': 'instructions',
  '/students/scholarship': 'scholarship',
  '/students/links': 'useful_links',
  '/students/ebilim': 'ebilim',
  '/students/visa-support': 'visa_support',
  '/students/contact-info': 'student_contact',
  '/students/social': 'student_social',

  // Contacts routes
  '/contacts/address': 'contacts',
  '/contacts/contact-info': 'contact_info',
  '/contacts/social': 'social_networks'
};

const SeoRouteWrapper = ({ children }) => {
  const location = useLocation();
  
  // Находим точное соответствие пути
  let pageKey = pathToPageKey[location.pathname];
  
  // Если точного соответствия нет, пытаемся найти по шаблону
  if (!pageKey) {
    // Для динамических маршрутов типа /news/:id
    if (location.pathname.startsWith('/news/')) {
      pageKey = 'news_detail';
    } else if (location.pathname.startsWith('/announcement/')) {
      pageKey = 'announcement_detail';
    }
    // Можно добавить другие шаблоны при необходимости
  }
  
  // Используем найденный pageKey или 'home' по умолчанию
  useSeoManager(pageKey || 'home');
  
  return children;
};

export default SeoRouteWrapper;