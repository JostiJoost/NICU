package org.example.security;

import org.example.user.User;
import org.example.user.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * Implementatie voor Spring security authenticatie.
 * Deze service haalt gebruikersgegevens op uit de database via de userRepository en zet deze om in een bruikbaar object voor Spring Security.
 *
 * @author Anne Beumer
 * @version 1.2, 15-05-2025
 * @since 09-05-2025
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    /**
     * Constructor die de userRepository implementeerd.
     * @param userRepository repository voor de gebruikersdata
     */
    public CustomUserDetailsService(UserRepository userRepository){
        this.userRepository = userRepository;

    }

    /**
     * Laadt een gebruiker op basis van de gebruikersnaam.
     * @param username gebruikersnaam
     * @return object met gebruikersgegevens
     * @throws UsernameNotFoundException als de gebruiker niet gevonden wordt
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        User user = userRepository.findByUsername(username) .orElseThrow(() -> new UsernameNotFoundException("Gebruiker niet gevonden"));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.isEnabled(),
                true,
                true,
                true,
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}
