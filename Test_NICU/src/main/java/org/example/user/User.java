package org.example.user;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;

/**
 * Entiteit die een gebruiker van het systeem representeert.
 * De class wordt gebruikt door Spring Security voor authenticatie en authorisatie.
 * Gekoppeld aan de users tabel in de database.
 *
 * @author Anne Beumer
 * @version 1.3, 17-05-2025
 * @since 09-05-2025
 */
@Entity
@Table(name="users")
public class User {

    /**
     * Primaire sleutel van de gebruiker.
     * Automatisch gegenereerd in de database.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    private Long id;

    /**
     * Unieke gebruikersnaam
     */
    @Column(nullable = false, unique = true)
    @Getter
    @Setter
    private String username;

    /**
     * Gehasht wachtwoord.
     */
    @Column(nullable = false)
    @Getter
    @Setter
    private String password;

    /**
     * Gebruikers rol (studie, protocolmaker, algemeen of admin)
     */
    @Column(nullable = false)
    @Getter
    @Setter
    private String role;

    /**
     * Naam van de studie die aan de gebruiker is gekoppeld (alleen bij rol studie, anders null)
     */
    @Column(name = "studie_naam")
    @Getter
    @Setter
    private String studie;

    /**
     * Geeft aan of het account nog actief is.
     */
    @Column(nullable = false)
    @Getter
    @Setter
    private boolean enabled = true;

    /**
     * Geeft aan of de juridische fase van toepassing is voor de gekoppelde studie.
     */
    @Getter
    @Setter
    @Column(name="doorlooptijd_juridisch")
    private Boolean doorlooptijdJuridisch;

    /**
     * Geeft aan of de apotheek fase van toepassing is voor de gekoppeld studie.
     */
    @Getter
    @Setter
    @Column(name="doorlooptijd_apotheek")
    private Boolean doorlooptijdApotheek;

    /**
     * Geeft aan of de METC fase van toepassing is voor de gekoppelde studie.
     */
    @Getter
    @Setter
    @Column(name="doorlooptijd_metc")
    private Boolean doorlooptijdMetc;

    /**
     * Geeft aan of de laboratorium fase van toepassing is voor de gekoppelde studie.
     */
    @Getter
    @Setter
    @Column(name="doorlooptijd_laboratorium")
    private Boolean doorlooptijdLaboratorium;

    /**
     * Geeft de rollen van de gebruiker terug zodat Spring Security deze kan gebruiken voor toegangscontrole.
     * @return lijst met authorisatie op basis van de rol.
     */
    public Collection<? extends GrantedAuthority> getAuthorities(){
        return List.of(new SimpleGrantedAuthority(role));
    }

}
