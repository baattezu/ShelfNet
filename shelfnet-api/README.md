# ShelfNet

ShelfNet — backend на Spring Boot + MongoDB для управления книгами, пользовательскими взаимодействиями и простыми рекомендациями.

## Стек
- Java 21 (предполагается) / Spring Boot 3.x
- Spring Data MongoDB
- Lombok
- Docker Compose (локальный MongoDB)

## Архитектура пакетов
```
nochill.shelfnet
  ├── controller          // REST-контроллеры
  ├── data
  │    ├── model          // @Document модели MongoDB
  │    ├── repo           // Репозитории MongoRepository
  │    └── service        // Сервисный слой (бизнес-логика)
  └── service             // (резерв / можно удалить если не используется)
```

### Основные модели
- UserProfile: профиль пользователя (жанры, авторы, уровень чтения)
- Book: книга (жанр, автор, год, сложность, теги)
- UserInteraction: связь пользователь ↔ книга (READ, WANT_TO_READ, REVIEW, RATING)

### Сервисы
- BookService: поиск и добавление книг
- UserService: регистрация и получение пользователя
- InteractionService: добавление взаимодействий и выборка по пользователю
- RecommendationService: генерация простых рекомендаций (по общим жанрам, авторам, тегам)

## Аутентификация (JWT)
Реализована базовая регистрация/логин с выдачей JWT. Секрет хранится в `application.yaml` в параметре `jwt.secret`, срок жизни токена — 1 день.

- POST /auth/register — регистрирует нового пользователя, возвращает токен
- POST /auth/login — логин по email/паролю, возвращает токен

Ответ успешной аутентификации:
```json
{
  "token": "jwt-here",
  "userId": "uuid-here"
}
```

Все основные эндпоинты (книги, взаимодействия, рекомендации, пользователи) защищены и требуют заголовок:
```
Authorization: Bearer <jwt>
```

### Endpoints
| Метод | URL | Описание |
|-------|-----|----------|
| POST | /auth/register | Регистрация нового пользователя, ответ: token + userId |
| POST | /auth/login | Логин по email/паролю, ответ: token + userId |
| GET | /books | Список всех книг (требуется Bearer JWT) |
| GET | /books/search?query=... | Поиск по части названия / автора / жанра / тегам (Bearer) |
| POST | /books | Добавить книгу (Bearer) |
| POST | /users | Создать профиль пользователя (Bearer; для теста) |
| GET | /users/{id} | Получить пользователя по id (Bearer) |
| POST | /interactions | Добавить взаимодействие пользователя с книгой (Bearer) |
| GET | /interactions/user/{userId} | Все взаимодействия пользователя (Bearer) |
| GET | /recommendations/{userId} | Рекомендации для пользователя (Bearer) |

### Примеры curl
```bash
# Регистрация
curl -s -X POST http://localhost:8080/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"newuser@example.com","password":"password"}' | jq

# Логин
TOKEN=$(curl -s -X POST http://localhost:8080/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"alice@example.com","password":"password"}' | jq -r .token)

echo "$TOKEN"

# Доступ к защищённым ресурсам
curl -s http://localhost:8080/books -H "Authorization: Bearer $TOKEN" | jq

# Добавить книгу (пример)
curl -s -X POST http://localhost:8080/books \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Clean Code","author":"Robert Martin","genre":"Programming","publisher":"Prentice Hall","year":2008,"tags":["clean","code"],"difficulty":"INTERMEDIATE"}' | jq
```

## Запуск локально
### 1. MongoDB через Docker Compose
```bash
docker compose up -d
```
Проверка:
```bash
docker ps | grep mongo
```

### 2. Приложение
```bash
./gradlew bootRun
```
Или собрать jar:
```bash
./gradlew build
java -jar build/libs/ShelfNet-0.0.1-SNAPSHOT.jar
```

## Настройки MongoDB
В `application.yaml` указана строка подключения c пользователем `root` / `secret`.
Если авторизация включена и появляется ошибка аутентификации, попробуйте добавить `authSource=admin`:
```
spring:
  data:
    mongodb:
      uri: mongodb://root:secret@localhost:27017/shelfnet?authSource=admin
```

## Seeder
При старте (если включено `shelfnet.seed.enabled=true`) создаются тестовые данные: пользователи, книги и несколько взаимодействий.

Дефолтные пользователи:
- alice@example.com / password
- bob@example.com / password

## Типичные проблемы и их решение
### 1. Readiness timeout (2 минуты) при старте Spring Boot
Сообщение вида:
```
Readiness timeout of PT2M reached while waiting for services [...]
```
Причины:
- Долгая инициализация контейнера MongoDB
- Неверная строка подключения / авторизация (приложение ждёт готовность)
- Особенности Spring Boot Docker Compose integration

Решения:
1. Уменьшить или увеличить таймаут:
```
spring.docker.compose.readiness.timeout=PT30S
```
2. Отключить auto compose (если сами запускаете Mongo):
```
spring.docker.compose.enabled=false
```
3. Убедиться что контейнер здоров:
```bash
docker logs shelf-net-db | tail -n 50
```
4. Проверить доступность порта:
```bash
nc -vz localhost 27017
```

### 2. Ошибки аутентификации MongoDB
Если видите `Authentication failed`, добавьте параметр `authSource=admin` или пересоздайте контейнер:
```bash
docker compose down -v
docker compose up -d
```

### 3. Lombok не работает в IDE
- Установите Lombok plugin (IntelliJ IDEA)
- Включите annotation processing: Settings > Build > Annotation Processors

## Расширение функционала (идеи)
- Индексация полей (жанр, автор, теги) в MongoDB
- Пагинация и сортировка для `/books`
- JWT аутентификация пользователей
- Хранение деталей отзывов (текст, рейтинг отдельно)
- Более сложная рекомендательная модель (TF-IDF, Collaborative Filtering)

## Лицензия
Добавьте лицензию при необходимости.

---
Если что-то упущено — создайте issue или доработайте README.
