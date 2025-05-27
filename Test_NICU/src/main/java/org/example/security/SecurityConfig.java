package org.example.security;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Beveiligingsconfiguratie voor de website.
 * Maakt gebruik van verschillende rollen om verschillende toegangen te verlenen.
 *
 * @author Anne Beumer
 * @version 1.4. 22-05-2025
 * @since 09-05-2025
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;

    /**
     * Constructor die de userdeatils service en cors configuratie regelt.
     * @param userDetailsService service voor gebruikersauthenticatie
     * @param corsConfigurationSource configuratie voor CORS-instellingen
     */
    public SecurityConfig(CustomUserDetailsService userDetailsService, CorsConfigurationSource corsConfigurationSource){
        this.userDetailsService = userDetailsService;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    /**
     * Configureert een beveiligingsfilter voor all HTTP verzoeken.
     * @param http de httpsecruity configuratie
     * @return het configureerde beveiligingsfilter
     * @throws Exception bij configuratie fouten
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(cors -> cors.configurationSource(corsConfigurationSource));


        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login.html", "/css/**", "/js/**", "/img/**").permitAll()
                        .requestMatchers("/invulPagStudie.html").hasAnyRole("STUDIE", "ADMIN")
                        .requestMatchers("/dashboard.html").hasAnyRole("ALGEMEEN", "STUDIE", "ADMIN", "PROTOCOLMAKER")
                        .requestMatchers("/dashboard2.html").hasAnyRole("ALGEMEEN", "STUDIE", "ADMIN", "PROTOCOLMAKER")
                        .requestMatchers("/dashboard3.html").hasAnyRole("ALGEMEEN", "STUDIE", "ADMIN", "PROTOCOLMAKER")
                        .requestMatchers("/protocol.html").hasAnyRole("PROTOCOLMAKER", "ADMIN")
                        .requestMatchers("/admin.html").hasRole("ADMIN")
                        .requestMatchers("/wachtwoordbeheer").hasRole("ADMIN")
                        .anyRequest().authenticated())
                .formLogin(form -> form
                        .loginPage("/login.html")
                        .loginProcessingUrl("/login")
                        .defaultSuccessUrl("/dashboard.html", true)
                        .failureUrl("/login.html?error=true")
                        .permitAll())
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login.html?logout")
                        .permitAll()
                );
        return http.build();
    }

    /**
     * Biedt een bean aan voorwachtwoordversleuteling
     * @return een BCRyptPasswordEncoder
     */
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    /**
     * Biedt een bean voor  authenticatie gebruik
     * @param authenticationConfiguration spring authenticatie configuratie
     * @return een autheticatie manager
     * @throws Exception bij foute configuratie
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }
}
