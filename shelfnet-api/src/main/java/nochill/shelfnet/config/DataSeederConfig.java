package nochill.shelfnet.config;

import nochill.shelfnet.data.model.*;
import nochill.shelfnet.data.repo.BookRepository;
import nochill.shelfnet.data.repo.UserInteractionRepository;
import nochill.shelfnet.data.repo.UserProfileRepository;
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
import java.util.List;

/**
 * Seeds initial demo data at startup if collections are empty.
 */
@Configuration
@ConditionalOnProperty(value = "shelfnet.seed.enabled", havingValue = "true", matchIfMissing = true)
public class DataSeederConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSeederConfig.class);

    @Bean
    public CommandLineRunner seedData(UserProfileRepository userRepo,
                                      BookRepository bookRepo,
                                      UserInteractionRepository interactionRepo,
                                      PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                // Fast pre-check to avoid long driver timeouts when Mongo isn't running
                if (!isMongoAvailable("localhost", 27017, Duration.ofSeconds(2))) {
                    log.warn("MongoDB not available during seeding (fast check). Skipping seeding.");
                    return;
                }

                if (userRepo.count() == 0 && bookRepo.count() == 0 && interactionRepo.count() == 0) {
                    log.info("Seeding initial demo data...");
                    // Users (default password: password)
                    UserProfile u1 = UserProfile.builder()
                            .name("Alice")
                            .email("alice@example.com")
                            .passwordHash(passwordEncoder.encode("password"))
                            .favoriteGenres(List.of("Fantasy", "Sci-Fi"))
                            .favoriteAuthors(List.of("Tolkien", "Asimov"))
                            .readingLevel("intermediate")
                            .build();
                    UserProfile u2 = UserProfile.builder()
                            .name("Bob")
                            .email("bob@example.com")
                            .passwordHash(passwordEncoder.encode("password"))
                            .favoriteGenres(List.of("Mystery", "Fantasy"))
                            .favoriteAuthors(List.of("Christie", "Tolkien"))
                            .readingLevel("beginner")
                            .build();
                    userRepo.saveAll(List.of(u1, u2));

                    // Books
                    Book b1 = Book.builder().title("The Hobbit").author("Tolkien").genre("Fantasy").publisher("Allen & Unwin").year(1937).tags(List.of("adventure","classic")).difficulty("medium").build();
                    Book b2 = Book.builder().title("Foundation").author("Asimov").genre("Sci-Fi").publisher("Gnome Press").year(1951).tags(List.of("space","empire")).difficulty("hard").build();
                    Book b3 = Book.builder().title("Murder on the Orient Express").author("Christie").genre("Mystery").publisher("Collins Crime Club").year(1934).tags(List.of("detective","classic")).difficulty("easy").build();
                    bookRepo.saveAll(List.of(b1, b2, b3));

                    // Interactions
                    UserInteraction i1 = UserInteraction.builder().userId(u1.getId()).bookId(b1.getId()).type(InteractionType.READ).value(null).build();
                    UserInteraction i2 = UserInteraction.builder().userId(u1.getId()).bookId(b2.getId()).type(InteractionType.RATING).value(4.5).build();
                    UserInteraction i3 = UserInteraction.builder().userId(u2.getId()).bookId(b3.getId()).type(InteractionType.READ).value(null).build();
                    interactionRepo.saveAll(List.of(i1, i2, i3));
                    log.info("Demo data seeded successfully.");
                } else {
                    log.info("Skipping seeding – data already present.");
                }
            } catch (DataAccessResourceFailureException e) {
                log.warn("MongoDB not available during seeding (will skip). Start Mongo and reseed manually if needed.");
            } catch (Exception ex) {
                log.error("Unexpected error while seeding data", ex);
            }
        };
    }

    private boolean isMongoAvailable(String host, int port, Duration timeout) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), (int) timeout.toMillis());
            return true;
        } catch (IOException e) {
            return false;
        }
    }
}
