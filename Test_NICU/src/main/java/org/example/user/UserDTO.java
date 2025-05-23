package org.example.user;

import lombok.Getter;
import lombok.Setter;

/**
 * DTO voor het overdragen van gebruikersinfo aan de frontend.
 * De DTO bevat allen de relevante en veilige velden, dus bewust geen wachtwoord.
 *
 * @author Anne Beumer
 * @version 1.0
 * @since 23-05-2025
 */
public class UserDTO {
    /**
     * Gebruikersnaam van de ingelogde gebruiker.
     */
    @Getter
    @Setter
    private String username;

    /**
     * De rol van de gebruiker (studie, protocolmaker, algemeen of admin)
     */
    @Getter
    @Setter
    private String role;

    /**
     * Naam van de studie van de ingelogde gebruiker
     */
    @Getter
    @Setter
    private String studie;
}
