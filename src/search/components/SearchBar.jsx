// search/components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSearch } from '../SearchContext';
import { useSearchActions } from '../useSearch';

export const SearchBar = () => {
  const { state } = useSearch();
  const { setQuery, performSearch, openSearch, setLanguage } = useSearchActions();
  const [localQuery, setLocalQuery] = useState('');
  const inputRef = useRef(null);

  // Автоматически открываем поиск при фокусе
  const handleFocus = () => {
    openSearch();
  };

  // Дебаунс поиска
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (localQuery !== state.query) {
        setQuery(localQuery);
        if (localQuery.trim()) {
          performSearch(localQuery);
        } else {
          performSearch('');
        }
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [localQuery, state.query, setQuery, performSearch]);

  const handleChange = (e) => {
    setLocalQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.target.blur();
    } else if (e.key === 'Enter') {
      performSearch(localQuery);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const placeholderText = {
    ru: 'Поиск по академии...',
    en: 'Search the academy...',
    kg: 'Академиядан издөө...'
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Селектор языка */}
        <select 
          value={state.language} 
          onChange={handleLanguageChange}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
        >
          <option value="ru">RU</option>
          <option value="en">EN</option>
          <option value="kg">KG</option>
        </select>
        
        {/* Поле поиска */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholderText[state.language]}
            value={localQuery}
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            className="w-64 px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-full bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
          />
          
          {/* Иконка поиска */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Индикатор загрузки */}
          {state.isLoading && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Кнопка очистки */}
          {localQuery && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={() => {
                setLocalQuery('');
                setQuery('');
                performSearch('');
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};