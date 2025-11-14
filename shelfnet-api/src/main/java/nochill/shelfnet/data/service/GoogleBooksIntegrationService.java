package nochill.shelfnet.data.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import nochill.shelfnet.data.dto.GoogleVolumeDto;
import nochill.shelfnet.data.dto.GoogleVolumeSearchResponse;
import nochill.shelfnet.data.model.Book;
import nochill.shelfnet.data.service.mapper.GoogleBookMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Integration service for Google Books API with internal Caffeine cache (no external bean required).
 */
@Service
@Data
@RequiredArgsConstructor
public class GoogleBooksIntegrationService {

    private final GoogleBookMapper mapper;
    private final RestTemplate restTemplate; // Provided by WebConfig
    private final ObjectMapper objectMapper; // Spring Boot auto-configured ObjectMapper

    /** Internal cache (30 min TTL, max 500 entries). */
    private Cache<String, Object> cache = Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofMinutes(30))
            .maximumSize(500)
            .build();

    private static final String API_BASE = "https://www.googleapis.com/books/v1";

    /** Search Google Books volumes by free-text query. Supports extra params like &maxResults=&startIndex=. */
    public GoogleVolumeSearchResponse searchGoogleBooks(String query) {
        String key = "search::" + query;
        Object cached = cache.getIfPresent(key);
        if (cached instanceof GoogleVolumeSearchResponse resp) return resp;
        try {
            String url = buildSearchUrl(query);
            String json = restTemplate.getForObject(url, String.class);
            GoogleVolumeSearchResponse response = parseSearch(json);
            cache.put(key, response);
            return response;
        } catch (Exception e) {
            return new GoogleVolumeSearchResponse(0, List.of());
        }
    }

    private String buildSearchUrl(String query) {
        String q = query;
        String extra = "";
        int amp = query.indexOf('&');
        if (amp >= 0) {
            q = query.substring(0, amp);
            extra = query.substring(amp); // includes leading '&', pass through
        }
        String encodedQ = URLEncoder.encode(q, StandardCharsets.UTF_8);
        return API_BASE + "/volumes?q=" + encodedQ + extra;
    }

    /** Fetch single volume by Google id. */
    public GoogleVolumeDto getGoogleBookById(String googleId) {
        String key = "volume::" + googleId;
        Object cached = cache.getIfPresent(key);
        if (cached instanceof GoogleVolumeDto dto) return dto;
        try {
            String url = API_BASE + "/volumes/" + googleId;
            String json = restTemplate.getForObject(url, String.class);
            JsonNode node = objectMapper.readTree(json);
            GoogleVolumeDto dto = mapper.parseJson(node);
            cache.put(key, dto);
            return dto;
        } catch (Exception e) {
            return null;
        }
    }

    /** Fetch trending books (heuristic: use a fixed query and top results). */
    public List<GoogleVolumeDto> fetchTrending() {
        String key = "trending";
        Object cached = cache.getIfPresent(key);
        if (cached instanceof List<?> list && !list.isEmpty() && list.get(0) instanceof GoogleVolumeDto) {
            return list.stream().map(o -> (GoogleVolumeDto) o).collect(Collectors.toList());
        }
        GoogleVolumeSearchResponse resp = searchGoogleBooks("best sellers&maxResults=20");
        List<GoogleVolumeDto> top = resp.items().stream().limit(10).toList();
        cache.put(key, top);
        return top;
    }

    /** Map Google search response JSON string into DTO. */
    private GoogleVolumeSearchResponse parseSearch(String json) {
        if (json == null) return new GoogleVolumeSearchResponse(0, List.of());
        try {
            JsonNode root = objectMapper.readTree(json);
            int total = root.has("totalItems") ? root.get("totalItems").asInt() : 0;
            List<GoogleVolumeDto> items = new ArrayList<>();
            JsonNode arr = root.get("items");
            if (arr != null && arr.isArray()) {
                for (JsonNode item : arr) {
                    GoogleVolumeDto dto = mapper.parseJson(item);
                    if (dto != null && dto.title() != null) items.add(dto);
                }
            }
            return new GoogleVolumeSearchResponse(total, items);
        } catch (Exception e) {
            return new GoogleVolumeSearchResponse(0, List.of());
        }
    }

    /** Convenience to map trending volumes to Book domain with boost. */
    public List<Book> trendingAsBooks() {
        return fetchTrending().stream().map(v -> {
            Book b = mapper.fromGoogleVolume(v);
            b.setGoogleTrendingBoost(0.8); // apply boost
            return b;
        }).filter(Objects::nonNull).toList();
    }
}
