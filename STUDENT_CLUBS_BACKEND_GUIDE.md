# Руководство по интеграции Student Clubs с Backend

## ✅ Что было сделано

Компонент `StudentClubs` теперь полностью интегрирован с backend API и поддерживает 3 языка (русский, английский, кыргызский).

## 📦 Обновленные файлы

1. **`src/services/api.js`** - добавлены методы для работы с API студенческих клубов
2. **`src/hooks/useApi.js`** - добавлены хуки для удобной работы с API
3. **`src/components/pages/students/StudentClubs.jsx`** - компонент переработан для работы с API

## 🚀 Как использовать

### Автоматическая смена языка

Компонент автоматически обновляет данные при смене языка в приложении:

```javascript
// Язык меняется через LanguageSwitcher или i18n
i18n.changeLanguage('en'); // Данные автоматически загрузятся на английском
```

### Фильтрация и поиск

Все фильтры работают на стороне backend:

```javascript
// Фильтр по категории
<select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
  <option value="all">Все категории</option>
  <option value="tech">Технологии</option>
</select>

// Поиск
<input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
```

### Структура данных с API

API возвращает следующую структу данных:

```json
{
  "title": "Студенческие клубы и сообщества",
  "subtitle": "Описание страницы",
  "stats": [
    { "id": 1, "value": "50+", "label": "Активных клубов" }
  ],
  "categories": [
    { "id": 1, "slug": "tech", "name": "Технологии и IT" }
  ],
  "clubs": [
    {
      "id": 1,
      "icon": "💻",
      "name": "IT Club",
      "short_description": "Краткое описание",
      "description": "Полное описание",
      "status": "active",
      "members_count": 45,
      "meetings": "Каждую среду 19:00",
      "tags": ["python", "javascript"],
      "join_link": "https://t.me/itclub",
      "leaders": [
        { "id": 1, "name": "Иванов Иван", "role": "Президент" }
      ],
      "goals": "Цели клуба",
      "motivation": "Почему стоит присоединиться",
      "category": { "id": 1, "slug": "tech", "name": "Технологии" }
    }
  ]
}
```

## 🔧 Настройка Backend URL

### Вариант 1: Прямое изменение в коде

Откройте `src/services/api.js` и измените базовый URL:

```javascript
class ApiService {
    constructor() {
        this.baseURL = 'https://your-domain.com/api/v1';
    }
}
```

### Вариант 2: Через переменные окружения (рекомендуется)

1. Создайте файл `.env` в корне проекта:
```env
VITE_API_BASE_URL=https://your-domain.com/api/v1
```

2. Обновите `src/services/api.js`:
```javascript
class ApiService {
    constructor() {
        this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    }
}
```

3. Для production создайте `.env.production`:
```env
VITE_API_BASE_URL=https://api.production.com/api/v1
```

## 🌐 Работа с языками

### Поддерживаемые языки

- `ru` - Русский (по умолчанию)
- `en` - English
- `kg` - Кыргызча

### Маппинг языков

API использует код `ky` для кыргызского языка, но в приложении используется `kg`. Конвертация происходит автоматически:

```javascript
getLanguageParam(language) {
    const langMap = {
        'ru': 'ru',
        'kg': 'ky', // Автоматическая конвертация
        'en': 'en'
    };
    return langMap[language] || 'ru';
}
```

## 📝 Требования к Backend API

### Endpoint для страницы клубов

**URL:** `GET /api/v1/student-clubs/clubs/page_data/`

**Query Parameters:**
- `lang` - язык (ru, en, ky)
- `category` - slug категории (опционально)
- `search` - строка поиска (опционально)

**Response:** JSON с полными данными страницы

### Endpoint для вступления в клуб

**URL:** `POST /api/v1/student-clubs/clubs/{id}/join/`

**Request Body:**
```json
{
  "email": "student@example.com",
  "name": "Имя Фамилия"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Заявка отправлена",
  "club_name": "Название клуба",
  "join_link": "https://t.me/club_link"
}
```

## 🧪 Тестирование

### 1. Проверка подключения к API

```bash
# Проверьте, что backend доступен
curl http://localhost:8000/api/v1/student-clubs/clubs/page_data/?lang=ru
```

### 2. Запуск приложения

```bash
npm run dev
```

### 3. Проверка работы

1. Откройте страницу студенческих клубов
2. Убедитесь, что данные загружаются
3. Переключите язык - данные должны обновиться
4. Попробуйте фильтры и поиск
5. Нажмите "Присоединиться" к клубу

## 🐛 Отладка

### Проблема: Данные не загружаются

**Решение:**
1. Откройте консоль браузера (F12)
2. Проверьте вкладку Network
3. Найдите запросы к API
4. Проверьте статус ответа и данные

### Проблема: CORS ошибка

**Решение на Backend (Django):**
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",
]

# или для разработки
CORS_ALLOW_ALL_ORIGINS = True
```

### Проблема: Неправильный язык

**Решение:**
1. Проверьте значение `i18n.language`
2. Убедитесь, что API поддерживает этот язык
3. Проверьте маппинг в `getLanguageParam()`

## 💡 Дополнительные возможности

### Добавление новых фильтров

```javascript
// В StudentClubs.jsx
const [statusFilter, setStatusFilter] = useState('all');

const filters = {};
if (selectedCategory !== 'all') filters.category = selectedCategory;
if (searchTerm.trim()) filters.search = searchTerm;
if (statusFilter !== 'all') filters.status = statusFilter; // Новый фильтр

const { data, loading, error } = useStudentClubsPageData(filters);
```

### Использование отдельных endpoints

```javascript
// Вместо page_data можно использовать отдельные хуки
import { 
  useStudentClubs, 
  useStudentClubCategories, 
  useStudentClubStats 
} from '../../../hooks/useApi';

const { clubs, loading: clubsLoading } = useStudentClubs({ category: 'tech' });
const { categories, loading: categoriesLoading } = useStudentClubCategories();
const { stats } = useStudentClubStats();
```

### Детали клуба (отдельная страница)

```javascript
import { useStudentClub } from '../../../hooks/useApi';
import { useParams } from 'react-router-dom';

const ClubDetails = () => {
  const { id } = useParams();
  const { club, loading, error } = useStudentClub(id);
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return (
    <div>
      <h1>{club.name}</h1>
      <p>{club.description}</p>
      {/* Полная информация о клубе */}
    </div>
  );
};
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте документацию API: `API_DOCUMENTATION.md`
2. Проверьте детальное руководство: `STUDENT_CLUBS_INTEGRATION.md`
3. Убедитесь, что backend запущен и доступен
4. Проверьте консоль браузера на наличие ошибок

## ✨ Готово!

Компонент StudentClubs теперь полностью работает с backend API и автоматически поддерживает 3 языка. Все изменения данных происходят на стороне сервера, что обеспечивает актуальность информации и упрощает управление контентом.
