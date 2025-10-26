// utils/routeParser.js
import routes from '../router/routes'; // Ваш конфиг маршрутов

export const parseRoutesForSearch = (routesConfig) => {
  const pages = [];
  
  const extractRouteInfo = (route, parentPath = '') => {
    const fullPath = `${parentPath}${route.path}`;
    
    if (route.element || route.component) {
      pages.push({
        id: `route_${route.path}`,
        title: route.title || generateTitleFromPath(route.path),
        path: fullPath,
        type: 'page',
        component: route.element || route.component,
        // Автоматически генерируем описание
        description: `Страница: ${route.path}`
      });
    }
    
    if (route.children) {
      route.children.forEach(child => extractRouteInfo(child, fullPath));
    }
  };
  
  routesConfig.forEach(route => extractRouteInfo(route));
  return pages;
};

const generateTitleFromPath = (path) => {
  return path.split('/')
    .filter(part => part && !part.startsWith(':'))
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' / ');
};


export const getComponentByRoute = (route) => {
  const routeToComponent = {
    '/': 'HomePage',
    '/about': 'AboutPage', 
    '/services': 'ServicesPage',
    '/contact': 'ContactPage'
  };
  
  return routeToComponent[route] || 'Page';
};

export const scrollToSection = (sectionId) => {
  const element = document.querySelector(`[data-section="${sectionId}"]`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    
    // Добавляем класс для подсветки
    element.classList.add('highlight-section');
    setTimeout(() => {
      element.classList.remove('highlight-section');
    }, 2000);
  }
};

// Хук для обработки навигации
export const useSearchNavigation = () => {
  const navigateToSearchResult = (result) => {
    const { route, section } = result;
    
    // Навигация
    if (route && route !== window.location.pathname) {
      window.history.pushState({}, '', route);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    
    // Скролл к секции
    if (section) {
      setTimeout(() => {
        scrollToSection(section);
      }, 100);
    }
    
    return true;
  };
  
  return { navigateToSearchResult };
};
