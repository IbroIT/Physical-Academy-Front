import React from 'react';

export const OrganizationSchema = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Кыргызская государственная академия физической культуры и спорта имени Б.Т. Турусбекова",
    "alternateName": "КГАФКиС",
    "description": "Единственный в Кыргызстане вуз, полностью ориентированный на физическую культуру и спорт",
    "foundingDate": "1955",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "улица Ахунбаева, 97",
      "addressLocality": "Бишкек",
      "addressCountry": "KG"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+996-312-57-04-89",
      "contactType": "Приёмная комиссия"
    },
    "url": "https://ksapcs.kg",
    "sameAs": [
      "https://wikipedia.org/wiki/Кыргызская_государственная_академия_физической_культуры_и_спорта"
    ]
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};

export const BreadcrumbSchema = ({ items }) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};