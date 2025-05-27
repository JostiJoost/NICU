package org.example.user;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

/**
 * Repository voor user entiteiten
 * De Spring JPA om gebruikers te beheren in de database.
 * Spring genereert automatisch de queries.
 *
 * @author Anne Beumer
 * @version 1.4, 22-05-2025
 * @since 09-15-2025
 */
public interface UserRepository extends JpaRepository<User, Long>{
    /**
     * Zoekt een gebruiker op basis van gebruikersnaam
     *
     * @param username gebruikersnaam
     * @return een optional met de gebruiker, als deze er is
     */
    Optional<User> findByUsername(String username);

    /**
     * Haalt alle gebruikers op met een specifieke rol.
     *
     * @param role de rol
     * @return een lijst met gebruikers met die rol
     */
    List<User> findAllByRole(String role);

    /**
     * Zoekt een gebruiker op basis van studienaam.
     *
     * @param studie naam van de studie
     * @return een optional met de gebruikers, als deze er zijn
     */
    Optional<User> findByStudie(String studie);
}
