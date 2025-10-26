// services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://physical-academy-backend-3dccb860f75a.herokuapp.com/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцепторы для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const collegeAPI = {
  // Получение статистики колледжа
  getCollegeStatistics: () => api.get('/admission/college-statistics/'),
  
  // Получение предстоящих событий
  getCollegeEvents: () => api.get('/admission/college-soon-events/'),
};

export default api;