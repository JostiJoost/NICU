package org.example;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

/**
 * Configuratie class voor CORS
 * Zorgt ervoor dat de frontend op locolhost 8080 toegang krijgt tot de backend endpoints.
 * Zonder deze class krijg je bij lokale ontwikkeling veel foutmeldingen doordat de frontend en backend op verschillend poorten runnen.
 *
 * @author Anne Beumer
 * @version 1.0
 * @since 12-05-2025
 */
@Configuration
public class CorsConfig {
    /**
     * Stelt beperkingen in voor alle inkomende HTTP-verzoeken.
     * @return een source die alle regels toepast op alle routes
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:63342", "http://localhost:8080"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
        }
    }


