import { useEffect } from 'react';
import { useSeo } from './useSeo';

export const useSeoManager = (pageKey, additionalProps = {}) => {
  const { getPageSeoData } = useSeo();
  
  useEffect(() => {
    const seoData = getPageSeoData(pageKey, additionalProps);
    
    if (!seoData.title) return;

    // Обновляем title
    document.title = seoData.title;

    // Функция для обновления/создания meta тегов
    const updateMetaTag = (name, content) => {
      if (!content) return;
      
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (metaTag) {
        metaTag.content = content;
      } else {
        metaTag = document.createElement('meta');
        metaTag.name = name;
        metaTag.content = content;
        document.head.appendChild(metaTag);
      }
    };

    // Функция для обновления/создания OG тегов
    const updateOgTag = (property, content) => {
      if (!content) return;
      
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (ogTag) {
        ogTag.content = content;
      } else {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        ogTag.content = content;
        document.head.appendChild(ogTag);
      }
    };

    // Обновляем основные meta теги
    updateMetaTag('description', seoData.description);
    updateMetaTag('keywords', seoData.keywords);

    // Обновляем OG теги
    updateOgTag('og:title', seoData.title);
    updateOgTag('og:description', seoData.description);
    updateOgTag('og:type', 'website');
    updateOgTag('og:url', window.location.href);
    updateOgTag('og:site_name', 'КГАФКиС');

    // Обновляем canonical
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.href = seoData.canonical || window.location.href;
    } else {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = seoData.canonical || window.location.href;
      document.head.appendChild(canonicalLink);
    }

    // Очистка при размонтировании
    return () => {
      // Можно сбросить к значениям по умолчанию, если нужно
    };

  }, [pageKey, additionalProps, getPageSeoData]);
};