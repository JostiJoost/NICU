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

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final CustomUserDetailsService userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;


    public SecurityConfig(CustomUserDetailsService userDetailsService, CorsConfigurationSource corsConfigurationSource){
        this.userDetailsService = userDetailsService;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        //ToDo aan Charlotte vragen of dit oke is
        http.csrf(AbstractHttpConfigurer::disable);
        http.cors(cors -> cors.configurationSource(corsConfigurationSource));


        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login.html", "/css/**", "/js/**").permitAll()
                        .requestMatchers("/invulPagStudie.html").hasAnyRole("STUDIE", "ADMIN")
                        .requestMatchers("/dashboard.html").hasAnyRole("ALGEMEEN", "STUDIE", "ADMIN", "PROTOCOLMAKER")
                        .requestMatchers("/dashboard2.html").hasAnyRole("ALGEMEEN", "STUDIE", "ADMIN", "PROTOCOLMAKER")
                        .requestMatchers("/protocol.html").hasAnyRole("PROTOCOLMAKER", "ADMIN")
                        .requestMatchers("/admin.html").hasRole("ADMIN")
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

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }
}
