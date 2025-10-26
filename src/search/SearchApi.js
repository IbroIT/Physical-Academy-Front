// SearchApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const searchBackend = async (query, filters) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/search/`, {
      params: {
        q: query,
        lang: filters.language,
        category: filters.category
      }
    });
    
    return response.data.results.map(item => ({
      ...item,
      source: 'backend',
      score: item.relevance || 5
    }));
  } catch (error) {
    console.error('Backend search error:', error);
    return [];
  }
};

// Индексируем данные при загрузке приложения
export const preloadSearchData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/search/index/`);
    return response.data;
  } catch (error) {
    console.error('Preload search data error:', error);
  }
};