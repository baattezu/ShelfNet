package nochill.shelfnet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/** Provides RestTemplate bean for GoogleBooksIntegrationService */
@Configuration
public class WebClientConfig {
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

