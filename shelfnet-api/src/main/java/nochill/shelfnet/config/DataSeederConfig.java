package nochill.shelfnet.config;

import nochill.shelfnet.data.model.*;
import nochill.shelfnet.data.repo.BookRepository;
import nochill.shelfnet.data.repo.UserInteractionRepository;
import nochill.shelfnet.data.repo.UserProfileRepository;
import nochill.shelfnet.data.service.GoogleBooksIntegrationService;
import nochill.shelfnet.data.service.mapper.GoogleBookMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Seeds initial demo data. Extended to showcase recommendation strength.
 */
@Configuration
@ConditionalOnProperty(value = "shelfnet.seed.enabled", havingValue = "true", matchIfMissing = true)
public class DataSeederConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSeederConfig.class);

    private static final List<String> GENRES = List.of(
            "Фэнтези",
            "Научная фантастика",
            "Детектив",
            "Триллер",
            "Роман",
            "Нон-фикшн",
            "История",
            "Программирование",
            "Саморазвитие",
            "Биография"
    );

    private static final Map<String, List<String>> AUTHORS_BY_GENRE = Map.of(
            "Фэнтези", List.of("Толкин", "Сандерсон", "Роулинг", "Мартин"),
            "Научная фантастика", List.of("Азимов", "Кларк", "Ле Гуин", "Герберт"),
            "Детектив", List.of("Кристи", "Коннелли", "Несбё", "Сэерс"),
            "Триллер", List.of("Паттерсон", "Гришэм", "Ларссон", "Чайлд"),
            "Роман", List.of("Остин", "Спаркс", "Гэблдон", "Мойес"),
            "Нон-фикшн", List.of("Саган", "Харари", "Пинк", "Гладуэлл"),
            "История", List.of("Черноу", "Кирнс", "Бирд", "МакКаллоу"),
            "Программирование", List.of("Мартин", "Блох", "Фаулер", "Саттер"),
            "Саморазвитие", List.of("Кови", "Клир", "Карнеги", "Холидей"),
            "Биография", List.of("Айзексон", "Джобс", "Обама", "Маск")
    );

    @Bean
    public CommandLineRunner seedData(UserProfileRepository userRepo,
                                      BookRepository bookRepo,
                                      UserInteractionRepository interactionRepo,
                                      nochill.shelfnet.data.repo.CommunityRepository communityRepo,
                                      PasswordEncoder passwordEncoder,
                                      GoogleBooksIntegrationService googleService,
                                      GoogleBookMapper googleMapper) {
        return args -> {
            try {
                if (!isMongoAvailable("localhost", 27017, Duration.ofSeconds(2))) {
                    log.warn("MongoDB not available during seeding (fast check). Skipping seeding.");
                    return;
                }

                boolean force = Boolean.parseBoolean(System.getProperty("shelfnet.seed.force", "false"))
                        || Boolean.parseBoolean(System.getenv().getOrDefault("SHELFNET_SEED_FORCE", "false"));

                if (force) {
                    log.warn("Force seed enabled -> cleaning collections...");
                    interactionRepo.deleteAll();
                    bookRepo.deleteAll();
                    communityRepo.deleteAll();
                    userRepo.deleteAll();
                }

                if (userRepo.count() == 0 && bookRepo.count() == 0 && interactionRepo.count() == 0 && communityRepo.count() == 0) {
                    log.info("Seeding extended demo data (20 users, books, communities, interactions)...");

                    List<UserProfile> users = createUsers(passwordEncoder);
                    userRepo.saveAll(users);

                    List<Book> books = generateBooks();
                    // Optionally fetch many Google books via API
                    boolean googleEnabled = Boolean.parseBoolean(System.getProperty("shelfnet.seed.google", "true"))
                            || Boolean.parseBoolean(System.getenv().getOrDefault("SHELFNET_SEED_GOOGLE", "true"));
                    if (googleEnabled) {
                        log.info("Fetching additional books from Google Books API for seeding...");
                        List<Book> googleFetched = fetchGoogleBooksBulk(googleService, googleMapper);
                        // Deduplicate by googleId or title
                        Set<String> seenGoogleIds = books.stream().map(Book::getGoogleId).filter(Objects::nonNull).collect(Collectors.toSet());
                        Set<String> seenTitles = books.stream().map(Book::getTitle).filter(Objects::nonNull).collect(Collectors.toSet());
                        for (Book g : googleFetched) {
                            if ((g.getGoogleId() != null && !seenGoogleIds.add(g.getGoogleId())) || !seenTitles.add(g.getTitle())) {
                                continue;
                            }
                            books.add(g);
                        }
                    } else {
                        books.addAll(sampleGoogleBooks());
                    }
                    bookRepo.saveAll(books);

                    List<Community> communities = generateCommunities(users, books);
                    communityRepo.saveAll(communities);

                    List<UserInteraction> interactions = generateInteractions(users, books);
                    // Add extra diverse reviews for a subset
                    interactions.addAll(generateExtraReviews(users, books));
                    interactionRepo.saveAll(interactions);

                    recomputeBookMetrics(books, interactionRepo, bookRepo);

                    log.info("Extended demo data seeded successfully. Users={} Books={} Communities={} Interactions={}",
                            users.size(), books.size(), communities.size(), interactions.size());
                } else {
                    log.info("Skipping seeding – data already present. Use -Dshelfnet.seed.force=true to reseed.");
                }
            } catch (DataAccessResourceFailureException e) {
                log.warn("MongoDB not available during seeding (will skip). Start Mongo and reseed manually if needed.");
            } catch (Exception ex) {
                log.error("Unexpected error while seeding data", ex);
            }
        };
    }

    private List<Book> fetchGoogleBooksBulk(GoogleBooksIntegrationService googleService, GoogleBookMapper googleMapper) {
        List<String> subjects = List.of("subject:Fantasy","subject:Sci-Fi","subject:Mystery","subject:Thriller","subject:Romance","subject:History","subject:Biography","subject:Programming","subject:Self-Help","subject:Non-Fiction");
        int[] starts = new int[]{0, 40, 80};
        List<Book> result = new ArrayList<>();
        for (String s : subjects) {
            for (int start : starts) {
                String q = s + "&maxResults=40&startIndex=" + start;
                var resp = googleService.searchGoogleBooks(q);
                if (resp.items() == null || resp.items().isEmpty()) continue;
                for (var vol : resp.items()) {
                    var book = googleMapper.fromGoogleVolume(vol);
                    if (book == null || book.getTitle() == null) continue;
                    book.setSource(BookSource.GOOGLE);
                    // small boost if high rating on Google
                    double boost = (vol.averageRating() != null ? Math.min(1.0, vol.averageRating() / 5.0) : 0.0) * 0.8;
                    book.setGoogleTrendingBoost(boost);
                    result.add(book);
                }
            }
        }
        log.info("Fetched {} books from Google API for seeding.", result.size());
        return result;
    }

    private List<UserInteraction> generateExtraReviews(List<UserProfile> users, List<Book> books) {
        List<UserInteraction> list = new ArrayList<>();
        Random rnd = new Random(99);
        // pick 10% of books for extra reviews from random users
        int count = Math.max(1, books.size() / 10);
        List<Book> copy = new ArrayList<>(books);
        Collections.shuffle(copy, rnd);
        List<Book> target = copy.subList(0, Math.min(count, copy.size()));
        for (Book b : target) {
            for (int i = 0; i < 3; i++) {
                UserProfile u = users.get(rnd.nextInt(users.size()));
                double rating = 2.5 + rnd.nextDouble() * 2.5; // 2.5 - 5.0
                String[] texts = {"Outstanding writing","Solid read","Not my favorite","Great characters","Too long but worth it"};
                list.add(UserInteraction.builder()
                        .userId(u.getId())
                        .bookId(b.getId())
                        .type(InteractionType.RATING)
                        .rating(Math.round(rating * 10.0)/10.0)
                        .review(texts[rnd.nextInt(texts.length)])
                        .build());
                if (i % 2 == 0) {
                    list.add(UserInteraction.builder()
                            .userId(u.getId())
                            .bookId(b.getId())
                            .type(InteractionType.FAVORITE)
                            .build());
                }
            }
        }
        return list;
    }

    private List<UserProfile> createUsers(PasswordEncoder passwordEncoder) {
        List<UserProfile> result = new ArrayList<>();
        for (int i = 1; i <= 20; i++) {
            // Each user: pick 3 favorite genres and 3 favorite authors from those
            List<String> genresShuffled = new ArrayList<>(GENRES);
            Collections.shuffle(genresShuffled, new Random(i));
            List<String> favGenres = genresShuffled.subList(0, Math.min(3, genresShuffled.size()));
            Set<String> favAuthors = new LinkedHashSet<>();
            for (String g : favGenres) {
                List<String> authors = AUTHORS_BY_GENRE.getOrDefault(g, List.of());
                if (!authors.isEmpty()) favAuthors.add(authors.get(new Random(g.hashCode() + i).nextInt(authors.size())));
            }
            UserProfile u = UserProfile.builder()
                    .name("User" + i)
                    .email("user" + i + "@example.com")
                    .passwordHash(passwordEncoder.encode("password"))
                    .favoriteGenres(new ArrayList<>(favGenres))
                    .favoriteAuthors(new ArrayList<>(favAuthors))
                    .readingLevel(i % 3 == 0 ? "advanced" : i % 2 == 0 ? "intermediate" : "beginner")
                    .build();
            result.add(u);
        }
        return result;
    }

    private List<Book> generateBooks() {
        List<Book> books = new ArrayList<>();
        int yearBase = 1950;
        int idx = 0;
        for (String genre : GENRES) {
            List<String> authors = AUTHORS_BY_GENRE.get(genre);
            for (String author : authors) {
                for (int j = 0; j < 2; j++) { // two books per author
                    int year = yearBase + (idx * 3) % 73;
                    List<String> tags = List.of(genre.toLowerCase(), "tag" + j, author.toLowerCase());
                    Book b = Book.builder()
                            .title(author + " Work " + (j + 1))
                            .author(author)
                            .authors(List.of(author))
                            .genre(genre)
                            .publisher("DemoPub")
                            .year(year)
                            .tags(tags)
                            .difficulty(j % 2 == 0 ? "medium" : "easy")
                            .source(BookSource.LOCAL)
                            .build();
                    books.add(b);
                    idx++;
                }
            }
        }
        return books;
    }

    private List<Community> generateCommunities(List<UserProfile> users, List<Book> books) {
        List<Community> communities = new ArrayList<>();
        Random rnd = new Random(123);

        // Create communities for each genre
        for (String genre : GENRES) {
            List<Book> genreBooks = books.stream()
                    .filter(b -> genre.equals(b.getGenre()))
                    .limit(5)
                    .toList();

            if (genreBooks.isEmpty()) continue;

            // Select random members (3-8 per community)
            int memberCount = 3 + rnd.nextInt(6);
            List<String> memberIds = users.stream()
                    .filter(u -> u.getFavoriteGenres().contains(genre))
                    .limit(memberCount)
                    .map(UserProfile::getId)
                    .toList();

            // Pick 2-3 featured books
            List<String> featuredIds = genreBooks.stream()
                    .limit(2 + rnd.nextInt(2))
                    .map(Book::getId)
                    .toList();

            Community c = Community.builder()
                    .name(genre + " Guild")
                    .description("A community for " + genre + " enthusiasts")
                    .tags(List.of(genre.toLowerCase(), "books", "community"))
                    .memberIds(new ArrayList<>(memberIds))
                    .featuredBookIds(new ArrayList<>(featuredIds))
                    .build();

            communities.add(c);
        }

        return communities;
    }

    private List<UserInteraction> generateInteractions(List<UserProfile> users, List<Book> books) {
        List<UserInteraction> interactions = new ArrayList<>();
        Random rnd = new Random(42); // deterministic
        Map<String,List<Book>> byGenre = books.stream()
                .collect(Collectors.groupingBy(b -> b.getGenre() != null ? b.getGenre() : "__UNKNOWN__"));
        for (UserProfile u : users) {
            // User reads 8 books (favoring favorite genres) and rates half
            List<Book> preferredPool = new ArrayList<>();
            for (String g : u.getFavoriteGenres()) {
                preferredPool.addAll(byGenre.getOrDefault(g, List.of()));
            }
            if (preferredPool.isEmpty()) preferredPool.addAll(books); // fallback
            Collections.shuffle(preferredPool, new Random(u.getId().hashCode()));
            List<Book> selected = preferredPool.stream().limit(8).toList();
            for (int i = 0; i < selected.size(); i++) {
                Book b = selected.get(i);
                // READ interaction
                interactions.add(UserInteraction.builder()
                        .userId(u.getId())
                        .bookId(b.getId())
                        .type(InteractionType.READ)
                        .build());
                // FAVORITE some of them
                if (i % 3 == 0) {
                    interactions.add(UserInteraction.builder()
                            .userId(u.getId())
                            .bookId(b.getId())
                            .type(InteractionType.FAVORITE)
                            .build());
                }
                // RATE half
                if (i % 2 == 0) {
                    double rating = 3.0 + rnd.nextDouble() * 2.0; // 3.0 - 5.0
                    interactions.add(UserInteraction.builder()
                            .userId(u.getId())
                            .bookId(b.getId())
                            .type(InteractionType.RATING)
                            .rating(Math.round(rating * 10.0)/10.0)
                            .review(rating > 4.2 ? "Loved it" : rating < 3.5 ? "Average" : "Good read")
                            .build());
                }
                // WANT_TO_READ for a few others (choose random book not in selected)
                if (i == 0) {
                    Book future = books.get(rnd.nextInt(books.size()));
                    interactions.add(UserInteraction.builder()
                            .userId(u.getId())
                            .bookId(future.getId())
                            .type(InteractionType.WANT_TO_READ)
                            .build());
                }
            }
        }
        // Boost interactions for Google-sourced books to showcase recommendations
        List<Book> googleBooks = books.stream().filter(b -> b.getSource() == BookSource.GOOGLE).toList();
        List<UserProfile> topUsers = users.stream().limit(5).toList();
        for (Book gb : googleBooks) {
            for (UserProfile u : topUsers) {
                interactions.add(UserInteraction.builder()
                        .userId(u.getId())
                        .bookId(gb.getId())
                        .type(InteractionType.FAVORITE)
                        .build());
                interactions.add(UserInteraction.builder()
                        .userId(u.getId())
                        .bookId(gb.getId())
                        .type(InteractionType.RATING)
                        .rating(gb.getAvgRating() != null && gb.getAvgRating() > 0 ? gb.getAvgRating() : 4.5)
                        .review("Highlight pick")
                        .build());
                interactions.add(UserInteraction.builder()
                        .userId(u.getId())
                        .bookId(gb.getId())
                        .type(InteractionType.READ)
                        .build());
            }
        }
        return interactions;
    }

    private void recomputeBookMetrics(List<Book> books, UserInteractionRepository interactionRepo, BookRepository bookRepo) {
        for (Book b : books) {
            List<UserInteraction> list = interactionRepo.findByBookId(b.getId());
            double avg = list.stream().filter(i -> i.getType() == InteractionType.RATING && i.getRating() != null)
                    .mapToDouble(UserInteraction::getRating).average().orElse(0.0);
            int likes = (int) list.stream().filter(i -> i.getType() == InteractionType.FAVORITE).count();
            int reads = (int) list.stream().filter(i -> i.getType() == InteractionType.READ).count();
            b.setAvgRating(Math.round(avg * 100.0)/100.0);
            b.setLikesCount(likes);
            b.setReadCount(reads);
            bookRepo.save(b);
        }
    }

    private boolean isMongoAvailable(String host, int port, Duration timeout) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), (int) timeout.toMillis());
            return true;
        } catch (IOException e) {
            return false;
        }
    }

    private List<Book> sampleGoogleBooks() {
        return List.of(
                Book.builder().title("The Pragmatic Programmer").authors(List.of("Andrew Hunt","David Thomas")).author("Andrew Hunt")
                        .genre("Programming").year(1999).googleId("gg-pragmatic-1").source(BookSource.GOOGLE)
                        .thumbnail("https://example.com/pragmatic.jpg").avgRating(4.7).googleTrendingBoost(0.6).build(),
                Book.builder().title("Clean Code").authors(List.of("Robert C. Martin")).author("Robert C. Martin")
                        .genre("Programming").year(2008).googleId("gg-clean-code-1").source(BookSource.GOOGLE)
                        .thumbnail("https://example.com/cleancode.jpg").avgRating(4.5).googleTrendingBoost(0.5).build(),
                Book.builder().title("Sapiens: A Brief History of Humankind").authors(List.of("Yuval Noah Harari")).author("Yuval Noah Harari")
                        .genre("Non-Fiction").year(2011).googleId("gg-sapiens-1").source(BookSource.GOOGLE)
                        .thumbnail("https://example.com/sapiens.jpg").avgRating(4.6).googleTrendingBoost(0.7).build(),
                Book.builder().title("Atomic Habits").authors(List.of("James Clear")).author("James Clear")
                        .genre("Self-Help").year(2018).googleId("gg-atomic-habits-1").source(BookSource.GOOGLE)
                        .thumbnail("https://example.com/atomic.jpg").avgRating(4.8).googleTrendingBoost(0.65).build(),
                Book.builder().title("The Lord of the Rings").authors(List.of("J.R.R. Tolkien")).author("J.R.R. Tolkien")
                        .genre("Fantasy").year(1954).googleId("gg-lotr-1").source(BookSource.GOOGLE)
                        .thumbnail("https://example.com/lotr.jpg").avgRating(4.9).googleTrendingBoost(0.8).build()
        );
    }
}
