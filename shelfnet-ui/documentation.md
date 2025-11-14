ShelfNet Frontend Technical Documentation

1. Общее описание фронтенда
   Назначение: ShelfNet UI — клиентская часть книжного сервиса c каталогом, рекомендациями, сообществами и персональными полками. Интерфейс построен на Next.js App Router и сочетает “боевые” разделы (/books, /profile, /community, /recommendations, /my, users, /interactions, /search, /settings, /login, /register) и showcase-секция /demo, где демонстрируются современные паттерны аутентификации, real-time поиска и интеграции внешних API.
   Основные пользовательские сценарии:
   Поиск книг: /books (каталог + поисковая панель), /search (универсальный поиск по книгам, людям и клубам) и /books/[id] (доступ к отдельной книге).
   Просмотр и детализация: карточки книг, слайдеры, вкладки с описанием/метаданными, блоки «Similar books».
   Рекомендации: /recommendations тянет индивидуальные рекомендации для пользователя (на основе services.getRecommendations).
   Профили: /profile отображает данные пользователя, статистику, любимые жанры и сообщества.
   Книжные клубы / сообщества: /community загружает сообщества и жанровые клубы.
   Сезонные подборки: блок «Recommended for you» на /books + статические подборки на главной/других страницах; легко адаптируется под сезонные витрины.
   Моя полка: /my группирует книги по статусам (прочитал, хочу прочитать, избранное).
   История взаимодействий: /interactions показывает чтения, рейтинги, прогресс.
   Регистрация/логин: /login, /register, плюс демонстрационная авторизация в /demo.
2. Технологический стек фронтенда
   Слой Стек
   Framework Next.js 16.0.3 (App Router), React 19.2.0
   Язык TypeScript (строгий режим, path alias @/\*)
   State management Zustand (src/store/useSession) + js-cookie для сессии; TanStack React Query для API-driven state; локальные useState/useReducer в страницах
   Стайлинг Tailwind CSS 4 (@import "tailwindcss" в globals.css), глобальные CSS-переменные, utility-классы; компоненты используют Tailwind + несколько кастомных классов (.card, .input-base)
   Формы и валидация React Hook Form + Zod (src/components/AuthForm, /demo поиск)
   Анимации и UI Framer Motion, Lucide Icons, clsx
   API-клиент Кастомный apiClient.ts (fetch + AbortController + таймауты) и лёгкий fetcher.ts; демонстрационные сервисы в src/services реализованы на fetch напрямую
   Провайдеры query-provider.tsx (React Query + DevTools) оборачивает всё приложение
   Routing guards src/components/AuthGuard, middleware (middleware.ts)
   Тесты Не обнаружены — рекомендуется добавить (например, Vitest + React Testing Library)
3. Архитектура и структура
   Архитектурный подход: гибрид “route-first + shared components”. Исторические компоненты лежат в корне /components, новые экспериментальные и строго типизированные элементы — в src/components. Рекомендуется двигаться к feature-based/atomic структуре (см. раздел рекомендаций).
   Источник истины:
   Auth/session: Zustand store (token, user) + cookies/localStorage; middleware читает cookie shelfnet_token.
   API state: React Query (GitHub, weather) и сырые fetch-вызовы services.
   UI state: локальные useState / useReducer внутри страниц (app/books, /my, /recommendations).
   Разделение: серверные страницы (Next.js default) отдают статический HTML + инициализируют клиентские компоненты ("use client"), сами компоненты чистые и получают данные через props. Контейнерную роль выполняют страницы в app/\*, презентационные компоненты — в /components и src/components.
4. API слой (frontend-only)
   Расположение клиентов:
   apiClient.ts — универсальный fetch-wrapper с таймаутом, базовым URL NEXT_PUBLIC_API_URL, обработкой ошибок/Abort.
   fetcher.ts — упрощённый helper (используется legacy-кодом).
   src/services/ — модульные клиенты: auth.ts, weather.ts, github.ts; api.ts ре-экспортирует их.
   api.ts — мост для старых импортов services (ожидает index.ts, которого пока нет).
   Формирование запросов: прямым fetch с кастомными headers, next: { revalidate } для публичных API, таймауты через AbortController.
   Типы DTO: src/models/\*. Сейчас описаны User, SessionPayload, WeatherSummary, RepoSummary; типы Book, Interaction, RecommendationItem отсутствуют (нужно добавить для соответствия используемым свойствам в страницах).
   Пример запроса (GitHub поиск):
   Обработка ошибок: сервисы выбрасывают Error (строки) или кастомный объект (apiFetch). В UI ловятся через try/catch (app/books, AuthForm), отображаются через AuthMessage, toast либо fallback текст.
   Примеры контрактов:
   Login: auth.login(email, password) → { session: { token, issuedAt, expiresAt, user } }. Token сохраняется в cookie + localStorage, используется guard/middleware.
   Weather snapshot: weather.fetchWeather(city) → WeatherSummary c температурой, влажностью, ветром.
   GitHub search: github.searchRepositories(query) → RepoSummary[].
   Legacy REST (книги/профили/оценки): страницы обращаются к services.getBooks, getBook, getRecommendations, getInteractionsForUser, authRegister, и т.д. Эти функции должны жить в отсутствующем index.ts + использовать apiClient/apiFetch.
5. UI компоненты и правила
   Категории:
   Атомы: Button, Input (components/Button, глобальные .input-base), TagList, UserAvatar.
   Молекулы: AuthField, BookCard, ProfileCard, CommunityCard, SearchBar (обе версии), SessionPulse.
   Организмы/шаблоны: BookSlider, BookTabs, RecommendationCard, LayoutContainer, ProfileSidebar, demo-виджеты (RealtimeSearchCard, WeatherCard), AuthForm.
   Правила:
   Компоненты декларативные, без побочных эффектов (побочные эффекты только в страницах/хуках).
   Используются useMemo/useCallback (например, useAuth мемоизирует login/logout, RealtimeSearchCard мемоизирует результаты).
   Props строго типизированы через TypeScript. Для общих компонентов — явно описывать интерфейс (например, LayoutContainer).
   Стайлинг через Tailwind-классы и кастомные utility-классы. Inline-стили не применяются (кроме редких style в иконках/анимациях).
   Повторно используемые элементы лежат в /components (legacy) или src/components (новые паттерны). Желательно постепенно мигрировать в единый src/features/<domain>/components.
   Мемоизация/анимация: framer-motion используется для кнопок/карточек, AnimatePresence в live search.
6. State management
   Глобальный стейт / Auth:
   useSession.ts: Zustand store c cookie (shelfnet_token) и localStorage (shelfnet_user). Имеет методы setSession, clearSession, rehydrateSession.
   src/hooks/useAuth.ts: использует store, предоставляет login/logout, триггерит rehydrateSession в useEffect.
   Legacy страницы /books, users, /my используют локальное хранение токенов (localStorage) + не подключены к новому store — требуется унификация.
   API-driven state:
   React Query (@tanstack/react-query) для GitHub/Weather + возможности DevTools. QueryProvider подключён в layout.tsx.
   Прочие страницы пока используют useEffect + локальные массивы (потенциал для миграции на Query hooks).
   Локальный UI state: useState/useReducer, useRef (управление формами, active tabs, загрузка). Использовать локальный стейт для чисто визуальных задач.
   Консистентность:
   Источником истины для auth должен быть Zustand + cookies → middleware.
   Для данных рекомендуется переход на React Query с ключами ["books", query] и т.д. Сейчас возможны несогласованности (ручное кеширование, повторные запросы).
   При обновлении пользовательских действий (/my, /interactions) нужно синхронизировать с backend через единую service-абстракцию.
7. Frontend routing
   Router: Next.js App Router (директория app/). Смешанные серверные и клиентские компоненты. Клиентские страницы помечены "use client" (любое использование hooks/effects).
   Карта маршрутов (неполная, ключевые):
   Путь Назначение Тип
   / Boilerplate (Next welcome) серверный
   /books Каталог, поиск, “Recommended for you” клиент
   /books/[id] Детальная страница книги, generateMetadata сервер + клиент компоненты
   users Управление пользователями, регистрация из админ-формы клиент
   /community Комьюнити и жанровые клубы клиент
   /recommendations Персональные рекомендации клиент
   /my Мои книги (прочитал/хочу/избранное) клиент
   /interactions История взаимодействий (оценки, статусы) клиент
   /profile Профиль + статистика + сообщества клиент
   /search Универсальный поиск клиент
   /login, /register Аутентификация клиент
   /settings Настройки (демо) клиент
   /demo Showcase современных паттернов server layout + client секции
   /demo/protected Приватная зона (AuthGuard + middleware) клиент
   Защищённые страницы:
   middleware.ts перехватывает /demo/protected и редиректит на /demo, если cookie shelfnet_token отсутствует.
   AuthGuard (client) защищает React-уровень, показывает skeleton и вызывает router.replace.
   Legacy маршруты пока не защищены middleware — требуется расширить matcher.
   Навигация: next/navigation (useRouter) для программных переходов (login/logout), стандартные <a> для линков между секциями.
8. Patterns и best practices
   SRP: страницы отвечают за бизнес-логику/загрузку, компоненты — за отображение. Избегайте “god components”.
   Типизация: все props/DTO должны иметь явные типы. Добавьте отсутствующие Book, Interaction, RecommendationItem, Community, чтобы IDE/линтер ловили ошибки.
   Hooks: выносите повторяющийся код в src/hooks (например, useBooks, useRecommendations).
   Error boundaries: отсутствуют; стоит добавить (например, app/error.tsx + компонентные boundary).
   Code splitting: Next App Router автоматически создает чанки per route; дополнительное dynamic(() => import(...)) для тяжёлых виджетов (слайдеры/карусели) пока не используется — хорошее улучшение.
   Адаптеры: Легаси страницы напрямую используют backend-свойства; лучше создать адаптеры (map API → UI-модель) в src/services/<domain>/mappers.ts.
   Формы: для критичных форм используйте React Hook Form + Zod (как в AuthForm), избегайте ручных useState-валидаций.
   Стили: придерживайтесь Tailwind utility-классов или общих CSS переменных. Не использовать inline-стили, кроме динамических кейсов (градиенты/иконки).
   Анимации: Framer Motion используется точечно; избегайте тяжелых анимаций на больших списках, предпочтительнее CSS transitions.
   DevTools: React Query DevTools доступны (кнопка bottom-left). Используйте в dev только.
9. Как создавать новую фичу
   Создай feature-папку: src/features/<feature-name>/ c подпапками components/, hooks/, api/, types/.
   Компоненты: главный UI экспортируй из index.tsx, держи компоненты чистыми, без побочных эффектов.
   Типы: все DTO/props в types.ts, ре-экспортируй в index.ts.
   API: запросы только через api.ts внутри feature, который использует src/lib/apiClient или React Query hooks (use<Feature>Query).
   State: для серверных данных — React Query, для глобального UI (auth, prefs, тематические фильтры) — Zustand slice, для локального — useState.
   Routing: создавай новую страницу в page.tsx, подключай client components через "use client" при необходимости.
   Styling: Tailwind classes + глобальные токены. Общие паттерны выноси в src/components.
   Validation: используй Zod-схемы в src/utils/validators или локально в feature.
   Tests: (добавить) — пиши unit-тесты на hooks/utilities и component tests (RTL) для сложных UI.
   Docs: обнови README/документацию, если добавляешь новые паттерны или соглашения.
   Lint/format: запускай npm run lint (или npx eslint ...) перед коммитом.
   Progressive rollout: сначала создавай scaffold/заготовку (данные-заглушки), затем подключай реальные API и состояние.
10. Типичные UI флоу (frontend)
    Регистрация / логин:
    Пользователь вводит данные в /register или /login.
    Клиент валидирует (простые проверки или React Hook Form в /demo).
    Отправка через api.authRegister / api.authLogin → ожидание { session: { token, userId } }.
    Токен сохраняется (legacy: localStorage; новая реализация: useAuth + cookie).
    Redirect на /books или /demo/protected.
    Просмотр книги (/books/[id]):
    Серверная функция generateMetadata пытается загрузить книгу (через services.getBook).
    Страница собирает BookHeader, BookTabs, BookMeta, BookCarousel.
    Похожий список регулируется запросом services.searchBooks.
    Клик по карточке ведёт к детальной странице.
    Добавление в “хочу прочитать” (/my):
    Страница загружает взаимодействия пользователя, мапит их в статусы (read/want/favorite).
    UI разделяет табы; пользователь может переключать, видеть статусные бейджи.
    На стороне фронта сейчас только чтение — добавление статусов нужно реализовать через services.updateInteraction.
    Поставить оценку / отзыв (/interactions):
    Грузятся Interaction записи (тип Interaction).
    Каждая карточка показывает состояние (rating, progress).
    UI пока read-only; после добавления формы можно отправлять PATCH через сервис.
    Получение рекомендаций (/recommendations):
    После аутентификации вызывается services.getRecommendations(userId).
    Для каждой рекомендации подтягивается книга (services.getBook).
    Итоговая сетка RecommendationCard, можно расширять CTA (например, “Добавить в список”).
    Работа с книжными клубами / сообществами (/community):
    services.getCommunities() → список.
    UI показывает топ клубов, блок “Genre clubs”.
    Возможные действия: вступить, создать клуб (пока кнопки-заглушки).
    Поиск (/books, /search, demo Realtime search):
    В /books — ручной поиск + fallback фильтрация.
    В /search — статический контент (готов к подключению API).
    В /demo — связка React Hook Form + Zod + React Query + debounce: пользователь печатает, валидатор следит за длиной, query триггерит GitHub API, результаты подсвечиваются.
    Погода/внешние данные (/demo):
    Пользователь вводит город → weather.fetchWeather.
    Кеш на 15 минут (staleTime).
    UI показывает температуру, влажность, ветер.
    Защищённые страницы (/demo/protected):
    Пользователь логинится (auth form).
    Token записывается в cookie shelfnet_token (Zustand store).
    Middleware допускает к /demo/protected, React Guard проверяет isAuthenticated, показывает данные пользователя.
    Logout очищает сессию.
11. Рекомендации по улучшению
    Восстановить/создать index.ts с реализацией всех методов (getBooks, getUsers, getInteractionsForUser, и т.д.), чтобы legacy страницы снова работали и соответствовали типам.
    Добавить типы Book, Interaction, RecommendationItem, Community и вынести их в src/models.
    Унифицировать auth: обновить legacy страницы на @/src/hooks/useAuth + Zustand store (избавиться от ручного localStorage менеджмента).
    Расширить middleware/AuthGuard для маршрутов /books, /my, /interactions, users (или использовать RBAC).
    Переехать на feature-based архитектуру (Feature-Sliced Design или модульный подход) — переносить legacy компоненты в src/features/<domain>.
    Внедрить тесты (Vitest + React Testing Library). Минимум — покрыть useAuth, apiClient, критические компоненты (AuthForm, SearchBar).
    Добавить Error Boundaries (app/error.tsx, ErrorBoundary компонент) и визуальные fallback’и.
    Использовать React Query повсеместно (книги, пользователи, взаимодействия) с ключами и оптимистичными апдейтами.
    Оптимизировать производительность: lazy-load тяжёлые блоки (dynamic()), добавить виртуализацию списков при необходимости.
    Консолидация стилей: вынести цветовые токены/типографику в один источник, добавить Storybook/дизайн-систему для components.
    Документация API/DTO: синхронизировать с backend контрактами (описать поля Book, Interaction, Recommendation).
    Модульная федерация/микрофронты (при необходимости): пока не требуется, но архитектура позволяет вынести /demo как отдельный модуль, если проект разрастётся.
12. Чеклист разработчика (12 пунктов)
    Запусти npm install → npm run dev/npm run lint, убедись, что окружение живо.
    Создай новую feature-папку в src/features/<name> + scaffolding (components/hooks/api/types).
    Опиши типы DTO/props в types.ts, экспортируй через barrel.
    Для API используй src/lib/apiClient или React Query hooks; не дергай fetch напрямую из компонента.
    Валидируй ввод через Zod + React Hook Form (или вынеси схему в src/utils/validators).
    Храни глобальные данные в Zustand store; если нужен новый slice — расширь store (с SSR-проверками).
    Оборачивай приложение QueryProvider, подключай новые Query hooks через useQuery/useMutation с осмысленными ключами.
    Используй Tailwind utility-классы, избегай inline-стилей; общие паттерны добавляй в globals.css или отдельные CSS-модули.
    Все компоненты должны быть чистыми; побочные эффекты — в hooks/страницах.
    Добавляй skeleton/loader/error state для каждого асинхронного участника UI.
    Обновляй документацию/README при добавлении новых паттернов или команд.
    Перед PR прогоняй npx eslint . --ext .ts,.tsx --max-warnings=0, фиксируй ошибки, проверяй, что локально нет предупреждений и UI обновляется.

13. ShelfNet UI Refresh (февраль 2025)
    Чтобы быстро перенести UX-снимки в App Router, добавлен модульный слой с жёсткой типизацией и мок-данными.
    13.1 Новая структура (сокращённо)
    app/
    page.tsx — новая главная
    books/ (page.tsx, [id]/page.tsx)
    profile/[id]/page.tsx
    community/page.tsx
    search/page.tsx
    login/page.tsx, register/page.tsx
    components/
    layout/ (Header, Navigation, Footer, SiteLayout)
    ui/ (Button, Input, Card, Avatar, Badge, BookCard, SectionHeading)
    features/
    books/, profile/, community/, search/, auth/
    lib/mockData.ts — единый источник заглушек (книги, сообщества, пользователи, результаты поиска)
    types/index.ts — Book, UserProfile, Review, SearchResult, Community, AuthCredentials и связанные enum’ы
    13.2 Главные компоненты
    Button — Tailwind-first кнопка с variant/size + поддержкой href
    Input — атом с иконкой, forwardRef и единым состоянием фокуса
    Card & BookCard — плитки каталога и детальных блоков
    SectionHeading — заголовки секций с action-слотом
    Header/Footer/SiteLayout — общий хром, используемый в новых маршрутах
    Feature-компоненты: BooksRail, BookDetailHero, ProfileHighlights, CommunityGrid, SearchHero, AuthForm (упрощённый)
    13.3 Поток данных
    Страницы App Router получают данные из lib/mockData.ts (placeholders). Для боевых API замените импорты моков на React Query hooks или серверные fetch’и.
    Типы в types/index.ts гарантируют единый контракт (Book, Community и др.), поэтому при смене источника достаточно обновить типы/адаптеры.
    Клиентские секции помечены "use client", чтобы можно было использовать local state, form events и React Query.
    13.4 Как подключить backend API
    1. Создайте сервис в src/services/<domain> с методами listBooks/getBook/searchBooks.
    2. Добавьте React Query hooks (useBooksQuery/useBookQuery) либо серверные actions в app/api.
    3. В страницах замените импорт моков на hooks, обработайте loading/error и пробросьте данные в компоненты.
    4. Обновите generateMetadata в динамических маршрутах так, чтобы он знал о реальном сервисе (fetch с cache: "no-store" или revalidate).
    5. После появления backend меняется только источник данных — UI уже готов и строго типизирован.
       13.5 Навигация и доступность
       Header/Navigation автоматически переключаются на вертикальный стек на мобильных, CTA ведут на /login и /register.
       Form-компоненты используют Input/Button, так что легко подключить React Hook Form/Zod без переписывания верстки.
       13.6 Настройка next/image
       next.config.ts включает images.unsplash.com в remotePatterns, чтобы BookCard/Avatar могли безопасно загружать фото.
       13.7 Качество
       Next.js CLI v16 больше не поддерживает подкоманду "next lint", поэтому используйте npx eslint . для локальной проверки (уже настроено в README/скриптах).
       Билд пока не прогоняется из-за legacy-маршрутов (/my, /demo). Перед релизом приведите все страницы к корректным default-экспортам.
