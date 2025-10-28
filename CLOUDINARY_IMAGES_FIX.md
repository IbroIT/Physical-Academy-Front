# Исправление отображения изображений на фронтенде

## Проблема
Изображения не отображались на фронтенде, потому что URL к изображениям формировались неправильно. Когда изображения загружены в Cloudinary, API возвращает полный URL вида:
```
https://res.cloudinary.com/dyg5p8i69/image/upload/v1/media/...
```

Но фронтенд пытался добавить базовый URL сервера:
```javascript
`https://physical-academy-backend-3dccb860f75a.herokuapp.com${slide.image_url}`
```

Что приводило к неправильным URL:
```
https://physical-academy-backend-3dccb860f75a.herokuapp.com/https://res.cloudinary.com/...
```

## Решение

### 1. Создана утилита `src/utils/imageUtils.js`

Функция `getImageUrl()` проверяет, является ли URL полным (Cloudinary) или относительным (локальные файлы):

```javascript
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  
  // Если URL уже полный (Cloudinary или другой CDN)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Если относительный путь, добавляем базовый URL
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${API_BASE_URL}/${cleanPath}`;
};
```

### 2. Обновлены компоненты

Все компоненты, использующие изображения, обновлены для использования утилиты:

#### Обновленные файлы:
- ✅ `src/components/pages/home/Banner.jsx`
- ✅ `src/components/pages/home/News.jsx`
- ✅ `src/components/pages/home/QuotesBanner.jsx`
- ✅ `src/components/pages/home/AdsPage.jsx`

#### Пример использования:

**До:**
```jsx
<img src={`https://physical-academy-backend-3dccb860f75a.herokuapp.com${slide.image_url}`} />
```

**После:**
```jsx
import { getImageUrl } from '../../../utils/imageUtils';

<img src={getImageUrl(slide.image_url)} />
```

**Для background-image:**
```jsx
import { getBackgroundImageUrl } from '../../../utils/imageUtils';

<div style={{ backgroundImage: getBackgroundImageUrl(news.image_url) }} />
```

## Результат

✅ Изображения из Cloudinary отображаются правильно
✅ Локальные изображения (если есть) также работают
✅ Единый способ обработки URL изображений во всем приложении
✅ Легко поддерживать и расширять

## Как это работает сейчас

1. **Cloudinary изображения**: 
   - API возвращает: `https://res.cloudinary.com/...`
   - `getImageUrl()` определяет полный URL и возвращает его как есть

2. **Локальные изображения** (если есть):
   - API возвращает: `/media/image.jpg`
   - `getImageUrl()` добавляет базовый URL: `https://backend.com/media/image.jpg`

3. **Переменные окружения**:
   - `VITE_API_URL` в `.env` определяет базовый URL бэкенда
   - Используется только для локальных файлов
