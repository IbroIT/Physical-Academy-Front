// search/useSearch.js
import { useCallback } from 'react';
import { useSearch } from './SearchContext';
import { searchInLocales } from './SearchUtils';

export const useSearchActions = () => {
  const { state, dispatch } = useSearch();

  const performSearch = useCallback(async (searchQuery = state.query) => {
    if (!searchQuery.trim()) {
      dispatch({ type: 'SET_RESULTS', payload: [] });
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const results = await searchInLocales(
        searchQuery, 
        state.language, 
        state.filters.category
      );
      dispatch({ type: 'SET_RESULTS', payload: results });
    } catch (error) {
      console.error('Search error:', error);
      dispatch({ type: 'SET_RESULTS', payload: [] });
    }
  }, [state.query, state.language, state.filters.category, dispatch]);

  const setQuery = useCallback((query) => {
    dispatch({ type: 'SET_QUERY', payload: query });
  }, [dispatch]);

  const setLanguage = useCallback((language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
    // Перезапускаем поиск при смене языка
    if (state.query) {
      performSearch(state.query);
    }
  }, [state.query, performSearch, dispatch]);

  const setCategory = useCallback((category) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
    // Перезапускаем поиск при смене категории
    if (state.query) {
      performSearch(state.query);
    }
  }, [state.query, performSearch, dispatch]);

  const openSearch = useCallback(() => {
    dispatch({ type: 'SET_OPEN', payload: true });
  }, [dispatch]);

  const closeSearch = useCallback(() => {
    dispatch({ type: 'SET_OPEN', payload: false });
  }, [dispatch]);

  const clearSearch = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, [dispatch]);

  return {
    performSearch,
    setQuery,
    setLanguage,
    setCategory,
    openSearch,
    closeSearch,
    clearSearch
  };
};