import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BreadcrumbSchema = ({ items = [] }) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const baseUrl = "https://ksapcs.kg";

  // Автоматическое создание breadcrumb из пути
  const generateBreadcrumbItems = () => {
    if (items.length > 0) return items;

    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbItems = [
      {
        position: 1,
        name: i18n.t('nav.academy', 'Академия'),
        item: `${baseUrl}/${i18n.language}`
      }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Пропускаем языковой сегмент
      if (segment === 'ru' || segment === 'kg' || segment === 'en') {
        return;
      }

      const position = breadcrumbItems.length + 1;
      let name = '';

      // Сопоставляем пути с переводами
      const pathToName = {
        'academy': i18n.t('nav.academy', 'Академия'),
        'about': i18n.t('nav.about_academy', 'Об академии'),
        'history': i18n.t('nav.history', 'История'),
        'mission': i18n.t('nav.mission_strategy', 'Миссия и стратегия'),
        'admissions': i18n.t('nav.admissions', 'Поступление'),
        'bachelor': i18n.t('nav.bachelor', 'Бакалавриат'),
        'master': i18n.t('nav.master_phd', 'Магистратура'),
        'college': i18n.t('nav.college', 'Колледж'),
        'education': i18n.t('nav.education', 'Образование'),
        'science': i18n.t('nav.science', 'Наука'),
        'students': i18n.t('nav.students', 'Студентам'),
        'contacts': i18n.t('nav.contacts', 'Контакты')
      };

      name = pathToName[segment] || segment;

      breadcrumbItems.push({
        position,
        name,
        item: `${baseUrl}${currentPath}`
      });
    });

    return breadcrumbItems;
  };

  const breadcrumbItems = generateBreadcrumbItems();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map(item => ({
      "@type": "ListItem",
      "position": item.position,
      "name": item.name,
      "item": item.item
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};

export default BreadcrumbSchema;