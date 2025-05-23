package org.example.inclusie;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

/**
 * DTO voor inclusiegegevens per studie en centrum
 * Voor het retourneren van de meest recente inclusiegegevens naar de frontend
 *
 * @author Joost Goddijn
 * @version 1.0
 * @since 15-05-205
 */
public class InclusionDTO {

    /**
     * Naam van de studie waarvoor de inclusie geldt.
     */
    @Getter
    @Setter
    private String naamStudie;

    /**
     * Naam van het centrum waar de inclusie heeft plaatsgevonden.
     */
    @Getter
    @Setter
    private String naamCentrum;

    /**
     * Datum waarop de registratie van het aantal geïncludeerde kinderen is gedaan.
     */
    @Getter
    @Setter
    private LocalDate datum;

    /**
     * Het aantal geïncludeerde kinderen op de opgegeven datum.
     */
    @Getter
    @Setter
    private int geincludeerd;

    /**
     * Constructor voor het instellen van alle velden van de DTO
     *
     * @param naamStudie naam van de studie
     * @param naamCentrum naam van het centrum
     * @param datum datum van registratie
     * @param geincludeerd aantal kinderen geincludeerd
     */
    public InclusionDTO(String naamStudie, String naamCentrum, LocalDate datum, int geincludeerd) {
        this.naamStudie = naamStudie;
        this.naamCentrum = naamCentrum;
        this.datum = datum;
        this.geincludeerd = geincludeerd;
    }

}
