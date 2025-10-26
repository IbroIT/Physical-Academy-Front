import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { seoConfig } from '../config/seoConfig';

export const useSeo = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  const getPageSeoData = (pageKey, additionalProps = {}) => {
    const currentLang = i18n.language;
    const pageData = seoConfig.pages[pageKey]?.[currentLang] || seoConfig.pages[pageKey]?.ru;
    
    if (!pageData) {
      console.warn(`SEO data not found for page: ${pageKey}`);
      return {};
    }

    // Генерируем альтернативные URL для hreflang
    const generateAlternateUrls = () => {
      const languages = ['ru', 'kg', 'en'];
      const urls = {};
      const currentPath = location.pathname;
      
      languages.forEach(lang => {
        if (lang === 'ru') {
          urls[lang] = `${seoConfig.baseUrl}${currentPath}`;
        } else {
          // Убираем текущий языковой префикс и добавляем новый
          const pathWithoutLang = currentPath.replace(/^\/(ru|kg|en)/, '');
          urls[lang] = `${seoConfig.baseUrl}/${lang}${pathWithoutLang}`;
        }
      });
      
      return urls;
    };

    return {
      title: pageData.title,
      description: pageData.description,
      keywords: pageData.keywords,
      canonical: location.pathname,
      locale: currentLang,
      alternateUrls: generateAlternateUrls(),
      ...additionalProps
    };
  };

  // Функция для получения SEO данных по пути
  const getSeoByPath = (path = '') => {
    const pathToCheck = path || location.pathname;
    
    // Сопоставляем пути с ключами страниц
    const pathMappings = {
      '/': 'home',
      '/ru': 'home',
      '/kg': 'home', 
      '/en': 'home',
      '/academy/about': 'about',
      '/academy/history': 'history',
      '/academy/mission': 'mission',
      '/admissions/bachelor': 'bachelor',
      '/admissions/master': 'master',
      '/admissions/college': 'college',
      '/education/coaching': 'coaching',
      '/education/pedagogical': 'pedagogical',
      '/science': 'science',
      '/science/vestnik': 'vestnik',
      '/contacts': 'contacts'
    };

    const pageKey = pathMappings[pathToCheck] || 'home';
    return getPageSeoData(pageKey);
  };

  return {
    getPageSeoData,
    getSeoByPath,
    baseUrl: seoConfig.baseUrl,
    siteName: seoConfig.siteName
  };
};

export default useSeo;