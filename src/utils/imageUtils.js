/**
 * Утилита для получения правильного URL изображения
 * Обрабатывает как Cloudinary URL, так и локальные пути
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Получить полный URL изображения
 * @param {string} imagePath - Путь к изображению из API
 * @returns {string} - Полный URL изображения
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '';
  }

  // Если URL уже полный (Cloudinary или другой CDN)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Если относительный путь, добавляем базовый URL
  // Убираем начальный слеш если есть
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${API_BASE_URL}/${cleanPath}`;
};

/**
 * Получить URL для фонового изображения (background-image)
 * @param {string} imagePath - Путь к изображению из API
 * @returns {string} - URL в формате для CSS background-image
 */
export const getBackgroundImageUrl = (imagePath) => {
  const url = getImageUrl(imagePath);
  return url ? `url(${url})` : '';
};
