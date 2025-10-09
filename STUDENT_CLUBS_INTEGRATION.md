# Student Clubs Backend Integration

## Обзор

Интеграция компонента `StudentClubs` с backend API с полной поддержкой 3 языков (русский, английский, кыргызский).

## Что было сделано

### 1. API Service (`src/services/api.js`)

Добавлены следующие методы для работы с API студенческих клубов:

- `getStudentClubsPageData(language, filters)` - Получить все данные страницы одним запросом
- `getStudentClubs(language, filters)` - Получить список клубов с фильтрацией
- `getStudentClubById(id, language)` - Получить детали конкретного клуба
- `getStudentClubsByCategory(categorySlug, language)` - Получить клубы по категории
- `getStudentClubCategories(language)` - Получить список категорий
- `getStudentClubStats(language)` - Получить статистику
- `getStudentClubLeaders(language, clubId)` - Получить руководителей клубов
- `joinStudentClub(clubId, userData)` - Отправить заявку на вступление в клуб
- `searchStudentClubs(query, language, category)` - Поиск клубов

**Поддержка языков:**
- `ru` (русский) - по умолчанию
- `en` (английский)
- `kg` (кыргызский) - конвертируется в `ky` для API

### 2. Custom Hooks (`src/hooks/useApi.js`)

Добавлены специализированные хуки для удобной работы с API:

#### `useStudentClubsPageData(filters)`
Получает все данные для страницы клубов одним запросом.

**Параметры:**
- `filters` - объект с параметрами фильтрации (category, search)

**Возвращает:**
```javascript
{
  data: {
    title: string,
    subtitle: string,
    stats: Array,
    categories: Array,
    clubs: Array
  },
  loading: boolean,
  error: string | null,
  refetch: function
}
```

#### `useStudentClubs(filters)`
Получает список клубов с возможностью фильтрации.

#### `useStudentClub(clubId)`
Получает детальную информацию о конкретном клубе.

#### `useStudentClubCategories()`
Получает список всех категорий клубов.

#### `useJoinStudentClub()`
Хук для отправки заявки на вступление в клуб.

**Возвращает:**
```javascript
{
  joinClub: async (clubId, userData) => result,
  loading: boolean,
  error: string | null,
  success: boolean,
  reset: function
}
```

### 3. Component Update (`src/components/pages/students/StudentClubs.jsx`)

Компонент полностью переработан для работы с backend API:

**Основные изменения:**

1. **Использование API вместо i18n:**
   - Данные теперь загружаются с сервера через `useStudentClubsPageData`
   - Поддержка автоматической смены языка при изменении `i18n.language`

2. **Динамическая фильтрация:**
   - Фильтры передаются напрямую в API
   - Поиск и категории обрабатываются на backend

3. **Обработка состояний:**
   - Loading state с компонентом `Loading`
   - Error state с понятным отображением ошибок
   - Empty state когда клубы не найдены

4. **Функция вступления в клуб:**
   - Использует `useJoinStudentClub` hook
   - Отправляет данные пользователя на сервер
   - Показывает ссылку для вступления (Telegram, WhatsApp и т.д.)
   - Обрабатывает состояния загрузки и ошибок

5. **Мультиязычность:**
   - Все текстовые элементы используют i18n для локализации UI
   - Данные клубов приходят с сервера на выбранном языке

## API Endpoints

Base URL: `/api/student-clubs/`

### GET `/api/student-clubs/clubs/page_data/`
Получить все данные для страницы клубов.

**Query Parameters:**
- `lang` - язык (ru, en, kg)
- `category` - фильтр по slug категории (опционально)
- `search` - поиск (опционально)

**Response:**
```json
{
  "title": "Студенческие клубы и сообщества",
  "subtitle": "Присоединяйтесь к клубам...",
  "stats": [
    { "id": 1, "value": "50+", "label": "Активных клубов", "icon": "🎯", "order": 1 }
  ],
  "categories": [
    { "id": 1, "slug": "tech", "name": "Технологии и IT", "order": 1 }
  ],
  "clubs": [
    {
      "id": 1,
      "category": { "id": 1, "slug": "tech", "name": "Технологии и IT" },
      "icon": "💻",
      "status": "active",
      "members_count": 45,
      "name": "IT Club",
      "short_description": "Программирование и разработка",
      "description": "Полное описание...",
      "goals": "Цели клуба...",
      "motivation": "Почему стоит присоединиться...",
      "meetings": "Каждую среду 19:00",
      "tags": ["python", "javascript"],
      "join_link": "https://t.me/itclub_academy",
      "leaders": [
        {
          "id": 1,
          "name": "Иванов Иван",
          "role": "Президент клуба",
          "email": "president@club.com"
        }
      ]
    }
  ]
}
```

### POST `/api/student-clubs/clubs/{id}/join/`
Отправить заявку на вступление в клуб.

**Request Body:**
```json
{
  "email": "student@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Заявка на вступление отправлена",
  "club_name": "IT Club",
  "join_link": "https://t.me/itclub_academy"
}
```

## Примеры использования

### Использование в компоненте

```javascript
import { useStudentClubsPageData } from '../../../hooks/useApi';

const MyComponent = () => {
  const filters = {
    category: 'tech',
    search: 'python'
  };
  
  const { data, loading, error } = useStudentClubsPageData(filters);
  
  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  
  return (
    <div>
      <h1>{data.title}</h1>
      {data.clubs.map(club => (
        <ClubCard key={club.id} club={club} />
      ))}
    </div>
  );
};
```

### Вступление в клуб

```javascript
import { useJoinStudentClub } from '../../../hooks/useApi';

const ClubCard = ({ club }) => {
  const { joinClub, loading, error, success } = useJoinStudentClub();
  
  const handleJoin = async () => {
    try {
      const result = await joinClub(club.id, {
        email: 'student@example.com',
        name: 'John Doe'
      });
      
      alert(result.message);
      window.open(result.join_link, '_blank');
    } catch (err) {
      alert('Ошибка при отправке заявки');
    }
  };
  
  return (
    <button onClick={handleJoin} disabled={loading}>
      {loading ? 'Отправка...' : 'Присоединиться'}
    </button>
  );
};
```

## Настройка Backend URL

По умолчанию используется `http://localhost:8000/api/v1`.

Для изменения базового URL откройте `src/services/api.js`:

```javascript
constructor() {
    this.baseURL = 'https://your-api-domain.com/api/v1';
}
```

Или используйте переменные окружения:

```javascript
constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
}
```

И добавьте в `.env`:
```
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
```

## Тестирование

### 1. Проверка загрузки данных
- Откройте страницу студенческих клубов
- Убедитесь, что данные загружаются с сервера
- Проверьте работу загрузочного индикатора

### 2. Проверка фильтрации
- Выберите различные категории
- Используйте поиск
- Убедитесь, что результаты соответствуют фильтрам

### 3. Проверка мультиязычности
- Переключите язык интерфейса (ru/en/kg)
- Убедитесь, что данные обновляются
- Проверьте, что UI элементы локализованы

### 4. Проверка вступления в клуб
- Нажмите "Присоединиться" на карточке клуба
- Введите email и имя
- Убедитесь, что запрос отправляется на сервер
- Проверьте открытие ссылки для вступления

## Обработка ошибок

Компонент обрабатывает следующие ошибки:

1. **Ошибка загрузки данных** - показывает сообщение об ошибке
2. **Ошибка сети** - отображает понятное сообщение пользователю
3. **Ошибка вступления в клуб** - показывает alert с сообщением

## Будущие улучшения

1. **Форма вступления в клуб:**
   - Добавить модальное окно вместо prompt
   - Валидация данных на клиенте
   - Дополнительные поля (телефон, факультет и т.д.)

2. **Пагинация:**
   - Добавить пагинацию для большого количества клубов
   - Бесконечная прокрутка

3. **Избранное:**
   - Возможность добавлять клубы в избранное
   - Сохранение в localStorage

4. **Уведомления:**
   - Toast уведомления вместо alert
   - Красивые сообщения об успехе/ошибке

5. **Кэширование:**
   - Использование React Query для кэширования
   - Оптимизация запросов

## Зависимости

- `react` - для компонентов
- `react-i18next` - для мультиязычности
- Fetch API - для HTTP запросов (встроен в браузер)

## Поддержка

При возникновении проблем проверьте:

1. Backend API доступен и работает
2. CORS настроен правильно
3. Базовый URL API указан верно
4. Backend возвращает данные в правильном формате

Для debugging используйте console.log в методах API service.
