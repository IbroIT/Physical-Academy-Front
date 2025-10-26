import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const SeoProvider = ({ children }) => {
  return (
    <HelmetProvider>
      {children}
    </HelmetProvider>
  );
};

// Хук для автоматического SEO по текущему пути
export const useRouteSeo = () => {
  const location = useLocation();
  const { i18n } = useTranslation();

  const getSeoByPath = () => {
    const pathToKey = {
      // Основные пути
      '/': 'home',
      '/privacy': 'privacy',
      '/terms': 'terms',

      // Академия
      '/academy/about': 'about',
      '/academy/history': 'history',
      '/academy/mission': 'mission',
      '/academy/accreditation': 'accreditation',
      '/academy/numbers': 'numbers',
      '/academy/documents': 'documents',
      '/academy/leadership/rectorate': 'leadership',
      '/academy/structure/academic': 'structure',
      '/academy/leadership/board-of-trustees': 'boardOfTrustees',
      '/academy/leadership/audit-commission': 'auditCommission',
      '/academy/leadership/academic-council': 'academicCouncil',
      '/academy/leadership/trade-union': 'tradeUnion',
      '/academy/leadership/commissions': 'commissions',
      '/academy/structure/administrative': 'administrativeStructure',
      '/academy/structure/units': 'administrativeUnits',

      // Поступление
      '/admissions/bachelor/info': 'bachelor',
      '/admissions/bachelor/registration': 'bachelorRegistration',
      '/admissions/bachelor/international': 'bachelorInternational',
      '/admissions/bachelor/quotas': 'bachelorQuotas',
      '/admissions/bachelor/contacts': 'bachelorContacts',
      '/admissions/master/info': 'master',
      '/admissions/college/info': 'college',
      '/admissions/doctorate/info': 'doctorate',

      // Образование
      '/education/faculties/pedagogical': 'pedagogical',
      '/education/faculties/coaching': 'coaching',
      '/education/faculties/military-training': 'militaryTraining',
      '/education/faculties/correspondence': 'correspondence',
      '/education/departments': 'departments',
      '/education/college/sports': 'collegeSports',
      '/education/faculties/master': 'masterProgram',
      '/education/faculties/doctorate': 'doctorateProgram',

      // Наука
      '/science/publications': 'publications',
      '/science/vestnik': 'vestnik',
      '/science/web-of-science': 'webOfScience',
      '/science/scopus': 'scopus',
      '/science/ipchain': 'ipchain',
      '/science/nts': 'scientificCouncil',
      '/science/nts-committee': 'ntsCommittee',
      '/science/ssu': 'studentScientificSociety',

      // Студентам
      '/students/info': 'studentsInfo',
      '/students/disabilities': 'studentsDisabilities',
      '/students/council': 'studentCouncil',
      '/students/clubs': 'studentClubs',
      '/students/exchange': 'exchangePrograms',
      '/students/instructions': 'instructions',
      '/students/scholarship': 'scholarship',
      '/students/links': 'usefulLinks',
      '/students/ebilim': 'ebilim',
      '/students/visa-support': 'visaSupport',
      '/students/contact-info': 'studentContactInfo',
      '/students/social': 'studentSocial',

      // Контакты
      '/contacts/address': 'address',
      '/contacts/contact-info': 'contactInfo',
      '/contacts/social': 'socialNetworks'
    };

    return pathToKey[location.pathname] || 'home';
  };

  return {
    pageKey: getSeoByPath(),
    currentLanguage: i18n.language
  };
};