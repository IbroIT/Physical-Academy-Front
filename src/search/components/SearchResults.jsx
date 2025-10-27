// search/components/SearchResults.jsx
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../SearchContext';
import { useSearchActions } from '../useSearch';
import { navigateToResult, getSearchCategories } from '../SearchUtils';

export const SearchResults = () => {
  const { state } = useSearch();
  const navigate = useNavigate();
  const { closeSearch, setCategory, performSearch } = useSearchActions();
  const categories = getSearchCategories();
  const resultsRef = useRef(null);

  // Фокус на инпуте при открытии
  useEffect(() => {
    if (state.isOpen) {
      const searchInput = document.querySelector('input[type="text"]');
      if (searchInput) {
        setTimeout(() => {
          searchInput.focus();
        }, 100);
      }
    }
  }, [state.isOpen]);

  // Обработка клавиш и кликов вне области
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeSearch();
      }
    };

    const handleClickOutside = (e) => {
      if (resultsRef.current && 
          !resultsRef.current.contains(e.target) &&
          !e.target.closest('input[type="text"]') &&
          !e.target.closest('select')) {
        closeSearch();
      }
    };

    if (state.isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [state.isOpen, closeSearch]);

  // Автоматический поиск при открытии, если есть запрос
  useEffect(() => {
    if (state.isOpen && state.query && state.results.length === 0) {
      performSearch(state.query);
    }
  }, [state.isOpen, state.query, state.results.length, performSearch]);

  if (!state.isOpen) return null;

  const translationTexts = {
    ru: {
      results: 'Результаты поиска',
      noResults: 'Ничего не найдено',
      enterQuery: 'Введите запрос для поиска',
      searching: 'Идет поиск...',
      goToPage: 'Перейти на страницу',
      category: 'Категория',
      all: 'Все',
      typeToSearch: 'Начните вводить запрос...',
      found: 'Найдено результатов'
    },
    en: {
      results: 'Search results',
      noResults: 'No results found',
      enterQuery: 'Enter search query',
      searching: 'Searching...',
      goToPage: 'Go to page',
      category: 'Category',
      all: 'All',
      typeToSearch: 'Start typing to search...',
      found: 'Results found'
    },
    kg: {
      results: 'Издөө натыйжалары',
      noResults: 'Эч нерсе табылган жок',
      enterQuery: 'Издөө үчүн суроо киргизиңиз',
      searching: 'Издөө жүрүүдө...',
      goToPage: 'Бетке өтүү',
      category: 'Категория',
      all: 'Баары',
      typeToSearch: 'Издөө үчүн жазбай баштаңыз...',
      found: 'Табылган натыйжалар'
    }
  };

  const t = translationTexts[state.language];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div 
        ref={resultsRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col animate-in fade-in-90 slide-in-from-bottom-10 duration-300"
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
          <h3 className="text-xl font-semibold text-gray-900">{t.results}</h3>
          <button 
            onClick={closeSearch}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-200"
            aria-label="Close search"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Фильтры */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {t.category}:
            </label>
            <select 
              value={state.filters.category} 
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label[state.language] || cat.label.ru}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Результаты */}
        <div className="flex-1 overflow-y-auto">
          {state.isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">{t.searching}</p>
            </div>
          ) : state.results.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              {state.query ? (
                <>
                  <div className="text-6xl mb-4">🔍</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{t.noResults}</h4>
                  <p className="text-gray-600 max-w-md">
                    Попробуйте изменить запрос или выбрать другую категорию
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">⌨️</div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{t.typeToSearch}</h4>
                  <p className="text-gray-600 max-w-md">
                    Ищите по страницам академии, факультетам, программам и другим разделам
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="p-4">
              <div className="mb-4 px-2">
                <p className="text-sm text-gray-600">
                  {t.found}: {state.results.length}
                </p>
              </div>
              <div className="space-y-3">
                {state.results.map((result, index) => (
                  <SearchResultItem 
                    key={result.id} 
                    result={result} 
                    language={state.language}
                    t={t}
                    navigate={navigate}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchResultItem = ({ result, language, t, navigate }) => {
  const { closeSearch } = useSearchActions();

  const handleClick = () => {
    navigateToResult(result, navigate);
    closeSearch();
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    
    if (index === -1) return text;
    
    return (
      <>
        {text.substring(0, index)}
        <mark className="bg-yellow-200 px-1 rounded">{text.substring(index, index + query.length)}</mark>
        {text.substring(index + query.length)}
      </>
    );
  };

  const getCategoryName = (category) => {
    const categoryNames = {
      home: { ru: 'Главная', en: 'Home', kg: 'Башкы' },
      academy: { ru: 'Академия', en: 'Academy', kg: 'Академия' },
      admissions: { ru: 'Поступление', en: 'Admissions', kg: 'Кабыл алуу' },
      education: { ru: 'Образование', en: 'Education', kg: 'Билим берүү' },
      science: { ru: 'Наука', en: 'Science', kg: 'Илим' },
      students: { ru: 'Студентам', en: 'Students', kg: 'Студенттер үчүн' },
      contacts: { ru: 'Контакты', en: 'Contacts', kg: 'Байланыш' }
    };
    
    return categoryNames[category]?.[language] || category;
  };

  return (
    <div 
      onClick={handleClick}
      className="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer bg-white hover:bg-blue-50"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Основной текст */}
          <div className="text-gray-900 font-medium mb-2 leading-relaxed">
            {highlightMatch(result.value, result.query)}
          </div>
          
          {/* Мета-информация */}
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {result.key}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              {getCategoryName(result.category)}
            </span>
          </div>
          
          {/* Навигация */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-sm text-blue-600 font-medium">
              {t.goToPage}: <span className="text-gray-900">{result.title || result.component}</span>
            </span>
            <span className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200">
              →
            </span>
          </div>
        </div>
        
        {/* Боковая мета-информация */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            result.language === language 
              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {result.language.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {Math.round(result.score)}%
          </span>
        </div>
      </div>
    </div>
  );
};