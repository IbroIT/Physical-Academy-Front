// components/SearchButton.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SearchProvider, useSearch } from '../search/SearchContext';
import { useSearchActions } from '../search/useSearch';
import { searchInLocales, getSearchCategories, navigateToResult } from '../search/SearchUtils';

export const SearchButton = ({ isScrolled = false }) => {
  const [showSearch, setShowSearch] = useState(false);

  const handleSearchClick = () => {
    setShowSearch(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseSearch = () => {
    setShowSearch(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <button
        onClick={handleSearchClick}
        className={`inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 hover:scale-110 backdrop-blur-sm group ${
          isScrolled
            ? 'text-blue-700 hover:bg-blue-50 border border-blue-200 bg-white'
            : 'text-white hover:bg-white/30 border border-white/30 bg-white/20'
        }`}
        aria-label="Search"
      >
        <svg 
          className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {showSearch && (
        <SearchProvider>
          <CenteredSearchModal onClose={handleCloseSearch} />
        </SearchProvider>
      )}
    </>
  );
};

const CenteredSearchModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl transform transition-all duration-300 scale-100 opacity-100">
          <CenteredSearchContent onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

const CenteredSearchContent = ({ onClose }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { state } = useSearch();
  const { setQuery, performSearch, setCategory, setLanguage } = useSearchActions();
  const [localQuery, setLocalQuery] = useState('');
  const inputRef = React.useRef(null);

  const categories = getSearchCategories();

  // Синхронизация языка поиска с языком приложения
  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language, setLanguage]);

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

  // Автофокус при открытии
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e) => {
    setLocalQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      performSearch(localQuery);
    }
  };

  const handleCategoryChange = (category) => {
    setCategory(category);
    if (localQuery.trim()) {
      performSearch(localQuery);
    }
  };

  const handleQuickSearch = (quickQuery) => {
    setLocalQuery(quickQuery);
    setQuery(quickQuery);
    performSearch(quickQuery);
  };

  const handleResultClick = (result) => {
    navigateToResult(result, navigate);
    onClose();
  };

  const quickSearches = {
    ru: ['Бакалавриат', 'Магистратура', 'Факультеты', 'Контакты', 'Документы'],
    en: ['Bachelor', 'Master', 'Faculties', 'Contacts', 'Documents'],
    kg: ['Бакалавриат', 'Магистратура', 'Факультеттер', 'Байланыш', 'Документтер']
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300">
      {/* Заголовок и кнопка закрытия */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {t('search.title', 'Поиск по академии')}
          </h2>
          <p className="text-gray-600 mt-1">
            {t('search.subtitle', 'Найдите нужную информацию быстро и легко')}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white rounded-full transition-all duration-200 hover:scale-110 hover:shadow-lg"
          aria-label={t('search.close', 'Закрыть поиск')}
        >
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Поле ввода по центру */}
      <div className="p-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={localQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={t('search.placeholder', 'Поиск по академии...')}
              className="w-full px-6 py-4 pl-14 pr-12 text-lg border border-gray-300 rounded-2xl bg-white shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
              autoFocus
            />
            
            {/* Иконка поиска */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Индикатор загрузки */}
            {state.isLoading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* Кнопка очистки */}
            {localQuery && !state.isLoading && (
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 hover:bg-gray-100 rounded-full"
                onClick={() => setLocalQuery('')}
                aria-label={t('search.clear', 'Очистить поиск')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Подсказки под полем ввода */}
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {quickSearches[i18n.language]?.map((tip) => (
              <button
                key={tip}
                onClick={() => handleQuickSearch(tip)}
                className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
              >
                {tip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Результаты поиска по центру */}
      {(localQuery || state.results.length > 0) && (
        <div className="border-t border-gray-100 max-w-4xl mx-auto">
          <div className="p-6 max-h-96 overflow-y-auto">
            {state.isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">
                  {t('search.searching', 'Идет поиск...')}
                </p>
              </div>
            ) : state.results.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('search.results_count', { count: state.results.length }, `Найдено результатов: ${state.results.length}`)}
                  </h3>
                  <div className="flex gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.value}
                        onClick={() => handleCategoryChange(cat.value)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                          state.filters.category === cat.value
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {cat.label[i18n.language] || cat.label.ru}
                      </button>
                    ))}
                  </div>
                </div>
                
                {state.results.map((result) => (
                  <SearchResultItem 
                    key={result.id} 
                    result={result} 
                    onClose={onClose}
                    query={localQuery}
                    navigate={navigate}
                  />
                ))}
              </div>
            ) : localQuery ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('search.no_results', 'Ничего не найдено')}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {t('search.try_again', 'Попробуйте изменить запрос или использовать другие ключевые слова')}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Футер с подсказками */}
      {!localQuery && state.results.length === 0 && (
        <div className="border-t border-gray-100 bg-gray-50/50">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <SearchHelpCard
                icon={
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title={t('search.help.academy.title', 'Об академии')}
                description={t('search.help.academy.description', 'История, руководство, документы')}
                color="blue"
              />
              
              <SearchHelpCard
                icon={
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  </svg>
                }
                title={t('search.help.admissions.title', 'Поступление')}
                description={t('search.help.admissions.description', 'Бакалавриат, магистратура, колледж')}
                color="green"
              />
              
              <SearchHelpCard
                icon={
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
                title={t('search.help.faculties.title', 'Факультеты')}
                description={t('search.help.faculties.description', 'Все направления и кафедры')}
                color="purple"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SearchHelpCard = ({ icon, title, description, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="text-center">
      <div className={`w-10 h-10 mx-auto mb-2 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
    </div>
  );
};

const SearchResultItem = ({ result, onClose, query, navigate }) => {
  const { t, i18n } = useTranslation();

  const handleClick = () => {
    navigateToResult(result, navigate);
    onClose();
  };

  const highlightMatch = (text, searchQuery) => {
    if (!searchQuery) return text;
    
    const lowerText = text.toLowerCase();
    const lowerQuery = searchQuery.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    
    if (index === -1) return text;
    
    return (
      <>
        {text.substring(0, index)}
        <mark className="bg-yellow-200 px-1 rounded">{text.substring(index, index + searchQuery.length)}</mark>
        {text.substring(index + searchQuery.length)}
      </>
    );
  };

  const getCategoryName = (category) => {
    const categoryNames = {
      home: t('search.categories.home', 'Главная'),
      academy: t('search.categories.academy', 'Академия'),
      admissions: t('search.categories.admissions', 'Поступление'),
      education: t('search.categories.education', 'Образование'),
      science: t('search.categories.science', 'Наука'),
      students: t('search.categories.students', 'Студентам'),
      contacts: t('search.categories.contacts', 'Контакты')
    };
    
    return categoryNames[category] || category;
  };

  return (
    <div 
      onClick={handleClick}
      className="group p-6 border border-gray-200 rounded-2xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer bg-white hover:bg-blue-50/30"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {result.key.split('.').pop()}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
              {getCategoryName(result.category)}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              result.language === i18n.language 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {result.language.toUpperCase()}
            </span>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
            {highlightMatch(result.value, query)}
          </h4>
          
          {result.title && (
            <p className="text-gray-600 mb-3 leading-relaxed">
              {result.title}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-sm text-blue-600 font-medium flex items-center gap-2">
              {t('search.go_to_page', 'Перейти к разделу')}
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {Math.round(result.score)}%
            </span>
          </div>
        </div>
        
        <div className="ml-4 flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchButton;