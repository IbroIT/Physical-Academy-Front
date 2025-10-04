# Academy Management System - API Documentation

## Overview

This API provides access to the Academy Management System's "About Section" data, including leadership information, accreditations, organizational structure, and downloadable documents. The API is built using Django REST Framework with multilingual support (Russian, Kyrgyz, English).

## Base URL

```
http://localhost:8000/api/v1/
```

## Authentication

Currently, the API allows anonymous access for all endpoints. All endpoints are read-only.

## Content Type

All API responses return JSON data with the following content type:
```
Content-Type: application/json
```

## Multilingual Support

The API supports three languages:
- **Russian (ru)** - Default language
- **Kyrgyz (ky)** 
- **English (en)**

### Language Selection

You can specify the language using the `lang` query parameter:
```
GET /api/v1/leadership/?lang=en
GET /api/v1/leadership/?lang=ky
```

Alternatively, set the `Accept-Language` header:
```
Accept-Language: en
Accept-Language: ky
```

## Pagination

List endpoints use pagination with the following format:
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/v1/leadership/?page=2",
  "previous": null,
  "results": [...]
}
```

Default page size is 20 items. You can modify this with the `page_size` parameter (max 100):
```
GET /api/v1/leadership/?page_size=50
```

## Filtering and Search

Most endpoints support filtering and search:

### Filtering
Use query parameters matching model fields:
```
GET /api/v1/leadership/?leadership_type=director
GET /api/v1/leadership/?department=Mathematics
GET /api/v1/accreditations/?accreditation_type=international
```

### Search
Use the `search` parameter to search across multiple fields:
```
GET /api/v1/leadership/?search=John
GET /api/v1/organization-structure/?search=department
```

### Ordering
Use the `ordering` parameter to sort results:
```
GET /api/v1/leadership/?ordering=name
GET /api/v1/leadership/?ordering=-created_at
GET /api/v1/accreditations/?ordering=issue_date
```

## API Endpoints

### 1. Leadership

#### Get All Leadership Members
```
GET /api/v1/leadership/
```

**Response:**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Иван Иванов",
      "name_kg": "Иван Иванов",
      "name_en": "Ivan Ivanov",
      "position": "Директор",
      "position_kg": "Директор",
      "position_en": "Director",
      "degree": "Доктор технических наук",
      "degree_kg": "Техникалык илимдердин доктору",
      "degree_en": "Doctor of Technical Sciences",
      "experience": "15 лет",
      "experience_kg": "15 жыл",
      "experience_en": "15 years",
      "bio": "Краткая биография...",
      "bio_kg": "Кыскача биография...",
      "bio_en": "Brief biography...",
      "achievements": ["Награда 1", "Награда 2"],
      "achievements_kg": ["Сыйлык 1", "Сыйлык 2"],
      "achievements_en": ["Award 1", "Award 2"],
      "department": "Администрация",
      "department_kg": "Администрация",
      "department_en": "Administration",
      "specialization": "Управление",
      "specialization_kg": "Башкаруу",
      "specialization_en": "Management",
      "email": "director@academy.edu",
      "phone": "+996 555 123456",
      "image": "/media/leadership/photos/director.jpg",
      "image_url": "http://localhost:8000/media/leadership/photos/director.jpg",
      "leadership_type": "director",
      "leadership_type_display": "Директор",
      "is_director": true,
      "order": 1
    }
  ]
}
```

**Filtering Options:**
- `leadership_type`: director, deputy_director, department_head, dean, vice_dean
- `department`: Department name
- `is_director`: true/false
- `is_active`: true/false

**Search Fields:**
- `name`, `name_kg`, `name_en`
- `position`
- `department`

#### Get Directors Only
```
GET /api/v1/leadership/directors/
```

#### Get Department Heads
```
GET /api/v1/leadership/department-heads/
```

#### Get Leadership Member Details
```
GET /api/v1/leadership/{id}/
```

### 2. Accreditations

#### Get All Accreditations
```
GET /api/v1/accreditations/
```

**Response:**
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "ISO 9001:2015",
      "name_kg": "ISO 9001:2015",
      "name_en": "ISO 9001:2015",
      "organization": "Международная организация по стандартизации",
      "organization_kg": "Эл аралык стандарттоо уюму",
      "organization_en": "International Organization for Standardization",
      "accreditation_type": "international",
      "accreditation_type_kg": "эл аралык",
      "accreditation_type_en": "international",
      "accreditation_type_display": "Международная",
      "description": "Сертификат качества...",
      "description_kg": "Сапат сертификаты...",
      "description_en": "Quality certificate...",
      "certificate_image": "/media/accreditations/certificates/iso9001.pdf",
      "certificate_image_url": "http://localhost:8000/media/accreditations/certificates/iso9001.pdf",
      "organization_logo": "/media/accreditations/logos/iso.png",
      "organization_logo_url": "http://localhost:8000/media/accreditations/logos/iso.png",
      "issue_date": "2023-01-15",
      "expiry_date": "2026-01-15",
      "certificate_number": "ISO-2023-001",
      "is_valid": true,
      "is_active": true,
      "order": 1,
      "created_at": "2023-01-15T10:00:00Z",
      "updated_at": "2023-01-15T10:00:00Z"
    }
  ]
}
```

**Filtering Options:**
- `accreditation_type`: national, international, institutional, programmatic
- `is_active`: true/false

#### Get Active/Valid Accreditations Only
```
GET /api/v1/accreditations/active/
```

### 3. Organization Structure

#### Get All Departments
```
GET /api/v1/organization-structure/
```

**Response:**
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Факультет информатики",
      "name_ru": "Факультет информатики",
      "name_en": "Faculty of Computer Science",
      "name_ky": "Информатика факультети",
      "head_name": "Петр Петров",
      "head_name_ru": "Петр Петров",
      "head_name_en": "Petr Petrov",
      "head_name_ky": "Петр Петров",
      "structure_type": "faculties",
      "phone": "+996 555 789012",
      "email": "cs@academy.edu",
      "icon": "💻",
      "parent": null,
      "children": [
        {
          "id": 2,
          "name": "Кафедра программирования",
          "name_ru": "Кафедра программирования",
          "name_en": "Programming Department",
          "name_ky": "Программалоо кафедрасы",
          "head_name": "Анна Сидорова",
          "head_name_ru": "Анна Сидорова",
          "head_name_en": "Anna Sidorova",
          "head_name_ky": "Анна Сидорова",
          "structure_type": "faculties",
          "phone": "+996 555 345678",
          "email": "programming@academy.edu",
          "icon": "🔧",
          "parent": 1,
          "children": [],
          "order": 1,
          "is_active": true,
          "title": "Факультеты"
        }
      ],
      "order": 1,
      "is_active": true,
      "title": "Факультеты"
    }
  ]
}
```

**Filtering Options:**
- `structure_type`: leadership, faculties, administrative, support
- `parent`: Parent department ID
- `is_active`: true/false

#### Get Hierarchical Structure
```
GET /api/v1/organization-structure/hierarchy/
```
Returns only top-level departments with their nested children.

### 4. Downloadable Documents

#### Get All Documents
```
GET /api/v1/documents/
```

**Response:**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Устав академии",
      "title_ru": "Устав академии",
      "title_en": "Academy Charter",
      "title_ky": "Академиянын жарыялыгы",
      "file": "/media/documents/charter.pdf",
      "file_url": "http://localhost:8000/media/documents/charter.pdf",
      "upload_date": "2023-01-10T09:00:00Z"
    }
  ]
}
```

**Filtering Options:**
- `is_active`: true/false

**Search Fields:**
- `title_ru`, `title_en`, `title_ky`
- `description_ru`

## Error Handling

The API uses standard HTTP status codes:

- **200**: Success
- **404**: Resource not found
- **400**: Bad request (invalid parameters)
- **500**: Internal server error

Error responses follow this format:
```json
{
  "detail": "Not found."
}
```

## API Documentation

Interactive API documentation is available at:
- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **OpenAPI Schema**: http://localhost:8000/api/schema/

## CORS Configuration

The API is configured to accept requests from common frontend development servers:
- http://localhost:3000 (React)
- http://localhost:8080 (Vue.js)
- http://localhost:4200 (Angular)

## Example Frontend Integration

### JavaScript/React Example

```javascript
// Fetch leadership data
const fetchLeadership = async (language = 'ru') => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/leadership/?lang=${language}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching leadership:', error);
    return [];
  }
};

// Fetch organization structure hierarchy
const fetchOrganizationStructure = async (language = 'ru') => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/organization-structure/hierarchy/?lang=${language}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching organization structure:', error);
    return [];
  }
};

// Usage in React component
const LeadershipComponent = () => {
  const [leadership, setLeadership] = useState([]);
  const [language, setLanguage] = useState('ru');

  useEffect(() => {
    fetchLeadership(language).then(setLeadership);
  }, [language]);

  return (
    <div>
      <select onChange={(e) => setLanguage(e.target.value)}>
        <option value="ru">Русский</option>
        <option value="ky">Кыргызча</option>
        <option value="en">English</option>
      </select>
      
      {leadership.map(leader => (
        <div key={leader.id}>
          <h3>{leader.name}</h3>
          <p>{leader.position}</p>
          <p>{leader.degree}</p>
          {leader.image_url && <img src={leader.image_url} alt={leader.name} />}
        </div>
      ))}
    </div>
  );
};
```

### Python/Requests Example

```python
import requests

# Fetch all leadership members
def get_leadership(language='ru'):
    url = f"http://localhost:8000/api/v1/leadership/?lang={language}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()['results']
    return []

# Fetch directors only
def get_directors(language='ru'):
    url = f"http://localhost:8000/api/v1/leadership/directors/?lang={language}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    return []

# Usage
leadership = get_leadership('en')
directors = get_directors('ky')
```

## Rate Limiting

Currently, there are no rate limits applied to the API. For production deployment, consider implementing rate limiting.

## Production Considerations

1. **Environment Variables**: Use environment variables for sensitive settings
2. **Database**: Configure PostgreSQL or another production database
3. **Static Files**: Configure proper static file serving
4. **Media Files**: Set up proper media file storage (AWS S3, etc.)
5. **HTTPS**: Enable HTTPS in production
6. **Authentication**: Add authentication if needed
7. **Caching**: Implement caching for frequently accessed data
8. **Monitoring**: Add logging and monitoring

## Support

For questions or issues, please contact the development team or refer to the Django REST Framework documentation at https://www.django-rest-framework.org/