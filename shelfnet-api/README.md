# ShelfNet Backend (Spring Boot + MongoDB)

Полноценный бэкенд для книжного приложения с локальными и Google Books данными, unified-поиском, пользовательскими взаимодействиями, популярностью и рекомендациями. Проект использует JWT-аутентификацию, пагинацию ответов и кэширование интеграции с Google.

Содержание
- Архитектура и ключевые компоненты
- Модели данных и DTO
- Аутентификация и безопасность
- Пагинация ответов
- Бизнес-логика по разделам и эндпоинты
  - Книги (локальные)
  - Интеграция Google Books
  - Единый поиск
  - Взаимодействия пользователей с книгами
  - Рекомендации
- Популярность книг
- Сидер: масштабные демо-данные и флаги
- Подсказки по эксплуатации и расширению

Архитектура и ключевые компоненты
- controller: REST-контроллеры
- data/model: MongoDB @Document сущности (Book, UserProfile, UserInteraction) и enum’ы
- data/dto: транспортные структуры (record) — RecommendationItem, GoogleVolumeDto, GoogleVolumeSearchResponse, PagedResponse
- data/repo: интерфейсы MongoRepository
- data/service: бизнес-логика (BookService, InteractionService, SearchService, RecommendationService, GoogleBooksIntegrationService)
- data/service/mapper: мапперы (GoogleBookMapper)
- config: конфигурации (OpenAPI, DataSeeder, RestTemplate)

Модели данных и DTO
- Book (unified)
  - id, title
  - author (legacy, первый автор), authors: List<String>
  - genre, categories: List<String>, tags: List<String>
  - publisher, year, difficulty, thumbnail
  - source: LOCAL|GOOGLE, googleId
  - Метрики: avgRating (Double), likesCount (Integer), readCount (Integer), googleTrendingBoost (Double)
- UserInteraction
  - id, userId, bookId
  - type: FAVORITE | READ | WANT_TO_READ | RATING | REVIEW
  - rating (Double, опционально), review (String, опционально)
- RecommendationItem
  - book (Book), score (Double), reason (String)
- PagedResponse<T>
  - items: List<T>, page: int, size: int, total: long, totalPages: int

Аутентификация и безопасность
- JWT в заголовке Authorization: Bearer <token>
- Получение токена: POST /auth/login или /auth/register
- Все функциональные эндпоинты (книги, поиск, взаимодействия, рекомендации) защищены
- Типовые ответы ошибок: 401 (Unauthorized), 403 (Forbidden), 404 (Not found), 400 (Validation)

Пагинация ответов
- Любой списочный эндпоинт поддерживает параметры: page (default=0), size (default=20)
- Ответ упакован в PagedResponse:
{
  "items": [...],
  "page": 0,
  "size": 20,
  "total": 134,
  "totalPages": 7
}

Бизнес-логика и эндпоинты (от и до)

1) Книги (локальные)
Контроллер: /books
- GET /books
  - Назначение: получить список локальных книг
  - Параметры: page, size
  - Бизнес-логика: простая выборка всех локальных книг (Mongo findAll), обёртка в пагинацию
  - Ответ: PagedResponse<Book>
- POST /books
  - Назначение: создать локальную книгу
  - Тело: Book (минимум title; author/authors/genre по необходимости)
  - Бизнес-логика: валидация на уровне модели/БД, сохранение в Mongo
  - Ответ: созданная Book (с id), source=LOCAL по умолчанию
- GET /books/search?query=...&page=&size=
  - Назначение: локальный поиск по title/author/genre/tags
  - Бизнес-логика: in-memory фильтрация по containsIgnoreCase; для больших объёмов можно вынести в Mongo текстовый индекс/критерии
  - Ответ: PagedResponse<Book>
- GET /books/popular?limit=&page=&size=
  - Назначение: получить популярные книги
  - Бизнес-логика: BookService вычисляет «популярность» как взвешенную метрику: rating*2 + likes + reads + googleTrendingBoost*10; предварительно применяется limit, затем пагинация
  - Ответ: PagedResponse<Book>

2) Интеграция Google Books
Контроллер: /google-books
- GET /google-books/search?query=...&page=&size=
  - Назначение: поиск книг в Google и маппинг в наш Book
  - Бизнес-логика: через GoogleBooksIntegrationService — вызов Google API, кэширование Caffeine (TTL 30 мин), парсинг JSON → DTO → Book (source=GOOGLE)
  - Особенности запроса: query может содержать дополнительные параметры (&maxResults, &startIndex), сервис корректно кодирует q и «протягивает» остальные параметры
  - Ответ: PagedResponse<Book>
- GET /google-books/{googleId}
  - Назначение: получить одну книгу из Google по id (в нашем формате Book)
  - Ответ: Book (source=GOOGLE) или 404

3) Единый поиск
Контроллер: /search
- GET /search/unified?query=&genre=&limit=&language=&page=&size=
  - Назначение: объединить локальные книги и результаты Google
  - Бизнес-логика: 
    1) Локальный поиск (BookRepository findAll + фильтрация по query/genre)
    2) GoogleBooksIntegrationService.searchGoogleBooks(query) + фильтр по language (если указан) + маппинг в Book
    3) Мёрдж результатов без дублей (по googleId или title)
    4) Ранжирование: localPopularity = likesCount+readCount; googleRelevance = avgRating + googleTrendingBoost*5; сортировка по (localPopularity+googleRelevance)
  - Ответ: PagedResponse<Book>

4) Взаимодействия пользователей
Контроллер: 
- POST /books/{id}/interactions
  - Назначение: создать взаимодействие для книги (READ/FAVORITE/WANT_TO_READ/RATING/REVIEW)
  - Тело: UserInteraction (userId, type, rating/ review — опционально)
  - Бизнес-логика: InteractionService.addInteraction → сохранение + updateBookStats(bookId)
  - updateBookStats: пересчёт avgRating (среднее по RATING), likesCount (FAVORITE), readCount (READ)
  - Ответ: созданный UserInteraction
- GET /books/{id}/interactions?page=&size=
  - Назначение: получить все взаимодействия по книге
  - Бизнес-логика: выборка по bookId и пагинация в памяти
  - Ответ: PagedResponse<UserInteraction>
- GET /users/{userId}/interactions?page=&size=
  - Назначение: получить все взаимодействия пользователя
  - Бизнес-логика: выборка по userId и пагинация в памяти
  - Ответ: PagedResponse<UserInteraction>

5) Рекомендации
Контроллер: /recommendations
- GET /recommendations/{userId}?page=&size=
  - Назначение: персональные рекомендации с объяснением причин
  - Бизнес-логика (RecommendationService):
    - Сигналы и веса: score = 0.35*userAffinity + 0.25*popularity + 0.15*googleTrend + 0.25*contentSimilarity
      - userAffinity: попадание жанра/автора в предпочтения пользователя
      - popularity: нормализованная популярность (likes+reads)/50 + avgRating/5
      - googleTrend: boost для трендовых Google-книг
      - contentSimilarity: средняя похожесть по жанрам/авторам/тегам с книгами, с которыми уже взаимодействовал пользователь (item-based)
    - Исключение книг, с которыми пользователь уже взаимодействовал
    - Добавление трендовых Google-книг, отсутствующих локально
    - Обоснование (reason): «matches your interests», «similar to books…», «popular now on Google», «locally popular»
  - Ответ: PagedResponse<RecommendationItem>

Популярность книг
- Вычисляется в BookService как rating*2 + likes + reads + googleTrendingBoost*10
- Эндпоинт /books/popular даёт быстрый список популярных локальных книг (с учётом метрик взаимодействий и Google-тренда)

Сидер: демо-данные большого объёма
- Что создаётся:
  - 20 пользователей с разными любимыми жанрами/авторами
  - ~80 локальных книг (по авторам/жанрам) + множество книг из Google (пачечные запросы по 10 темам, пагинация 0/40/80)
  - Взаимодействия: на пользователя ≈8 READ, ≈3 FAVORITE, ≈4 RATING, ≈1 WANT_TO_READ; дополнительно экстра-отзывы для 10% книг и «усиление» сигналов для Google-книг
  - Пересчёт метрик книг (avgRating/likesCount/readCount)
- Флаги управления сидом:
  - Очистка и пересид: JVM -Dshelfnet.seed.force=true или ENV SHELFNET_SEED_FORCE=true
  - Включить/отключить загрузку из Google: -Dshelfnet.seed.google=true|false или ENV SHELFNET_SEED_GOOGLE=true|false
- Примечания:
  - Если Google API недоступен/ограничен, сидер использует запасной небольшой набор sampleGoogleBooks()
  - Для больших данных можно расширить глубину пагинации/список тем или перенести часть логики из памяти в Mongo

Примеры полезных моделей (сокращённо)
- Book (GOOGLE):
{
  "id": "uuid",
  "title": "Clean Code",
  "authors": ["Robert C. Martin"],
  "author": "Robert C. Martin",
  "genre": "Programming",
  "year": 2008,
  "source": "GOOGLE",
  "googleId": "gg-clean-code-1",
  "avgRating": 4.5,
  "likesCount": 12,
  "readCount": 30,
  "googleTrendingBoost": 0.5
}
- UserInteraction (оценка):
{
  "userId": "user-uuid",
  "bookId": "book-uuid",
  "type": "RATING",
  "rating": 4.0,
  "review": "Отличная книга"
}
- RecommendationItem:
{
  "book": { ... Book ... },
  "score": 0.78,
  "reason": "matches your interests, locally popular"
}

Подсказки по эксплуатации и расширению
- Масштабирование поиска: для /books/search и unified search при росте объёма данных стоит вынести фильтрацию/сортировку в Mongo запросы (Pageable, индексы по title/author/genre, текстовый индекс)
- Точность рекомендаций: можно расширять контентную похожесть (веса тегов/категорий), добавить user-based коллаборативную фильтрацию по лайкам/рейтингам и хранить предвычисленные матрицы
- Google-интеграция: вынести параметры TTL/размер кэша в конфигурацию; добавить API ключ и квотирование; предусмотреть retry/backoff
- Валидация: ввести Java Bean Validation для тел запросов (например, rating ∈ [0;5])
- Индексация Mongo: добавить индексы по googleId, genre, author(s), полям метрик

Сводка по эндпоинтам
- /auth/register (POST): регистрация пользователя (ответ: token, userId)
- /auth/login (POST): логин (ответ: token, userId)
- /books (GET, POST)
- /books/search (GET)
- /books/popular (GET)
- /google-books/search (GET)
- /google-books/{googleId} (GET)
- /search/unified (GET)
- /books/{id}/interactions (POST, GET)
- /users/{userId}/interactions (GET)
- /recommendations/{userId} (GET)

Все списки возвращаются как PagedResponse, поддерживаются page/size. Все функциональные методы требуют JWT.
