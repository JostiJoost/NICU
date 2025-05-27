package org.example.inclusie;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Entiteit class die het aantal geïncludeerde kinderen per studie en centrum op een bepaald datum representeert.
 * Gekoppeld aan database tabel 'aantal_geincludeerd'.
 *
 * @author Joost Goddijn
 * @version 1.2, 15-05-2025
 * @since 14-05-2025
 */
@Entity
@IdClass(InclusionId.class)
@Table(name = "aantal_geincludeerd")
public class Inclusion {

    /**
     * Naam van de studie waarvoor inclusies zijn geregistreerd (primaire sleutel)
     */
    @Getter
    @Setter
    @Id
    String naam_studie;

    /**
     * Naam van het centrum waar de inclusies hebben plaatsgevonden.
     */
    @Getter
    @Setter
    @Id
    String naam_centrum;

    /**
     * Datum waarop het aantal geïncludeerde kinderen is geregistreerd.
     */
    @Getter
    @Setter
    LocalDate datum;

    /**
     * Aantal geïncludeerde kinderen op de betreffende datum.
     */
    @Getter
    @Setter
    int geincludeerd;

}
