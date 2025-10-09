# Student Clubs API Documentation

## Обзор

API для управления студенческими клубами с поддержкой трех языков (ru, en, kg).

**Base URL:** `/api/student-clubs/`

**Поддерживаемые языки:** `ru` (русский), `en` (английский), `kg` (кыргызский)

---

## Параметры языка

Все эндпоинты поддерживают параметр `lang` для получения данных на нужном языке:

- `?lang=ru` - русский (по умолчанию)
- `?lang=en` - английский
- `?lang=kg` - кыргызский

Также можно использовать заголовок `Accept-Language`.

---

## Endpoints

### 1. Категории клубов

#### GET `/api/student-clubs/categories/`
Получить список всех категорий клубов.

**Query Parameters:**
- `lang` - язык ответа (ru, en, kg)

**Response Example:**
```json
[
  {
    "id": 1,
    "slug": "tech",
    "name": "Технологии и IT",
    "name_ru": "Технологии и IT",
    "name_en": "Technology & IT",
    "name_kg": "Технология жана IT",
    "order": 1
  },
  {
    "id": 2,
    "slug": "sports",
    "name": "Спорт и здоровье",
    "name_ru": "Спорт и здоровье",
    "name_en": "Sports & Health",
    "name_kg": "Спорт жана ден соолук",
    "order": 2
  }
]
```

#### GET `/api/student-clubs/categories/{slug}/`
Получить детали конкретной категории.

**Response Example:**
```json
{
  "id": 1,
  "slug": "tech",
  "name": "Технологии и IT",
  "name_ru": "Технологии и IT",
  "name_en": "Technology & IT",
  "name_kg": "Технология жана IT",
  "order": 1
}
```

---

### 2. Клубы

#### GET `/api/student-clubs/clubs/`
Получить список всех клубов с возможностью фильтрации.

**Query Parameters:**
- `lang` - язык ответа (ru, en, kg)
- `category` - фильтр по slug категории
- `status` - фильтр по статусу (active, recruiting, inactive)
- `search` - поиск по названию, описанию и тегам
- `ordering` - сортировка (members_count, created_at, order)

**Response Example:**
```json
[
  {
    "id": 1,
    "category": {
      "id": 1,
      "slug": "tech",
      "name": "Технологии и IT",
      "order": 1
    },
    "icon": "💻",
    "status": "active",
    "members_count": 45,
    "name": "IT Club",
    "short_description": "Программирование и разработка",
    "description": "Клуб для студентов, интересующихся программированием...",
    "meetings": "Каждую среду 19:00",
    "tags": ["python", "javascript", "web", "programming"],
    "join_link": "https://t.me/itclub_academy",
    "created_at": "2025-01-15T10:30:00Z",
    "updated_at": "2025-01-15T10:30:00Z"
  }
]
```

**Примеры запросов:**
- `/api/student-clubs/clubs/?lang=en` - все клубы на английском
- `/api/student-clubs/clubs/?category=tech` - клубы категории "tech"
- `/api/student-clubs/clubs/?status=active` - только активные клубы
- `/api/student-clubs/clubs/?search=programming` - поиск по слову "programming"
- `/api/student-clubs/clubs/?ordering=-members_count` - сортировка по количеству участников (убывание)

#### GET `/api/student-clubs/clubs/{id}/`
Получить детальную информацию о клубе.

**Query Parameters:**
- `lang` - язык ответа (ru, en, kg)

**Response Example:**
```json
{
  "id": 1,
  "category": {
    "id": 1,
    "slug": "tech",
    "name": "Технологии и IT",
    "order": 1
  },
  "icon": "💻",
  "status": "active",
  "members_count": 45,
  "join_link": "https://t.me/itclub_academy",
  "name": "IT Club",
  "short_description": "Программирование и разработка",
  "description": "Клуб для студентов, интересующихся программированием, веб-разработкой и IT-технологиями...",
  "goals": "Развитие практических навыков программирования\nОбмен опытом между участниками\nУчастие в IT-конференциях и хакатонах\nСоздание реальных проектов",
  "motivation": "Получите реальный опыт работы над проектами\nПодготовьтесь к карьере в IT\nНайдите единомышленников\nУлучшите свое портфолио",
  "meetings": "Каждую среду 19:00",
  "tags": ["python", "javascript", "web", "programming"],
  "leaders": [
    {
      "id": 1,
      "name": "Иванов Иван Иванович",
      "role": "Президент клуба",
      "email": "president@1.club",
      "phone": null,
      "photo": null
    },
    {
      "id": 2,
      "name": "Петров Петр Петрович",
      "role": "Вице-президент",
      "email": "vicepresident@1.club",
      "phone": null,
      "photo": null
    }
  ],
  "order": 1,
  "is_active": true,
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:30:00Z"
}
```

#### GET `/api/student-clubs/clubs/page_data/`
Получить все данные для страницы клубов (заголовки, статистику, категории, клубы).

**Query Parameters:**
- `lang` - язык ответа (ru, en, kg)
- `category` - фильтр по slug категории (опционально)
- `search` - поиск (опционально)

**Response Example:**
```json
{
  "title": "Студенческие клубы и сообщества",
  "subtitle": "Присоединяйтесь к клубам и развивайте свои навыки вместе с единомышленниками",
  "stats": [
    {
      "id": 1,
      "value": "50+",
      "label": "Активных клубов",
      "icon": "🎯",
      "order": 1
    },
    {
      "id": 2,
      "value": "1200+",
      "label": "Участников",
      "icon": "👥",
      "order": 2
    }
  ],
  "categories": [
    {
      "id": 1,
      "slug": "tech",
      "name": "Технологии и IT",
      "order": 1
    }
  ],
  "clubs": [
    {
      "id": 1,
      "category": {...},
      "icon": "💻",
      "status": "active",
      "members_count": 45,
      "name": "IT Club",
      "short_description": "Программирование и разработка",
      "description": "...",
      "meetings": "Каждую среду 19:00",
      "tags": ["python", "javascript"],
      "join_link": "https://t.me/itclub_academy"
    }
  ]
}
```

**Применение:** Этот эндпоинт идеален для загрузки всех данных страницы одним запросом.

**Примеры:**
- `/api/student-clubs/clubs/page_data/?lang=ru` - все данные на русском
- `/api/student-clubs/clubs/page_data/?lang=en&category=tech` - данные на английском, только tech категория
- `/api/student-clubs/clubs/page_data/?lang=kg&search=футбол` - данные на кыргызском с поиском

#### GET `/api/student-clubs/clubs/by_category/`
Получить клубы конкретной категории.

**Query Parameters:**
- `category` - slug категории (обязательно)
- `lang` - язык ответа (ru, en, kg)

**Response Example:**
```json
[
  {
    "id": 1,
    "category": {...},
    "icon": "💻",
    "status": "active",
    "members_count": 45,
    "name": "IT Club",
    "short_description": "Программирование и разработка",
    "description": "...",
    "meetings": "Каждую среду 19:00",
    "tags": ["python", "javascript"],
    "join_link": "https://t.me/itclub_academy"
  }
]
```

**Примеры:**
- `/api/student-clubs/clubs/by_category/?category=tech&lang=ru`
- `/api/student-clubs/clubs/by_category/?category=sports&lang=en`

#### POST `/api/student-clubs/clubs/{id}/join/`
Присоединиться к клубу (отправка заявки).

**Request Body:**
```json
{
  "email": "student@example.com",
  "name": "John Doe"
}
```

**Response Example:**
```json
{
  "success": true,
  "message": "Заявка на вступление в клуб \"IT Club\" отправлена",
  "club_name": "IT Club",
  "join_link": "https://t.me/itclub_academy"
}
```

---

### 3. Руководители клубов

#### GET `/api/student-clubs/leaders/`
Получить список всех руководителей клубов.

**Query Parameters:**
- `lang` - язык ответа (ru, en, kg)
- `club` - фильтр по ID клуба

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "Иванов Иван Иванович",
    "role": "Президент клуба",
    "email": "president@1.club",
    "phone": null,
    "photo": null,
    "name_ru": "Иванов Иван Иванович",
    "name_en": "Ivan Ivanov",
    "name_kg": "Иван Иванов",
    "role_ru": "Президент клуба",
    "role_en": "Club President",
    "role_kg": "Клубдун президенти"
  }
]
```

**Примеры:**
- `/api/student-clubs/leaders/?lang=en` - все руководители на английском
- `/api/student-clubs/leaders/?club=1` - руководители клуба с ID 1

#### GET `/api/student-clubs/leaders/{id}/`
Получить детали конкретного руководителя.

---

### 4. Статистика

#### GET `/api/student-clubs/stats/`
Получить статистику для отображения на странице клубов.

**Query Parameters:**
- `lang` - язык ответа (ru, en, kg)

**Response Example:**
```json
[
  {
    "id": 1,
    "value": "50+",
    "label": "Активных клубов",
    "icon": "🎯",
    "order": 1
  },
  {
    "id": 2,
    "value": "1200+",
    "label": "Участников",
    "icon": "👥",
    "order": 2
  }
]
```

---

## Статусы клубов

- `active` - Клуб активен, идет набор участников
- `recruiting` - Идет активный набор
- `inactive` - Клуб временно неактивен

---

## Примеры использования в React компоненте

### Получение всех данных страницы:
```javascript
const fetchPageData = async (lang = 'ru', category = 'all', search = '') => {
  const params = new URLSearchParams();
  params.append('lang', lang);
  if (category !== 'all') params.append('category', category);
  if (search) params.append('search', search);
  
  const response = await fetch(`/api/student-clubs/clubs/page_data/?${params}`);
  const data = await response.json();
  return data;
};
```

### Фильтрация по категории:
```javascript
const fetchClubsByCategory = async (categorySlug, lang = 'ru') => {
  const response = await fetch(
    `/api/student-clubs/clubs/by_category/?category=${categorySlug}&lang=${lang}`
  );
  const data = await response.json();
  return data;
};
```

### Получение деталей клуба:
```javascript
const fetchClubDetails = async (clubId, lang = 'ru') => {
  const response = await fetch(
    `/api/student-clubs/clubs/${clubId}/?lang=${lang}`
  );
  const data = await response.json();
  return data;
};
```

### Присоединение к клубу:
```javascript
const joinClub = async (clubId, userData) => {
  const response = await fetch(`/api/student-clubs/clubs/${clubId}/join/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return data;
};
```

---

## Миграции и установка

### 1. Добавьте приложение в settings.py:
```python
INSTALLED_APPS = [
    ...
    'student_clubs',
    'django_filters',  # если еще не установлено
]
```

### 2. Добавьте URL в главный urls.py:
```python
urlpatterns = [
    ...
    path('api/student-clubs/', include('student_clubs.urls')),
]
```

### 3. Примените миграции:
```bash
python manage.py makemigrations student_clubs
python manage.py migrate student_clubs
```

### 4. Создайте тестовые данные:
```bash
python manage.py create_clubs_sample_data
```

### 5. Создайте суперпользователя (если еще нет):
```bash
python manage.py createsuperuser
```

---

## Django Admin

Все модели доступны в админ-панели Django:
- `/admin/student_clubs/clubcategory/` - Категории
- `/admin/student_clubs/club/` - Клубы
- `/admin/student_clubs/clubleader/` - Руководители
- `/admin/student_clubs/clubstats/` - Статистика

Админка поддерживает:
- Inline редактирование руководителей при создании клуба
- Фильтрацию по категориям и статусу
- Поиск по всем языковым полям
- Сортировку через order поля
- Массовое редактирование статуса и порядка

---

## Модели данных

### Club (Клуб)
- `category` - FK на ClubCategory
- `icon` - эмодзи иконка
- `status` - статус (active/recruiting/inactive)
- `members_count` - количество участников
- `join_link` - ссылка для присоединения
- `name_*` - название на 3 языках
- `short_description_*` - краткое описание на 3 языках
- `description_*` - полное описание на 3 языках
- `goals_*` - цели клуба на 3 языках
- `motivation_*` - мотивация для вступления на 3 языках
- `meetings_*` - расписание встреч на 3 языках
- `tags` - JSON список тегов
- `order` - порядок сортировки
- `is_active` - активность

### ClubCategory (Категория)
- `name_*` - название на 3 языках
- `slug` - уникальный слаг для URL
- `order` - порядок сортировки

### ClubLeader (Руководитель)
- `club` - FK на Club
- `name_*` - ФИО на 3 языках
- `role_*` - роль/должность на 3 языках
- `email` - email
- `phone` - телефон
- `photo` - фото
- `order` - порядок

### ClubStats (Статистика)
- `value` - значение (например, "50+")
- `label_*` - метка на 3 языках
- `icon` - эмодзи иконка
- `order` - порядок
- `is_active` - активность

---

## Требования

- Django >= 3.2
- djangorestframework >= 3.12
- django-filter >= 2.4
- Pillow (для ImageField в ClubLeader)

```bash
pip install django djangorestframework django-filter Pillow
```

---

## Примечания

1. **Производительность**: Все запросы оптимизированы с использованием `select_related` и `prefetch_related`
2. **Безопасность**: Рекомендуется добавить аутентификацию для POST запросов
3. **Кэширование**: Для production рекомендуется добавить кэширование списка клубов
4. **Изображения**: Для фото руководителей настройте MEDIA_ROOT и MEDIA_URL
5. **CORS**: Не забудьте настроить CORS для frontend приложения

---

## Поддержка

Для вопросов и предложений создавайте issue в репозитории проекта.
