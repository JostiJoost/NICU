package org.example.user;

/**
 * DTO voor het aanmaken van een nieuwe studiegebruiker. Voor het ontvangen van gebruikersdata vanuit de frontend of API.
 *
 * @author Anne Beumer
 * @version 1.0, 17-05-2025
 * @since 17-05-2025
 */
public class UserCreationDTO {

    /**
     * De naam van de studie die gekoppeld is aan de login.
     */
    public String studieNaam;

    /**
     * Geeft aan of er een doorlooptijd geregistreerd moet worden voor de juridische fase
     * Gekozen voor Boolean in plaats van boolean, omdat de waarde ook null moest kunnen zijn.
     */
    public Boolean doorlooptijdJuridisch;

    /**
     * Geeft aan of er een doorlooptijd geregistreerd moet worden voor de apotheek fase.
     */
    public Boolean doorlooptijdApotheek;

    /**
     * Geeft aan of er een doorlooptijd geregistreerd moet worden voor de METC fase.
     */
    public Boolean doorlooptijdMetc;

    /**
     * Geeft aan of er een doorlooptijd geregistreerd moet worden voor de laboratorium fase.
     */
    public Boolean doorlooptijdLaboratorium;
}
