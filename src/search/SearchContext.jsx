// search/SearchContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const SearchContext = createContext();

const initialState = {
  query: '',
  results: [],
  isLoading: false,
  isOpen: false,
  language: 'ru',
  category: 'all',
  filters: {
    category: 'all'
  }
};

function searchReducer(state, action) {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_OPEN':
      return { ...state, isOpen: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_CATEGORY':
      return { 
        ...state, 
        filters: { ...state.filters, category: action.payload } 
      };
    case 'CLEAR_FILTERS':
      return { 
        ...state, 
        filters: { category: 'all' },
        query: '',
        results: [] 
      };
    default:
      return state;
  }
}

export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  // Слушаем событие закрытия поиска
  React.useEffect(() => {
    const handleCloseSearch = () => {
      dispatch({ type: 'SET_OPEN', payload: false });
    };

    window.addEventListener('closeSearch', handleCloseSearch);
    return () => window.removeEventListener('closeSearch', handleCloseSearch);
  }, []);

  return (
    <SearchContext.Provider value={{ state, dispatch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
};