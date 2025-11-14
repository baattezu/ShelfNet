package nochill.shelfnet.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger configuration for ShelfNet.
 */
@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "BearerAuth";

    @Bean
    public OpenAPI shelfNetOpenAPI() {
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))
                .info(new Info()
                        .title("ShelfNet API")
                        .description("Unified API for local and Google Books, interactions, search and recommendations.")
                        .version("0.0.1")
                        .contact(new Contact().name("ShelfNet Team").email("support@shelfnet.local"))
                        .license(new License().name("MIT")));
    }

    @Bean
    public GroupedOpenApi allGroup() {
        return GroupedOpenApi.builder()
                .group("all")
                .pathsToMatch("/**")
                .packagesToScan("nochill.shelfnet.controller")
                .build();
    }

    @Bean
    public GroupedOpenApi booksGroup() {
        return GroupedOpenApi.builder()
                .group("books")
                .pathsToMatch("/books/**")
                .build();
    }

    @Bean
    public GroupedOpenApi googleGroup() {
        return GroupedOpenApi.builder()
                .group("google-books")
                .pathsToMatch("/google-books/**")
                .build();
    }

    @Bean
    public GroupedOpenApi searchGroup() {
        return GroupedOpenApi.builder()
                .group("search")
                .pathsToMatch("/search/**")
                .build();
    }

    @Bean
    public GroupedOpenApi recommendationsGroup() {
        return GroupedOpenApi.builder()
                .group("recommendations")
                .pathsToMatch("/recommendations/**")
                .build();
    }

    @Bean
    public GroupedOpenApi interactionsGroup() {
        return GroupedOpenApi.builder()
                .group("interactions")
                .pathsToMatch("/books/**", "/users/**")
                .packagesToScan("nochill.shelfnet.controller")
                .build();
    }

    @Bean
    public GroupedOpenApi authGroup() {
        return GroupedOpenApi.builder()
                .group("auth")
                .pathsToMatch("/auth/**")
                .build();
    }
}
